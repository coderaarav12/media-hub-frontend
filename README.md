# MediaHub

Search and stream movies, TV shows, and anime from multiple embed sources.

**Live site:** https://coderaarav12.github.io/media-hub-frontend/

## Architecture

```
media-hub-frontend  →  GitHub Pages (static SPA, deployed via Actions)
media-hub-api      →  Vercel (serverless Express + TMDB + AniList)
```

- **Frontend:** Pure HTML/CSS/JS single-page app with hash-based routing
- **Backend:** Express serverless on Vercel proxying TMDB (Bearer JWT) and AniList (GraphQL)

## Features

- Search movies, TV, and anime
- Trending / Popular sections for each category
- TV season & episode browser
- Multi-source embed player (VidLink, VidSrc, 2Embed, etc.)
- PWA installable (manifest + service worker)
- QR code sharing
- Responsive (mobile + desktop)

## Setup

1. Fork/clone this repo
2. Set up the backend on Vercel (see [media-hub-api](https://github.com/coderaarav12/media-hub-api))
3. In your GitHub repo, go to **Settings > Secrets and variables > Actions** and add:
   - `VERCEL_API_URL` — your Vercel API base URL (e.g. `https://your-app.vercel.app/api`)
4. Go to **Settings > Pages > Source** and select **GitHub Actions**
5. Push to `main` — the workflow will deploy automatically

## Credits

- [TMDB](https://www.themoviedb.org/) for movie/TV metadata
- [AniList](https://anilist.co/) for anime metadata
- Various embed sources (VidLink, VidSrc, 2Embed, etc.)
