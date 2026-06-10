import Phaser from 'phaser';
import type { Damageable, DamageInput } from './CombatTypes';

export type HitboxKind = 'light' | 'heavy';

export interface DamageHitboxConfig {
  x: number;
  y: number;
  direction: number;
  range: number;
  damage: number;
  durationMs: number;
  kind: HitboxKind;
  color: number;
  targets?: Damageable[];
  damageInput: Omit<DamageInput, 'sourceX' | 'sourceY'>;
}

export class DamageHitbox extends Phaser.GameObjects.Container {
  readonly damage: number;
  readonly hitTargets = new Set<Phaser.GameObjects.GameObject>();

  constructor(scene: Phaser.Scene, private readonly config: DamageHitboxConfig) {
    super(scene, config.x, config.y);
    this.damage = config.damage;
    this.setDepth(48);
    this.add(this.drawRange());
    scene.add.existing(this);
    this.checkTargets();
    scene.time.delayedCall(config.durationMs, () => this.destroy());
  }

  private checkTargets(): void {
    this.config.targets?.forEach((target) => {
      if (target.isDead() || this.hitTargets.has(target as unknown as Phaser.GameObjects.GameObject)) return;

      const distance = Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y);
      const angleToTarget = Phaser.Math.Angle.Between(this.x, this.y, target.x, target.y);
      const angleDelta = Math.abs(Phaser.Math.Angle.Wrap(angleToTarget - this.config.direction));
      const spread = this.config.kind === 'heavy' ? Math.PI / 3.2 : Math.PI / 4.4;

      if (distance <= this.config.range + 18 && angleDelta <= spread) {
        this.hitTargets.add(target as unknown as Phaser.GameObjects.GameObject);
        target.takeDamage({
          ...this.config.damageInput,
          sourceX: this.x,
          sourceY: this.y,
        });
      }
    });
  }

  private drawRange(): Phaser.GameObjects.Graphics {
    const graphics = this.scene.add.graphics();
    const spread = this.config.kind === 'heavy' ? Math.PI / 3.2 : Math.PI / 4.4;
    const points: Phaser.Math.Vector2[] = [new Phaser.Math.Vector2(0, 0)];

    for (let i = 0; i <= 10; i += 1) {
      const angle = this.config.direction - spread + (spread * 2 * i) / 10;
      points.push(new Phaser.Math.Vector2(Math.cos(angle) * this.config.range, Math.sin(angle) * this.config.range));
    }

    graphics.fillStyle(this.config.color, this.config.kind === 'heavy' ? 0.24 : 0.16);
    graphics.lineStyle(this.config.kind === 'heavy' ? 4 : 2, this.config.color, this.config.kind === 'heavy' ? 0.72 : 0.62);
    graphics.beginPath();
    graphics.moveTo(points[0].x, points[0].y);
    points.slice(1).forEach((point) => graphics.lineTo(point.x, point.y));
    graphics.closePath();
    graphics.fillPath();
    graphics.strokePath();

    graphics.lineStyle(1, 0xffffff, this.config.kind === 'heavy' ? 0.24 : 0.16);
    graphics.lineBetween(0, 0, Math.cos(this.config.direction) * this.config.range, Math.sin(this.config.direction) * this.config.range);
    return graphics;
  }
}
