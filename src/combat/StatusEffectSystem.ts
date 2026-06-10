import type { StatusEffectType } from './CombatTypes';

interface ActiveStatusEffect {
  type: StatusEffectType;
  remainingMs: number;
  tickMs?: number;
  nextTickMs?: number;
}

export class StatusEffectSystem {
  private effects = new Map<StatusEffectType, ActiveStatusEffect>();

  apply(type: StatusEffectType, durationMs: number): void {
    this.effects.set(type, {
      type,
      remainingMs: durationMs,
      tickMs: type === 'Burning' ? 1000 : undefined,
      nextTickMs: type === 'Burning' ? 1000 : undefined,
    });
  }

  update(delta: number, onTickDamage: (type: StatusEffectType, damage: number) => void): void {
    this.effects.forEach((effect, type) => {
      effect.remainingMs -= delta;

      if (effect.tickMs && effect.nextTickMs !== undefined) {
        effect.nextTickMs -= delta;
        if (effect.nextTickMs <= 0 && effect.remainingMs > 0) {
          onTickDamage(type, 1);
          effect.nextTickMs += effect.tickMs;
        }
      }

      if (effect.remainingMs <= 0) {
        this.effects.delete(type);
      }
    });
  }

  has(type: StatusEffectType): boolean {
    return this.effects.has(type);
  }

  getSpeedModifier(): number {
    return this.effects.has('Slowed') || this.effects.has('WoodBind') ? 0.8 : 1;
  }

  getActiveTypes(): StatusEffectType[] {
    return [...this.effects.keys()];
  }
}
