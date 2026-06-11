import Phaser from 'phaser';
import { SceneDepth } from '../utils/DepthUtils';

export class BossVisual extends Phaser.GameObjects.Container {
  private readonly baseScale = 1.08;
  private bodyGraphic!: Phaser.GameObjects.Graphics;
  private core!: Phaser.GameObjects.Arc;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);
    this.setScale(this.baseScale);
    this.draw();
  }

  playIntro(): void {
    this.setAlpha(0);
    this.setScale(this.baseScale * 0.8);
    this.scene.tweens.add({
      targets: this,
      alpha: 1,
      scale: this.baseScale,
      duration: 420,
      ease: 'Back.easeOut',
    });
  }

  playAttackWindup(): void {
    this.scene.tweens.add({
      targets: this,
      scaleX: this.baseScale * 1.08,
      scaleY: this.baseScale * 0.94,
      duration: 120,
      yoyo: true,
      ease: 'Sine.easeOut',
    });
  }

  playWarningPulse(): void {
    this.scene.tweens.add({
      targets: this.core,
      scale: 1.35,
      alpha: 0.7,
      duration: 140,
      yoyo: true,
      ease: 'Sine.easeOut',
    });
  }

  playHurtFlash(): void {
    const flash = this.scene.add.ellipse(0, -8, 104, 124, 0xffffff, 0.72);
    this.add(flash);
    this.scene.time.delayedCall(95, () => flash.destroy());
  }

  playDeath(onComplete: () => void): void {
    const dust = this.scene.add.graphics().setDepth(SceneDepth.Effects);
    dust.fillStyle(0xc8a45d, 0.16);
    dust.fillEllipse(this.parentContainer.x, this.parentContainer.y + 34, 128, 32);
    this.scene.tweens.add({
      targets: dust,
      alpha: 0,
      scale: 1.8,
      duration: 620,
      ease: 'Sine.easeOut',
      onComplete: () => dust.destroy(),
    });

    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      y: 18,
      scale: this.baseScale * 0.55,
      duration: 520,
      ease: 'Sine.easeIn',
      onComplete,
    });
  }

  private draw(): void {
    const shadow = this.scene.add.ellipse(0, 54, 128, 28, 0x000000, 0.34);
    const aura = this.scene.add.graphics();
    aura.lineStyle(2, 0xc8a45d, 0.24);
    aura.strokeEllipse(0, 52, 142, 34);
    aura.fillStyle(0xc8a45d, 0.08);
    aura.fillEllipse(0, 52, 118, 24);

    this.bodyGraphic = this.scene.add.graphics();
    this.bodyGraphic.fillStyle(0x101820, 1);
    this.bodyGraphic.fillEllipse(0, -2, 82, 112);
    this.bodyGraphic.fillStyle(0x1f3134, 0.95);
    this.bodyGraphic.fillTriangle(-46, 36, -18, -54, 4, 40);
    this.bodyGraphic.fillTriangle(42, 34, 18, -50, -5, 42);
    this.bodyGraphic.fillStyle(0x2f3f3f, 0.9);
    this.bodyGraphic.fillEllipse(-24, -4, 44, 74);
    this.bodyGraphic.fillEllipse(24, 0, 46, 80);
    this.bodyGraphic.fillStyle(0x3e4a43, 0.86);
    this.bodyGraphic.fillRoundedRect(-22, -62, 44, 38, 8);
    this.bodyGraphic.lineStyle(4, 0xc8a45d, 0.48);
    this.bodyGraphic.strokeEllipse(0, -2, 90, 120);
    this.bodyGraphic.lineStyle(3, 0xe8d28a, 0.36);
    this.bodyGraphic.lineBetween(-28, -38, 28, -38);
    this.bodyGraphic.lineBetween(-34, 22, 34, 22);

    this.core = this.scene.add.circle(0, -26, 9, 0xe8d28a, 0.86);
    const coreRing = this.scene.add.circle(0, -26, 16).setStrokeStyle(2, 0xe8d28a, 0.42);

    this.add([shadow, aura, this.bodyGraphic, this.core, coreRing]);
  }
}
