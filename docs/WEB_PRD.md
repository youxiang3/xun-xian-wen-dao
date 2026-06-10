# 《寻仙问道：悟道山试炼》Web Demo PRD v1.5

## 0. 文档说明

本文档是《寻仙问道》网页版原型的完整产品需求文档。

当前版本不是完整游戏，而是《寻仙问道》的第一阶段原型：

```text
第一阶段：五问定心、天命降世、悟道山入仙门
```

当前第一阶段要完成：

```text
标题界面
↓
五问定心
↓
生成主灵根 / 灵根品质 / 命格 / 体魄 / 五行基础攻击术
↓
天命降世
↓
入世十六载
↓
前往悟道山
↓
仙门试炼
↓
基础战斗教学
↓
击败悟道山试炼守卫
↓
习得基础术法
↓
第一阶段结束，预告入世大唐
```

后续阶段预留：

```text
第二阶段：入世大唐
第三阶段：散市交换 / 主线任务
第四阶段：重走西游路
第五阶段：寻道证道
```

重要原则：

```text
第一版可以不做完整游戏。
但第一版必须把修仙核心设定预留好。

初始技能不是附魔。
初始技能统一为五行基础攻击术。
附魔属于 E 辅助法术 / 先天神通 / 功法体系，第一版可以预留。

武技消耗耐力。
法术消耗灵力。
灵根品质保留。
五行生克保留。
环境亲和保留。
元素反应保留轻量实现。
```

---

# 1. 项目名称

## 1.1 游戏总名

```text
寻仙问道
```

## 1.2 当前 Web Demo 名称

```text
寻仙问道：悟道山试炼
```

## 1.3 副标题

```text
五问定心，入世寻道
```

## 1.4 名称含义

“寻仙”代表玩家从凡俗走向修行世界。

“问道”代表玩家不是单纯刷怪变强，而是在选择、战斗、因果、交易、任务和修行中寻找自己的道。

游戏核心不是抽卡，不是 SSR，不是随机刷角色，而是：

```text
五问定心
命格自成
灵根初显
入世修行
寻道证道
```

---

# 2. 项目定位

## 2.1 类型

```text
Web 2D 动作 RPG 原型
东方修仙题材
剧情阶段式推进
第一阶段单人单机
后续预留联网
第一版使用极简修仙剪影 / 火柴人
```

## 2.2 技术方向

推荐技术栈：

```text
Phaser
TypeScript
Vite
```

第一版不使用正式图片资源。

所有视觉优先用 Phaser Graphics / 简单几何图形实现。

后续再替换为：

```text
水墨背景
修仙剪影角色
悟道山背景
山门牌坊
Boss 剪影
五行术法特效
```

## 2.3 第一阶段目标

做出一个浏览器可玩的第一阶段 Demo：

```text
打开网页
↓
看到“寻仙问道”
↓
完成五问定心
↓
生成主灵根、灵根品质、命格、体魄、五行基础攻击术
↓
经历天命降世与入世十六载
↓
来到悟道山
↓
通过仙门试炼
↓
使用轻击、重击、Q 五行术法、闪避、回血
↓
击败小怪
↓
击败悟道山试炼守卫
↓
看到第一阶段结束文案
```

---

# 3. 长期剧情阶段规划

## 3.1 第一阶段：降世与入仙门

当前 Web Demo 只做这个阶段。

内容：

```text
五问定心
天命降世
入世十六载
悟道山
仙门试炼
基础术法
入仙门
```

目标：

```text
建立开局仪式感
生成玩家初始修行方向
让玩家理解灵根、命格、体魄
教学基础战斗
完成入仙门
为入世大唐做铺垫
```

---

## 3.2 第二阶段：入世大唐

后续开发，不在第一版实现。

内容方向：

```text
玩家离开悟道山
进入大唐世界
接触凡人、修士、妖怪、商旅
开始入世修心
```

预留玩法：

```text
主线任务
散市交换
材料收集
基础法术学习
NPC 因果
道心选择
```

---

## 3.3 第三阶段：散市与任务

后续开发，不在第一版实现。

内容方向：

```text
散市
物资交换
任务告示
修士交易
法术残卷
灵材
符箓
法宝线索
```

预留系统：

```text
Inventory
Material
TradeItem
MarketScene
ExchangeRule
QuestReward
NPCRelation
SpellLearn
```

---

## 3.4 第四阶段：重走西游路

后续开发，不在第一版实现。

方向：

```text
大唐
取道路
妖魔
佛道
人道
人皇气运
因果选择
寻道证道
```

当前只预留，不实现具体西游剧情。

---

# 4. 联网规划

## 4.1 第一版不做联网

当前 Web Demo 不实现：

```text
账号
登录
注册
实时联机
多人副本
交易行
排行榜
云存档
服务器
```

## 4.2 后续预留联网

未来联网方向：

```text
云存档
每日试炼
每周山门榜
散市物资交换
异步玩家交易
世界事件
任务刷新
好友协助
排行榜
多人幻境
```

## 4.3 当前版本预留字段

第一版代码中预留：

```text
GameSession
PlayerProfile
ChapterProgress
Inventory
QuestState
TradeItem
NetworkPlaceholder
```

但不实现真实联网。

---

# 5. 第一阶段完整流程

## 5.1 标准流程

```text
启动游戏
↓
TitleScene 标题界面
↓
HeartTrialScene 五问定心
↓
HeartTrialResultScene 问心结果
↓
DescentScene 天命降世
↓
PrologueScene 入世十六载
↓
GateTrialScene 悟道山试炼
↓
Enemy_TrialShadow 小怪教学
↓
Boss_WudaoGateGuardian 试炼守卫
↓
LearnSpell / VictoryResult
↓
第一阶段结束
```

## 5.2 最小实现流程

为了降低开发成本，可以合并部分场景：

```text
TitleScene
↓
HeartTrialScene
↓
DescentAndPrologueScene
↓
GateTrialScene
↓
VictoryResult
```

但代码结构要预留独立阶段。

---

# 6. TitleScene 标题界面

## 6.1 显示内容

主标题：

```text
寻仙问道
```

副标题：

```text
五问定心，入世寻道
```

提示：

```text
点击开始
```

## 6.2 视觉风格

```text
深墨蓝背景
半透明云雾
淡金标题
远山剪影
水墨氛围
不要白色弹窗
不要现代网页按钮
不要手游抽卡界面
```

## 6.3 交互

点击任意位置或点击提示文字后，进入 HeartTrialScene。

---

# 7. 五问定心系统

## 7.1 系统定位

五问定心是《寻仙问道》的开局核心。

玩家不是抽卡获得角色，而是通过五道问心题形成自己的初始修行方向。

五问结束后生成：

```text
主灵根
灵根品质
命格
体魄
五行基础攻击术
先天神通 / 辅助法术槽状态
```

## 7.2 五问结果影响

五问结果影响：

```text
Q 五行基础攻击术
玩家灵根颜色
问心结果页展示
技能槽 HUD 展示
灵根品质字段
后续命格神通预留
后续体魄被动预留
后续功法路线预留
```

第一版命格和体魄可以只展示，不强制影响战斗数值。

---

# 8. 五问数据规则

## 8.1 ElementType

```ts
export type ElementType = "Metal" | "Wood" | "Water" | "Fire" | "Earth";
```

## 8.2 FateType

```ts
export type FateType = "逆命" | "济世" | "观势" | "守心" | "烈心";
```

## 8.3 BodyType

```ts
export type BodyType = "锋骨" | "灵脉" | "玄体" | "铁骨" | "燃血";
```

## 8.4 RootQuality

```ts
export type RootQuality =
  | "Balanced"
  | "Mixed"
  | "Adjacent"
  | "Pure"
  | "Heavenly";
```

中文显示：

```text
Balanced = 五行中和
Mixed = 驳杂灵根
Adjacent = 相生灵根
Pure = 纯灵根
Heavenly = 天灵根
```

## 8.5 HeartTrialOption

```ts
export interface HeartTrialOption {
  key: "A" | "B" | "C" | "D";
  text: string;
  scores: {
    element: Partial<Record<ElementType, number>>;
    fate: Partial<Record<FateType, number>>;
    body: Partial<Record<BodyType, number>>;
  };
}
```

## 8.6 HeartTrialQuestion

```ts
export interface HeartTrialQuestion {
  id: number;
  title: string;
  content: string;
  options: HeartTrialOption[];
}
```

## 8.7 HeartTrialResult

```ts
export interface HeartTrialResult {
  rootElement: ElementType;
  rootName: string;

  rootQuality: RootQuality;
  rootQualityName: string;

  fate: FateType;
  fateEffects: string[];

  body: BodyType;
  bodyEffects: string[];

  initialAttackSkillId: string;
  initialAttackSkillName: string;

  innateAbilityId?: string;
  innateAbilityName?: string;

  description: string;
}
```

## 8.8 HeartTrialState

```ts
export interface HeartTrialState {
  currentQuestionIndex: number;
  selectedAnswers: HeartTrialOption[];
  elementScores: Record<ElementType, number>;
  fateScores: Record<FateType, number>;
  bodyScores: Record<BodyType, number>;
  finalResult?: HeartTrialResult;
}
```

---

# 9. 五问题目完整内容

## 第一问：不可为之事

### 题目

```text
山外妖火焚村，长河横断。
众人皆曰：此水不可渡，此事不可为。
汝将何为？
```

### 选项

| 选项 | 文案           | 灵根       | 命格    | 体魄    |
| -- | ------------ | -------- | ----- | ----- |
| A  | 折枝为剑，先渡一步。   | Metal +1 | 逆命 +1 | 锋骨 +1 |
| B  | 先救眼前可救之人。    | Wood +1  | 济世 +1 | 灵脉 +1 |
| C  | 静观水势，待一线生机。  | Water +1 | 观势 +1 | 玄体 +1 |
| D  | 立土为界，护住身后之人。 | Earth +1 | 守心 +1 | 铁骨 +1 |

---

## 第二问：妖与人

### 题目

```text
荒寺夜雨，一幼妖伏于佛像之后。
村人持火追至，皆言妖不可留。
可它怀中，尚护着一个昏迷孩童。

汝将何为？
```

### 选项

| 选项 | 文案             | 灵根       | 命格    | 体魄    |
| -- | -------------- | -------- | ----- | ----- |
| A  | 不问其形，先救孩童。     | Wood +1  | 济世 +1 | 灵脉 +1 |
| B  | 剑指幼妖，待其开口自证。   | Metal +1 | 逆命 +1 | 锋骨 +1 |
| C  | 熄众人之火，查明因果。    | Water +1 | 观势 +1 | 玄体 +1 |
| D  | 以火镇场，止众怒，也止妖惧。 | Fire +1  | 烈心 +1 | 燃血 +1 |

---

## 第三问：一法与众生

### 题目

```text
山中有一卷残法，可助你踏入修行。
然取此法，封印便破，山下百姓将遭妖患。
若弃此法，你或许此生无缘仙门。

汝将何为？
```

### 选项

| 选项 | 文案           | 灵根       | 命格    | 体魄    |
| -- | ------------ | -------- | ----- | ----- |
| A  | 弃法救人，道不在卷中。  | Wood +1  | 济世 +1 | 灵脉 +1 |
| B  | 取法破妖，以此法偿此因。 | Fire +1  | 烈心 +1 | 燃血 +1 |
| C  | 不取不弃，另寻封印之法。 | Water +1 | 观势 +1 | 玄体 +1 |
| D  | 守住封印，待有能者再来。 | Earth +1 | 守心 +1 | 铁骨 +1 |

---

## 第四问：散市之争

### 题目

```text
散市之中，一枚旧玉无人识得。
你知其中藏有灵机，足以换你十年修行。
摊主只是凡人，并不知其价。

汝将何为？
```

### 选项

| 选项 | 文案             | 灵根       | 命格    | 体魄    |
| -- | -------------- | -------- | ----- | ----- |
| A  | 如实告知，以正价相换。    | Earth +1 | 守心 +1 | 铁骨 +1 |
| B  | 低价买下，日后十倍偿还。   | Metal +1 | 逆命 +1 | 锋骨 +1 |
| C  | 以其所需之物交换，不欺不夺。 | Wood +1  | 济世 +1 | 灵脉 +1 |
| D  | 借势竞价，让其自得高价。   | Water +1 | 观势 +1 | 玄体 +1 |

---

## 第五问：所求之道

### 题目

```text
悟道山前，云阶千重。
有一老者问你：

若此生可求一道，
你究竟为何修行？
```

### 选项

| 选项 | 文案               | 灵根       | 命格    | 体魄    |
| -- | ---------------- | -------- | ----- | ----- |
| A  | 为破尽不平，开一条无人敢行之路。 | Metal +1 | 逆命 +1 | 锋骨 +1 |
| B  | 为护眼前众生，不负人间烟火。   | Wood +1  | 济世 +1 | 灵脉 +1 |
| C  | 为观尽因果，寻天地真正之理。   | Water +1 | 观势 +1 | 玄体 +1 |
| D  | 为燃尽迷障，纵身入劫亦无悔。   | Fire +1  | 烈心 +1 | 燃血 +1 |

---

# 10. 五问结果生成规则

## 10.1 主灵根

统计五问中五行得分。

最高分元素为主灵根。

如果并列，按最后一题选择优先。

对应关系：

| ElementType | 主灵根 | 五行攻击术 |
| ----------- | --- | ----- |
| Metal       | 金灵根 | 金芒刺   |
| Wood        | 木灵根 | 青藤击   |
| Water       | 水灵根 | 寒露刃   |
| Fire        | 火灵根 | 火星诀   |
| Earth       | 土灵根 | 碎土刺   |

## 10.2 命格

统计 FateType 得分。

最高分为命格。

如果并列，按最后一题选择优先。

## 10.3 体魄

统计 BodyType 得分。

最高分为体魄。

如果并列，按最后一题选择优先。

---

# 11. 灵根品质系统

## 11.1 是否保留

必须保留。

MVP 不做复杂成长，但必须做：

```text
字段
结果展示
轻量战斗影响
后续扩展接口
```

灵根品质不是“越纯越无脑强”。

五行核心是：

```text
中和
生克
平衡
环境亲和
代价
```

纯灵根有优势，也有弱点。

五行中和没有极端爆发，但更稳定。

---

## 11.2 品质判断规则

五问结束后统计五行得分。

每题选项给对应元素 +1。

### 天灵根 Heavenly

条件：

```text
某一个元素得分 = 5
```

含义：

```text
五问皆归一性。
这是命格级别的灵根，不只是普通属性。
```

效果：

```text
主元素攻击术伤害 +10%
主元素环境下 MP 恢复 +25%
受到克制元素伤害 +10%
解锁一个先天神通
```

示例：

```text
五题全偏火 → 火天灵根
五题全偏金 → 金天灵根
```

---

### 纯灵根 Pure

条件：

```text
某一个元素得分 >= 4
```

效果：

```text
主元素攻击术伤害 +5%
主元素环境下 MP 恢复 +15%
受到克制元素伤害 +5%
可解锁弱化版先天神通
```

---

### 相生灵根 Adjacent

条件：

```text
得分主要集中在两个相生元素上
且这两个元素总分 >= 4
```

相生关系：

```text
金生水
水生木
木生火
火生土
土生金
```

效果：

```text
两个相生元素环境下 MP 恢复 +10%
触发相生反应时效果 +1
没有明显克制伤害惩罚
可解锁相生类辅助法术
```

---

### 五行中和 Balanced

条件：

```text
五行分布较平均
没有单一元素超过 2
```

效果：

```text
受到所有元素伤害 -3%
所有环境下 MP 恢复稳定
元素反应伤害不突出，但自身抗性更均衡
不解锁极端先天神通
```

说明：

```text
五行中和不是废灵根。
它体现“平衡”和“稳定”。
适合后续走多元素反应路线。
```

---

### 驳杂灵根 Mixed

条件：

```text
分布不均，但也没有形成纯灵根、相生灵根或五行中和。
```

效果：

```text
第一版无明显加成
后续可通过功法洗练、补全、转化
```

---

# 12. 问心结果页

## 12.1 显示字段

问心结果页必须显示：

```text
主灵根
灵根品质
命格
体魄
五行基础攻击术
先天神通 / 辅助法术
```

## 12.2 普通结果示例

```text
主灵根：火灵根
灵根品质：纯灵根
命格：烈心
体魄：燃血
五行攻击术：火星诀
先天神通：未觉醒

其意如火，燃尽迷障。
```

## 12.3 天灵根结果示例

```text
主灵根：金灵根
灵根品质：金天灵根
命格：逆命
体魄：锋骨
五行攻击术：金芒刺
先天神通：金灵附刃

其意如金，锋锐破局。
```

## 12.4 五行中和结果示例

```text
主灵根：水灵根
灵根品质：五行中和
命格：观势
体魄：玄体
五行攻击术：寒露刃
先天神通：未觉醒

五行不偏，气机自稳。
```

---

# 13. 天命降世与入世过场

## 13.1 过场标题

```text
五问定禅心，十六载入尘寰
```

或：

```text
入世十六载
```

## 13.2 过场文案

```text
汝本天外一缕命炁，未落尘寰。

五问定禅心，命书遂阖。

自此入世，托生凡尘。

十六载春秋，如山中一梦。

饥寒尝尽，离别亦知，唯掌中一木，朝夕不离。

是日，云开万仞，仙人抚顶，问汝长生。

山门在前，试炼已启。

凡骨未定，天命难凭。

踏过此门，方知大道几何。
```

## 13.3 过场表现

要求：

```text
每句逐句淡入
淡金文字
深蓝 / 黑色背景
少量星尘和灵光
“仙人抚顶，问汝长生”这一句停留稍久
最后一句结束后显示“前往仙门”
```

第一版用 Phaser Graphics 和 Text 即可。

---

# 14. 悟道山场景设定

## 14.1 场景名称

```text
悟道山
```

## 14.2 场景定位

悟道山是第一阶段核心地点。

它不是普通新手村，而是连接凡尘与仙门的试炼之地。

## 14.3 场景元素

```text
山门
云阶
石阶
试炼法阵
山雾
远山
仙门牌坊
试炼守卫
```

## 14.4 场景布局

```text
上方：悟道山山门 / Boss 区域
中间：试炼法阵 / 小怪教学区
下方：玩家出生点
左上：气血 / 灵力 / 体力 HUD
底部或右下：技能槽 HUD
```

## 14.5 场景对象结构

```text
GateTrialScene
├── Background
│   ├── InkSkyBackground
│   ├── CloudFogLayer
│   └── FarMountainShadow
├── Environment
│   ├── StoneGround
│   ├── TrialCircle
│   ├── StoneSteps
│   ├── CloudStairs
│   └── WudaoGateArch
├── Gameplay
│   ├── Player
│   ├── Enemy_TrialShadow
│   └── Boss_WudaoGateGuardian
├── Effects
│   ├── HitEffects
│   ├── SkillProjectiles
│   └── WarningAreas
└── UI
    ├── CombatHUD
    ├── SkillSlotHUD
    ├── BossHUD
    └── ResultText
```

---

# 15. 战斗资源定义

## 15.1 武技消耗耐力

以下行为消耗 Stamina / 耐力：

```text
鼠标左键：轻击
鼠标右键：重击
鼠标右键：蓄力重击，后续预留
Space：闪避
```

说明：

```text
轻击、重击属于武技。
木棍攻击不消耗 MP。
耐力不足时，不能轻击、重击、闪避。
```

## 15.2 法术消耗灵力

以下行为消耗 MP / 灵力：

```text
Q：五行基础攻击术
E：辅助法术 / 附魔 / 先天神通，第一版预留
```

说明：

```text
五行攻击术消耗 MP。
辅助法术消耗 MP 或进入冷却。
附魔不是普通攻击，也不是金灵根唯一技能，而是法术体系的一部分。
```

---

# 16. 输入键位

第一版输入：

```text
WASD：移动
鼠标左键：轻击，消耗耐力
鼠标右键：重击 / 后续蓄力重击，消耗耐力
Q：释放当前灵根的五行基础攻击术，消耗灵力
E：辅助法术 / 附魔 / 先天神通，第一版预留
F：命格神通，第一版预留
1：法宝 / 符箓，第一版预留
Space：闪避，消耗耐力
R：回血
鼠标方向：决定轻击、重击、五行攻击术方向
```

MVP 优先实现：

```text
左键轻击
右键重击
Q 五行攻击术
Space 闪避
R 回血
```

E / F / 1 预留：

```text
E：辅助法术尚未觉醒
F：命格神通尚未觉醒
1：尚未获得法宝
```

---

# 17. Player 玩家设计

## 17.1 视觉方向

第一版玩家使用：

```text
极简修仙剪影 / 火柴人
```

要求：

```text
深墨色身体
有头部
有长袍轮廓
有手臂和腿
有木棍
脚下有灵根 Aura
身体外圈 / 木棍微光 / 脚下小法阵显示主灵根颜色
鼠标方向控制木棍朝向
不是现代街斗火柴人
```

## 17.2 初始属性

```text
maxHp = 100
hp = 100

maxMp = 60
mp = 60

maxStamina = 100
stamina = 100

moveSpeed = 180
healCount = 3
```

## 17.3 资源恢复

基础恢复：

```text
stamina 每秒恢复 18
mp 每秒恢复 3
```

环境亲和和灵根品质可以影响 MP 恢复。

---

# 18. 灵根颜色表现

## 18.1 角色表现

```text
火柴人主体仍然是深墨色。
身体外圈 / 头顶灵光 / 木棍微光 / 脚下小法阵显示灵根颜色。
```

五行颜色：

```text
金：淡金色
木：青绿色
水：淡蓝色
火：橙红色
土：土黄色
```

## 18.2 UI 表现

问心结果页显示：

```text
主灵根名称
主灵根颜色
灵根品质
命格
体魄
五行基础攻击术
辅助法术槽：未觉醒
```

仙门试炼 UI：

```text
Q 技能图标使用对应灵根颜色
玩家身上有对应灵根光晕
攻击术 projectile 使用对应颜色
```

---

# 19. 技能系统总设计

## 19.1 核心原则

《寻仙问道》是修仙题材，技能不能只是普通攻击按钮。

技能分为：

```text
武技
灵根术法
辅助法术
命格神通
法宝 / 符箓
丹药 / 消耗品
身法
功法被动
```

第一版可以只实装部分，但结构必须完整预留。

## 19.2 SkillCategory

```ts
export type SkillCategory =
  | "Martial"
  | "ElementSpell"
  | "AssistSpell"
  | "FatePower"
  | "Treasure"
  | "Consumable"
  | "Movement"
  | "Passive";
```

## 19.3 技能槽 HUD

第一版必须展示：

```text
左键：轻击
右键：重击
Q：当前五行基础攻击术
E：辅助法术·未觉醒
F：命格神通·未觉醒
1：法宝·未获得
R：回血 3/3
Space：闪避
```

## 19.4 默认技能槽

```ts
export type SkillSlotKey =
  | "MouseLeft"
  | "MouseRight"
  | "KeyQ"
  | "KeyE"
  | "KeyF"
  | "Digit1"
  | "KeyR"
  | "Space";

export interface SkillSlot {
  key: SkillSlotKey;
  label: string;
  category: SkillCategory;
  skillId?: string;
  locked: boolean;
  lockedText?: string;
}
```

---

# 20. 五行基础攻击术

## 20.1 定位

五行基础攻击术是玩家根据主灵根获得的第一个法术。

它不是强力大招，而是刚入门的基础术法。

设定理由：

```text
主角刚过仙门试炼，修为极低。
五行法术只是初显端倪，不做夸张爆炸。
```

## 20.2 Web 数值说明

以下 range 使用设计单位。

Web 实现时可以换算为像素距离：

```text
1 设计单位 ≈ 80px
```

例如：

```text
range = 5 → projectileMaxDistance ≈ 400px
```

---

## 20.3 金灵根：金芒刺

```text
skillId = metal_spike
skillName = 金芒刺
elementType = Metal
mpCost = 10
cooldown = 3s
damage = 7
range = 5
```

效果：

```text
朝鼠标方向射出一道短金芒。
命中敌人造成金属性伤害。
附带少量破甲 / 破盾效果。
```

第一版表现：

```text
淡金色短线 projectile
命中有小金光
对护盾额外 +2 伤害
```

---

## 20.4 木灵根：青藤击

```text
skillId = wood_vine
skillName = 青藤击
elementType = Wood
mpCost = 10
cooldown = 4s
damage = 5
range = 4
```

效果：

```text
朝鼠标方向甩出一道青藤灵气。
命中敌人造成木属性伤害。
附带短暂缠绕 / 减速。
```

第一版表现：

```text
淡绿色藤影
敌人减速 20%，持续 1.5 秒
附加 WoodBind 状态
```

---

## 20.5 水灵根：寒露刃

```text
skillId = water_blade
skillName = 寒露刃
elementType = Water
mpCost = 10
cooldown = 3s
damage = 5
range = 5
```

效果：

```text
朝鼠标方向释放一道水刃。
命中敌人造成水属性伤害。
附带 Wet / 湿润状态。
```

第一版表现：

```text
淡蓝色水刃
敌人进入 Wet
敌人减速 20%，持续 2 秒
```

---

## 20.6 火灵根：火星诀

```text
skillId = fire_spark
skillName = 火星诀
elementType = Fire
mpCost = 10
cooldown = 3s
damage = 6
range = 5
```

效果：

```text
朝鼠标方向射出一枚火星。
命中敌人造成火属性伤害。
附带 Burning / 灼烧。
```

第一版表现：

```text
橙红色小火星
灼烧每秒 1 点伤害，持续 3 秒
```

---

## 20.7 土灵根：碎土刺

```text
skillId = earth_spike
skillName = 碎土刺
elementType = Earth
mpCost = 12
cooldown = 4s
damage = 6
range = 4
```

效果：

```text
朝鼠标方向生成一道短距离地刺。
命中敌人造成土属性伤害。
附带轻微击退 / 硬直。
```

第一版表现：

```text
土黄色地刺
命中敌人轻微击退
对冲撞中的敌人有轻微打断效果
```

---

# 21. 附魔 / 辅助法术体系

## 21.1 定位

附魔不是初始五行攻击术。

附魔属于：

```text
辅助法术
先天神通
武器附灵
功法效果
```

后续可以和灵根品质、命格、功法绑定。

第一版必须预留：

```text
E：辅助法术槽
```

第一版不强制实现完整附魔。

---

## 21.2 通用辅助法术：灵气附棍

如果后续要做最小辅助法术，可以做：

```text
skillId = weapon_enchant
skillName = 灵气附棍
mpCost = 12
cooldown = 10s
duration = 6s
```

效果：

```text
将当前灵根之气附着在木棍上。
持续期间轻击和重击附带对应灵根颜色。
轻击 bonusDamage +1
重击 bonusDamage +2
如果是克制目标元素，额外 +1
```

不同灵根表现：

```text
金：木棍泛淡金光，重击破盾更强
木：木棍泛青绿光，命中后少量恢复 1 HP，内置冷却 1 秒
水：木棍泛淡蓝光，命中后轻微减速
火：木棍泛橙红光，重击附带 1 秒灼烧
土：木棍泛土黄光，重击击退更强
```

注意：

```text
这不是 Q 技能。
Q 是五行基础攻击术。
附魔属于 E 或后续功法 / 先天神通体系。
```

---

# 22. 武技系统

## 22.1 轻击

输入：

```text
鼠标左键
```

建议参数：

```text
damage = 4
staminaCost = 8
range = 55px
cooldown = 300ms
hitWindow = 120ms
```

效果：

```text
短距离木棍攻击。
命中敌人造成伤害。
敌人闪白 + 轻微击退。
```

## 22.2 重击

输入：

```text
鼠标右键
```

建议参数：

```text
damage = 8
staminaCost = 18
range = 85px
cooldown = 700ms
hitWindow = 180ms
```

效果：

```text
范围更大。
伤害更高。
消耗更多耐力。
```

## 22.3 蓄力重击预留

第一版不强制实现。

但代码中预留：

```text
isChargingHeavyAttack
heavyAttackStartTime
releaseHeavyAttack()
```

后续实现：

```text
按住右键蓄力
松开右键释放
蓄力越久，范围和伤害越高
```

---

# 23. 五行生克关系

## 23.1 相生

```text
金生水
水生木
木生火
火生土
土生金
```

## 23.2 相克

```text
金克木
木克土
土克水
水克火
火克金
```

## 23.3 MVP 轻量表现

第一版只做轻量表现：

```text
克制目标时：伤害 +10%
被克制攻击时：受到伤害 +10%
五行中和：受到元素伤害 -3%
纯灵根 / 天灵根：主元素更强，但被克制时更痛
```

不要做复杂元素计算。

代码中预留：

```ts
export const elementGeneratingMap = {
  Metal: "Water",
  Water: "Wood",
  Wood: "Fire",
  Fire: "Earth",
  Earth: "Metal"
};

export const elementCounterMap = {
  Metal: "Wood",
  Wood: "Earth",
  Earth: "Water",
  Water: "Fire",
  Fire: "Metal"
};
```

---

# 24. 环境亲和

## 24.1 设定

纯灵根和天灵根对相近环境亲和度更高。

例如：

```text
水灵根在溪流、雨天、寒潭附近恢复更快。
火灵根在火把、熔炉、炎地附近恢复更快。
木灵根在树林、草地附近恢复更快。
金灵根在矿石、兵器、金铁阵附近恢复更快。
土灵根在山石、土地、石阶附近恢复更快。
```

## 24.2 悟道山环境

第一版悟道山试炼场环境标签：

```text
GateTrialEnvironment = Earth
```

原因：

```text
仙门前有山石、石阶、山门，所以默认偏土。
```

## 24.3 MVP 简化效果

```text
如果玩家主灵根与环境相同：
MP 恢复 +10%

如果玩家主灵根与环境相生：
MP 恢复 +5%

如果玩家是五行中和：
MP 恢复稳定，无加成也无惩罚

如果玩家被环境克制：
暂时不做惩罚，避免第一版体验过差
```

---

# 25. 五行状态与反应

## 25.1 状态预留

至少预留：

```text
Wet：水
Burning：火
Slowed：减速
Guarded：土护
MetalBreak：金破
WoodBind：木缠
```

MVP 至少实现：

```text
Wet
Burning
Slowed
WoodBind
```

## 25.2 水 + 火：蒸汽

触发：

```text
敌人已有 Wet
再受到 Fire 攻击术
```

效果：

```text
额外造成 2 点伤害
清除 Wet
显示白色小雾效
```

第一版必须实现这个反应。

## 25.3 金 + 木：断藤

触发：

```text
敌人已有 WoodBind
再受到 Metal 攻击术或金附魔重击
```

效果：

```text
额外造成 2 点伤害
提前结束缠绕
```

第一版预留。

## 25.4 土 + 水：浊流

触发：

```text
敌人已有 Wet
再受到 Earth 攻击术
```

效果：

```text
减速时间 +1 秒
```

第一版预留。

## 25.5 木 + 火：引燃

触发：

```text
敌人已有 WoodBind
再受到 Fire 攻击术
```

效果：

```text
灼烧时间 +1 秒
```

第一版预留。

---

# 26. 小怪设计：Enemy_TrialShadow

## 26.1 定位

悟道山试炼中的教学小怪。

用于让玩家练习：

```text
移动
轻击
重击
Q 五行攻击术
闪避
回血
```

## 26.2 属性

```text
maxHp = 40
hp = 40
moveSpeed = 80
damage = 8
attackRange = 36
detectRange = 220
attackCooldown = 1000ms
elementType = Wood
```

说明：

```text
第一版小怪可以默认 Wood 木属性。
这样金灵根的金芒刺有克制表现。
```

## 26.3 行为

```text
未激活：原地待机
玩家进入 detectRange：开始追踪
进入 attackRange：攻击玩家
被攻击：扣血、闪白、击退
hp <= 0：死亡消失
```

---

# 27. Boss 设计：Boss_WudaoGateGuardian

## 27.1 名称

```text
悟道山试炼守卫
```

## 27.2 类名

```text
BossWudaoGateGuardian
```

## 27.3 定位

第一阶段最终考核 Boss。

不是大反派，只是悟道山入门试炼的守卫。

## 27.4 属性

```text
maxHp = 180
hp = 180
moveSpeed = 45
damage = 15
detectRange = 260
attackRange = 120
attackCooldown = 2200ms
phase = 1
elementType = Earth
```

## 27.5 行为

```text
待机
↓
玩家靠近悟道山山门
↓
Boss 激活
↓
Boss 慢速靠近玩家
↓
周期释放红圈范围攻击
↓
红圈预警
↓
延迟后造成伤害
↓
hp <= 0
↓
Boss 死亡
↓
显示第一阶段结束文案
```

## 27.6 红圈攻击

```text
预警颜色：暗红半透明
预警时间：800ms
半径：70px
伤害：15
```

## 27.7 Boss 死亡文案

```text
山门已开，仙途始行。

你已习得基础术法：{initialAttackSkillName}。

此术，不过问道之始。

下一阶段：入世大唐。
```

---

# 28. HUD 设计

## 28.1 CombatHUD

左上角显示：

```text
气血 HP
灵力 MP
体力 Stamina
回血次数
```

## 28.2 SkillSlotHUD

底部或右下显示：

```text
左键 轻击
右键 重击
Q {当前五行攻击术}
E 辅助法术·未觉醒
F 命格神通·未觉醒
1 法宝·未获得
R 回血 3/3
Space 闪避
```

## 28.3 BossHUD

Boss 激活后显示：

```text
悟道山试炼守卫
Boss HP 条
```

## 28.4 技能槽状态

| 状态    | 表现          |
| ----- | ----------- |
| 可用    | 淡金 / 对应灵根颜色 |
| 冷却中   | 灰暗 + 冷却数字   |
| MP 不足 | 暗淡          |
| 耐力不足  | 暗淡          |
| 未觉醒   | 灰色          |
| 未获得   | 灰色          |

---

# 29. GameSession

第一版不做正式存档，但要保存场景间状态。

```ts
export interface GameSessionState {
  selectedHeartTrialResult?: HeartTrialResult;
  rootElement?: ElementType;
  rootQuality?: RootQuality;
  chapterId: string;
  stageId: string;
  equippedSkillSlots: SkillSlot[];
}
```

第一版默认：

```text
chapterId = "chapter_01_descent_and_wudao_gate"
stageId = "wudao_gate_trial"
```

用途：

```text
从五问结果传递到战斗场景
决定 Q 当前是什么术法
决定玩家灵根光晕颜色
决定 HUD 展示技能名称
决定灵根品质效果
```

---

# 30. 推荐项目结构

```text
xun-xian-wen-dao-web-demo/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── README.md
├── docs/
│   └── WEB_PRD.md
└── src/
    ├── main.ts
    ├── gameConfig.ts
    ├── scenes/
    │   ├── TitleScene.ts
    │   ├── HeartTrialScene.ts
    │   ├── HeartTrialResultScene.ts
    │   ├── DescentScene.ts
    │   ├── PrologueScene.ts
    │   └── GateTrialScene.ts
    ├── entities/
    │   ├── Player.ts
    │   ├── EnemyTrialShadow.ts
    │   └── BossWudaoGateGuardian.ts
    ├── combat/
    │   ├── DamageHitbox.ts
    │   ├── ElementSystem.ts
    │   ├── ElementReactionSystem.ts
    │   └── SkillProjectile.ts
    ├── data/
    │   ├── HeartTrialData.ts
    │   ├── CombatConfig.ts
    │   ├── ElementConfig.ts
    │   ├── SkillDefinitions.ts
    │   └── SkillSlots.ts
    ├── session/
    │   └── GameSession.ts
    ├── ui/
    │   ├── CombatHUD.ts
    │   ├── SkillSlotHUD.ts
    │   └── BossHUD.ts
    ├── types/
    │   └── GameTypes.ts
    └── styles/
        └── game.css
```

---

# 31. 美术风格

## 31.1 第一版不用出图

第一版全部用 Phaser Graphics 绘制。

不要引用不存在的图片路径。

## 31.2 色彩方向

```text
深墨蓝：背景
淡金色：标题、金灵根、重要文字
青绿色：木灵根
淡蓝色：水灵根
橙红色：火灵根
土黄色：土灵根
浅灰白：云雾
青灰色：石阶、山门、地面
黑灰色：玩家、小怪、Boss
暗红色：Boss 攻击预警
```

## 31.3 不要的风格

```text
现代网页 UI
白色弹窗
高精仙侠页游
手游抽卡界面
Q 版卡通
现代街斗火柴人
科幻星空宇宙
```

## 31.4 要的风格

```text
水墨
云雾
悟道山
淡金
深墨蓝
修仙剪影
纸片感
低成本但统一
```

---

# 32. 开发阶段拆分

## Phase 1：项目初始化

目标：

```text
创建 Phaser + TypeScript + Vite 项目
能 npm install
能 npm run dev
显示游戏画布
```

验收：

```text
npm install 成功
npm run dev 成功
浏览器显示画布
控制台无报错
```

---

## Phase 2：标题 + 完整五问

目标：

```text
TitleScene
HeartTrialScene
完整 5 道问心题
每题 4 个选项
五问结果计算
HeartTrialResultScene
GameSession 保存结果
```

验收：

```text
标题显示“寻仙问道”
点击进入五问定心
能连续回答 5 道题
结果页显示主灵根、灵根品质、命格、体魄、五行攻击术、先天神通状态
结果保存到 GameSession
```

---

## Phase 3：降世 + 入世十六载

目标：

```text
DescentScene
PrologueScene
文言感过场文案
逐句淡入
前往仙门
```

验收：

```text
问心结果后进入过场
文案替换为文言感版本
“仙人抚顶，问汝长生”停留稍久
点击进入悟道山试炼
```

---

## Phase 4：悟道山试炼场 + 玩家移动 + HUD

目标：

```text
GateTrialScene
悟道山 Graphics 场景
Player 绘制
WASD 移动
鼠标控制方向
CombatHUD
SkillSlotHUD
灵根颜色表现
```

验收：

```text
玩家可移动
木棍朝向鼠标
玩家 Aura 根据主灵根变化
HUD 显示 HP / MP / Stamina
技能槽显示 Q 当前五行攻击术
E / F / 1 显示未觉醒或未获得
```

---

## Phase 5：基础战斗与五行攻击术

目标：

```text
轻击
重击
DamageHitbox
Q 五行基础攻击术
Space 闪避
R 回血
E / F / 1 未觉醒提示
```

验收：

```text
左键轻击消耗 stamina
右键重击消耗 stamina
Q 消耗 MP
Q 根据主灵根释放不同术法
Space 闪避消耗 stamina
R 回血减少次数
E / F / 1 显示未觉醒或未获得提示
```

---

## Phase 6：五行生克、环境亲和、元素状态

目标：

```text
ElementSystem
ElementReactionSystem
GateTrialEnvironment = Earth
Wet
Burning
Slowed
WoodBind
水 + 火 = 蒸汽
```

验收：

```text
五行相生相克有数据结构
悟道山环境为 Earth
土灵根 MP 恢复有加成
相生灵根有轻量恢复加成
水技能能施加 Wet
火技能能施加 Burning
Wet + Fire 能触发蒸汽额外伤害
```

---

## Phase 7：小怪教学

目标：

```text
EnemyTrialShadow
追踪
攻击
受击
死亡
元素属性
```

验收：

```text
小怪追踪玩家
小怪攻击玩家
小怪可被攻击打死
小怪能受到元素状态
死亡后消失
```

---

## Phase 8：悟道山试炼守卫 Boss

目标：

```text
BossWudaoGateGuardian
Boss 激活
红圈攻击
BossHUD
死亡胜利
```

验收：

```text
Boss 靠近激活
红圈预警后造成伤害
Boss 可被击败
击败后显示第一阶段结束文案
```

---

## Phase 9：打磨

目标：

```text
调整手感
调整 UI
调整数值
补 README
```

验收：

```text
3 分钟内可通关
控制台无报错
画面风格统一
README 写清楚运行方式
```

---

# 33. Codex 执行约束

给 Codex 执行时必须遵守：

```text
每次只做一个 Phase
每次修改前先列文件清单
不要一次性做完整游戏
不要创建 Unity 文件
不要引用不存在的图片路径
第一版视觉全部用 Graphics
不要把所有代码写进 main.ts
不要大范围重构无关文件
完成后列出新增 / 修改文件
完成后说明如何验收
```

禁止创建：

```text
.unity
.prefab
.asset
.meta
```

允许创建：

```text
.ts
.html
.css
.json
.md
```

---

# 34. 完整验收清单

## 34.1 启动验收

```text
npm install 成功
npm run dev 成功
浏览器打开游戏
控制台无严重报错
```

## 34.2 流程验收

```text
看到“寻仙问道”
点击进入五问定心
能完成 5 道问心题
结果页显示主灵根
结果页显示灵根品质
结果页显示命格
结果页显示体魄
结果页显示五行基础攻击术
结果页显示先天神通 / 辅助法术状态
进入天命降世
进入入世十六载
进入悟道山试炼
击败 Boss 后显示第一阶段结束文案
```

## 34.3 战斗验收

```text
WASD 能移动
鼠标控制木棍方向
左键轻击消耗耐力
右键重击消耗耐力
Q 五行攻击术消耗 MP
Space 闪避消耗耐力
R 能回血
stamina 不足不能攻击 / 闪避
MP 不足不能释放 Q
玩家死亡显示试炼失败
```

## 34.4 五行技能验收

```text
金灵根 Q = 金芒刺
木灵根 Q = 青藤击
水灵根 Q = 寒露刃
火灵根 Q = 火星诀
土灵根 Q = 碎土刺

金芒刺不是附魔
附魔不作为当前 Q 技能
E 是辅助法术 / 附魔 / 先天神通预留槽
```

## 34.5 灵根品质验收

```text
结果页显示灵根品质
天灵根可被计算和展示
纯灵根可被计算和展示
相生灵根可被计算和展示
五行中和可被计算和展示
驳杂灵根可被计算和展示
```

## 34.6 元素系统验收

```text
五行生克关系有数据结构
克制目标时伤害可获得轻量加成
被克制时受到伤害可有轻量惩罚
GateTrialEnvironment = Earth
环境亲和影响 MP 恢复
Wet 状态可用
Burning 状态可用
Wet + Fire 触发蒸汽反应
```

## 34.7 技能槽验收

```text
HUD 显示左键轻击
HUD 显示右键重击
HUD 显示 Q 当前五行攻击术
HUD 显示 E 辅助法术·未觉醒
HUD 显示 F 命格神通·未觉醒
HUD 显示 1 法宝·未获得
按 E 不报错并提示未觉醒
按 F 不报错并提示未觉醒
按 1 不报错并提示未获得
```

## 34.8 风格验收

```text
没有白色现代弹窗
没有手游抽卡界面
没有高精页游风
整体偏水墨、云雾、深墨蓝、淡金、剪影
角色是修仙剪影火柴人
场景表现为悟道山仙门试炼
过场文案是文言感版本
```

---

# 35. 后续扩展方向

## 35.1 第二阶段：入世大唐

预留内容：

```text
大唐地图
主线任务
散市
NPC
物资交换
修士交易
基础法术学习
任务奖励
```

## 35.2 第三阶段：散市与物资交换

预留：

```text
Inventory
Material
TradeItem
MarketScene
ExchangeRule
QuestReward
```

## 35.3 第四阶段：重走西游路

预留方向：

```text
大唐
取道路
妖魔
佛道
人道
因果选择
寻道证道
```

## 35.4 联网扩展

后续可做：

```text
云存档
散市异步交易
每日试炼
排行榜
世界事件
好友协助
多人幻境
```

当前不实现。

---

# 36. 第一阶段最终体验目标

玩家完整体验应该是：

```text
打开网页，看见“寻仙问道”。

点击开始。

进入五问定心。

连续回答五道问心题。

系统生成主灵根、灵根品质、命格、体魄、五行基础攻击术。

看到文言感过场：

汝本天外一缕命炁，未落尘寰。
五问定禅心，命书遂阖。
自此入世，托生凡尘。
十六载春秋，如山中一梦。
饥寒尝尽，离别亦知，唯掌中一木，朝夕不离。
是日，云开万仞，仙人抚顶，问汝长生。
山门在前，试炼已启。
凡骨未定，天命难凭。
踏过此门，方知大道几何。

来到悟道山。

操控修仙剪影火柴人移动。

用木棍轻击、重击击败小怪。

用 Q 释放当前灵根的五行基础攻击术。

看到 E / F / 1 等未觉醒技能槽，感受到后续成长空间。

闪避悟道山试炼守卫的红圈攻击。

击败守卫。

看到：

山门已开，仙途始行。

你已习得基础术法：{当前五行攻击术}。

此术，不过问道之始。

下一阶段：入世大唐。
```
