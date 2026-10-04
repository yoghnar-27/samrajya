import React from 'react';
import type { CowrieRoll } from '../game/types';
import { getSpecialMove } from '../utils/cowrie';
import { Dices, Sparkles } from 'lucide-react';

interface CowrieResultOverlayProps {
  roll: CowrieRoll | null;
  onDismiss: () => void;
}

export const CowrieResultOverlay: React.FC<CowrieResultOverlayProps> = ({ roll, onDismiss }) => {
  if (!roll) return null;

  const specialBonus = getSpecialMove(roll.score);
  const openCount = roll.shells.filter(Boolean).length;

  return (
    <div className="absolute top-24 left-1/2 -translate-x-1/2 z-40 max-w-lg w-full px-4 pointer-events-auto animate-in fade-in slide-in-from-top-6 duration-300">
      <div className="royal-panel p-6 rounded-xl border-2 border-[var(--border-gold-strong)] text-center text-[var(--text-parchment)] shadow-2xl relative overflow-hidden bg-black/90">
        
        {/* Glow Header */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <Dices className="w-6 h-6 text-amber-400" />
          <span className="font-heading text-xs text-amber-300 tracking-widest uppercase">
            PACHISI COWRIE SHELL RESULT
          </span>
        </div>

        {/* Movement Steps Header */}
        <h2 className="font-display text-4xl md:text-5xl font-bold text-gold-gradient text-gold-glow mb-3">
          MOVEMENT: {roll.score} STEPS
        </h2>

        {/* Shell Aperture Visual Indicators */}
        <div className="flex items-center justify-center gap-3 my-4">
          {roll.shells.map((isOpen, idx) => (
            <div
              key={idx}
              className={`w-10 h-12 rounded-full border-2 flex flex-col items-center justify-center transition-all duration-300 ${
                isOpen
                  ? 'border-amber-400 bg-amber-950/80 shadow-lg shadow-amber-500/20 scale-105'
                  : 'border-stone-700 bg-stone-900/60 opacity-60'
              }`}
            >
              <div className={`w-3 h-7 rounded-full ${isOpen ? 'bg-amber-300 border border-amber-500' : 'bg-stone-700'}`} />
              <span className="text-[9px] font-heading text-stone-400 mt-1">
                {isOpen ? 'OPEN' : 'CLOSED'}
              </span>
            </div>
          ))}
        </div>

        {/* Special Grace Bonus Badge */}
        {specialBonus ? (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950 border border-amber-400 text-amber-300 text-xs font-heading font-semibold mb-4 animate-pulse">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{specialBonus}</span>
          </div>
        ) : (
          <p className="text-xs text-stone-300 font-heading mb-4">
            {openCount} Shells Opened • Select your army to execute movement across trade pathways.
          </p>
        )}

        {/* Dismiss / Execute Button */}
        <div>
          <button
            onClick={onDismiss}
            className="btn-royal-primary px-8 py-2.5 text-xs font-bold"
          >
            SELECT ARMY ON MAP
          </button>
        </div>

      </div>
    </div>
  );
};
