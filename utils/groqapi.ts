import Groq from "groq-sdk";
import { QUIZ_PROMPT, SUMMARY_PROMPT } from "@/utils/prompts";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function getGroqQuizCreation(pdfText: string) {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: QUIZ_PROMPT,
        },
        {
          role: "user",
          content: `Here is the extracted text:\n\n${pdfText}\n\nPlease generate short-answer questions and answers based only on this content.`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_completion_tokens: 1024,
    });

    return chatCompletion.choices[0]?.message?.content;
  } catch (error: any) {
    if (error?.status == 429) {
      throw new Error("Rate Limit Exceeded");
    }
    throw error;
  }
}

export default async function getGroqSummaryCreation(pdfText: string) {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: SUMMARY_PROMPT,
        },
        {
          role: "user",
          content: `Here is the extracted text:\n\n${pdfText}\n\nPlease generate a summary based only on this content.`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_completion_tokens: 1024,
    });

    console.log(chatCompletion);

    return chatCompletion.choices[0]?.message?.content;
  } catch (error: any) {
    if (error?.status == 429) {
      throw new Error("Rate Limit Exceeded");
    }
    throw error;
  }
}
