import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Crown, RefreshCw } from 'lucide-react';

interface VictoryModalProps {
  isOpen: boolean;
  onRestart: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({ isOpen, onRestart }) => {
  useEffect(() => {
    if (isOpen) {
      // Fire confetti burst
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Fallback gracefully
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
      <div className="royal-panel max-w-xl w-full p-8 md:p-10 rounded-2xl border-2 border-[var(--border-gold-strong)] text-center text-[var(--text-parchment)] shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Glow Header */}
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-amber-950 border-2 border-amber-400 flex items-center justify-center text-amber-300 shadow-2xl animate-bounce">
          <Trophy className="w-10 h-10" />
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-950/80 border border-amber-400/50 text-xs font-heading text-amber-300 mb-3">
          <Crown className="w-4 h-4 text-amber-400" />
          <span>DOMINANT KINGDOM VICTORY</span>
        </div>

        <h2 className="font-display text-4xl md:text-5xl font-bold text-gold-gradient text-gold-glow tracking-widest mb-3">
          SAMRAJYA UNIFIED!
        </h2>

        <p className="text-stone-300 text-xs md:text-sm leading-relaxed max-w-md mx-auto mb-8 font-heading">
          Your reign has unified ancient India. Rival empires have submitted to your throne, establishing peace, prosperity, and grand temple architecture across the 3D realm.
        </p>

        <button
          onClick={onRestart}
          className="btn-royal-primary px-10 py-4 text-sm font-bold tracking-widest shadow-2xl border-2 border-amber-400 flex items-center justify-center gap-2 mx-auto"
        >
          <RefreshCw className="w-4 h-4 text-amber-300" />
          <span>PLAY AGAIN</span>
        </button>

      </div>
    </div>
  );
};
