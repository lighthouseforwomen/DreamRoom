const OpenAI = require('openai');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });
  if (!process.env.OPENAI_API_KEY) return json(500, { error: 'OPENAI_API_KEY is missing.' });
  let input;
  try { input = JSON.parse(event.body || '{}'); } catch { return json(400, { error: 'Invalid JSON.' }); }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini';
  const prompt = `You are DreamRoom Lab v3: a visual life-design product. Create a sophisticated, practical, premium-feeling JSON blueprint for a possible life/version/persona. It must be useful as a saved app object, not a motivational essay.

User input:\n${JSON.stringify(input, null, 2)}

Return ONLY valid JSON with this exact shape:
{
  "title":"string",
  "oneLine":"string",
  "futureIdentity":{"name":"string","description":"string","rules":["string","string","string","string"],"signatureShift":"string","refuses":"string"},
  "scorecard":[{"label":"Peace","future":8,"move":"string"},{"label":"Money","future":7,"move":"string"},{"label":"Beauty","future":9,"move":"string"},{"label":"Freedom","future":7,"move":"string"}],
  "realityGap":[{"gap":"string","why":"string","experiment":"string"},{"gap":"string","why":"string","experiment":"string"},{"gap":"string","why":"string","experiment":"string"}],
  "pathSimulator":[{"name":"string","description":"string","cost":"string","payoff":"string","firstTest":"string"},{"name":"string","description":"string","cost":"string","payoff":"string","firstTest":"string"},{"name":"string","description":"string","cost":"string","payoff":"string","firstTest":"string"}],
  "questMap":{"next24":["string","string","string"],"next7":["string","string","string"],"next30":["string","string","string"]},
  "rooms":[{"name":"string","purpose":"string","scene":"string","rule":"string","realMove":"string"},{"name":"string","purpose":"string","scene":"string","rule":"string","realMove":"string"},{"name":"string","purpose":"string","scene":"string","rule":"string","realMove":"string"}],
  "visualSystem":{"palette":[{"name":"string","hex":"#112233"},{"name":"string","hex":"#445566"},{"name":"string","hex":"#778899"},{"name":"string","hex":"#AABBCC"},{"name":"string","hex":"#DDEEFF"}],"typography":"string","keywords":["string","string","string","string"],"materials":["string","string","string","string"],"imagePrompts":["string","string"]},
  "designBoards":[{"name":"Home Board","headline":"string","description":"string","elements":["string","string","string","string"],"palettePreview":["#112233","#445566","#778899"],"moodPrompt":"string"},{"name":"Work Board","headline":"string","description":"string","elements":["string","string","string","string"],"palettePreview":["#112233","#445566","#778899"],"moodPrompt":"string"},{"name":"Identity Board","headline":"string","description":"string","elements":["string","string","string","string"],"palettePreview":["#112233","#445566","#778899"],"moodPrompt":"string"}],
  "antiPlan":["string","string","string"],
  "questions":["string","string","string"]
}

Rules: Be specific, stylish, non-cringe, practical and a little editorial. Do not use therapy language, manifestation language, or generic motivation. Do not claim to predict the future. Think like a premium strategist and visual director.`;

  try {
    const completion = await client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: 'Return only valid JSON. Be premium, useful, specific and visual. No therapy, medical, legal or financial advice.' },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.82
    });
    return json(200, JSON.parse(completion.choices?.[0]?.message?.content || '{}'));
  } catch (error) {
    return json(500, { error: 'AI generation failed', detail: error.message });
  }
};

function json(statusCode, body) {
  return { statusCode, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
}
