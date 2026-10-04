import type { CowrieRoll } from '../game/types';

/**
 * Simulates throwing 6 Pachisi cowrie shells.
 * Returns individual shell states (true = open mouth up, false = closed)
 * and calculates movement steps according to traditional Indian Pachisi rules.
 */
export function rollCowrieShells(): CowrieRoll {
  // Roll 6 individual cowrie shells
  const shells: boolean[] = Array.from({ length: 6 }, () => Math.random() < 0.5);
  
  // Count open mouths (upward facing apertures)
  const openCount = shells.filter(Boolean).length;
  
  let score = 0;
  let isGrace = false;

  switch (openCount) {
    case 0:
      // 0 open mouths -> "Chakka" (6 points) + Grace turn
      score = 6;
      isGrace = true;
      break;
    case 1:
      // 1 open mouth -> "Pau" (10 points) + Grace turn
      score = 10;
      isGrace = true;
      break;
    case 2:
      // 2 open mouths -> 2 points
      score = 2;
      isGrace = false;
      break;
    case 3:
      // 3 open mouths -> 3 points
      score = 3;
      isGrace = false;
      break;
    case 4:
      // 4 open mouths -> 4 points
      score = 4;
      isGrace = false;
      break;
    case 5:
      // 5 open mouths -> "Barah" / 25 points + Grace turn
      score = 25;
      isGrace = true;
      break;
    case 6:
      // 6 open mouths -> 6 points + Grace turn
      score = 6;
      isGrace = true;
      break;
    default:
      score = 2;
      isGrace = false;
  }

  return {
    shells,
    score,
    isGrace
  };
}
