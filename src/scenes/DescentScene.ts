import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../gameConfig';
import { gameSession } from '../session/GameSession';

const descentLines = [
  '汝本天外一缕命炁，未落尘寰。',
  '五问定禅心，命书遂阖。',
  '自此入世，托生凡尘。',
];

export class DescentScene extends Phaser.Scene {
  private currentLineIndex = 0;
  private completed = false;
  private transitioning = false;
  private autoTimer?: Phaser.Time.TimerEvent;
  private lineTexts: Phaser.GameObjects.Text[] = [];

  constructor() {
    super('DescentScene');
  }

  create(): void {
    gameSession.stageId = 'descent';
    this.currentLineIndex = 0;
    this.completed = false;
    this.transitioning = false;
    this.lineTexts = [];

    this.drawBackdrop();
    this.drawSessionHint();
    this.revealNextLine();

    this.input.on('pointerdown', () => this.handleClick());
  }

  private drawBackdrop(): void {
    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0x03070d, 0x071525, 0x081a2d, 0x03070d, 1);
    graphics.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    this.addMovingCloud(160, 130, 310, 42, 0.08, -18);
    this.addMovingCloud(760, 168, 360, 48, 0.07, 24);
    this.addMovingCloud(470, 420, 560, 54, 0.06, -26);

    graphics.lineStyle(2, 0xe8d28a, 0.22);
    graphics.strokeCircle(GAME_WIDTH / 2, 256, 118);
    graphics.strokeCircle(GAME_WIDTH / 2, 256, 176);

    for (let i = 0; i < 28; i += 1) {
      this.addStarDust();
    }
  }

  private addMovingCloud(x: number, y: number, width: number, height: number, alpha: number, drift: number): void {
    const cloud = this.add.ellipse(x, y, width, height, 0xffffff, alpha);
    this.tweens.add({
      targets: cloud,
      x: x + drift,
      duration: 4200 + Math.abs(drift) * 40,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut',
    });
  }

  private addStarDust(): void {
    const x = Phaser.Math.Between(80, GAME_WIDTH - 80);
    const y = Phaser.Math.Between(-40, GAME_HEIGHT - 80);
    const dot = this.add.circle(x, y, Phaser.Math.FloatBetween(1.2, 2.4), 0xe8d28a, Phaser.Math.FloatBetween(0.28, 0.62));
    this.tweens.add({
      targets: dot,
      y: y + Phaser.Math.Between(90, 180),
      alpha: 0,
      duration: Phaser.Math.Between(3600, 6200),
      repeat: -1,
      delay: Phaser.Math.Between(0, 1600),
    });
  }

  private drawSessionHint(): void {
    const result = gameSession.selectedHeartTrialResult;
    const text = result ? `命格已定：${result.fate}　主灵根：${result.rootName}` : '命书未定，仍可观此过场。';

    this.add
      .text(GAME_WIDTH / 2, 82, text, {
        fontSize: '18px',
        color: '#aeb8c4',
        fontFamily: '"Microsoft YaHei", "Noto Sans SC", Arial, sans-serif',
      })
      .setOrigin(0.5);
  }

  private revealNextLine(): void {
    if (this.currentLineIndex >= descentLines.length) {
      this.showContinue();
      return;
    }

    const text = this.add
      .text(GAME_WIDTH / 2, 202 + this.currentLineIndex * 64, descentLines[this.currentLineIndex], {
        fontSize: '25px',
        color: '#e8d28a',
        fontFamily: '"Microsoft YaHei", "Noto Sans SC", Arial, sans-serif',
        align: 'center',
      })
      .setOrigin(0.5)
      .setAlpha(0);

    this.lineTexts.push(text);
    this.tweens.add({ targets: text, alpha: 1, duration: 520 });
    this.currentLineIndex += 1;
    this.autoTimer = this.time.delayedCall(1500, () => this.revealNextLine());
  }

  private showContinue(): void {
    if (this.completed) return;
    this.completed = true;
    const hint = this.add
      .text(GAME_WIDTH / 2, 430, '继续', {
        fontSize: '22px',
        color: '#d6dde6',
        fontFamily: '"Microsoft YaHei", "Noto Sans SC", Arial, sans-serif',
      })
      .setOrigin(0.5)
      .setAlpha(0);

    this.tweens.add({ targets: hint, alpha: 1, duration: 420 });
  }

  private handleClick(): void {
    if (this.transitioning) return;
    if (this.completed) {
      this.transitioning = true;
      gameSession.stageId = 'prologue';
      this.scene.start('PrologueScene');
      return;
    }

    this.autoTimer?.remove(false);
    this.revealNextLine();
  }
}
