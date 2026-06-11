export type ElementType = 'metal' | 'wood' | 'water' | 'fire' | 'earth' | 'none';

export interface HitFeedbackRequest {
  damage: number;
  element: ElementType;
  hitPoint: { x: number; y: number };
  knockbackDirection: { x: number; y: number };
  isHeavyHit?: boolean;
  isBossTarget?: boolean;
}

export interface HitFeedbackHooks {
  flashWhite(targetId: string, durationMs: number): void;
  applyKnockback(targetId: string, direction: { x: number; y: number }, force: number): void;
  spawnDamageText(text: string, position: { x: number; y: number }, color: string): void;
  screenShake(durationMs: number, intensity: number): void;
  hitStop(durationMs: number): void;
  playHitSound?(kind: 'light' | 'heavy' | ElementType): void;
  setBossHurtState?(targetId: string, element: ElementType): void;
}

const elementColors: Record<ElementType, string> = {
  metal: '#F5D76E',
  wood: '#4CCB6B',
  water: '#58B7FF',
  fire: '#FF5A3D',
  earth: '#B88A4A',
  none: '#FFFFFF',
};

export class HitFeedbackSystemTemplate {
  constructor(private readonly hooks: HitFeedbackHooks) {}

  play(targetId: string, request: HitFeedbackRequest): void {
    const heavy = request.isHeavyHit === true;
    const flashDuration = heavy ? 140 : 80;
    const knockbackForce = heavy ? 9 : 4;
    const shakeDuration = heavy ? 160 : 90;
    const shakeIntensity = heavy ? 3 : 1.5;
    const hitStopDuration = heavy ? 80 : 40;
    const damageText = `${Math.max(0, Math.round(request.damage))}`;
    const color = elementColors[request.element] ?? elementColors.none;

    this.hooks.flashWhite(targetId, flashDuration);
    this.hooks.applyKnockback(targetId, request.knockbackDirection, knockbackForce);
    this.hooks.spawnDamageText(damageText, request.hitPoint, color);
    this.hooks.screenShake(shakeDuration, shakeIntensity);
    this.hooks.hitStop(hitStopDuration);
    this.hooks.playHitSound?.(heavy ? 'heavy' : request.element);

    if (request.isBossTarget) {
      this.hooks.setBossHurtState?.(targetId, request.element);
    }
  }
}
