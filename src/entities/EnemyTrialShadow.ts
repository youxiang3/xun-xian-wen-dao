import Phaser from 'phaser';
import type { Damageable, DamageInput } from '../combat/CombatTypes';
import { applyElementDamageBonus } from '../combat/ElementSystem';
import { HitFeedbackSystem } from '../combat/HitFeedbackSystem';
import { StatusEffectSystem } from '../combat/StatusEffectSystem';
import type { ElementType } from '../types/GameTypes';
import type { Player } from './Player';
import { EnemyVisual } from './EnemyVisual';

type EnemyState = 'Idle' | 'Chase' | 'Attack' | 'Hurt' | 'Dead';

export class EnemyTrialShadow extends Phaser.GameObjects.Container implements Damageable {
  readonly maxHp = 40;
  hp = 40;
  moveSpeed = 80;
  damage = 8;
  detectRange = 220;
  attackRange = 36;
  attackCooldownMs = 1000;
  elementType: ElementType = 'Wood';

  private enemyState: EnemyState = 'Idle';
  private nextAttackAt = 0;
  private hurtUntil = 0;
  private readonly visual: EnemyVisual;
  private readonly statuses = new StatusEffectSystem();

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    private readonly hitFeedback: HitFeedbackSystem,
  ) {
    super(scene, x, y);
    this.visual = new EnemyVisual(scene);
    this.add(this.visual);
    this.setDepth(46);
    scene.add.existing(this);
  }

  updateEnemy(delta: number, player: Player): void {
    if (this.isDead()) return;
    if (player.isDead()) {
      this.enemyState = 'Idle';
      return;
    }

    this.statuses.update(delta, (_type, damage) => {
      this.applyDamage(damage, 'Spell', 'Fire', 0);
    });
    this.visual.updateStatusTint(this.statuses.getActiveTypes());

    if (this.enemyState === 'Hurt' && this.scene.time.now < this.hurtUntil) return;

    const distance = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
    if (distance > this.detectRange) {
      this.enemyState = 'Idle';
      return;
    }

    if (distance <= this.attackRange) {
      this.enemyState = 'Attack';
      this.tryAttack(player);
      return;
    }

    this.enemyState = 'Chase';
    const speed = this.moveSpeed * this.statuses.getSpeedModifier();
    const direction = new Phaser.Math.Vector2(player.x - this.x, player.y - this.y).normalize();
    this.x += direction.x * speed * (delta / 1000);
    this.y += direction.y * speed * (delta / 1000);
  }

  takeDamage(input: DamageInput): void {
    if (this.isDead()) return;

    const result = applyElementDamageBonus(input.amount, input.elementType, this.elementType);
    this.applyStatusEffects(input);
    this.applyDamage(result.damage, input.hitType, input.elementType, input.knockback ?? 18, input.sourceX, input.sourceY, result.restrained);
  }

  isDead(): boolean {
    return this.enemyState === 'Dead' || this.hp <= 0;
  }

  private tryAttack(player: Player): void {
    if (this.scene.time.now < this.nextAttackAt) return;

    this.nextAttackAt = this.scene.time.now + this.attackCooldownMs;
    this.visual.playAttackPulse();
    player.takeDamage({
      amount: this.damage,
      sourceX: this.x,
      sourceY: this.y,
      knockback: 16,
      hitType: 'Enemy',
    });
  }

  private applyDamage(
    damage: number,
    hitType: DamageInput['hitType'],
    elementType?: ElementType,
    knockback = 18,
    sourceX = this.x,
    sourceY = this.y,
    restrained = false,
  ): void {
    this.hp = Math.max(0, this.hp - damage);
    this.visual.setHpRatio(this.hp / this.maxHp);
    this.visual.playHurtFlash();
    this.enemyState = this.hp <= 0 ? 'Dead' : 'Hurt';
    this.hurtUntil = this.scene.time.now + 150;

    const direction = new Phaser.Math.Vector2(this.x - sourceX, this.y - sourceY);
    this.hitFeedback.playHitFeedback({
      x: this.x,
      y: this.y,
      damage,
      damageLabel: restrained ? `-${damage} 克制` : `-${damage}`,
      elementType,
      target: this,
      knockbackDirection: direction,
      knockbackDistance: knockback,
      hitStopMs: hitType === 'Light' ? 0 : 45,
      screenShake: true,
    });

    this.x = Phaser.Math.Clamp(this.x, 70, 890);
    this.y = Phaser.Math.Clamp(this.y, 120, 486);

    if (this.hp <= 0) {
      this.visual.playDeath(() => this.destroy());
    }
  }

  private applyStatusEffects(input: DamageInput): void {
    input.statusEffects?.forEach((effect) => {
      if (effect === 'Burning') this.statuses.apply('Burning', 3000);
      if (effect === 'Wet') this.statuses.apply('Wet', 2000);
      if (effect === 'Slowed') this.statuses.apply('Slowed', input.elementType === 'Water' ? 2000 : 1500);
      if (effect === 'WoodBind') this.statuses.apply('WoodBind', 1500);
      if (effect === 'MetalBreak') this.statuses.apply('MetalBreak', 1500);
    });
  }
}
