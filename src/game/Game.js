import { Boss } from './Boss.js';
import { Effects } from './Effects.js';
import { Input } from './Input.js';
import { Player } from './Player.js';
import { UI } from './UI.js';
import bossUrl from '../../assets/images/boss.png';
import playerUrl from '../../assets/images/player.png';

const WIDTH = 960;
const HEIGHT = 540;

export class Game {
  constructor(root) {
    this.root = root;
    this.player = new Player();
    this.boss = new Boss();
    this.lastTime = 0;
    this.ended = false;
  }

  start() {
    this.root.innerHTML = `
      <main class="game-shell">
        <div class="game-layer">
          <div class="boss-unit">
            <img class="boss-sprite" alt="悟道山试炼守卫" src="${bossUrl}" />
          </div>
          <div class="player-unit">
            <img class="player-sprite" alt="试炼者" src="${playerUrl}" />
          </div>
          <canvas class="effect-canvas" width="${WIDTH}" height="${HEIGHT}"></canvas>
        </div>
      </main>
    `;

    this.shell = this.root.querySelector('.game-shell');
    this.layer = this.root.querySelector('.game-layer');
    this.canvas = this.root.querySelector('.effect-canvas');
    this.playerUnit = this.root.querySelector('.player-unit');
    this.bossUnit = this.root.querySelector('.boss-unit');
    this.playerSprite = this.root.querySelector('.player-sprite');
    this.bossSprite = this.root.querySelector('.boss-sprite');
    this.input = new Input(this.layer);
    this.effects = new Effects(this.canvas);
    this.ui = new UI(this.layer);
    this.syncSprites(0);
    this.ui.update(this.player, this.boss);

    requestAnimationFrame((time) => this.loop(time));
  }

  loop(time) {
    const delta = Math.min(0.033, (time - this.lastTime) / 1000 || 0);
    this.lastTime = time;

    if (!this.ended) {
      this.update(delta, time);
    }

    this.effects.draw(this.player, this.boss);
    this.syncSprites(time);
    this.ui.update(this.player, this.boss);
    requestAnimationFrame((nextTime) => this.loop(nextTime));
  }

  update(delta, now) {
    this.player.update(delta, this.input, now);
    this.handleActions(now);
    this.boss.update(delta, this.player, now);
    this.effects.update(delta, this.boss, now, (_projectile, hitTime) => {
      this.damageBoss(14, hitTime);
    });
    this.checkResult();
  }

  handleActions(now) {
    if (this.input.consume('light')) {
      this.playPlayerAction('light-attack');
      this.tryMeleeAttack(8, 86, now, false);
    }

    if (this.input.consume('heavy')) {
      if (now >= this.player.cooldowns.heavy) {
        this.player.cooldowns.heavy = now + 1200;
        this.playPlayerAction('heavy-attack');
        this.tryMeleeAttack(18, 104, now, true);
      }
    }

    if (this.input.consume('q')) {
      if (this.player.mp >= 15 && now >= this.player.cooldowns.q) {
        this.player.mp -= 15;
        this.player.cooldowns.q = now + 520;
        this.playPlayerAction('cast-attack');
        this.effects.spawnProjectile(
          this.player.x + Math.cos(this.player.facing) * 30,
          this.player.y + Math.sin(this.player.facing) * 30,
          this.player.facing,
        );
      }
    }

    if (this.input.consume('dodge')) {
      if (this.player.tryDodge(this.input, now)) {
        this.playPlayerAction('dodge-action');
      }
    }

    if (this.input.consume('heal')) {
      if (this.player.tryHeal(now)) {
        this.playPlayerAction('heal-action');
      }
    }
  }

  tryMeleeAttack(damage, range, now, heavy) {
    this.effects.spawnSlash(this.player.x, this.player.y - 8, this.player.facing, heavy);
    if (this.boss.isDead()) return;

    const dx = this.boss.x - this.player.x;
    const dy = this.boss.y - this.player.y;
    const distance = Math.hypot(dx, dy);
    const angleToBoss = Math.atan2(dy, dx);
    const angleDelta = Math.abs(wrapAngle(angleToBoss - this.player.facing));
    if (distance <= range + this.boss.radius && angleDelta < 0.92) {
      this.damageBoss(damage, now);
    }
  }

  damageBoss(damage, now) {
    if (!this.boss.takeDamage(damage, now)) return;
    this.effects.spawnHit(this.boss.x, this.boss.y - 28);
    this.layer.classList.add('impact');
    this.bossUnit.classList.remove('boss-hurt-pop');
    void this.bossUnit.offsetWidth;
    this.bossUnit.classList.add('boss-hurt-pop');
    window.setTimeout(() => this.layer.classList.remove('impact'), 110);
  }

  checkResult() {
    if (this.ended) return;
    if (this.boss.isDead()) {
      this.ended = true;
      this.ui.showResult('试炼通过，山门已开。');
    }
    if (this.player.isDead()) {
      this.ended = true;
      this.ui.showResult('试炼失败，道心未稳。');
    }
  }

  syncSprites(now) {
    this.playerUnit.style.left = `${(this.player.x / WIDTH) * 100}%`;
    this.playerUnit.style.top = `${(this.player.y / HEIGHT) * 100}%`;
    this.playerUnit.style.setProperty('--face-x', `${Math.cos(this.player.facing) * 8}px`);
    this.playerUnit.style.setProperty('--face-y', `${Math.sin(this.player.facing) * 5}px`);
    this.playerUnit.classList.toggle('invulnerable', now < this.player.invulnerableUntil);

    this.bossUnit.style.left = `${(this.boss.x / WIDTH) * 100}%`;
    this.bossUnit.style.top = `${(this.boss.y / HEIGHT) * 100}%`;
    this.bossUnit.classList.toggle('boss-hit', now < this.boss.flashUntil);
    this.bossUnit.classList.toggle('dead', this.boss.isDead());
  }

  playPlayerAction(className) {
    this.playerUnit.classList.remove('light-attack', 'heavy-attack', 'cast-attack', 'dodge-action', 'heal-action');
    void this.playerUnit.offsetWidth;
    this.playerUnit.classList.add(className);
    window.setTimeout(() => this.playerUnit.classList.remove(className), 260);
  }
}

function wrapAngle(angle) {
  let wrapped = angle;
  while (wrapped <= -Math.PI) wrapped += Math.PI * 2;
  while (wrapped > Math.PI) wrapped -= Math.PI * 2;
  return wrapped;
}
