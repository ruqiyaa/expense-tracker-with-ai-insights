require('dotenv').config();

async function main() {
  const started = Date.now();

  try {
    const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models?pageSize=100', {
      signal: AbortSignal.timeout(20000),
      headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY },
    });

    const data = await res.json();
    console.log('status:', res.status, '| took', Date.now() - started, 'ms');

    if (!res.ok) {
      console.log(data);
      return;
    }

    const names = data.models
      .filter((m) => m.supportedGenerationMethods?.includes('generateContent'))
      .map((m) => m.name.replace('models/', ''))
      .filter((n) => !/tts|image|live|audio|embedding|robotics/.test(n));

    console.log(names.join('\n'));
  } catch (err) {
    console.log('failed after', Date.now() - started, 'ms:', err.message);
  }
}

main();