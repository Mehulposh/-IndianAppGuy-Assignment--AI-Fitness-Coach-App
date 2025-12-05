// --- JSON SCHEMA ---
export const JSON_SCHEMA = {
  type: "OBJECT",
  properties: {
    workout_plan: {
      type: "OBJECT",
      properties: {
        daily_routine: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              day: { type: "STRING" },
              focus: { type: "STRING" },
              exercises: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    name: { type: "STRING" },
                    sets: { type: "STRING" },
                    reps: { type: "STRING" },
                    rest: { type: "STRING" }
                  }
                }
              }
            }
          }
        }
      }
    },
    diet_plan: {
      type: "OBJECT",
      properties: {
        meal_plan: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              day: { type: "STRING" },
              meals: {
                type: "OBJECT",
                properties: {
                  breakfast: { type: "OBJECT", properties: { name: { type: "STRING" }, description: { type: "STRING" }, calories: { type: "NUMBER" } } },
                  lunch: { type: "OBJECT", properties: { name: { type: "STRING" }, description: { type: "STRING" }, calories: { type: "NUMBER" } } },
                  dinner: { type: "OBJECT", properties: { name: { type: "STRING" }, description: { type: "STRING" }, calories: { type: "NUMBER" } } },
                  snacks: { type: "OBJECT", properties: { name: { type: "STRING" }, description: { type: "STRING" }, calories: { type: "NUMBER" } } }
                }
              }
            }
          }
        }
      }
    },
    ai_tips: {
      type: "OBJECT",
      properties: {
        lifestyle_tips: { type: "ARRAY", items: { type: "STRING" } },
        motivation: { type: "STRING" }
      }
    }
  }
};

// --- Helpers for TTS ---

const base64ToArrayBuffer = (base64) => {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

const pcmToWav = (pcmData, sampleRate) => {
  const numSamples = pcmData.length;
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  view.setUint32(0, 0x52494646, false); // "RIFF"
  view.setUint32(4, 36 + numSamples * 2, true);
  view.setUint32(8, 0x57415645, false); // "WAVE"
  view.setUint32(12, 0x666d7420, false); // "fmt "
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  view.setUint32(36, 0x64617461, false); // "data"
  view.setUint32(40, numSamples * 2, true);

  const pcm16 = new Int16Array(pcmData.buffer);
  for (let i = 0; i < numSamples; i++) {
    view.setInt16(44 + i * 2, pcm16[i], true);
  }

  return new Blob([view], { type: "audio/wav" });
};

// --- Gemini: Text Plan ---

export const callGeminiApi = async (payload, retries = 3) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const apiUrl =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=" +
    apiKey;

  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`API Error: ${response.status}`);

      const result = await response.json();
      const jsonText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (jsonText) return JSON.parse(jsonText);
      throw new Error("Invalid response structure");
    } catch (error) {
      console.error(`Gemini API attempt ${i + 1} failed:`, error);
      if (i === retries - 1) throw error;
      await new Promise((res) => setTimeout(res, 1000 * Math.pow(2, i)));
    }
  }
};

// --- Gemini: TTS ---

export const callGeminiTtsApi = async (textToSpeak, retries = 3) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const apiUrl =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=" +
    apiKey;

  const payload = {
    contents: [{ parts: [{ text: `Say with a friendly and encouraging tone: ${textToSpeak}` }] }],
    generationConfig: {
      responseModalities: ["AUDIO"],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } } },
    },
    model: "gemini-2.5-flash-preview-tts",
  };

  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`TTS API Error: ${response.status}`);

      const result = await response.json();
      const part = result?.candidates?.[0]?.content?.parts?.[0];
      const audioData = part?.inlineData?.data;
      const mimeType = part?.inlineData?.mimeType;

      if (audioData && mimeType?.startsWith("audio/")) {
        const rateMatch = mimeType.match(/rate=(\d+)/);
        const sampleRate = rateMatch ? parseInt(rateMatch[1], 10) : 22050;
        const pcmData = base64ToArrayBuffer(audioData);
        const wavBlob = pcmToWav(new Int16Array(pcmData), sampleRate);
        return URL.createObjectURL(wavBlob);
      }
      throw new Error("Invalid TTS response");
    } catch (error) {
      console.error(`TTS API attempt ${i + 1} failed:`, error);
      if (i === retries - 1) throw error;
      await new Promise((res) => setTimeout(res, 1000 * Math.pow(2, i)));
    }
  }
};

// --- Imagen 3: Image ---

export const callImagenApi = async (prompt, retries = 3) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const apiUrl =
    "https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=" +
    apiKey;

  const payload = {
    instances: [{ prompt }],
    parameters: { sampleCount: 1 },
  };

  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`Imagen API Error: ${response.status}`);

      const result = await response.json();
      if (result.predictions && result.predictions[0]?.bytesBase64Encoded) {
        return `data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`;
      }
      throw new Error("Invalid Imagen response structure");
    } catch (error) {
      console.error(`Imagen API attempt ${i + 1} failed:`, error);
      if (i === retries - 1) throw error;
      await new Promise((res) => setTimeout(res, 1000 * Math.pow(2, i)));
    }
  }
};

