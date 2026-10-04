import type { Territory, TerritoryOwner, BattleReport, RulerType, CivilizationId } from './types';
import { INITIAL_TERRITORIES } from '../data/territories';

export interface GameStateData {
  ruler: RulerType;
  civId: CivilizationId;
  turn: TerritoryOwner; // 'PLAYER' | 'RIVAL_1' | 'RIVAL_2' | 'NEUTRAL'
  territories: Territory[];
  resources: number;
  movesRemaining: number;
  kingdomStatus: 'REIGNING' | 'EXILED';
  activeBattleReport: BattleReport | null;
  winner: TerritoryOwner | null;
  logs: string[];
}

export const initialGameState = (ruler: RulerType, civId: CivilizationId): GameStateData => ({
  ruler,
  civId,
  turn: 'PLAYER',
  territories: JSON.parse(JSON.stringify(INITIAL_TERRITORIES)),
  resources: 120,
  movesRemaining: 0,
  kingdomStatus: 'REIGNING',
  activeBattleReport: null,
  winner: null,
  logs: ['SAMRAJYA reign initiated. Command your armies across ancient India.']
});

/**
 * Deterministic Battle Engine:
 * Attacker Roll (1-6) + Attacker Strength vs Defender Roll (1-6) + Defender Strength + Terrain Bonus
 */
export function resolveBattle(
  attackerOwner: TerritoryOwner,
  defenderOwner: TerritoryOwner,
  territory: Territory,
  attackerTroops: number
): BattleReport {
  const attackerRoll = Math.floor(Math.random() * 6) + 1;
  const defenderRoll = Math.floor(Math.random() * 6) + 1;

  // Forts grant +2 defensive bonus
  const defenseModifier = territory.type === 'FORT' || territory.isCapital ? 2 : 0;

  const totalAttackerScore = attackerRoll + attackerTroops;
  const totalDefenderScore = defenderRoll + territory.armyStrength + defenseModifier;

  const isAttackerWinner = totalAttackerScore >= totalDefenderScore;
  const winner = isAttackerWinner ? attackerOwner : defenderOwner;

  let message = '';
  if (isAttackerWinner) {
    message = `Victorious Assault! Attacker score ${totalAttackerScore} defeated defender score ${totalDefenderScore}.`;
  } else {
    message = `Repelled! Defender garrison score ${totalDefenderScore} held against attacker score ${totalAttackerScore}.`;
  }

  return {
    attackerId: attackerOwner,
    defenderId: defenderOwner,
    territoryId: territory.id,
    attackerRoll,
    defenderRoll,
    attackerStrength: attackerTroops,
    defenderStrength: territory.armyStrength,
    winner,
    territoryCaptured: isAttackerWinner,
    message
  };
}

/**
 * Rule-Based Strategic AI Turn Evaluator
 */
export function executeAITurn(
  aiOwner: 'RIVAL_1' | 'RIVAL_2',
  territories: Territory[]
): { updatedTerritories: Territory[]; actionLog: string } {
  let actionLog = '';
  const updated = JSON.parse(JSON.stringify(territories)) as Territory[];

  // Find all territories owned by this AI
  const aiTerritories = updated.filter((t) => t.owner === aiOwner);
  if (aiTerritories.length === 0) {
    return { updatedTerritories: updated, actionLog: `${aiOwner} has no active forces remaining.` };
  }

  // AI Rule 1: Check if capital is threatened (enemy neighbor present)
  const capital = aiTerritories.find((t) => t.isCapital);
  if (capital) {
    const enemyNeighbor = capital.neighbors.find((nId) => {
      const neighbor = updated.find((t) => t.id === nId);
      return neighbor && neighbor.owner !== aiOwner && neighbor.owner !== 'NEUTRAL';
    });

    if (enemyNeighbor) {
      capital.armyStrength += 2;
      actionLog = `${capital.name} fortified garrison against nearby rivals! (+2 Defense)`;
      return { updatedTerritories: updated, actionLog };
    }
  }

  // AI Rule 2: Expand to adjacent weak neutral territory
  for (const myT of aiTerritories) {
    if (myT.armyStrength > 2) {
      const neutralTarget = myT.neighbors.find((nId) => {
        const neighbor = updated.find((t) => t.id === nId);
        return neighbor && neighbor.owner === 'NEUTRAL';
      });

      if (neutralTarget) {
        const targetObj = updated.find((t) => t.id === neutralTarget);
        if (targetObj) {
          targetObj.owner = aiOwner;
          targetObj.armyStrength = 3;
          myT.armyStrength = Math.max(1, myT.armyStrength - 2);
          actionLog = `${aiOwner} expanded empire into ${targetObj.name}!`;
          return { updatedTerritories: updated, actionLog };
        }
      }
    }
  }

  // AI Rule 3: Reinforce weakest fort
  const weakFort = aiTerritories.find((t) => t.type === 'FORT' && t.armyStrength < t.maxStrength);
  if (weakFort) {
    weakFort.armyStrength += 1;
    actionLog = `${aiOwner} reinforced defensive garrison at ${weakFort.name}.`;
    return { updatedTerritories: updated, actionLog };
  }

  // Default: Passive resource collection
  actionLog = `${aiOwner} gathered taxes and reinforced regional trade paths.`;
  return { updatedTerritories: updated, actionLog };
}
