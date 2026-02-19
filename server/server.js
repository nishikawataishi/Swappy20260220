const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config({ path: '../.env' }); // Load from root .env

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
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
