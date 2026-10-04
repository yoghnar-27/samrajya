import React from 'react';
import type { RulerType, CivilizationId, Territory } from '../game/types';
import { CIVILIZATIONS } from '../data/civilizations';
import { TerritoryInspector } from './TerritoryInspector';
import { Shield, Crown, Dices, Swords, MapPin, Coins, RefreshCw, Compass } from 'lucide-react';

interface InGameHUDProps {
  ruler: RulerType;
  civId: CivilizationId;
  selectedTerritory: Territory | null;
  onDeselectTerritory: () => void;
  onThrowCowriesClick: () => void;
  isRollingCowries: boolean;
  movesRemaining: number | null;
  resources: number;
  territoryCount: number;
  onBackToMenu: () => void;
}

export const InGameHUD: React.FC<InGameHUDProps> = ({
  ruler,
  civId,
  selectedTerritory,
  onDeselectTerritory,
  onThrowCowriesClick,
  isRollingCowries,
  movesRemaining,
  resources,
  territoryCount,
  onBackToMenu
}) => {
  const civ = CIVILIZATIONS[civId] || CIVILIZATIONS.CHOLA;
  const rulerTitle = ruler === 'KING' ? 'Samrat (Emperor)' : 'Samragyi (Empress)';

  return (
    <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-3 md:p-5 select-none">
      
      {/* 1. TOP BAR */}
      <div className="flex items-center justify-between w-full gap-4">
        
        {/* TOP LEFT */}
        <div className="pointer-events-auto royal-panel px-4 py-2.5 rounded flex items-center gap-3 border border-[var(--border-gold-subtle)]">
          <Crown className="w-6 h-6 text-amber-400 shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-lg text-gold-gradient tracking-wider">
                SAMRAJYA
              </h2>
              <span className="text-[10px] bg-amber-950/80 text-amber-300 px-2 py-0.5 rounded border border-amber-500/40 font-heading">
                {civ.name}
              </span>
            </div>
            <p className="text-xs text-stone-300 font-heading">
              {rulerTitle} • <span className="text-amber-300 font-semibold">PLAYER TURN</span>
            </p>
          </div>
        </div>

        {/* TOP RIGHT */}
        <div className="pointer-events-auto flex items-center gap-3">
          
          <div className="royal-panel px-3.5 py-2 rounded flex items-center gap-2.5 text-xs font-heading border border-[var(--border-gold-subtle)]">
            <MapPin className="w-4 h-4 text-amber-400" />
            <div>
              <span className="text-[10px] text-stone-400 block">REALMS</span>
              <span className="text-amber-200 font-bold">{territoryCount} / 14</span>
            </div>
          </div>

          <div className="royal-panel px-3.5 py-2 rounded flex items-center gap-2.5 text-xs font-heading border border-[var(--border-gold-subtle)]">
            <Swords className="w-4 h-4 text-red-400" />
            <div>
              <span className="text-[10px] text-stone-400 block">GARRISON</span>
              <span className="text-amber-200 font-bold">15 Troops</span>
            </div>
          </div>

          <div className="royal-panel px-3.5 py-2 rounded flex items-center gap-2.5 text-xs font-heading border border-[var(--border-gold-subtle)]">
            <Coins className="w-4 h-4 text-amber-400" />
            <div>
              <span className="text-[10px] text-stone-400 block">TREASURY</span>
              <span className="text-amber-200 font-bold">{resources} Wealth</span>
            </div>
          </div>

          <button
            onClick={onBackToMenu}
            className="btn-royal-secondary text-xs px-3 py-2"
          >
            MENU
          </button>
        </div>

      </div>

      {/* 2. MIDDLE REGION */}
      <div className="flex justify-between items-start w-full my-auto pointer-events-none">
        
        {/* LEFT COMPACT RULER PANEL */}
        <div className="pointer-events-auto royal-panel max-w-xs w-full p-4 rounded-lg border border-[var(--border-gold-subtle)] text-[var(--text-parchment)] shadow-xl">
          <div className="flex items-center gap-3 border-b border-stone-800 pb-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-amber-950 border border-amber-500/50 flex items-center justify-center text-amber-400 font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-[var(--text-gold-bright)]">
                {civ.dynasty}
              </h3>
              <span className="text-[10px] text-emerald-400 font-heading block">
                ● REIGNING MONARCH
              </span>
            </div>
          </div>

          <div className="text-xs font-heading space-y-2">
            {movesRemaining !== null && movesRemaining > 0 ? (
              <div className="bg-amber-950/90 p-2.5 rounded border border-amber-400/80 text-center animate-pulse">
                <span className="text-amber-300 font-bold text-sm block">
                  MOVEMENT POINTS: {movesRemaining}
                </span>
                <span className="text-[10px] text-stone-300 block mt-0.5">
                  Click army to march across trade pathways
                </span>
              </div>
            ) : (
              <div className="bg-stone-900/80 p-2 rounded border border-stone-800 text-[11px] text-amber-300">
                <span className="font-bold block mb-0.5 text-amber-400">DYNASTY BONUS:</span>
                {civ.bonus}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT CONTEXTUAL TERRITORY INSPECTOR */}
        {selectedTerritory && (
          <TerritoryInspector
            territory={selectedTerritory}
            onClose={onDeselectTerritory}
          />
        )}
      </div>

      {/* 3. BOTTOM CENTER */}
      <div className="pointer-events-auto self-center flex flex-col items-center gap-3">
        
        {/* Secondary Strategy Actions Bar */}
        <div className="royal-panel px-4 py-2 rounded-full flex items-center gap-2 text-xs font-heading border border-[var(--border-gold-subtle)] shadow-lg">
          <button className="px-3 py-1 rounded hover:bg-stone-800/80 text-stone-300 hover:text-amber-300 transition-colors flex items-center gap-1.5">
            <Swords className="w-3.5 h-3.5 text-amber-400" />
            MOVE ARMY
          </button>
          <div className="w-[1px] h-4 bg-stone-800" />
          <button className="px-3 py-1 rounded hover:bg-stone-800/80 text-stone-300 hover:text-amber-300 transition-colors flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            EXPLORE
          </button>
          <div className="w-[1px] h-4 bg-stone-800" />
          <button className="px-3 py-1 rounded hover:bg-stone-800/80 text-stone-300 hover:text-amber-300 transition-colors flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            FORTIFY
          </button>
          <div className="w-[1px] h-4 bg-stone-800" />
          <button className="px-3 py-1 rounded hover:bg-stone-800/80 text-stone-300 hover:text-amber-300 transition-colors flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            RECLAIM
          </button>
        </div>

        {/* Large Primary "THROW COWRIES" Button */}
        <button
          onClick={onThrowCowriesClick}
          disabled={isRollingCowries}
          className={`btn-royal-primary px-10 py-4 text-base font-bold tracking-widest shadow-2xl flex items-center gap-3 border-2 border-amber-400/80 ${
            isRollingCowries ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Dices className={`w-6 h-6 text-amber-300 ${isRollingCowries ? 'animate-spin' : 'animate-bounce'}`} />
          <span>{isRollingCowries ? 'ROLLING COWRIES...' : 'THROW COWRIES'}</span>
        </button>

      </div>

    </div>
  );
};
