import React from 'react';
import { ResultItem } from './types';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface BackCardProps {
  item: ResultItem;
}

export const BackCard: React.FC<BackCardProps> = ({ item }) => {
  // Use item.image directly (populated with TMDB URL in App.tsx)
  const displayImage = item.image;

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md h-[75vh] p-2 z-0 flex items-center justify-center pointer-events-none">
      {/* Container matching Card.tsx dimensions/radius for Random mode */}
      <div className="relative w-full h-full bg-zinc-900 rounded-[2rem] overflow-hidden shadow-2xl border border-zinc-800 opacity-60 scale-95 origin-center transition-all duration-300">

        {/* Poster Image */}
        {displayImage ? (
          <img
            src={displayImage}
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover grayscale-[0.3]"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-t from-black via-zinc-900 to-zinc-800" />
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        {/* Dimming Overlay to push it back visually */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Content Preview */}
        <div className="absolute bottom-0 w-full p-6 text-left flex flex-col gap-2 opacity-60">
          <h2 className="text-3xl font-black text-white leading-tight drop-shadow-md">
            {item.title}
          </h2>
          <p className="text-sm text-gray-300 line-clamp-2 drop-shadow-md">
            {item.desc}
          </p>

          <div className="flex items-center justify-between mt-4 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
            <div className="flex items-center gap-1"><ArrowLeft size={12} /> NOPE</div>
            <div className="flex items-center gap-1">DETAILS <ArrowRight size={12} /></div>
          </div>
        </div>
      </div>
    </div>
  );
};