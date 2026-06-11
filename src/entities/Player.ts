import Phaser from 'phaser';
import type { AudioManager } from '../audio/AudioManager';
import type { Damageable, DamageInput } from '../combat/CombatTypes';
import { DamageHitbox } from '../combat/DamageHitbox';
import { SkillProjectile } from '../combat/SkillProjectile';
import { combatConfig } from '../data/CombatConfig';
import type { BasicAttackSkillDefinition } from '../data/SkillDefinitions';
import { GAME_HEIGHT, GAME_WIDTH } from '../gameConfig';
import { PlayerVisual } from './PlayerVisual';

export interface PlayerStats {
  maxHp: number;
  hp: number;
  maxMp: number;
  mp: number;
  maxStamina: number;
  stamina: number;
  moveSpeed: number;
  healCount: number;
}

export interface PlayerSkillSlotState {
  lightCooldownMs: number;
  heavyCooldownMs: number;
  qCooldownMs: number;
  dodgeCooldownMs: number;
  healCooldownMs: number;
  canLightAttack: boolean;
  canHeavyAttack: boolean;
  canCastQ: boolean;
  canDodge: boolean;
  canHeal: boolean;
  healCount: number;
  maxHealCount: number;
}

type MovementKeys = Record<'W' | 'A' | 'S' | 'D', Phaser.Input.Keyboard.Key>;

interface ActionKeys {
  q: Phaser.Input.Keyboard.Key;
  e: Phaser.Input.Keyboard.Key;
  f: Phaser.Input.Keyboard.Key;
  one: Phaser.Input.Keyboard.Key;
  r: Phaser.Input.Keyboard.Key;
  space: Phaser.Input.Keyboard.Key;
}

export class Player extends Phaser.GameObjects.Container {
  readonly stats: PlayerStats = {
    maxHp: combatConfig.player.maxHp,
    hp: combatConfig.player.maxHp,
    maxMp: combatConfig.player.maxMp,
    mp: combatConfig.player.maxMp,
    maxStamina: combatConfig.player.maxStamina,
    stamina: combatConfig.player.maxStamina,
    moveSpeed: combatConfig.player.moveSpeed,
    healCount: combatConfig.player.maxHealCount,
  };

  isChargingHeavyAttack = false;
  heavyAttackStartTime = 0;
  isInvulnerable = false;
  invulnerableUntil = 0;

  private keys: MovementKeys;
  private actionKeys: ActionKeys;
  private visual: PlayerVisual;
  private facingAngle = 0;
  private currentMoveDirection = new Phaser.Math.Vector2(0, 1);
  private dodgeDirection = new Phaser.Math.Vector2();
  private isDodging = false;
  private dodgeUntil = 0;
  private cooldownUntil = {
    light: 0,
    heavy: 0,
    q: 0,
    dodge: 0,
    heal: 0,
  };
  private dead = false;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    private readonly elementColor: number,
    private readonly initialAttackSkill: BasicAttackSkillDefinition,
    private readonly showHint: (message: string) => void,
    private readonly audioManager?: AudioManager,
    private readonly getTargets: () => Damageable[] = () => [],
  ) {
    super(scene, x, y);
    const keyboard = scene.input.keyboard!;
    this.keys = keyboard.addKeys('W,A,S,D') as MovementKeys;
    this.actionKeys = {
      q: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
      e: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
      f: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F),
      one: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE),
      r: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R),
      space: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
    };
    this.visual = new PlayerVisual(scene, elementColor);

    this.add(this.visual);
    scene.add.existing(this);
    scene.input.on('pointerdown', this.handlePointerDown, this);
  }

  update(delta: number, pointer: Phaser.Input.Pointer): void {
    if (this.isDead()) return;

    this.regenerate(delta);
    this.facePointer(pointer);
    this.handleKeyboardActions();

    if (this.isDodging) {
      this.updateDodge(delta);
    } else {
      this.move(delta);
    }

    this.clampToArena();
    this.updateInvulnerability();
  }

  setElementColor(color: number): void {
    this.visual.setElementColor(color);
    this.visual.setFacingDirection(this.facingAngle);
  }

  takeDamage(input: DamageInput): void {
    if (this.isDead() || this.isInvulnerable) return;

    this.stats.hp = Math.max(0, this.stats.hp - input.amount);
    this.visual.playHurtFlash();
    const direction = new Phaser.Math.Vector2(this.x - input.sourceX, this.y - input.sourceY);
    if (direction.lengthSq() > 0) {
      direction.normalize().scale(input.knockback ?? 12);
      this.x += direction.x;
      this.y += direction.y;
      this.clampToArena();
    }

    this.scene.cameras.main.shake(55, 0.002);
    if (this.stats.hp <= 0) {
      this.die();
    }
  }

  isDead(): boolean {
    return this.dead || this.stats.hp <= 0;
  }

  die(): void {
    if (this.dead) return;

    this.dead = true;
    this.stats.hp = 0;
    this.isDodging = false;
    this.isInvulnerable = false;
    this.visual.playDeathState();
  }

  getSkillSlotState(): PlayerSkillSlotState {
    return {
      lightCooldownMs: this.getCooldownRemaining('light'),
      heavyCooldownMs: this.getCooldownRemaining('heavy'),
      qCooldownMs: this.getCooldownRemaining('q'),
      dodgeCooldownMs: this.getCooldownRemaining('dodge'),
      healCooldownMs: this.getCooldownRemaining('heal'),
      canLightAttack: !this.isDead() && this.stats.stamina >= combatConfig.lightAttack.staminaCost,
      canHeavyAttack: !this.isDead() && this.stats.stamina >= combatConfig.heavyAttack.staminaCost,
      canCastQ: !this.isDead() && this.stats.mp >= this.initialAttackSkill.mpCost,
      canDodge: !this.isDead() && this.stats.stamina >= combatConfig.dodge.staminaCost,
      canHeal: !this.isDead() && this.stats.healCount > 0 && this.stats.hp < this.stats.maxHp,
      healCount: this.stats.healCount,
      maxHealCount: combatConfig.player.maxHealCount,
    };
  }

  releaseHeavyAttack(): void {
    if (this.isDead()) return;

    this.isChargingHeavyAttack = false;
    this.heavyAttackStartTime = 0;
    this.tryHeavyAttack();
  }

  destroy(fromScene?: boolean): void {
    this.scene?.input.off('pointerdown', this.handlePointerDown, this);
    super.destroy(fromScene);
  }

  private handlePointerDown(pointer: Phaser.Input.Pointer): void {
    if (this.isDead()) return;

    if (pointer.button === 0) {
      this.tryLightAttack();
      return;
    }

    if (pointer.button === 2) {
      this.releaseHeavyAttack();
    }
  }

  private handleKeyboardActions(): void {
    if (this.isDead()) return;

    if (Phaser.Input.Keyboard.JustDown(this.actionKeys.q)) this.tryCastQ();
    if (Phaser.Input.Keyboard.JustDown(this.actionKeys.space)) this.tryDodge();
    if (Phaser.Input.Keyboard.JustDown(this.actionKeys.r)) this.tryHeal();
    if (Phaser.Input.Keyboard.JustDown(this.actionKeys.e)) this.showHint('辅助法术尚未觉醒');
    if (Phaser.Input.Keyboard.JustDown(this.actionKeys.f)) this.showHint('命格神通尚未觉醒');
    if (Phaser.Input.Keyboard.JustDown(this.actionKeys.one)) this.showHint('尚未获得法宝');
  }

  private tryLightAttack(): void {
    if (!this.canActByCooldown('light', '轻击冷却中')) return;
    if (!this.consumeStamina(combatConfig.lightAttack.staminaCost)) return;

    this.cooldownUntil.light = this.scene.time.now + combatConfig.lightAttack.cooldownMs;
    this.audioManager?.playSwingLight();
    this.visual.playAttackPulse('light');
    new DamageHitbox(this.scene, {
      x: this.x,
      y: this.y,
      direction: this.facingAngle,
      range: combatConfig.lightAttack.range,
      damage: combatConfig.lightAttack.damage,
      durationMs: combatConfig.lightAttack.hitWindowMs,
      kind: 'light',
      color: this.elementColor,
      targets: this.getTargets(),
      damageInput: {
        amount: combatConfig.lightAttack.damage,
        knockback: 20,
        hitType: 'Light',
      },
    });
  }

  private tryHeavyAttack(): void {
    if (!this.canActByCooldown('heavy', '重击冷却中')) return;
    if (!this.consumeStamina(combatConfig.heavyAttack.staminaCost)) return;

    this.cooldownUntil.heavy = this.scene.time.now + combatConfig.heavyAttack.cooldownMs;
    this.audioManager?.playSwingHeavy();
    this.visual.playAttackPulse('heavy');
    new DamageHitbox(this.scene, {
      x: this.x,
      y: this.y,
      direction: this.facingAngle,
      range: combatConfig.heavyAttack.range,
      damage: combatConfig.heavyAttack.damage,
      durationMs: combatConfig.heavyAttack.hitWindowMs,
      kind: 'heavy',
      color: this.elementColor,
      targets: this.getTargets(),
      damageInput: {
        amount: combatConfig.heavyAttack.damage,
        knockback: 40,
        hitType: 'Heavy',
      },
    });
  }

  private tryCastQ(): void {
    if (!this.canActByCooldown('q', '五行术法冷却中')) return;
    if (this.stats.mp < this.initialAttackSkill.mpCost) {
      this.showHint('灵力不足');
      return;
    }

    this.stats.mp = Math.max(0, this.stats.mp - this.initialAttackSkill.mpCost);
    this.cooldownUntil.q = this.scene.time.now + this.initialAttackSkill.cooldownMs;
    this.audioManager?.playSpellCast(this.initialAttackSkill.element);
    const forward = this.getFacingVector();
    const isEarth = this.initialAttackSkill.element === 'Earth';

    new SkillProjectile(this.scene, {
      skillId: this.initialAttackSkill.id,
      skillName: this.initialAttackSkill.name,
      elementType: this.initialAttackSkill.element,
      damage: this.initialAttackSkill.damage,
      mpCost: this.initialAttackSkill.mpCost,
      maxDistance: isEarth ? 1 : this.initialAttackSkill.range * 80,
      direction: this.facingAngle,
      speed: isEarth ? 0 : this.initialAttackSkill.speed,
      color: this.elementColor,
      x: this.x + forward.x * (isEarth ? 78 : 24),
      y: this.y + forward.y * (isEarth ? 78 : 24),
      targets: this.getTargets(),
      damageInput: {
        amount: this.initialAttackSkill.damage,
        elementType: this.initialAttackSkill.element,
        knockback: this.initialAttackSkill.element === 'Earth' ? 45 : 18,
        hitType: 'Spell',
      },
    });
  }

  private tryDodge(): void {
    if (!this.canActByCooldown('dodge', '闪避冷却中')) return;
    if (!this.consumeStamina(combatConfig.dodge.staminaCost)) return;

    const movement = this.getMovementVector();
    this.dodgeDirection = movement.lengthSq() > 0 ? movement : this.getFacingVector();
    this.isDodging = true;
    this.isInvulnerable = true;
    this.dodgeUntil = this.scene.time.now + combatConfig.dodge.durationMs;
    this.invulnerableUntil = this.dodgeUntil;
    this.cooldownUntil.dodge = this.scene.time.now + combatConfig.dodge.cooldownMs;
    this.audioManager?.playDodge();
    this.visual.playDodgeTrail(this.dodgeDirection);
  }

  private tryHeal(): void {
    if (!this.canActByCooldown('heal', '回血冷却中')) return;

    if (this.stats.hp >= this.stats.maxHp) {
      this.showHint('气血已满');
      return;
    }

    if (this.stats.healCount <= 0) {
      this.showHint('回血次数不足');
      return;
    }

    this.stats.hp = Math.min(this.stats.maxHp, this.stats.hp + combatConfig.heal.amount);
    this.stats.healCount -= 1;
    this.cooldownUntil.heal = this.scene.time.now + combatConfig.heal.cooldownMs;
    this.audioManager?.playHeal();
    this.visual.playHealPulse();
  }

  private move(delta: number): void {
    const velocity = this.getMovementVector();
    if (velocity.lengthSq() === 0) return;

    this.currentMoveDirection = velocity.clone();
    velocity.scale((this.stats.moveSpeed * delta) / 1000);
    this.x += velocity.x;
    this.y += velocity.y;
  }

  private updateDodge(delta: number): void {
    const dodgeSpeed = (combatConfig.dodge.distance / combatConfig.dodge.durationMs) * 1000;
    this.x += this.dodgeDirection.x * dodgeSpeed * (delta / 1000);
    this.y += this.dodgeDirection.y * dodgeSpeed * (delta / 1000);

    if (this.scene.time.now >= this.dodgeUntil) {
      this.isDodging = false;
    }
  }

  private facePointer(pointer: Phaser.Input.Pointer): void {
    this.facingAngle = Phaser.Math.Angle.Between(this.x, this.y, pointer.worldX, pointer.worldY);
    this.visual.setFacingDirection(this.facingAngle);
  }

  private regenerate(delta: number): void {
    const seconds = delta / 1000;
    this.stats.stamina = Math.min(
      this.stats.maxStamina,
      this.stats.stamina + combatConfig.player.staminaRegenPerSecond * seconds,
    );
    this.stats.mp = Math.min(this.stats.maxMp, this.stats.mp + combatConfig.player.mpRegenPerSecond * seconds);
  }

  private consumeStamina(cost: number): boolean {
    if (this.stats.stamina < cost) {
      this.showHint('体力不足');
      return false;
    }

    this.stats.stamina = Math.max(0, this.stats.stamina - cost);
    return true;
  }

  private canActByCooldown(action: keyof typeof this.cooldownUntil, message: string): boolean {
    if (this.getCooldownRemaining(action) > 0) {
      this.showHint(message);
      return false;
    }
    return true;
  }

  private getCooldownRemaining(action: keyof typeof this.cooldownUntil): number {
    return Math.max(0, this.cooldownUntil[action] - this.scene.time.now);
  }

  private getMovementVector(): Phaser.Math.Vector2 {
    const vector = new Phaser.Math.Vector2(
      (this.keys.D.isDown ? 1 : 0) - (this.keys.A.isDown ? 1 : 0),
      (this.keys.S.isDown ? 1 : 0) - (this.keys.W.isDown ? 1 : 0),
    );
    return vector.lengthSq() > 0 ? vector.normalize() : vector;
  }

  private getFacingVector(): Phaser.Math.Vector2 {
    return new Phaser.Math.Vector2(Math.cos(this.facingAngle), Math.sin(this.facingAngle)).normalize();
  }

  private clampToArena(): void {
    this.x = Phaser.Math.Clamp(this.x, 58, GAME_WIDTH - 58);
    this.y = Phaser.Math.Clamp(this.y, 118, GAME_HEIGHT - 54);
  }

  private updateInvulnerability(): void {
    if (this.isInvulnerable && this.scene.time.now >= this.invulnerableUntil) {
      this.isInvulnerable = false;
    }
  }
}
