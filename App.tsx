import React, { useState, useEffect } from 'react';
import { QUESTIONS, getResult, getAllMovies } from './data';
import { getDiscoverMovies, getDiscoverTopRated, getDiscoverAnimeTopRated, getImageUrl } from './tmdb';
import { SwipeDirection, GameMode, ResultItem } from './types';
import { Card } from './Card';
import { BackCard } from './BackCard';
import { Result } from './Result';
import { Intro } from './Intro';
import { Matching } from './Matching';
import { StartScreen } from './StartScreen';
import { HistoryView } from './HistoryView';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronsUp, Film, X, Heart, Play, Shuffle, History } from 'lucide-react';
import { audioManager } from './AudioManager';
import { imageCache } from './ImageCache';
import { historyManager } from './HistoryManager';

type GameState = 'start' | 'intro' | 'playing' | 'matching' | 'result';

// Helper for direct URL preloading
const preloadImages = (urls: string[]) => {
  urls.forEach(url => {
    if (!url) return;
    const img = new Image();
    img.src = url;
  });
};

export default function App() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [mode, setMode] = useState<GameMode>('select');
  const [showHistory, setShowHistory] = useState(false);

  // Select Mode State
  const [path, setPath] = useState<string>("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectResult, setSelectResult] = useState<ResultItem | null>(null);

  // Random Mode State
  const [randomMovies, setRandomMovies] = useState<ResultItem[]>([]);
  const [randomMovieIndex, setRandomMovieIndex] = useState(0);
  const [selectedMovie, setSelectedMovie] = useState<ResultItem | null>(null);

  // Logic: Hybrid Stream (General & Anime) - Track pages separately
  const [fetchedGenPages, setFetchedGenPages] = useState<Set<number>>(new Set());
  const [fetchedAniPages, setFetchedAniPages] = useState<Set<number>>(new Set());
  const [isCmFetching, setIsCmFetching] = useState(false); // Lock for fetch

  const [direction, setDirection] = useState<SwipeDirection | null>(null);

  // Computed Values
  const currentQuestion = QUESTIONS[questionIndex];

  // For Random mode, we loop infinitely if needed by resetting index
  const currentRandomMovie = randomMovies[randomMovieIndex % randomMovies.length];
  // Calculate next movie for BackCard
  const nextRandomMovie = randomMovies.length > 0 ? randomMovies[(randomMovieIndex + 1) % randomMovies.length] : null;

  // --- HELPER: Fisher-Yates Shuffle ---
  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  // --- HELPER: Get Unique Random Page (1-25) ---
  const getNextRandomPage = (currentFetched: Set<number>): number => {
    // Top 500 roughly = 25 pages (20 per page). 
    const allPages = Array.from({ length: 25 }, (_, i) => i + 1);
    const available = allPages.filter(p => !currentFetched.has(p));

    if (available.length === 0) {
      // Reset if we exhausted top 500
      return Math.floor(Math.random() * 25) + 1;
    }

    const randomIndex = Math.floor(Math.random() * available.length);
    return available[randomIndex];
  };

  // --- HELPER: Fetch and Mix (General + Anime) ---
  const fetchHybridBatch = async (
    currentGenFetched: Set<number>,
    currentAniFetched: Set<number>
  ) => {
    const genPage = getNextRandomPage(currentGenFetched);
    const aniPage = getNextRandomPage(currentAniFetched);

    console.log(`[Hybrid Fetch] Gen Page: ${genPage}, Anime Page: ${aniPage}`);

    // Update State immediately to prevent re-fetch of same page
    const nextGenFetched = new Set(currentGenFetched);
    nextGenFetched.add(genPage);
    setFetchedGenPages(nextGenFetched);

    const nextAniFetched = new Set(currentAniFetched);
    nextAniFetched.add(aniPage);
    setFetchedAniPages(nextAniFetched);

    // Parallel Fetch (Use allSettled to prevent one failure from killing the other)
    const results = await Promise.allSettled([
      getDiscoverTopRated(genPage),
      getDiscoverAnimeTopRated(aniPage)
    ]);

    const genMovies = results[0].status === 'fulfilled' ? results[0].value : [];
    const aniMovies = results[1].status === 'fulfilled' ? results[1].value : [];

    if (results[0].status === 'rejected') console.error('Gen Fetch Error:', results[0].reason);
    if (results[1].status === 'rejected') console.error('Ani Fetch Error:', results[1].reason);

    // Filter
    const validGen = genMovies.filter(m => m.overview && m.overview.trim().length > 0);
    const validAni = aniMovies.filter(m => m.overview && m.overview.trim().length > 0);

    // Map to ResultItem
    const mapToResult = (m: any): ResultItem => ({
      title: m.title,
      desc: m.overview,
      image: getImageUrl(m.poster_path) || "",
      matchRate: Math.floor(m.vote_average * 10),
      tmdbId: m.id
    });

    const mappedGen = validGen.map(mapToResult);
    const mappedAni = validAni.map(mapToResult);

    // Combine
    let combined = [...mappedGen, ...mappedAni];

    // SHUFFLE to avoid pattern "Gen, Ani, Gen, Ani" or "All Gen then All Ani"
    combined = shuffleArray(combined);

    return combined;
  };

  // --- PRELOAD & BUFFERING LOGIC ---
  useEffect(() => {
    if (mode !== 'random' || randomMovies.length === 0) return;

    // 1. Background Buffering (Threshold: 10 items remaining)
    if (randomMovies.length - randomMovieIndex < 10 && !isCmFetching) {
      setIsCmFetching(true);

      fetchHybridBatch(fetchedGenPages, fetchedAniPages)
        .then(mixedMovies => {
          if (mixedMovies && mixedMovies.length > 0) {
            setRandomMovies(prev => {
              // 重複排除（iPhone特有のuseEffectの2回コールなどによるバグ防止）
              const existingIds = new Set(prev.map(m => m.tmdbId));
              const uniqueNewMovies = mixedMovies.filter(m => !existingIds.has(m.tmdbId));
              return [...prev, ...uniqueNewMovies];
            });
          }
        })
        .catch(err => {
          console.error('[HYBRID FETCH ERROR]', err);
          // エラーが起きても無限ロードにならないようロックを開放するのみ
        })
        .finally(() => {
          setIsCmFetching(false);
        });
    }

    // 2. Next 5 Images Preloading (Always ensure immediate next are ready)
    const urlsToPreload: string[] = [];
    for (let i = 1; i <= 5; i++) {
      const idx = (randomMovieIndex + i) % randomMovies.length;
      if (randomMovies[idx]) {
        urlsToPreload.push(randomMovies[idx].image);
      }
    }
    preloadImages(urlsToPreload);

  }, [mode, randomMovies.length, randomMovieIndex]);


  const handleStartGame = async (selectedMode: GameMode) => {
    // Unlock Audio Context on user interaction
    await audioManager.resume();
    setMode(selectedMode);

    // Always initialize random movies to ensure they are ready if user switches mode later
    if (randomMovies.length === 0) {
      if (selectedMode === 'random') {
        setIsCmFetching(true);
        try {
          // Initial Hybrid Fetch
          const mixedMovies = await fetchHybridBatch(new Set(), new Set());
          if (mixedMovies && mixedMovies.length > 0) {
            setRandomMovies(mixedMovies);
            // Immediate Preload (Only 5)
            preloadImages(mixedMovies.slice(0, 5).map(m => m.image));
          }
        } catch (err) {
          console.error('Initial start error', err);
        } finally {
          setIsCmFetching(false);
        }
      } else {
        // Fallback
      }
    }

    if (selectedMode === 'random') {
      setRandomMovieIndex(0);
    } else {
      setQuestionIndex(0);
      setPath("");
      setSelectResult(null);
    }

    setGameState('intro');
  };

  const handleModeSwitch = async (newMode: GameMode) => {
    if (mode === newMode) return;

    audioManager.playSkip(); // Click feedback

    // Ensure data exists if switching to random for the first time
    if (newMode === 'random' && randomMovies.length === 0) {
      setIsCmFetching(true);
      try {
        // Initial Hybrid Fetch
        const mixedMovies = await fetchHybridBatch(new Set(), new Set());
        if (mixedMovies && mixedMovies.length > 0) {
          setRandomMovies(mixedMovies);
          // Immediate Preload
          preloadImages(mixedMovies.slice(0, 5).map(m => m.image));
        }
      } catch (err) {
        console.error('Mode switch fetch error', err);
      } finally {
        setIsCmFetching(false);
      }
    }

    setMode(newMode);
  };

  const toggleHistory = () => {
    audioManager.playSkip();
    setShowHistory(!showHistory);
  };

  // Logic to handle the swipe outcome
  const handleSwipe = (dir: SwipeDirection) => {
    if (direction) return; // Prevent double swipes

    setDirection(dir);

    // Artificial delay to match the exit animation duration (400ms)
    setTimeout(() => {
      if (mode === 'select') {
        // --- SELECT MODE LOGIC ---
        // Play Sound
        if (dir === 'up') audioManager.playSkip();
        else audioManager.playSwipe();

        let choice = '';
        if (dir === 'left') {
          choice = 'L';
        } else if (dir === 'right') {
          choice = 'R';
        } else {
          // SKIP: Random choice for path logic
          choice = Math.random() > 0.5 ? 'L' : 'R';
        }

        const newPath = path + choice;
        setPath(newPath);

        // Check if this was the last question
        if (questionIndex + 1 >= QUESTIONS.length) {
          // Calculate Result
          const result = getResult(newPath);
          setSelectResult(result);

          // Save to History as a Match
          historyManager.saveInteraction(result, 'match');

          // Preload the result image immediately
          imageCache.preload([result.title]);

          // TRANSITION TO MATCHING
          setGameState('matching');

          // Wait for matching animation then show result (1.5s)
          setTimeout(() => {
            setQuestionIndex(prev => prev + 1); // Mark as finished index-wise
            setGameState('result');
          }, 1500);

          setDirection(null);
          return;
        }

        setQuestionIndex(prev => prev + 1);

      } else {
        // --- RANDOM MODE LOGIC ---
        // Right = Like (Select), Left/Up = Skip (Next)
        if (dir === 'right') {
          // Selected!
          // Save Like
          historyManager.saveInteraction(currentRandomMovie, 'like');

          setSelectedMovie(currentRandomMovie);

          // Ensure image is ready for result screen (should be already, but safe to call)
          imageCache.preload([currentRandomMovie.title]);

          setGameState('matching');

          setTimeout(() => {
            audioManager.playResult(); // Match sound when result appears
            setGameState('result');
          }, 1500);

          setDirection(null);
          return;
        } else {
          // Skip / Dislike
          audioManager.playSwipe();

          // If Left, count as dislike. If Up, count as skip.
          if (dir === 'left') {
            historyManager.saveInteraction(currentRandomMovie, 'dislike');
          } else {
            historyManager.saveInteraction(currentRandomMovie, 'skip');
          }

          setRandomMovieIndex(prev => prev + 1);
        }
      }

      setDirection(null);
    }, 400);
  };

  const handleReset = () => {
    audioManager.playSkip(); // Feedback sound for reset

    if (mode === 'select') {
      setQuestionIndex(0);
      setPath("");
      setSelectResult(null);
      setGameState('playing');
    } else {
      // For random mode, reset brings us back to swiping, maybe reshuffle or next
      setRandomMovieIndex(prev => prev + 1); // Just go next
      setGameState('playing');
    }

    setDirection(null);
  };

  const handleFullReset = () => {
    setGameState('start');
    setDirection(null);
  }

  // Programmatic trigger for buttons
  const triggerSwipe = (dir: SwipeDirection) => {
    handleSwipe(dir);
  };

  // Logic to determine active view
  const isMatching = gameState === 'matching';
  const showResult = gameState === 'result';

  // Precision progress
  const progressPercentage = Math.round((questionIndex / QUESTIONS.length) * 100);

  return (
    <div className="relative w-full h-[100dvh] bg-[#050505] text-white overflow-hidden flex flex-col">

      {/* History Modal */}
      <AnimatePresence>
        {showHistory && <HistoryView onClose={() => setShowHistory(false)} />}
      </AnimatePresence>

      {gameState === 'start' ? (
        <StartScreen onStart={handleStartGame} />
      ) : (
        <>
          {/* Intro Overlay */}
          <AnimatePresence>
            {gameState === 'intro' && (
              <Intro onComplete={() => setGameState('playing')} />
            )}
          </AnimatePresence>

          {/* Matching Overlay */}
          <AnimatePresence>
            {isMatching && (
              <Matching />
            )}
          </AnimatePresence>

          {/* Header */}
          <header className="absolute top-0 w-full p-6 z-50 grid grid-cols-3 items-center pointer-events-none">
            <div className="flex items-center gap-2 justify-start pointer-events-auto cursor-pointer group" onClick={handleFullReset}>
              <Film className="text-cyan-400 group-hover:text-cyan-300 transition-colors" size={24} />
              <span className="font-bold text-xl tracking-tighter hidden md:inline group-hover:text-cyan-300 transition-colors">swappy</span>
              <span className="text-[8px] text-zinc-600 font-mono ml-1 mt-2">v1.1</span>
            </div>

            {/* Center: Mode Toggle & Progress */}
            {!showResult && !isMatching && (
              <div className="flex flex-col items-center justify-center w-full pointer-events-auto z-50">
                {/* Mode Switcher - Circular Buttons */}
                <div className="flex items-center gap-6 mb-3">
                  {/* SELECT Button */}
                  <button
                    onClick={() => handleModeSwitch('select')}
                    className={`flex flex-col items-center gap-1 transition-all duration-300 ${mode === 'select' ? 'scale-110' : 'opacity-40 hover:opacity-80'}`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${mode === 'select' ? 'bg-cyan-600 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.6)]' : 'bg-slate-800 border-slate-600'}`}>
                      <Play size={20} className={`fill-current ${mode === 'select' ? 'text-white' : 'text-slate-400'}`} />
                    </div>
                    <span className={`text-[9px] font-bold tracking-widest font-mono ${mode === 'select' ? 'text-cyan-400' : 'text-slate-500'}`}>SELECT</span>
                  </button>

                  {/* RANDOM Button */}
                  <button
                    onClick={() => handleModeSwitch('random')}
                    className={`flex flex-col items-center gap-1 transition-all duration-300 ${mode === 'random' ? 'scale-110' : 'opacity-40 hover:opacity-80'}`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${mode === 'random' ? 'bg-pink-600 border-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.6)]' : 'bg-slate-800 border-slate-600'}`}>
                      <Shuffle size={20} className={`${mode === 'random' ? 'text-white' : 'text-slate-400'}`} />
                    </div>
                    <span className={`text-[9px] font-bold tracking-widest font-mono ${mode === 'random' ? 'text-pink-400' : 'text-slate-500'}`}>RANDOM</span>
                  </button>
                </div>

                {/* Progress Bar (Only visible in Select Mode) */}
                <div className={`w-full max-w-[100px] h-1 bg-slate-800 rounded-full overflow-hidden transition-opacity duration-300 ${mode === 'select' ? 'opacity-100' : 'opacity-0'}`}>
                  <motion.div
                    className="h-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.5, ease: "circOut" }}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end pointer-events-auto">
              <button
                onClick={toggleHistory}
                className="p-3 bg-zinc-900/50 backdrop-blur-sm border border-zinc-700 rounded-full text-slate-400 hover:text-white hover:bg-zinc-800 hover:border-cyan-500 transition-all active:scale-95 group"
                title="History"
              >
                <History size={20} className="group-hover:text-cyan-400 transition-colors" />
              </button>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 relative w-full max-w-md mx-auto flex flex-col items-center justify-center">
            <AnimatePresence mode='wait'>
              {showResult ? (
                <Result
                  key="result"
                  result={mode === 'select' ? selectResult! : selectedMovie!}
                  path={mode === 'select' ? path : `R-${randomMovieIndex}`}
                  onReset={handleReset}
                  mode={mode} // Pass mode
                />
              ) : !isMatching ? (
                <div className="relative w-full h-full">
                  {/* Back Card (Next Movie Preview - Random Mode Only) */}
                  {mode === 'random' && nextRandomMovie && (
                    <BackCard item={nextRandomMovie} />
                  )}

                  {/* Background Card Stack Effect (Visual only for Select Mode or general depth) */}
                  <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-zinc-800 rounded-3xl opacity-40 scale-95 border border-zinc-700 pointer-events-none transition-all duration-300 ${mode === 'random' ? 'hidden' : 'w-[90%] max-w-sm h-[60vh]'}`} />

                  {/* Active Card */}
                  {mode === 'random' && randomMovies.length === 0 ? (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md h-[75vh] flex flex-col items-center justify-center text-zinc-500 gap-4 bg-zinc-900/50 rounded-[2rem] border border-zinc-800 backdrop-blur-sm z-20">
                      <div className="w-8 h-8 border-2 border-zinc-700 border-t-pink-500 rounded-full animate-spin" />
                      <p className="text-xs font-bold tracking-widest font-mono text-pink-500/80">LOADING MOVIES...</p>
                      <button onClick={handleFullReset} className="mt-8 px-6 py-2 bg-zinc-800 rounded-full text-xs text-white hover:bg-zinc-700 transition">Cancel</button>
                    </div>
                  ) : (
                    <Card
                      key={mode === 'select' ? currentQuestion?.id : `movie-${randomMovieIndex}`}
                      item={mode === 'select' ? currentQuestion : currentRandomMovie}
                      mode={mode}
                      onSwipe={handleSwipe}
                      swipeDirection={direction}
                    />
                  )}
                </div>
              ) : null}
            </AnimatePresence>
          </main>

          {/* Footer Controls (Visible only during game) */}
          {!showResult && !isMatching && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-24 w-full max-w-md mx-auto px-6 pb-6 flex items-center justify-evenly z-50"
            >
              {/* Left Button (L or X) */}
              <button
                onClick={() => triggerSwipe('left')}
                className={`w-14 h-14 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center transition-all active:scale-95 shadow-lg ${mode === 'random' ? 'text-red-500 hover:border-red-500 hover:bg-red-950/20' : 'text-cyan-400 hover:border-cyan-500 hover:bg-cyan-950/20'}`}
              >
                {mode === 'random' ? <X size={24} /> : <span className="text-xl font-black font-mono">L</span>}
              </button>

              {/* Skip Button (Only show in Select Mode) */}
              {mode === 'select' && (
                <button
                  onClick={() => triggerSwipe('up')}
                  className="flex flex-col items-center justify-center gap-1 w-16 h-16 -mt-4 rounded-full bg-slate-800 border-2 border-slate-600 text-yellow-400 hover:bg-yellow-950/30 hover:border-yellow-500 transition-all active:scale-95 shadow-[0_0_15px_rgba(234,179,8,0.2)]"
                >
                  <ChevronsUp size={24} />
                  <span className="text-[10px] font-bold">SKIP</span>
                </button>
              )}

              {/* Right Button (R or Heart) */}
              <button
                onClick={() => triggerSwipe('right')}
                className={`w-14 h-14 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center transition-all active:scale-95 shadow-lg ${mode === 'random' ? 'text-green-500 hover:border-green-500 hover:bg-green-950/20' : 'text-pink-500 hover:border-pink-500 hover:bg-pink-950/20'}`}
              >
                {mode === 'random' ? <Heart size={24} className="fill-current" /> : <span className="text-xl font-black font-mono">R</span>}
              </button>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}