import Phaser from 'phaser';
import type { Damageable, DamageInput } from '../combat/CombatTypes';
import { applyElementDamageBonus } from '../combat/ElementSystem';
import { HitFeedbackSystem } from '../combat/HitFeedbackSystem';
import { SceneFeedbackSystem } from '../combat/SceneFeedbackSystem';
import { StatusEffectSystem } from '../combat/StatusEffectSystem';
import { GAME_HEIGHT, GAME_WIDTH } from '../gameConfig';
import type { ElementType } from '../types/GameTypes';
import { SceneDepth } from '../utils/DepthUtils';
import { BossVisual } from './BossVisual';
import type { Player } from './Player';

type BossState = 'Inactive' | 'Intro' | 'Idle' | 'Chase' | 'Attack' | 'Warning' | 'Hurt' | 'Stagger' | 'Dead';

export class BossWudaoGateGuardian extends Phaser.GameObjects.Container implements Damageable {
  readonly maxHp = 160;
  hp = 160;
  moveSpeed = 55;
  damage = 12;
  attackRange = 48;
  detectRange = 999;
  attackCooldownMs = 1300;
  elementType: ElementType = 'Earth';

  private bossState: BossState = 'Inactive';
  private nextAttackAt = 0;
  private nextWarningAt = 0;
  private hurtUntil = 0;
  private warningCircle?: Phaser.GameObjects.Arc;
  private readonly visual: BossVisual;
  private readonly statuses = new StatusEffectSystem();

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    private readonly hitFeedback: HitFeedbackSystem,
    private readonly sceneFeedback: SceneFeedbackSystem,
    private readonly onDeath: () => void,
  ) {
    super(scene, x, y);
    this.visual = new BossVisual(scene);
    this.add(this.visual);
    this.setVisible(false);
    this.setActive(false);
    scene.add.existing(this);
  }

  activate(): void {
    if (this.bossState !== 'Inactive') return;

    this.bossState = 'Intro';
    this.setVisible(true);
    this.setActive(true);
    this.nextAttackAt = this.scene.time.now + 900;
    this.nextWarningAt = this.scene.time.now + Phaser.Math.Between(3600, 5200);
    this.sceneFeedback.play('MagicCircleRipple', this.x, this.y, 0xc8a45d);
    this.sceneFeedback.play('StoneStepShake', this.x, this.y, 0xc8a45d);
    this.visual.playIntro();

    this.scene.time.delayedCall(520, () => {
      if (this.bossState === 'Intro') this.bossState = 'Idle';
    });
  }

  updateBoss(delta: number, player: Player): void {
    if (!this.active || this.isDead() || this.bossState === 'Inactive' || this.bossState === 'Intro') return;
    if (player.isDead()) {
      this.bossState = 'Idle';
      return;
    }

    this.statuses.update(delta, (_type, damage) => {
      this.applyDamage(damage, 'Spell', 'Fire', 0);
    });

    if ((this.bossState === 'Hurt' || this.bossState === 'Stagger') && this.scene.time.now < this.hurtUntil) return;

    if (this.scene.time.now >= this.nextWarningAt && this.bossState !== 'Warning' && this.bossState !== 'Attack') {
      this.startWarningAttack(player);
      return;
    }

    const distance = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
    if (distance > this.detectRange) {
      this.bossState = 'Idle';
      return;
    }

    if (distance <= this.attackRange) {
      this.bossState = 'Attack';
      this.tryBasicAttack(player);
      return;
    }

    this.bossState = 'Chase';
    const speed = this.moveSpeed * this.statuses.getSpeedModifier();
    const direction = new Phaser.Math.Vector2(player.x - this.x, player.y - this.y).normalize();
    this.x += direction.x * speed * (delta / 1000);
    this.y += direction.y * speed * (delta / 1000);
    this.clampToArena();
  }

  takeDamage(input: DamageInput): void {
    if (!this.active || this.isDead() || this.bossState === 'Inactive') return;

    const result = applyElementDamageBonus(input.amount, input.elementType, this.elementType);
    this.applyStatusEffects(input);
    this.applyDamage(result.damage, input.hitType, input.elementType, input.knockback ?? 18, input.sourceX, input.sourceY, result.restrained);
  }

  isDead(): boolean {
    return this.bossState === 'Dead' || this.hp <= 0;
  }

  isActivated(): boolean {
    return this.active && this.bossState !== 'Inactive';
  }

  getHpRatio(): number {
    return this.maxHp <= 0 ? 0 : Phaser.Math.Clamp(this.hp / this.maxHp, 0, 1);
  }

  private tryBasicAttack(player: Player): void {
    if (this.scene.time.now < this.nextAttackAt) return;

    this.nextAttackAt = this.scene.time.now + this.attackCooldownMs;
    this.visual.playAttackWindup();
    this.scene.time.delayedCall(220, () => {
      if (this.isDead() || player.isDead()) return;

      const distance = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
      if (distance <= this.attackRange + 12) {
        player.takeDamage({
          amount: this.damage,
          sourceX: this.x,
          sourceY: this.y,
          knockback: 22,
          hitType: 'Enemy',
        });
        this.sceneFeedback.play('Dust', player.x, player.y, 0xc8a45d);
      }
    });
  }

  private startWarningAttack(player: Player): void {
    this.bossState = 'Warning';
    this.nextWarningAt = this.scene.time.now + Phaser.Math.Between(4200, 6000);
    this.visual.playWarningPulse();

    const targetX = Phaser.Math.Clamp(player.x, 88, GAME_WIDTH - 88);
    const targetY = Phaser.Math.Clamp(player.y, 150, GAME_HEIGHT - 82);
    const radius = 62;
    this.warningCircle?.destroy();
    this.warningCircle = this.scene.add
      .circle(targetX, targetY, radius, 0x8f2f24, 0.14)
      .setStrokeStyle(3, 0xff5c48, 0.72)
      .setDepth(SceneDepth.Effects + 5);

    this.scene.tweens.add({
      targets: this.warningCircle,
      scale: 1.12,
      alpha: 0.82,
      duration: 180,
      yoyo: true,
      repeat: 3,
      ease: 'Sine.easeInOut',
    });

    this.scene.time.delayedCall(900, () => {
      if (this.warningCircle) {
        this.warningCircle.destroy();
        this.warningCircle = undefined;
      }

      if (!this.isDead()) {
        this.sceneFeedback.play('BossImpactRing', targetX, targetY, 0xff5c48);
        this.sceneFeedback.play('GroundCrack', targetX, targetY, 0xc8a45d);
        const distance = Phaser.Math.Distance.Between(targetX, targetY, player.x, player.y);
        if (!player.isDead() && distance <= radius) {
          player.takeDamage({
            amount: 18,
            sourceX: targetX,
            sourceY: targetY,
            knockback: 28,
            hitType: 'Enemy',
          });
        }
      }

      if (this.bossState === 'Warning') this.bossState = 'Idle';
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
    this.visual.playHurtFlash();
    this.bossState = this.hp <= 0 ? 'Dead' : hitType === 'Heavy' ? 'Stagger' : 'Hurt';
    this.hurtUntil = this.scene.time.now + (hitType === 'Heavy' ? 240 : 170);

    const direction = new Phaser.Math.Vector2(this.x - sourceX, this.y - sourceY);
    this.hitFeedback.playHitFeedback({
      x: this.x,
      y: this.y - 18,
      damage,
      damageLabel: restrained ? `-${damage} 克制` : `-${damage}`,
      elementType,
      target: this,
      knockbackDirection: direction,
      knockbackDistance: Math.max(8, knockback * 0.42),
      hitStopMs: hitType === 'Light' ? 28 : 55,
      screenShake: true,
      isBoss: true,
    });

    this.clampToArena();

    if (this.hp <= 0) {
      this.die();
    }
  }

  private die(): void {
    if (this.bossState === 'Dead' && this.hp > 0) return;

    this.hp = 0;
    this.bossState = 'Dead';
    this.warningCircle?.destroy();
    this.warningCircle = undefined;
    this.sceneFeedback.play('BossImpactRing', this.x, this.y, 0xe8d28a);
    this.visual.playDeath(() => {
      this.setActive(false);
      this.setVisible(false);
    });
    this.onDeath();
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

  private clampToArena(): void {
    this.x = Phaser.Math.Clamp(this.x, 70, GAME_WIDTH - 70);
    this.y = Phaser.Math.Clamp(this.y, 126, GAME_HEIGHT - 58);
  }
}
