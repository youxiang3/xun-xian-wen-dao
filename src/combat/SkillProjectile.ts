import Phaser from 'phaser';
import type { ElementType } from '../types/GameTypes';
import { SceneDepth } from '../utils/DepthUtils';
import type { Damageable, DamageInput, StatusEffectType } from './CombatTypes';

export interface SkillProjectileConfig {
  skillId: string;
  skillName: string;
  elementType: ElementType;
  damage: number;
  mpCost: number;
  maxDistance: number;
  direction: number;
  speed: number;
  color: number;
  x: number;
  y: number;
  targets?: Damageable[];
  damageInput: Omit<DamageInput, 'sourceX' | 'sourceY'>;
}

export class SkillProjectile extends Phaser.GameObjects.Container {
  private traveled = 0;
  private readonly velocity: Phaser.Math.Vector2;
  private readonly updateHandler: (_time: number, delta: number) => void;

  readonly skillId: string;
  readonly skillName: string;
  readonly elementType: ElementType;
  readonly damage: number;
  readonly mpCost: number;
  readonly maxDistance: number;
  readonly direction: number;
  private readonly hitTargets = new Set<Damageable>();

  constructor(scene: Phaser.Scene, config: SkillProjectileConfig) {
    super(scene, config.x, config.y);
    this.skillId = config.skillId;
    this.skillName = config.skillName;
    this.elementType = config.elementType;
    this.damage = config.damage;
    this.mpCost = config.mpCost;
    this.maxDistance = config.maxDistance;
    this.direction = config.direction;
    this.targets = config.targets ?? [];
    this.damageInput = config.damageInput;
    this.velocity = new Phaser.Math.Vector2(Math.cos(config.direction), Math.sin(config.direction)).scale(config.speed);

    this.setDepth(SceneDepth.Effects);
    this.setRotation(config.direction);
    this.add(this.drawSkill(config));
    scene.add.existing(this);

    this.updateHandler = (_time, delta) => this.updateProjectile(delta);
    if (config.speed <= 0) {
      this.checkTargets();
      scene.time.delayedCall(320, () => this.destroy());
    } else {
      scene.events.on(Phaser.Scenes.Events.UPDATE, this.updateHandler);
    }
  }

  private readonly targets: Damageable[];
  private readonly damageInput: Omit<DamageInput, 'sourceX' | 'sourceY'>;

  destroy(fromScene?: boolean): void {
    this.scene?.events.off(Phaser.Scenes.Events.UPDATE, this.updateHandler);
    super.destroy(fromScene);
  }

  private updateProjectile(delta: number): void {
    const distance = (this.velocity.length() * delta) / 1000;
    this.x += (this.velocity.x * delta) / 1000;
    this.y += (this.velocity.y * delta) / 1000;
    this.traveled += distance;
    this.checkTargets();

    if (this.traveled >= this.maxDistance) {
      this.destroy();
    }
  }

  private checkTargets(): void {
    for (const target of this.targets) {
      if (target.isDead() || this.hitTargets.has(target)) continue;

      const distance = Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y);
      if (distance <= 28) {
        this.hitTargets.add(target);
        target.takeDamage({
          ...this.damageInput,
          statusEffects: this.damageInput.statusEffects ?? this.getStatusEffects(),
          sourceX: this.x,
          sourceY: this.y,
        });
        this.destroy();
        break;
      }
    }
  }

  private getStatusEffects(): StatusEffectType[] {
    if (this.elementType === 'Wood') return ['WoodBind', 'Slowed'];
    if (this.elementType === 'Water') return ['Wet', 'Slowed'];
    if (this.elementType === 'Fire') return ['Burning'];
    if (this.elementType === 'Metal') return ['MetalBreak'];
    return [];
  }

  private drawSkill(config: SkillProjectileConfig): Phaser.GameObjects.Graphics {
    const graphics = this.scene.add.graphics();

    if (config.elementType === 'Earth') {
      graphics.fillStyle(config.color, 0.88);
      graphics.fillTriangle(0, 17, 38, 0, 0, -17);
      graphics.lineStyle(3, 0xf3ddb0, 0.56);
      graphics.lineBetween(-14, 0, 42, 0);
      return graphics;
    }

    if (config.elementType === 'Wood') {
      graphics.lineStyle(7, config.color, 0.86);
      graphics.lineBetween(-22, 0, -4, -10);
      graphics.lineBetween(-4, -10, 16, -5);
      graphics.lineBetween(16, -5, 34, 9);
      graphics.lineBetween(34, 9, 60, 0);
      graphics.lineStyle(2, 0xd8ffe5, 0.32);
      graphics.lineBetween(-22, 0, 60, 0);
      graphics.fillStyle(config.color, 0.65);
      graphics.fillCircle(62, 0, 5);
      return graphics;
    }

    if (config.elementType === 'Water') {
      graphics.fillStyle(config.color, 0.78);
      graphics.fillTriangle(-20, -9, 56, 0, -20, 9);
      graphics.lineStyle(3, 0xd8f3ff, 0.62);
      graphics.strokeTriangle(-20, -9, 56, 0, -20, 9);
      graphics.lineStyle(2, config.color, 0.28);
      graphics.lineBetween(-38, 0, -8, 0);
      return graphics;
    }

    if (config.elementType === 'Fire') {
      graphics.fillStyle(config.color, 0.86);
      graphics.fillCircle(18, 0, 10);
      graphics.fillStyle(0xffd49a, 0.58);
      graphics.fillCircle(25, 0, 5);
      graphics.lineStyle(4, config.color, 0.38);
      graphics.lineBetween(-32, 0, 14, 0);
      return graphics;
    }

    graphics.fillStyle(config.color, 0.9);
    graphics.fillTriangle(-22, -7, 62, 0, -22, 7);
    graphics.lineStyle(3, 0xfff3c2, 0.62);
    graphics.lineBetween(-28, 0, 68, 0);
    graphics.lineStyle(2, config.color, 0.28);
    graphics.lineBetween(-48, 0, -18, 0);
    return graphics;
  }
}
