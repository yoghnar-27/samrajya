import React, { useState } from 'react';
import type { RulerType } from '../game/types';
import { RulerPreviewCanvas } from '../world/RulerPreviewCanvas';
import { Crown, ArrowRight, Sparkles } from 'lucide-react';

interface RulerSelectModalProps {
  onSelectRuler: (ruler: RulerType) => void;
  onBackToMenu: () => void;
}

export const RulerSelectModal: React.FC<RulerSelectModalProps> = ({
  onSelectRuler,
  onBackToMenu
}) => {
  const [selectedRuler, setSelectedRuler] = useState<RulerType>('KING');
  const [hoveredRuler, setHoveredRuler] = useState<RulerType | null>(null);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg">
      <div className="royal-panel max-w-3xl w-full p-6 md:p-10 rounded-xl shadow-2xl border border-[var(--border-gold-strong)] text-[var(--text-parchment)] relative overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-xs font-heading text-amber-300 mb-3">
            <Crown className="w-4 h-4 text-amber-400" />
            <span>ROYAL SOVEREIGN SELECTION</span>
          </div>

          <h2 className="font-display text-3xl md:text-5xl font-bold text-gold-gradient text-gold-glow tracking-widest">
            CHOOSE YOUR RULER
          </h2>
          <p className="text-stone-300/80 text-xs md:text-sm font-heading mt-2">
            Select your sovereign avatar to lead your civilization across ancient Indian lands.
          </p>
        </div>

        {/* KING & QUEEN CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          {/* KING CARD */}
          <div
            onClick={() => setSelectedRuler('KING')}
            onMouseEnter={() => setHoveredRuler('KING')}
            onMouseLeave={() => setHoveredRuler(null)}
            className={`royal-panel cursor-pointer p-5 rounded-lg border transition-all duration-300 relative flex flex-col items-center text-center ${
              selectedRuler === 'KING'
                ? 'border-amber-400 bg-amber-950/40 shadow-2xl scale-[1.02]'
                : 'border-stone-800 hover:border-amber-500/60 hover:bg-stone-900/60'
            }`}
          >
            {selectedRuler === 'KING' && (
              <div className="absolute top-3 right-3 text-amber-400 flex items-center gap-1 text-xs font-heading bg-amber-900/80 px-2.5 py-1 rounded-full border border-amber-400/50">
                <Sparkles className="w-3.5 h-3.5" />
                SELECTED
              </div>
            )}

            {/* 3D Preview Canvas */}
            <RulerPreviewCanvas
              rulerType="KING"
              isSelected={selectedRuler === 'KING'}
              isHovered={hoveredRuler === 'KING'}
            />

            <h3 className="font-display font-bold text-2xl text-[var(--text-gold-bright)] mt-2">
              SAMRAT (KING)
            </h3>
            <span className="text-xs font-heading text-amber-300/80 mb-2">
              Lapis Crowned Emperor & Field Commander
            </span>

            <p className="text-stone-300 text-xs leading-relaxed max-w-xs">
              Directs military battle formations, fortifies frontier citadels, and inspires front-line garrisons with martial valor.
            </p>
          </div>

          {/* QUEEN CARD */}
          <div
            onClick={() => setSelectedRuler('QUEEN')}
            onMouseEnter={() => setHoveredRuler('QUEEN')}
            onMouseLeave={() => setHoveredRuler(null)}
            className={`royal-panel cursor-pointer p-5 rounded-lg border transition-all duration-300 relative flex flex-col items-center text-center ${
              selectedRuler === 'QUEEN'
                ? 'border-amber-400 bg-amber-950/40 shadow-2xl scale-[1.02]'
                : 'border-stone-800 hover:border-amber-500/60 hover:bg-stone-900/60'
            }`}
          >
            {selectedRuler === 'QUEEN' && (
              <div className="absolute top-3 right-3 text-amber-400 flex items-center gap-1 text-xs font-heading bg-amber-900/80 px-2.5 py-1 rounded-full border border-amber-400/50">
                <Sparkles className="w-3.5 h-3.5" />
                SELECTED
              </div>
            )}

            {/* 3D Preview Canvas */}
            <RulerPreviewCanvas
              rulerType="QUEEN"
              isSelected={selectedRuler === 'QUEEN'}
              isHovered={hoveredRuler === 'QUEEN'}
            />

            <h3 className="font-display font-bold text-2xl text-[var(--text-gold-bright)] mt-2">
              SAMRAGYI (QUEEN)
            </h3>
            <span className="text-xs font-heading text-amber-300/80 mb-2">
              Sovereign Queen & Grand Strategist
            </span>

            <p className="text-stone-300 text-xs leading-relaxed max-w-xs">
              Master of royal trade alliances, temple architectural endowments, and diplomatic realm expansion.
            </p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-[var(--border-gold-subtle)] pt-6">
          <button
            onClick={onBackToMenu}
            className="btn-royal-secondary text-xs px-4 py-2.5"
          >
            BACK TO MENU
          </button>

          <button
            onClick={() => onSelectRuler(selectedRuler)}
            className="btn-royal-primary px-8 py-3 text-sm font-bold flex items-center gap-2"
          >
            <span>CONFIRM RULER & SELECT DYNASTY</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
