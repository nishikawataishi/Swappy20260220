import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { audioManager } from './AudioManager';

export const Matching: React.FC = () => {
  useEffect(() => {
    // Optional: Play a sound effect repeatedly or a specific computing sound
    // For now, we reuse the skip sound to simulate data processing
    const interval = setInterval(() => {
        audioManager.playSkip();
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Background Grid / Effects */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-900/10 to-transparent animate-pulse" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full">
        
        {/* Animated Rings */}
        <div className="absolute pointer-events-none">
             <motion.div 
               className="w-64 h-64 md:w-96 md:h-96 border-4 border-cyan-500/30 rounded-full"
               animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5], rotate: 180 }}
               transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
             />
        </div>
        <div className="absolute pointer-events-none">
             <motion.div 
               className="w-48 h-48 md:w-72 md:h-72 border-2 border-pink-500/30 rounded-full border-dashed"
               animate={{ rotate: -180 }}
               transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
             />
        </div>

        {/* Text */}
        <motion.h1
          className="text-5xl md:text-8xl font-black text-white tracking-tighter italic"
          animate={{ 
            opacity: [1, 0.8, 1],
            textShadow: [
              "0 0 10px #06b6d4",
              "0 0 20px #ec4899",
              "0 0 10px #06b6d4"
            ],
            x: [0, -2, 2, 0] // Slight jitter/glitch
          }}
          transition={{ duration: 0.2, repeat: Infinity }}
        >
          MATCHING
        </motion.h1>

        {/* Loading Bar */}
        <div className="mt-8 w-64 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
           <motion.div 
             className="h-full bg-gradient-to-r from-cyan-500 via-white to-pink-500"
             initial={{ x: "-100%" }}
             animate={{ x: "100%" }}
             transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
           />
        </div>
        
        <motion.span 
          className="mt-4 font-mono text-cyan-400 text-xs tracking-widest"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          CALCULATING COMPATIBILITY...
        </motion.span>
      </div>
    </motion.div>
  );
};