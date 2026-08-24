self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "SafeTag";
  const options = {
    body: data.body || "Your child's bracelet was scanned.",
    icon: "/icons/icon-192.png",
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
