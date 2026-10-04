import type { CowrieRoll } from '../game/types';

/**
 * Simulates throwing 6 traditional Pachisi cowrie shells.
 */
export function rollCowries(): CowrieRoll {
  // Roll 6 individual cowrie shells (true = open mouth up, false = closed back up)
  const shells: boolean[] = Array.from({ length: 6 }, () => Math.random() < 0.5);
  const score = calculateMovement(shells);
  const isGrace = score === 6 || score === 10 || score === 25;

  return {
    shells,
    score,
    isGrace
  };
}

/**
 * Calculates Pachisi movement score from 6 cowrie shell apertures.
 */
export function calculateMovement(shells: boolean[]): number {
  const openCount = shells.filter(Boolean).length;

  switch (openCount) {
    case 0:
      return 6;   // "Chakka" (All closed) -> 6 Steps + Grace Turn
    case 1:
      return 10;  // "Pau" (1 open mouth) -> 10 Steps + Grace Turn
    case 2:
      return 2;   // 2 open mouths -> 2 Steps
    case 3:
      return 3;   // 3 open mouths -> 3 Steps
    case 4:
      return 4;   // 4 open mouths -> 4 Steps
    case 5:
      return 25;  // "Barah" (5 open mouths) -> 25 Steps + Grace Turn
    case 6:
      return 6;   // 6 open mouths -> 6 Steps + Grace Turn
    default:
      return 2;
  }
}

/**
 * Returns special move bonus description if applicable.
 */
export function getSpecialMove(score: number): string | null {
  if (score === 10) return 'GRACE TURN (Pau Bonus)';
  if (score === 25) return 'GRAND GRACE TURN (Barah 25 Bonus)';
  if (score === 6) return 'GRACE TURN (Chakka Bonus)';
  return null;
}

/**
 * Formats user-facing roll result header text.
 */
export function formatResult(roll: CowrieRoll): string {
  const openCount = roll.shells.filter(Boolean).length;
  const specialMsg = getSpecialMove(roll.score);
  
  if (specialMsg) {
    return `${openCount} Mouths Open — MOVEMENT: ${roll.score} (${specialMsg})`;
  }
  return `${openCount} Mouths Open — MOVEMENT: ${roll.score} Steps`;
}
