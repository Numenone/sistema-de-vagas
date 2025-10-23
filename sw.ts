import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'
import { registerRoute } from 'workbox-routing'
import { StaleWhileRevalidate } from 'workbox-strategies'

declare let self: ServiceWorkerGlobalScope

// self.__WB_MANIFEST is a placeholder that will be replaced by the
// vite-plugin-pwa with a list of all your assets to cache.
precacheAndRoute(self.__WB_MANIFEST)

cleanupOutdatedCaches()

// This allows the new service worker to take control of the page as soon as it's activated.
self.skipWaiting()
clientsClaim()

// Runtime caching for API calls
const apiUrl = import.meta.env.VITE_API_URL;
registerRoute(
  ({ url }) => url.href.startsWith(apiUrl),
  new StaleWhileRevalidate({
    cacheName: 'api-cache',
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