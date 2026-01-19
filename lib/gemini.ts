import { GoogleGenerativeAI } from "@google/generative-ai";

let genai: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
  if (!genai) {
    genai = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
  }
  return genai;
}

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function generateWithGemini(
  prompt: string,
  jsonMode = false
): Promise<string> {
  const model = getGenAI().getGenerativeModel({
    model: "gemini-2.0-flash",
  });

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: jsonMode ? "application/json" : "text/plain",
          maxOutputTokens: 4096,
        },
      });

      const response = result.response;
      const text = response.text();

      if (!text) {
        throw new Error("Empty response from Gemini");
      }

      return text;
    } catch (error) {
      lastError = error as Error;
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`Gemini attempt ${attempt} failed:`, errorMessage);

      if (errorMessage.includes("429") || errorMessage.includes("quota")) {
        await sleep(RETRY_DELAY_MS * Math.pow(2, attempt));
      } else if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY_MS);
      }
    }
  }

  throw new Error(
    `Gemini failed after ${MAX_RETRIES} attempts: ${lastError?.message}`
  );
}

export async function generateStructured<T>(
  prompt: string,
  schema: string
): Promise<T> {
  const fullPrompt = `${prompt}

Return your response as valid JSON matching this schema:
${schema}

Return ONLY the JSON, no other text.`;

  const result = await generateWithGemini(fullPrompt, true);
  return JSON.parse(result) as T;
}
