import type { ElementType } from '../types/GameTypes';

const restraintPairs: Record<ElementType, ElementType> = {
  Metal: 'Wood',
  Wood: 'Earth',
  Earth: 'Water',
  Water: 'Fire',
  Fire: 'Metal',
};

export function restrains(attacker?: ElementType, target?: ElementType): boolean {
  if (!attacker || !target) return false;
  return restraintPairs[attacker] === target;
}

export function applyElementDamageBonus(baseDamage: number, attacker?: ElementType, target?: ElementType): {
  damage: number;
  restrained: boolean;
} {
  const restrained = restrains(attacker, target);
  return {
    damage: restrained ? Math.ceil(baseDamage * 1.1) : baseDamage,
    restrained,
  };
}
