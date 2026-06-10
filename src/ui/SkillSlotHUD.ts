import Phaser from 'phaser';
import type { PlayerSkillSlotState } from '../entities/Player';

type SlotKey = 'light' | 'heavy' | 'q' | 'e' | 'f' | 'one' | 'heal' | 'dodge';

interface SkillSlot {
  key: SlotKey;
  baseLabel: string;
  enabled: boolean;
}

interface SlotView {
  baseLabel: string;
  enabled: boolean;
  text: Phaser.GameObjects.Text;
  bg: Phaser.GameObjects.Graphics;
}

export class SkillSlotHUD {
  private root: Phaser.GameObjects.Container;
  private slots = new Map<SlotKey, SlotView>();

  constructor(scene: Phaser.Scene, skillName: string, private readonly elementColor: number) {
    this.root = scene.add.container(174, 456).setDepth(100);
    const slotDefs: Array<{ key: SlotKey; label: string; enabled: boolean }> = [
      { key: 'light', label: '左键 轻击', enabled: true },
      { key: 'heavy', label: '右键 重击', enabled: true },
      { key: 'q', label: `Q ${skillName}`, enabled: true },
      { key: 'e', label: 'E 辅助法术·未觉醒', enabled: false },
      { key: 'f', label: 'F 命格神通·未觉醒', enabled: false },
      { key: 'one', label: '1 法宝·未获得', enabled: false },
      { key: 'heal', label: 'R 回血 3/3', enabled: true },
      { key: 'dodge', label: 'Space 闪避', enabled: true },
    ];
    const slots: SkillSlot[] = slotDefs.map((slot) => ({ key: slot.key, baseLabel: slot.label, enabled: slot.enabled }));

    slots.forEach((slot, index) => {
      const x = (index % 4) * 154;
      const y = Math.floor(index / 4) * 34;
      this.drawSlot(scene, x, y, slot);
    });
  }

  update(state: PlayerSkillSlotState): void {
    this.updateSlot('light', this.withStatus('左键 轻击', state.lightCooldownMs, !state.canLightAttack));
    this.updateSlot('heavy', this.withStatus('右键 重击', state.heavyCooldownMs, !state.canHeavyAttack));
    this.updateSlot('q', this.withStatus(this.slots.get('q')?.baseLabel ?? 'Q 五行术', state.qCooldownMs, !state.canCastQ));
    this.updateSlot('dodge', this.withStatus('Space 闪避', state.dodgeCooldownMs, !state.canDodge));
    this.updateSlot(
      'heal',
      this.withStatus(`R 回血 ${state.healCount}/${state.maxHealCount}`, state.healCooldownMs, !state.canHeal),
    );
  }

  private drawSlot(scene: Phaser.Scene, x: number, y: number, slot: SkillSlot): void {
    const bg = scene.add.graphics();
    const text = scene.add
      .text(x + 71, y + 14, slot.baseLabel, {
        fontSize: '12px',
        color: slot.enabled ? '#e9dfb8' : '#8c96a3',
        fontFamily: '"Microsoft YaHei", "Noto Sans SC", Arial, sans-serif',
      })
      .setOrigin(0.5);

    this.root.add([bg, text]);
    this.slots.set(slot.key, {
      baseLabel: slot.baseLabel,
      enabled: slot.enabled,
      text,
      bg,
    });
    this.paintSlot(slot.key, slot.enabled, false);
  }

  private updateSlot(key: SlotKey, status: { label: string; dimmed: boolean }): void {
    const slot = this.slots.get(key);
    if (!slot) return;

    slot.text.setText(status.label);
    this.paintSlot(key, slot.enabled, status.dimmed);
  }

  private paintSlot(key: SlotKey, enabled: boolean, dimmed: boolean): void {
    const slot = this.slots.get(key);
    if (!slot) return;

    const borderColor = enabled ? this.elementColor : 0x6c7480;
    slot.bg.clear();
    slot.bg.fillStyle(0x06101a, dimmed ? 0.56 : 0.78);
    slot.bg.lineStyle(1, borderColor, enabled && !dimmed ? 0.72 : 0.32);
    const bounds = this.getSlotBounds(key);
    slot.bg.fillRoundedRect(bounds.x, bounds.y, 142, 28, 5);
    slot.bg.strokeRoundedRect(bounds.x, bounds.y, 142, 28, 5);
    slot.text.setColor(enabled ? (dimmed ? '#8f8f86' : '#e9dfb8') : '#8c96a3');
  }

  private withStatus(baseLabel: string, cooldownMs: number, resourceDimmed: boolean): { label: string; dimmed: boolean } {
    if (cooldownMs > 0) {
      return {
        label: `${baseLabel} 冷却${Math.ceil(cooldownMs / 1000)}s`,
        dimmed: true,
      };
    }

    return {
      label: baseLabel,
      dimmed: resourceDimmed,
    };
  }

  private getSlotBounds(key: SlotKey): { x: number; y: number } {
    const order: SlotKey[] = ['light', 'heavy', 'q', 'e', 'f', 'one', 'heal', 'dodge'];
    const index = order.indexOf(key);
    return {
      x: (index % 4) * 154,
      y: Math.floor(index / 4) * 34,
    };
  }
}
