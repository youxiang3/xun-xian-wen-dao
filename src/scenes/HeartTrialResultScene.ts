import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../gameConfig';
import { gameSession } from '../session/GameSession';

export class HeartTrialResultScene extends Phaser.Scene {
  private canContinue = false;

  constructor() {
    super('HeartTrialResultScene');
  }

  create(): void {
    this.canContinue = false;
    this.drawBackdrop();
    const result = gameSession.selectedHeartTrialResult;

    this.add
      .text(GAME_WIDTH / 2, 54, '问心结果', {
        fontSize: '42px',
        color: '#e8d28a',
        fontFamily: '"Microsoft YaHei", "Noto Sans SC", Arial, sans-serif',
        stroke: '#15120b',
        strokeThickness: 3,
      })
      .setOrigin(0.5);

    if (!result) {
      this.add
        .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, '命书未定，请返回五问定心。', {
          fontSize: '24px',
          color: '#d6dde6',
          fontFamily: '"Microsoft YaHei", "Noto Sans SC", Arial, sans-serif',
        })
        .setOrigin(0.5);
      return;
    }

    this.drawResultPanel([
      `主灵根：${result.rootName}`,
      `灵根品质：${result.rootQualityName}`,
      `命格：${result.fate}`,
      `体魄：${result.body}`,
      `五行基础攻击术：${result.initialAttackSkillName}`,
      `先天神通 / 辅助法术：${result.innateAbilityName ?? '未觉醒'}`,
      '',
      result.description,
    ]);
    this.drawContinueHint();
  }

  private drawBackdrop(): void {
    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0x06101d, 0x0b1c31, 0x071525, 0x03070c, 1);
    graphics.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    graphics.fillStyle(0xffffff, 0.07);
    graphics.fillEllipse(210, 136, 360, 44);
    graphics.fillEllipse(720, 174, 390, 48);
    graphics.fillEllipse(480, 456, 660, 58);

    graphics.lineStyle(2, 0xe8d28a, 0.18);
    graphics.strokeCircle(GAME_WIDTH / 2, 282, 166);
    graphics.strokeCircle(GAME_WIDTH / 2, 282, 210);
  }

  private drawResultPanel(lines: string[]): void {
    const panel = this.add.graphics();
    panel.fillStyle(0xd7d2bd, 0.12);
    panel.lineStyle(2, 0xe8d28a, 0.42);
    panel.fillRoundedRect(250, 118, 460, 288, 10);
    panel.strokeRoundedRect(250, 118, 460, 288, 10);
    panel.lineStyle(1, 0xb8d7e9, 0.12);
    panel.lineBetween(290, 170, 670, 170);
    panel.lineBetween(290, 338, 670, 338);

    this.add
      .text(GAME_WIDTH / 2, 260, lines.join('\n'), {
        fontSize: '21px',
        color: '#e9dfb8',
        fontFamily: '"Microsoft YaHei", "Noto Sans SC", Arial, sans-serif',
        align: 'center',
        lineSpacing: 8,
      })
      .setOrigin(0.5);
  }

  private drawContinueHint(): void {
    const hint = this.add
      .text(GAME_WIDTH / 2, 448, '点击继续，天命降世', {
        fontSize: '18px',
        color: '#aeb8c4',
        fontFamily: '"Microsoft YaHei", "Noto Sans SC", Arial, sans-serif',
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: hint,
      alpha: 0.45,
      yoyo: true,
      repeat: -1,
      duration: 720,
    });

    this.time.delayedCall(250, () => {
      this.canContinue = true;
    });

    this.input.on('pointerdown', () => {
      if (!this.canContinue) return;
      this.canContinue = false;
      gameSession.stageId = 'descent';
      this.scene.start('DescentScene');
    });
  }
}
