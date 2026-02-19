import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { audioManager } from './AudioManager';

interface IntroProps {
  onComplete: () => void;
}

export const Intro: React.FC<IntroProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<'enter' | 'zoom'>('enter');

  useEffect(() => {
    // Attempt to play sound immediately
    audioManager.playIntro().catch(() => {
      // Silent catch if autoplay is blocked
      console.log('Autoplay blocked');
    });

    // Start zoom phase after initial entrance
    const timer1 = setTimeout(() => {
      setStage('zoom');
    }, 2000);

    // Complete animation
    const timer2 = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black overflow-hidden"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      // Allow clicking to unblock audio context if needed
      onClick={() => audioManager.playIntro()}
    >
      <motion.div
        className="relative flex flex-col items-center justify-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={
          stage === 'enter'
            ? { scale: 1, opacity: 1 }
            : { scale: 30, opacity: 0 } // Zoom into the camera
        }
        transition={
          stage === 'enter'
            ? { duration: 1.2, ease: "easeOut" }
            : { duration: 0.4, ease: "easeIn" }
        }
      >
        <div className="flex items-center gap-1">
          {/* S Logo with "Netflix" style ribbon effect approximation using gradients */}
          <div className="relative w-20 h-28 md:w-32 md:h-44 mr-2 md:mr-4">
             <div className="absolute top-0 left-0 w-1/3 h-full bg-cyan-600 rounded-sm shadow-[0_0_20px_rgba(8,145,178,0.8)]" />
             <div className="absolute top-0 right-0 w-1/3 h-full bg-cyan-600 rounded-sm shadow-[0_0_20px_rgba(8,145,178,0.8)]" />
             <div className="absolute top-0 left-0 w-full h-full bg-cyan-400 transform -skew-x-[20deg] scale-x-50 origin-center z-10 shadow-[0_0_30px_rgba(34,211,238,0.8)] mix-blend-screen" />
          </div>

          <div className="flex flex-col justify-center">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white drop-shadow-2xl">
              SWAPPY
            </h1>
            <motion.div 
              className="h-1 md:h-2 bg-gradient-to-r from-cyan-500 via-white to-pink-500 rounded-full mt-2"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.8, duration: 0.8 }}
            />
          </div>
        </div>

        <motion.p
          className="mt-6 text-cyan-400 font-mono text-sm tracking-[0.5em] font-bold uppercase"
          initial={{ opacity: 0, y: 20 }}
          animate={stage === 'enter' ? { opacity: 1, y: 0 } : { opacity: 0 }}
          transition={{ delay: 1 }}
        >
          Movie Match
        </motion.p>
      </motion.div>
    </motion.div>
  );
};