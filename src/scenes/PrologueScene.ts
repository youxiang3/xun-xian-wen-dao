import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../gameConfig';
import { gameSession } from '../session/GameSession';

const prologueLines = [
  '十六载春秋，如山中一梦。',
  '饥寒尝尽，离别亦知，唯掌中一木，朝夕不离。',
  '是日，云开万仞，仙人抚顶，问汝长生。',
  '山门在前，试炼已启。',
  '凡骨未定，天命难凭。',
  '踏过此门，方知大道几何。',
];

export class PrologueScene extends Phaser.Scene {
  private currentLineIndex = 0;
  private completed = false;
  private transitioning = false;
  private autoTimer?: Phaser.Time.TimerEvent;

  constructor() {
    super('PrologueScene');
  }

  create(): void {
    gameSession.stageId = 'prologue';
    this.currentLineIndex = 0;
    this.completed = false;
    this.transitioning = false;

    this.drawBackdrop();
    this.drawTitle();
    this.revealNextLine();

    this.input.on('pointerdown', () => this.handleClick());
  }

  private drawBackdrop(): void {
    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0x02050a, 0x06101d, 0x071525, 0x02050a, 1);
    graphics.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    graphics.fillStyle(0x05080d, 0.95);
    graphics.fillTriangle(0, 410, 150, 260, 300, 410);
    graphics.fillTriangle(190, 410, 420, 205, 660, 410);
    graphics.fillTriangle(540, 410, 780, 250, 960, 410);

    graphics.fillStyle(0x111c26, 0.8);
    graphics.fillRect(0, 410, GAME_WIDTH, 130);

    this.addMovingCloud(180, 152, 340, 42, 0.08, 28);
    this.addMovingCloud(680, 184, 420, 50, 0.07, -24);
    this.addMovingCloud(490, 380, 680, 56, 0.05, 34);

    for (let i = 0; i < 22; i += 1) {
      this.addSpiritLight();
    }
  }

  private drawTitle(): void {
    this.add
      .text(GAME_WIDTH / 2, 54, '入世十六载', {
        fontSize: '40px',
        color: '#e8d28a',
        fontFamily: '"Microsoft YaHei", "Noto Sans SC", Arial, sans-serif',
        stroke: '#15120b',
        strokeThickness: 3,
      })
      .setOrigin(0.5);
  }

  private addMovingCloud(x: number, y: number, width: number, height: number, alpha: number, drift: number): void {
    const cloud = this.add.ellipse(x, y, width, height, 0xffffff, alpha);
    this.tweens.add({
      targets: cloud,
      x: x + drift,
      duration: 5200 + Math.abs(drift) * 35,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut',
    });
  }

  private addSpiritLight(): void {
    const x = Phaser.Math.Between(90, GAME_WIDTH - 90);
    const y = Phaser.Math.Between(100, 390);
    const dot = this.add.circle(x, y, Phaser.Math.FloatBetween(1, 2.2), 0xe8d28a, Phaser.Math.FloatBetween(0.22, 0.5));
    this.tweens.add({
      targets: dot,
      y: y - Phaser.Math.Between(18, 46),
      alpha: Phaser.Math.FloatBetween(0.08, 0.22),
      duration: Phaser.Math.Between(2200, 4200),
      yoyo: true,
      repeat: -1,
    });
  }

  private revealNextLine(): void {
    if (this.currentLineIndex >= prologueLines.length) {
      this.showGatePrompt();
      return;
    }

    const text = this.add
      .text(GAME_WIDTH / 2, 130 + this.currentLineIndex * 46, prologueLines[this.currentLineIndex], {
        fontSize: '21px',
        color: '#e8d28a',
        fontFamily: '"Microsoft YaHei", "Noto Sans SC", Arial, sans-serif',
        align: 'center',
        wordWrap: { width: 760 },
      })
      .setOrigin(0.5)
      .setAlpha(0);

    this.tweens.add({ targets: text, alpha: 1, duration: 520 });
    const delay = this.currentLineIndex === 2 ? 2700 : 1500;
    this.currentLineIndex += 1;
    this.autoTimer = this.time.delayedCall(delay, () => this.revealNextLine());
  }

  private showGatePrompt(): void {
    if (this.completed) return;
    this.completed = true;
    const prompt = this.add
      .text(GAME_WIDTH / 2, 464, '前往悟道山', {
        fontSize: '23px',
        color: '#d6dde6',
        fontFamily: '"Microsoft YaHei", "Noto Sans SC", Arial, sans-serif',
      })
      .setOrigin(0.5)
      .setAlpha(0);

    this.tweens.add({
      targets: prompt,
      alpha: 1,
      duration: 420,
    });
  }

  private handleClick(): void {
    if (this.transitioning) return;
    if (this.completed) {
      this.transitioning = true;
      gameSession.stageId = 'wudao_gate_trial';
      this.scene.start('GateTrialScene');
      return;
    }

    this.autoTimer?.remove(false);
    this.revealNextLine();
  }
}
