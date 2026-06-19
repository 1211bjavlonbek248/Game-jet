const CACHE_NAME = "jet-game-v1";

const FILES = [
  "/",
  "/index.html",
  "/style.css",
  "/script.js",
  "/plane.png",
  "/sound.mp3"
];

// install - hammasini yuklab cache qiladi
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES);
    })
  );
});

// fetch - internet bo‘lmasa ham cache dan beradi
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});