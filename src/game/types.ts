export type RulerType = 'KING' | 'QUEEN';

export type CivilizationId = 'CHOLA' | 'VIJAYANAGARA' | 'MAURYA' | 'RAJPUT';

export interface Civilization {
  id: CivilizationId;
  name: string;
  dynasty: string;
  tagline: string;
  description: string;
  architecturalStyle: string;
  primaryColor: string;
  accentColor: string;
  bonus: string;
}

export type TerritoryOwner = 'PLAYER' | 'RIVAL_1' | 'RIVAL_2' | 'NEUTRAL';

export type TerritoryType = 'CAPITAL' | 'FORT' | 'VILLAGE' | 'NEUTRAL_RESOURCE';

export interface Territory {
  id: string;
  name: string;
  type: TerritoryType;
  owner: TerritoryOwner;
  armyStrength: number;
  maxStrength: number;
  resources: number;
  isCapital: boolean;
  originalOwner: TerritoryOwner;
  position: { x: number; y: number; z: number };
  neighbors: string[]; // territory IDs connected by Pachisi trade roads
  pathIndex: number;
}

export interface ArmyUnit {
  id: string;
  owner: TerritoryOwner;
  territoryId: string;
  type: 'ROYAL_GUARD' | 'INFANTRY' | 'WAR_ELEPHANT';
  count: number;
  position: { x: number; y: number; z: number };
}

export interface CowrieRoll {
  shells: boolean[]; // true = mouth open (up), false = mouth closed (down)
  score: number; // Pachisi traditional movement value: 1, 2, 3, 4, 6, 10, or 25
  isGrace: boolean; // special roll (grace turn/bonus move)
}

export type GamePhase = 
  | 'MAIN_MENU'
  | 'RULER_SELECT'
  | 'CIV_SELECT'
  | 'PLAYING'
  | 'BATTLE_MODAL'
  | 'EXILE_RECLAIM'
  | 'VICTORY';

export interface BattleReport {
  attackerId: TerritoryOwner;
  defenderId: TerritoryOwner;
  territoryId: string;
  attackerRoll: number;
  defenderRoll: number;
  attackerStrength: number;
  defenderStrength: number;
  winner: TerritoryOwner;
  territoryCaptured: boolean;
  message: string;
}

export interface GameLogEntry {
  id: string;
  timestamp: string;
  text: string;
  type: 'INFO' | 'BATTLE' | 'CAPTURE' | 'RECLAIM' | 'WARNING';
}
