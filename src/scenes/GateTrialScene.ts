import Phaser from 'phaser';
import { AudioManager } from '../audio/AudioManager';
import { HitFeedbackSystem } from '../combat/HitFeedbackSystem';
import { SceneFeedbackSystem } from '../combat/SceneFeedbackSystem';
import { defaultElementColor, elementColors } from '../data/ElementConfig';
import { EnemyTrialShadow } from '../entities/EnemyTrialShadow';
import { Player } from '../entities/Player';
import { GAME_HEIGHT, GAME_WIDTH } from '../gameConfig';
import { gameSession, getInitialAttackSkill } from '../session/GameSession';
import { CombatHUD } from '../ui/CombatHUD';
import { SkillSlotHUD } from '../ui/SkillSlotHUD';

export const GateTrialEnvironment = 'Earth';
const GateTrialEnvironmentName = '悟道山·土行';

export class GateTrialScene extends Phaser.Scene {
  private player!: Player;
  private combatHud!: CombatHUD;
  private skillHud!: SkillSlotHUD;
  private audioManager!: AudioManager;
  private hitFeedbackSystem!: HitFeedbackSystem;
  private sceneFeedbackSystem!: SceneFeedbackSystem;
  private enemies: EnemyTrialShadow[] = [];
  private hintText?: Phaser.GameObjects.Text;
  private failureOverlay?: Phaser.GameObjects.Container;
  private tutorialCompleteText?: Phaser.GameObjects.Text;
  private failureShown = false;
  private tutorialCompleteShown = false;

  constructor() {
    super('GateTrialScene');
  }

  create(): void {
    gameSession.stageId = 'wudao_gate_trial';
    this.input.mouse?.disableContextMenu();
    this.failureShown = false;
    this.tutorialCompleteShown = false;
    this.failureOverlay = undefined;
    this.tutorialCompleteText = undefined;

    const elementColor = this.getElementColor();
    const initialAttackSkill = getInitialAttackSkill();
    this.audioManager = new AudioManager();
    this.hitFeedbackSystem = new HitFeedbackSystem(this, this.audioManager);
    this.sceneFeedbackSystem = new SceneFeedbackSystem(this);
    this.drawArena(elementColor);

    this.player = new Player(this, GAME_WIDTH / 2, 424, elementColor, initialAttackSkill, (message) => {
      this.showHint(message);
    }, this.audioManager, () => this.getDamageableEnemies());
    this.combatHud = new CombatHUD(this, this.player.stats);
    this.skillHud = new SkillSlotHUD(this, initialAttackSkill.name, elementColor);
    this.createEnemies();
  }

  update(_time: number, delta: number): void {
    this.player.update(delta, this.input.activePointer);

    if (this.player.isDead()) {
      this.showFailureOverlay();
    } else {
      this.updateEnemies(delta);
      if (this.player.isDead()) {
        this.showFailureOverlay();
      }
    }

    this.combatHud.update(this.player.stats);
    this.skillHud.update(this.player.getSkillSlotState());
  }

  private getElementColor(): number {
    const rootElement = gameSession.selectedHeartTrialResult?.rootElement ?? gameSession.rootElement;
    return rootElement ? elementColors[rootElement] : defaultElementColor;
  }

  private showHint(message: string): void {
    if (!this.hintText) {
      this.hintText = this.add
        .text(GAME_WIDTH / 2, GAME_HEIGHT - 112, '', {
          fontSize: '18px',
          color: '#e8d28a',
          fontFamily: '"Microsoft YaHei", "Noto Sans SC", Arial, sans-serif',
          stroke: '#101015',
          strokeThickness: 3,
        })
        .setOrigin(0.5)
        .setDepth(120);
    }

    this.tweens.killTweensOf(this.hintText);
    this.hintText.setText(message).setAlpha(1);
    this.tweens.add({
      targets: this.hintText,
      alpha: 0,
      delay: 650,
      duration: 520,
      ease: 'Sine.easeOut',
    });
  }

  private createEnemies(): void {
    this.enemies = [new EnemyTrialShadow(this, GAME_WIDTH / 2, 306, this.hitFeedbackSystem)];
    this.sceneFeedbackSystem.play('MagicCircleRipple', GAME_WIDTH / 2, 306, 0x62c78f);
  }

  private updateEnemies(delta: number): void {
    this.enemies.forEach((enemy) => enemy.updateEnemy(delta, this.player));
    const defeated = this.enemies.some((enemy) => enemy.isDead());
    this.enemies = this.enemies.filter((enemy) => enemy.active && !enemy.isDead());

    if ((defeated || this.enemies.length === 0) && !this.tutorialCompleteShown) {
      this.showTutorialComplete();
    }
  }

  private getDamageableEnemies(): EnemyTrialShadow[] {
    return this.enemies.filter((enemy) => enemy.active && !enemy.isDead());
  }

  private showFailureOverlay(): void {
    if (this.failureShown) return;

    this.failureShown = true;
    const overlay = this.add.container(0, 0).setDepth(220);
    const dim = this.add.graphics();
    dim.fillStyle(0x020509, 0.72);
    dim.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    const panel = this.add.graphics();
    panel.fillStyle(0x07101a, 0.88);
    panel.lineStyle(1, 0xe8d28a, 0.46);
    panel.fillRoundedRect(GAME_WIDTH / 2 - 178, GAME_HEIGHT / 2 - 86, 356, 172, 8);
    panel.strokeRoundedRect(GAME_WIDTH / 2 - 178, GAME_HEIGHT / 2 - 86, 356, 172, 8);

    const title = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 42, '试炼失败', {
        fontSize: '34px',
        color: '#e8d28a',
        fontFamily: '"Microsoft YaHei", "Noto Sans SC", Arial, sans-serif',
        stroke: '#15120b',
        strokeThickness: 4,
      })
      .setOrigin(0.5);
    const subtitle = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 8, '凡骨未定，道心未折。', {
        fontSize: '17px',
        color: '#cfd6df',
        fontFamily: '"Microsoft YaHei", "Noto Sans SC", Arial, sans-serif',
      })
      .setOrigin(0.5);
    const restart = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 52, '点击重新开始', {
        fontSize: '18px',
        color: '#e8d28a',
        fontFamily: '"Microsoft YaHei", "Noto Sans SC", Arial, sans-serif',
      })
      .setOrigin(0.5);

    overlay.add([dim, panel, title, subtitle, restart]);
    overlay.setAlpha(0);
    this.failureOverlay = overlay;
    this.tweens.add({
      targets: overlay,
      alpha: 1,
      duration: 220,
      ease: 'Sine.easeOut',
    });

    this.input.once('pointerdown', () => {
      this.scene.restart();
    });
  }

  private showTutorialComplete(): void {
    this.tutorialCompleteShown = true;
    this.tutorialCompleteText = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT - 150, '试炼影妖已灭。\n继续向山门前行。', {
        fontSize: '22px',
        color: '#e8d28a',
        align: 'center',
        fontFamily: '"Microsoft YaHei", "Noto Sans SC", Arial, sans-serif',
        stroke: '#101015',
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setDepth(150)
      .setAlpha(0);

    this.tweens.add({
      targets: this.tutorialCompleteText,
      alpha: 1,
      duration: 280,
      ease: 'Sine.easeOut',
      yoyo: true,
      hold: 2000,
      onComplete: () => this.tutorialCompleteText?.destroy(),
    });
  }

  private drawArena(elementColor: number): void {
    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0x02050a, 0x06101d, 0x0a1b2d, 0x03070d, 1);
    graphics.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    this.drawMountains(graphics);
    this.drawClouds();
    this.drawGate(graphics);
    this.drawStoneSteps(graphics);
    this.drawTrialCircle(graphics, elementColor);
    this.drawSpawnMark(graphics, elementColor);

    this.add
      .text(GAME_WIDTH / 2, 38, '悟道山试炼', {
        fontSize: '32px',
        color: '#e8d28a',
        fontFamily: '"Microsoft YaHei", "Noto Sans SC", Arial, sans-serif',
        stroke: '#15120b',
        strokeThickness: 3,
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH - 132, 34, `环境：${GateTrialEnvironmentName}`, {
        fontSize: '15px',
        color: '#aeb8c4',
        fontFamily: '"Microsoft YaHei", "Noto Sans SC", Arial, sans-serif',
      })
      .setOrigin(0.5);
  }

  private drawMountains(graphics: Phaser.GameObjects.Graphics): void {
    graphics.fillStyle(0x04080d, 0.95);
    graphics.fillTriangle(-60, 310, 140, 130, 340, 310);
    graphics.fillTriangle(200, 320, 480, 90, 760, 320);
    graphics.fillTriangle(590, 310, 820, 150, 1030, 310);

    graphics.fillStyle(0x0d1721, 0.78);
    graphics.fillTriangle(0, 346, 260, 210, 520, 346);
    graphics.fillTriangle(420, 350, 690, 205, 980, 350);
  }

  private drawClouds(): void {
    this.add.ellipse(190, 150, 350, 42, 0xffffff, 0.08);
    this.add.ellipse(744, 156, 420, 48, 0xffffff, 0.07);
    this.add.ellipse(480, 292, 660, 52, 0xffffff, 0.05);
  }

  private drawGate(graphics: Phaser.GameObjects.Graphics): void {
    graphics.fillStyle(0x142231, 1);
    graphics.fillRoundedRect(330, 92, 36, 150, 6);
    graphics.fillRoundedRect(594, 92, 36, 150, 6);
    graphics.fillStyle(0x223344, 1);
    graphics.fillRoundedRect(300, 72, 360, 30, 6);
    graphics.fillRoundedRect(342, 116, 276, 22, 6);
    graphics.lineStyle(2, 0xe8d28a, 0.46);
    graphics.strokeRoundedRect(398, 78, 164, 38, 5);

    this.add
      .text(GAME_WIDTH / 2, 96, '悟道山门', {
        fontSize: '22px',
        color: '#e8d28a',
        fontFamily: '"Microsoft YaHei", "Noto Sans SC", Arial, sans-serif',
      })
      .setOrigin(0.5);
  }

  private drawStoneSteps(graphics: Phaser.GameObjects.Graphics): void {
    graphics.fillStyle(0x263c44, 0.95);
    graphics.fillRoundedRect(250, 244, 460, 218, 12);
    graphics.lineStyle(2, 0x93a5aa, 0.22);
    for (let y = 276; y <= 448; y += 34) {
      graphics.lineBetween(250, y, 710, y);
    }
    for (let x = 290; x <= 680; x += 58) {
      graphics.lineBetween(x, 244, x - 28, 462);
    }
  }

  private drawTrialCircle(graphics: Phaser.GameObjects.Graphics, elementColor: number): void {
    graphics.lineStyle(2, elementColor, 0.3);
    graphics.strokeCircle(GAME_WIDTH / 2, 332, 72);
    graphics.strokeCircle(GAME_WIDTH / 2, 332, 102);
    graphics.lineStyle(1, elementColor, 0.18);
    for (let i = 0; i < 6; i += 1) {
      const angle = (Math.PI * 2 * i) / 6;
      graphics.lineBetween(
        GAME_WIDTH / 2,
        332,
        GAME_WIDTH / 2 + Math.cos(angle) * 102,
        332 + Math.sin(angle) * 102,
      );
    }
  }

  private drawSpawnMark(graphics: Phaser.GameObjects.Graphics, elementColor: number): void {
    graphics.lineStyle(2, elementColor, 0.18);
    graphics.strokeEllipse(GAME_WIDTH / 2, 424, 72, 20);
    graphics.fillStyle(elementColor, 0.07);
    graphics.fillEllipse(GAME_WIDTH / 2, 424, 62, 14);
  }
}
