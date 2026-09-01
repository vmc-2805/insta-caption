/**
 * Calls the local Express backend proxy (/api/generate) to generate Instagram captions.
 * The backend handles API Key rotation and security, and supports Multimodal input and Language selection.
 * 
 * @param {Object} params 
 * @param {string} params.topic - Description of the post (optional if image is provided)
 * @param {string} [params.image] - Base64 dataURL of the image (optional if topic is provided)
 * @param {string} params.tone - Tone category
 * @param {string} params.length - 'Short' | 'Medium' | 'Long'
 * @param {boolean} params.emojis - Include emojis
 * @param {boolean} params.hashtags - Include hashtags
 * @param {number} params.count - Number of captions to generate
 * @param {string} [params.language] - Output language ('English' | 'Hinglish')
 * @returns {Promise<string[]>} List of generated captions
 */
export async function generateCaptionsWithGemini({ topic, tone, length, emojis, hashtags, count, image, language }) {
  const url = '/api/generate';

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      topic,
      tone,
      length,
      emojis,
      hashtags,
      count,
      image,
      language
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.error || `HTTP ${response.status} Error`;
    throw new Error(message);
  }

  const data = await response.json();
  
  if (!data.text) {
    throw new Error("Invalid response format received from server.");
  }

  let textResponse = data.text.trim();
  
  // Extract JSON array portion securely
  const startIdx = textResponse.indexOf('[');
  const endIdx = textResponse.lastIndexOf(']');
  if (startIdx !== -1 && endIdx !== -1) {
    textResponse = textResponse.substring(startIdx, endIdx + 1);
  }

  try {
    const parsed = JSON.parse(textResponse);
    if (Array.isArray(parsed)) {
      // Decode escaped newlines (e.g. \n) into actual line break characters
      return parsed.map(caption => caption.replace(/\\n/g, '\n'));
    }
    throw new Error("Parsed JSON is not an array");
  } catch (err) {
    console.error("Failed to parse Gemini JSON output. Raw response:", textResponse);
    // Robust line-by-line fallback parsing: strips brackets, leading/trailing quotes, and commas
    return textResponse
      .split('\n')
      .map(line => {
        let clean = line.trim();
        // Remove array brackets
        if (clean.startsWith('[') || clean.startsWith(']')) {
          clean = clean.replace(/^[\[\]]/, '').trim();
        }
        // Strip leading/trailing quotes and trailing commas
        return clean.replace(/^["']|["']\s*,?\s*$/g, '').replace(/\\n/g, '\n').trim();
      })
      .filter(line => line.length > 5)
      .slice(0, count);
  }
}
