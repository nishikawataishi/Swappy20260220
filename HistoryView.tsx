import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Heart, Zap, Slash, Trash2, Clock, Sparkles } from 'lucide-react';
import { historyManager, HistoryEntry } from './HistoryManager';
import { audioManager } from './AudioManager';

interface HistoryViewProps {
  onClose: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ onClose }) => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setHistory(historyManager.getHistory());
  }, []);

  const handleClear = () => {
    // Small timeout to ensure UI updates before alert blocks
    setTimeout(() => {
      if (window.confirm('履歴をすべて削除しますか？')) {
        historyManager.clear();
        setHistory([]);
        audioManager.playSkip();
      }
    }, 10);
  };

  const getIcon = (action: string) => {
    switch (action) {
      case 'like': return <Heart size={14} className="text-pink-500 fill-current" />;
      case 'match': return <Zap size={14} className="text-cyan-400 fill-current" />;
      case 'dislike': return <X size={14} className="text-red-500" />;
      case 'skip': return <Slash size={14} className="text-slate-500" />;
      default: return <Clock size={14} className="text-slate-500" />;
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'like': return 'LIKED';
      case 'match': return 'MATCHED';
      case 'dislike': return 'NOPE';
      case 'skip': return 'SKIPPED';
      default: return 'VIEWED';
    }
  };

  const getColor = (action: string) => {
    switch (action) {
      case 'like': return 'border-pink-500/30 bg-pink-950/10';
      case 'match': return 'border-cyan-500/30 bg-cyan-950/10';
      case 'dislike': return 'border-red-500/30 bg-red-950/10';
      default: return 'border-slate-700 bg-slate-900/50';
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="fixed inset-0 z-[100] flex justify-end bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-sm h-full bg-[#0a0a0a] border-l border-zinc-800 flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Clock className="text-cyan-500" size={20} />
              <h2 className="text-lg font-bold text-white tracking-widest font-mono">HISTORY</h2>
            </div>
            
            {/* Global AI Optimize Button (Header) - Visual Only */}
            <button 
               className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-600/20 border border-violet-500/30 text-violet-300 hover:bg-violet-600/30 hover:text-white transition-all group"
               title="履歴から好みを分析して最適化"
            >
               <Sparkles size={12} className="group-hover:animate-pulse" />
               <span className="text-[10px] font-bold tracking-wider">AI OPTIMIZE</span>
            </button>
          </div>

          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-4">
              <Clock size={48} className="opacity-20" />
              <p className="text-sm font-mono">NO HISTORY YET</p>
            </div>
          ) : (
            history.map((item, idx) => {
              return (
                <div 
                  key={`${item.timestamp}-${idx}`}
                  className={`flex items-center justify-between p-3 rounded-xl border ${getColor(item.action)} transition-all hover:bg-white/5`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-black/40 border border-white/5`}>
                      {getIcon(item.action)}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold text-white truncate pr-2">{item.movieTitle}</span>
                      <span className="text-[10px] text-slate-500 font-mono tracking-wider flex items-center gap-2">
                         {getActionLabel(item.action)} • {formatTime(item.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="p-4 border-t border-zinc-800 bg-zinc-900/50">
            <button
              onClick={handleClear}
              className="w-full py-3 flex items-center justify-center gap-2 text-xs font-bold text-red-400 bg-red-950/30 border border-red-900/50 rounded-lg hover:bg-red-900/50 hover:text-red-300 transition-colors active:scale-95 cursor-pointer"
            >
              <Trash2 size={14} />
              CLEAR HISTORY
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};