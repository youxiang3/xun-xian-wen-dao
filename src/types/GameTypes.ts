export type ElementType = 'Metal' | 'Wood' | 'Water' | 'Fire' | 'Earth';
export type FateType = '逆命' | '济世' | '观势' | '守心' | '烈心';
export type BodyType = '锋骨' | '灵脉' | '玄体' | '铁骨' | '燃血';
export type RootQuality = 'Balanced' | 'Mixed' | 'Adjacent' | 'Pure' | 'Heavenly';
export type HeartTrialOptionKey = 'A' | 'B' | 'C' | 'D';

export interface HeartTrialOption {
  key: HeartTrialOptionKey;
  text: string;
  scores: {
    element: Partial<Record<ElementType, number>>;
    fate: Partial<Record<FateType, number>>;
    body: Partial<Record<BodyType, number>>;
  };
}

export interface HeartTrialQuestion {
  id: number;
  title: string;
  content: string;
  options: HeartTrialOption[];
}

export interface HeartTrialAnswer {
  questionId: number;
  optionKey: HeartTrialOptionKey;
}

export interface HeartTrialResult {
  rootElement: ElementType;
  rootName: string;
  rootQuality: RootQuality;
  rootQualityName: string;
  fate: FateType;
  fateEffects: string[];
  body: BodyType;
  bodyEffects: string[];
  initialAttackSkillId: string;
  initialAttackSkillName: string;
  innateAbilityId?: string;
  innateAbilityName?: string;
  description: string;
}
