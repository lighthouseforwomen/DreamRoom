const OpenAI = require('openai');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });
  if (!process.env.OPENAI_API_KEY) return json(500, { error: 'OPENAI_API_KEY is missing in Netlify environment variables.' });

  let input;
  try { input = JSON.parse(event.body || '{}'); }
  catch { return json(400, { error: 'Invalid JSON body.' }); }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini';

  const prompt = `You are creating a serious DreamRoom Studio blueprint. This is NOT therapy, NOT manifestation, NOT fortune telling, and NOT generic motivation. It is a creative life-design simulation that turns a dream into testable experiments and a sophisticated visual world.\n\nUser input:\n${JSON.stringify(input, null, 2)}\n\nReturn ONLY valid JSON with exactly these top-level keys:\n{\n  "title": "string",\n  "oneLine": "string",\n  "futureIdentity": {\n    "name": "string",\n    "description": "string",\n    "rules": ["string", "string", "string", "string"],\n    "signatureShift": "string",\n    "refuses": "string"\n  },\n  "scorecard": [\n    {"label":"Peace","future":8,"move":"string"},\n    {"label":"Money","future":7,"move":"string"},\n    {"label":"Beauty","future":9,"move":"string"},\n    {"label":"Freedom","future":7,"move":"string"}\n  ],\n  "realityGap": [\n    {"gap":"string","why":"string","experiment":"string"},\n    {"gap":"string","why":"string","experiment":"string"},\n    {"gap":"string","why":"string","experiment":"string"}\n  ],\n  "pathSimulator": [\n    {"name":"string","description":"string","cost":"string","payoff":"string","firstTest":"string"},\n    {"name":"string","description":"string","cost":"string","payoff":"string","firstTest":"string"},\n    {"name":"string","description":"string","cost":"string","payoff":"string","firstTest":"string"},\n    {"name":"string","description":"string","cost":"string","payoff":"string","firstTest":"string"}\n  ],\n  "questMap": {\n    "next24": ["string", "string", "string"],\n    "next7": ["string", "string", "string"],\n    "next30": ["string", "string", "string"]\n  },\n  "rooms": [\n    {"name":"string","purpose":"string","scene":"string","rule":"string","realMove":"string"},\n    {"name":"string","purpose":"string","scene":"string","rule":"string","realMove":"string"},\n    {"name":"string","purpose":"string","scene":"string","rule":"string","realMove":"string"},\n    {"name":"string","purpose":"string","scene":"string","rule":"string","realMove":"string"},\n    {"name":"string","purpose":"string","scene":"string","rule":"string","realMove":"string"}\n  ],\n  "visualSystem": {\n    "palette": ["string", "string", "string", "string", "string"],\n    "materials": ["string", "string", "string", "string", "string"],\n    "imagePrompts": ["string", "string", "string"]\n  },\n  "antiPlan": ["string", "string", "string"],\n  "questions": ["string", "string", "string"]\n}\n\nMake it specific to the user. Be direct, sophisticated, useful, surprising, slightly editorial, and practical. Avoid phrases like "embrace your journey", "manifest", "your dreams await", "unlock your potential", and other cringe clichés.`;

  try {
    const completion = await client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: 'Return only valid JSON. Be specific, sophisticated, practical and creative. Do not give therapy/medical/financial advice.' },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.82
    });
    const parsed = JSON.parse(completion.choices?.[0]?.message?.content || '{}');
    return json(200, parsed);
  } catch (error) {
    return json(500, { error: 'AI generation failed', detail: error.message });
  }
};

function json(statusCode, body) {
  return { statusCode, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
}
