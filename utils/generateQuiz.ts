"use server";

import { generateQnAFromGemini } from "@/utils/geminiapi";
import { getGroqChatCompletion } from "@/utils/groqapi";

export default async function generateQuiz(text: string) {
  let quiz;

  try {
    quiz = await getGroqChatCompletion(text);
  } catch (error) {
    // Call Gemini Code
    if (error instanceof Error && error.message === "RATE_LIMIT_EXCEEDED") {
      try {
        quiz = await generateQnAFromGemini(text);
      } catch (geminiError) {
        console.error(
          "Gemini API failed after OpenAI quote exceeded",
          geminiError
        );
        throw new Error(
          "Failed to generate summary with available AI providers"
        );
      }
    }
  }

  // Save to database

  return "hi";
}
