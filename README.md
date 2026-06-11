# 寻仙问道：悟道山试炼 Web Demo

当前版本：基于 4 张美术资源实现的网页端《悟道山试炼》战斗 Demo。

## 资源

资源已放入：

```text
assets/images/background.png
assets/images/player.png
assets/images/boss.png
assets/images/icons.png
```

## 当前实现

1. 16:9 居中游戏容器。
2. `background.png` 作为水墨山门、云海石台背景。
3. Canvas 层绘制中央旋转淡金法阵、玩家脚下圆环、Boss 红圈预警、剑气和命中粒子。
4. `player.png` 显示在画面下方中央。
5. `boss.png` 显示在画面中上方。
6. 左上角状态栏、顶部 Boss 血条、右上角环境信息、底部两行技能栏。
7. `icons.png` 按 2 行 4 列裁剪为 8 个技能图标。
8. WASD 移动。
9. 左键轻击、右键重击、Q 金芒刺。
10. Space 闪避、R 回血。
11. Boss 缓慢靠近玩家，每 3 秒释放红圈预警攻击。
12. Boss 或玩家死亡后显示中央国风结算提示。

## 启动

```bash
npm run dev
```

## 构建

```bash
npm run build
```

## 操作

```text
WASD：移动
左键：轻击，命中 Boss 扣 8 点血
右键：重击，命中 Boss 扣 18 点血，1.2 秒冷却
Q：金芒刺，消耗 15 灵力，命中 Boss 扣 14 点血
Space：闪避，消耗 20 体力
R：回血，恢复 30 气血，消耗 1 次回血次数
```

## 注意

- 当前玩家图和 Boss 图如果带棋盘格底，会按原图显示，后续可替换透明底图。
- 本版本聚焦美术资源分层和基础交互，不实现背包、装备、NPC、任务系统、联网或复杂寻路。
