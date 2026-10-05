
const IMG = 'https://image.tmdb.org/t/p'
let currentItem = null, currentSeason = 1, currentSources = [], currentSourceIdx = 0, trendData = []

const $ = id => document.getElementById(id)

$('searchInput').addEventListener('keydown', e => { if(e.key === 'Enter') { $('desktopAcDropdown')?.classList.remove('active'); triggerSearch() } })
$('searchInput').addEventListener('search', () => { if($('searchInput').value) { $('desktopAcDropdown')?.classList.remove('active'); triggerSearch() } })
$('searchInputMobile').addEventListener('keydown', e => { if(e.key === 'Enter') { $('mobileAcDropdown')?.classList.remove('active'); triggerMobileSearch() } })

let acTimeout;
async function fetchAutocomplete(q, type, dropdownId) {
  const dd = $(dropdownId);
  if (!q.trim()) { dd.classList.remove('active'); return; }
  dd.innerHTML = '<div class="ac-item" style="justify-content:center;color:var(--muted);background:none">Searching...</div>';
  dd.classList.add('active');
  try {
    let results = [];
    if (type === 'live') {
      const all = currentLiveChannels.length ? currentLiveChannels : []; 
      const lower = q.toLowerCase();
      results = all.filter(c => c.name.toLowerCase().includes(lower)).slice(0, 10);
    } else {
      const d = await fetchAPI(`/search?q=${encodeURIComponent(q)}&type=${type}`);
      if (d && d.results) {
        results = d.results.filter(x => x.media_type !== 'person' || !x.media_type).slice(0, 8);
      }
    }
    if (!results.length) {
      dd.innerHTML = '<div class="ac-item" style="justify-content:center;color:var(--muted);background:none">No results</div>';
      return;
    }
    let html = '';
    results.forEach(item => {
      if (type === 'live') {
        html += `<div class="ac-item" onclick="playLiveStream(${currentLiveChannels.indexOf(item)}); $('${dropdownId}').classList.remove('active')"><div class="ac-poster" style="background-image:url('${item.logo || 'https://placehold.co/42x62/1a1a2e/666/?text=TV'}')"></div><div class="ac-info"><div class="ac-title">${escapeHtml(item.name)}</div><div class="ac-meta"><span>LIVE</span></div></div></div>`;
      } else {
        let m = item.media_type || type;
        if (!['movie', 'tv', 'anime'].includes(m)) m = 'movie';
        const t = item.title || item.name || 'Untitled', date = item.release_date || item.first_air_date || '', y = date ? date.split('-')[0] : '';
        const p = item.poster_path ? IMG + '/w154' + item.poster_path : 'https://placehold.co/42x62/1a1a2e/666/?text=No+Img';
        html += `<a class="ac-item" href="#/${m}/${item.id}" onclick="$('${dropdownId}').classList.remove('active')"><div class="ac-poster" style="background-image:url('${p}')"></div><div class="ac-info"><div class="ac-title">${escapeHtml(t)}</div><div class="ac-meta"><span>${m.toUpperCase()}</span>${y ? `<span>${y}</span>` : ''}</div></div></a>`;
      }
    });
    dd.innerHTML = html;
  } catch (e) {
    dd.innerHTML = '<div class="ac-item" style="justify-content:center;color:var(--muted);background:none">Error fetching results</div>';
  }
}
$('searchInput').addEventListener('input', e => {
  clearTimeout(acTimeout);
  acTimeout = setTimeout(() => fetchAutocomplete(e.target.value, $('searchType').value, 'desktopAcDropdown'), 350);
});
$('searchInputMobile').addEventListener('input', e => {
  clearTimeout(acTimeout);
  acTimeout = setTimeout(() => fetchAutocomplete(e.target.value, $('searchTypeMobile').value, 'mobileAcDropdown'), 350);
});
document.addEventListener('click', e => {
  if (!e.target.closest('.search-wrap')) {
    $('desktopAcDropdown')?.classList.remove('active');
    $('mobileAcDropdown')?.classList.remove('active');
  }
});


// PWA Install
let installPrompt = null
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); installPrompt = e })
function installApp() {
  if(installPrompt) { installPrompt.prompt(); installPrompt.userChoice.then(() => { installPrompt = null }) }
  else { $('installOverlay').classList.add('active') }
}
window.addEventListener('appinstalled', () => { installPrompt = null })
function closeInstallGuide() { $('installOverlay').classList.remove('active') }
;(function() { if(!('ontouchstart' in window) && navigator.maxTouchPoints < 1) { var d = $('installDesktop'); if(d) d.style.display = 'inline'; var m = $('installMobile'); if(m) m.style.display = 'none' } })()

// Register service worker
if('serviceWorker' in navigator) { window.addEventListener('load', () => { navigator.serviceWorker.register('/sw.js').catch(() => {}) }) }

function toggleMobileSearch() { const m = $('mobileSearch'); m.classList.toggle('active'); if(m.classList.contains('active')) $('searchInputMobile').focus() }

function triggerMobileSearch() {
  const q = $('searchInputMobile').value.trim(), type = $('searchTypeMobile').value
  if(!q || !type) return
  $('searchInput').value = q; $('searchType').value = type
  $('mobileSearch').classList.remove('active')
  navigate('#/search?q=' + encodeURIComponent(q) + '&type=' + type)
}

function navigate(hash) {
  if(hash[0] !== '#') hash = '#' + hash
  if(location.hash !== hash) location.hash = hash; else handleRoute()
}
window.addEventListener('hashchange', handleRoute)

function handleRoute() {
  const hash = location.hash.slice(1) || '/', [path, qs] = hash.split('?'), parts = path.split('/').filter(Boolean)
  if(!parts[0]) renderHome()
  else if(parts[0] === 'movies' && !parts[1]) renderMoviesHome()
  else if(parts[0] === 'tv' && !parts[1]) renderTvHome()
  else if(parts[0] === 'anime' && !parts[1]) renderAnimeHome()
  else if(parts[0] === 'live') renderLiveTv()
  else if(parts[0] === 'search') { const p = new URLSearchParams(qs||''); renderSearch(p.get('q')||'', p.get('type')||'multi') }
  else if(['movie','tv','anime'].includes(parts[0])) renderDetail(parts[0], parts[1], parts[2]||null)
  else if(parts[0] === 'person') renderPerson(parts[1])
  else if(parts[0] === 'terms') renderTerms()
  else if(parts[0] === 'privacy') renderPrivacy()
  else renderHome()
}

function goHome() {
  document.querySelectorAll('.nav-links button').forEach(b => b.classList.remove('active'))
  document.querySelector('.nav-links button[data-filter="all"]')?.classList.add('active')
  if(trendType !== 'all') { trendType = 'all'; document.querySelectorAll('.trend-tabs button').forEach(b => b.classList.remove('active')); document.querySelector('.trend-tabs button')?.classList.add('active') }
  navigate('#/')
}

function navFilter(filter, btn) {
  document.querySelectorAll('.nav-links button').forEach(b => b.classList.remove('active'))
  btn.classList.add('active')
  if(filter === 'all') { navigate('#/') }
  else if(filter === 'movie') { navigate('#/movies') }
  else if(filter === 'tv') { navigate('#/tv') }
  else if(filter === 'anime') { navigate('#/anime') }
  else if(filter === 'live') { navigate('#/live') }
}

function triggerSearch() {
  const q = $('searchInput').value.trim(), type = $('searchType').value
  if(!q || !type) return; navigate('#/search?q=' + encodeURIComponent(q) + '&type=' + type)
}

function showHome() { $('homePage').style.display = 'block'; $('detailPage').style.display = 'none'; $('searchPage').style.display = 'none'; $('moviePage').style.display = 'none'; $('tvPage').style.display = 'none'; $('animePage').style.display = 'none'; $('livePage').style.display = 'none'; document.title = 'MediaHub' }
function showDetail() { $('homePage').style.display = 'none'; $('detailPage').style.display = 'block'; $('searchPage').style.display = 'none'; $('moviePage').style.display = 'none'; $('tvPage').style.display = 'none'; $('animePage').style.display = 'none'; $('livePage').style.display = 'none' }
function showSearch() { $('homePage').style.display = 'none'; $('detailPage').style.display = 'none'; $('searchPage').style.display = 'block'; $('moviePage').style.display = 'none'; $('tvPage').style.display = 'none'; $('animePage').style.display = 'none'; $('livePage').style.display = 'none' }
function showMovies() { $('homePage').style.display = 'none'; $('detailPage').style.display = 'none'; $('searchPage').style.display = 'none'; $('moviePage').style.display = 'block'; $('tvPage').style.display = 'none'; $('animePage').style.display = 'none'; $('livePage').style.display = 'none' }
function showTv() { $('homePage').style.display = 'none'; $('detailPage').style.display = 'none'; $('searchPage').style.display = 'none'; $('moviePage').style.display = 'none'; $('tvPage').style.display = 'block'; $('animePage').style.display = 'none'; $('livePage').style.display = 'none' }
function showAnime() { $('homePage').style.display = 'none'; $('detailPage').style.display = 'none'; $('searchPage').style.display = 'none'; $('moviePage').style.display = 'none'; $('tvPage').style.display = 'none'; $('animePage').style.display = 'block'; $('livePage').style.display = 'none' }
function showLive() { $('homePage').style.display = 'none'; $('detailPage').style.display = 'none'; $('searchPage').style.display = 'none'; $('moviePage').style.display = 'none'; $('tvPage').style.display = 'none'; $('animePage').style.display = 'none'; $('livePage').style.display = 'block' }

async function fetchAPI(path) { try { const r = await fetch(API_BASE + path); return await r.json() } catch(e) { return null } }

// --- Home ---
let trendType = 'all'
async function renderHome() {
  showHome(); document.title = 'MediaHub'
  const area = $('trendingArea'), spot = $('spotlightArea'), bento = $('bentoArea')
  area.innerHTML = '<div class="loading"><div class="spinner"></div></div>'
  trendData = (await fetchAPI('/trending?media=' + trendType))?.results?.slice(0, 20) || []
  if(!trendData.length) { area.innerHTML = ''; spot.innerHTML = ''; bento.innerHTML = ''; return }

  // Spotlight: first item
  const first = trendData[0]
  const bg = first.backdrop_path ? IMG + '/w1280' + first.backdrop_path : ''
  const poster = first.poster_path ? IMG + '/w342' + first.poster_path : ''
  const title = first.title || first.name || '', year = (first.release_date||first.first_air_date||'').split('-')[0]
  const rating = first.vote_average ? first.vote_average.toFixed(1) : '';
  let media = first.media_type || trendType;
  if (!['movie', 'tv', 'anime'].includes(media)) media = 'movie';
  const desc = first.overview || ''
  spot.innerHTML = `<div class="spotlight" onclick="navigate('#/${media}/${first.id}')">
    <div class="spotlight-bg" style="background-image:url('${bg||'https://placehold.co/1400x600/0a0a14/fff'}')"></div>
    <div class="spotlight-poster">
      <div class="poster-img" style="background-image:url('${poster||'https://placehold.co/342x513/0a0a14/fff/?text=No+Poster'}')"></div>
    </div>
    <div class="spotlight-info">
      <div class="spotlight-badge">Featured</div>
      <h1>${escapeHtml(title)}</h1>
      <div class="spotlight-meta">
        ${year ? '<span>'+year+'</span>' : ''}
        ${rating ? '<span class="rating">\u2605 '+rating+'</span>' : ''}
        <span>${media === 'movie' ? 'Movie' : 'TV'}</span>
      </div>
      <p class="spotlight-desc">${escapeHtml(desc)}</p>
      <div class="spotlight-actions">
        <button class="btn-play" onclick="event.stopPropagation();navigate('#/${media}/${first.id}')">\u25B6 View Details</button>
      </div>
    </div>
  </div>`

  // Bento grid: items 1-6 (first 2 wide, next 4 normal)
  const bentoItems = trendData.slice(1, 7)
  bento.innerHTML = '<div class="bento">' + bentoItems.map((item, i) => {
    const t = item.title || item.name || '', b = item.backdrop_path ? IMG + '/w780' + item.backdrop_path : ''
    const r2 = item.vote_average ? item.vote_average.toFixed(1) : '';
    let m = item.media_type || trendType;
    if (!['movie', 'tv', 'anime'].includes(m)) m = 'movie';
    const wide = i < 2
    const img = item.backdrop_path ? b : (item.poster_path ? IMG + '/w342' + item.poster_path : '')
    const cls = 'bento-card' + (wide ? ' bento-wide' : '')
    return `<div class="${cls}" onclick="navigate('#/${m}/${item.id}')" style="animation:fadeUp .4s ease ${i*0.06}s both">
      <div class="bg" style="background-image:url('${img||'https://placehold.co/800x400/0a0a14/fff'}')"></div>
      <div class="grad"></div>
      ${r2 ? '<span class="rating-badge">'+r2+'</span>' : ''}
      <div class="play-btn">\u25B6</div>
      <div class="content">
        <h3>${escapeHtml(t)}</h3>
        <p>${m === 'movie' ? 'Movie' : 'TV'}${item.release_date||item.first_air_date ? ' \u2022 '+(item.release_date||item.first_air_date).split('-')[0] : ''}</p>
      </div>
    </div>`
  }).join('') + '</div>'

  // Grid: rest
  const rest = trendData.slice(7)
  area.innerHTML = rest.length ? `<div class="grid">${rest.map((item, i) => {
    const t = item.title || item.name || '', p = item.poster_path ? IMG + '/w342' + item.poster_path : ''
    const r2 = item.vote_average ? item.vote_average.toFixed(1) : '', date = item.release_date||item.first_air_date||'', y = date ? date.split('-')[0] : '';
    let m = item.media_type || trendType;
    if (!['movie', 'tv', 'anime'].includes(m)) m = 'movie';
    return `<div class="card" style="--i:${i}" onclick="navigate('#/${m}/${item.id}')">
      <div class="poster" style="background-image:url('${p||'https://placehold.co/342x513/0a0a14/fff/?text=No+Poster'}')">
        ${r2 ? '<span class="rating">\u2605 '+r2+'</span>' : ''}
        <div class="hover-overlay"><div class="pbtn">\u25B6</div><span class="mtag">${m === 'movie' ? 'Movie' : 'TV'}</span></div>
      </div>
      <div class="info"><h3>${escapeHtml(t)}</h3><p>${y?y+' ':' '}${m === 'movie' ? '\u2022 Movie' : '\u2022 TV'}</p></div>
    </div>`
  }).join('')}</div>` : ''

  // Latest Releases
  const latest = $('latestArea')
  latest.innerHTML = '<div class="loading"><div class="spinner" style="width:28px;height:28px"></div></div>'
  const movieTrend = await fetchAPI('/trending?media=movie')
  const movies = (movieTrend?.results || []).slice(0, 12)
  if(movies.length) {
    latest.innerHTML = `<div class="grid">${movies.map((item, i) => {
      const t = item.title || item.name || '', p = item.poster_path ? IMG + '/w342' + item.poster_path : ''
      const r2 = item.vote_average ? item.vote_average.toFixed(1) : '', date = item.release_date||'', y = date ? date.split('-')[0] : ''
      return `<div class="card" style="--i:${i}" onclick="navigate('#/movie/${item.id}')">
        <div class="poster" style="background-image:url('${p||'https://placehold.co/342x513/0a0a14/fff/?text=No+Poster'}')">
          ${r2 ? '<span class="rating">\u2605 '+r2+'</span>' : ''}
          <div class="hover-overlay"><div class="pbtn">\u25B6</div><span class="mtag">Movie</span></div>
        </div>
        <div class="info"><h3>${escapeHtml(t)}</h3><p>${y ? y+' \u2022 ' : ''}Movie</p></div>
      </div>`
    }).join('')}</div>`
  } else { latest.innerHTML = '' }
}

// --- Category Pages ---
function renderMediaGrid(data, mediaType) {
  if(!data || !data.results || !data.results.length) return '<div class="loading"><p style="color:var(--muted)">No results</p></div>'
  return '<div class="grid">' + data.results.map((item, i) => {
    const t = item.title || item.name || 'Untitled', date = item.release_date || item.first_air_date || '', y = date ? date.split('-')[0] : ''
    const rt = item.vote_average ? '\u2605 ' + item.vote_average.toFixed(1) : '', poster = item.poster_path ? IMG + '/w342' + item.poster_path : ''
    return '<div class="card" style="--i:' + i + '" onclick="navigate(\'#/' + mediaType + '/' + item.id + '\')"><div class="poster" style="background-image:url(\'' + (poster || 'https://placehold.co/342x513/0a0a14/fff/?text=No+Poster') + '\')">' + (rt ? '<span class="rating">' + rt + '</span>' : '') + '<div class="hover-overlay"><div class="pbtn">\u25B6</div><span class="mtag">' + (mediaType === 'movie' ? 'Movie' : 'TV') + '</span></div></div><div class="info"><h3>' + escapeHtml(t) + '</h3><p>' + y + ' \u2022 ' + (mediaType === 'movie' ? 'Movie' : 'TV') + '</p></div></div>'
  }).join('') + '</div>'
}

async function renderMoviesHome() {
  showMovies(); document.title = 'Movies - MediaHub'
  const trendArea = $('movieTrendingArea'), popArea = $('moviePopularArea')
  trendArea.innerHTML = '<div class="loading"><div class="spinner"></div></div>'
  popArea.innerHTML = '<div class="loading"><div class="spinner"></div></div>'
  const [trend, popular] = await Promise.all([fetchAPI('/trending?media=movie'), fetchAPI('/movie/popular')])
  trendArea.innerHTML = renderMediaGrid(trend, 'movie')
  popArea.innerHTML = renderMediaGrid(popular, 'movie')
}

async function renderTvHome() {
  showTv(); document.title = 'TV Shows - MediaHub'
  const trendArea = $('tvTrendingArea'), popArea = $('tvPopularArea')
  trendArea.innerHTML = '<div class="loading"><div class="spinner"></div></div>'
  popArea.innerHTML = '<div class="loading"><div class="spinner"></div></div>'
  const [trend, popular] = await Promise.all([fetchAPI('/trending?media=tv'), fetchAPI('/tv/popular')])
  const noAnime = d => d && d.results ? { ...d, results: d.results.filter(r => !r.genre_ids?.includes(16)) } : d
  trendArea.innerHTML = renderMediaGrid(noAnime(trend), 'tv')
  popArea.innerHTML = renderMediaGrid(noAnime(popular), 'tv')
}

// --- Anime Home ---
async function renderAnimeHome() {
  showAnime(); document.title = 'Anime - MediaHub'
  const trendArea = $('animeTrendingArea'), popArea = $('animePopularArea')
  trendArea.innerHTML = '<div class="loading"><div class="spinner"></div></div>'
  popArea.innerHTML = '<div class="loading"><div class="spinner"></div></div>'

  const trend = await fetchAPI('/anime/trending')
  const popular = await fetchAPI('/anime/popular')

  function renderAnimeGrid(data) {
    if(!data || !data.media || !data.media.length) return '<div class="loading"><p style="color:var(--muted)">No anime found</p></div>'
    return '<div class="grid">' + data.media.map((item, i) => {
      const t = item.title?.romaji || item.title?.english || item.title?.native || 'Untitled', img = item.coverImage?.large || ''
      return '<div class="card" style="--i:' + i + '" onclick="navigate(\'#/anime/' + item.id + '\')"><div class="poster" style="background-image:url(\'' + (img || 'https://placehold.co/342x513/0a0a14/fff/?text=No+Poster') + '\')">' + (item.averageScore ? '<span class="rating">\u2605 ' + (item.averageScore/10).toFixed(1) + '</span>' : '') + (item.episodes ? '<span class="eps-badge">' + item.episodes + ' eps</span>' : '') + '<div class="hover-overlay"><div class="pbtn">\u25B6</div></div></div><div class="info"><h3>' + escapeHtml(t) + '</h3><p>' + (item.format||'Anime') + (item.season ? ' \u2022 ' + item.season : '') + '</p></div></div>'
    }).join('') + '</div>'
  }

  trendArea.innerHTML = renderAnimeGrid(trend)
  popArea.innerHTML = renderAnimeGrid(popular)
}

// --- Live TV ---
const LIVE_CATEGORIES = [
  { id: 'news', name: 'News' },
  { id: 'sports', name: 'Sports' },
  { id: 'entertainment', name: 'Entertainment' },
  { id: 'movies', name: 'Movies' },
  { id: 'music', name: 'Music' },
  { id: 'kids', name: 'Kids' },
  { id: 'general', name: 'General' },
  { id: 'documentary', name: 'Documentary' },
  { id: 'education', name: 'Education' },
]

const LIVE_SOURCES = [
  { id: 'iptv-org', name: 'iptv-org', categoryUrl: cat => `https://iptv-org.github.io/iptv/categories/${cat}.m3u` },
  { id: 'freetv', name: 'Free-TV', url: 'https://raw.githubusercontent.com/Free-TV/IPTV/master/playlist.m3u8' },
  { id: 'iptv-org-us', name: 'US Streams', url: 'https://raw.githubusercontent.com/iptv-org/iptv/master/streams/us.m3u' },
  { id: 'youtube', name: 'YouTube' },
]

// YouTube live streams for news channels (channel name ΓåÆ channel ID)
// Uses /embed/live_stream?channel=CHANNEL_ID which always shows the current live stream
const YOUTUBE_NEWS = {
  'bbc news': 'UC16niRr50-MSBwiO3YDb3RA',
  'bbc world news': 'UC16niRr50-MSBwiO3YDb3RA',
  'cnn': 'UCupvZG-5ko_eiXAupbDfxWw',
  'al jazeera': 'UCNye-wNBqNL5ZzHSJj3l8Bg',
  'sky news': 'UCoMdktPbSTixAyNGwb-UYkQ',
  'france 24': 'UCQfwfsi5VrQ8yKZ-UWmAEFg',
  'dw news': 'UCknLrEdhRCp1aegoMqRaCZg',
  'reuters': 'UChqUTb7kYRX8-EiaN3XFrSQ',
  'euronews': 'UCSrZ3UV4jOidv8ppoVuvW9Q',
  'wion': 'UC_gUM8rL-Lrg6O3adPW9K1g',
  'ndtv': 'UCZFMm1mMw0F81Z37aaEzTUA',
  'india today': 'UCYPvAwZP8pZhSMW8qs7cVCw',
  'republic tv': 'UCwqusr8YDwM-3mEYTDeJHzw',
  'times now': 'UC6RJ7-PaXg6TIH2BzZfTV7w',
  'nbc news': 'UCeY0bbntWzzVIaj2z3QigXg',
  'abc news': 'UCBi2mrWuNuyYy4gbM6fU18Q',
  'cbs news': 'UC8p1vwvWtl6T73JiExfWs1g',
  'aaj tak': 'UCt4t-jeY85JegMlZ-E5UWtA',
}

let liveHls = null, currentLiveChannels = [], currentLiveIdx = 0, currentLiveSourceIdx = 0

function parseM3U(text) {
  const channels = []
  const lines = text.split('\n')
  for(let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if(!line.startsWith('#EXTINF:')) continue
    const info = line.slice(8)
    let name = info
    const logoMatch = info.match(/tvg-logo="([^"]*)"/)
    const logo = logoMatch ? logoMatch[1] : ''
    const groupMatch = info.match(/group-title="([^"]*)"/)
    const group = groupMatch ? groupMatch[1] : ''
    const nameMatch = info.match(/,(.+)$/)
    if(nameMatch) name = nameMatch[1].trim()
    name = name.replace(/\s*\([\d]+p\)/gi, '').replace(/\s*\[.*?\]/g, '').trim()
    let j = i + 1;
    let urlLine = null;
    while(j < lines.length) {
      const lineText = lines[j].trim();
      if(!lineText) { j++; continue; }
      if(!lineText.startsWith('#')) {
        urlLine = lineText;
        break;
      }
      if(lineText.startsWith('#EXTINF:')) {
        break; // Next channel started without a URL for the previous one
      }
      j++;
    }
    if(urlLine) {
      channels.push({ name, url: urlLine, logo, group })
    }
  }
  return channels
}

function normalizeChName(name) {
  return name.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim()
}

function mergeChannelLists(baseChannels, extraLists) {
  const map = new Map()
  for (const ch of baseChannels) {
    const key = normalizeChName(ch.name)
    if (!key) continue
    map.set(key, { name: ch.name, logo: ch.logo, group: ch.group, sources: [{ url: ch.url, sourceId: 'iptv-org' }] })
  }
  for (const { sourceId, channels } of extraLists) {
    for (const ch of channels) {
      const key = normalizeChName(ch.name)
      if (!key || !map.has(key)) continue
      const entry = map.get(key)
      if (!entry.sources.some(s => s.url === ch.url)) {
        entry.sources.push({ url: ch.url, sourceId })
      }
    }
  }
  return Array.from(map.values())
}

let sourceCache = {}, liveChannelsCache = {}

async function ensureSourceCached(sourceId) {
  if (sourceCache[sourceId]) return sourceCache[sourceId]
  const src = LIVE_SOURCES.find(s => s.id === sourceId)
  if (!src || !src.url) return []
  try {
    const r = await fetch(src.url)
    if (!r.ok) return []
    const text = await r.text()
    const channels = parseM3U(text)
    sourceCache[sourceId] = channels
    return channels
  } catch(e) { return [] }
}

async function renderLiveTv() {
  showLive()
  document.title = 'Live TV - MediaHub'
  const cats = $('liveCats'), area = $('liveArea')
  cats.innerHTML = LIVE_CATEGORIES.map((c, i) =>
    '<button class="' + (i === 0 ? 'active' : '') + '" onclick="loadLiveCategory(\'' + c.id + '\',this)">' + c.name + '</button>'
  ).join('')
  loadLiveCategory(LIVE_CATEGORIES[0].id)
}

async function loadLiveCategory(cat, btn) {
  if(btn) {
    document.querySelectorAll('.live-cats button').forEach(b => b.classList.remove('active'))
    btn.classList.add('active')
  }
  const area = $('liveArea')
  if(liveChannelsCache[cat]) {
    currentLiveChannels = liveChannelsCache[cat]
    renderLiveChannels(currentLiveChannels)
    return
  }
  area.innerHTML = '<div class="loading"><div class="spinner"></div></div>'
  try {
    const r = await fetch('https://iptv-org.github.io/iptv/categories/' + cat + '.m3u')
    if(!r.ok) { area.innerHTML = '<div class="loading"><p style="color:var(--muted)">Failed to load channels</p></div>'; return }
    const text = await r.text()
    const baseChannels = parseM3U(text)
    const [freetvCh, usCh] = await Promise.all([ensureSourceCached('freetv'), ensureSourceCached('iptv-org-us')])
    const merged = mergeChannelLists(baseChannels, [
      { sourceId: 'freetv', channels: freetvCh },
      { sourceId: 'iptv-org-us', channels: usCh }
    ])
    if (cat === 'news') {
      const entries = Object.entries(YOUTUBE_NEWS).sort((a, b) => b[0].length - a[0].length)
      for (const ch of merged) {
        const key = normalizeChName(ch.name)
        for (const [pattern, channelId] of entries) {
          const match = pattern.includes(' ')
            ? new RegExp('^' + pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(\\s|$)').test(key)
            : key === pattern
          if (match) {
            if (!ch.sources.some(s => s.sourceId === 'youtube')) {
              ch.sources.push({ url: 'https://www.youtube.com/embed/live_stream?channel=' + channelId + '&autoplay=1', sourceId: 'youtube' })
            }
            break
          }
        }
      }
    }
    liveChannelsCache[cat] = merged
    currentLiveChannels = merged
    renderLiveChannels(merged)
  } catch(e) {
    area.innerHTML = '<div class="loading"><p style="color:var(--muted)">Error loading channels</p></div>'
  }
}

function renderLiveChannels(channels) {
  const area = $('liveArea')
  if(!channels.length) {
    area.innerHTML = '<div class="loading"><p style="color:var(--muted)">No channels found</p></div>'
    return
  }
  const sorted = [...channels].sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
  const groups = {}
  for (const ch of sorted) {
    const letter = ch.name.charAt(0).toUpperCase()
    if (!groups[letter]) groups[letter] = []
    groups[letter].push(ch)
  }
  const letters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let html = '<div class="results-info" style="margin-bottom:4px">' + channels.length + ' channels</div>'
  for (const letter of letters) {
    if (!groups[letter]) continue
    html += '<div class="ch-letter-header" id="ch-letter-' + letter + '">' + letter + '</div><div class="live-channel-grid">'
    for (const ch of groups[letter]) {
      const srcLabel = ch.sources.length > 1 ? '<span class="ch-src-badge">' + ch.sources.length + ' sources</span>' : ''
      html += '<div class="live-channel-card" onclick="playLiveStream(' + sorted.indexOf(ch) + ')">' +
        (ch.logo ? '<img class="ch-logo" src="' + ch.logo + '" alt="" loading="lazy" onerror="this.style.display=\'none\'">' : '') +
        '<div class="ch-name">' + escapeHtml(ch.name) + '</div>' +
        srcLabel +
        '</div>'
    }
    html += '</div>'
  }
  currentLiveChannels = sorted
  area.innerHTML = html
}

function getSourceLabel(id) {
  const src = LIVE_SOURCES.find(s => s.id === id)
  return src ? src.name : id
}

function playLiveStream(idx) {
  const ch = currentLiveChannels[idx]
  if (!ch) return
  currentLiveIdx = idx
  currentLiveSourceIdx = 0
  $('playerOverlay').classList.add('active')
  $('playerTitle').textContent = ch.name + ' | Live TV'
  $('playerFrame').style.display = 'none'
  $('livePlayer').style.display = 'block'
  $('playerFrame').src = ''
  const tabs = $('sourceTabs')
  if (ch.sources.length > 1) {
    tabs.innerHTML = ch.sources.map((s, i) =>
      '<button class="' + (i === 0 ? 'active' : '') + '" onclick="switchLiveSource(' + i + ',this)">' + getSourceLabel(s.sourceId) + (i === 0 ? ' (Auto)' : '') + '</button>'
    ).join('')
  } else {
    tabs.innerHTML = ''
  }
  loadLiveSource(ch.sources[0].url)
}

function switchLiveSource(srcIdx, btn) {
  if (btn) {
    document.querySelectorAll('#sourceTabs button').forEach(b => b.classList.remove('active'))
    btn.classList.add('active')
  }
  currentLiveSourceIdx = srcIdx
  const ch = currentLiveChannels[currentLiveIdx]
  if (ch && ch.sources[srcIdx]) loadLiveSource(ch.sources[srcIdx].url)
}

function loadLiveSource(url) {
  if(liveHls) { liveHls.destroy(); liveHls = null }
  const video = $('livePlayer'), iframe = $('playerFrame')
  video.pause(); video.src = ''; iframe.src = ''
  if (url.includes('youtube.com/embed/') || url.includes('youtu.be/')) {
    video.style.display = 'none'
    iframe.style.display = 'block'
    iframe.src = url
    return
  }
  video.style.display = 'block'
  iframe.style.display = 'none'
  if(url.includes('.m3u8') && Hls.isSupported()) {
    liveHls = new Hls()
    liveHls.loadSource(url)
    liveHls.attachMedia(video)
    liveHls.on(Hls.Events.MANIFEST_PARSED, () => video.play().catch(() => {}))
  } else {
    video.src = url
    video.play().catch(() => {})
  }
}

function closePlayer() {
  $('playerOverlay').classList.remove('active')
  $('playerFrame').style.display = ''; $('playerFrame').src = ''
  $('livePlayer').style.display = 'none'
  const v = $('livePlayer'); v.pause(); v.src = ''
  if(liveHls) { liveHls.destroy(); liveHls = null }
}

function escapeHtml(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML }

function switchTrend(type, btn) {
  trendType = type
  document.querySelectorAll('.trend-tabs button').forEach(b => b.classList.remove('active'))
  btn.classList.add('active')
  renderHome()
}

// --- Search ---
async function renderSearch(q, type) {
  showSearch(); document.title = 'Search: ' + q + ' - MediaHub'
  $('searchTitle').textContent = 'Results for "' + q + '"'
  $('searchInfo').textContent = 'Searching...'
  $('searchGrid').innerHTML = '<div class="loading"><div class="spinner"></div></div>'
  if(type === 'anime') {
    const d = await fetchAPI('/anime/search?q=' + encodeURIComponent(q))
    if(!d || !d.media) { $('searchInfo').textContent = 'No results'; $('searchGrid').innerHTML = '<div class="loading"><p style="color:var(--muted)">No results found</p></div>'; return }
    $('searchInfo').textContent = 'Found ' + d.media.length + ' results'
    $('searchGrid').innerHTML = d.media.map((item, i) => {
      const t = item.title?.romaji || item.title?.english || item.title?.native || 'Untitled', img = item.coverImage?.large || ''
      return '<div class="card" style="--i:' + i + '" onclick="navigate(\'#/anime/' + item.id + '\')"><div class="poster" style="background-image:url(\'' + (img || 'https://placehold.co/342x513/0a0a14/fff/?text=No+Poster') + '\')">' + (item.averageScore ? '<span class="rating">\u2605 ' + (item.averageScore/10).toFixed(1) + '</span>' : '') + (item.episodes ? '<span class="eps-badge">' + item.episodes + ' eps</span>' : '') + '<div class="hover-overlay"><div class="pbtn">\u25B6</div></div></div><div class="info"><h3>' + escapeHtml(t) + '</h3><p>' + (item.format||'Anime') + (item.season ? ' \u2022 ' + item.season : '') + '</p></div></div>'
    }).join('')
  } else if(type === 'live') {
    async function searchLiveChannels(query) {
      const ql = query.toLowerCase()
      if(!Object.keys(liveChannelsCache).length) {
        const [ft, tl] = await Promise.all([ensureSourceCached('freetv'), ensureSourceCached('tvlink')])
        await Promise.all(LIVE_CATEGORIES.slice(0, 5).map(async c => {
          if (liveChannelsCache[c.id]) return
          try {
            const r = await fetch('https://iptv-org.github.io/iptv/categories/' + c.id + '.m3u')
            if (!r.ok) return
            const text = await r.text()
            const base = parseM3U(text)
            liveChannelsCache[c.id] = mergeChannelLists(base, [
              { sourceId: 'freetv', channels: ft },
              { sourceId: 'tvlink', channels: tl }
            ])
          } catch(e) {}
        }))
      }
      const all = Object.values(liveChannelsCache).flat()
      return all.filter(ch => ch.name.toLowerCase().includes(ql))
    }
    const results = await searchLiveChannels(q)
    $('searchInfo').textContent = results.length ? 'Found ' + results.length + ' channels' : 'No channels found'
    if(!results.length) { $('searchGrid').innerHTML = '<div class="loading"><p style="color:var(--muted)">No live channels found</p></div>'; return }
    currentLiveChannels = results
    $('searchGrid').innerHTML = '<div class="live-channel-grid">' + results.map((ch, i) => {
      const srcLabel = ch.sources.length > 1 ? '<span class="ch-src-badge">' + ch.sources.length + ' sources</span>' : ''
      return '<div class="live-channel-card" onclick="playLiveStream(' + i + ')">' +
        (ch.logo ? '<img class="ch-logo" src="' + ch.logo + '" alt="" loading="lazy" onerror="this.style.display=\'none\'">' : '') +
        '<div class="ch-name">' + escapeHtml(ch.name) + '</div>' +
        srcLabel +
        '</div>'
    }).join('') + '</div>'
  } else {
    const d = await fetchAPI('/search?q=' + encodeURIComponent(q) + '&type=' + type)
    if(!d || !d.results) { $('searchInfo').textContent = 'No results'; $('searchGrid').innerHTML = '<div class="loading"><p style="color:var(--muted)">No results found</p></div>'; return }
    const r = d.results.filter(x => x.media_type !== 'person' || !x.media_type)
    $('searchInfo').textContent = 'Found ' + r.length + ' results'
    $('searchGrid').innerHTML = r.map((item, i) => {
      const t = item.title || item.name || 'Untitled', date = item.release_date || item.first_air_date || '', y = date ? date.split('-')[0] : ''
      const rt = item.vote_average ? '\u2605 ' + item.vote_average.toFixed(1) : '', poster = item.poster_path ? IMG + '/w342' + item.poster_path : '';
      let m = item.media_type || type;
      if (!['movie', 'tv', 'anime'].includes(m)) m = 'movie';
      return '<div class="card" style="--i:' + i + '" onclick="navigate(\'#/' + m + '/' + item.id + '\')"><div class="poster" style="background-image:url(\'' + (poster || 'https://placehold.co/342x513/0a0a14/fff/?text=No+Poster') + '\')">' + (rt ? '<span class="rating">' + rt + '</span>' : '') + '<div class="hover-overlay"><div class="pbtn">\u25B6</div><span class="mtag">' + (m === 'movie' ? 'Movie' : m === 'tv' ? 'TV' : 'Anime') + '</span></div></div><div class="info"><h3>' + escapeHtml(t) + '</h3><p>' + y + (m === 'movie' ? ' \u2022 Movie' : ' \u2022 TV') + '</p></div></div>'
    }).join('')
  }
}
// --- Legal Pages ---
function renderTerms() {
  showDetail(); document.title = 'Terms of Use - MediaHub'
  $('detailPage').innerHTML = '<div style="max-width:800px;margin:40px auto;padding:0 20px;"><h1 style="font-size:32px;margin-bottom:24px;">Terms of Use</h1><p style="margin-bottom:16px;color:var(--text2)">Last updated: October 2026</p><h3 style="margin:24px 0 12px;font-size:20px;">1. Acceptance of Terms</h3><p style="margin-bottom:16px;line-height:1.7;color:var(--text2)">By accessing and using MediaHub, you accept and agree to be bound by the terms and provision of this agreement. MediaHub acts merely as an aggregator and does not host any media content on its own servers.</p><h3 style="margin:24px 0 12px;font-size:20px;">2. Content Disclaimer</h3><p style="margin-bottom:16px;line-height:1.7;color:var(--text2)">MediaHub indexes content available publicly on the internet. We do not control or take responsibility for the nature, content, and availability of third-party streams or sites linked through our app.</p><h3 style="margin:24px 0 12px;font-size:20px;">3. User Conduct</h3><p style="margin-bottom:16px;line-height:1.7;color:var(--text2)">You agree to use MediaHub only for lawful purposes. You are prohibited from violating or attempting to violate the security of the application or using it to distribute malicious software.</p></div>'
}
function renderPrivacy() {
  showDetail(); document.title = 'Privacy Policy - MediaHub'
  $('detailPage').innerHTML = '<div style="max-width:800px;margin:40px auto;padding:0 20px;"><h1 style="font-size:32px;margin-bottom:24px;">Privacy Policy</h1><p style="margin-bottom:16px;color:var(--text2)">Last updated: October 2026</p><h3 style="margin:24px 0 12px;font-size:20px;">1. Information Collection</h3><p style="margin-bottom:16px;line-height:1.7;color:var(--text2)">MediaHub is designed to be privacy-first. We do not require you to create an account, and we do not collect personally identifiable information (PII) such as your name, email, or address.</p><h3 style="margin:24px 0 12px;font-size:20px;">2. Local Storage</h3><p style="margin-bottom:16px;line-height:1.7;color:var(--text2)">We may use your browser\'s local storage to save your preferences, search history, or customized settings locally on your device. This data is not transmitted to our servers.</p><h3 style="margin:24px 0 12px;font-size:20px;">3. Third-Party Services</h3><p style="margin-bottom:16px;line-height:1.7;color:var(--text2)">MediaHub utilizes external APIs (such as TMDB) to fetch metadata. These third-party services may log your IP address according to their own privacy policies when requests are made directly from your browser.</p></div>'
}
async function renderPerson(id) {
  showDetail(); document.title = 'Loading...'
  const dp = $('detailPage'); dp.innerHTML = '<div class="loading"><div class="spinner"></div></div>'
  const d = await fetchAPI('/person/' + id)
  if(!d) { dp.innerHTML = '<div class="loading"><p>Error loading</p></div>'; return }
  document.title = (d.name || 'Unknown') + ' - MediaHub'
  const photo = d.profile_path ? IMG + '/w500' + d.profile_path : 'https://placehold.co/500x750/0a0a14/fff/?text=No+Photo'
  const bio = d.biography ? d.biography.replace(/\n/g, '<br>') : 'No biography available.'
  const knownFor = d.known_for_department || 'Acting'
  const birthday = d.birthday || 'Unknown'
  const placeOfBirth = d.place_of_birth || 'Unknown'
  let credits = []
  if (d.combined_credits && d.combined_credits.cast) {
    credits = d.combined_credits.cast.sort((a, b) => b.popularity - a.popularity).slice(0, 24)
  }
  const creditsHtml = credits.length > 0 ? '<div class="similar-section" style="margin-top:0"><h2 class="section-title">Known For</h2><div class="grid" style="margin-top:16px;">' + credits.map(s => {
    const p = s.poster_path ? IMG + '/w342' + s.poster_path : 'https://placehold.co/342x513/0a0a14/fff/?text=No+Poster';
    const y = (s.release_date||s.first_air_date||'').split('-')[0] || '';
    const m = s.media_type || 'movie'
    return '<div class="card" onclick="navigate(\'#/' + m + '/' + s.id + '\')"><div class="poster" style="background-image:url(\'' + p + '\')">' + (s.vote_average ? '<span class="rating">\u2605 ' + s.vote_average.toFixed(1) + '</span>' : '') + '</div><div class="info"><h3>' + escapeHtml(s.title || s.name || '') + '</h3><p>' + y + '</p></div></div>';
  }).join('') + '</div></div>' : ''
  dp.innerHTML = '<button class="back-btn" onclick="history.back()">\u2190 Back</button><div class="detail-hero" style="min-height:auto; align-items:flex-start; padding: 40px; background:var(--card); display:flex; gap:40px; flex-wrap:wrap; border:none; box-shadow:none;"><div class="detail-poster" style="background-image:url(\'' + photo + '\'); width: 260px; flex-shrink: 0; box-shadow:0 20px 40px rgba(0,0,0,0.5);"></div><div class="detail-info" style="flex:1; min-width:300px;"><h1 style="font-size:42px; font-weight:700; margin-bottom:16px; letter-spacing:-1px;">' + escapeHtml(d.name) + '</h1><div class="spotlight-meta" style="margin-bottom:24px;"><span>' + escapeHtml(knownFor) + '</span>' + (birthday !== 'Unknown' ? '<span>Born: ' + escapeHtml(birthday) + '</span>' : '') + (placeOfBirth !== 'Unknown' ? '<span>' + escapeHtml(placeOfBirth) + '</span>' : '') + '</div><h3 style="font-size:20px; font-weight:600; margin-bottom:12px;">Biography</h3><p class="overview" style="max-width:none; line-height:1.8; font-size:15px; color:var(--text2);">' + bio + '</p></div></div><div class="detail-content">' + creditsHtml + '</div>'
}

// --- Detail ---
async function renderDetail(type, id, season) {
  showDetail(); document.title = 'Loading...'
  const dp = $('detailPage'); dp.innerHTML = '<div class="loading"><div class="spinner"></div></div>'
  if(type === 'anime') {
    const d = await fetchAPI('/anime/' + id)
    if(!d) { dp.innerHTML = '<div class="loading"><p>Error loading</p></div>'; return }
    currentItem = { type: 'anime', id, title: d.title?.romaji || d.title?.english || 'Untitled' }
    document.title = currentItem.title + ' - MediaHub'
    const img = d.coverImage?.large || '', banner = d.bannerImage || '', desc = (d.description||'').replace(/<[^>]*>/g,'') || 'No description.'
    dp.innerHTML = '<button class="back-btn" onclick="goHome()">\u2190 Back</button><div class="detail-hero"><div class="detail-bg" style="background-image:url(\'' + (banner || img || 'https://placehold.co/1280x720/0c0c1e/fff') + '\')"></div><div class="detail-overlay"><div class="detail-poster" style="background-image:url(\'' + (img || 'https://placehold.co/342x513/0a0a14/fff/?text=No+Poster') + '\')"></div><div class="detail-info"><h1>' + currentItem.title + '</h1><div class="detail-meta"><span>' + (d.format||'Anime') + '</span>' + (d.status ? '<span>' + d.status + '</span>' : '') + (d.episodes ? '<span>' + d.episodes + ' Episodes</span>' : '') + (d.averageScore ? '<span>\u2605 ' + (d.averageScore/10).toFixed(1) + '</span>' : '') + (d.startDate?.year ? '<span>' + d.startDate.year + '</span>' : '') + (d.duration ? '<span>' + d.duration + 'm</span>' : '') + '</div><p class="overview">' + desc + '</p><div class="genre-tags">' + (d.genres||[]).map(g => '<span>' + g + '</span>').join('') + '</div><div class="detail-actions" style="margin-top:16px"><button class="btn-play" onclick="playItem(\'anime\',' + id + ')">\u25B6 Play Now</button><button class="btn-secondary" onclick="goHome()">Browse</button></div></div></div></div>'
  } else {
    const d = await fetchAPI('/' + type + '/' + id)
    if(!d) { dp.innerHTML = '<div class="loading"><p>Error loading</p></div>'; return }
    const title = d.title || d.name || 'Untitled'; document.title = title + ' - MediaHub'
    const year = (d.release_date||d.first_air_date||'').split('-')[0] || '', poster = d.poster_path ? IMG + '/w342' + d.poster_path : '', bg = d.backdrop_path ? IMG + '/w1280' + d.backdrop_path : ''
    const rating = d.vote_average ? '\u2605 ' + d.vote_average.toFixed(1) + (d.vote_count ? ' (' + d.vote_count + ' votes)' : '') : '', rt = type === 'movie' && d.runtime ? d.runtime + 'm' : '', genres = (d.genres||[]).map(g => g.name||g), desc = d.overview || 'No description.'
    currentItem = { type, id, title }
    const castHtml = (d.credits && d.credits.cast && d.credits.cast.length > 0) ? '<div class="cast-section"><h2 class="section-title">Cast</h2><div class="cast-list">' + d.credits.cast.slice(0, 10).map(c => '<div class="cast-card" onclick="navigate(\'#/person/' + c.id + '\')"><div class="cast-photo" style="background-image:url(\'' + (c.profile_path ? IMG + '/w185' + c.profile_path : 'https://placehold.co/185x278/1a1a2e/666/?text=No+Photo') + '\')"></div><div class="cast-info-box"><strong>' + escapeHtml(c.name) + '</strong><span>' + escapeHtml(c.character || '') + '</span></div></div>').join('') + '</div></div>' : ''
    const similarHtml = (d.similar && d.similar.results && d.similar.results.length > 0) ? '<div class="similar-section"><h2 class="section-title">Similar ' + (type === 'movie' ? 'Movies' : 'Shows') + '</h2><div class="similar-list">' + d.similar.results.slice(0, 10).map(s => { const p = s.poster_path ? IMG + '/w342' + s.poster_path : 'https://placehold.co/342x513/0a0a14/fff/?text=No+Poster'; const y = (s.release_date||s.first_air_date||'').split('-')[0] || ''; return '<div class="card" onclick="navigate(\'#/' + type + '/' + s.id + '\')"><div class="poster" style="background-image:url(\'' + p + '\')">' + (s.vote_average ? '<span class="rating">\u2605 ' + s.vote_average.toFixed(1) + '</span>' : '') + '</div><div class="info"><h3>' + escapeHtml(s.title || s.name || '') + '</h3><p>' + y + '</p></div></div>'; }).join('') + '</div></div>' : ''
    const extendedInfo = '<div class="extended-info">' + castHtml + similarHtml + '</div>'
    dp.innerHTML = '<button class="back-btn" onclick="goHome()">\u2190 Back</button><div class="detail-hero"><div class="detail-bg" style="background-image:url(\'' + (bg || 'https://placehold.co/1280x720/0c0c1e/fff') + '\')"></div><div class="detail-overlay"><div class="detail-poster" style="background-image:url(\'' + (poster || 'https://placehold.co/342x513/0a0a14/fff/?text=No+Poster') + '\')"></div><div class="detail-info"><h1>' + title + '</h1><div class="detail-meta">' + (year ? '<span>' + year + '</span>' : '') + (rating ? '<span>' + rating + '</span>' : '') + (rt ? '<span>' + rt + '</span>' : '') + (d.status ? '<span>' + d.status + '</span>' : '') + (type === 'tv' && d.number_of_seasons ? '<span>' + d.number_of_seasons + ' Seasons</span>' : '') + '</div><p class="overview">' + desc + '</p><div class="genre-tags">' + genres.map(g => '<span>' + g + '</span>').join('') + '</div><div class="detail-actions" style="margin-top:16px">' + (type === 'movie' ? '<button class="btn-play" onclick="playItem(\'movie\',' + id + ')">\u25B6 Play Now</button>' : '') + (type === 'tv' ? '<button class="btn-play" onclick="playItem(\'tv\',' + id + ',1,1)">\u25B6 Play S1:E1</button>' : '') + '<button class="btn-secondary" onclick="goHome()">Browse</button></div></div></div></div><div class="detail-content">' + (type === 'tv' ? '<div id="seasonsSection"></div>' : '') + extendedInfo + '</div>'
    if(type === 'tv') loadSeasons(id, season)
  }
}

async function loadSeasons(tvId, activeSeason) {
  const d = await fetchAPI('/tv/' + tvId)
  if(!d || !d.seasons) return
  const seasons = d.seasons.filter(s => s.season_number > 0), init = activeSeason ? parseInt(activeSeason) : (seasons[0]?.season_number||1)
  $('seasonsSection').innerHTML = '<div class="season-tabs">' + seasons.map(s => '<button class="' + (s.season_number === init ? 'active' : '') + '" onclick="switchSeason(' + tvId + ',' + s.season_number + ',this)">' + (s.name || 'Season ' + s.season_number) + '</button>').join('') + '</div><div id="episodesContainer"><div class="loading"><div class="spinner"></div></div></div>'
  loadEpisodes(tvId, init)
}
function switchSeason(tvId, season, btn) { document.querySelectorAll('.season-tabs button').forEach(b => b.classList.remove('active')); btn.classList.add('active'); loadEpisodes(tvId, season) }
async function loadEpisodes(tvId, season) {
  currentSeason = season; const d = await fetchAPI('/tv/' + tvId + '/season/' + season)
  if(!d || !d.episodes) return
  currentItem = { type: 'tv', id: tvId, title: currentItem?.title||'', season }
  $('episodesContainer').innerHTML = '<div class="episodes-grid">' + d.episodes.map(ep => {
    const still = ep.still_path ? IMG + '/w300' + ep.still_path : ''
    return '<div class="episode-card" onclick="playItem(\'tv\',' + tvId + ',' + season + ',' + ep.episode_number + ')"><div class="episode-thumb" style="background-image:url(\'' + (still || 'https://placehold.co/300x169/0a0a14/666/?text=Episode+' + ep.episode_number) + '\')"></div><div class="episode-info"><div class="episode-num">EPISODE ' + ep.episode_number + '</div><h4>' + (ep.name||'Episode '+ep.episode_number) + '</h4>' + (ep.overview ? '<p>' + escapeHtml(ep.overview) + '</p>' : '') + '</div></div>'
  }).join('') + '</div>'
}

// --- Player ---
async function playItem(type, id, season, episode) {
  $('playerOverlay').classList.add('active'); $('playerTitle').textContent = currentItem?.title || 'Now Playing'
  $('playerFrame').style.display = ''; $('livePlayer').style.display = 'none'
  if(liveHls) { liveHls.destroy(); liveHls = null }
  $('playerFrame').src = ''
  const d = await fetchAPI('/sources?type=' + type + '&id=' + id + (type === 'tv' ? '&season=' + season + '&episode=' + episode : ''))
  currentSources = d?.sources || []; currentSourceIdx = 0
  const tabs = $('sourceTabs'); tabs.innerHTML = currentSources.map((s, i) => '<button class="' + (i === 0 ? 'active' : '') + '" onclick="switchSource(' + i + ',this)">' + s.name + '</button>').join('')
  if(currentSources.length) loadSource(0)
}
function switchSource(idx, btn) { if(btn) { document.querySelectorAll('#sourceTabs button').forEach(b => b.classList.remove('active')); btn.classList.add('active') } currentSourceIdx = idx; loadSource(idx) }
function loadSource(idx) { const src = currentSources[idx]; if(!src) return; $('playerFrame').src = src.url }
// --- Share / QR ---
const SITE_URL = 'https://greatmedia-hub.pages.dev'
let qrInstance = null

function openShare() {
  $('shareOverlay').classList.add('active')
  const c = $('qrContainer')
  if(!qrInstance) {
    const existing = c.querySelector('canvas')
    if(existing) existing.remove()
    if(typeof QRCode !== 'undefined') {
      const cv = document.createElement('div'); cv.id = 'qrCanvas'
      c.prepend(cv)
      qrInstance = new QRCode(cv, {
        text: SITE_URL, width: 200, height: 200,
        colorDark: '#1a1a2e', colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
      })
      // Draw center logo overlay
      const canvas = cv.querySelector('canvas')
      if(canvas) {
        const ctx = canvas.getContext('2d')
        const cx = canvas.width/2, cy = canvas.height/2, r = 18
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI*2)
        const grad = ctx.createLinearGradient(cx-r, cy-r, cx+r, cy+r)
        grad.addColorStop(0, '#6c5ce7'); grad.addColorStop(1, '#00cec9')
        ctx.fillStyle = grad
        ctx.fill()
        ctx.fillStyle = '#fff'
        ctx.font = 'bold 20px sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('\u25B6', cx+1, cy+1)
      }
    }
  }
  $('shareUrl').textContent = SITE_URL
  $('shareHint').textContent = 'Scan to open MediaHub on your device'
}

function closeShare() { $('shareOverlay').classList.remove('active') }

function copyShareLink() {
  navigator.clipboard.writeText(SITE_URL).then(() => {
    $('shareHint').textContent = 'Link copied!'
    setTimeout(() => { $('shareHint').textContent = 'Scan to open MediaHub on your device' }, 2000)
  }).catch(() => {
    $('shareHint').textContent = 'Press and hold to copy the URL above'
    setTimeout(() => { $('shareHint').textContent = 'Scan to open MediaHub on your device' }, 3000)
  })
}

// --- GitHub Repo Info ---
const REPO = 'coderaarav12/media-hub-frontend'
async function loadRepoStats() {
  try {
    const r = await fetch('https://api.github.com/repos/' + REPO)
    if(!r.ok) return
    const d = await r.json()
    $('footerStars').innerHTML = '&#9733; ' + (d.stargazers_count || 0)
    const updated = d.pushed_at ? new Date(d.pushed_at).toLocaleDateString() : ''
    if(updated) $('footerUpdated').textContent = 'Updated ' + updated

    const gh = $('ghRepoArea')
    gh.innerHTML = '<div class="gh-left"><div class="gh-icon"><svg viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg></div><div><a class="gh-name" href="https://github.com/' + REPO + '" target="_blank" rel="noopener">' + REPO + '</a><div class="gh-desc">' + escapeHtml(d.description || '') + '</div></div></div><div class="gh-stats"><div class="gh-stat"><svg viewBox="0 0 16 16"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25z"/></svg><span class="gh-stat-num">' + (d.stargazers_count || 0) + '</span></div><div class="gh-stat"><svg viewBox="0 0 16 16"><path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0z"/></svg><span class="gh-stat-num">' + (d.forks_count || 0) + '</span></div><div class="gh-stat"><svg viewBox="0 0 16 16"><path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.25.25 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"/></svg><span class="gh-stat-num">' + (d.open_issues_count || 0) + '</span></div></div>'
  } catch(e) { $('ghRepoArea').innerHTML = '<div class="gh-loading">Could not load repo info</div>' }
}

const CHANGELOG = [
  { date: '2025-07-08', msg: 'Live TV: alphabetical grouping with letter headers, compact tile layout' },
  { date: '2025-07-08', msg: 'Multi-source Live TV with channel merging and fallback (iptv-org, Free-TV, TVLink)' },
  { date: '2025-07-08', msg: 'Service worker network-first strategy with versioned cache' },
  { date: '2025-07-08', msg: 'Refresh button that clears SW cache and hard reloads' },
  { date: '2025-07-08', msg: 'Changelog with What\'s New link in footer, fresh commits fetched' },
  { date: '2025-07-08', msg: 'Live TV search across all merged channels' },
  { date: '2025-07-08', msg: 'Source tabs in player for channel fallback' },
  { date: '2025-07-08', msg: 'Initial release: MediaHub with Movies, TV, Anime, Live TV' },
]
const CHANGELOG_VER = 8

function checkUpdate() {
  const last = localStorage.getItem('changelogVer')
  if(last !== String(CHANGELOG_VER)) { $('updateBanner').style.display = 'flex' }
  localStorage.setItem('changelogVer', CHANGELOG_VER)
}
function dismissUpdate() { $('updateBanner').style.display = 'none' }
async function refreshApp() {
  $('updateBanner').style.display = 'none'
  if('serviceWorker' in navigator) {
    const regs = await navigator.serviceWorker.getRegistrations()
    await Promise.all(regs.map(r => r.unregister()))
  }
  if('caches' in window) {
    const keys = await caches.keys()
    await Promise.all(keys.map(k => caches.delete(k)))
  }
  location.reload()
}
function openChangelog() {
  $('updateBanner').style.display = 'none'; $('changelogOverlay').classList.add('active')
  $('changelogBody').innerHTML = CHANGELOG.map(e =>
    '<div class="changelog-item"><div class="changelog-sha">' + e.date + '</div><div><div class="changelog-msg">' + escapeHtml(e.msg) + '</div></div></div>'
  ).join('')
}
function closeChangelog() { $('changelogOverlay').classList.remove('active') }

checkUpdate()
loadRepoStats()
handleRoute()

// --- Popup Blocker ---
;(function(){
  window.open = function(){ return null }
  document.addEventListener('click',function(e){
    const a = e.target.closest('a[target="_blank"]')
    if(a){ e.preventDefault(); e.stopPropagation(); return false }
  },true)
})()
