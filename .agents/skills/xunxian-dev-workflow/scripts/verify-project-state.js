#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'docs/WEB_PRD.md',
  'README.md',
  'package.json',
  'src/gameConfig.ts',
  'src/scenes/GateTrialScene.ts',
  'src/entities/Player.ts',
  'src/entities/PlayerVisual.ts',
  'src/ui/CombatHUD.ts',
  'src/ui/SkillSlotHUD.ts',
];

for (const file of requiredFiles) {
  const fullPath = path.join(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    console.log(`[OK] 文件存在：${file}`);
  } else {
    console.log(`[MISSING] 文件缺失：${file}`);
  }
}

console.log('项目状态检查完成。');
