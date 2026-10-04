import type { Civilization } from '../game/types';

export const CIVILIZATIONS: Record<string, Civilization> = {
  CHOLA: {
    id: 'CHOLA',
    name: 'Chola Dynasty',
    dynasty: 'Imperial Cholas of Tanjore',
    tagline: 'Lords of the Southern Seas & Grand Temples',
    description: 'Master architects of soaring granite vimanas (Brihadeeswarar) and maritime trade routes. Renowned for bronze casting, disciplined infantry, and royal navy prowess.',
    architecturalStyle: 'Dravidian Granite Towers, Carved Mandapas & Sacred Tank Ponds',
    primaryColor: '#b91c1c', // Deep Crimson / Royal Maroon
    accentColor: '#f59e0b', // Antique Gold
    bonus: '+1 Defense in Fortified Capitals & Marine Trade (+10% Resources)'
  },
  VIJAYANAGARA: {
    id: 'VIJAYANAGARA',
    name: 'Vijayanagara Empire',
    dynasty: 'City of Victory (Hampi)',
    tagline: 'Defenders of Culture & Golden Citadel',
    description: 'Famed for the stone chariot of Vittala, fortified granite hill citadels, royal elephant stables, and immense wealth derived from spice and gem bazaars.',
    architecturalStyle: 'Monolithic Rock-Cut Pillars, Stepped Tanks & Royal Pavilions',
    primaryColor: '#d97706', // Ocher Bronze / Saffron
    accentColor: '#fbbf24', // Warm Brass
    bonus: '+1 Army Strength on Neutral Conquest & Rich Gem Bazaars'
  },
  MAURYA: {
    id: 'MAURYA',
    name: 'Mauryan Empire',
    dynasty: 'Imperial Pataliputra',
    tagline: 'Architects of Unified India & Ashoka Pillars',
    description: 'The ancient empire that unified India from Pataliputra. Guided by royal edicts, polished sandstone pillars, ironclad war pachyderms, and strategic roads.',
    architecturalStyle: 'Polished Sandstone Pillars, Stupa Monoliths & Timber Palisades',
    primaryColor: '#1e3a8a', // Royal Indigo / Navy
    accentColor: '#38bdf8', // Lapis Lazuli
    bonus: '+2 Movement Range on Pachisi Trade Highways'
  },
  RAJPUT: {
    id: 'RAJPUT',
    name: 'Rajput Kingdoms',
    dynasty: 'Clans of Mewar & Marwar',
    tagline: 'Guardians of Desert Fortresses & Valor',
    description: 'Builders of impregnable hill forts (Chittorgarh, Mehrangarh) and ornate sandstone palaces. Celebrated for chivalry, swift cavalry strikes, and unbreakable resilience.',
    architecturalStyle: 'Sandstone Jharokhas, Stepped Wells & Citadel Bastions',
    primaryColor: '#854d0e', // Desert Sandstone / Terracotta
    accentColor: '#facc15', // Sunlight Gold
    bonus: 'Exile Reclaim Battle Bonus (+2 Attack when Reclaiming Lost Realm)'
  }
};
