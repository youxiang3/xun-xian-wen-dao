const skillLabels = [
  ['左键', '轻击', false],
  ['右键', '重击', false],
  ['Q', '金芒刺', false],
  ['E', '辅助法术-未觉醒', true],
  ['F', '命格特通-未觉醒', true],
  ['1', '法宝-未获得', true],
  ['R', '回血 3/3', false],
  ['Space', '闪避', false],
];

export class UI {
  constructor(gameLayer) {
    this.root = document.createElement('div');
    this.root.className = 'ui-layer';
    gameLayer.append(this.root);
    this.build();
  }

  build() {
    this.root.innerHTML = `
      <section class="status-panel hud-panel">
        <div class="hud-title">悟道山试炼</div>
        ${this.statRow('hp', '气血', '100 / 100')}
        ${this.statRow('mp', '灵力', '60 / 60')}
        ${this.statRow('stamina', '体力', '100 / 100')}
        <div class="heal-line">回血 <span data-heals>3 / 3</span></div>
      </section>

      <section class="boss-panel">
        <div class="trial-title">悟道山试炼</div>
        <div class="boss-name">悟道山试炼守卫</div>
        <div class="boss-bar-wrap">
          <div class="boss-bar" data-boss-bar></div>
          <span data-boss-text>160 / 160</span>
        </div>
      </section>

      <section class="env-panel hud-panel">
        <span>环境：悟道山·土行</span>
        <button class="gear" aria-label="设置">⚙</button>
      </section>

      <section class="skill-panel">
        ${skillLabels.map((skill, index) => this.skillSlot(skill, index)).join('')}
      </section>

      <section class="result-panel" data-result hidden>
        <div class="result-title" data-result-title></div>
      </section>
    `;
  }

  update(player, boss) {
    this.setStat('hp', player.hp, player.maxHp);
    this.setStat('mp', player.mp, player.maxMp);
    this.setStat('stamina', player.stamina, player.maxStamina);
    this.root.querySelector('[data-heals]').textContent = `${player.heals} / ${player.maxHeals}`;

    const bossRatio = boss.hp / boss.maxHp;
    this.root.querySelector('[data-boss-bar]').style.width = `${Math.max(0, bossRatio * 100)}%`;
    this.root.querySelector('[data-boss-text]').textContent = `${Math.ceil(boss.hp)} / ${boss.maxHp}`;
  }

  showResult(message) {
    const panel = this.root.querySelector('[data-result]');
    panel.hidden = false;
    panel.querySelector('[data-result-title]').textContent = message;
  }

  statRow(key, label, value) {
    return `
      <div class="stat-row">
        <div class="stat-label"><span>${label}</span><span data-${key}-text>${value}</span></div>
        <div class="stat-track"><div class="stat-fill ${key}" data-${key}-bar></div></div>
      </div>
    `;
  }

  setStat(key, value, max) {
    this.root.querySelector(`[data-${key}-text]`).textContent = `${Math.ceil(value)} / ${max}`;
    this.root.querySelector(`[data-${key}-bar]`).style.width = `${Math.max(0, (value / max) * 100)}%`;
  }

  skillSlot([key, name, disabled], index) {
    const col = index % 4;
    const row = Math.floor(index / 4);
    return `
      <div class="skill-slot ${disabled ? 'disabled' : ''}">
        <div class="skill-icon" style="--icon-pos-x:${col * 33.3333}%; --icon-pos-y:${row * 100}%;"></div>
        <div class="skill-copy">
          <strong>${key}</strong>
          <span>${name}</span>
        </div>
      </div>
    `;
  }
}
