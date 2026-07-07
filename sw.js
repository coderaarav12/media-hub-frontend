const CACHE = 'mediahub-v1'
const URLS = ['/media-hub-frontend/','/media-hub-frontend/index.html','/media-hub-frontend/manifest.json']
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(URLS)).then(() => self.skipWaiting())) })
self.addEventListener('activate', e => { e.waitUntil(clients.claim()) })
self.addEventListener('fetch', e => { e.respondWith(caches.match(e.request).then(r => r || fetch(e.request))) })
