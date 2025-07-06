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
              text: `You are an AI study assistant.
Given the text below, generate exactly 10 questions and answers.
Each question should test understanding of the content.
Each answer must be clear and complete — short if a word or phrase makes sense, or a full sentence if needed.
Do not create multiple choice options.
Keep answers natural and easy to understand.
Format the output exactly like this:
Question 1: [question]
Answer 1: [answer]
... up to 10.

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
