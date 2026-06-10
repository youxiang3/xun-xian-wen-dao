import type { HeartTrialQuestion } from '../types/GameTypes';

export const heartTrialQuestions: HeartTrialQuestion[] = [
  {
    id: 1,
    title: '第一问：不可为之事',
    content: '山外妖火焚村，长河横断。\n众人皆曰：此水不可渡，此事不可为。\n汝将何为？',
    options: [
      {
        key: 'A',
        text: '折枝为剑，先渡一步。',
        scores: { element: { Metal: 1 }, fate: { 逆命: 1 }, body: { 锋骨: 1 } },
      },
      {
        key: 'B',
        text: '先救眼前可救之人。',
        scores: { element: { Wood: 1 }, fate: { 济世: 1 }, body: { 灵脉: 1 } },
      },
      {
        key: 'C',
        text: '静观水势，待一线生机。',
        scores: { element: { Water: 1 }, fate: { 观势: 1 }, body: { 玄体: 1 } },
      },
      {
        key: 'D',
        text: '立土为界，护住身后之人。',
        scores: { element: { Earth: 1 }, fate: { 守心: 1 }, body: { 铁骨: 1 } },
      },
    ],
  },
  {
    id: 2,
    title: '第二问：妖与人',
    content: '荒寺夜雨，一幼妖伏于佛像之后。\n村人持火追至，皆言妖不可留。\n可它怀中，尚护着一个昏迷孩童。\n\n汝将何为？',
    options: [
      {
        key: 'A',
        text: '不问其形，先救孩童。',
        scores: { element: { Wood: 1 }, fate: { 济世: 1 }, body: { 灵脉: 1 } },
      },
      {
        key: 'B',
        text: '剑指幼妖，待其开口自证。',
        scores: { element: { Metal: 1 }, fate: { 逆命: 1 }, body: { 锋骨: 1 } },
      },
      {
        key: 'C',
        text: '熄众人之火，查明因果。',
        scores: { element: { Water: 1 }, fate: { 观势: 1 }, body: { 玄体: 1 } },
      },
      {
        key: 'D',
        text: '以火镇场，止众怒，亦止妖惊。',
        scores: { element: { Fire: 1 }, fate: { 烈心: 1 }, body: { 燃血: 1 } },
      },
    ],
  },
  {
    id: 3,
    title: '第三问：一法与众生',
    content: '山中有一卷残法，可助你踏入修行。\n然取此法，封印便破，山下百姓将遭妖患。\n若弃此法，你或许此生无缘仙门。\n\n汝将何为？',
    options: [
      {
        key: 'A',
        text: '弃法救人，道不在卷中。',
        scores: { element: { Wood: 1 }, fate: { 济世: 1 }, body: { 灵脉: 1 } },
      },
      {
        key: 'B',
        text: '取法破妖，以此法偿此因。',
        scores: { element: { Fire: 1 }, fate: { 烈心: 1 }, body: { 燃血: 1 } },
      },
      {
        key: 'C',
        text: '不取不弃，另寻封印之法。',
        scores: { element: { Water: 1 }, fate: { 观势: 1 }, body: { 玄体: 1 } },
      },
      {
        key: 'D',
        text: '守住封印，待有能者再来。',
        scores: { element: { Earth: 1 }, fate: { 守心: 1 }, body: { 铁骨: 1 } },
      },
    ],
  },
  {
    id: 4,
    title: '第四问：散市之争',
    content: '散市之中，一枚旧玉无人识得。\n你知其中藏有灵机，足以换你十年修行。\n摊主只是凡人，并不知其价。\n\n汝将何为？',
    options: [
      {
        key: 'A',
        text: '如实告知，以正价相换。',
        scores: { element: { Earth: 1 }, fate: { 守心: 1 }, body: { 铁骨: 1 } },
      },
      {
        key: 'B',
        text: '低价买下，日后十倍偿还。',
        scores: { element: { Metal: 1 }, fate: { 逆命: 1 }, body: { 锋骨: 1 } },
      },
      {
        key: 'C',
        text: '以其所需之物交换，不欺不夺。',
        scores: { element: { Wood: 1 }, fate: { 济世: 1 }, body: { 灵脉: 1 } },
      },
      {
        key: 'D',
        text: '借势竞价，让其自得高价。',
        scores: { element: { Water: 1 }, fate: { 观势: 1 }, body: { 玄体: 1 } },
      },
    ],
  },
  {
    id: 5,
    title: '第五问：所求之道',
    content: '悟道山前，云阶千重。\n有一老者问你：\n\n若此生可求一道，\n你究竟为何修行？',
    options: [
      {
        key: 'A',
        text: '为破尽不平，开一条无人敢行之路。',
        scores: { element: { Metal: 1 }, fate: { 逆命: 1 }, body: { 锋骨: 1 } },
      },
      {
        key: 'B',
        text: '为护眼前众生，不负人间烟火。',
        scores: { element: { Wood: 1 }, fate: { 济世: 1 }, body: { 灵脉: 1 } },
      },
      {
        key: 'C',
        text: '为观尽因果，寻天地真正之理。',
        scores: { element: { Water: 1 }, fate: { 观势: 1 }, body: { 玄体: 1 } },
      },
      {
        key: 'D',
        text: '为燃尽迷障，纵身入劫亦无悔。',
        scores: { element: { Fire: 1 }, fate: { 烈心: 1 }, body: { 燃血: 1 } },
      },
    ],
  },
];
