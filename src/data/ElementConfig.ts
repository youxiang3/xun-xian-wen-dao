import { heartTrialQuestions } from './HeartTrialData';
import { basicAttackSkills } from './SkillDefinitions';
import type {
  BodyType,
  ElementType,
  FateType,
  HeartTrialAnswer,
  HeartTrialOption,
  HeartTrialResult,
  RootQuality,
} from '../types/GameTypes';

const elements: ElementType[] = ['Metal', 'Wood', 'Water', 'Fire', 'Earth'];
const fates: FateType[] = ['逆命', '济世', '观势', '守心', '烈心'];
const bodies: BodyType[] = ['锋骨', '灵脉', '玄体', '铁骨', '燃血'];

export const elementNames: Record<ElementType, string> = {
  Metal: '金灵根',
  Wood: '木灵根',
  Water: '水灵根',
  Fire: '火灵根',
  Earth: '土灵根',
};

export const elementColors: Record<ElementType, number> = {
  Metal: 0xe8d28a,
  Wood: 0x62c78f,
  Water: 0x7fc7ff,
  Fire: 0xf07145,
  Earth: 0xc8a45d,
};

export const defaultElementColor = elementColors.Metal;

export const rootQualityNames: Record<RootQuality, string> = {
  Balanced: '五行中和',
  Mixed: '驳杂灵根',
  Adjacent: '相生灵根',
  Pure: '纯灵根',
  Heavenly: '天灵根',
};

export const fateEffectText: Record<FateType, string[]> = {
  逆命: ['破局意志更强', '后续可预留逆命神通'],
  济世: ['护持众生之心更稳', '后续可预留治疗与庇护路线'],
  观势: ['更善观因察势', '后续可预留控场与洞察路线'],
  守心: ['心性沉稳，不易动摇', '后续可预留防御与守护路线'],
  烈心: ['行事炽烈，敢入劫中', '后续可预留爆发与燃血路线'],
};

export const bodyEffectText: Record<BodyType, string[]> = {
  锋骨: ['身骨如刃，适合破局强攻'],
  灵脉: ['气脉灵动，适合回转续行'],
  玄体: ['体质通玄，适合感知变化'],
  铁骨: ['骨坚如铁，适合承压守阵'],
  燃血: ['血气炽盛，适合险中求胜'],
};

const generatingPairs: Array<[ElementType, ElementType]> = [
  ['Metal', 'Water'],
  ['Water', 'Wood'],
  ['Wood', 'Fire'],
  ['Fire', 'Earth'],
  ['Earth', 'Metal'],
];

export function calculateHeartTrialResult(answers: HeartTrialAnswer[]): HeartTrialResult {
  const elementScores = createScoreMap(elements);
  const fateScores = createScoreMap(fates);
  const bodyScores = createScoreMap(bodies);
  let lastElement: ElementType = 'Metal';
  let lastFate: FateType = '逆命';
  let lastBody: BodyType = '锋骨';

  answers.forEach((answer) => {
    const option = findOption(answer);
    if (!option) return;

    lastElement = addScores(elementScores, option.scores.element, lastElement);
    lastFate = addScores(fateScores, option.scores.fate, lastFate);
    lastBody = addScores(bodyScores, option.scores.body, lastBody);
  });

  const rootElement = chooseHighest(elementScores, lastElement);
  const fate = chooseHighest(fateScores, lastFate);
  const body = chooseHighest(bodyScores, lastBody);
  const rootQuality = determineRootQuality(elementScores);
  const skill = basicAttackSkills[rootElement];

  return {
    rootElement,
    rootName: elementNames[rootElement],
    rootQuality,
    rootQualityName: rootQualityNames[rootQuality],
    fate,
    fateEffects: fateEffectText[fate],
    body,
    bodyEffects: bodyEffectText[body],
    initialAttackSkillId: skill.id,
    initialAttackSkillName: skill.name,
    innateAbilityId: 'reserved_innate_ability',
    innateAbilityName: '先天神通：未觉醒',
    description: skill.description,
  };
}

function createScoreMap<T extends string>(keys: T[]): Record<T, number> {
  return keys.reduce(
    (scores, key) => ({
      ...scores,
      [key]: 0,
    }),
    {} as Record<T, number>,
  );
}

function addScores<T extends string>(scores: Record<T, number>, incoming: Partial<Record<T, number>>, fallback: T): T {
  let last = fallback;
  (Object.keys(incoming) as T[]).forEach((key) => {
    scores[key] += incoming[key] ?? 0;
    last = key;
  });
  return last;
}

function chooseHighest<T extends string>(scores: Record<T, number>, tieBreaker: T): T {
  const values = Object.entries(scores) as Array<[T, number]>;
  const maxScore = Math.max(...values.map(([, score]) => score));
  const tied = values.filter(([, score]) => score === maxScore).map(([key]) => key);
  return tied.includes(tieBreaker) ? tieBreaker : tied[0];
}

function determineRootQuality(scores: Record<ElementType, number>): RootQuality {
  const maxScore = Math.max(...elements.map((element) => scores[element]));
  if (maxScore === 5) return 'Heavenly';
  if (maxScore >= 4) return 'Pure';
  if (elements.every((element) => scores[element] <= 2)) return 'Balanced';
  if (generatingPairs.some(([a, b]) => scores[a] > 0 && scores[b] > 0 && scores[a] + scores[b] >= 4)) {
    return 'Adjacent';
  }
  return 'Mixed';
}

function findOption(answer: HeartTrialAnswer): HeartTrialOption | undefined {
  const question = heartTrialQuestions.find((item) => item.id === answer.questionId);
  return question?.options.find((option) => option.key === answer.optionKey);
}
