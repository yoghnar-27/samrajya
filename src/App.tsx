import { useState } from 'react';
import { ThreeCanvas } from './world/ThreeCanvas';
import { MainMenu } from './ui/MainMenu';
import { RulerSelectModal } from './ui/RulerSelectModal';
import { CivSelectModal } from './ui/CivSelectModal';
import { InGameHUD } from './ui/InGameHUD';
import type { GamePhase, RulerType, CivilizationId, Territory } from './game/types';
import { INITIAL_TERRITORIES } from './data/territories';
import { Sparkles } from 'lucide-react';

export default function App() {
  const [phase, setPhase] = useState<GamePhase>('MAIN_MENU');
  const [ruler, setRuler] = useState<RulerType>('KING');
  const [civId, setCivId] = useState<CivilizationId>('CHOLA');
  const [selectedTerritory, setSelectedTerritory] = useState<Territory | null>(null);
  const [activeNotification, setActiveNotification] = useState<string | null>(null);

  // Transition 1: Main Menu -> Ruler Selection
  const handleStartReign = () => {
    setPhase('RULER_SELECT');
  };

  // Transition 2: Ruler Selection -> Dynasty Selection
  const handleConfirmRuler = (selectedRuler: RulerType) => {
    setRuler(selectedRuler);
    setPhase('CIV_SELECT');
  };

  // Transition 3: Dynasty Selection -> Enter 3D World Play
  const handleConfirmCiv = (selectedCiv: CivilizationId) => {
    setCivId(selectedCiv);
    setPhase('PLAYING');

    // Auto focus camera on the chosen civilization's capital
    const capitalMap: Record<CivilizationId, string> = {
      CHOLA: 't_chola_capital',
      VIJAYANAGARA: 't_vijayanagara_capital',
      MAURYA: 't_maurya_capital',
      RAJPUT: 't_rajput_capital'
    };

    const targetCapital = INITIAL_TERRITORIES.find((t) => t.id === capitalMap[selectedCiv]);
    if (targetCapital) {
      setSelectedTerritory(targetCapital);
    }

    setActiveNotification(`Entered ${selectedCiv} Realm — Empire Established!`);
    setTimeout(() => setActiveNotification(null), 4500);
  };

  const handleThrowCowries = () => {
    setActiveNotification('Cowrie shell mechanics ready for Phase 4!');
    setTimeout(() => setActiveNotification(null), 3000);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-body select-none">
      
      {/* 1. FULLSCREEN 3D VIEWPORT CANVAS */}
      <ThreeCanvas
        isMenuMode={phase === 'MAIN_MENU'}
        selectedTerritoryId={selectedTerritory?.id || null}
        onSelectTerritory={(t) => setSelectedTerritory(t)}
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
          onBackToMenu={() => {
            setPhase('MAIN_MENU');
            setSelectedTerritory(null);
          }}
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
