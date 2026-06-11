import Phaser from 'phaser';
import { AudioManager } from '../audio/AudioManager';
import type { Damageable } from '../combat/CombatTypes';
import { HitFeedbackSystem } from '../combat/HitFeedbackSystem';
import { SceneFeedbackSystem } from '../combat/SceneFeedbackSystem';
import { defaultElementColor, elementColors } from '../data/ElementConfig';
import { BossWudaoGateGuardian } from '../entities/BossWudaoGateGuardian';
import { EnemyTrialShadow } from '../entities/EnemyTrialShadow';
import { Player } from '../entities/Player';
import { GAME_HEIGHT, GAME_WIDTH } from '../gameConfig';
import { gameSession, getInitialAttackSkill } from '../session/GameSession';
import { BossHUD } from '../ui/BossHUD';
import { CombatHUD } from '../ui/CombatHUD';
import { SkillSlotHUD } from '../ui/SkillSlotHUD';
import { SceneDepth, actorDepth } from '../utils/DepthUtils';

export const GateTrialEnvironment = 'Earth';
const GateTrialEnvironmentName = '悟道山·土行';

export class GateTrialScene extends Phaser.Scene {
  private player!: Player;
  private combatHud!: CombatHUD;
  private skillHud!: SkillSlotHUD;
  private bossHud!: BossHUD;
  private audioManager!: AudioManager;
  private hitFeedbackSystem!: HitFeedbackSystem;
  private sceneFeedbackSystem!: SceneFeedbackSystem;
  private enemies: EnemyTrialShadow[] = [];
  private boss?: BossWudaoGateGuardian;
  private hintText?: Phaser.GameObjects.Text;
  private failureOverlay?: Phaser.GameObjects.Container;
  private bossDefeatedText?: Phaser.GameObjects.Container;
  private failureShown = false;
  private bossActivated = false;
  private bossDefeatedShown = false;

  constructor() {
    super('GateTrialScene');
  }

  create(): void {
    gameSession.stageId = 'wudao_gate_trial';
    this.input.mouse?.disableContextMenu();
    this.failureShown = false;
    this.bossActivated = false;
    this.bossDefeatedShown = false;
    this.failureOverlay = undefined;
    this.bossDefeatedText = undefined;

    const elementColor = this.getElementColor();
    const initialAttackSkill = getInitialAttackSkill();
    this.audioManager = new AudioManager();
    this.hitFeedbackSystem = new HitFeedbackSystem(this, this.audioManager);
    this.sceneFeedbackSystem = new SceneFeedbackSystem(this);
    this.drawArena(elementColor);

    this.player = new Player(this, GAME_WIDTH / 2, 430, elementColor, initialAttackSkill, (message) => {
      this.showHint(message);
    }, this.audioManager, () => this.getDamageableEnemies());
    this.combatHud = new CombatHUD(this, this.player.stats);
    this.skillHud = new SkillSlotHUD(this, initialAttackSkill.name, elementColor);
    this.bossHud = new BossHUD(this);
    this.createEnemies();
    this.createBoss();
    this.updateActorDepths();
  }

  update(_time: number, delta: number): void {
    this.player.update(delta, this.input.activePointer);

    if (this.player.isDead()) {
      this.showFailureOverlay();
    } else {
      this.updateEnemies(delta);
      this.updateBoss(delta);
      if (this.player.isDead()) {
        this.showFailureOverlay();
      }
    }

    this.updateActorDepths();
    this.combatHud.update(this.player.stats);
    this.skillHud.update(this.player.getSkillSlotState());
    if (this.boss?.isActivated()) {
      this.bossHud.update(this.boss.hp, this.boss.maxHp);
    }
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
        .setDepth(SceneDepth.Hud + 20);
    }

    this.tweens.killTweensOf(this.hintText);
    this.hintText.setText(message).setAlpha(1);
    this.tweens.add({
      targets: this.hintText,
      alpha: 0,
      delay: 900,
      duration: 520,
      ease: 'Sine.easeOut',
    });
  }

  private createEnemies(): void {
    this.enemies = [new EnemyTrialShadow(this, GAME_WIDTH / 2 + 18, 300, this.hitFeedbackSystem)];
    this.sceneFeedbackSystem.play('MagicCircleRipple', GAME_WIDTH / 2 + 18, 300, 0x62c78f);
  }

  private createBoss(): void {
    this.boss = new BossWudaoGateGuardian(
      this,
      GAME_WIDTH / 2,
      196,
      this.hitFeedbackSystem,
      this.sceneFeedbackSystem,
      () => this.showBossDefeated(),
    );
  }

  private updateEnemies(delta: number): void {
    this.enemies.forEach((enemy) => enemy.updateEnemy(delta, this.player));
    const defeated = this.enemies.some((enemy) => enemy.isDead());
    this.enemies = this.enemies.filter((enemy) => enemy.active && !enemy.isDead());

    if ((defeated || this.enemies.length === 0) && !this.bossActivated) {
      this.activateBoss();
    }
  }

  private updateBoss(delta: number): void {
    if (!this.bossActivated || !this.boss) return;
    this.boss.updateBoss(delta, this.player);
  }

  private activateBoss(): void {
    if (!this.boss || this.bossActivated) return;

    this.bossActivated = true;
    this.showHint('试炼影妖已灭。山门守卫现身。');
    this.boss.activate();
    this.bossHud.update(this.boss.hp, this.boss.maxHp);
    this.bossHud.show();
  }

  private getDamageableEnemies(): Damageable[] {
    const targets: Damageable[] = this.enemies.filter((enemy) => enemy.active && !enemy.isDead());
    if (this.boss?.isActivated() && !this.boss.isDead()) {
      targets.push(this.boss);
    }
    return targets;
  }

  private updateActorDepths(): void {
    this.player.setDepth(actorDepth(this.player.y));
    this.enemies.forEach((enemy) => enemy.setDepth(actorDepth(enemy.y)));
    if (this.boss?.isActivated()) {
      this.boss.setDepth(actorDepth(this.boss.y));
    }
  }

  private showFailureOverlay(): void {
    if (this.failureShown || this.bossDefeatedShown) return;

    this.failureShown = true;
    const overlay = this.add.container(0, 0).setDepth(SceneDepth.Overlay + 20);
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

  private showBossDefeated(): void {
    if (this.bossDefeatedShown) return;

    this.bossDefeatedShown = true;
    this.bossHud.fadeAfterDeath();
    const root = this.add.container(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 6).setDepth(SceneDepth.Overlay + 10).setAlpha(0);
    const title = this.add
      .text(0, -28, '山门试炼已破', {
        fontSize: '34px',
        color: '#e8d28a',
        fontFamily: '"Microsoft YaHei", "Noto Sans SC", Arial, sans-serif',
        stroke: '#15120b',
        strokeThickness: 4,
      })
      .setOrigin(0.5);
    const subtitle = this.add
      .text(0, 24, '凡骨踏过此门，仙途自此初开。', {
        fontSize: '18px',
        color: '#d6dde6',
        fontFamily: '"Microsoft YaHei", "Noto Sans SC", Arial, sans-serif',
        stroke: '#101015',
        strokeThickness: 3,
      })
      .setOrigin(0.5);

    root.add([title, subtitle]);
    this.bossDefeatedText = root;
    this.tweens.add({
      targets: root,
      alpha: 1,
      y: GAME_HEIGHT / 2 - 10,
      delay: 360,
      duration: 520,
      ease: 'Sine.easeOut',
    });
  }

  private drawArena(elementColor: number): void {
    const background = this.add.graphics().setDepth(SceneDepth.Background);
    background.fillGradientStyle(0x02050a, 0x06101d, 0x0a1b2d, 0x03070d, 1);
    background.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    const ground = this.add.graphics().setDepth(SceneDepth.Ground);
    const effects = this.add.graphics().setDepth(SceneDepth.Effects);

    this.drawMountains(background);
    this.drawClouds();
    this.drawGate(background);
    this.drawStoneSteps(ground);
    this.drawTrialPlatform(ground);
    this.drawTrialCircle(effects, elementColor);
    this.drawSpawnMark(effects, elementColor);

    this.add
      .text(GAME_WIDTH / 2, 38, '悟道山试炼', {
        fontSize: '32px',
        color: '#e8d28a',
        fontFamily: '"Microsoft YaHei", "Noto Sans SC", Arial, sans-serif',
        stroke: '#15120b',
        strokeThickness: 3,
      })
      .setOrigin(0.5)
      .setDepth(SceneDepth.Hud);

    this.add
      .text(GAME_WIDTH - 132, 34, `环境：${GateTrialEnvironmentName}`, {
        fontSize: '15px',
        color: '#aeb8c4',
        fontFamily: '"Microsoft YaHei", "Noto Sans SC", Arial, sans-serif',
      })
      .setOrigin(0.5)
      .setDepth(SceneDepth.Hud);
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
    this.add.ellipse(190, 150, 350, 42, 0xffffff, 0.08).setDepth(SceneDepth.Background);
    this.add.ellipse(744, 156, 420, 48, 0xffffff, 0.07).setDepth(SceneDepth.Background);
    this.add.ellipse(480, 250, 660, 52, 0xffffff, 0.05).setDepth(SceneDepth.Background);
  }

  private drawGate(graphics: Phaser.GameObjects.Graphics): void {
    graphics.fillStyle(0x142231, 1);
    graphics.fillRoundedRect(332, 82, 34, 124, 6);
    graphics.fillRoundedRect(594, 82, 34, 124, 6);
    graphics.fillStyle(0x223344, 1);
    graphics.fillRoundedRect(302, 66, 356, 28, 6);
    graphics.fillRoundedRect(342, 108, 276, 20, 6);
    graphics.lineStyle(2, 0xe8d28a, 0.46);
    graphics.strokeRoundedRect(398, 72, 164, 36, 5);

    this.add
      .text(GAME_WIDTH / 2, 90, '悟道山门', {
        fontSize: '22px',
        color: '#e8d28a',
        fontFamily: '"Microsoft YaHei", "Noto Sans SC", Arial, sans-serif',
      })
      .setOrigin(0.5)
      .setDepth(SceneDepth.Background);
  }

  private drawStoneSteps(graphics: Phaser.GameObjects.Graphics): void {
    graphics.fillStyle(0x263c44, 0.82);
    graphics.fillTriangle(394, 190, 566, 190, 742, 462);
    graphics.fillTriangle(394, 190, 742, 462, 218, 462);
    graphics.lineStyle(2, 0x93a5aa, 0.22);
    for (let y = 220; y <= 444; y += 32) {
      const t = (y - 190) / 272;
      const halfWidth = 90 + t * 170;
      graphics.lineBetween(GAME_WIDTH / 2 - halfWidth, y, GAME_WIDTH / 2 + halfWidth, y);
    }
    for (let i = -2; i <= 2; i += 1) {
      graphics.lineBetween(GAME_WIDTH / 2 + i * 32, 196, GAME_WIDTH / 2 + i * 72, 462);
    }
  }

  private drawTrialPlatform(graphics: Phaser.GameObjects.Graphics): void {
    graphics.fillStyle(0x101820, 0.78);
    graphics.fillEllipse(GAME_WIDTH / 2, 374, 470, 150);
    graphics.lineStyle(2, 0x9eb0b8, 0.22);
    graphics.strokeEllipse(GAME_WIDTH / 2, 374, 500, 162);
    graphics.lineStyle(1, 0xe8d28a, 0.18);
    graphics.lineBetween(254, 374, 706, 374);
    graphics.lineBetween(320, 424, 640, 324);
  }

  private drawTrialCircle(graphics: Phaser.GameObjects.Graphics, elementColor: number): void {
    graphics.lineStyle(2, elementColor, 0.3);
    graphics.strokeEllipse(GAME_WIDTH / 2, 338, 164, 54);
    graphics.strokeEllipse(GAME_WIDTH / 2, 338, 228, 78);
    graphics.lineStyle(1, elementColor, 0.18);
    for (let i = 0; i < 6; i += 1) {
      const angle = (Math.PI * 2 * i) / 6;
      graphics.lineBetween(
        GAME_WIDTH / 2,
        338,
        GAME_WIDTH / 2 + Math.cos(angle) * 114,
        338 + Math.sin(angle) * 39,
      );
    }
  }

  private drawSpawnMark(graphics: Phaser.GameObjects.Graphics, elementColor: number): void {
    graphics.lineStyle(2, elementColor, 0.18);
    graphics.strokeEllipse(GAME_WIDTH / 2, 430, 84, 22);
    graphics.fillStyle(elementColor, 0.07);
    graphics.fillEllipse(GAME_WIDTH / 2, 430, 72, 16);
  }
}
