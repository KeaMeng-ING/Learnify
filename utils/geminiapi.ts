import AI_PROMPT from "@/utils/prompts";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const generateQnAFromGemini = async (pdfText: string) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: { temperature: 0.7, maxOutputTokens: 1500 },
    });

    const prompt = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${AI_PROMPT}

Text:
${pdfText}`,
            },
          ],
        },
      ],
    };

    const result = await model.generateContent(prompt);
    const response = await result.response;

    if (!response || !response.text) {
      throw new Error("No response text received from Gemini API");
    }

    return response.text();
  } catch (error: any) {
    if (error?.status === 429) {
      throw new Error("RATE_LIMIT_EXCEEDED");
    }
    console.error("Gemini API Error:", error);
    throw error;
  }
};
