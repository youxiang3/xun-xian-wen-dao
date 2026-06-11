import './styles/game.css';
import { Game } from './game/Game.js';

const root = document.querySelector('#game-root');

const FLOW_STATES = {
  title: 'title',
  heartQuestions: 'heartQuestions',
  heartResult: 'heartResult',
  heavenDescent: 'heavenDescent',
  sixteenYears: 'sixteenYears',
  mountainGate: 'mountainGate',
  combat: 'combat',
};

const ELEMENT_NAMES = {
  metal: '金',
  wood: '木',
  water: '水',
  fire: '火',
  earth: '土',
};

const state = {
  current: FLOW_STATES.title,
  heartData: null,
  answers: [],
  questionIndex: 0,
  result: null,
  gameStarted: false,
};

if (!root) {
  throw new Error('Missing #game-root');
}

const flowLayer = document.createElement('div');
flowLayer.className = 'flow-layer';
root.append(flowLayer);

renderState(FLOW_STATES.title);

function renderState(nextState) {
  state.current = nextState;

  if (nextState === FLOW_STATES.title) {
    renderTitle();
    return;
  }

  if (nextState === FLOW_STATES.heartQuestions) {
    renderHeartQuestions();
    return;
  }

  if (nextState === FLOW_STATES.heartResult) {
    state.result = calculateHeartResult();
    renderHeartResult();
    return;
  }

  if (nextState === FLOW_STATES.heavenDescent) {
    renderCutscene({
      eyebrow: '天命降世',
      title: '天命未明，魂入尘世。',
      lines: [
        '你自混沌问心中醒来，五行灵息在命魂深处留下第一道痕迹。',
      ],
      action: '入世十六载',
      nextState: FLOW_STATES.sixteenYears,
    });
    return;
  }

  if (nextState === FLOW_STATES.sixteenYears) {
    renderCutscene({
      eyebrow: '入世十六载',
      title: '十六载人间烟火，灵根未显，道心未明。',
      lines: [
        '直到悟道山开山试炼之日，你终于听见体内灵息回应。',
      ],
      action: '前往悟道山',
      nextState: FLOW_STATES.mountainGate,
    });
    return;
  }

  if (nextState === FLOW_STATES.mountainGate) {
    renderCutscene({
      eyebrow: '悟道山门',
      title: '山门之前，云雾如海。',
      lines: [
        '试炼影妖游荡于石阶之间，悟道山守卫的气息隐于门后。',
      ],
      action: '进入试炼',
      nextState: FLOW_STATES.combat,
    });
    return;
  }

  if (nextState === FLOW_STATES.combat) {
    enterCombat();
  }
}

function renderTitle() {
  flowLayer.hidden = false;
  flowLayer.className = 'flow-layer flow-layer-title';
  flowLayer.innerHTML = `
    <section class="flow-screen">
      <div class="flow-cloud cloud-a"></div>
      <div class="flow-cloud cloud-b"></div>
      <p class="flow-eyebrow">悟道山试炼</p>
      <h1>寻仙问道</h1>
      <p class="flow-subtitle">五问定心，入世寻道</p>
      <button class="flow-button" type="button">开始问心</button>
    </section>
  `;

  flowLayer.querySelector('button').addEventListener('click', () => {
    state.answers = [];
    state.questionIndex = 0;
    renderState(FLOW_STATES.heartQuestions);
  });
}

async function renderHeartQuestions() {
  flowLayer.hidden = false;
  flowLayer.className = 'flow-layer flow-layer-heart';

  if (!state.heartData) {
    renderLoading();

    try {
      state.heartData = await loadHeartQuestions();
    } catch (error) {
      renderError(error.message);
      return;
    }
  }

  const questions = state.heartData.questions;
  const question = questions[state.questionIndex];

  if (!question) {
    renderState(FLOW_STATES.heartResult);
    return;
  }

  const total = getTotalQuestions();
  flowLayer.innerHTML = `
    <section class="flow-screen heart-panel">
      <p class="flow-eyebrow">问心之${toChineseNumber(state.questionIndex + 1)} / ${total}</p>
      <h2>${escapeHtml(question.title || '问心定命')}</h2>
      <p class="heart-subtitle">${escapeHtml(question.subtitle || '')}</p>
      <p class="heart-question">${escapeHtml(question.questionText || '')}</p>
      <div class="heart-options">
        ${question.options.map((option) => `
          <button class="heart-option" type="button" data-option-id="${escapeHtml(option.id)}">
            <strong>${escapeHtml(option.id)}.</strong>
            <span>${escapeHtml(option.text || '')}</span>
          </button>
        `).join('')}
      </div>
    </section>
  `;

  flowLayer.querySelectorAll('.heart-option').forEach((button) => {
    button.addEventListener('click', () => {
      const selectedOption = question.options.find((option) => option.id === button.dataset.optionId);
      if (!selectedOption) return;

      state.answers.push({
        question,
        option: selectedOption,
      });
      state.questionIndex += 1;

      renderState(state.questionIndex >= questions.length ? FLOW_STATES.heartResult : FLOW_STATES.heartQuestions);
    }, { once: true });
  });
}

function renderHeartResult() {
  const result = state.result || calculateHeartResult();

  flowLayer.hidden = false;
  flowLayer.className = 'flow-layer flow-layer-result';
  flowLayer.innerHTML = `
    <section class="flow-screen result-card">
      <p class="flow-eyebrow">问心结果</p>
      <h2>命书已阖</h2>
      <div class="result-grid">
        <span>主灵根</span><strong>${escapeHtml(result.rootName)}</strong>
        <span>灵根品质</span><strong>${escapeHtml(result.rootQuality)}</strong>
        <span>命格</span><strong>${escapeHtml(result.fate)}</strong>
        <span>体魄</span><strong>${escapeHtml(result.body)}</strong>
        <span>初始术法</span><strong>${escapeHtml(result.initialSpell)}</strong>
      </div>
      <button class="flow-button" type="button">天命降世</button>
    </section>
  `;

  flowLayer.querySelector('button').addEventListener('click', () => {
    renderState(FLOW_STATES.heavenDescent);
  }, { once: true });
}

function renderCutscene({ eyebrow, title, lines, action, nextState }) {
  flowLayer.hidden = false;
  flowLayer.className = 'flow-layer flow-layer-cutscene';
  flowLayer.innerHTML = `
    <section class="flow-screen cutscene-panel">
      <div class="flow-cloud cloud-a"></div>
      <div class="flow-cloud cloud-b"></div>
      <p class="flow-eyebrow">${escapeHtml(eyebrow)}</p>
      <h2>${escapeHtml(title)}</h2>
      ${lines.map((line) => `<p class="cutscene-line">${escapeHtml(line)}</p>`).join('')}
      <button class="flow-button" type="button">${escapeHtml(action)}</button>
    </section>
  `;

  flowLayer.querySelector('button').addEventListener('click', () => {
    renderState(nextState);
  }, { once: true });
}

function renderLoading() {
  flowLayer.innerHTML = `
    <section class="flow-screen">
      <p class="flow-eyebrow">问心定命</p>
      <h2>五问配置载入中</h2>
    </section>
  `;
}

function renderError(message) {
  flowLayer.className = 'flow-layer flow-layer-error';
  flowLayer.innerHTML = `
    <section class="flow-screen error-panel">
      <p class="flow-eyebrow">配置异常</p>
      <h2>五问配置加载失败</h2>
      <p>${escapeHtml(message || '五问配置加载失败，请检查 /assets/data/heartQuestions.json')}</p>
    </section>
  `;
}

async function loadHeartQuestions() {
  const response = await fetch('/assets/data/heartQuestions.json');

  if (!response.ok) {
    throw new Error('五问配置加载失败，请检查 /assets/data/heartQuestions.json');
  }

  const data = await response.json();
  validateHeartQuestions(data);
  return data;
}

function validateHeartQuestions(data) {
  if (!data || !Array.isArray(data.questions) || data.questions.length === 0) {
    throw new Error('五问配置结构不完整：缺少 questions');
  }

  if (!data.spells || typeof data.spells !== 'object') {
    throw new Error('五问配置结构不完整：缺少 spells');
  }

  data.questions.forEach((question, index) => {
    if (!question || !Array.isArray(question.options) || question.options.length === 0) {
      throw new Error(`五问配置结构不完整：第 ${index + 1} 问缺少 options`);
    }
  });
}

function calculateHeartResult() {
  const primaryAnswer = state.answers.find(({ question }) => Number(question.order) === 2) || state.answers[1] || state.answers[0];
  const primaryElement = primaryAnswer?.option?.element || 'metal';
  const elementName = ELEMENT_NAMES[primaryElement] || primaryElement || '未定';
  const rootName = `${elementName}灵根`;
  const rootQuality = state.heartData?.rootQualities?.mixed || '未定';
  const initialSpell = state.heartData?.spells?.[primaryElement]?.name || '未定';

  return {
    primaryElement,
    rootName,
    rootQuality,
    fate: mostFrequent(state.answers.map(({ option }) => option.fate).filter(Boolean)) || '未定',
    body: mostFrequent(state.answers.map(({ option }) => option.body).filter(Boolean)) || '未定',
    initialSpell,
  };
}

function mostFrequent(values) {
  const counts = new Map();
  values.forEach((value) => counts.set(value, (counts.get(value) || 0) + 1));
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
}

function getTotalQuestions() {
  return state.heartData?.flow?.totalQuestions || state.heartData?.questions?.length || 5;
}

function toChineseNumber(value) {
  return ['零', '一', '二', '三', '四', '五'][value] || String(value);
}

function enterCombat() {
  flowLayer.hidden = true;
  flowLayer.innerHTML = '';
  flowLayer.style.pointerEvents = 'none';
  startCombatDemo();
}

function startCombatDemo() {
  if (state.gameStarted) return;
  state.gameStarted = true;

  const game = new Game(root);
  game.start();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
