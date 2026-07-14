import express from "express"
import cors from "cors"
import axios from "axios"
import https from "https"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = 3000
const TMDB_KEY = process.env.TMDB_KEY || "8265bd1679663a7ea12ac168da84d2e8"

const httpsAgent = new https.Agent({ keepAlive: true, maxSockets: 10 })

const tmdbClient = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: { api_key: TMDB_KEY },
  timeout: 15000,
  httpsAgent,
})

const fetchTMDB = async (endpoint, params = {}, retries = 2) => {
  for (let i = 0; i <= retries; i++) {
    try {
      const { data } = await tmdbClient.get(endpoint, { params })
      return data
    } catch (e) {
      if (i === retries) throw e
      if (e.response?.status === 429 || e.code === "ECONNRESET" || e.code === "ERR_STREAM_PREMATURE_CLOSE") {
        await new Promise(r => setTimeout(r, 1000 * (i + 1)))
        continue
      }
      throw e
    }
  }
}

app.use(cors())
app.use(express.json({ limit: "1mb" }))
app.use(express.static("public"))

app.get("/api/search", async (req, res, next) => {
  try {
    const { q, type = "multi", page = 1 } = req.query
    if (!q) return res.json({ results: [] })
    const t = type === "multi" ? "movie" : type
    const data = await fetchTMDB(`/search/${t}`, { query: q, page })
    res.json({ ...data, results: (data.results || []).filter(r => r.media_type !== "person") })
  } catch (e) { next(e) }
})

app.get("/api/trending", async (req, res, next) => {
  try {
    const { media = "all", page = 1 } = req.query
    const data = await fetchTMDB(`/trending/${media}/week`, { page })
    res.json(data)
  } catch (e) { next(e) }
})

app.get("/api/movie/:id", async (req, res, next) => {
  try {
    const data = await fetchTMDB(`/movie/${req.params.id}`, { append_to_response: "credits,videos,similar" })
    res.json(data)
  } catch (e) { next(e) }
})

app.get("/api/tv/:id", async (req, res, next) => {
  try {
    const data = await fetchTMDB(`/tv/${req.params.id}`, { append_to_response: "credits,videos,similar" })
    res.json(data)
  } catch (e) { next(e) }
})

app.get("/api/tv/:id/season/:season", async (req, res, next) => {
  try {
    const data = await fetchTMDB(`/tv/${req.params.id}/season/${req.params.season}`)
    res.json(data)
  } catch (e) { next(e) }
})

app.get("/api/anime/search", async (req, res, next) => {
  try {
    const { q, page = 1 } = req.query
    const graphqlQuery = `query ($s: String, $p: Int) { Page(page: $p, perPage: 50) { media(search: $s, type: ANIME, sort: POPULARITY_DESC) { id idMal title { romaji english native } description startDate { year } episodes genres averageScore coverImage { large } format status season } } }`
    const { data } = await axios.post("https://graphql.anilist.co",
      { query: graphqlQuery, variables: { s: q, p: parseInt(page) } },
      { timeout: 10000 }
    )
    res.json(data.data.Page)
  } catch (e) { next(e) }
})

app.get("/api/anime/:id", async (req, res, next) => {
  try {
    const graphqlQuery = `query ($id: Int) { Media(id: $id, type: ANIME) { id idMal title { romaji english native } description startDate { year } episodes genres averageScore coverImage { large } bannerImage format status season duration studios { nodes { name } } recommendations(perPage: 10) { nodes { mediaRecommendation { id title { romaji } coverImage { large } } } } } }`
    const { data } = await axios.post("https://graphql.anilist.co",
      { query: graphqlQuery, variables: { id: parseInt(req.params.id) } },
      { timeout: 10000, headers: { "Content-Type": "application/json" } }
    )
    if (data?.errors) return res.status(400).json({ error: data.errors[0].message })
    res.json(data.data.Media)
  } catch (e) { next(e) }
})

app.get("/api/sources", async (req, res, next) => {
  try {
    const { type, id, season, episode } = req.query
    const sources = []
    if (type === "movie") {
      sources.push({ name: "VidLink", url: `https://vidlink.pro/movie/${id}?primaryColor=2392EE&autoplay=false` })
      sources.push({ name: "VidSrc", url: `https://vidsrc.xyz/embed/movie?tmdb=${id}` })
      sources.push({ name: "VidSrc Pro", url: `https://vidsrc.su/embed/movie/${id}` })
      sources.push({ name: "VidFast", url: `https://vidfast.pro/movie/${id}?autoPlay=true&theme=2392EE` })
      sources.push({ name: "Videoasy", url: `https://player.videasy.net/movie/${id}?color=2392EE` })
    } else if (type === "tv") {
      sources.push({ name: "VidLink", url: `https://vidlink.pro/tv/${id}/${season}/${episode}?primaryColor=2392EE&autoplay=false` })
      sources.push({ name: "VidSrc", url: `https://vidsrc.xyz/embed/tv/${id}/${season}-${episode}` })
      sources.push({ name: "VidSrc Pro", url: `https://vidsrc.su/embed/tv/${id}/${season}/${episode}` })
      sources.push({ name: "VidFast", url: `https://vidfast.pro/tv/${id}/${season}/${episode}?autoPlay=true&theme=2392EE` })
      sources.push({ name: "Videoasy", url: `https://player.videasy.net/tv/${id}/${season}/${episode}?color=2392EE` })
    } else if (type === "anime") {
      sources.push({ name: "ZenIME", url: `https://api.zenime.site/api/stream?id=${id}&server=1&type=sub` })
      sources.push({ name: "VidSrc", url: `https://vidsrc.xyz/embed/movie?tmdb=${id}` })
    }
    res.json({ sources })
  } catch (e) { next(e) }
})

app.use((err, req, res, next) => {
  console.error("Error:", err.code || err.message)
  const status = err.response?.status || 500
  const friendly = status === 429 ? "Server is busy. Please try again."
    : err.code === "ECONNRESET" || err.code === "ERR_STREAM_PREMATURE_CLOSE" ? "Connection timed out. Please try again."
    : status >= 500 ? "External service unavailable. Try again later."
    : err.message
  res.status(status).json({ error: friendly })
})

app.listen(PORT, () => console.log(`MediaHub running at http://localhost:${PORT}`))
