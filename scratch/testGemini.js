import 'dotenv/config';

const apiKeys = process.env.GEMINI_API_KEYS 
  ? process.env.GEMINI_API_KEYS.split(',').map(key => key.trim()).filter(Boolean)
  : [];

if (apiKeys.length === 0) {
  console.error("No API Keys found in .env");
  process.exit(1);
}

const key = apiKeys[0];
console.log(`Using API Key: ${key.slice(0, 10)}...`);

async function test(length) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${key}`;
  
  const prompt = `You are an expert social media strategist and professional copywriter.
Generate exactly 3 distinct, high-converting, engaging Instagram captions for a post based on these details:
- Topic / Description: "A cozy morning with a cup of coffee"
- Tone of Voice: "Casual"
- Length: "${length}" (Short = 1 sentence hook, Medium = 2-3 sentences with line breaks, Long = 4+ sentences/storytelling layout with line breaks and paragraph spacing)
- Include Emojis: Yes
- Include Hashtags: Yes

Return the output as a valid JSON array of strings containing exactly 3 entries.`;

  console.log(`\n--- Testing Length: ${length} ---`);
  
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' }
      })
    });

    const status = res.status;
    const data = await res.json();

    if (res.ok) {
      console.log(`Success (HTTP ${status})! Response text preview:`);
      console.log(data.candidates?.[0]?.content?.parts?.[0]?.text?.slice(0, 150));
    } else {
      console.error(`Failed (HTTP ${status})! Error message:`);
      console.error(JSON.stringify(data.error || data));
    }
  } catch (err) {
    console.error("Fetch failed:", err.message);
  }
}

async function run() {
  await test('Medium');
  // Wait 3 seconds to avoid rate limits
  await new Promise(resolve => setTimeout(resolve, 3000));
  await test('Short');
  // Wait 3 seconds
  await new Promise(resolve => setTimeout(resolve, 3000));
  await test('Long');
}

run();
