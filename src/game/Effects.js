export class Effects {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.slashes = [];
    this.projectiles = [];
    this.magicRotation = 0;
  }

  spawnHit(x, y) {
    for (let i = 0; i < 16; i += 1) {
      const angle = (Math.PI * 2 * i) / 16;
      const speed = 70 + Math.random() * 90;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed * 0.62,
        life: 0.42,
        maxLife: 0.42,
      });
    }
  }

  spawnSlash(x, y, angle, heavy = false) {
    this.slashes.push({ x, y, angle, life: heavy ? 0.2 : 0.15, maxLife: heavy ? 0.2 : 0.15, heavy });
  }

  spawnProjectile(x, y, angle) {
    this.projectiles.push({
      x,
      y,
      angle,
      vx: Math.cos(angle) * 520,
      vy: Math.sin(angle) * 520,
      life: 0.9,
      hit: false,
    });
  }

  update(delta, boss, now, onProjectileHit) {
    this.magicRotation += delta * 0.34;

    this.particles.forEach((particle) => {
      particle.x += particle.vx * delta;
      particle.y += particle.vy * delta;
      particle.life -= delta;
    });
    this.particles = this.particles.filter((particle) => particle.life > 0);

    this.slashes.forEach((slash) => {
      slash.life -= delta;
    });
    this.slashes = this.slashes.filter((slash) => slash.life > 0);

    this.projectiles.forEach((projectile) => {
      projectile.x += projectile.vx * delta;
      projectile.y += projectile.vy * delta;
      projectile.life -= delta;
      if (!projectile.hit && !boss.isDead() && Math.hypot(projectile.x - boss.x, projectile.y - boss.y) < boss.radius + 12) {
        projectile.hit = true;
        onProjectileHit(projectile, now);
      }
    });
    this.projectiles = this.projectiles.filter((projectile) => projectile.life > 0 && !projectile.hit);
  }

  draw(player, boss) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawMagicCircle(ctx);
    this.drawPlayerRing(ctx, player);
    this.drawBossWarning(ctx, boss);
    this.drawSlashes(ctx);
    this.drawProjectiles(ctx);
    this.drawParticles(ctx);
  }

  drawMagicCircle(ctx) {
    ctx.save();
    ctx.translate(480, 326);
    ctx.scale(1.45, 0.52);
    ctx.rotate(this.magicRotation);
    ctx.shadowColor = 'rgba(232, 210, 138, 0.9)';
    ctx.shadowBlur = 18;

    [44, 72, 102, 132].forEach((radius, index) => {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(232, 210, 138, ${0.32 - index * 0.04})`;
      ctx.lineWidth = index === 0 ? 3 : 2;
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.stroke();
    });

    for (let i = 0; i < 12; i += 1) {
      const angle = (Math.PI * 2 * i) / 12;
      const inner = i % 2 === 0 ? 48 : 72;
      const outer = 128;
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner);
      ctx.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer);
      ctx.strokeStyle = 'rgba(232, 210, 138, 0.2)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.fillStyle = i % 3 === 0 ? 'rgba(255, 235, 167, 0.75)' : 'rgba(232, 210, 138, 0.42)';
      ctx.arc(Math.cos(angle) * 116, Math.sin(angle) * 116, i % 3 === 0 ? 4 : 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.rotate(-this.magicRotation * 1.8);
    for (let i = 0; i < 8; i += 1) {
      const angle = (Math.PI * 2 * i) / 8;
      ctx.save();
      ctx.translate(Math.cos(angle) * 92, Math.sin(angle) * 92);
      ctx.rotate(angle);
      ctx.fillStyle = 'rgba(232, 210, 138, 0.45)';
      ctx.fillRect(-7, -2, 14, 4);
      ctx.restore();
    }

    ctx.restore();
  }

  drawPlayerRing(ctx, player) {
    ctx.save();
    ctx.translate(player.x, player.y + 20);
    ctx.scale(1, 0.36);
    ctx.shadowColor = 'rgba(232, 210, 138, 0.85)';
    ctx.shadowBlur = 11;
    ctx.strokeStyle = 'rgba(232, 210, 138, 0.82)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, 34, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255, 242, 180, 0.28)';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(0, 0, 44, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  drawBossWarning(ctx, boss) {
    if (!boss.warning) return;

    const warning = boss.warning;
    const total = 900;
    const elapsed = Math.min(total, performance.now() - warning.startAt);
    const ratio = elapsed / total;
    const isImpact = warning.resolved;

    ctx.save();
    ctx.translate(warning.x, warning.y + 20);
    ctx.scale(1, 0.5);
    ctx.fillStyle = isImpact ? 'rgba(255, 35, 22, 0.34)' : `rgba(180, 24, 24, ${0.12 + ratio * 0.16})`;
    ctx.strokeStyle = isImpact ? 'rgba(255, 70, 48, 0.95)' : `rgba(255, 78, 58, ${0.42 + ratio * 0.46})`;
    ctx.lineWidth = isImpact ? 6 : 4;
    ctx.shadowColor = 'rgba(255, 48, 36, 0.82)';
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.arc(0, 0, warning.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  drawSlashes(ctx) {
    this.slashes.forEach((slash) => {
      const alpha = slash.life / slash.maxLife;
      ctx.save();
      ctx.translate(slash.x, slash.y);
      ctx.rotate(slash.angle);
      ctx.strokeStyle = `rgba(255, 226, 142, ${alpha})`;
      ctx.lineWidth = slash.heavy ? 9 : 5;
      ctx.shadowColor = 'rgba(255, 218, 105, 0.9)';
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.arc(36, 0, slash.heavy ? 74 : 54, -0.55, 0.55);
      ctx.stroke();
      ctx.restore();
    });
  }

  drawProjectiles(ctx) {
    this.projectiles.forEach((projectile) => {
      ctx.save();
      ctx.translate(projectile.x, projectile.y);
      ctx.rotate(projectile.angle);
      ctx.shadowColor = 'rgba(255, 226, 142, 0.9)';
      ctx.shadowBlur = 14;
      ctx.fillStyle = 'rgba(255, 225, 138, 0.95)';
      ctx.beginPath();
      ctx.moveTo(34, 0);
      ctx.lineTo(-22, -6);
      ctx.lineTo(-14, 0);
      ctx.lineTo(-22, 6);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 247, 210, 0.68)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-42, 0);
      ctx.lineTo(34, 0);
      ctx.stroke();
      ctx.restore();
    });
  }

  drawParticles(ctx) {
    this.particles.forEach((particle) => {
      const alpha = particle.life / particle.maxLife;
      ctx.fillStyle = `rgba(255, 224, 130, ${alpha})`;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, 3.5 * alpha + 1, 0, Math.PI * 2);
      ctx.fill();
    });
  }
}
