// No-op service worker.
// Prevents the 404 (and the 15s browser-timeout) caused by external probes
// (DevTools PWA panel, Vercel Toolbar, browser extensions, headless tests)
// that auto-request /sw.js on any localhost dev server.
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", () => {
  // Pass-through: do not intercept any network requests.
});
