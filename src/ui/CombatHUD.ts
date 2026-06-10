import Phaser from 'phaser';
import { combatConfig } from '../data/CombatConfig';
import type { PlayerStats } from '../entities/Player';

export class CombatHUD {
  private root: Phaser.GameObjects.Container;
  private hpText: Phaser.GameObjects.Text;
  private mpText: Phaser.GameObjects.Text;
  private staminaText: Phaser.GameObjects.Text;
  private healText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, stats: PlayerStats) {
    this.root = scene.add.container(18, 18).setDepth(100);
    const bg = scene.add.graphics();
    bg.fillStyle(0x06101a, 0.78);
    bg.lineStyle(1, 0xe8d28a, 0.42);
    bg.fillRoundedRect(0, 0, 230, 126, 6);
    bg.strokeRoundedRect(0, 0, 230, 126, 6);

    const title = scene.add.text(14, 10, '悟道山试炼', this.textStyle(16, '#e8d28a'));
    this.hpText = scene.add.text(14, 38, '', this.textStyle());
    this.mpText = scene.add.text(14, 62, '', this.textStyle());
    this.staminaText = scene.add.text(14, 86, '', this.textStyle());
    this.healText = scene.add.text(14, 108, '', this.textStyle());

    this.root.add([bg, title, this.hpText, this.mpText, this.staminaText, this.healText]);
    this.update(stats);
  }

  update(stats: PlayerStats): void {
    this.hpText.setText(`气血：${Math.round(stats.hp)} / ${stats.maxHp}`);
    this.mpText.setText(`灵力：${Math.round(stats.mp)} / ${stats.maxMp}`);
    this.staminaText.setText(`体力：${Math.round(stats.stamina)} / ${stats.maxStamina}`);
    this.healText.setText(`回血：${stats.healCount} / ${combatConfig.player.maxHealCount}`);
  }

  private textStyle(fontSize = 14, color = '#d6dde6'): Phaser.Types.GameObjects.Text.TextStyle {
    return {
      fontSize: `${fontSize}px`,
      color,
      fontFamily: '"Microsoft YaHei", "Noto Sans SC", Arial, sans-serif',
    };
  }
}
