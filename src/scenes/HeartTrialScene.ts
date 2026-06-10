import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../gameConfig';
import { calculateHeartTrialResult } from '../data/ElementConfig';
import { heartTrialQuestions } from '../data/HeartTrialData';
import { setHeartTrialAnswers, setHeartTrialResult } from '../session/GameSession';
import type { HeartTrialAnswer, HeartTrialOption } from '../types/GameTypes';

export class HeartTrialScene extends Phaser.Scene {
  private currentQuestionIndex = 0;
  private answers: HeartTrialAnswer[] = [];
  private optionContainers: Phaser.GameObjects.Container[] = [];
  private optionZones: Phaser.GameObjects.Zone[] = [];
  private selectedOptionKey?: string;

  constructor() {
    super('HeartTrialScene');
  }

  create(): void {
    this.currentQuestionIndex = 0;
    this.answers = [];
    this.drawQuestion();
  }

  private drawQuestion(): void {
    this.clearSceneObjects();
    this.selectedOptionKey = undefined;

    const question = heartTrialQuestions[this.currentQuestionIndex];
    this.drawBackdrop();

    this.add
      .text(GAME_WIDTH / 2, 54, '五问定心', {
        fontSize: '42px',
        color: '#e8d28a',
        fontFamily: '"Microsoft YaHei", "Noto Sans SC", Arial, sans-serif',
        stroke: '#15120b',
        strokeThickness: 3,
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, 104, question.title, {
        fontSize: '22px',
        color: '#c8d2de',
        fontFamily: '"Microsoft YaHei", "Noto Sans SC", Arial, sans-serif',
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, 178, question.content, {
        fontSize: '21px',
        color: '#e4e8ee',
        fontFamily: '"Microsoft YaHei", "Noto Sans SC", Arial, sans-serif',
        align: 'center',
        lineSpacing: 8,
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH - 52, 40, `${this.currentQuestionIndex + 1}/5`, {
        fontSize: '18px',
        color: '#e8d28a',
        fontFamily: '"Microsoft YaHei", "Noto Sans SC", Arial, sans-serif',
      })
      .setOrigin(0.5);

    question.options.forEach((option, index) => {
      const x = index % 2 === 0 ? 292 : 668;
      const y = index < 2 ? 322 : 412;
      this.createCharmOption(x, y, option);
    });
  }

  private drawBackdrop(): void {
    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0x06101d, 0x0b1c31, 0x071525, 0x03070c, 1);
    graphics.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    graphics.fillStyle(0xffffff, 0.07);
    graphics.fillEllipse(160, 142, 300, 42);
    graphics.fillEllipse(755, 142, 360, 46);
    graphics.fillEllipse(480, 470, 620, 58);

    graphics.lineStyle(1, 0xe8d28a, 0.16);
    for (let radius = 132; radius <= 228; radius += 24) {
      graphics.strokeCircle(GAME_WIDTH / 2, 292, radius);
    }
  }

  private createCharmOption(x: number, y: number, option: HeartTrialOption): void {
    const container = this.add.container(x, y);
    const bg = this.add.graphics();
    bg.fillStyle(0xd7d2bd, 0.15);
    bg.lineStyle(2, 0xe8d28a, 0.52);
    bg.fillRoundedRect(-162, -30, 324, 60, 8);
    bg.strokeRoundedRect(-162, -30, 324, 60, 8);
    bg.lineStyle(1, 0xb8d7e9, 0.14);
    bg.lineBetween(-136, -17, 136, -17);
    bg.lineBetween(-136, 17, 136, 17);

    const label = this.add
      .text(0, 0, `${option.key}. ${option.text}`, {
        fontSize: '18px',
        color: '#e1d7ac',
        fontFamily: '"Microsoft YaHei", "Noto Sans SC", Arial, sans-serif',
        align: 'center',
        wordWrap: { width: 286 },
      })
      .setOrigin(0.5);

    container.add([bg, label]);
    this.optionContainers.push(container);

    const zone = this.add.zone(x, y, 324, 60).setOrigin(0.5).setInteractive({ useHandCursor: true });
    zone.on('pointerover', () => {
      if (!this.selectedOptionKey) container.setScale(1.03);
    });
    zone.on('pointerout', () => {
      if (!this.selectedOptionKey) container.setScale(1);
    });
    zone.on('pointerdown', () => this.chooseOption(option, container));
    this.optionZones.push(zone);
  }

  private chooseOption(option: HeartTrialOption, selectedContainer: Phaser.GameObjects.Container): void {
    if (this.selectedOptionKey) return;
    this.selectedOptionKey = option.key;
    this.answers.push({
      questionId: heartTrialQuestions[this.currentQuestionIndex].id,
      optionKey: option.key,
    });

    selectedContainer.setScale(1.05);
    this.tweens.add({
      targets: selectedContainer,
      alpha: 0.68,
      yoyo: true,
      repeat: 1,
      duration: 220,
    });

    this.optionContainers.forEach((container) => {
      if (container !== selectedContainer) {
        this.tweens.add({ targets: container, alpha: 0.28, duration: 180 });
      }
    });

    this.time.delayedCall(480, () => this.advanceQuestion());
  }

  private advanceQuestion(): void {
    this.currentQuestionIndex += 1;
    if (this.currentQuestionIndex >= heartTrialQuestions.length) {
      this.completeHeartTrial();
      return;
    }
    this.drawQuestion();
  }

  private completeHeartTrial(): void {
    setHeartTrialAnswers(this.answers);
    const result = calculateHeartTrialResult(this.answers);
    setHeartTrialResult(result);
    document.body.dataset.heartTrialAnswers = this.answers.map((answer) => answer.optionKey).join('');
    document.body.dataset.heartTrialResult = `${result.rootName}-${result.rootQualityName}-${result.fate}-${result.body}-${result.initialAttackSkillName}`;
    this.scene.start('HeartTrialResultScene');
  }

  private clearSceneObjects(): void {
    this.children.removeAll(true);
    this.optionContainers = [];
    this.optionZones = [];
  }
}
