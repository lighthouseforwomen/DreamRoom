const STORE = 'dreamroom_v3_saved';

const qs = (selector) => document.querySelector(selector);
const qsa = (selector) => Array.from(document.querySelectorAll(selector));

const form = qs('#dreamForm');
const output = qs('#output');
const loading = qs('#loading');
const savedList = qs('#savedList');
const savedCount = qs('#savedCount');
const compareCount = qs('#compareCount');

let savedVersions = loadSavedVersions();
let currentBlueprint = null;
let currentInput = null;
let compareIds = [];

init();

function init() {
  qs('#sampleBtn').addEventListener('click', loadSample);
  qs('#newBtn').addEventListener('click', startNew);
  form.addEventListener('submit', generateDreamRoom);
  qs('#saveBtn').addEventListener('click', saveCurrent);
  qs('#dupeBtn').addEventListener('click', duplicateCurrent);
  qs('#copyBtn').addEventListener('click', copyCurrent);
  qs('#printBtn').addEventListener('click', () => window.print());
  qs('#compareBtn').addEventListener('click', renderCompare);
  qs('#clearCompareBtn').addEventListener('click', clearCompare);
  qs('#askBtn').addEventListener('click', askDreamRoom);
  qs('#askInput').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') askDreamRoom();
  });

  qsa('.tabs button').forEach((button) => {
    button.addEventListener('click', () => switchTab(button.dataset.tab));
  });

  qsa('[data-remix]').forEach((button) => {
    button.addEventListener('click', () => remixDreamRoom(button.dataset.remix));
  });

  document.body.addEventListener('click', handleBodyClick);
  renderSavedList();
}

function loadSample() {
  form.name.value = 'Mali';
  form.versionName.value = 'Elegant Builder Me';
  form.timeframe.value = '3 years';
  form.mode.value = 'Ambitious upgrade';
  form.dream.value = 'A calm but impressive life: beautiful home, proper money, elegant style, strong family life, creative work, and a sense that my days are not just rushed survival.';
  form.currentReality.value = 'Too many half-finished ideas, too much messy admin energy, not enough beauty, not enough proof that I am moving towards something substantial.';
  form.constraints.value = 'Realistic, not cringe, not therapy-ish. Must respect family life, values, money, time and energy.';
  form.moreOf.value = 'beauty, confidence, money, calm, sophistication, creative momentum';
  form.lessOf.value = 'mess, rushing, vague goals, childish design, scattered effort';
  form.homeStyle.value = 'quiet luxury, warm modern, textured but uncluttered';
  form.workStyle.value = 'a real business or creative vehicle that can scale';
  qs('#studio').scrollIntoView({ behavior: 'smooth' });
}

function startNew() {
  form.reset();
  output.classList.add('hidden');
  qs('#comparePanel').classList.add('hidden');
  currentBlueprint = null;
  currentInput = null;
  qs('#studio').scrollIntoView({ behavior: 'smooth' });
}

async function generateDreamRoom(event) {
  event.preventDefault();
  currentInput = Object.fromEntries(new FormData(form).entries());
  currentInput.sliders = {
    peace: Number(form.peace.value || 7),
    money: Number(form.money.value || 6),
    beauty: Number(form.beauty.value || 9),
    freedom: Number(form.freedom.value || 7),
  };

  loading.classList.remove('hidden');
  output.classList.add('hidden');
  loading.scrollIntoView({ behavior: 'smooth' });

  try {
    const response = await fetch('/api/generate-dreamroom', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(currentInput),
    });
    if (!response.ok) throw new Error('DreamRoom AI endpoint failed');
    currentBlueprint = await response.json();
  } catch (error) {
    currentBlueprint = makeFallbackBlueprint(currentInput);
  }

  renderBlueprint(currentBlueprint);
  loading.classList.add('hidden');
  output.classList.remove('hidden');
  output.scrollIntoView({ behavior: 'smooth' });
}

function renderBlueprint(blueprint) {
  qs('#title').textContent = blueprint.title || 'DreamRoom';
  qs('#oneLine').textContent = blueprint.oneLine || '';
  renderIdentity(blueprint);
  renderVisuals(blueprint);
  renderRooms(blueprint);
  renderPlan(blueprint);
  switchTab('identity');
}

function renderIdentity(blueprint) {
  const identity = blueprint.futureIdentity || {};
  const scorecard = Array.isArray(blueprint.scorecard) ? blueprint.scorecard : [];

  qs('#identity').innerHTML = `
    <div class="grid">
      <article class="card wide">
        <h3>${safe(identity.name || 'Future identity')}</h3>
        <p>${safe(identity.description || '')}</p>
        <div class="pill-row">${listPills(identity.rules)}</div>
      </article>
      <article class="card"><h3>Signature shift</h3><p>${safe(identity.signatureShift || '')}</p></article>
      <article class="card"><h3>Refuses</h3><p>${safe(identity.refuses || '')}</p></article>
      <article class="card wide">
        <h3>Scorecard</h3>
        ${scorecard.map(renderScore).join('')}
      </article>
    </div>
  `;
}

function renderScore(item) {
  const value = Math.max(1, Math.min(10, Number(item.future || 6)));
  return `
    <div class="score">
      <b>${safe(item.label || 'Score')}</b>
      <div>
        <div class="bar"><span style="width:${value * 10}%"></span></div>
        <p>${safe(item.move || '')}</p>
      </div>
    </div>
  `;
}

function renderVisuals(blueprint) {
  const visual = blueprint.visualSystem || {};
  const boards = Array.isArray(blueprint.designBoards) ? blueprint.designBoards : [];
  const prompts = Array.isArray(visual.imagePrompts) ? visual.imagePrompts : [];

  qs('#visuals').innerHTML = `
    <div class="grid">
      <article class="card"><h3>Palette</h3><div class="palette">${renderPalette(visual.palette)}</div></article>
      <article class="card"><h3>Typography</h3><p>${safe(visual.typography || '')}</p></article>
      <article class="card wide"><h3>Materials / keywords</h3><div class="pill-row">${listPills([...(visual.materials || []), ...(visual.keywords || [])])}</div></article>
    </div>
    <h3>Visual design boards</h3>
    <div class="boards">${boards.map(renderBoard).join('')}</div>
    <article class="card wide"><h3>Image prompts</h3>${prompts.map((prompt) => `<p>${safe(prompt)}</p>`).join('')}</article>
  `;
}

function renderBoard(board, index) {
  const preview = Array.isArray(board.palettePreview) && board.palettePreview.length
    ? board.palettePreview.join(',')
    : '#8c7dff,#ff8faf,#f1c875';
  const prompt = board.moodPrompt || board.description || 'premium dreamroom visual concept';

  return `
    <article class="board" data-board-index="${index}">
      <div class="board-img" style="background:linear-gradient(135deg,${safe(preview)})">
        <div><span>${safe(board.name || 'Board')}</span><strong>${safe(board.headline || '')}</strong></div>
      </div>
      <div class="board-body">
        <p>${safe(board.description || '')}</p>
        <div class="pill-row">${listPills(board.elements)}</div>
        <button type="button" class="btn primary gen-img" data-prompt="${safe(prompt)}">Generate visual</button>
      </div>
    </article>
  `;
}

function renderRooms(blueprint) {
  const rooms = Array.isArray(blueprint.rooms) ? blueprint.rooms : [];
  qs('#rooms').innerHTML = `
    <div class="grid">
      ${rooms.map((room) => `
        <article class="card">
          <h3>${safe(room.name || 'Room')}</h3>
          <p>${safe(room.scene || '')}</p>
          <p><b>Purpose:</b> ${safe(room.purpose || '')}</p>
          <p><b>Rule:</b> ${safe(room.rule || '')}</p>
          <p><b>Real move:</b> ${safe(room.realMove || '')}</p>
        </article>
      `).join('')}
    </div>
  `;
}

function renderPlan(blueprint) {
  const quest = blueprint.questMap || {};
  const gaps = Array.isArray(blueprint.realityGap) ? blueprint.realityGap : [];

  qs('#plan').innerHTML = `
    <div class="grid">
      <article class="card"><h3>Next 24 hours</h3><ul>${listItems(quest.next24)}</ul></article>
      <article class="card"><h3>Next 7 days</h3><ul>${listItems(quest.next7)}</ul></article>
      <article class="card"><h3>Next 30 days</h3><ul>${listItems(quest.next30)}</ul></article>
      <article class="card"><h3>Anti-plan</h3><ul>${listItems(blueprint.antiPlan)}</ul></article>
      <article class="card wide">
        <h3>Reality gaps</h3>
        ${gaps.map((gap) => `<p><b>${safe(gap.gap || '')}</b><br>${safe(gap.why || '')}<br><em>${safe(gap.experiment || '')}</em></p>`).join('')}
      </article>
    </div>
  `;
}

async function handleBodyClick(event) {
  const visualButton = event.target.closest('.gen-img');
  if (visualButton) {
    await generateVisual(visualButton);
    return;
  }

  const openId = event.target.dataset.open;
  const duplicateId = event.target.dataset.dup;
  const deleteId = event.target.dataset.del;
  const checkId = event.target.dataset.check;

  if (openId) openSaved(openId);
  if (duplicateId) duplicateSaved(duplicateId);
  if (deleteId) deleteSaved(deleteId);
  if (checkId) toggleCompare(checkId, event.target.checked);
}

async function generateVisual(button) {
  const board = button.closest('.board');
  const prompt = button.dataset.prompt || 'premium dreamroom visual concept';
  const palette = (currentBlueprint && currentBlueprint.visualSystem && currentBlueprint.visualSystem.palette) || [];
  button.textContent = 'Generating...';
  button.disabled = true;

  try {
    const response = await fetch('/api/generate-visual', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, palette }),
    });
    const data = await response.json();
    if (!response.ok || !data.image) throw new Error(data.detail || data.error || 'Visual failed');

    const image = document.createElement('img');
    image.src = data.image;
    const visual = board.querySelector('.board-img');
    const oldImage = visual.querySelector('img');
    if (oldImage) oldImage.remove();
    visual.prepend(image);
    button.textContent = data.fallback ? 'Generated moodboard' : 'Regenerate visual';
  } catch (error) {
    const image = document.createElement('img');
    image.src = makeLocalVisual(prompt, palette);
    const visual = board.querySelector('.board-img');
    const oldImage = visual.querySelector('img');
    if (oldImage) oldImage.remove();
    visual.prepend(image);
    button.textContent = 'Generated moodboard';
    button.title = 'A local visual was generated because the image endpoint was unavailable.';
  } finally {
    button.disabled = false;
  }
}

function saveCurrent() {
  if (!currentBlueprint || !currentInput) return;
  const item = {
    id: makeId(),
    title: currentInput.versionName || currentBlueprint.title || 'Version',
    person: currentInput.name || 'Person',
    createdAt: new Date().toISOString(),
    input: currentInput,
    blueprint: currentBlueprint,
  };
  savedVersions.unshift(item);
  persistSavedVersions();
  renderSavedList();
  qs('#saveBtn').textContent = 'Saved';
  setTimeout(() => { qs('#saveBtn').textContent = 'Save'; }, 1200);
}

function duplicateCurrent() {
  if (!currentInput) return;
  patchForm(currentInput);
  form.versionName.value = `${currentInput.versionName || currentBlueprint.title || 'Version'} Copy`;
  qs('#studio').scrollIntoView({ behavior: 'smooth' });
}

async function copyCurrent() {
  if (!currentBlueprint) return;
  await navigator.clipboard.writeText(JSON.stringify(currentBlueprint, null, 2));
  qs('#copyBtn').textContent = 'Copied';
  setTimeout(() => { qs('#copyBtn').textContent = 'Copy'; }, 1200);
}

function renderSavedList() {
  savedCount.textContent = `${savedVersions.length} saved`;
  compareCount.textContent = `${compareIds.length}/2`;

  if (!savedVersions.length) {
    savedList.innerHTML = '<div class="empty">No saved people/versions yet.</div>';
    return;
  }

  savedList.innerHTML = savedVersions.map((item) => `
    <article class="saved">
      <div class="saved-row">
        <div><h4>${safe(item.title)}</h4><small>${safe(item.person)} · ${new Date(item.createdAt).toLocaleDateString()}</small></div>
        <label><input type="checkbox" data-check="${item.id}" ${compareIds.includes(item.id) ? 'checked' : ''}> compare</label>
      </div>
      <div class="saved-actions">
        <button type="button" class="tiny" data-open="${item.id}">Open</button>
        <button type="button" class="tiny" data-dup="${item.id}">Duplicate</button>
        <button type="button" class="tiny" data-del="${item.id}">Delete</button>
      </div>
    </article>
  `).join('');
}

function openSaved(id) {
  const item = savedVersions.find((version) => version.id === id);
  if (!item) return;
  currentInput = item.input;
  currentBlueprint = item.blueprint;
  patchForm(currentInput);
  renderBlueprint(currentBlueprint);
  output.classList.remove('hidden');
  output.scrollIntoView({ behavior: 'smooth' });
}

function duplicateSaved(id) {
  const item = savedVersions.find((version) => version.id === id);
  if (!item) return;
  patchForm(item.input);
  form.versionName.value = `${item.title} Copy`;
  qs('#studio').scrollIntoView({ behavior: 'smooth' });
}

function deleteSaved(id) {
  savedVersions = savedVersions.filter((version) => version.id !== id);
  compareIds = compareIds.filter((item) => item !== id);
  persistSavedVersions();
  renderSavedList();
}

function toggleCompare(id, checked) {
  if (checked) {
    if (!compareIds.includes(id) && compareIds.length < 2) compareIds.push(id);
    if (!compareIds.includes(id) && compareIds.length >= 2) alert('Choose only two versions to compare.');
  } else {
    compareIds = compareIds.filter((item) => item !== id);
  }
  renderSavedList();
}

function renderCompare() {
  if (compareIds.length !== 2) {
    alert('Select exactly two saved versions.');
    return;
  }
  const selected = compareIds.map((id) => savedVersions.find((version) => version.id === id)).filter(Boolean);
  qs('#compareGrid').innerHTML = selected.map((item) => {
    const blueprint = item.blueprint || {};
    const identity = blueprint.futureIdentity || {};
    const visual = blueprint.visualSystem || {};
    return `
      <article class="compare">
        <h3>${safe(item.title)}</h3>
        <p>${safe(blueprint.oneLine || '')}</p>
        ${compareBlock('Identity', identity.description)}
        ${compareBlock('First move', blueprint.questMap && blueprint.questMap.next24 ? blueprint.questMap.next24[0] : '')}
        ${compareBlock('Visual style', Array.isArray(visual.keywords) ? visual.keywords.join(', ') : '')}
        <div class="palette">${renderPalette(visual.palette)}</div>
      </article>
    `;
  }).join('');
  qs('#comparePanel').classList.remove('hidden');
  qs('#comparePanel').scrollIntoView({ behavior: 'smooth' });
}

function clearCompare() {
  compareIds = [];
  renderSavedList();
  qs('#comparePanel').classList.add('hidden');
}

async function remixDreamRoom(direction) {
  if (!currentBlueprint) return;
  const question = `Remix this version to be ${direction}. Keep it practical, visual and specific.`;
  await askWithQuestion(question, 'Remixing...');
  switchTab('ask');
}

async function askDreamRoom() {
  const question = qs('#askInput').value.trim();
  if (!question || !currentBlueprint) return;
  await askWithQuestion(question, 'Thinking...');
}

async function askWithQuestion(question, placeholder) {
  const answer = qs('#answer');
  answer.classList.remove('hidden');
  answer.textContent = placeholder;
  try {
    const response = await fetch('/api/ask-dreamroom', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, blueprint: currentBlueprint }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || data.error || 'Ask failed');
    answer.textContent = data.answer || '';
  } catch (error) {
    answer.textContent = 'Choose one proof action, one visual change and one real-world test. Then compare this version against a stricter alternative.';
  }
}

function switchTab(id) {
  qsa('.tabs button').forEach((button) => button.classList.toggle('active', button.dataset.tab === id));
  qsa('.tab').forEach((panel) => panel.classList.toggle('active', panel.id === id));
}

function patchForm(data) {
  Object.entries(data || {}).forEach(([key, value]) => {
    if (form[key] && typeof value !== 'object') form[key].value = value;
  });
  if (data && data.sliders) {
    Object.entries(data.sliders).forEach(([key, value]) => {
      if (form[key]) form[key].value = value;
    });
  }
}

function renderPalette(palette) {
  return (Array.isArray(palette) ? palette : []).map((colour) => {
    const name = typeof colour === 'string' ? colour : colour.name;
    const hex = typeof colour === 'string' ? colour : colour.hex;
    return `<div class="swatch"><i style="background:${safe(hex || '#cccccc')}"></i><span>${safe(name || 'Colour')}<small>${safe(hex || '')}</small></span></div>`;
  }).join('');
}

function listItems(items) {
  return (Array.isArray(items) ? items : []).map((item) => `<li>${safe(item)}</li>`).join('');
}

function listPills(items) {
  return (Array.isArray(items) ? items : []).map((item) => `<span class="pill">${safe(item)}</span>`).join('');
}

function compareBlock(label, value) {
  return `<div class="compare-block"><strong>${safe(label)}</strong><p>${safe(value || '')}</p></div>`;
}

function makeLocalVisual(prompt, palette) {
  const colours = normalisePalette(palette);
  const title = prompt.split(',')[0].slice(0, 34) || 'DreamRoom moodboard';
  const subtitle = prompt.split(',').slice(1, 3).join(' · ').slice(0, 58) || 'visual direction';
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1200" width="1200" height="1200">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${colours[0]}"/><stop offset="52%" stop-color="${colours[1]}"/><stop offset="100%" stop-color="${colours[2]}"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="1200" fill="url(#g)"/>
      <circle cx="1040" cy="160" r="260" fill="${colours[3]}" opacity="0.38"/>
      <circle cx="130" cy="1040" r="300" fill="${colours[4]}" opacity="0.32"/>
      <rect x="88" y="88" width="1024" height="1024" rx="58" fill="rgba(255,255,255,.14)" stroke="rgba(255,255,255,.36)"/>
      <rect x="150" y="160" width="425" height="580" rx="38" fill="rgba(255,255,255,.22)"/>
      <rect x="625" y="160" width="425" height="265" rx="38" fill="rgba(255,255,255,.2)"/>
      <rect x="625" y="475" width="425" height="265" rx="38" fill="rgba(255,255,255,.16)"/>
      <rect x="150" y="790" width="900" height="235" rx="38" fill="rgba(255,255,255,.14)"/>
      <text x="675" y="260" font-family="Georgia,serif" font-size="58" fill="#fff8ef" font-weight="700">${escapeSvg(title)}</text>
      <text x="675" y="326" font-family="Arial,sans-serif" font-size="26" fill="rgba(255,248,239,.82)">${escapeSvg(subtitle)}</text>
      ${colours.map((colour, index) => `<rect x="${205 + index * 160}" y="850" width="110" height="110" rx="28" fill="${colour}" stroke="rgba(255,255,255,.55)"/>`).join('')}
    </svg>`;
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
}

function normalisePalette(palette) {
  const fallback = ['#2e1837', '#f8f2e8', '#e4c06a', '#c9889f', '#90c7d1'];
  const extracted = (Array.isArray(palette) ? palette : []).map((item) => {
    if (typeof item === 'string') return item;
    return item.hex || item.color || item.colour;
  }).filter((value) => /^#[0-9a-fA-F]{6}$/.test(value));
  return [...extracted, ...fallback].slice(0, 5);
}

function escapeSvg(value) {
  return String(value).replace(/[<>&'"]/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[char]));
}

function loadSavedVersions() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORE) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function persistSavedVersions() {
  localStorage.setItem(STORE, JSON.stringify(savedVersions));
}

function makeId() {
  if (window.crypto && typeof window.crypto.randomUUID === 'function') return window.crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function safe(value) {
  return String(value ?? '').replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#039;',
    '"': '&quot;',
  }[char]));
}

function makeFallbackBlueprint(data) {
  const versionName = data.versionName || 'Dream Version';
  const name = data.name || 'You';
  const more = data.moreOf || 'beauty and clarity';
  const less = data.lessOf || 'mess and vagueness';
  return {
    title: `${versionName} — ${name}`,
    oneLine: `A saved, visual test version for ${data.dream || 'a better life'}.`,
    futureIdentity: {
      name: versionName,
      description: `This version wants more ${more} and less ${less}. It becomes real through visible proof, not endless imagining.`,
      rules: ['Make it visible', 'Test before committing', 'Compare alternatives', 'Do one proof action weekly'],
      signatureShift: 'From vague dream to saved, visual, testable version.',
      refuses: 'Pretty ideas with no real-world evidence.',
    },
    scorecard: [
      { label: 'Peace', future: data.sliders?.peace || 7, move: 'Design fewer decisions.' },
      { label: 'Money', future: data.sliders?.money || 6, move: 'Attach the dream to one earning route.' },
      { label: 'Beauty', future: data.sliders?.beauty || 9, move: 'Create one physical proof corner.' },
      { label: 'Freedom', future: data.sliders?.freedom || 7, move: 'Protect weekly build time.' },
    ],
    realityGap: [
      { gap: 'Not enough proof', why: 'Your real life needs visible evidence.', experiment: 'Create one proof object today.' },
      { gap: 'Too many possible lives', why: 'Comparison creates clarity.', experiment: 'Save two versions and compare.' },
      { gap: 'No vehicle yet', why: 'A dream needs a route.', experiment: 'Run one 14-day work or money test.' },
    ],
    questMap: {
      next24: ['Name the version', 'Save it', 'Make one proof object'],
      next7: ['Create a contrasting version', 'Compare them', 'Run one small test'],
      next30: ['Complete four proof actions', 'Keep the stronger version', 'Archive what feels fake'],
    },
    antiPlan: ['Do not keep redesigning without acting.', 'Do not save only one version.', 'Do not confuse pretty with true.'],
    rooms: [
      { name: 'Control Room', scene: 'A clean dashboard for decisions, money, time and direction.', purpose: 'Turns desire into structure.', rule: 'Track only what changes behaviour.', realMove: 'Create a one-page dashboard.' },
      { name: 'Home Board Room', scene: `A ${data.homeStyle || 'warm, elegant'} corner that already feels like the version.`, purpose: 'Makes the future visible.', rule: 'Use the current room as a prototype.', realMove: 'Style one corner.' },
      { name: 'Work Room', scene: `A work environment around ${data.workStyle || 'a scalable creative project'}.`, purpose: 'Connects the dream to a vehicle.', rule: 'Ideas must be tested.', realMove: 'List three possible vehicles.' },
    ],
    visualSystem: {
      palette: [
        { name: 'Ink Plum', hex: '#2e1837' },
        { name: 'Warm Ivory', hex: '#f8f2e8' },
        { name: 'Soft Gold', hex: '#e4c06a' },
        { name: 'Smoked Rose', hex: '#c9889f' },
        { name: 'Glass Blue', hex: '#90c7d1' },
      ],
      typography: 'Editorial serif headings with clean modern app structure.',
      keywords: ['quiet luxury', 'structured calm', 'visual proof', 'refined ambition'],
      materials: ['linen', 'brass', 'dark wood', 'glass', 'warm light'],
      imagePrompts: ['Premium life design studio, quiet luxury, cinematic editorial interior.', 'Elegant future home moodboard, warm neutral colours, refined and real.'],
    },
    designBoards: [
      { name: 'Home Board', headline: 'Quiet luxury you can live in', description: 'A calm physical space that proves this version is not imaginary.', elements: ['warm light', 'clear surfaces', 'linen', 'brass'], palettePreview: ['#2e1837', '#f8f2e8', '#e4c06a'], moodPrompt: 'quiet luxury home moodboard, warm light, linen, brass, editorial realism' },
      { name: 'Work Board', headline: 'A serious vehicle', description: 'A refined workspace for building money, skill and momentum.', elements: ['dashboard', 'notebook', 'strategy wall', 'clean desk'], palettePreview: ['#90c7d1', '#2e1837', '#c9889f'], moodPrompt: 'sophisticated creative workspace, dark plum, glass blue, clean strategy dashboard' },
      { name: 'Identity Board', headline: 'Composed and intentional', description: 'The visual feel of this version: style, posture, taste and standards.', elements: ['tailoring', 'restraint', 'signature detail', 'confidence'], palettePreview: ['#c9889f', '#e4c06a', '#f8f2e8'], moodPrompt: 'future self identity board, refined elegant wardrobe, quiet confidence, editorial' },
    ],
    questions: ['Which version would I actually live?', 'What makes this financially possible?', 'What proof object can I make today?'],
  };
}
