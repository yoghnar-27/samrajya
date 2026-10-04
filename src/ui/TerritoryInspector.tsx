import React from 'react';
import type { Territory } from '../game/types';
import { Shield, Coins, MapPin, X, Swords, Crown, Castle } from 'lucide-react';

interface TerritoryInspectorProps {
  territory: Territory | null;
  onClose: () => void;
}

const OWNER_NAMES: Record<string, { name: string; dynasty: string; color: string }> = {
  PLAYER: { name: 'Chola Dynasty', dynasty: 'Lords of Tanjore', color: 'text-red-400' },
  RIVAL_1: { name: 'Vijayanagara Empire', dynasty: 'City of Victory', color: 'text-amber-400' },
  RIVAL_2: { name: 'Mauryan Empire', dynasty: 'Imperial Pataliputra', color: 'text-blue-400' },
  NEUTRAL: { name: 'Independent Realm', dynasty: 'Neutral Territory', color: 'text-emerald-400' }
};

export const TerritoryInspector: React.FC<TerritoryInspectorProps> = ({ territory, onClose }) => {
  if (!territory) return null;

  const ownerInfo = OWNER_NAMES[territory.owner] || OWNER_NAMES.NEUTRAL;

  return (
    <div className="absolute top-20 right-4 z-30 max-w-sm w-full royal-panel p-5 rounded-lg border border-[var(--border-gold-strong)] text-[var(--text-parchment)] shadow-2xl animate-in fade-in slide-in-from-right duration-200 pointer-events-auto">
      
      {/* Header */}
      <div className="flex items-start justify-between border-b border-[var(--border-gold-subtle)] pb-3 mb-3">
        <div className="flex items-center gap-3">
          {territory.isCapital ? (
            <Crown className="w-6 h-6 text-amber-400 shrink-0" />
          ) : territory.type === 'FORT' ? (
            <Castle className="w-6 h-6 text-amber-300 shrink-0" />
          ) : (
            <MapPin className="w-6 h-6 text-amber-200 shrink-0" />
          )}
          <div>
            <h3 className="font-display font-bold text-lg text-[var(--text-gold-bright)] leading-tight">
              {territory.name}
            </h3>
            <span className={`text-xs font-heading font-semibold ${ownerInfo.color}`}>
              {ownerInfo.name} ({ownerInfo.dynasty})
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded text-stone-400 hover:text-amber-400 hover:bg-stone-800/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4 text-xs font-heading">
        <div className="bg-stone-900/70 p-3 rounded border border-stone-800 flex items-center gap-3">
          <Swords className="w-5 h-5 text-amber-400" />
          <div>
            <span className="text-stone-400 block text-[10px]">GARRISON STRENGTH</span>
            <span className="text-amber-200 font-bold text-sm">
              {territory.armyStrength} / {territory.maxStrength} Troops
            </span>
          </div>
        </div>

        <div className="bg-stone-900/70 p-3 rounded border border-stone-800 flex items-center gap-3">
          <Coins className="w-5 h-5 text-amber-400" />
          <div>
            <span className="text-stone-400 block text-[10px]">RESOURCE YIELD</span>
            <span className="text-amber-200 font-bold text-sm">
              +{territory.resources} Wealth/Turn
            </span>
          </div>
        </div>
      </div>

      {/* Type Info */}
      <div className="mb-4 text-xs leading-relaxed text-stone-300 bg-stone-950/50 p-3 rounded border border-stone-800/80">
        <span className="font-bold text-amber-300 block mb-1">
          {territory.type === 'CAPITAL'
            ? '❖ ROYAL CAPITAL CITADEL'
            : territory.type === 'FORT'
            ? '❖ FORTIFIED HILL BASTION (+2 Defensive Bonus)'
            : '❖ AGRICULTURAL & TRADE SETTLEMENT'}
        </span>
        <p className="text-stone-400">
          Connected via Pachisi trade highways to {territory.neighbors.length} neighboring regions.
        </p>
      </div>

      {/* Action Hint */}
      <div className="flex items-center justify-between pt-2 border-t border-[var(--border-gold-subtle)] text-[11px] text-amber-200/80 font-heading">
        <span className="flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-amber-400" />
          Camera Focused on {territory.name}
        </span>
        <button
          onClick={onClose}
          className="text-amber-400 hover:underline font-bold"
        >
          DESELECT
        </button>
      </div>

    </div>
  );
};
