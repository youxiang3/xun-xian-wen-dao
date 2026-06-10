import type { ElementType } from '../types/GameTypes';

type AudioContextConstructor = typeof AudioContext;

export class AudioManager {
  private context?: AudioContext;

  playSwingLight(): void {
    this.playTone(220, 0.035, 'sawtooth', 0.025);
  }

  playSwingHeavy(): void {
    this.playTone(140, 0.06, 'sawtooth', 0.035);
  }

  playHit(): void {
    this.playTone(180, 0.04, 'square', 0.03);
  }

  playSpellCast(elementType: ElementType): void {
    const frequencyByElement: Record<ElementType, number> = {
      Metal: 640,
      Wood: 420,
      Water: 520,
      Fire: 760,
      Earth: 260,
    };
    this.playTone(frequencyByElement[elementType], 0.08, 'triangle', 0.035);
  }

  playBossHit(): void {
    this.playTone(110, 0.09, 'square', 0.045);
  }

  playDodge(): void {
    this.playTone(360, 0.035, 'triangle', 0.02);
  }

  playHeal(): void {
    this.playTone(520, 0.09, 'sine', 0.028);
  }

  private playTone(
    frequency: number,
    durationSeconds: number,
    type: OscillatorType,
    volume: number,
  ): void {
    const context = this.getContext();
    if (!context) return;

    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(volume, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + durationSeconds);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + durationSeconds);
  }

  private getContext(): AudioContext | undefined {
    if (this.context) return this.context;

    const WindowAudioContext = window.AudioContext as AudioContextConstructor | undefined;
    if (!WindowAudioContext) return undefined;

    this.context = new WindowAudioContext();
    return this.context;
  }
}
