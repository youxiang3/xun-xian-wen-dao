import Phaser from 'phaser';
import type { AudioManager } from '../audio/AudioManager';
import type { ElementType } from '../types/GameTypes';

export interface HitFeedbackOptions {
  x: number;
  y: number;
  damage: number;
  damageLabel?: string;
  elementType?: ElementType;
  target?: Phaser.GameObjects.GameObject;
  knockbackDirection?: Phaser.Math.Vector2;
  knockbackDistance?: number;
  hitStopMs?: number;
  screenShake?: boolean;
  isBoss?: boolean;
}

type TintableTarget = Phaser.GameObjects.GameObject & {
  setTintFill?: (color: number) => Phaser.GameObjects.GameObject;
  clearTint?: () => Phaser.GameObjects.GameObject;
};

export class HitFeedbackSystem {
  constructor(
    private readonly scene: Phaser.Scene,
    private readonly audioManager?: AudioManager,
  ) {}

  playHitFeedback(options: HitFeedbackOptions): void {
    this.flashWhite(options.target);
    this.applyKnockback(options.target, options.knockbackDirection, options.knockbackDistance ?? 10);
    this.spawnDamageText(options.x, options.y, options.damageLabel ?? `-${options.damage}`);
    this.spawnHitParticles(options.x, options.y, options.elementType);

    if (options.hitStopMs && options.hitStopMs > 0) {
      this.playHitStop(options.hitStopMs);
    }

    if (options.screenShake) {
      this.scene.cameras.main.shake(70, options.isBoss ? 0.006 : 0.003);
    }

    if (options.isBoss) {
      this.audioManager?.playBossHit();
    } else {
      this.audioManager?.playHit();
    }
  }

  flashWhite(target?: Phaser.GameObjects.GameObject): void {
    const tintable = target as TintableTarget | undefined;
    if (!tintable?.setTintFill || !tintable.clearTint) return;

    tintable.setTintFill(0xffffff);
    this.scene.time.delayedCall(80, () => tintable.clearTint?.());
  }

  applyKnockback(
    target?: Phaser.GameObjects.GameObject,
    direction = new Phaser.Math.Vector2(1, 0),
    distance = 10,
  ): void {
    if (!target || !('x' in target) || !('y' in target)) return;

    const normalized = direction.lengthSq() > 0 ? direction.clone().normalize() : new Phaser.Math.Vector2(1, 0);
    this.scene.tweens.add({
      targets: target,
      x: Number(target.x) + normalized.x * distance,
      y: Number(target.y) + normalized.y * distance,
      duration: 90,
      ease: 'Sine.easeOut',
    });
  }

  playHitStop(durationMs = 45): void {
    const originalTweenScale = this.scene.tweens.timeScale;
    this.scene.tweens.timeScale = 0.08;
    this.scene.time.delayedCall(durationMs, () => {
      this.scene.tweens.timeScale = originalTweenScale;
    });
  }

  spawnDamageText(x: number, y: number, label: string): void {
    const text = this.scene.add
      .text(x, y - 24, label, {
        fontSize: '20px',
        color: '#f3df9a',
        fontFamily: '"Microsoft YaHei", "Noto Sans SC", Arial, sans-serif',
        stroke: '#111111',
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setDepth(140);

    this.scene.tweens.add({
      targets: text,
      y: y - 68,
      alpha: 0,
      duration: 620,
      ease: 'Sine.easeOut',
      onComplete: () => text.destroy(),
    });
  }

  spawnHitParticles(x: number, y: number, elementType: ElementType = 'Metal'): void {
    const color = this.getElementColor(elementType);
    for (let i = 0; i < 5; i += 1) {
      const particle = this.scene.add.circle(x, y, 3, color, 0.82).setDepth(135);
      const angle = (Math.PI * 2 * i) / 5;
      this.scene.tweens.add({
        targets: particle,
        x: x + Math.cos(angle) * 28,
        y: y + Math.sin(angle) * 18,
        alpha: 0,
        duration: 260,
        ease: 'Sine.easeOut',
        onComplete: () => particle.destroy(),
      });
    }
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
