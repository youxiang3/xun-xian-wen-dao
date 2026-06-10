import Phaser from 'phaser';
import type { ElementType } from '../types/GameTypes';
import type { SceneFeedbackKind } from './CombatFeedbackTypes';

export class SceneFeedbackSystem {
  constructor(private readonly scene: Phaser.Scene) {}

  play(kind: SceneFeedbackKind, x: number, y: number, color = 0xe8d28a): void {
    if (kind === 'GroundCrack') this.spawnGroundCrack(x, y, color);
    if (kind === 'Dust') this.spawnDust(x, y);
    if (kind === 'MagicCircleRipple') this.spawnMagicCircleRipple(x, y, color);
    if (kind === 'EarthSpikeAfterimage') this.spawnEarthSpikeAfterimage(x, y);
    if (kind === 'BossImpactRing') this.spawnBossImpactRing(x, y, color);
    if (kind === 'StoneStepShake') this.scene.cameras.main.shake(90, 0.002);
  }

  playElementImpact(elementType: ElementType, x: number, y: number): void {
    const color = this.getElementColor(elementType);
    if (elementType === 'Earth') {
      this.play('GroundCrack', x, y, color);
      this.play('Dust', x, y);
      return;
    }
    this.play('MagicCircleRipple', x, y, color);
  }

  spawnGroundCrack(x: number, y: number, color = 0xc8a45d): void {
    const graphics = this.scene.add.graphics().setDepth(42);
    graphics.lineStyle(2, color, 0.42);
    graphics.lineBetween(x - 28, y, x - 8, y + 5);
    graphics.lineBetween(x - 8, y + 5, x + 10, y - 4);
    graphics.lineBetween(x + 10, y - 4, x + 32, y + 2);
    this.fadeAndDestroy(graphics, 520);
  }

  spawnDust(x: number, y: number): void {
    for (let i = 0; i < 6; i += 1) {
      const dust = this.scene.add.circle(x, y, 3, 0xc8a45d, 0.18).setDepth(41);
      this.scene.tweens.add({
        targets: dust,
        x: x + Phaser.Math.Between(-26, 26),
        y: y + Phaser.Math.Between(-10, 12),
        alpha: 0,
        duration: 420,
        onComplete: () => dust.destroy(),
      });
    }
  }

  spawnMagicCircleRipple(x: number, y: number, color = 0xe8d28a): void {
    const ring = this.scene.add.circle(x, y, 12).setStrokeStyle(2, color, 0.36).setDepth(43);
    this.scene.tweens.add({
      targets: ring,
      scale: 2.6,
      alpha: 0,
      duration: 420,
      ease: 'Sine.easeOut',
      onComplete: () => ring.destroy(),
    });
  }

  spawnEarthSpikeAfterimage(x: number, y: number): void {
    const spike = this.scene.add.triangle(x, y, 0, 22, 18, -16, 36, 22, 0xc8a45d, 0.18).setDepth(42);
    this.fadeAndDestroy(spike, 360);
  }

  spawnBossImpactRing(x: number, y: number, color = 0xe8d28a): void {
    const ring = this.scene.add.circle(x, y, 24).setStrokeStyle(3, color, 0.5).setDepth(44);
    this.scene.tweens.add({
      targets: ring,
      scale: 4.2,
      alpha: 0,
      duration: 620,
      ease: 'Sine.easeOut',
      onComplete: () => ring.destroy(),
    });
  }

  private fadeAndDestroy(target: Phaser.GameObjects.GameObject, duration: number): void {
    this.scene.tweens.add({
      targets: target,
      alpha: 0,
      duration,
      ease: 'Sine.easeOut',
      onComplete: () => target.destroy(),
    });
  }

  private getElementColor(elementType: ElementType): number {
    const colors: Record<ElementType, number> = {
      Metal: 0xe8d28a,
      Wood: 0x62c78f,
      Water: 0x7fc7ff,
      Fire: 0xf07145,
      Earth: 0xc8a45d,
    };
    return colors[elementType];
  }
}
