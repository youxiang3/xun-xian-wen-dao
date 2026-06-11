#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = process.cwd();
const checks = [
  {
    label: 'src/combat/DamageHitbox.ts exists',
    pass: fs.existsSync(path.join(root, 'src', 'combat', 'DamageHitbox.ts')),
  },
  {
    label: 'src/combat/SkillProjectile.ts exists',
    pass: fs.existsSync(path.join(root, 'src', 'combat', 'SkillProjectile.ts')),
  },
  {
    label: 'src/combat/HitFeedbackSystem.ts exists',
    pass: fs.existsSync(path.join(root, 'src', 'combat', 'HitFeedbackSystem.ts')),
  },
];

function walkFiles(dir, output = []) {
  if (!fs.existsSync(dir)) {
    return output;
  }

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'Library') {
      continue;
    }

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(fullPath, output);
    } else if (/\.(ts|tsx|js|jsx|cs)$/.test(entry.name)) {
      output.push(fullPath);
    }
  }

  return output;
}

const sourceFiles = walkFiles(path.join(root, 'src'));
const sourceText = sourceFiles
  .map((file) => {
    try {
      return fs.readFileSync(file, 'utf8');
    } catch {
      return '';
    }
  })
  .join('\n');

checks.push(
  {
    label: 'takeDamage string exists in source',
    pass: sourceText.includes('takeDamage'),
  },
  {
    label: 'shake or screen shake hook exists in source',
    pass: /shake|screenShake|screen-shake/i.test(sourceText),
  },
  {
    label: 'hitStop or hit-stop hook exists in source',
    pass: /hitStop|hit-stop/i.test(sourceText),
  },
);

let failed = false;
for (const check of checks) {
  const marker = check.pass ? 'PASS' : 'WARN';
  console.log(`[${marker}] ${check.label}`);
  if (!check.pass) {
    failed = true;
  }
}

if (failed) {
  process.exitCode = 1;
}
