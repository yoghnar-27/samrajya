import React from 'react';
import { X, Crown, Compass, ShieldAlert, Sparkles } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="royal-panel max-w-2xl w-full p-6 md:p-8 rounded-lg shadow-2xl border border-[var(--border-gold-strong)] text-[var(--text-parchment)] relative overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-gold-subtle)] pb-4 mb-4">
          <div className="flex items-center gap-3">
            <Crown className="w-6 h-6 text-[var(--accent-gold)]" />
            <h2 className="font-display text-xl md:text-2xl text-[var(--text-gold-bright)] tracking-wider">
              HOW TO PLAY SAMRAJYA
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded text-stone-400 hover:text-amber-400 hover:bg-stone-800/60 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-5 text-sm md:text-base leading-relaxed overflow-y-auto max-h-[65vh] pr-2">
          
          <div className="flex gap-4 items-start bg-stone-900/60 p-4 rounded border border-stone-800">
            <Compass className="w-6 h-6 text-amber-400 shrink-0 mt-1" />
            <div>
              <h3 className="font-heading font-semibold text-amber-300 text-base mb-1">
                1. Pachisi Cowrie Movement
              </h3>
              <p className="text-stone-300">
                Roll six traditional cowrie shells to generate movement points. Open shell mouths determine your roll outcome—ranging from 1 to 25 steps across royal trade pathways.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start bg-stone-900/60 p-4 rounded border border-stone-800">
            <Crown className="w-6 h-6 text-amber-400 shrink-0 mt-1" />
            <div>
              <h3 className="font-heading font-semibold text-amber-300 text-base mb-1">
                2. Civilization & Territory Expansion
              </h3>
              <p className="text-stone-300">
                Command historical dynasties (Chola, Vijayanagara, Maurya, Rajput). Dispatch royal garrisons to conquer neutral villages, forts, and strategic crossroads to expand your realm.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start bg-stone-900/60 p-4 rounded border border-stone-800">
            <ShieldAlert className="w-6 h-6 text-amber-400 shrink-0 mt-1" />
            <div>
              <h3 className="font-heading font-semibold text-amber-300 text-base mb-1">
                3. Deterministic Battle System
              </h3>
              <p className="text-stone-300">
                Engage rival armies in battle! Combat resolves using army count, terrain bonuses (forts grant +2 defense), and tactical dice modifiers.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start bg-amber-950/40 p-4 rounded border border-amber-600/40">
            <Sparkles className="w-6 h-6 text-amber-400 shrink-0 mt-1" />
            <div>
              <h3 className="font-heading font-semibold text-amber-300 text-base mb-1">
                4. The Reclaim Comeback Mechanic
              </h3>
              <p className="text-stone-300">
                If your capital is taken by a rival, your ruler goes into exile—NOT game over! Launch an exiled rebellion challenge to reclaim your crown and win back your kingdom.
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-[var(--border-gold-subtle)] flex justify-end">
          <button 
            onClick={onClose}
            className="btn-royal-primary px-8 py-2.5 text-sm"
          >
            UNDERSTOOD
          </button>
        </div>

      </div>
    </div>
  );
};
