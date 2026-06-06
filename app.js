const form = document.getElementById('dreamForm');
const loading = document.getElementById('loading');
const output = document.getElementById('output');
const sampleBtn = document.getElementById('sampleBtn');
const copyBtn = document.getElementById('copyBtn');
const printBtn = document.getElementById('printBtn');
const askBtn = document.getElementById('askBtn');
const askInput = document.getElementById('askInput');
const answer = document.getElementById('answer');
let latestBlueprint = null;
let latestText = '';

document.querySelectorAll('.choice').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.choice').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
  });
});

document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => switchTab(tab.dataset.tab));
});

sampleBtn.addEventListener('click', () => {
  form.name.value = 'Mali';
  form.timeframe.value = '3 years';
  form.dream.value = 'A calm but impressive life: beautiful home, proper money, creative work, confidence, elegant clothes, strong family life, and a feeling that my days are not just rushed survival.';
  form.currentReality.value = 'Too many half-finished ideas, too much admin energy, not enough beauty, not enough clear direction, and a feeling that I want something big but do not know what it is yet.';
  form.constraints.value = 'Needs to be realistic, not cringe, not therapy-ish, not fake manifestation. Must respect family life, values, time, money and energy.';
  form.moreOf.value = 'beauty, confidence, money, calm, sophistication, creativity';
  form.lessOf.value = 'mess, rushing, boring ideas, vague goals, childish design';
  document.querySelector('#studio').scrollIntoView({ behavior: 'smooth' });
});

form.addEventListener('submit', async event => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  data.mode = document.querySelector('.choice.active')?.textContent.trim() || 'Elegant life design';
  data.sliders = {
    peace: form.peace.value,
    money: form.money.value,
    beauty: form.beauty.value,
    freedom: form.freedom.value
  };

  loading.classList.remove('hidden');
  output.classList.add('hidden');
  loading.scrollIntoView({ behavior: 'smooth' });

  try {
    const response = await fetch('/api/generate-dreamroom', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('AI endpoint failed');
    latestBlueprint = await response.json();
  } catch (error) {
    latestBlueprint = createFallbackBlueprint(data);
  }

  renderBlueprint(latestBlueprint);
  latestText = blueprintToText(latestBlueprint);
  loading.classList.add('hidden');
  output.classList.remove('hidden');
  output.scrollIntoView({ behavior: 'smooth' });
});

copyBtn.addEventListener('click', async () => {
  await navigator.clipboard.writeText(latestText);
  copyBtn.textContent = 'Copied';
  setTimeout(() => copyBtn.textContent = 'Copy', 1200);
});

printBtn.addEventListener('click', () => window.print());

askBtn.addEventListener('click', askBlueprint);
askInput.addEventListener('keydown', event => {
  if (event.key === 'Enter') askBlueprint();
});

async function askBlueprint() {
  const question = askInput.value.trim();
  if (!question || !latestBlueprint) return;
  answer.classList.remove('hidden');
  answer.textContent = 'Thinking...';
  try {
    const response = await fetch('/api/ask-dreamroom', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, blueprint: latestBlueprint })
    });
    if (!response.ok) throw new Error('Ask endpoint failed');
    const data = await response.json();
    answer.textContent = data.answer || 'I could not produce an answer.';
  } catch (error) {
    answer.textContent = localAnswer(question, latestBlueprint);
  }
}

function switchTab(name) {
  document.querySelectorAll('.tab').forEach(tab => tab.classList.toggle('active', tab.dataset.tab === name));
  document.querySelectorAll('.tab-content').forEach(panel => panel.classList.toggle('active', panel.id === name));
}

function renderBlueprint(b) {
  document.getElementById('blueprintTitle').textContent = b.title || 'DreamRoom Blueprint';
  document.getElementById('oneLine').textContent = b.oneLine || '';
  renderIdentity(b);
  renderGap(b);
  renderPaths(b);
  renderQuests(b);
  renderRooms(b);
  renderVisuals(b);
  switchTab('identity');
}

function renderIdentity(b) {
  const identity = b.futureIdentity || {};
  const scorecard = b.scorecard || [];
  document.getElementById('identity').innerHTML = `
    <div class="card-grid">
      <article class="card wide"><h3>${safe(identity.name || 'Future identity')}</h3><p>${safe(identity.description || '')}</p><div class="pill-list">${(identity.rules || []).map(rule => `<span class="pill">${safe(rule)}</span>`).join('')}</div></article>
      <article class="card"><h3>Signature shift</h3><p>${safe(identity.signatureShift || '')}</p></article>
      <article class="card"><h3>What this version refuses</h3><p>${safe(identity.refuses || '')}</p></article>
      <article class="card wide"><h3>Life dashboard</h3>${scorecard.map(item => `<div class="score"><strong>${safe(item.label)}</strong><div><div class="bar"><span style="width:${Math.max(4, Math.min(100, Number(item.future || 6) * 10))}%"></span></div><p>${safe(item.move || '')}</p></div></div>`).join('')}</article>
    </div>`;
}

function renderGap(b) {
  document.getElementById('gap').innerHTML = `<div class="card-grid">${(b.realityGap || []).map(item => `
    <article class="card"><h3>${safe(item.gap)}</h3><p><strong>Why it matters:</strong> ${safe(item.why)}</p><p><strong>Experiment:</strong> ${safe(item.experiment)}</p></article>
  `).join('')}</div>`;
}

function renderPaths(b) {
  document.getElementById('paths').innerHTML = `<div class="card-grid">${(b.pathSimulator || []).map(path => `
    <article class="card"><h3>${safe(path.name)}</h3><p>${safe(path.description)}</p><p><strong>Cost:</strong> ${safe(path.cost)}</p><p><strong>Payoff:</strong> ${safe(path.payoff)}</p><p><strong>First test:</strong> ${safe(path.firstTest)}</p></article>
  `).join('')}</div>`;
}

function renderQuests(b) {
  const q = b.questMap || {};
  document.getElementById('quests').innerHTML = `
    <div class="card-grid">
      ${questCard('Next 24 hours', q.next24)}
      ${questCard('Next 7 days', q.next7)}
      ${questCard('Next 30 days', q.next30)}
      <article class="card"><h3>Anti-plan</h3><ul>${(b.antiPlan || []).map(item => `<li>${safe(item)}</li>`).join('')}</ul></article>
    </div>`;
}

function questCard(title, items = []) {
  return `<article class="card"><h3>${safe(title)}</h3><ul>${items.map(item => `<li>${safe(item)}</li>`).join('')}</ul></article>`;
}

function renderRooms(b) {
  document.getElementById('rooms').innerHTML = `<div class="card-grid">${(b.rooms || []).map(room => `
    <article class="card"><h3>${safe(room.name)}</h3><p>${safe(room.scene)}</p><p><strong>Purpose:</strong> ${safe(room.purpose)}</p><p><strong>Rule:</strong> ${safe(room.rule)}</p><p><strong>Real move:</strong> ${safe(room.realMove)}</p></article>
  `).join('')}</div>`;
}

function renderVisuals(b) {
  const v = b.visualSystem || {};
  document.getElementById('visuals').innerHTML = `
    <div class="card-grid">
      <article class="card"><h3>Palette</h3><div class="pill-list">${(v.palette || []).map(x => `<span class="pill">${safe(x)}</span>`).join('')}</div></article>
      <article class="card"><h3>Materials and objects</h3><ul>${(v.materials || []).map(x => `<li>${safe(x)}</li>`).join('')}</ul></article>
      <article class="card wide"><h3>Image prompts</h3>${(v.imagePrompts || []).map(prompt => `<p>${safe(prompt)}</p>`).join('')}</article>
      <article class="card wide"><h3>Questions worth answering next</h3><ul>${(b.questions || []).map(x => `<li>${safe(x)}</li>`).join('')}</ul></article>
    </div>`;
}

function createFallbackBlueprint(input) {
  const name = input.name || 'you';
  const dream = input.dream || 'a calmer, richer, more beautiful life';
  const more = input.moreOf || 'beauty, clarity and strength';
  const less = input.lessOf || 'rushing, vagueness and tiny thinking';
  return {
    title: `${name}'s DreamRoom Blueprint`,
    oneLine: `A practical simulation for turning “${dream.slice(0, 120)}” into experiments, spaces and decisions you can test rather than merely imagine.`,
    futureIdentity: {
      name: 'The composed builder',
      description: `This version of ${name} does not wait to feel perfectly ready. She builds visible proof of the life she wants: more ${more}, less ${less}.`,
      rules: ['Make it visible', 'Test before committing', 'Choose beauty with function', 'Do one brave small thing weekly'],
      signatureShift: 'From vague wanting to designed experiments: every dream becomes a test, a space, a habit or a conversation.',
      refuses: `Anything that keeps the dream as a fantasy while daily life remains unchanged: ${less}.`
    },
    scorecard: [
      { label: 'Peace', future: input.sliders?.peace || 7, move: 'Reduce decisions by designing repeatable rituals.' },
      { label: 'Money', future: input.sliders?.money || 6, move: 'Attach the dream to one income experiment, not just aesthetics.' },
      { label: 'Beauty', future: input.sliders?.beauty || 9, move: 'Make one physical corner match the future identity.' },
      { label: 'Freedom', future: input.sliders?.freedom || 7, move: 'Create weekly protected time for the project/person you are becoming.' }
    ],
    realityGap: [
      { gap: 'The dream is too atmospheric', why: 'Atmosphere is motivating, but cannot be acted on until it becomes behaviour.', experiment: 'Translate the dream into three repeating rituals: morning, money, and space.' },
      { gap: 'The current life has no proof objects', why: 'Your brain believes what it sees repeatedly.', experiment: 'Create one small visible “future proof” object: a shelf, notebook, outfit, page, dashboard or corner.' },
      { gap: 'The ambition is not yet attached to a vehicle', why: 'Wanting more money or meaning needs a specific route.', experiment: 'Choose one 14-day income/creative experiment and measure whether it gives energy.' }
    ],
    pathSimulator: [
      { name: 'The elegant upgrade path', description: 'Improve the life you already have by redesigning routines, environment and personal standards.', cost: 'Less dramatic, slower dopamine.', payoff: 'Actually sustainable.', firstTest: 'Upgrade one repeated moment: morning, getting dressed, work setup or evening reset.' },
      { name: 'The ambitious build path', description: 'Pick one project and push it into public reality quickly.', cost: 'More exposure and possible embarrassment.', payoff: 'Real momentum and confidence.', firstTest: 'Publish a rough landing page or offer within 7 days.' },
      { name: 'The peace-first path', description: 'Prioritise nervous-system calm, fewer inputs and a slower baseline.', cost: 'You may fear becoming less impressive.', payoff: 'You stop building from panic.', firstTest: 'Delete or pause one source of noise for a week.' },
      { name: 'The wild-card path', description: 'Do the unexpected small thing that makes the whole dream feel alive.', cost: 'It may feel silly at first.', payoff: 'It breaks the boring pattern.', firstTest: 'Book, buy, make or visit one thing your future self would choose.' }
    ],
    questMap: {
      next24: ['Name the future identity in one sentence.', 'Clear one visible surface.', 'Choose one 20-minute slot for the first experiment.'],
      next7: ['Create a mini visual board with 12 images.', 'Run one money/creative experiment.', 'Make one conversation or decision that reduces vagueness.'],
      next30: ['Complete four weekly proof actions.', 'Track energy, confidence and results.', 'Decide which path deserves another 30 days.']
    },
    rooms: [
      { name: 'The Control Room', purpose: 'Turns vague longing into choices.', scene: 'A dark glass desk, warm light, and a dashboard with the few numbers that matter.', rule: 'Only track what changes behaviour.', realMove: 'Create a one-page dashboard for money, time, energy and project progress.' },
      { name: 'The Wardrobe Room', purpose: 'Makes identity visible.', scene: 'A rail of fewer, better pieces: composed, elegant, unmistakably intentional.', rule: 'Do not buy fantasy items for a life you refuse to schedule.', realMove: 'Define three style words and remove five items that contradict them.' },
      { name: 'The Money Room', purpose: 'Connects beauty to independence.', scene: 'A quiet, serious room where ideas are tested as offers, not daydreams.', rule: 'Every big dream needs an earning route or a budget route.', realMove: 'Write three possible ways this future could pay for itself.' },
      { name: 'The Home Room', purpose: 'Creates daily evidence.', scene: 'One corner feels complete: texture, light, order and an object chosen with taste.', rule: 'A future life must touch the current room.', realMove: 'Design one corner for under £30 or with what you already own.' },
      { name: 'The Road Room', purpose: 'Prevents perfectionism.', scene: 'A map with experiments instead of promises.', rule: 'Test for 14 days before redesigning your whole life.', realMove: 'Pick the first 14-day experiment today.' }
    ],
    visualSystem: {
      palette: ['ink plum', 'warm ivory', 'soft gold', 'smoked rose', 'glass blue'],
      materials: ['dark glass dashboard', 'linen notebook', 'brushed gold detail', 'warm lamp light', 'clean shelves'],
      imagePrompts: [
        'A cinematic luxury life-design studio, dark plum walls, warm ivory light, glass dashboard, elegant notebooks, soft gold accents, high-end editorial photography.',
        'A future-self wardrobe room with composed elegant clothing, warm lighting, quiet luxury, sophisticated but not flashy.',
        'A calm home corner transformed into a proof of future identity, warm textures, organised surfaces, meaningful objects, cinematic realism.'
      ]
    },
    antiPlan: ['Do not keep rewriting the dream instead of testing it.', 'Do not make the design prettier while the behaviour stays the same.', 'Do not choose ten goals; choose one proof action.'],
    questions: ['What would be impressive if it were real in 30 days?', 'What part of the dream needs money?', 'What does this future self do every week that current you avoids?']
  };
}

function localAnswer(question, b) {
  return `Based on your blueprint, answer this by turning it into an experiment, not a mood.\n\nQuestion: ${question}\n\nBest next move: choose one visible action from the 24-hour quest and complete it before expanding the plan. The strongest clue in this blueprint is the gap between wanting a sophisticated future and needing proof objects in the current life. Make one proof object today, then review whether it gave energy, confidence or clarity.`;
}

function blueprintToText(b) {
  return JSON.stringify(b, null, 2);
}

function safe(value) {
  return String(value ?? '').replace(/[&<>'"]/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#039;', '"':'&quot;' }[char]));
}
