require('dotenv').config();

async function main() {
  const model = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const started = Date.now();

  console.log('model:', model, '| key loaded:', !!process.env.GEMINI_API_KEY);

  try {
    const res = await fetch(url, {
      method: 'POST',
      signal: AbortSignal.timeout(60000),
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': process.env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: 'Say hello in five words.' }] }],
        generationConfig: { maxOutputTokens: 200 },
      }),
    });

    const data = await res.json();
    console.log('status:', res.status, '| took', Date.now() - started, 'ms');
    console.log(JSON.stringify(data).slice(0, 500));
  } catch (err) {
    console.log('failed after', Date.now() - started, 'ms:', err.message);
  }
}

main();