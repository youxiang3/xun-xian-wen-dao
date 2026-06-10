import Phaser from 'phaser';
import type { StatusEffectType } from '../combat/CombatTypes';

export class EnemyVisual extends Phaser.GameObjects.Container {
  private shadowBody!: Phaser.GameObjects.Graphics;
  private hpFill!: Phaser.GameObjects.Rectangle;
  private hpBack!: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);
    this.setScale(1.13);
    this.draw();
  }

  setHpRatio(ratio: number): void {
    const clamped = Phaser.Math.Clamp(ratio, 0, 1);
    this.hpFill.setDisplaySize(50 * clamped, 5);
    this.hpBack.setVisible(clamped > 0);
    this.hpFill.setVisible(clamped > 0);
  }

  playHurtFlash(): void {
    this.shadowBody.setAlpha(1);
    const flash = this.scene.add.ellipse(0, 8, 62, 72, 0xffffff, 0.82);
    this.add(flash);
    this.scene.time.delayedCall(95, () => {
      flash.destroy();
      this.shadowBody.setAlpha(0.82);
    });
  }

  playAttackPulse(): void {
    this.scene.tweens.add({
      targets: this,
      scaleX: 1.14,
      scaleY: 0.9,
      yoyo: true,
      duration: 90,
      ease: 'Sine.easeOut',
    });
  }

  playDeath(onComplete: () => void): void {
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      scale: 0.35,
      duration: 260,
      ease: 'Sine.easeIn',
      onComplete,
    });
  }

  updateStatusTint(statuses: StatusEffectType[]): void {
    if (statuses.includes('Burning')) {
      this.shadowBody.setAlpha(0.96);
      return;
    }
    if (statuses.includes('Wet')) {
      this.shadowBody.setAlpha(0.68);
      return;
    }
    if (statuses.includes('WoodBind') || statuses.includes('Slowed')) {
      this.shadowBody.setAlpha(0.76);
      return;
    }
    this.shadowBody.setAlpha(0.82);
  }

  private draw(): void {
    this.shadowBody = this.scene.add.graphics();
    this.shadowBody.fillStyle(0x141820, 0.82);
    this.shadowBody.fillEllipse(0, 8, 56, 68);
    this.shadowBody.fillStyle(0x202733, 0.52);
    this.shadowBody.fillEllipse(-14, 6, 26, 44);
    this.shadowBody.fillEllipse(16, 3, 24, 48);
    this.shadowBody.fillStyle(0x99d6ad, 0.55);
    this.shadowBody.fillCircle(-9, -10, 4);
    this.shadowBody.fillCircle(9, -11, 4);
    this.shadowBody.lineStyle(3, 0x6e7784, 0.42);
    this.shadowBody.strokeEllipse(0, 8, 64, 76);

    const shadow = this.scene.add.ellipse(0, 48, 62, 14, 0x000000, 0.3);
    this.hpBack = this.scene.add.rectangle(0, -48, 56, 8, 0x15181d, 0.9);
    this.hpFill = this.scene.add.rectangle(-25, -48, 50, 5, 0xb33a42, 1).setOrigin(0, 0.5);
    this.add([shadow, this.shadowBody, this.hpBack, this.hpFill]);
  }
}
