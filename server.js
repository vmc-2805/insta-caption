import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Define __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS and JSON parsing (increase limit to 10mb for base64 image uploads)
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Load Gemini API Keys from .env
// Example: GEMINI_API_KEYS=key1,key2,key3
const apiKeys = process.env.GEMINI_API_KEYS 
  ? process.env.GEMINI_API_KEYS.split(',').map(key => key.trim()).filter(Boolean)
  : [];

// Pointer to keep track of the current working API key index
let currentKeyIndex = 0;

// Gemini model is configurable via env (GEMINI_MODEL), falls back to gemini-3.5-flash
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.5-flash';

console.log(`[Gemini Rotator] Loaded ${apiKeys.length} API keys from environment.`);
if (apiKeys.length === 0) {
  console.warn('[Gemini Rotator] WARNING: No API keys configured in GEMINI_API_KEYS inside your .env file.');
}

/**
 * Calls the Gemini API with automatic key rotation on failure.
 * Loops through the keys array. If one fails, it rotates to the next and retries.
 * Supports Multimodal parts.
 * 
 * @param {string} prompt - Prompt to send to Gemini
 * @param {string} [image] - Optional base64 image data string
 * @returns {Promise<string>} Raw response string from Gemini
 */
async function generateContentWithRotation(prompt, image) {
  if (apiKeys.length === 0) {
    throw new Error("No Gemini API Keys are configured on the server. Please add GEMINI_API_KEYS in your .env file.");
  }

  let attempts = 0;
  // Try up to the total number of keys available
  while (attempts < apiKeys.length) {
    const apiKey = apiKeys[currentKeyIndex];
    console.log(`[Gemini Rotator] Attempting request using Key Index ${currentKeyIndex} (Attempt ${attempts + 1}/${apiKeys.length})...`);

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
    
    // Prepare multimodal parts payload
    const parts = [];
    
    if (image) {
      const matches = image.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.*)$/);
      if (matches) {
        const mimeType = matches[1];
        const data = matches[2];
        parts.push({
          inlineData: {
            mimeType,
            data
          }
        });
        console.log(`[Gemini Rotator] Attached image data payload (${mimeType}).`);
      } else {
        console.warn('[Gemini Rotator] Image data URL format is invalid, skipping image payload.');
      }
    }
    
    // Add prompt text part
    parts.push({ text: prompt });

    const requestBody = {
      contents: [
        {
          role: "user",
          parts: parts
        }
      ],
      generationConfig: {
        responseMimeType: "application/json"
      }
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
          console.log(`[Gemini Rotator] Request succeeded using Key Index ${currentKeyIndex}.`);
          return data.candidates[0].content.parts[0].text;
        }
        throw new Error("Empty content received from Gemini.");
      }

      // Read API error status
      const errorData = await response.json().catch(() => ({}));
      const message = errorData.error?.message || `HTTP ${response.status}`;
      console.error(`[Gemini Rotator] Key Index ${currentKeyIndex} failed: ${message} (Status Code: ${response.status})`);

      // Increment attempt count and shift index to the next key (round-robin)
      attempts++;
      currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
      console.log(`[Gemini Rotator] Rotating to Key Index ${currentKeyIndex}...`);
    } catch (err) {
      console.error(`[Gemini Rotator] Network error using Key Index ${currentKeyIndex}:`, err.message);
      attempts++;
      currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
      console.log(`[Gemini Rotator] Rotating to Key Index ${currentKeyIndex}...`);
    }
  }

  throw new Error("All configured Gemini API keys failed or hit rate limits (429). Please verify your keys.");
}

// REST Endpoint to generate captions
app.post('/api/generate', async (req, res) => {
  const { topic, tone, length, emojis, hashtags, count, image, language } = req.body;

  if (!topic && !image) {
    return res.status(400).json({ error: "Either a topic description or an image is required." });
  }

  const prompt = `You are an expert social media strategist and professional copywriter.
Generate exactly ${count || 3} distinct, high-converting, engaging Instagram captions for a post based on these details:
${topic ? `- Topic / Description provided by user: "${topic}"` : '- No description text provided by the user.'}
${image ? '- An image is attached to this request. Carefully analyze the contents, colors, objects, mood, and style of the attached image to write captions describing it.' : ''}
- Tone of Voice: "${tone}"
- Length: "${length}" (Short = 1 sentence hook, Medium = 2-3 sentences with line breaks, Long = 4+ sentences/storytelling layout with line breaks and paragraph spacing)
- Include Emojis: ${emojis ? 'Yes (use relevant emojis at appropriate places)' : 'No (do not use any emojis at all)'}
- Include Hashtags: ${hashtags ? 'Yes (append 5 to 10 relevant hashtags at the bottom)' : 'No (do not include any hashtags)'}
- Output Language: ${language === 'Hinglish' ? 'Hinglish (Hindi language written in the Roman/English script, for example: "Aaj ka mausam bohot pyaara hai yaar!" or "Goa beach par sunset dosto ke saath enjoy kar rahe hain"). Do NOT write in Devanagari script (no Hindi letters like आज, मौसम, etc.).' : 'English (standard English)'}

Return the output as a valid JSON array of strings containing exactly ${count || 3} entries. For example:
[
  "Caption option 1 here...",
  "Caption option 2 here..."
]
Do not include markdown wrapper symbols like \`\`\`json. Return only the raw JSON array string.`;

  try {
    const rawText = await generateContentWithRotation(prompt, image);
    res.json({ text: rawText });
  } catch (err) {
    console.error("[Backend API Error]:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Endpoint to check active API status
app.get('/api/status', (req, res) => {
  res.json({
    active: apiKeys.length > 0,
    keysLoaded: apiKeys.length,
    activeKeyIndex: apiKeys.length > 0 ? currentKeyIndex : -1
  });
});

// Export the app so it can be reused as a Vercel serverless function (see api/index.js)
export default app;

// Only start a standalone HTTP server when this file is run directly (`node server.js`).
// On Vercel the app is imported by api/index.js and Vercel handles the HTTP layer itself.
const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === __filename;

if (isDirectRun) {
  // Serve compiled static client files in production
  const buildPath = path.join(__dirname, 'dist');
  if (fs.existsSync(buildPath)) {
    app.use(express.static(buildPath));
    app.get('/*splat', (req, res) => {
      res.sendFile(path.join(buildPath, 'index.html'));
    });
    console.log(`[Server] Serving production React build from ${buildPath}`);
  } else {
    console.log(`[Server] Development mode: API listening on port ${PORT}. Run frontend dev server separately.`);
  }

  app.listen(PORT, () => {
    console.log(`[Server] Server listening on http://localhost:${PORT}`);
  });
}
