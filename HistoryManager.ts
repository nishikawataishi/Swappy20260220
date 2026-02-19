import { ResultItem } from './types';

export type InteractionType = 'like' | 'dislike' | 'match' | 'skip';

export interface HistoryEntry {
  movieTitle: string;
  movieId?: string; // Optional if we add IDs later
  action: InteractionType;
  timestamp: number;
}

const STORAGE_KEY = 'swappy_user_history';

class HistoryManagerService {
  
  // Save an interaction
  saveInteraction(movie: ResultItem, action: InteractionType) {
    try {
      const history = this.getHistory();
      
      const entry: HistoryEntry = {
        movieTitle: movie.title,
        action,
        timestamp: Date.now(),
      };

      // Add to beginning of array (newest first)
      history.unshift(entry);
      
      // Limit history size to 10 (Lightweight)
      if (history.length > 10) {
        history.length = 10;
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`[History] Saved ${action} for ${movie.title}`);
      }
    } catch (e) {
      console.error("Failed to save history", e);
    }
  }

  // Retrieve full history
  getHistory(): HistoryEntry[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error("Failed to load history", e);
      return [];
    }
  }

  // Get list of liked movies
  getLikedMovies(): string[] {
    return this.getHistory()
      .filter(h => h.action === 'like' || h.action === 'match')
      .map(h => h.movieTitle);
  }

  // Clear history
  clear() {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export const historyManager = new HistoryManagerService();