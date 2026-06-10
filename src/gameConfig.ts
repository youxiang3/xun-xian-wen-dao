import Phaser from 'phaser';
import { DescentScene } from './scenes/DescentScene';
import { GateTrialScene } from './scenes/GateTrialScene';
import { HeartTrialResultScene } from './scenes/HeartTrialResultScene';
import { HeartTrialScene } from './scenes/HeartTrialScene';
import { PrologueScene } from './scenes/PrologueScene';
import { TitleScene } from './scenes/TitleScene';

export const GAME_WIDTH = 960;
export const GAME_HEIGHT = 540;

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game-root',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#071525',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
  },
  scene: [TitleScene, HeartTrialScene, HeartTrialResultScene, DescentScene, PrologueScene, GateTrialScene],
};
