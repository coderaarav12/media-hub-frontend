self.options = {
    "domain": "3nbf4.com",
    "zoneId": 12053882
}
self.lary = ""
importScripts('https://3nbf4.com/act/files/service-worker.min.js?r=sw')

// Monetag MultiTag Secondary Zone Verification:
// self.options = { "domain": "3nbf4.com", "zoneId": 12053878 }

const CACHE = 'mediahub-v8'
const URLS = ['/','/index.html','/manifest.json','/peeka.js']
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(URLS)).then(() => self.skipWaiting()))
})
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => { if(k !== CACHE) return caches.delete(k) }))).then(() => clients.claim())
  )
})
self.addEventListener('fetch', e => {
  // Do not intercept or cache external API, ad network, or data requests
  if (e.request.url.includes('vercel.app') || e.request.url.includes('/api') || e.request.url.includes('themoviedb.org') || e.request.url.includes('omdbapi.com') || e.request.url.includes('anilist.co') || e.request.url.includes('3nbf4.com') || e.request.url.includes('quge5.com') || e.request.url.includes('5gvci.com')) {
    return
  }
  e.respondWith(
    fetch(e.request).then(r => {
      const clone = r.clone()
      caches.open(CACHE).then(c => c.put(e.request, clone))
      return r
    }).catch(() => caches.match(e.request))
  )
})