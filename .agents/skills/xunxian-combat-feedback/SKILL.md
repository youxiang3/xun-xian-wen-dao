---
name: xunxian-combat-feedback
description: Guide combat implementation and review for the Xunxian Wendao project. Use when the user asks Codex to implement or inspect combat, enemies, Boss behavior, hit detection, DamageHitbox, SkillProjectile, HitFeedbackSystem, takeDamage flows, elemental attacks, or impact feedback.
---

# Xunxian Combat Feedback

Use this skill when implementing or reviewing combat, enemies, Boss, hit detection, or hit feedback.

## Required Checks

Before changing combat behavior, check whether the codebase already has:

- `DamageHitbox`
- `SkillProjectile`
- `HitFeedbackSystem`
- `Enemy` or `Boss` `takeDamage` entry points

You can run:

```bash
node skills/xunxian-combat-feedback/scripts/check-combat-feedback.js
```

The script is a lightweight signal check, not a full test suite.

## Feedback Requirements

Do not make hit feedback only subtract health. At minimum, consider:

- flash-white on the target
- knockback
- floating damage text
- screen shake
- hit-stop
- audio hooks or reserved sound effect calls

Preserve element colors for five-element attacks. Read `references/element-combat-rules.md` when touching elemental combat.

Reserve Boss hurt-state presentation. Read `references/boss-state-feedback.md` when touching Boss damage, stagger, armor break, elemental statuses, or death.

Scene destruction should stay lightweight and feedback-oriented. Do not add complex physical destruction unless the user explicitly requests it.

Do not introduce external audio or image assets unless the user explicitly requests them.

Use `assets/hit-feedback-system-template.ts` only as a reference template. Do not automatically overwrite a real `src/combat/HitFeedbackSystem.ts`.
