const OpenAI = require('openai');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return json(500, { error: 'OPENAI_API_KEY is missing in Netlify environment variables.' });
  }

  let input;
  try {
    input = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { error: 'Invalid JSON body.' });
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini';

  const prompt = `Create a personalised DreamRoom experience from these answers.\n\nUser answers:\n${JSON.stringify(input, null, 2)}\n\nReturn ONLY valid JSON with this exact shape:\n{\n  "title": "Welcome to your DreamRoom, [name]",\n  "door": "A warm cinematic welcome paragraph. No fortune-telling.",\n  "rooms": [\n    {"name":"The Morning Room","sensory":"...","insight":"...","step":"..."},\n    {"name":"The Home Room","sensory":"...","insight":"...","step":"..."},\n    {"name":"The Work Room","sensory":"...","insight":"...","step":"..."},\n    {"name":"The People Room","sensory":"...","insight":"...","step":"..."},\n    {"name":"The Wardrobe Room","sensory":"...","insight":"...","step":"..."},\n    {"name":"The Table Room","sensory":"...","insight":"...","step":"..."},\n    {"name":"The Garden Room","sensory":"...","insight":"...","step":"..."},\n    {"name":"The Roadmap Room","sensory":"...","insight":"...","step":"..."}\n  ],\n  "letter": "A grounded letter from future self.",\n  "doorwayStep": "One small real action for this week.",\n  "mantra": "One elegant sentence."\n}\n\nTone: elegant, warm, cinematic, emotionally intelligent, hopeful, grounded, not cheesy. Avoid therapy language, clichés, guarantees, predictions, or anything that sounds like a medical/mental-health assessment.`;

  try {
    const completion = await client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: 'You are a refined creative product writer for DreamRoom. You return only valid JSON.' },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.9
    });

    const text = completion.choices?.[0]?.message?.content || '{}';
    const parsed = JSON.parse(text);
    return json(200, parsed);
  } catch (error) {
    return json(500, { error: 'AI generation failed', detail: error.message });
  }
};

function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  };
}
