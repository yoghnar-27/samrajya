import { useState } from 'react';
import { ThreeCanvas } from './world/ThreeCanvas';
import { MainMenu } from './ui/MainMenu';
import { RulerSelectModal } from './ui/RulerSelectModal';
import { CivSelectModal } from './ui/CivSelectModal';
import { InGameHUD } from './ui/InGameHUD';
import { CowrieResultOverlay } from './ui/CowrieResultOverlay';
import type { GamePhase, RulerType, CivilizationId, Territory, CowrieRoll } from './game/types';
import { INITIAL_TERRITORIES } from './data/territories';
import { rollCowries } from './utils/cowrie';
import { Sparkles } from 'lucide-react';

export default function App() {
  const [phase, setPhase] = useState<GamePhase>('MAIN_MENU');
  const [ruler, setRuler] = useState<RulerType>('KING');
  const [civId, setCivId] = useState<CivilizationId>('CHOLA');
  const [territories, setTerritories] = useState<Territory[]>(INITIAL_TERRITORIES);
  const [selectedTerritory, setSelectedTerritory] = useState<Territory | null>(null);
  
  // Cowrie Shell & Movement States
  const [isRollingCowries, setIsRollingCowries] = useState(false);
  const [cowrieRollResult, setCowrieRollResult] = useState<CowrieRoll | null>(null);
  const [showRollOverlay, setShowRollOverlay] = useState(false);
  const [movesRemaining, setMovesRemaining] = useState<number | null>(null);
  
  // Army Marching Animation State
  const [movingArmy, setMovingArmy] = useState<{ sourceId: string; targetId: string } | null>(null);
  const [activeNotification, setActiveNotification] = useState<string | null>(null);

  const handleStartReign = () => {
    setPhase('RULER_SELECT');
  };

  const handleConfirmRuler = (selectedRuler: RulerType) => {
    setRuler(selectedRuler);
    setPhase('CIV_SELECT');
  };

  const handleConfirmCiv = (selectedCiv: CivilizationId) => {
    setCivId(selectedCiv);
    setPhase('PLAYING');

    const capitalMap: Record<CivilizationId, string> = {
      CHOLA: 't_chola_capital',
      VIJAYANAGARA: 't_vijayanagara_capital',
      MAURYA: 't_maurya_capital',
      RAJPUT: 't_rajput_capital'
    };

    const targetCapital = territories.find((t) => t.id === capitalMap[selectedCiv]);
    if (targetCapital) {
      setSelectedTerritory(targetCapital);
    }

    setActiveNotification(`Entered ${selectedCiv} Realm — Throw cowries to move!`);
    setTimeout(() => setActiveNotification(null), 4500);
  };

  // 1. THROW COWRIES TRIGGER
  const handleThrowCowries = () => {
    if (isRollingCowries) return;
    setIsRollingCowries(true);
    setShowRollOverlay(false);

    // Generate Pachisi Cowrie Roll
    const result = rollCowries();
    setCowrieRollResult(result);
  };

  // 2. 3D SHELLS SETTLE COMPLETE
  const handleRollComplete = () => {
    setIsRollingCowries(false);
    setShowRollOverlay(true);
    if (cowrieRollResult) {
      setMovesRemaining(cowrieRollResult.score);
    }
  };

  // 3. MAP TERRITORY CLICK & ARMY MARCH SELECTION
  const handleSelectTerritory = (t: Territory | null) => {
    if (!t) {
      setSelectedTerritory(null);
      return;
    }

    // If player already has a selected army territory and movement points remaining
    if (selectedTerritory && movesRemaining && movesRemaining > 0 && selectedTerritory.id !== t.id) {
      // Check if clicked territory is a connected neighbor
      if (selectedTerritory.neighbors.includes(t.id)) {
        // Trigger Army Marching Animation along path!
        setMovingArmy({ sourceId: selectedTerritory.id, targetId: t.id });
        return;
      }
    }

    setSelectedTerritory(t);
  };

  // 4. ARMY MARCHING COMPLETE
  const handleArmyMoveComplete = (sourceId: string, targetId: string) => {
    const srcT = territories.find((t) => t.id === sourceId);
    const dstT = territories.find((t) => t.id === targetId);

    if (srcT && dstT) {
      // Update territory garrison states
      setTerritories((prev) =>
        prev.map((ter) => {
          if (ter.id === sourceId) {
            return { ...ter, armyStrength: Math.max(1, ter.armyStrength - 2) };
          }
          if (ter.id === targetId) {
            return { ...ter, armyStrength: ter.armyStrength + 2, owner: 'PLAYER' };
          }
          return ter;
        })
      );

      setActiveNotification(`Garrison marched from ${srcT.name} to ${dstT.name}!`);
      setTimeout(() => setActiveNotification(null), 4000);
    }

    setMovingArmy(null);
    setMovesRemaining((prev) => (prev ? Math.max(0, prev - 1) : 0));
  };

  // Valid target neighbors for currently selected territory
  const validTargets = selectedTerritory && movesRemaining && movesRemaining > 0
    ? selectedTerritory.neighbors
    : [];

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-body select-none">
      
      {/* 1. FULLSCREEN 3D VIEWPORT CANVAS */}
      <ThreeCanvas
        isMenuMode={phase === 'MAIN_MENU'}
        selectedTerritoryId={selectedTerritory?.id || null}
        onSelectTerritory={handleSelectTerritory}
        isRollingCowries={isRollingCowries}
        cowrieRollResult={cowrieRollResult}
        onRollComplete={handleRollComplete}
        movingArmy={movingArmy}
        onArmyMoveComplete={handleArmyMoveComplete}
        validTargets={validTargets}
      />

      {/* 2. MAIN MENU OVERLAY */}
      {phase === 'MAIN_MENU' && (
        <MainMenu onBeginReign={handleStartReign} />
      )}

      {/* 3. RULER SELECTION OVERLAY */}
      {phase === 'RULER_SELECT' && (
        <RulerSelectModal
          onSelectRuler={handleConfirmRuler}
          onBackToMenu={() => setPhase('MAIN_MENU')}
        />
      )}

      {/* 4. DYNASTY SELECTION OVERLAY */}
      {phase === 'CIV_SELECT' && (
        <CivSelectModal
          onSelectCiv={handleConfirmCiv}
          onBackToRuler={() => setPhase('RULER_SELECT')}
        />
      )}

      {/* 5. IN-GAME ROYAL STRATEGY HUD */}
      {phase === 'PLAYING' && (
        <InGameHUD
          ruler={ruler}
          civId={civId}
          selectedTerritory={selectedTerritory}
          onDeselectTerritory={() => setSelectedTerritory(null)}
          onThrowCowriesClick={handleThrowCowries}
          isRollingCowries={isRollingCowries}
          movesRemaining={movesRemaining}
          onBackToMenu={() => {
            setPhase('MAIN_MENU');
            setSelectedTerritory(null);
          }}
        />
      )}

      {/* 6. COWRIE ROLL RESULT OVERLAY */}
      {showRollOverlay && (
        <CowrieResultOverlay
          roll={cowrieRollResult}
          onDismiss={() => setShowRollOverlay(false)}
        />
      )}

      {/* CENTER TOAST NOTIFICATION */}
      {activeNotification && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-auto royal-panel border-amber-500/60 px-6 py-3 rounded-full flex items-center gap-3 text-amber-200 text-sm font-heading animate-in fade-in slide-in-from-top-4 duration-300 shadow-2xl">
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
          <span>{activeNotification}</span>
        </div>
      )}

    </div>
  );
}
