import { useState, useEffect } from 'react';

// Access API Key from environment variables (Vite)
const API_KEY = (import.meta as any).env?.VITE_TMDB_API_KEY;

class ImageCacheService {
  private cache = new Map<string, string>();
  private pending = new Set<string>();
  private listeners = new Map<string, ((url: string | null) => void)[]>();
  private isFallbackMode = false;

  constructor() {
    if (!API_KEY) {
      console.warn("[ImageCache] VITE_TMDB_API_KEY is missing. Running in fallback mode (local images only).");
      this.isFallbackMode = true;
    }
  }

  // Check if we have the image in memory
  has(title: string): boolean {
    return this.cache.has(title);
  }

  // Get image synchronously if available
  getSync(title: string): string | null {
    return this.cache.get(title) || null;
  }

  // Main method to fetch or retrieve image
  async getUrl(title: string): Promise<string | null> {
    // Return immediately if cached
    if (this.cache.has(title)) return this.cache.get(title)!;

    // If fallback mode or already pending, stop.
    if (this.isFallbackMode) return null;
    if (this.pending.has(title)) return null;

    this.pending.add(title);

    try {
      const query = encodeURIComponent(title);
      const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}&language=ja-JP`);

      if (res.status === 429) {
        console.warn("[ImageCache] Rate limit exceeded. Switching to fallback mode.");
        this.isFallbackMode = true;
        throw new Error("Rate limit");
      }

      if (res.ok) {
        const data = await res.json();
        // Prefer Japanese poster
        const path = data.results?.[0]?.poster_path;

        if (path) {
          // Use w780 for high quality cards
          const url = `https://image.tmdb.org/t/p/w780${path}`;

          // CRITICAL: Preload the image object to ensure browser disk cache
          await new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
          });

          this.cache.set(title, url);
          this.notify(title, url);
          this.pending.delete(title);
          return url;
        }
      }
    } catch (e) {
      // Silent failure is preferred here to keep UI running
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[ImageCache] Failed to load: ${title}`, e);
      }
    }

    this.pending.delete(title);
    this.notify(title, null); // Return null so UI uses fallback
    return null;
  }

  // Subscribe to changes for a specific movie title
  subscribe(title: string, callback: (url: string | null) => void) {
    if (!this.listeners.has(title)) {
      this.listeners.set(title, []);
    }
    this.listeners.get(title)!.push(callback);

    // If we already have it, trigger immediately
    if (this.cache.has(title)) {
      callback(this.cache.get(title)!);
    } else {
      // If not, trigger a fetch
      this.getUrl(title);
    }
  }

  unsubscribe(title: string, callback: (url: string | null) => void) {
    const list = this.listeners.get(title);
    if (list) {
      this.listeners.set(title, list.filter(cb => cb !== callback));
    }
  }

  private notify(title: string, url: string | null) {
    const list = this.listeners.get(title);
    if (list) {
      list.forEach(cb => cb(url));
    }
  }

  // Method to preload a list of titles (e.g., next 5 movies)
  preload(titles: string[]) {
    if (this.isFallbackMode) return;

    titles.forEach(t => {
      if (!this.cache.has(t) && !this.pending.has(t)) {
        this.getUrl(t);
      }
    });
  }
}

export const imageCache = new ImageCacheService();

// Custom Hook for Components
export const useTMDbImage = (title: string | undefined) => {
  const [url, setUrl] = useState<string | null>(title ? imageCache.getSync(title) : null);
  const [loading, setLoading] = useState<boolean>(!url);

  useEffect(() => {
    if (!title) {
      setLoading(false);
      // Fallback or empty URL if title is missing
      setUrl(null);
      return;
    }

    // Check again in case it was loaded while component mounted
    const cached = imageCache.getSync(title);
    if (cached) {
      setUrl(cached);
      setLoading(false);
      return;
    }

    setLoading(true);

    const handler = (newUrl: string | null) => {
      setUrl(newUrl);
      setLoading(false);
    };

    imageCache.subscribe(title, handler);

    return () => {
      imageCache.unsubscribe(title, handler);
    };
  }, [title]);

  return { url, loading };
};