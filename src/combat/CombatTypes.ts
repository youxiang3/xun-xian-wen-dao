import type { ElementType } from '../types/GameTypes';

export type HitType = 'Light' | 'Heavy' | 'Spell' | 'Enemy';
export type StatusEffectType = 'Wet' | 'Burning' | 'Slowed' | 'WoodBind' | 'MetalBreak';

export interface DamageInput {
  amount: number;
  elementType?: ElementType;
  sourceX: number;
  sourceY: number;
  knockback?: number;
  hitType: HitType;
  statusEffects?: StatusEffectType[];
}

export interface Damageable {
  x: number;
  y: number;
  elementType?: ElementType;
  isDead(): boolean;
  takeDamage(input: DamageInput): void;
}
