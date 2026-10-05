const text = `#EXTM3U x-tvg-url="https://worker-9dd4.onrender.com/guide.xml.gz"
#EXTINF:-1 tvg-id="2GB.au@SD" tvg-logo="https://i.ibb.co/jwM8DFG/2GB-1.png" group-title="News",2GB (1080p)
https://2gblive.akamaized.net/hls/live/2033805/2GB/index.m3u8
#EXTINF:-1 tvg-id="test" group-title="News",Test Channel
#EXTVLCOPT:http-user-agent=Mozilla/5.0
https://test.url`; 
const channels = [];
const lines = text.split('\n');
for(let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  if(!line.startsWith('#EXTINF:')) continue;
  const info = line.slice(8);
  let name = info;
  const logoMatch = info.match(/tvg-logo="([^"]*)"/);
  const logo = logoMatch ? logoMatch[1] : '';
  const groupMatch = info.match(/group-title="([^"]*)"/);
  const group = groupMatch ? groupMatch[1] : '';
  const nameMatch = info.match(/,(.+)$/);
  if(nameMatch) name = nameMatch[1].trim();
  name = name.replace(/\s*\([\d]+p\)/gi, '').replace(/\s*\[.*?\]/g, '').trim();
  let urlLine = lines[i + 1];
  
  if(urlLine && urlLine.trim() && !urlLine.trim().startsWith('#')) {
    channels.push({ name, url: urlLine.trim(), logo, group });
  } else if (urlLine && urlLine.trim().startsWith('#EXTVLCOPT')) {
     urlLine = lines[i + 2];
     if(urlLine && urlLine.trim() && !urlLine.trim().startsWith('#')) {
       channels.push({ name, url: urlLine.trim(), logo, group });
     }
  }
}
console.log(channels);
