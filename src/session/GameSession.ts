import { basicAttackSkills, type BasicAttackSkillDefinition } from '../data/SkillDefinitions';
import type { ElementType, HeartTrialAnswer, HeartTrialResult, RootQuality } from '../types/GameTypes';

export interface GameSessionState {
  selectedHeartTrialResult?: HeartTrialResult;
  heartTrialAnswers: HeartTrialAnswer[];
  rootElement?: ElementType;
  rootQuality?: RootQuality;
  chapterId: string;
  stageId: string;
}

export const gameSession: GameSessionState = {
  heartTrialAnswers: [],
  chapterId: 'chapter_01_descent_and_wudao_gate',
  stageId: 'heart_trial',
};

export function setHeartTrialAnswers(answers: HeartTrialAnswer[]): void {
  gameSession.heartTrialAnswers = [...answers];
}

export function setHeartTrialResult(result: HeartTrialResult): void {
  gameSession.selectedHeartTrialResult = result;
  gameSession.rootElement = result.rootElement;
  gameSession.rootQuality = result.rootQuality;
}

export function getInitialAttackSkill(): BasicAttackSkillDefinition {
  const element = gameSession.selectedHeartTrialResult?.rootElement ?? gameSession.rootElement ?? 'Metal';
  return basicAttackSkills[element];
}

export function getInitialAttackSkillName(): string {
  return getInitialAttackSkill().name;
}
