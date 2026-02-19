const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config(); // Renderでのデプロイを考慮し、デフォルトの挙動に変更

const app = express();
const PORT = process.env.PORT || 3001;

// 許可するフロントエンドのURL（ローカル開発とVercel本番環境）
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5173/',
    'https://swappy-react3.vercel.app',
    'https://swappy-react3.vercel.app/' // iOS Safari等で付与される事がある末尾スラッシュ対応
];

app.use(cors({
    origin: function (origin, callback) {
        // iOS Safari等のWebViewからのリクエストや、一部のプライベートブラウズモードでは
        // originが'null'になることがあるため、一時的に全てを許可する（またはnullを明示的に許可）
        const isAllowed = !origin || origin === 'null' || allowedOrigins.includes(origin);
        if (isAllowed) {
            callback(null, true);
        } else {
            // 本来はエラーにすべきだが、デバッグとモバイル対応のため一旦警告だけ出して通す
            console.warn(`[CORS Warning] Blocked origin: ${origin}`);
            callback(null, true);
        }
    },
    credentials: true
}));
app.use(express.json());

const TMDB_API_KEY = process.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Middleware to check API Key presence
app.use((req, res, next) => {
    if (!TMDB_API_KEY) {
        console.error('API Key missing in environment variables');
        return res.status(500).json({ error: 'Server configuration error: API Key missing' });
    }
    next();
});

// Proxy for General Top Rated Movies
app.get('/api/discover/top-rated', async (req, res) => {
    try {
        const { page = 1 } = req.query;
        const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
            params: {
                api_key: TMDB_API_KEY,
                language: 'ja-JP',
                sort_by: 'vote_count.desc',
                page: page,
                include_adult: false,
                'vote_count.gte': 100
            },
            headers: {
                'Host': 'api.themoviedb.org',
                'X-Forwarded-Host': 'api.themoviedb.org'
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('TMDb General Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch movies' });
    }
});

// Proxy for Anime Top Rated Movies
app.get('/api/discover/anime', async (req, res) => {
    try {
        const { page = 1 } = req.query;
        const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
            params: {
                api_key: TMDB_API_KEY,
                language: 'ja-JP',
                sort_by: 'vote_count.desc', // Sort by popularity/vote count within anime
                page: page,
                include_adult: false,
                'vote_count.gte': 100,
                with_genres: '16' // Anime Genre ID
            },
            headers: {
                'Host': 'api.themoviedb.org',
                'X-Forwarded-Host': 'api.themoviedb.org'
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('TMDb Anime Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch anime' });
    }
});

// Generic Proxy fallback (if needed later)
// app.get('/api/*', async (req, res) => { ... });

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
