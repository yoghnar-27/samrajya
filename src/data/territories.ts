import type { Territory } from '../game/types';

export const INITIAL_TERRITORIES: Territory[] = [
  // 1. CHOLA KINGDOM CAPITAL (South-West)
  {
    id: 't_chola_capital',
    name: 'Thanjavur Royal Citadel',
    type: 'CAPITAL',
    owner: 'PLAYER',
    armyStrength: 8,
    maxStrength: 15,
    resources: 120,
    isCapital: true,
    originalOwner: 'PLAYER',
    position: { x: -20, y: 1.2, z: 20 },
    neighbors: ['t_south_fort', 't_kaveri_delta', 't_trade_post_w'],
    pathIndex: 0
  },
  // 2. VIJAYANAGARA KINGDOM CAPITAL (North-East)
  {
    id: 't_vijayanagara_capital',
    name: 'Hampi Royal Citadel',
    type: 'CAPITAL',
    owner: 'RIVAL_1',
    armyStrength: 7,
    maxStrength: 15,
    resources: 110,
    isCapital: true,
    originalOwner: 'RIVAL_1',
    position: { x: 20, y: 1.2, z: -20 },
    neighbors: ['t_tungabhadra_fort', 't_deccan_bazaar', 't_trade_post_e'],
    pathIndex: 6
  },
  // 3. MAURYA KINGDOM CAPITAL (North-West)
  {
    id: 't_maurya_capital',
    name: 'Pataliputra Imperial Fort',
    type: 'CAPITAL',
    owner: 'RIVAL_2',
    armyStrength: 7,
    maxStrength: 15,
    resources: 105,
    isCapital: true,
    originalOwner: 'RIVAL_2',
    position: { x: -20, y: 1.2, z: -20 },
    neighbors: ['t_ganga_fort', 't_magadha_village', 't_trade_post_w'],
    pathIndex: 12
  },
  // 4. RAJPUT KINGDOM CAPITAL (South-East)
  {
    id: 't_rajput_capital',
    name: 'Chittorgarh Desert Citadel',
    type: 'CAPITAL',
    owner: 'NEUTRAL',
    armyStrength: 6,
    maxStrength: 15,
    resources: 100,
    isCapital: true,
    originalOwner: 'NEUTRAL',
    position: { x: 20, y: 1.2, z: 20 },
    neighbors: ['t_south_fort', 't_champa_village', 't_trade_post_e'],
    pathIndex: 18
  },

  // STRATEGIC FORTS
  {
    id: 't_south_fort',
    name: 'Gingee Hill Fortress',
    type: 'FORT',
    owner: 'PLAYER',
    armyStrength: 4,
    maxStrength: 10,
    resources: 60,
    isCapital: false,
    originalOwner: 'PLAYER',
    position: { x: -8, y: 1.8, z: 12 },
    neighbors: ['t_chola_capital', 't_rajput_capital', 't_central_crossroads'],
    pathIndex: 1
  },
  {
    id: 't_tungabhadra_fort',
    name: 'Raichur Rock Watchtower',
    type: 'FORT',
    owner: 'RIVAL_1',
    armyStrength: 4,
    maxStrength: 10,
    resources: 55,
    isCapital: false,
    originalOwner: 'RIVAL_1',
    position: { x: 10, y: 1.8, z: -8 },
    neighbors: ['t_vijayanagara_capital', 't_central_crossroads', 't_deccan_bazaar'],
    pathIndex: 7
  },
  {
    id: 't_ganga_fort',
    name: 'Varanasi Sacred River Bastion',
    type: 'FORT',
    owner: 'RIVAL_2',
    armyStrength: 4,
    maxStrength: 10,
    resources: 50,
    isCapital: false,
    originalOwner: 'RIVAL_2',
    position: { x: -10, y: 1.8, z: -8 },
    neighbors: ['t_maurya_capital', 't_central_crossroads', 't_magadha_village'],
    pathIndex: 13
  },

  // NEUTRAL CROSSROADS, VILLAGES & RESOURCE BAZAARS
  {
    id: 't_central_crossroads',
    name: 'Imperial Royal Crossroads',
    type: 'NEUTRAL_RESOURCE',
    owner: 'NEUTRAL',
    armyStrength: 3,
    maxStrength: 8,
    resources: 80,
    isCapital: false,
    originalOwner: 'NEUTRAL',
    position: { x: 0, y: 0.8, z: 0 },
    neighbors: ['t_south_fort', 't_tungabhadra_fort', 't_ganga_fort', 't_kaveri_delta', 't_deccan_bazaar'],
    pathIndex: 3
  },
  {
    id: 't_kaveri_delta',
    name: 'Kaveri River Farmlands',
    type: 'VILLAGE',
    owner: 'PLAYER',
    armyStrength: 3,
    maxStrength: 6,
    resources: 45,
    isCapital: false,
    originalOwner: 'PLAYER',
    position: { x: -14, y: 0.5, z: 6 },
    neighbors: ['t_chola_capital', 't_central_crossroads'],
    pathIndex: 2
  },
  {
    id: 't_deccan_bazaar',
    name: 'Deccan Spice & Gem Bazaar',
    type: 'VILLAGE',
    owner: 'NEUTRAL',
    armyStrength: 2,
    maxStrength: 6,
    resources: 50,
    isCapital: false,
    originalOwner: 'NEUTRAL',
    position: { x: 14, y: 0.5, z: -4 },
    neighbors: ['t_vijayanagara_capital', 't_tungabhadra_fort', 't_central_crossroads'],
    pathIndex: 5
  },
  {
    id: 't_magadha_village',
    name: 'Magadha Granary Settlement',
    type: 'VILLAGE',
    owner: 'RIVAL_2',
    armyStrength: 3,
    maxStrength: 6,
    resources: 40,
    isCapital: false,
    originalOwner: 'RIVAL_2',
    position: { x: -8, y: 0.5, z: -15 },
    neighbors: ['t_maurya_capital', 't_ganga_fort'],
    pathIndex: 11
  },
  {
    id: 't_champa_village',
    name: 'Silk Road Craft Village',
    type: 'VILLAGE',
    owner: 'NEUTRAL',
    armyStrength: 2,
    maxStrength: 6,
    resources: 35,
    isCapital: false,
    originalOwner: 'NEUTRAL',
    position: { x: 12, y: 0.5, z: 12 },
    neighbors: ['t_rajput_capital', 't_central_crossroads'],
    pathIndex: 17
  },
  {
    id: 't_trade_post_w',
    name: 'Western Ghats Pass',
    type: 'NEUTRAL_RESOURCE',
    owner: 'NEUTRAL',
    armyStrength: 3,
    maxStrength: 8,
    resources: 55,
    isCapital: false,
    originalOwner: 'NEUTRAL',
    position: { x: -22, y: 1.0, z: 0 },
    neighbors: ['t_chola_capital', 't_maurya_capital'],
    pathIndex: 21
  },
  {
    id: 't_trade_post_e',
    name: 'Coromandel Maritime Port',
    type: 'NEUTRAL_RESOURCE',
    owner: 'NEUTRAL',
    armyStrength: 3,
    maxStrength: 8,
    resources: 65,
    isCapital: false,
    originalOwner: 'NEUTRAL',
    position: { x: 22, y: 1.0, z: 0 },
    neighbors: ['t_vijayanagara_capital', 't_rajput_capital'],
    pathIndex: 22
  }
];
