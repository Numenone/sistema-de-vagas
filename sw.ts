import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'
import { registerRoute } from 'workbox-routing'
import { StaleWhileRevalidate} from 'workbox-strategies'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'

/// <reference types="vite/client" />

declare let self: ServiceWorkerGlobalScope

// self.__WB_MANIFEST is a placeholder that will be replaced by the
// vite-plugin-pwa with a list of all your assets to cache.
precacheAndRoute(self.__WB_MANIFEST)

cleanupOutdatedCaches()

// This allows the new service worker to take control of the page as soon as it's activated.
self.skipWaiting()
clientsClaim()

// --- Runtime Caching ---

// Estratégia para chamadas de API: Tenta a rede primeiro, mas se estiver offline,
// usa o cache. Armazena no cache apenas respostas bem-sucedidas (status 2xx).
const apiUrl = import.meta.env.VITE_API_URL;
registerRoute(
  ({ url }) => url.href.startsWith(apiUrl),
  new StaleWhileRevalidate({
    cacheName: 'api-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [200, 201], // Armazena apenas respostas bem-sucedidas
      }),
    ],
  })
);

self.addEventListener('push', (event: PushEvent) => {
  const data = event.data?.json()

  const options = {
    body: data.body,
    icon: data.icon || '/icon-192x192.png', // Fallback icon
    badge: '/badge.png',
    data: {
      url: data.data.url,
    },
  }

  event.waitUntil(self.registration.showNotification(data.title, options))
})

self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close()
  const urlToOpen = new URL(event.notification.data.url, self.location.origin).href

  event.waitUntil(self.clients.openWindow(urlToOpen))
})