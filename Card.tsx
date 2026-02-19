import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useAnimation } from 'framer-motion';
import { Question, ResultItem, SwipeDirection, GameMode } from './types';
import { ArrowLeft, ArrowRight, ChevronsUp, Heart, X } from 'lucide-react';
import { useTMDbImage } from './ImageCache';

interface CardProps {
  item: Question | ResultItem;
  mode: GameMode;
  onSwipe: (direction: SwipeDirection) => void;
  swipeDirection: SwipeDirection | null;
}

export const Card: React.FC<CardProps> = ({ item, mode, onSwipe, swipeDirection }) => {
  const controls = useAnimation();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const { url: tmdbPoster, loading: isLoading } = useTMDbImage(undefined);

  // Rotation based on X movement
  const rotate = useTransform(x, [-200, 200], [-15, 15]);

  // Opacity/Scale interactions
  const scale = useTransform(x, [-200, 0, 200], [0.95, 1, 0.95]);

  // Color Overlay Opacity
  const opacityLeft = useTransform(x, [-150, -20], [0.8, 0]);
  const opacityRight = useTransform(x, [20, 150], [0, 0.8]);
  const opacityUp = useTransform(y, [-150, -50], [0.8, 0]);

  useEffect(() => {
    if (swipeDirection) {
      const transition = { duration: 0.4, ease: "easeInOut" as const };
      if (swipeDirection === 'left') {
        controls.start({ x: -500, rotate: -15, opacity: 0, transition });
      } else if (swipeDirection === 'right') {
        controls.start({ x: 500, rotate: 15, opacity: 0, transition });
      } else if (swipeDirection === 'up') {
        controls.start({ y: -1000, opacity: 0, transition });
      }
    } else {
      // Entry Animation
      controls.start({
        x: 0,
        y: 0,
        opacity: 1,
        scale: 1,
        rotate: 0,
        transition: { type: 'spring', stiffness: 300, damping: 25 }
      });
    }
  }, [swipeDirection, controls, item]);

  const handleDragEnd = async (event: any, info: any) => {
    const threshold = 100;
    const velocity = info.velocity.x;
    const yVelocity = info.velocity.y;

    // Check Swipe Up (Skip)
    if (info.offset.y < -threshold || yVelocity < -500) {
      await controls.start({ y: -1000, opacity: 0, transition: { duration: 0.4 } });
      onSwipe('up');
    }
    // Check Swipe Left
    else if (info.offset.x < -threshold || velocity < -500) {
      await controls.start({ x: -500, rotate: -15, opacity: 0, transition: { duration: 0.4 } });
      onSwipe('left');
    }
    // Check Swipe Right
    else if (info.offset.x > threshold || velocity > 500) {
      await controls.start({ x: 500, rotate: 15, opacity: 0, transition: { duration: 0.4 } });
      onSwipe('right');
    }
    // Reset
    else {
      controls.start({ x: 0, y: 0, rotate: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } });
    }
  };

  const isQuestion = (itm: any): itm is Question => {
    return mode === 'select';
  };

  return (
    <motion.div
      ref={cardRef}
      className={`absolute top-0 left-0 w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing perspective-1000 ${mode === 'random' ? 'p-2' : 'p-4'}`}
      style={{ x, y, rotate, scale, zIndex: 10 }}
      drag={swipeDirection === null}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragStart={() => setDragStart({ x: x.get(), y: y.get() })}
      onDragEnd={handleDragEnd}
      animate={controls}
      // Fix glitch in Random Mode: Start fully opaque to cover the "2nd next" BackCard behind it
      initial={mode === 'random'
        ? { scale: 0.95, opacity: 1, y: 0, x: 0 } // Start opaque to hide card behind
        : { scale: 0.9, opacity: 0, y: 50 }
      }
      exit={{ scale: 0.9, opacity: 0 }}
    >
      <div className={`relative overflow-hidden flex flex-col shadow-2xl select-none border border-zinc-800 transition-all duration-300 ${mode === 'random' ? 'w-full max-w-md h-[75vh] bg-black rounded-[2rem]' : 'w-full max-w-sm h-[60vh] bg-zinc-900 rounded-3xl'}`}>

        {/* --- Feedback Overlays --- */}
        {/* LEFT OVERLAY */}
        <motion.div
          style={{ opacity: opacityLeft }}
          className={`absolute inset-0 z-30 pointer-events-none flex items-center justify-center ${mode === 'select' ? 'bg-cyan-600' : 'bg-rose-600'}`}
        >
          {mode === 'random' && <X size={100} className="text-white drop-shadow-lg" />}
        </motion.div>

        {/* RIGHT OVERLAY */}
        <motion.div
          style={{ opacity: opacityRight }}
          className={`absolute inset-0 z-30 pointer-events-none flex items-center justify-center ${mode === 'select' ? 'bg-rose-600' : 'bg-emerald-600'}`}
        >
          {mode === 'random' && <Heart size={100} className="text-white fill-white drop-shadow-lg" />}
        </motion.div>

        {/* UP OVERLAY (Skip) */}
        <motion.div
          style={{ opacity: opacityUp }}
          className="absolute inset-0 z-30 bg-slate-500 pointer-events-none flex items-center justify-center"
        >
          <ChevronsUp size={100} className="text-white drop-shadow-lg" />
        </motion.div>

        {/* --- Content Logic --- */}
        {isQuestion(item) ? (
          // === SELECT MODE LAYOUT ===
          <div className="flex-1 flex flex-col items-center justify-between p-6 text-center bg-zinc-900 text-white relative z-20 w-full h-full">

            {/* Question Section */}
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="text-7xl mb-6 opacity-30 grayscale contrast-150 animate-pulse">
                {item.icon}
              </div>
              <h2 className="text-2xl md:text-3xl font-black leading-tight drop-shadow-lg mb-4">
                {item.text}
              </h2>
            </div>

            {/* Choices Section - Integrated into card */}
            <div className="w-full grid grid-cols-2 gap-3 mt-4">
              {/* Left Choice */}
              <div className="flex flex-col items-center justify-center p-4 bg-zinc-800/50 rounded-2xl border border-zinc-700/50 group hover:border-cyan-500/50 transition-colors">
                <div className="flex items-center gap-2 mb-2 text-cyan-400 opacity-80">
                  <ArrowLeft size={16} />
                  <span className="text-[10px] font-bold tracking-widest">LEFT</span>
                </div>
                <span className="text-base font-bold text-white leading-tight">{item.L.label}</span>
                <span className="text-[10px] text-zinc-500 mt-1">{item.L.sub}</span>
              </div>

              {/* Right Choice */}
              <div className="flex flex-col items-center justify-center p-4 bg-zinc-800/50 rounded-2xl border border-zinc-700/50 group hover:border-pink-500/50 transition-colors">
                <div className="flex items-center gap-2 mb-2 text-pink-400 opacity-80">
                  <span className="text-[10px] font-bold tracking-widest">RIGHT</span>
                  <ArrowRight size={16} />
                </div>
                <span className="text-base font-bold text-white leading-tight">{item.R.label}</span>
                <span className="text-[10px] text-zinc-500 mt-1">{item.R.sub}</span>
              </div>
            </div>

          </div>
        ) : (
          // === RANDOM MODE LAYOUT (Movie Poster) ===
          (() => {
            const movie = item as ResultItem;
            // Determine which image to show:
            // For Random Mode, item.image is now the full TMDB URL passed from App.tsx
            const displayImage = movie.image;

            return (
              <div className="relative w-full h-full bg-zinc-900">
                {isLoading && !displayImage ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-zinc-700 border-t-zinc-400 rounded-full animate-spin" />
                  </div>
                ) : displayImage ? (
                  <motion.img
                    key={displayImage}
                    src={displayImage}
                    alt={movie.title}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  /* Fallback Gradient if absolutely everything fails */
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-zinc-900 to-zinc-800" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />

                <div className="absolute bottom-0 w-full p-6 text-left flex flex-col gap-2 z-10">
                  <h2 className="text-3xl font-black text-white leading-tight drop-shadow-md">
                    {movie.title}
                  </h2>
                  <p className="text-sm text-gray-200 line-clamp-2 drop-shadow-md opacity-90">
                    {movie.desc}
                  </p>

                  <div className="flex items-center justify-between mt-4 text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                    <div className="flex items-center gap-1"><ArrowLeft size={12} /> NOPE</div>
                    <div className="flex items-center gap-1">DETAILS <ArrowRight size={12} /></div>
                  </div>
                </div>
              </div>
            );
          })()
        )}

      </div>
    </motion.div>
  );
};