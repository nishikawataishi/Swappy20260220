/// <reference types="vite/client" />
import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export interface TMDbMovie {
    id: number;
    title: string;
    poster_path: string | null;
    backdrop_path: string | null;
    overview: string;
    release_date: string;
    vote_average: number;
}

// Replace missing VITE_TMDB_API_KEY if needed for direct fallback requests (though backend should handle it)
const tmdb = axios.create({
    baseURL: BASE_URL,
    params: {
        api_key: import.meta.env.VITE_TMDB_API_KEY || '77afaa6af4c92e64058b0dc2528cd3c4',
        language: 'ja-JP', // Japanese results
    },
});

// No interceptor is needed here anymore, as the API_BASE_URL handles the environment logic correctly.

export const getImageUrl = (path: string | null) => {
    if (!path) return null;
    return `${IMAGE_BASE_URL}${path}`;
};

export const searchMovies = async (query: string): Promise<TMDbMovie[]> => {
    try {
        const response = await tmdb.get('/search/movie', {
            params: { query },
        });
        return response.data.results;
    } catch (error) {
        console.error('TMDb Search Error:', error);
        return [];
    }
};

export const getPopularMovies = async (page = 1): Promise<TMDbMovie[]> => {
    try {
        const response = await tmdb.get('/movie/popular', {
            params: { page },
        });
        return response.data.results;
    } catch (error) {
        console.error('TMDb Popular Error:', error);
        return [];
    }
};

export const getDiscoverMovies = async (page = 1, genres?: string): Promise<TMDbMovie[]> => {
    try {
        const response = await tmdb.get('/discover/movie', {
            params: {
                page,
                with_genres: genres,
                sort_by: 'popularity.desc'
            },
        });
        return response.data.results;
    } catch (error) {
        console.error('TMDb Discover Error:', error);
        return [];
    }
};

// ======= CRITICAL FIX FOR MOBILE SAFARI =======
// In Vite/Vercel, `import.meta.env` can be unreliable if variables are not passed during build correctly.
// To guarantee the app never falls back to localhost in production, we check the actual window location.
const getApiBaseUrl = () => {
    // If we're deployed on Vercel or any public domain (not localhost)
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        return 'https://swappy-20260220.onrender.com';
    }

    // Otherwise it's local dev
    return 'http://localhost:3001';
};

const API_BASE_URL = getApiBaseUrl();

// Top 500 Strategy: Sort by vote_count to get "All-time Popular"
export const getDiscoverTopRated = async (page = 1): Promise<TMDbMovie[]> => {
    try {
        // Point to our local backend or deployed API
        const response = await axios.get(`${API_BASE_URL}/api/discover/top-rated`, {
            params: {
                page: page,
                // API Key is now handled by the backend
            },
        });
        if (response.data && Array.isArray(response.data.results)) {
            return response.data.results;
        }
        return [];
    } catch (error) {
        console.error('Backend Top Rated Error:', error);
        return [];
    }
};

// Anime Top 500 Strategy
export const getDiscoverAnimeTopRated = async (page = 1): Promise<TMDbMovie[]> => {
    try {
        // Point to our local backend or deployed API
        const response = await axios.get(`${API_BASE_URL}/api/discover/anime`, {
            params: {
                page: page,
                // API Key is now handled by the backend
            },
        });
        if (response.data && Array.isArray(response.data.results)) {
            return response.data.results;
        }
        return [];
    } catch (error) {
        console.error('Backend Anime Top Rated Error:', error);
        return [];
    }
};
