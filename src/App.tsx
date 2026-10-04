import { useState, useEffect } from 'react';
import { ThreeCanvas } from './world/ThreeCanvas';
import { MainMenu } from './ui/MainMenu';
import { RulerSelectModal } from './ui/RulerSelectModal';
import { CivSelectModal } from './ui/CivSelectModal';
import { InGameHUD } from './ui/InGameHUD';
import { CowrieResultOverlay } from './ui/CowrieResultOverlay';
import { ActionModal } from './ui/ActionModal';
import { BattleModal } from './ui/BattleModal';
import { AITurnOverlay } from './ui/AITurnOverlay';
import { ExileReclaimModal } from './ui/ExileReclaimModal';
import { VictoryModal } from './ui/VictoryModal';
import type { GamePhase, RulerType, CivilizationId, Territory, CowrieRoll, BattleReport } from './game/types';
import { INITIAL_TERRITORIES } from './data/territories';
import { rollCowries } from './utils/cowrie';
import { resolveBattle, executeAITurn } from './game/gameState';
import { Sparkles } from 'lucide-react';

export default function App() {
  const [phase, setPhase] = useState<GamePhase>('MAIN_MENU');
  const [ruler, setRuler] = useState<RulerType>('KING');
  const [civId, setCivId] = useState<CivilizationId>('CHOLA');
  const [territories, setTerritories] = useState<Territory[]>(INITIAL_TERRITORIES);
  const [selectedTerritory, setSelectedTerritory] = useState<Territory | null>(null);
  
  // Game Flow States
  const [isRollingCowries, setIsRollingCowries] = useState(false);
  const [cowrieRollResult, setCowrieRollResult] = useState<CowrieRoll | null>(null);
  const [showRollOverlay, setShowRollOverlay] = useState(false);
  const [movesRemaining, setMovesRemaining] = useState<number | null>(null);
  const [resources, setResources] = useState(120);
  
  // Army Marching Animation State
  const [movingArmy, setMovingArmy] = useState<{ sourceId: string; targetId: string } | null>(null);
  const [activeNotification, setActiveNotification] = useState<string | null>(null);

  // Phase 5 Strategic States
  const [actionTerritory, setActionTerritory] = useState<Territory | null>(null);
  const [activeBattleReport, setActiveBattleReport] = useState<BattleReport | null>(null);
  const [isAITurn, setIsAITurn] = useState(false);
  const [aiLog, setAiLog] = useState<string | null>(null);
  const [kingdomStatus, setKingdomStatus] = useState<'REIGNING' | 'EXILED'>('REIGNING');
  const [showVictory, setShowVictory] = useState(false);

  // Check Win Condition & Capital Defeat Status
  useEffect(() => {
    if (phase !== 'PLAYING') return;

    // Player Capital Check
    const cholaCapital = territories.find((t) => t.id === 't_chola_capital');
    if (cholaCapital && cholaCapital.owner !== 'PLAYER' && kingdomStatus === 'REIGNING') {
      setKingdomStatus('EXILED');
      setActiveNotification('Your royal capital has fallen! Ruler in exile.');
    }

    // Win Condition Check: Player controls >= 7 territories
    const playerTerritories = territories.filter((t) => t.owner === 'PLAYER');
    if (playerTerritories.length >= 7 && !showVictory) {
      setShowVictory(true);
    }
  }, [territories, phase, kingdomStatus, showVictory]);

  const handleStartReign = () => {
    setPhase('RULER_SELECT');
  };

  const handleConfirmRuler = (selectedRuler: RulerType) => {
    setRuler(selectedRuler);
    setPhase('CIV_SELECT');
  };

  const handleConfirmCiv = (selectedCiv: CivilizationId) => {
    setCivId(selectedCiv);
    setTerritories(JSON.parse(JSON.stringify(INITIAL_TERRITORIES)));
    setKingdomStatus('REIGNING');
    setShowVictory(false);
    setPhase('PLAYING');

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
    setTimeout(() => setActiveNotification(null), 4000);
  };

  // 1. THROW COWRIES TRIGGER
  const handleThrowCowries = () => {
    if (isRollingCowries || isAITurn) return;
    setIsRollingCowries(true);
    setShowRollOverlay(false);

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

  // 3. MAP TERRITORY SELECTION & ARMY MARCHING
  const handleSelectTerritory = (t: Territory | null) => {
    if (!t) {
      setSelectedTerritory(null);
      return;
    }

    // If army movement is active
    if (selectedTerritory && movesRemaining && movesRemaining > 0 && selectedTerritory.id !== t.id) {
      if (selectedTerritory.neighbors.includes(t.id)) {
        setMovingArmy({ sourceId: selectedTerritory.id, targetId: t.id });
        return;
      }
    }

    setSelectedTerritory(t);
  };

  // 4. ARMY MARCHING COMPLETE -> TRIGGER CONTEXTUAL ACTION MODAL
  const handleArmyMoveComplete = (_sourceId: string, targetId: string) => {
    const dstT = territories.find((t) => t.id === targetId);
    if (dstT) {
      setActionTerritory(dstT);
    }

    setMovingArmy(null);
    setMovesRemaining((prev) => (prev ? Math.max(0, prev - 1) : 0));
  };

  // 5. ACTION SYSTEM HANDLERS
  const handleExplore = () => {
    if (!actionTerritory) return;
    setResources((r) => r + 30);
    setActiveNotification(`Explored ${actionTerritory.name}: +30 Treasury Wealth!`);
    setActionTerritory(null);
    setTimeout(() => setActiveNotification(null), 3000);
    triggerAITurn();
  };

  const handleCapture = () => {
    if (!actionTerritory) return;
    setTerritories((prev) =>
      prev.map((t) => (t.id === actionTerritory.id ? { ...t, owner: 'PLAYER', armyStrength: 4 } : t))
    );
    setActiveNotification(`Captured ${actionTerritory.name}! Added to empire.`);
    setActionTerritory(null);
    setTimeout(() => setActiveNotification(null), 3000);
    triggerAITurn();
  };

  const handleDefend = () => {
    if (!actionTerritory) return;
    setTerritories((prev) =>
      prev.map((t) => (t.id === actionTerritory.id ? { ...t, armyStrength: t.armyStrength + 2 } : t))
    );
    setActiveNotification(`Fortified garrison at ${actionTerritory.name} (+2 Defense)!`);
    setActionTerritory(null);
    setTimeout(() => setActiveNotification(null), 3000);
    triggerAITurn();
  };

  const handleAttack = () => {
    if (!actionTerritory) return;
    const report = resolveBattle('PLAYER', actionTerritory.owner, actionTerritory, 6);
    setActiveBattleReport(report);
  };

  const handleCloseBattleReport = () => {
    if (activeBattleReport && activeBattleReport.territoryCaptured && actionTerritory) {
      setTerritories((prev) =>
        prev.map((t) => (t.id === actionTerritory.id ? { ...t, owner: 'PLAYER', armyStrength: 4 } : t))
      );
      setActiveNotification(`Assault Successful! Captured ${actionTerritory.name}.`);
    } else {
      setActiveNotification('Assault repelled by defender garrison.');
    }

    setActiveBattleReport(null);
    setActionTerritory(null);
    setTimeout(() => setActiveNotification(null), 3500);
    triggerAITurn();
  };

  // 6. STRATEGIC AI TURN LOOP
  const triggerAITurn = () => {
    setIsAITurn(true);
    setAiLog('Rival Vijayanagara Empire evaluating regional expansion...');

    setTimeout(() => {
      const { updatedTerritories, actionLog } = executeAITurn('RIVAL_1', territories);
      setTerritories(updatedTerritories);
      setAiLog(actionLog);

      setTimeout(() => {
        setIsAITurn(false);
        setAiLog(null);
      }, 2500);
    }, 1500);
  };

  // 7. SIGNATURE RECLAIM MECHANIC HANDLER
  const handleReclaimChallenge = () => {
    // Launch Imperial Reclaim Assault on Player Capital
    const cholaCapital = territories.find((t) => t.id === 't_chola_capital');
    if (!cholaCapital) return;

    // Attacker gets +2 Exile Reclaim perk
    const report = resolveBattle('PLAYER', cholaCapital.owner, cholaCapital, 8);
    setActiveBattleReport(report);

    // Reclaim successful
    setTerritories((prev) =>
      prev.map((t) => (t.id === 't_chola_capital' ? { ...t, owner: 'PLAYER', armyStrength: 8 } : t))
    );
    setKingdomStatus('REIGNING');
    setActiveNotification('KINGDOM RECLAIMED! Imperial Sovereign returns to the throne!');
    setTimeout(() => setActiveNotification(null), 5000);
  };

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
          resources={resources}
          territoryCount={territories.filter((t) => t.owner === 'PLAYER').length}
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

      {/* 7. CONTEXTUAL REGION ACTION MODAL */}
      <ActionModal
        territory={actionTerritory}
        onExplore={handleExplore}
        onAttack={handleAttack}
        onDefend={handleDefend}
        onCapture={handleCapture}
        onClose={() => setActionTerritory(null)}
      />

      {/* 8. BATTLE RESOLUTION MODAL */}
      <BattleModal
        report={activeBattleReport}
        onClose={handleCloseBattleReport}
      />

      {/* 9. VISIBLE AI TURN OVERLAY */}
      <AITurnOverlay
        isAITurn={isAITurn}
        aiLog={aiLog}
      />

      {/* 10. SIGNATURE EXILE RECLAIM MODAL */}
      <ExileReclaimModal
        isOpen={kingdomStatus === 'EXILED'}
        onReclaimChallenge={handleReclaimChallenge}
      />

      {/* 11. DOMINANT KINGDOM VICTORY MODAL */}
      <VictoryModal
        isOpen={showVictory}
        onRestart={() => handleConfirmCiv(civId)}
      />

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
