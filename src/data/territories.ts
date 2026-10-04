import type { Territory } from '../game/types';

export const INITIAL_TERRITORIES: Territory[] = [
  // 1. PLAYER CAPITAL (South-West)
  {
    id: 't_player_capital',
    name: 'Thanjavur Citadel',
    type: 'CAPITAL',
    owner: 'PLAYER',
    armyStrength: 8,
    maxStrength: 15,
    resources: 120,
    isCapital: true,
    originalOwner: 'PLAYER',
    position: { x: -18, y: 0.8, z: 18 },
    neighbors: ['t_south_fort', 't_kaveri_delta', 't_trade_post_w'],
    pathIndex: 0
  },
  // 2. RIVAL 1 CAPITAL (North-East)
  {
    id: 't_rival1_capital',
    name: 'Hampi Citadel',
    type: 'CAPITAL',
    owner: 'RIVAL_1',
    armyStrength: 7,
    maxStrength: 15,
    resources: 110,
    isCapital: true,
    originalOwner: 'RIVAL_1',
    position: { x: 18, y: 0.8, z: -18 },
    neighbors: ['t_tungabhadra_fort', 't_deccan_bazaar', 't_trade_post_e'],
    pathIndex: 6
  },
  // 3. RIVAL 2 CAPITAL (North-West)
  {
    id: 't_rival2_capital',
    name: 'Pataliputra Fort',
    type: 'CAPITAL',
    owner: 'RIVAL_2',
    armyStrength: 6,
    maxStrength: 15,
    resources: 100,
    isCapital: true,
    originalOwner: 'RIVAL_2',
    position: { x: -18, y: 0.8, z: -18 },
    neighbors: ['t_ganga_fort', 't_magadha_village', 't_trade_post_w'],
    pathIndex: 12
  },
  // 4. NEUTRAL CAPITAL / GRAND TEMPLE (Center-South)
  {
    id: 't_grand_temple',
    name: 'Kanchipuram Temple Realm',
    type: 'CAPITAL',
    owner: 'NEUTRAL',
    armyStrength: 5,
    maxStrength: 12,
    resources: 90,
    isCapital: true,
    originalOwner: 'NEUTRAL',
    position: { x: 18, y: 0.8, z: 18 },
    neighbors: ['t_south_fort', 't_champa_village', 't_trade_post_e'],
    pathIndex: 18
  },

  // FORTS & STRATEGIC OUTPOSTS
  {
    id: 't_south_fort',
    name: 'Gingee Hill Bastion',
    type: 'FORT',
    owner: 'PLAYER',
    armyStrength: 4,
    maxStrength: 10,
    resources: 60,
    isCapital: false,
    originalOwner: 'PLAYER',
    position: { x: -6, y: 1.2, z: 12 },
    neighbors: ['t_player_capital', 't_grand_temple', 't_central_crossroads'],
    pathIndex: 1
  },
  {
    id: 't_tungabhadra_fort',
    name: 'Raichur Watchtower',
    type: 'FORT',
    owner: 'RIVAL_1',
    armyStrength: 4,
    maxStrength: 10,
    resources: 55,
    isCapital: false,
    originalOwner: 'RIVAL_1',
    position: { x: 8, y: 1.2, z: -8 },
    neighbors: ['t_rival1_capital', 't_central_crossroads', 't_deccan_bazaar'],
    pathIndex: 7
  },
  {
    id: 't_ganga_fort',
    name: 'Varanasi River Fort',
    type: 'FORT',
    owner: 'RIVAL_2',
    armyStrength: 4,
    maxStrength: 10,
    resources: 50,
    isCapital: false,
    originalOwner: 'RIVAL_2',
    position: { x: -10, y: 1.2, z: -6 },
    neighbors: ['t_rival2_capital', 't_central_crossroads', 't_magadha_village'],
    pathIndex: 13
  },

  // NEUTRAL VILLAGES & TRADE POSTS
  {
    id: 't_central_crossroads',
    name: 'Grand Royal Crossroads',
    type: 'NEUTRAL_RESOURCE',
    owner: 'NEUTRAL',
    armyStrength: 2,
    maxStrength: 8,
    resources: 75,
    isCapital: false,
    originalOwner: 'NEUTRAL',
    position: { x: 0, y: 0.5, z: 0 },
    neighbors: ['t_south_fort', 't_tungabhadra_fort', 't_ganga_fort', 't_kaveri_delta', 't_deccan_bazaar'],
    pathIndex: 3
  },
  {
    id: 't_kaveri_delta',
    name: 'Kaveri River Settlement',
    type: 'VILLAGE',
    owner: 'PLAYER',
    armyStrength: 3,
    maxStrength: 6,
    resources: 40,
    isCapital: false,
    originalOwner: 'PLAYER',
    position: { x: -12, y: 0.4, z: 6 },
    neighbors: ['t_player_capital', 't_central_crossroads'],
    pathIndex: 2
  },
  {
    id: 't_deccan_bazaar',
    name: 'Deccan Spice Bazaar',
    type: 'VILLAGE',
    owner: 'NEUTRAL',
    armyStrength: 2,
    maxStrength: 6,
    resources: 45,
    isCapital: false,
    originalOwner: 'NEUTRAL',
    position: { x: 12, y: 0.4, z: -4 },
    neighbors: ['t_rival1_capital', 't_tungabhadra_fort', 't_central_crossroads'],
    pathIndex: 5
  },
  {
    id: 't_magadha_village',
    name: 'Pataliputra Farmlands',
    type: 'VILLAGE',
    owner: 'RIVAL_2',
    armyStrength: 3,
    maxStrength: 6,
    resources: 35,
    isCapital: false,
    originalOwner: 'RIVAL_2',
    position: { x: -8, y: 0.4, z: -14 },
    neighbors: ['t_rival2_capital', 't_ganga_fort'],
    pathIndex: 11
  },
  {
    id: 't_champa_village',
    name: 'Silk Route Village',
    type: 'VILLAGE',
    owner: 'NEUTRAL',
    armyStrength: 2,
    maxStrength: 6,
    resources: 30,
    isCapital: false,
    originalOwner: 'NEUTRAL',
    position: { x: 10, y: 0.4, z: 10 },
    neighbors: ['t_grand_temple', 't_central_crossroads'],
    pathIndex: 17
  },
  {
    id: 't_trade_post_w',
    name: 'Western Ghats Pass',
    type: 'NEUTRAL_RESOURCE',
    owner: 'NEUTRAL',
    armyStrength: 3,
    maxStrength: 8,
    resources: 50,
    isCapital: false,
    originalOwner: 'NEUTRAL',
    position: { x: -20, y: 0.6, z: 0 },
    neighbors: ['t_player_capital', 't_rival2_capital'],
    pathIndex: 21
  },
  {
    id: 't_trade_post_e',
    name: 'Eastern Coromandel Port',
    type: 'NEUTRAL_RESOURCE',
    owner: 'NEUTRAL',
    armyStrength: 3,
    maxStrength: 8,
    resources: 60,
    isCapital: false,
    originalOwner: 'NEUTRAL',
    position: { x: 20, y: 0.6, z: 0 },
    neighbors: ['t_rival1_capital', 't_grand_temple'],
    pathIndex: 22
  }
];
