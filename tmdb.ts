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

const tmdb = axios.create({
    baseURL: BASE_URL,
    params: {
        api_key: API_KEY,
        language: 'ja-JP', // Japanese results
    },
});

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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

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
        return response.data.results;
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
        return response.data.results;
    } catch (error) {
        console.error('Backend Anime Top Rated Error:', error);
        return [];
    }
};
