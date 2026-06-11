export class Player {
  constructor() {
    this.x = 480;
    this.y = 430;
    this.radius = 26;
    this.hp = 100;
    this.maxHp = 100;
    this.mp = 60;
    this.maxMp = 60;
    this.stamina = 100;
    this.maxStamina = 100;
    this.heals = 3;
    this.maxHeals = 3;
    this.speed = 188;
    this.facing = -Math.PI / 2;
    this.invulnerableUntil = 0;
    this.dodgeUntil = 0;
    this.dodgeVector = { x: 0, y: -1 };
    this.cooldowns = {
      light: 0,
      heavy: 0,
      q: 0,
      dodge: 0,
      heal: 0,
    };
  }

  update(delta, input, now) {
    this.facing = Math.atan2(input.pointer.y - this.y, input.pointer.x - this.x);
    this.stamina = Math.min(this.maxStamina, this.stamina + delta * 12);

    if (now < this.dodgeUntil) {
      this.x += this.dodgeVector.x * 440 * delta;
      this.y += this.dodgeVector.y * 440 * delta;
      this.clamp();
      return;
    }

    const movement = input.getMovement();
    this.x += movement.x * this.speed * delta;
    this.y += movement.y * this.speed * delta;
    this.clamp();
  }

  tryDodge(input, now) {
    if (this.stamina < 20 || now < this.cooldowns.dodge) return false;
    const movement = input.getMovement();
    const length = Math.hypot(movement.x, movement.y);
    this.dodgeVector = length > 0 ? movement : { x: Math.cos(this.facing), y: Math.sin(this.facing) };
    this.stamina -= 20;
    this.invulnerableUntil = now + 360;
    this.dodgeUntil = now + 230;
    this.cooldowns.dodge = now + 620;
    return true;
  }

  tryHeal(now) {
    if (this.heals <= 0 || this.hp >= this.maxHp || now < this.cooldowns.heal) return false;
    this.hp = Math.min(this.maxHp, this.hp + 30);
    this.heals -= 1;
    this.cooldowns.heal = now + 700;
    return true;
  }

  takeDamage(amount, now) {
    if (now < this.invulnerableUntil || this.isDead()) return false;
    this.hp = Math.max(0, this.hp - amount);
    return true;
  }

  isDead() {
    return this.hp <= 0;
  }

  clamp() {
    this.x = Math.max(118, Math.min(842, this.x));
    this.y = Math.max(235, Math.min(492, this.y));
  }
}
