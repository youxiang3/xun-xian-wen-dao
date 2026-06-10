import type { ElementType } from '../types/GameTypes';

export type BossCombatState =
  | 'Normal'
  | 'Hurt'
  | 'Stagger'
  | 'ArmorBroken'
  | 'Burning'
  | 'Wet'
  | 'WoodBind'
  | 'Slowed'
  | 'Enraged'
  | 'Dead';

export type SceneFeedbackKind =
  | 'GroundCrack'
  | 'Dust'
  | 'StoneStepShake'
  | 'MagicCircleRipple'
  | 'EarthSpikeAfterimage'
  | 'BossImpactRing';

export interface ElementHitFeedbackPreset {
  elementType: ElementType;
  bossStateHint: BossCombatState;
  label: string;
  color: number;
}

export const elementHitFeedbackPresets: Record<ElementType, ElementHitFeedbackPreset> = {
  Metal: {
    elementType: 'Metal',
    bossStateHint: 'ArmorBroken',
    label: '破甲 / 金光裂纹',
    color: 0xe8d28a,
  },
  Wood: {
    elementType: 'Wood',
    bossStateHint: 'WoodBind',
    label: '藤蔓缠绕',
    color: 0x62c78f,
  },
  Water: {
    elementType: 'Water',
    bossStateHint: 'Wet',
    label: '湿润 / 蓝色水雾',
    color: 0x7fc7ff,
  },
  Fire: {
    elementType: 'Fire',
    bossStateHint: 'Burning',
    label: '灼烧 / 火星',
    color: 0xf07145,
  },
  Earth: {
    elementType: 'Earth',
    bossStateHint: 'Stagger',
    label: '击退 / 地裂',
    color: 0xc8a45d,
  },
};
