#!/usr/bin/env node

const fs = require('fs');

const requiredHeadings = [
  '新增 / 修改 / 删除文件列表',
  '当前已实现功能',
  '本次未实现内容',
  '是否偏离 docs/WEB_PRD.md',
  '是否提前实现了后续阶段',
  'npm run build 自测结果',
  'npm run dev 本地访问地址，如果已启动',
  '手动验收步骤',
  '当前已知问题 / 风险',
  '下一步建议',
];

function readInput() {
  const filePath = process.argv[2];
  if (filePath) {
    return fs.readFileSync(filePath, 'utf8');
  }

  return fs.readFileSync(0, 'utf8');
}

try {
  const text = readInput();
  const missing = requiredHeadings.filter((heading) => !text.includes(heading));

  if (missing.length > 0) {
    console.error('Missing required report headings:');
    for (const heading of missing) {
      console.error(`- ${heading}`);
    }
    process.exit(1);
  }

  console.log('Task report contains all required headings.');
} catch (error) {
  console.error(`Failed to verify task report: ${error.message}`);
  process.exit(1);
}
