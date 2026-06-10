import Phaser from 'phaser';

export class PlayerVisual extends Phaser.GameObjects.Container {
  private readonly baseScale = 1.12;
  private stick?: Phaser.GameObjects.Rectangle;
  private stickGlow?: Phaser.GameObjects.Graphics;
  private customSprite?: Phaser.GameObjects.GameObject;

  constructor(scene: Phaser.Scene, private elementColor: number) {
    super(scene, 0, 0);
    this.setScale(this.baseScale);

    this.drawStickFigure();
  }

  setFacingDirection(angle: number): void {
    this.stick?.setRotation(angle);
    this.stickGlow?.setRotation(angle);
  }

  setElementColor(color: number): void {
    this.elementColor = color;
    if (this.customSprite) return;
    this.drawStickFigure();
  }

  playAttackPulse(kind: 'light' | 'heavy'): void {
    this.scene.tweens.killTweensOf(this);
    this.setScale(kind === 'heavy' ? this.baseScale * 1.12 : this.baseScale * 1.07);
    this.scene.tweens.add({
      targets: this,
      scale: this.baseScale,
      duration: kind === 'heavy' ? 170 : 110,
      ease: 'Sine.easeOut',
    });
  }

  playDodgeTrail(direction: Phaser.Math.Vector2): void {
    const trail = this.scene.add.graphics();
    trail.setDepth(47);
    trail.fillStyle(this.elementColor, 0.18);
    trail.fillEllipse(this.parentContainer.x - direction.x * 16, this.parentContainer.y - direction.y * 16 + 14, 42, 18);
    this.scene.tweens.add({
      targets: trail,
      alpha: 0,
      duration: 180,
      onComplete: () => trail.destroy(),
    });
  }

  playHealPulse(): void {
    const pulse = this.scene.add.graphics();
    pulse.setDepth(49);
    pulse.lineStyle(2, this.elementColor, 0.42);
    pulse.strokeCircle(this.parentContainer.x, this.parentContainer.y + 2, 24);
    this.scene.tweens.add({
      targets: pulse,
      alpha: 0,
      scale: 1.8,
      duration: 360,
      ease: 'Sine.easeOut',
      onComplete: () => pulse.destroy(),
    });
  }

  playHurtFlash(): void {
    this.scene.tweens.killTweensOf(this);
    this.setAlpha(0.72);
    const flash = this.scene.add.circle(this.parentContainer.x, this.parentContainer.y, 30, 0xff6f61, 0.18).setDepth(60);
    this.scene.time.delayedCall(110, () => {
      this.setAlpha(1);
      flash.destroy();
    });
  }

  playDeathState(): void {
    this.scene.tweens.killTweensOf(this);
    this.setAlpha(0.42);
    this.setScale(this.baseScale * 0.96);
    this.setRotation(-0.18);
  }

  replaceWithSprite(sprite: Phaser.GameObjects.GameObject): void {
    this.removeAll(true);
    this.stick = undefined;
    this.stickGlow = undefined;
    this.customSprite = sprite;
    this.add(sprite);
  }

  destroy(fromScene?: boolean): void {
    this.stick = undefined;
    this.stickGlow = undefined;
    this.customSprite = undefined;
    super.destroy(fromScene);
  }

  private drawStickFigure(): void {
    this.removeAll(true);
    this.customSprite = undefined;

    this.stick = this.scene.add.rectangle(22, 0, 64, 7, 0x8a5a2b).setOrigin(0, 0.5);
    this.stickGlow = this.drawStickGlow();
    this.add([this.drawAura(), this.stick, this.stickGlow, this.drawBody()]);
  }

  private drawAura(): Phaser.GameObjects.Graphics {
    const aura = this.scene.add.graphics();
    aura.fillStyle(this.elementColor, 0.1);
    aura.fillEllipse(0, 33, 46, 11);
    aura.lineStyle(2, this.elementColor, 0.24);
    aura.strokeEllipse(0, 33, 56, 17);
    return aura;
  }

  private drawBody(): Phaser.GameObjects.Graphics {
    const body = this.scene.add.graphics();
    body.fillStyle(0x0f1720, 1);
    body.fillCircle(0, -39, 13);
    body.fillRoundedRect(-11, -27, 22, 46, 7);
    body.fillTriangle(-24, 27, 24, 27, 0, -13);

    body.lineStyle(6, 0x0f1720, 1);
    body.lineBetween(-10, -10, -30, 11);
    body.lineBetween(10, -10, 30, 11);
    body.lineBetween(-7, 16, -20, 39);
    body.lineBetween(7, 16, 20, 39);

    body.lineStyle(2, this.elementColor, 0.48);
    body.lineBetween(-11, -4, 11, -4);
    body.lineBetween(-9, 8, 9, 8);
    return body;
  }

  private drawStickGlow(): Phaser.GameObjects.Graphics {
    const glow = this.scene.add.graphics();
    glow.fillStyle(this.elementColor, 0.46);
    glow.fillCircle(90, 0, 5);
    glow.lineStyle(2, this.elementColor, 0.32);
    glow.lineBetween(24, 0, 90, 0);
    return glow;
  }
}
