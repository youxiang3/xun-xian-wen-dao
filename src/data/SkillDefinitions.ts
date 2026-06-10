import type { ElementType } from '../types/GameTypes';

export interface BasicAttackSkillDefinition {
  id: string;
  name: string;
  element: ElementType;
  description: string;
  mpCost: number;
  cooldownMs: number;
  damage: number;
  range: number;
  speed: number;
}

export const basicAttackSkills: Record<ElementType, BasicAttackSkillDefinition> = {
  Metal: {
    id: 'metal_spike',
    name: '金芒刺',
    element: 'Metal',
    description: '其意如金，锋锐破局。',
    mpCost: 10,
    cooldownMs: 3000,
    damage: 7,
    range: 5,
    speed: 480,
  },
  Wood: {
    id: 'wood_vine',
    name: '青藤击',
    element: 'Wood',
    description: '其意如木，生发缠敌。',
    mpCost: 10,
    cooldownMs: 4000,
    damage: 5,
    range: 4,
    speed: 380,
  },
  Water: {
    id: 'water_blade',
    name: '寒露刃',
    element: 'Water',
    description: '其意如水，寒光无形。',
    mpCost: 10,
    cooldownMs: 3000,
    damage: 5,
    range: 5,
    speed: 460,
  },
  Fire: {
    id: 'fire_spark',
    name: '火星诀',
    element: 'Fire',
    description: '其意如火，灼心破妄。',
    mpCost: 10,
    cooldownMs: 3000,
    damage: 6,
    range: 5,
    speed: 500,
  },
  Earth: {
    id: 'earth_spike',
    name: '碎土刺',
    element: 'Earth',
    description: '其意如土，厚重摧坚。',
    mpCost: 12,
    cooldownMs: 4000,
    damage: 6,
    range: 4,
    speed: 0,
  },
};
