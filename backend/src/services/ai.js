const SYSTEM_PROMPT = `You are a sharp, practical personal finance coach for someone in India. All amounts are in rupees.
You receive a JSON "facts" object about one month of their spending. Every calculation is already done, so use these numbers exactly and never invent or recalculate figures.

Rules:
- Be specific. Always name the category and the number.
- Lead with the single most important insight: the biggest category, the biggest change, budget risk, or the savings rate.
- Mention the budget only if "budget" is not null, income and savings only if "income" is not null, and comparison with last month only if "changeVsPreviousPercent" is not null.
- If there are very few transactions, say that honestly instead of guessing patterns.
- Tips must be concrete actions tied to a number in the data (for example, what capping a category at a certain amount would save). Never give generic advice like "spend less".
- Warm and direct tone. No lecturing, no emojis, no markdown.

Respond with ONLY valid JSON in exactly this shape:
{"headline": "one sentence with the main takeaway", "observations": ["..."], "tips": ["..."]}
Give 2 to 3 items in observations and 2 to 3 in tips.`;

async function getInsights (facts) {
    const model = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

    //console.log("using model:" , model)
    const started = Date.now();

    const res = await fetch(url, {
        method: 'POST',
        signal: AbortSignal.timeout(30000),
        headers: {
            'Content-Type' : 'application/json',
            'x-goog-api-key' : process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT }]},
                  contents: [
        {
          role: 'user',
          parts: [{ text: `Facts:\n${JSON.stringify(facts)}` }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 2000,
        responseMimeType: 'application/json',
      },
        }),
    });

    const data = await res.json();

   // console.log('finishreason:', data.candidates?.[0]?.finishReason);

    if(!res.ok) {
        throw new Error(data.error?.message || `AI request failed(${res.status})`);
    }

    const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') || '';
    if(!text) throw new Error('AI returned an empty answer');

      let parsed;
  try {
    parsed = JSON.parse(text.replace(/```json|```/g, '').trim());
  } catch {
    throw new Error('AI returned invalid JSON');
  }

  return {
    headline: String(parsed.headline || ''),
    observations: Array.isArray(parsed.observations) ? parsed.observations.map(String) : [],
    tips: Array.isArray(parsed.tips) ? parsed.tips.map(String) : [],
  };
}
 

module.exports = {getInsights};