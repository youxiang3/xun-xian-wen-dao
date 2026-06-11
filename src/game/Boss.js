export class Boss {
  constructor() {
    this.x = 480;
    this.y = 205;
    this.radius = 54;
    this.hp = 160;
    this.maxHp = 160;
    this.speed = 34;
    this.flashUntil = 0;
    this.attackInterval = 3000;
    this.nextAttackAt = 1400;
    this.warning = null;
  }

  update(delta, player, now) {
    if (this.isDead() || player.isDead()) return;

    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const distance = Math.hypot(dx, dy);
    if (distance > 126) {
      this.x += (dx / distance) * this.speed * delta;
      this.y += (dy / distance) * this.speed * delta;
      this.clamp();
    }

    if (!this.warning && now >= this.nextAttackAt) {
      this.warning = {
        x: player.x,
        y: player.y,
        radius: 68,
        startAt: now,
        resolveAt: now + 900,
        resolved: false,
      };
      this.nextAttackAt = now + this.attackInterval;
    }

    if (this.warning && now >= this.warning.resolveAt && !this.warning.resolved) {
      this.warning.resolved = true;
      const hitDistance = Math.hypot(player.x - this.warning.x, player.y - this.warning.y);
      if (hitDistance <= this.warning.radius) {
        player.takeDamage(15, now);
      }
    }

    if (this.warning && now > this.warning.resolveAt + 220) {
      this.warning = null;
    }
  }

  takeDamage(amount, now) {
    if (this.isDead()) return false;
    this.hp = Math.max(0, this.hp - amount);
    this.flashUntil = now + 110;
    return true;
  }

  isDead() {
    return this.hp <= 0;
  }

  clamp() {
    this.x = Math.max(260, Math.min(700, this.x));
    this.y = Math.max(170, Math.min(360, this.y));
  }
}
