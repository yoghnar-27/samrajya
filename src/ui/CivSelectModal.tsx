import React, { useState } from 'react';
import type { CivilizationId } from '../game/types';
import { CIVILIZATIONS } from '../data/civilizations';
import { Shield, ArrowRight, Check, Anchor, Gem, Landmark, Castle } from 'lucide-react';

interface CivSelectModalProps {
  onSelectCiv: (civId: CivilizationId) => void;
  onBackToRuler: () => void;
}

const CIV_ICONS: Record<CivilizationId, React.ReactNode> = {
  CHOLA: <Anchor className="w-8 h-8 text-red-400" />,
  VIJAYANAGARA: <Gem className="w-8 h-8 text-amber-400" />,
  MAURYA: <Landmark className="w-8 h-8 text-blue-400" />,
  RAJPUT: <Castle className="w-8 h-8 text-yellow-500" />
};

export const CivSelectModal: React.FC<CivSelectModalProps> = ({
  onSelectCiv,
  onBackToRuler
}) => {
  const [selectedCivId, setSelectedCivId] = useState<CivilizationId>('CHOLA');

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-lg overflow-y-auto">
      <div className="royal-panel max-w-5xl w-full p-6 md:p-10 rounded-2xl shadow-2xl border-2 border-[var(--border-gold-strong)] text-[var(--text-parchment)] relative overflow-hidden animate-in fade-in zoom-in duration-300 my-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/80 border border-amber-500/40 text-xs font-heading text-amber-300 mb-3">
            <Shield className="w-4 h-4 text-amber-400" />
            <span>HISTORICAL DYNASTY ALLIANCE</span>
          </div>

          <h2 className="font-display text-4xl md:text-6xl font-bold text-gold-gradient text-gold-glow tracking-widest">
            CHOOSE YOUR DYNASTY
          </h2>
          <p className="text-stone-300/90 text-xs md:text-sm font-heading mt-2 max-w-xl mx-auto">
            Select one of four historically inspired Indian empires to command across the 3D kingdom.
          </p>
        </div>

        {/* 2 x 2 SPACIOUS DYNASTY CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {Object.values(CIVILIZATIONS).map((civ) => {
            const isSelected = selectedCivId === civ.id;
            return (
              <div
                key={civ.id}
                onClick={() => setSelectedCivId(civ.id)}
                className={`royal-panel cursor-pointer p-6 md:p-7 rounded-xl border-2 transition-all duration-300 relative flex flex-col justify-between min-h-[220px] ${
                  isSelected
                    ? 'border-amber-400 bg-amber-950/60 shadow-2xl scale-[1.02] ring-2 ring-amber-400/40'
                    : 'border-stone-800 hover:border-amber-500/60 hover:bg-stone-900/70'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-lg bg-stone-950 border border-amber-500/30">
                        {CIV_ICONS[civ.id]}
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-2xl text-[var(--text-gold-bright)]">
                          {civ.name}
                        </h3>
                        <span className="text-xs font-heading text-stone-400 block">
                          {civ.dynasty}
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-8 h-8 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center font-bold shadow-lg">
                        <Check className="w-5 h-5 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  <p className="text-xs md:text-sm text-stone-300 leading-relaxed mb-4">
                    {civ.description}
                  </p>
                </div>

                <div className="border-t border-stone-800/80 pt-3 text-xs font-heading space-y-1.5">
                  <div className="flex justify-between text-stone-400">
                    <span>ARCHITECTURE:</span>
                    <span className="text-amber-200 font-semibold">{civ.architecturalStyle}</span>
                  </div>
                  <div className="flex justify-between text-stone-400">
                    <span>DYNASTY PERK:</span>
                    <span className="text-amber-400 font-bold">{civ.bonus}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-[var(--border-gold-subtle)] pt-6">
          <button
            onClick={onBackToRuler}
            className="btn-royal-secondary text-xs px-5 py-3"
          >
            CHANGE RULER
          </button>

          <button
            onClick={() => onSelectCiv(selectedCivId)}
            className="btn-royal-primary px-10 py-3.5 text-sm font-bold flex items-center gap-2 border-2 border-amber-400"
          >
            <span>BEGIN IMPERIAL REIGN</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
};
