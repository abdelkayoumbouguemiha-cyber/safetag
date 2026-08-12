// SafeTag service worker — minimal setup for PWA installability + future push notifications

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Placeholder for future push notification handling (Milestone 4)
self.addEventListener("push", (event) => {
  // Will be implemented when we build the notification pipeline
});
