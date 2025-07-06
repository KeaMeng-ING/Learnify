import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function getGroqChatCompletion(pdfText: string) {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an AI study assistant.
Given any input text, generate exactly 10 questions and answers.
Each question should test understanding of the text.
Each answer must be clear and complete — short if a word or phrase makes sense, or a full sentence if needed.
Do not create multiple choice options.
Keep answers natural and easy to understand.
Return the output in this format:
Question 1: [your question]
Answer 1: [your answer]
Question 2: [your question]
Answer 2: [your answer]
... up to 10.`,
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
