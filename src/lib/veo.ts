import { GoogleGenAI } from "@google/genai";

// Ensure AI Studio injects the key into process.env.GEMINI_API_KEY if selected,
// OR we fetch it dynamically if they rely on window.aistudio
async function getGeminiKey() {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;
  // If undefined, try to retrieve it depending on platform mechanics,
  // but according to docs it's injected automatically.
  return '';
}

export async function generateVeoVideo(prompt: string, imageBase64?: string, mimeType?: string): Promise<string | null> {
  // Always create a new instances as per guidelines
  // Note: Docs say "available using process.env.API_KEY". Let's check environment settings.
  // Actually, standard is process.env.GEMINI_API_KEY, but docs mention process.env.API_KEY in the race condition section.
  // Use process.env.API_KEY injected by AI Studio for the user-selected key.
  const key = process.env.API_KEY || process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({ apiKey: key });

  const payload: any = {
    model: 'veo-3.1-lite-generate-preview',
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '16:9'
    }
  };

  if (prompt) {
    payload.prompt = prompt;
  }

  if (imageBase64 && mimeType) {
    const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
    payload.image = {
      imageBytes: base64Data,
      mimeType: mimeType
    };
  }

  let operation = await ai.models.generateVideos(payload);

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  return downloadLink || null;
}
