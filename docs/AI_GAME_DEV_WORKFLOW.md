# 《寻仙问道：悟道山试炼》AI 游戏开发协作规范

## 1. 规范目的

本项目后续不再采用“把 PRD 直接丢给 Codex 生成游戏”的方式开发。

必须明确：

```text
PRD 负责说明做什么。
技术设计负责说明怎么做。
Codex 负责按任务执行。
```

如果缺少技术拆解，容易出现：

```text
面条代码
功能堆叠
状态混乱
旧代码误改
Demo 像抽奖页或测试页
战斗数值散落在 JS 中
```

所以后续任何新功能都不能直接从大 PRD 跳到代码实现，必须先经过技术拆解、Mini-TDD、文件边界、数据流、状态机和验收标准。

## 2. AI 辅助游戏开发总流程

后续开发流程固定为：

```text
1. 概念设计
↓
2. PRD / 游戏设计文档
↓
3. 技术架构设计
↓
4. 模块实现摘要 Mini-TDD
↓
5. Codex 小任务实现
↓
6. 本地构建与浏览器验收
↓
7. 进度文档更新
↓
8. 进入下一模块
```

任何新功能都不能直接从 PRD 跳到代码。

每个功能至少要先明确：

```text
PRD 目标
技术拆解
文件边界
数据流
状态机
验收标准
Codex 执行范围
```

## 3. 每个阶段的职责

### 3.1 概念设计

概念设计要回答：

```text
这个游戏是什么？
玩家扮演谁？
核心体验是什么？
第一章要证明什么？
玩家为什么继续玩？
```

本项目核心概念：

```text
玩家作为未降临的天命之子，通过五问定心决定灵根、命格、体魄和初始术法。
随后入世悟道山，通过土行石傀教学和 Boss 战完成第一章试炼。
```

### 3.2 PRD / 游戏设计文档

PRD 负责描述：

```text
世界观
第一章流程
问心规则
灵根规则
命格规则
战斗目标
Boss 设计
UI 氛围
美术风格
不做内容
验收标准
```

PRD 不直接等于代码设计。

### 3.3 技术架构设计

技术架构设计负责把 PRD 翻译成代码结构。

必须明确：

```text
改哪些文件
不改哪些文件
新增哪些对象
字段名是什么
方法名是什么
数据从哪里来
状态如何流转
谁调用谁
谁通知 UI
如何验收
```

示例数据流：

```text
heartQuestions.json
↓
问心结果计算
↓
heartProfile
↓
localStorage
↓
战斗初始化
↓
Player / HUD 展示
```

### 3.4 Mini-TDD

每个 Codex 任务前必须先有 Mini-TDD。

Mini-TDD 不是长 PRD，而是给 Codex 的施工图。

格式：

```markdown
## 模块名称

### 1. 体验目标
这个功能要让玩家感受到什么？

### 2. 系统规则
这个功能在游戏规则里如何成立？

### 3. 技术设计
- 改哪些文件
- 新增哪些字段
- 新增哪些方法
- 数据从哪里来
- 状态如何变化
- UI 如何更新

### 4. 禁止事项
本任务不能修改什么？

### 5. 验收标准
怎么判断做对了？
```

没有 Mini-TDD，不允许直接让 Codex 写代码。

## 4. 当前项目主线约定

当前 Web Demo 主线暂定为：

```text
src/main.js
src/styles/game.css
src/game/*.js
public/assets/data/heartQuestions.json
public/assets/data/combatConfig.json
```

旧 Phaser / TypeScript 文件暂时作为历史代码或迁移参考。

除非单独开启迁移任务，否则不要在同一个任务里同时修改：

```text
src/main.js
src/game/*.js
src/scenes/*.ts
src/entities/*.ts
```

这样做是为了避免主入口、当前 JS 战斗原型、旧 Phaser / TypeScript 代码边界混乱。

## 5. 当前优先级

当前不要直接做 Boss 完整实现。

当前优先级为：

```text
P0-1：建立 AI_GAME_DEV_WORKFLOW.md
P0-2：建立第一章完整开发总控文档
P0-3：建立第一章流程文档
P0-4：建立数据契约文档
P0-5：建立战斗系统 MVP 文档
P0-6：同步 WEB_PRD.md 中旧灵根设定
P0-7：明确当前主入口和旧 Phaser 代码边界
P0-8：问心结果去抽奖化
P0-9：问心结果归档 heartProfile
P0-10：combatConfig 接入当前 JS 战斗
```

之后再做：

```text
Q 灵气凝聚 / 下一击附魔
土行石傀教学段
石傀死亡后 Boss 登场
Boss 基础招式
Boss 二阶段
胜利 / 失败 / 第一章结束
音效与打击反馈
```

## 6. 数据流约定

后续核心数据流：

```text
heartQuestions.json
↓
五问结果计算
↓
heartProfile
↓
localStorage
↓
combatConfig 修正
↓
Player / Boss 初始化
↓
HUD 展示
```

`heartProfile` 建议 localStorage key：

```text
xunxian.heartProfile.v1
```

建议结构：

```js
{
  version: "xunxian-heart-profile-v1",
  createdAt: "",
  mainElement: "",
  secondaryElement: null,
  rootType: "",
  rootQuality: "",
  destiny: "",
  destinyPassive: "",
  physique: "",
  initialSpell: {},
  specialSlot: {},
  answers: []
}
```

`heartProfile` 是玩家角色初始档案，不是抽卡结果。

## 7. 体验设计原则

### 7.1 避免抽奖感

问心流程不能像：

```text
答题
↓
开奖
↓
获得稀有结果
```

应该像：

```text
问心
↓
立道
↓
命书显化
↓
天命入世
↓
带着选择进入试炼
```

避免使用：

```text
抽中
获得 SSR
重抽
稀有
神通未觉醒：无
```

推荐使用：

```text
显化
命书判定
问心所成
道心所向
灵息共鸣
命格归档
入世
```

### 7.2 避免功能堆叠

第一章 Demo 目标不是内容多，而是闭环完整。

第一章必须优先完成：

```text
开始
选择
结果
承接
教学
Boss
胜负
结束
```

在第一章垂直切片完成前，不扩展：

```text
装备系统
背包系统
多地图
多 Boss
完整技能树
NPC 交互
修炼系统
联机
商城
```

## 8. Codex 执行前要求

每次任务开始前必须执行：

```bash
git status --short
```

并区分：

```text
执行前已有未提交改动
本任务新增修改
```

不要把历史任务改动算成本任务成果。

开始实现前还必须判断任务类型：

```text
这是文档任务？
这是架构任务？
这是数据任务？
这是 UI 任务？
这是战斗任务？
这是打磨任务？
```

然后按对应范围执行，不自行扩大范围。

## 9. Codex 执行后要求

每次任务完成后必须执行：

```bash
npm run build
git status --short
```

如涉及禁止文件，需要执行：

```bash
git diff -- public/assets/data/heartQuestions.json
git diff -- public/assets/data/combatConfig.json
```

确认没有误改。

如果 `npm run build` 失败，必须先修复，不允许汇报成功。

## 10. Codex 最终回复格式

每个任务完成后，必须按以下格式回复：

```text
1. 任务ID
2. 修改了哪些文件
3. 每个文件分别改了什么
4. 是否只修改了允许修改的文件
5. 是否没有修改禁止文件
6. 是否没有修改五问内容
7. 是否没有修改结果算法
8. 是否没有修改战斗逻辑，若本任务不是战斗任务
9. 本任务新增了哪些状态 / 字段 / 方法
10. 数据从哪里读取
11. 数据保存到哪里
12. UI 如何展示
13. 是否执行 npm run build
14. npm run build 结果
15. 浏览器验证结果
16. git status --short 结果
17. 是否存在未解决问题
```

## 11. 项目开发原则

```text
原则 1：先定体验，再写代码。
原则 2：先定数据流，再写逻辑。
原则 3：先定状态机，再做交互。
原则 4：每次只改一个模块。
原则 5：优先闭环，不优先堆内容。
原则 6：结果页要像命书，不像抽奖。
原则 7：战斗数值逐步配置化。
原则 8：旧代码边界必须清晰。
原则 9：所有任务必须可验收。
原则 10：Codex 是执行工程师，不是游戏制作人。
```

没有体验目标、数据流、状态机和验收标准的任务，不允许直接开发。

## 12. 后续任务命名建议

后续任务按类型命名：

```text
XUNXIAN-DOC-xxx：文档 / 架构 / 路线图
XUNXIAN-003.x：问心与结果页
XUNXIAN-004.x：数据流与配置接入
XUNXIAN-005.x：战斗基础系统
XUNXIAN-006.x：Q 灵气附魔与轻量元素表现
XUNXIAN-007.x：土行石傀教学
XUNXIAN-008.x：Boss 基础招式
XUNXIAN-009.x：Boss 二阶段
XUNXIAN-010.x：胜负结算与第一章结束
XUNXIAN-011.x：UI / 音效 / 反馈打磨
```

