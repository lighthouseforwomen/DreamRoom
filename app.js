const form = document.getElementById('dreamForm');
const loading = document.getElementById('loading');
const result = document.getElementById('result');
const roomsEl = document.getElementById('rooms');
let latestText = '';

const roomNames = ['The Morning Room','The Home Room','The Work Room','The People Room','The Wardrobe Room','The Table Room','The Garden Room','The Roadmap Room'];

document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => chip.classList.toggle('active'));
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  data.atmospheres = [...document.querySelectorAll('.chip.active')].map(chip => chip.textContent.trim());

  loading.classList.add('show');
  result.classList.remove('show');
  loading.scrollIntoView({ behavior: 'smooth' });

  try {
    const response = await fetch('/api/generate-dreamroom', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('AI endpoint failed');
    const dreamRoom = await response.json();
    renderDreamRoom(dreamRoom);
  } catch (error) {
    renderDreamRoom(createDemoDreamRoom(data));
  } finally {
    loading.classList.remove('show');
    result.classList.add('show');
    result.scrollIntoView({ behavior: 'smooth' });
  }
});

function renderDreamRoom(dreamRoom) {
  document.getElementById('resultTitle').textContent = dreamRoom.title || 'Welcome to your DreamRoom';
  document.getElementById('doorText').textContent = dreamRoom.door || '';
  document.getElementById('letter').textContent = dreamRoom.letter || '';
  document.getElementById('step').textContent = dreamRoom.doorwayStep || '';

  roomsEl.innerHTML = '';
  (dreamRoom.rooms || []).forEach((room, index) => {
    const card = document.createElement('article');
    card.className = 'room-card';
    card.innerHTML = `
      <span class="tag">Room ${index + 1}</span>
      <h3>${escapeHtml(room.name || roomNames[index] || 'A Room')}</h3>
      <p>${escapeHtml(room.sensory || '')}</p>
      <p><strong>What it reveals:</strong> ${escapeHtml(room.insight || '')}</p>
      <p><strong>Tiny step:</strong> ${escapeHtml(room.step || '')}</p>
    `;
    roomsEl.appendChild(card);
  });

  latestText = toPlainText(dreamRoom);
}

document.getElementById('copyBtn').addEventListener('click', async () => {
  await navigator.clipboard.writeText(latestText);
  document.getElementById('copyBtn').textContent = 'Copied';
  setTimeout(() => document.getElementById('copyBtn').textContent = 'Copy text', 1400);
});

document.getElementById('downloadBtn').addEventListener('click', () => window.print());

function createDemoDreamRoom(data) {
  const name = data.name || 'you';
  const atmosphere = (data.atmospheres || ['calm','beautiful']).join(', ').toLowerCase();
  const dream = data.dream || 'a life with more beauty, ease and meaning';
  const home = data.home || 'a home that feels warm, light and deeply yours';
  const purpose = data.purpose || 'work that uses your real gifts without swallowing your whole life';
  const people = data.people || 'people who make your nervous system feel safe';
  const behind = data.behind || 'the old pressure to rush, compare and prove yourself';
  return {
    title: `Welcome to your DreamRoom, ${name}`,
    door: `You stand before a warm ivory door with light moving underneath it. This is not a promise or a prediction. It is a room built from the direction your heart keeps pointing: ${dream}. The air is ${atmosphere}, and the handle is already in your hand.`,
    rooms: [
      { name:'The Morning Room', sensory:`Morning arrives softly here. The day begins without panic: light on the walls, a drink warming beside you, and a few quiet minutes before the world asks anything of you.`, insight:'You are craving a life that begins from steadiness, not scrambling.', step:'Choose one ten-minute morning ritual and protect it for three days.' },
      { name:'The Home Room', sensory:`This room carries the feeling of ${home}. Surfaces are clearer, colours are kinder, and ordinary objects have been chosen with care instead of panic-buying or compromise.`, insight:'Your surroundings matter because they change the way you feel inside your own life.', step:'Clear one visible surface and place one beautiful object there.' },
      { name:'The Work Room', sensory:`There is a desk, a window, and a sense of clean focus. Your work feels like ${purpose}. You are not pretending to be smaller than you are.`, insight:'You want work that is both useful and expressive.', step:'Write a one-sentence description of the work you would be proud to be known for.' },
      { name:'The People Room', sensory:`The room is full but not noisy. It holds ${people}. Conversations feel less like performance and more like belonging.`, insight:'You are dreaming not only of success, but of emotional safety.', step:'Send one warm message to someone who belongs in this future.' },
      { name:'The Wardrobe Room', sensory:'Soft fabrics, clean lines, a few signature pieces. You dress like someone who has stopped apologising for having taste.', insight:'Style here is not vanity; it is identity made visible.', step:'Choose three words for your future style and save them somewhere.' },
      { name:'The Table Room', sensory:'There is food, warmth, candlelight, laughter and the pleasure of making people feel held. The table is not perfect, but it is alive.', insight:'You want beauty that can be shared, not just admired.', step:'Plan one small meal, drink or treat that feels like your future life.' },
      { name:'The Garden Room', sensory:`Outside, the air is quieter. You leave behind ${behind}. There is room to breathe, walk, recover and become a person who does not live entirely on urgency.`, insight:'Peace is not laziness; it is the soil your next life grows from.', step:'Take a twenty-minute walk without multitasking.' },
      { name:'The Roadmap Room', sensory:`A map is laid open. It does not demand a dramatic reinvention. It asks for one small doorway, then another, then another.`, insight:'The future becomes real through tiny repeated choices.', step:'Pick one doorway step from this page and do it within 24 hours.' }
    ],
    letter:`Dear ${name},\n\nI am not as far away as you think. I arrived slowly, through tiny choices that looked ordinary at the time. You did not become this version of yourself by forcing a perfect life into existence. You became me by listening more carefully to what felt true, beautiful and strengthening.\n\nStart small. Make one corner calmer. Make one decision cleaner. Let one habit belong to the life you say you want. I am waiting for you in those little choices.\n\nWith love,\nYour future self`,
    doorwayStep:'Today, choose one small visible action that belongs to this future: clear a corner, write the sentence, send the message, take the walk, or begin the ritual.',
    mantra:'I can enter the future through one small doorway.'
  };
}

function toPlainText(d) {
  const rooms = (d.rooms || []).map((r,i) => `${i+1}. ${r.name}\n${r.sensory}\nWhat it reveals: ${r.insight}\nTiny step: ${r.step}`).join('\n\n');
  return `${d.title}\n\n${d.door}\n\n${rooms}\n\nA letter from future you\n${d.letter}\n\nDoorway step\n${d.doorwayStep}`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[char]));
}
