import Phaser from 'phaser';
import { GAME_WIDTH } from '../gameConfig';
import { SceneDepth } from '../utils/DepthUtils';

export class BossHUD {
  private readonly root: Phaser.GameObjects.Container;
  private readonly fill: Phaser.GameObjects.Rectangle;
  private readonly hpText: Phaser.GameObjects.Text;
  private readonly barWidth = 360;

  constructor(private readonly scene: Phaser.Scene) {
    this.root = scene.add.container(GAME_WIDTH / 2 - 220, 16).setDepth(SceneDepth.Hud + 8).setAlpha(0).setVisible(false);

    const bg = scene.add.graphics();
    bg.fillStyle(0x050b12, 0.78);
    bg.lineStyle(1, 0xe8d28a, 0.44);
    bg.fillRoundedRect(0, 0, 440, 56, 6);
    bg.strokeRoundedRect(0, 0, 440, 56, 6);

    const title = scene.add.text(18, 8, '悟道山试炼守卫', {
      fontSize: '16px',
      color: '#e8d28a',
      fontFamily: '"Microsoft YaHei", "Noto Sans SC", Arial, sans-serif',
    });

    const barBack = scene.add.rectangle(18, 34, this.barWidth, 12, 0x151c24, 0.95).setOrigin(0, 0.5);
    this.fill = scene.add.rectangle(18, 34, this.barWidth, 12, 0xc8a45d, 0.96).setOrigin(0, 0.5);
    this.hpText = scene.add.text(392, 25, '160 / 160', {
      fontSize: '13px',
      color: '#d6dde6',
      fontFamily: '"Microsoft YaHei", "Noto Sans SC", Arial, sans-serif',
    });

    this.root.add([bg, title, barBack, this.fill, this.hpText]);
  }

  show(): void {
    this.root.setVisible(true);
    this.scene.tweens.add({
      targets: this.root,
      alpha: 1,
      y: 22,
      duration: 260,
      ease: 'Sine.easeOut',
    });
  }

  update(hp: number, maxHp: number): void {
    const ratio = maxHp <= 0 ? 0 : Phaser.Math.Clamp(hp / maxHp, 0, 1);
    this.fill.displayWidth = this.barWidth * ratio;
    this.hpText.setText(`${Math.ceil(hp)} / ${maxHp}`);
  }

  fadeAfterDeath(): void {
    this.scene.tweens.add({
      targets: this.root,
      alpha: 0,
      delay: 1400,
      duration: 520,
      ease: 'Sine.easeOut',
    });
  }
}
