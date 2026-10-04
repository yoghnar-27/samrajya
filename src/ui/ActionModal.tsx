import React from 'react';
import type { Territory } from '../game/types';
import { Swords, Shield, Flag, Compass, X } from 'lucide-react';

interface ActionModalProps {
  territory: Territory | null;
  onExplore: () => void;
  onAttack: () => void;
  onDefend: () => void;
  onCapture: () => void;
  onClose: () => void;
}

export const ActionModal: React.FC<ActionModalProps> = ({
  territory,
  onExplore,
  onAttack,
  onDefend,
  onCapture,
  onClose
}) => {
  if (!territory) return null;

  const isPlayerOwned = territory.owner === 'PLAYER';
  const isNeutral = territory.owner === 'NEUTRAL';
  const isRival = territory.owner === 'RIVAL_1' || territory.owner === 'RIVAL_2';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="royal-panel max-w-md w-full p-6 rounded-xl border-2 border-[var(--border-gold-strong)] text-[var(--text-parchment)] shadow-2xl relative animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-gold-subtle)] pb-3 mb-4">
          <div>
            <span className="text-[10px] font-heading text-amber-300 tracking-widest uppercase block">
              TACTICAL REGION COMMAND
            </span>
            <h3 className="font-display font-bold text-xl text-[var(--text-gold-bright)]">
              {territory.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-stone-400 hover:text-amber-400 hover:bg-stone-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-stone-300 font-heading mb-4">
          Select strategic action for your army garrison at this territory:
        </p>

        {/* Action Buttons Grid */}
        <div className="space-y-3 mb-4">
          
          {/* 1. EXPLORE */}
          <button
            onClick={onExplore}
            className="w-full royal-panel p-3 rounded-lg border border-stone-800 hover:border-amber-400/80 hover:bg-stone-900 flex items-center gap-3 text-left transition-all group"
          >
            <div className="w-9 h-9 rounded bg-amber-950 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="font-heading font-bold text-amber-200 text-sm block">
                EXPLORE & SCOUT
              </span>
              <span className="text-[11px] text-stone-400">
                Collect +30 wealth & reveal regional trade paths.
              </span>
            </div>
          </button>

          {/* 2. ATTACK (If rival territory) */}
          {isRival && (
            <button
              onClick={onAttack}
              className="w-full royal-panel p-3 rounded-lg border border-red-900/60 bg-red-950/40 hover:border-red-500 hover:bg-red-950/80 flex items-center gap-3 text-left transition-all group"
            >
              <div className="w-9 h-9 rounded bg-red-900 border border-red-500/60 flex items-center justify-center text-red-200 group-hover:scale-105 transition-transform">
                <Swords className="w-5 h-5" />
              </div>
              <div>
                <span className="font-heading font-bold text-red-300 text-sm block">
                  ASSAULT RIVAL GARRISON
                </span>
                <span className="text-[11px] text-stone-300">
                  Launch deterministic battle against rival forces ({territory.armyStrength} troops).
                </span>
              </div>
            </button>
          )}

          {/* 3. CAPTURE (If neutral or after victory) */}
          {isNeutral && (
            <button
              onClick={onCapture}
              className="w-full royal-panel p-3 rounded-lg border border-emerald-900/60 bg-emerald-950/40 hover:border-emerald-500 hover:bg-emerald-950/80 flex items-center gap-3 text-left transition-all group"
            >
              <div className="w-9 h-9 rounded bg-emerald-900 border border-emerald-500/60 flex items-center justify-center text-emerald-200 group-hover:scale-105 transition-transform">
                <Flag className="w-5 h-5" />
              </div>
              <div>
                <span className="font-heading font-bold text-emerald-300 text-sm block">
                  CAPTURE NEUTRAL REALM
                </span>
                <span className="text-[11px] text-stone-300">
                  Claim ownership and add {territory.name} to your empire.
                </span>
              </div>
            </button>
          )}

          {/* 4. DEFEND / FORTIFY (If player owned) */}
          {isPlayerOwned && (
            <button
              onClick={onDefend}
              className="w-full royal-panel p-3 rounded-lg border border-amber-900/60 hover:border-amber-400 hover:bg-stone-900 flex items-center gap-3 text-left transition-all group"
            >
              <div className="w-9 h-9 rounded bg-amber-950 border border-amber-500/60 flex items-center justify-center text-amber-300 group-hover:scale-105 transition-transform">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <span className="font-heading font-bold text-amber-300 text-sm block">
                  FORTIFY GARRISON DEFENSES
                </span>
                <span className="text-[11px] text-stone-300">
                  Add +2 defensive fortifications to fort wall.
                </span>
              </div>
            </button>
          )}

        </div>

      </div>
    </div>
  );
};
