import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../gameConfig';

export class TitleScene extends Phaser.Scene {
  constructor() {
    super('TitleScene');
  }

  create(): void {
    const graphics = this.add.graphics();

    graphics.fillGradientStyle(0x06101d, 0x0b1c31, 0x071525, 0x03070c, 1);
    graphics.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    graphics.fillStyle(0xffffff, 0.08);
    graphics.fillEllipse(220, 170, 320, 42);
    graphics.fillEllipse(710, 225, 380, 48);
    graphics.fillEllipse(470, 405, 560, 54);

    graphics.lineStyle(2, 0xe8d28a, 0.22);
    graphics.strokeCircle(GAME_WIDTH / 2, GAME_HEIGHT / 2, 130);
    graphics.strokeCircle(GAME_WIDTH / 2, GAME_HEIGHT / 2, 168);

    this.add
      .text(GAME_WIDTH / 2, 226, '寻仙问道', {
        fontSize: '56px',
        color: '#e8d28a',
        fontFamily: '"Microsoft YaHei", "Noto Sans SC", Arial, sans-serif',
        stroke: '#15120b',
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, 300, '五问定心，入世寻道', {
        fontSize: '24px',
        color: '#d6dde6',
        fontFamily: '"Microsoft YaHei", "Noto Sans SC", Arial, sans-serif',
      })
      .setOrigin(0.5);

    const hint = this.add
      .text(GAME_WIDTH / 2, 382, '点击开始', {
        fontSize: '18px',
        color: '#b8c3cf',
        fontFamily: '"Microsoft YaHei", "Noto Sans SC", Arial, sans-serif',
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: hint,
      alpha: 0.42,
      yoyo: true,
      repeat: -1,
      duration: 820,
    });

    this.input.once('pointerdown', () => {
      this.scene.start('HeartTrialScene');
    });
  }
}
