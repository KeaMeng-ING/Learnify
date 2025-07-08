import AI_PROMPT from "@/utils/prompts";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function getGroqChatCompletion(pdfText: string) {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: AI_PROMPT,
        },
        {
          role: "user",
          content: `Here is the extracted text:\n\n${pdfText}\n\nPlease generate 10 short-answer questions and answers based only on this content.`,
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
