import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching'

declare let self: ServiceWorkerGlobalScope

// self.__WB_MANIFEST is a placeholder that will be replaced by the
// vite-plugin-pwa with a list of all your assets to cache.
precacheAndRoute(self.__WB_MANIFEST)

cleanupOutdatedCaches()

self.addEventListener('push', (event) => {
  const data = event.data.json()

  const options = {
    body: data.body,
    icon: data.icon,
    badge: '/badge.png',
    data: {
      url: data.data.url,
    },
  }

  event.waitUntil(self.registration.showNotification(data.title, options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const urlToOpen = new URL(event.notification.data.url, self.location.origin).href

  event.waitUntil(self.clients.openWindow(urlToOpen))
})