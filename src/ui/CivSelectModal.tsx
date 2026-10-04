import React, { useState } from 'react';
import type { CivilizationId } from '../game/types';
import { CIVILIZATIONS } from '../data/civilizations';
import { Shield, ArrowRight, Check, Castle, Anchor, Gem, Landmark } from 'lucide-react';

interface CivSelectModalProps {
  onSelectCiv: (civId: CivilizationId) => void;
  onBackToRuler: () => void;
}

const CIV_ICONS: Record<CivilizationId, React.ReactNode> = {
  CHOLA: <Anchor className="w-6 h-6 text-red-400" />,
  VIJAYANAGARA: <Gem className="w-6 h-6 text-amber-400" />,
  MAURYA: <Landmark className="w-6 h-6 text-blue-400" />,
  RAJPUT: <Castle className="w-6 h-6 text-yellow-500" />
};

export const CivSelectModal: React.FC<CivSelectModalProps> = ({
  onSelectCiv,
  onBackToRuler
}) => {
  const [selectedCivId, setSelectedCivId] = useState<CivilizationId>('CHOLA');

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg">
      <div className="royal-panel max-w-4xl w-full p-6 md:p-8 rounded-xl shadow-2xl border border-[var(--border-gold-strong)] text-[var(--text-parchment)] relative overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-xs font-heading text-amber-300 mb-2">
            <Shield className="w-4 h-4 text-amber-400" />
            <span>HISTORICAL DYNASTY ALLIANCE</span>
          </div>

          <h2 className="font-display text-3xl md:text-5xl font-bold text-gold-gradient text-gold-glow tracking-widest">
            CHOOSE YOUR DYNASTY
          </h2>
          <p className="text-stone-300/80 text-xs md:text-sm font-heading mt-1">
            Command one of four historically inspired Indian civilizations to rule the 3D kingdom.
          </p>
        </div>

        {/* 4 DYNASTY CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {Object.values(CIVILIZATIONS).map((civ) => {
            const isSelected = selectedCivId === civ.id;
            return (
              <div
                key={civ.id}
                onClick={() => setSelectedCivId(civ.id)}
                className={`royal-panel cursor-pointer p-5 rounded-lg border transition-all duration-200 relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-amber-400 bg-amber-950/50 shadow-2xl scale-[1.01]'
                    : 'border-stone-800 hover:border-amber-500/50 hover:bg-stone-900/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {CIV_ICONS[civ.id]}
                      <div>
                        <h3 className="font-display font-bold text-xl text-[var(--text-gold-bright)]">
                          {civ.name}
                        </h3>
                        <span className="text-[11px] font-heading text-stone-400 block">
                          {civ.dynasty}
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-7 h-7 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-stone-300 leading-relaxed mb-3">
                    {civ.description}
                  </p>
                </div>

                <div className="border-t border-stone-800/80 pt-2.5 mt-2 text-[11px] font-heading space-y-1">
                  <div className="flex justify-between text-stone-400">
                    <span>ARCHITECTURE:</span>
                    <span className="text-amber-200 text-right">{civ.architecturalStyle}</span>
                  </div>
                  <div className="flex justify-between text-stone-400">
                    <span>DYNASTY PERK:</span>
                    <span className="text-amber-400 font-semibold text-right">{civ.bonus}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-[var(--border-gold-subtle)] pt-5">
          <button
            onClick={onBackToRuler}
            className="btn-royal-secondary text-xs px-4 py-2.5"
          >
            CHANGE RULER
          </button>

          <button
            onClick={() => onSelectCiv(selectedCivId)}
            className="btn-royal-primary px-8 py-3 text-sm font-bold flex items-center gap-2"
          >
            <span>BEGIN IMPERIAL REIGN</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
