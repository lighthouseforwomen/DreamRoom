const OpenAI = require('openai');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });

  let body;
  try { body = JSON.parse(event.body || '{}'); } catch { return json(400, { error: 'Invalid JSON.' }); }

  const prompt = String(body.prompt || '').trim() || 'premium dreamroom visual concept';
  const palette = Array.isArray(body.palette) && body.palette.length ? body.palette : ['#2e1837', '#f8f2e8', '#e4c06a', '#c9889f', '#90c7d1'];

  if (!process.env.OPENAI_API_KEY) {
    return json(200, {
      image: makeSvgVisual(prompt, palette, 'Generated moodboard'),
      fallback: true,
      note: 'No API key found, so DreamRoom returned an instant generated moodboard instead.'
    });
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const model = process.env.OPENAI_IMAGE_MODEL || 'gpt-image-1';
  const finalPrompt = `${prompt}. Premium editorial moodboard, sophisticated visual design, no text, no logos, realistic lighting, polished composition.`;

  try {
    const result = await client.images.generate({
      model,
      prompt: finalPrompt,
      size: '1024x1024',
      n: 1
    });

    const image = result.data?.[0];
    const src = image?.b64_json ? `data:image/png;base64,${image.b64_json}` : image?.url;
    if (!src) throw new Error('No image returned.');
    return json(200, { image: src, prompt: finalPrompt, fallback: false });
  } catch (error) {
    return json(200, {
      image: makeSvgVisual(prompt, palette, 'AI image fallback'),
      prompt: finalPrompt,
      fallback: true,
      note: error.message || 'Image model failed, so DreamRoom returned an instant generated moodboard instead.'
    });
  }
};

function makeSvgVisual(prompt, palette, label) {
  const colours = normalisePalette(palette);
  const words = keywordLine(prompt);
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${colours[0]}"/>
        <stop offset="48%" stop-color="${colours[1]}"/>
        <stop offset="100%" stop-color="${colours[2]}"/>
      </linearGradient>
      <radialGradient id="glow" cx="50%" cy="35%" r="65%">
        <stop offset="0%" stop-color="${colours[3]}" stop-opacity="0.75"/>
        <stop offset="100%" stop-color="${colours[4]}" stop-opacity="0"/>
      </radialGradient>
      <filter id="soft"><feGaussianBlur stdDeviation="18"/></filter>
    </defs>
    <rect width="1200" height="1200" fill="url(#bg)"/>
    <rect width="1200" height="1200" fill="url(#glow)"/>
    <circle cx="1040" cy="140" r="230" fill="${colours[4]}" opacity="0.28" filter="url(#soft)"/>
    <circle cx="120" cy="1060" r="280" fill="${colours[3]}" opacity="0.28" filter="url(#soft)"/>

    <rect x="86" y="92" width="1028" height="1016" rx="54" fill="rgba(255,255,255,0.13)" stroke="rgba(255,255,255,0.32)"/>
    <rect x="136" y="150" width="430" height="570" rx="34" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.28)"/>
    <rect x="620" y="150" width="444" height="260" rx="34" fill="rgba(255,255,255,0.22)" stroke="rgba(255,255,255,0.3)"/>
    <rect x="620" y="460" width="444" height="260" rx="34" fill="rgba(255,255,255,0.16)" stroke="rgba(255,255,255,0.25)"/>
    <rect x="136" y="770" width="928" height="250" rx="34" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.25)"/>

    <circle cx="350" cy="330" r="142" fill="${colours[2]}" opacity="0.45"/>
    <circle cx="410" cy="390" r="105" fill="${colours[3]}" opacity="0.38"/>
    <rect x="208" y="540" width="276" height="90" rx="45" fill="rgba(255,255,255,0.35)"/>

    <text x="670" y="238" font-family="Georgia, serif" font-size="58" font-weight="700" fill="#fff8ef">DreamRoom</text>
    <text x="670" y="305" font-family="Arial, sans-serif" font-size="24" letter-spacing="5" fill="rgba(255,248,239,0.82)">${escapeXml(label.toUpperCase())}</text>

    <text x="670" y="540" font-family="Georgia, serif" font-size="40" font-weight="700" fill="#fff8ef">${escapeXml(words[0] || 'Visual World')}</text>
    <text x="670" y="596" font-family="Arial, sans-serif" font-size="25" fill="rgba(255,248,239,0.86)">${escapeXml(words[1] || 'future-self moodboard')}</text>
    <text x="670" y="642" font-family="Arial, sans-serif" font-size="25" fill="rgba(255,248,239,0.74)">${escapeXml(words[2] || 'palette · rooms · identity')}</text>

    ${colours.map((colour, index) => `<rect x="${188 + index * 172}" y="840" width="122" height="122" rx="28" fill="${colour}" stroke="rgba(255,255,255,0.55)"/>`).join('')}
    <text x="188" y="985" font-family="Arial, sans-serif" font-size="24" font-weight="700" fill="rgba(255,248,239,0.85)">palette / atmosphere / visual direction</text>
  </svg>`;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

function normalisePalette(palette) {
  const extracted = palette.map((item) => {
    if (typeof item === 'string') return item;
    return item?.hex || item?.colour || item?.color || '#cccccc';
  }).filter((value) => /^#[0-9a-fA-F]{6}$/.test(value));

  const fallback = ['#2e1837', '#f8f2e8', '#e4c06a', '#c9889f', '#90c7d1'];
  return [...extracted, ...fallback].slice(0, 5);
}

function keywordLine(prompt) {
  const clean = prompt.replace(/[^a-zA-Z0-9 ,.-]/g, '').split(',').map((part) => part.trim()).filter(Boolean);
  if (clean.length >= 3) return clean.slice(0, 3);
  const words = prompt.split(/\s+/).filter((word) => word.length > 3).slice(0, 9);
  return [words.slice(0, 3).join(' '), words.slice(3, 6).join(' '), words.slice(6, 9).join(' ')].filter(Boolean);
}

function escapeXml(value) {
  return String(value).replace(/[<>&'"]/g, (char) => ({
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    "'": '&apos;',
    '"': '&quot;'
  }[char]));
}

function json(statusCode, body) {
  return { statusCode, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
}
