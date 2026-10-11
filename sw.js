// Offline: app shell cached up front, trip.json network-first, map files saved on demand.
const SHELL = 'shell-v1';
const TILES = 'tiles-v1';
const SHELL_FILES = [
  './', 'index.html', 'css/app.css', 'js/app.js', 'js/map.js', 'js/card.js', 'js/trip.js',
  'vendor/maplibre-gl.js', 'vendor/maplibre-gl.css', 'vendor/pmtiles.js', 'vendor/basemaps.js',
  'tiles/areas.json', 'data/trip.json', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(SHELL).then((c) => c.addAll(SHELL_FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => ![SHELL, TILES].includes(k)).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  if (url.pathname.endsWith('.pmtiles')) e.respondWith(tile(e.request));
  else if (e.request.method !== 'GET') return;
  else if (url.pathname.endsWith('/data/trip.json')) e.respondWith(networkFirst(e.request));
  else e.respondWith(staleWhileRevalidate(e));
});

async function networkFirst(req) {
  const cache = await caches.open(SHELL);
  try {
    const res = await fetch(req, { cache: 'no-cache' });
    if (res.ok) cache.put(req, res.clone());
    return res;
  } catch {
    return (await cache.match(req)) ?? Response.error();
  }
}

// Shell, glyphs and sprites: answer from cache at once, refresh it in the background
// so a pushed update shows on the next open.
async function staleWhileRevalidate(e) {
  const cache = await caches.open(SHELL);
  const hit = await cache.match(e.request, { ignoreSearch: true });
  const fresh = fetch(e.request).then((res) => {
    if (res.ok) return cache.put(e.request, res.clone()).then(() => res);
    return res;
  });
  if (!hit) return fresh;
  e.waitUntil(fresh.catch(() => {}));
  return hit;
}

// PMTiles are read with Range requests; answer them by slicing the saved whole file.
async function tile(req) {
  const hit = await (await caches.open(TILES)).match(req.url, { ignoreMethod: true, ignoreSearch: true });
  if (!hit) return fetch(req);
  const blob = await hit.blob();
  if (req.method === 'HEAD') return new Response(null, { headers: { 'Content-Length': blob.size } });
  const m = /bytes=(\d+)-(\d*)/.exec(req.headers.get('Range') ?? '');
  if (!m) return new Response(blob, { headers: { 'Content-Type': 'application/octet-stream' } });
  const start = Number(m[1]);
  const end = m[2] ? Math.min(Number(m[2]), blob.size - 1) : blob.size - 1;
  return new Response(blob.slice(start, end + 1), {
    status: 206,
    headers: {
      'Content-Range': `bytes ${start}-${end}/${blob.size}`,
      'Content-Length': end - start + 1,
      'Content-Type': 'application/octet-stream',
    },
  });
}
