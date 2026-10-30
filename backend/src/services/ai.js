const SYSTEM_PROMPT = `You are a friendly, practical personal finance coach.
You get a person's spending summary for one month, plus the previous month for comparison.
Reply with:
1. One sentence overview.
2. Up to 3 specific observations that use the actual numbers (for example, changes versus last month).
3. Up to 3 short, realistic tips.
Keep it under 200 words. Be encouraging, not judgmental. Use plain text, no markdown.
Amounts are in rupees. Only use the data provided. Do not invent numbers.`;


async function getInsights (current, previous) {
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
            contents : [
                {
                    role: 'user',
                    parts: [
                        {
                            text: `This month:\n${JSON.stringify(current)}\n\nPrevious month:\n${JSON.stringify(previous)}`,
                        }
                    ]
                }
            ],
            generationConfig: {
                maxOutputTokens: 2000,
                thinkingConfig: { thinkingBudget: 0 },
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
    return text;
}

module.exports = {getInsights};