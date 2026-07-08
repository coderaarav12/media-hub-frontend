const CACHE = 'mediahub-v2'
const URLS = ['/','/index.html','/manifest.json']
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(URLS)).then(() => self.skipWaiting()))
})
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => { if(k !== CACHE) return caches.delete(k) }))).then(() => clients.claim())
  )
})
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).then(r => {
      const clone = r.clone()
      caches.open(CACHE).then(c => c.put(e.request, clone))
      return r
    }).catch(() => caches.match(e.request))
  )
})