---
name: xunxian-dev-workflow
description: 用于《寻仙问道》Web Demo 的阶段式开发工作流。适用于用户要求 Codex 执行 Task、继续开发、修复验收问题、推进下一阶段时。该 Skill 要求 Codex 先读 PRD，只做一个阶段，避免提前实现后续内容，完成后必须 build、自测并按固定格式汇报。
---

# Xunxian Dev Workflow

## 触发场景

当用户说以下内容时应使用本 Skill：

- 继续开发
- 执行下一个 Task
- 实现 Task 08
- 修复刚才截图问题
- 验收后继续
- 做 Boss
- 做战斗
- 做 HUD
- 做五问
- 做悟道山
- 修复 build

## 工作流程

Codex 必须按以下流程执行：

1. 先读取 `docs/WEB_PRD.md`。
2. 确认当前用户要求对应哪个 Task。
3. 检查 `README.md` 当前进度。
4. 列出本次计划新增 / 修改文件。
5. 明确本次不做哪些后续内容。
6. 只实现当前 Task。
7. 不提前实现后续阶段。
8. 实现后运行 `npm run build`。
9. build 失败时先修复，不得汇报成功。
10. 如果需要，可运行 `npm run dev` 验证启动。
11. 完成后按 `references/task-report-template.md` 汇报。
12. 等待用户确认，不自动执行下一 Task。

## 强制规则

- 每次只做一个 Task。
- 不要一次性做完整第一章。
- 不要提前实现 Boss、联网、背包、装备、NPC、任务系统。
- 不要创建 `.unity` / `.prefab` / `.asset` / `.meta` 文件。
- 不要引用不存在的图片、音频、字体资源。
- 第一版优先使用 Phaser Graphics。
- Player 逻辑和视觉必须分离。
- 战斗不能只扣血，必须考虑打击反馈。
- 每次必须 `npm run build`。
- 完成后必须按固定格式汇报。

## 当前项目阶段提醒

当前项目：《寻仙问道：悟道山试炼》Web Demo

已完成到：

- 标题界面
- 完整五问定心
- 问心结果页
- 天命降世
- 入世十六载
- 悟道山试炼场
- 玩家移动
- HUD
- Player / PlayerVisual 分离
- 基础战斗
- 小怪教学
- 命中反馈
- 画布布局修复

后续主要阶段：

- 玩家死亡 / 试炼失败补齐
- 悟道山试炼守卫 Boss
- Boss 红圈攻击
- Boss 受击状态反馈
- 击败 Boss 后第一阶段结束
- 第一章整体打磨

## 辅助资源

- `references/task-report-template.md`：最终汇报模板。
- `references/phase-rules.md`：阶段推进和禁止提前实现规则。
- `scripts/verify-project-state.js`：轻量检查项目关键文件是否存在，只读不修改。
