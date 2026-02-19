import React from 'react';
import { motion } from 'framer-motion';
import { Film, Play, Shuffle } from 'lucide-react';
import { GameMode } from './types';
import { audioManager } from './AudioManager';

interface StartScreenProps {
  onStart: (mode: GameMode) => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const handleModeSelect = (mode: GameMode) => {
    audioManager.playSkip();
    onStart(mode);
  };

  return (
    <div className="relative w-full h-screen bg-[#050505] flex flex-col items-center justify-center overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#050505] to-slate-900 z-0" />
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] z-0 mix-blend-overlay" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-12 w-full max-w-md px-6">
        
        {/* Logo Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center"
        >
          <div className="flex items-center gap-3 mb-4">
            <Film className="text-cyan-400 w-12 h-12" />
            <span className="text-5xl md:text-7xl font-black tracking-tighter text-white">
              swappy
            </span>
          </div>
          <p className="text-cyan-500 font-mono tracking-[0.5em] text-sm md:text-base uppercase">
            Movie Match Engine
          </p>
        </motion.div>

        {/* Buttons Section */}
        <div className="flex flex-col gap-4 w-full">
          {/* Select Mode Button */}
          <motion.button
            onClick={() => handleModeSelect('select')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="group relative w-full px-8 py-5 bg-zinc-900 overflow-hidden rounded-full cursor-pointer border border-zinc-700 hover:border-cyan-500 transition-colors"
          >
            <div className="relative flex items-center justify-between">
              <div className="flex flex-col items-start">
                <span className="text-cyan-400 font-bold text-lg tracking-wide group-hover:text-white transition-colors flex items-center gap-2 font-mono">
                   <Play size={18} className="fill-current" /> SELECT MODE
                </span>
                <span className="text-zinc-500 text-xs text-left mt-1">2択で選ぶ一本</span>
              </div>
              <div className="w-8 h-8 rounded-full border border-zinc-600 flex items-center justify-center group-hover:bg-cyan-500 group-hover:border-cyan-500 transition-all">
                 <Play size={12} className="text-zinc-400 group-hover:text-black fill-current" />
              </div>
            </div>
          </motion.button>

          {/* Random Mode Button */}
          <motion.button
            onClick={() => handleModeSelect('random')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, type: "spring" }}
            className="group relative w-full px-8 py-5 bg-zinc-900 overflow-hidden rounded-full cursor-pointer border border-zinc-700 hover:border-pink-500 transition-colors"
          >
             <div className="relative flex items-center justify-between">
              <div className="flex flex-col items-start">
                <span className="text-pink-500 font-bold text-lg tracking-wide group-hover:text-white transition-colors flex items-center gap-2 font-mono">
                   <Shuffle size={18} /> RANDOM MODE
                </span>
                <span className="text-zinc-500 text-xs text-left mt-1">直感でスワイプして探す</span>
              </div>
              <div className="w-8 h-8 rounded-full border border-zinc-600 flex items-center justify-center group-hover:bg-pink-500 group-hover:border-pink-500 transition-all">
                 <Shuffle size={12} className="text-zinc-400 group-hover:text-black" />
              </div>
            </div>
          </motion.button>
        </div>
      </div>

      {/* Footer / Credits */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-6 flex flex-col items-center gap-4 text-center w-full px-6 z-20 pointer-events-none"
      >
        <div className="flex flex-col items-center gap-2 opacity-50 hover:opacity-100 transition-opacity duration-300 pointer-events-auto">
          {/* Official TMDb Logo URL from their asset CDN */}
          <img 
            src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg" 
            alt="TMDb Logo" 
            className="h-3 md:h-4 w-auto"
          />
          <p className="text-[9px] md:text-[10px] text-slate-500 font-sans max-w-[280px] leading-tight">
            This product uses the TMDB API but is not endorsed or certified by TMDB.
          </p>
        </div>
        
        {/* Copyright & Creator */}
        <div className="flex items-center gap-3 text-slate-600 text-[10px] md:text-xs font-mono font-medium">
          <span>© 2025 SWAPPY PROJECT</span>
          <span className="w-px h-3 bg-slate-700 opacity-50"></span>
          <span>Created by Nishikawa Taishi</span>
        </div>
      </motion.div>
    </div>
  );
};