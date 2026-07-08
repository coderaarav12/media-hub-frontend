# MediaHub

Search and stream movies, TV shows, and anime from multiple embed sources.

**Live site:** [https://media-hub-frontend.pages.dev](https://media-hub-frontend.pages.dev)

## Architecture

```
media-hub-frontend  →  Cloudflare Pages (static SPA, deployed via GitHub Actions)
media-hub-api      →  Vercel (serverless Express + TMDB + AniList)
```

- **Frontend:** Pure HTML/CSS/JS single-page app with hash-based routing
- **Backend:** Express serverless on Vercel proxying TMDB (Bearer JWT) and AniList (GraphQL)
- **Deploy:** GitHub Actions workflow generates `config.js` from secrets, deploys to Cloudflare Pages

## Features

- Search movies, TV, and anime
- Trending / Popular sections for each category (Movies, TV, Anime)
- TV season & episode browser
- Multi-source embed player (VidLink, VidSrc, 2Embed, Smashy, VidFast, etc.)
- PWA installable (manifest + service worker)
- QR code sharing with custom branded overlay
- Update notification banner + changelog modal
- GitHub repo stats card
- Responsive (mobile + desktop)
- Dark theme with purple/teal/coral palette

## Setup

### Prerequisites
- Vercel backend deployed (see [media-hub-api](https://github.com/coderaarav12/media-hub-api))
- Cloudflare account

### GitHub Secrets
In your repo **Settings > Secrets and variables > Actions**, add:

| Secret | Description |
|--------|-------------|
| `VERCEL_API_URL` | Vercel API base URL (e.g. `https://your-app.vercel.app/api`) |
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token with Pages:Edit permission |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID |

### Deploy
Push to `main` — the GitHub Actions workflow auto-deploys to Cloudflare Pages.

## Credits

- [TMDB](https://www.themoviedb.org/) for movie/TV metadata
- [AniList](https://anilist.co/) for anime metadata
- [Cloudflare Pages](https://pages.cloudflare.com/) for hosting
- Embed sources: VidLink, VidSrc, 2Embed, Smashy, VidFast, Videoasy, Vidify, ZenIME
