const OpenAI = require('openai');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });
  if (!process.env.OPENAI_API_KEY) return json(500, { error: 'OPENAI_API_KEY is missing.' });

  let body;
  try { body = JSON.parse(event.body || '{}'); } catch { return json(400, { error: 'Invalid JSON.' }); }
  const prompt = String(body.prompt || '').trim();
  if (!prompt) return json(400, { error: 'Prompt is required.' });

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
    return json(200, { image: src, prompt: finalPrompt });
  } catch (error) {
    return json(500, { error: 'Visual generation failed', detail: error.message });
  }
};

function json(statusCode, body) {
  return { statusCode, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
}
