import { GoogleGenAI } from '@google/genai';

// Initialize keys from env. We support a comma-separated list of keys for load balancing.
const keysString = import.meta.env.VITE_GEMINI_API_KEYS || import.meta.env.VITE_GEMINI_API_KEY || '';
const apiKeys = keysString.split(',').map((k: string) => k.trim()).filter(Boolean);

let currentKeyIndex = 0;

function getNextKey() {
  if (apiKeys.length === 0) return '';
  const key = apiKeys[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
  return key;
}

export const generateAIResponseStream = async (history: any[], latestMood: string | null) => {
  if (apiKeys.length === 0) {
    throw new Error('No Gemini API keys found. Please check your .env file.');
  }

  let attempt = 0;
  let lastError: any = null;

  const systemInstruction = `You are a warm, empathetic, and gentle journaling AI assistant. You help users process their emotions, thoughts, physical discomforts, and mental state. Keep your responses concise (1-3 sentences), compassionate, and inquisitive, encouraging thoughtful reflection without sounding robotic or repeating canned lines. ${
    latestMood ? `The user's most recently logged mood is: ${latestMood}. Please keep this mood in mind and tailor your tone/response appropriately.` : ''
  } You must also be able to answer any general questions the user asks, even if they don't seem related to their mood or journaling.`;

  // We will try up to the number of keys we have, or at least 1 time if there's only 1 key.
  const maxAttempts = apiKeys.length;

  while (attempt < maxAttempts) {
    const keyToTry = getNextKey();
    const ai = new GoogleGenAI({ apiKey: keyToTry });

    try {
      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: history,
        config: {
          systemInstruction,
        },
      });

      return responseStream;
    } catch (error: any) {
      console.warn(`Gemini API Error with key index ${(currentKeyIndex - 1 + apiKeys.length) % apiKeys.length}:`, error.message || error);
      lastError = error;
      
      // If it's a 429 (Resource Exhausted) or 503, we can try the next key
      if (error?.status === 429 || error?.status === 503) {
        attempt++;
        continue;
      }
      
      // If it's some other error, just throw it
      throw error;
    }
  }

  // If we exhausted all keys
  throw lastError || new Error("All API keys failed or rate limit exceeded.");
};
