export const combatConfig = {
  player: {
    maxHp: 100,
    maxMp: 60,
    maxStamina: 100,
    moveSpeed: 180,
    staminaRegenPerSecond: 18,
    mpRegenPerSecond: 3,
    maxHealCount: 3,
  },
  lightAttack: {
    damage: 4,
    staminaCost: 8,
    range: 55,
    cooldownMs: 300,
    hitWindowMs: 120,
  },
  heavyAttack: {
    damage: 8,
    staminaCost: 18,
    range: 85,
    cooldownMs: 700,
    hitWindowMs: 180,
  },
  dodge: {
    staminaCost: 20,
    distance: 90,
    durationMs: 160,
    cooldownMs: 500,
  },
  heal: {
    amount: 30,
    cooldownMs: 1000,
  },
};
