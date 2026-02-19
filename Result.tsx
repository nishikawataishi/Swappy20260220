import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResultItem, GameMode } from './types';
import { RefreshCw, Zap, Share2, ThumbsUp, ThumbsDown, Search, Tv, PlayCircle, Video, ExternalLink } from 'lucide-react';
import { audioManager } from './AudioManager';
import { useTMDbImage } from './ImageCache';

interface ResultProps {
  result: ResultItem;
  path: string;
  onReset: () => void;
  mode?: GameMode;
}

export const Result: React.FC<ResultProps> = ({ result, path, onReset, mode }) => {
  const [feedback, setFeedback] = useState<'good' | 'bad' | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Use Cache Hook (Enable only for Select Mode where we need to find the image by title)
  const searchTitle = mode === 'select' ? result.title : undefined;
  const { url: tmdbPoster, loading: isLoading } = useTMDbImage(searchTitle);

  // Determine which image to show: TMDB priority, fallback to Unsplash (result.image)
  const displayPoster = tmdbPoster || result.image;

  // Play sound on mount
  useEffect(() => {
    audioManager.playResult();
  }, []);

  const encodedTitle = encodeURIComponent(result.title);

  // External Service URLs
  const googleSearchUrl = `https://www.google.com/search?q=${encodedTitle}+映画`;
  const amazonUrl = `https://www.amazon.co.jp/s?k=${encodedTitle}&i=instant-video`;
  const netflixUrl = `https://www.netflix.com/search?q=${encodedTitle}`;
  const tiktokUrl = `https://www.tiktok.com/search?q=${encodedTitle}`;

  const handleShare = async () => {
    const shareData = {
      title: 'Swappy - Movie Match',
      text: `🎬 Recommended: ${result.title}\n⚡ Match Rate: ${result.matchRate}%\n\nFind your movie match! #swappy #MovieMatch`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback to Twitter
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}`;
      window.open(twitterUrl, '_blank');
    }
  };

  const handleFeedback = (type: 'good' | 'bad') => {
    setFeedback(type);
    audioManager.playSkip(); // Use the short chirp as a click sound
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-end md:justify-center overflow-hidden">

      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0 bg-black">
        {/* Use displayPoster if available, otherwise Gradient */}
        {displayPoster ? (
          <AnimatePresence mode="popLayout">
            <motion.img
              key={displayPoster}
              src={displayPoster}
              alt={result.title}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 0.6, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>
        ) : (
          /* Fallback Gradient if absolutely no image matches */
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-black" />
        )}

        {/* Loading Spinner overlay */}
        {isLoading && !tmdbPoster && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px] z-10 transition-opacity duration-500">
            <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
          </div>
        )}

        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent md:bg-gradient-to-r md:from-[#050505] md:via-[#050505]/80 md:to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-black/40 mix-blend-multiply pointer-events-none" />
      </div>

      {/* Content Layer */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
        className="relative z-10 w-full max-w-2xl p-8 md:p-12 text-left flex flex-col items-start"
      >
        <div className="flex items-center gap-4 mb-2">
          {/* Match Rate Display - Only in Select Mode */}
          {mode !== 'random' && (
            <div className="flex items-center gap-1.5 text-cyan-400">
              <Zap size={14} className="fill-cyan-400" />
              <span className="text-sm font-bold tracking-widest font-mono">
                MATCH RATE: {result.matchRate}%
              </span>
            </div>
          )}

          <span className="text-slate-500 font-mono text-[10px] tracking-widest opacity-60 border-l border-slate-700 pl-4">
            ID: {path}
          </span>
        </div>

        <h1 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight drop-shadow-2xl w-full">
          {result.title}
        </h1>

        <p className="text-slate-200 text-sm md:text-lg leading-relaxed font-light mb-8 max-w-md drop-shadow-lg border-l-2 border-cyan-500 pl-4 bg-black/40 backdrop-blur-md py-3 pr-4 rounded-r-lg">
          {result.desc}
        </p>

        {/* Feedback Section */}
        <div className="flex items-center gap-4 mb-8">
          <span className="text-slate-400 text-xs md:text-sm font-mono tracking-wider">
            この結果は役に立ちましたか？
          </span>
          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => handleFeedback('good')}
              className={`p-2 rounded-full border transition-all duration-300 ${feedback === 'good'
                  ? 'bg-cyan-500 text-black border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.6)]'
                  : 'bg-slate-900/50 text-slate-400 border-slate-700 hover:text-cyan-400 hover:border-cyan-400'
                }`}
            >
              <ThumbsUp size={20} className={feedback === 'good' ? 'fill-current' : ''} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => handleFeedback('bad')}
              className={`p-2 rounded-full border transition-all duration-300 ${feedback === 'bad'
                  ? 'bg-pink-500 text-black border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.6)]'
                  : 'bg-slate-900/50 text-slate-400 border-slate-700 hover:text-pink-400 hover:border-pink-400'
                }`}
            >
              <ThumbsDown size={20} className={feedback === 'bad' ? 'fill-current' : ''} />
            </motion.button>
          </div>
        </div>

        {/* Main Actions Row */}
        <div className="flex flex-wrap gap-4 mb-6 w-full max-w-lg z-50">

          {/* RETRY BUTTON */}
          <button
            onClick={onReset}
            className="flex-1 min-w-[100px] group relative px-4 py-3 bg-white text-black overflow-hidden rounded-full font-bold tracking-wide flex items-center justify-center gap-2 hover:bg-cyan-50 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          >
            <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
            <span className="text-sm">RETRY</span>
          </button>

          {/* SHARE BUTTON */}
          <button
            onClick={handleShare}
            className="flex-1 min-w-[100px] px-4 py-3 bg-cyan-950/60 backdrop-blur border border-cyan-500/30 text-cyan-100 rounded-full font-medium tracking-wide flex items-center justify-center gap-2 hover:bg-cyan-900/80 transition-colors"
          >
            <span className="text-sm">SHARE</span>
            <Share2 size={16} />
          </button>

          {/* DETAILS BUTTON (With Hover Menu) */}
          <div
            className="relative flex-1 min-w-[120px]"
            onMouseEnter={() => setIsMenuOpen(true)}
            onMouseLeave={() => setIsMenuOpen(false)}
            onClick={() => setIsMenuOpen(!isMenuOpen)} // For Mobile
          >
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-full left-0 right-0 mb-4 p-2 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl grid grid-cols-2 gap-2"
                >
                  {/* Amazon Prime */}
                  <a
                    href={amazonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-2 bg-sky-900/30 border border-sky-500/30 rounded-xl hover:bg-sky-500/20 text-sky-400 transition-colors"
                    title="Amazon Prime"
                  >
                    <PlayCircle size={20} />
                    <span className="text-[9px] font-bold mt-1">PRIME</span>
                  </a>

                  {/* Netflix */}
                  <a
                    href={netflixUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-2 bg-red-900/30 border border-red-500/30 rounded-xl hover:bg-red-600/20 text-red-500 transition-colors"
                    title="Netflix"
                  >
                    <Tv size={20} />
                    <span className="text-[9px] font-bold mt-1">NETFLIX</span>
                  </a>

                  {/* TikTok */}
                  <a
                    href={tiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-2 bg-slate-800/50 border border-slate-600/50 rounded-xl hover:bg-slate-700/50 text-white transition-colors"
                    title="TikTok"
                  >
                    <Video size={20} />
                    <span className="text-[9px] font-bold mt-1">TIKTOK</span>
                  </a>

                  {/* Google */}
                  <a
                    href={googleSearchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-2 bg-slate-800/50 border border-slate-600/50 rounded-xl hover:bg-slate-700/50 text-slate-300 transition-colors"
                    title="Google"
                  >
                    <Search size={20} />
                    <span className="text-[9px] font-bold mt-1">GOOGLE</span>
                  </a>

                  {/* Decorator Arrow */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-3 h-3 bg-slate-900 rotate-45 border-r border-b border-slate-700"></div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              className={`w-full h-full px-4 py-3 backdrop-blur border rounded-full font-medium tracking-wide flex items-center justify-center gap-2 transition-all duration-300 ${isMenuOpen ? 'bg-cyan-500 text-black border-cyan-500' : 'bg-black/40 border-white/20 text-white hover:bg-black/60'}`}
            >
              <span className="text-sm">DETAILS</span>
              <ExternalLink size={16} />
            </button>
          </div>

        </div>

      </motion.div>
    </div>
  );
};