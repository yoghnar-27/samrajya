import React, { useState, useEffect } from 'react';
import type { BattleReport } from '../game/types';
import { Swords, Trophy, Skull } from 'lucide-react';

interface BattleModalProps {
  report: BattleReport | null;
  onClose: () => void;
}

export const BattleModal: React.FC<BattleModalProps> = ({ report, onClose }) => {
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    if (report) {
      setAnimating(true);
      const timer = setTimeout(() => setAnimating(false), 1400);
      return () => clearTimeout(timer);
    }
  }, [report]);

  if (!report) return null;

  const isPlayerVictory = report.winner === 'PLAYER';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="royal-panel max-w-lg w-full p-6 md:p-8 rounded-xl border-2 border-[var(--border-gold-strong)] text-[var(--text-parchment)] text-center shadow-2xl relative animate-in fade-in zoom-in duration-200">
        
        {animating ? (
          <div className="py-10 flex flex-col items-center justify-center">
            <div className="relative mb-4">
              <Swords className="w-16 h-16 text-red-500 animate-bounce" />
              <div className="absolute inset-0 rounded-full bg-red-500/30 blur-xl animate-ping" />
            </div>
            <h3 className="font-display font-bold text-2xl text-amber-300 tracking-wider">
              ENGAGING RIVAL GARRISON...
            </h3>
            <p className="text-xs text-stone-400 font-heading mt-1">
              Resolving tactical battle rolls & terrain fort modifiers
            </p>
          </div>
        ) : (
          <div>
            {/* Header Result Badge */}
            <div className="flex items-center justify-center gap-3 mb-2">
              {isPlayerVictory ? (
                <Trophy className="w-8 h-8 text-amber-400" />
              ) : (
                <Skull className="w-8 h-8 text-red-500" />
              )}
            </div>

            <h2 className={`font-display text-4xl font-bold tracking-wider mb-2 ${
              isPlayerVictory ? 'text-gold-gradient text-gold-glow' : 'text-red-500'
            }`}>
              {isPlayerVictory ? 'VICTORY!' : 'DEFEAT'}
            </h2>

            <p className="text-xs text-stone-300 font-heading leading-relaxed mb-6">
              {report.message}
            </p>

            {/* Score Breakdown Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6 font-heading text-xs">
              
              <div className="bg-stone-900/80 p-4 rounded border border-stone-800">
                <span className="text-stone-400 block text-[10px] mb-1">ATTACKER FORCE</span>
                <div className="text-amber-300 font-bold text-lg">
                  {report.attackerStrength} Troops + Roll {report.attackerRoll}
                </div>
                <span className="text-amber-400/80 font-semibold block text-[11px] mt-1">
                  TOTAL: {report.attackerStrength + report.attackerRoll}
                </span>
              </div>

              <div className="bg-stone-900/80 p-4 rounded border border-stone-800">
                <span className="text-stone-400 block text-[10px] mb-1">DEFENDER GARRISON</span>
                <div className="text-red-300 font-bold text-lg">
                  {report.defenderStrength} Troops + Roll {report.defenderRoll}
                </div>
                <span className="text-red-400/80 font-semibold block text-[11px] mt-1">
                  TOTAL: {report.defenderStrength + report.defenderRoll}
                </span>
              </div>

            </div>

            {/* Confirm Button */}
            <button
              onClick={onClose}
              className="btn-royal-primary px-10 py-3 text-sm font-bold"
            >
              CONFIRM BATTLE OUTCOME
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
