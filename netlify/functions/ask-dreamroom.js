const OpenAI = require('openai');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });
  if (!process.env.OPENAI_API_KEY) return json(500, { error: 'OPENAI_API_KEY is missing in Netlify environment variables.' });

  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch { return json(400, { error: 'Invalid JSON body.' }); }

  const question = String(body.question || '').trim();
  const blueprint = body.blueprint || {};
  if (!question) return json(400, { error: 'Question is required.' });

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini';

  const prompt = `The user is asking a follow-up question about this DreamRoom Studio blueprint.\n\nBlueprint:\n${JSON.stringify(blueprint, null, 2)}\n\nQuestion:\n${question}\n\nAnswer as a sharp, practical creative strategist. Be specific and useful. Do not sound like therapy, fortune telling, or generic motivation. Give concrete next steps or refinements. Keep it under 350 words unless the question asks for more.`;

  try {
    const completion = await client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: 'You are DreamRoom Studio: a sophisticated creative life-design strategist. No therapy/medical/financial advice. Practical, direct, specific.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.75
    });
    return json(200, { answer: completion.choices?.[0]?.message?.content || '' });
  } catch (error) {
    return json(500, { error: 'AI follow-up failed', detail: error.message });
  }
};

function json(statusCode, body) {
  return { statusCode, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
}
