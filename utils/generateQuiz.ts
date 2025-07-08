"use server";

import { generateQnAFromGemini } from "@/utils/geminiapi";
import { getGroqChatCompletion } from "@/utils/groqapi";
import { PrismaClient } from "@/app/generated/prisma";
import { auth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

type QuizData = {
  question: string;
  answer: string;
};

type ParsedQuiz = {
  title: string | null;
  summary: string | null;
  questions: QuizData[];
};

function parseQuizText(quizText: string): ParsedQuiz {
  const lines = quizText.split("\n").filter((line) => line.trim());
  const questions: QuizData[] = [];

  let currentQuestion = "";
  let currentAnswer = "";
  let title: string | null = null;
  let summary: string | null = null;

  for (const line of lines) {
    if (line.startsWith("Title:")) {
      const titleMatch = line.match(/Title:\s*(.+)/);
      if (titleMatch) {
        title = titleMatch[1];
      }
    } else if (line.startsWith("Summary:")) {
      const summaryMatch = line.match(/Summary:\s*(.+)/);
      if (summaryMatch) {
        summary = summaryMatch[1];
      }
    } else if (line.startsWith("Question")) {
      const questionMatch = line.match(/Question \d+: (.+)/);
      if (questionMatch) {
        currentQuestion = questionMatch[1];
      }
    } else if (line.startsWith("Answer")) {
      const answerMatch = line.match(/Answer \d+: (.+)/);
      if (answerMatch) {
        currentAnswer = answerMatch[1];
        if (currentQuestion) {
          questions.push({
            question: currentQuestion,
            answer: currentAnswer,
          });
        }
      }
    }
  }

  return { title, summary, questions };
}

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
    } else {
      // Re-throw other errors
      throw error;
    }
  }
  console.log("Generated Quiz Content:", quiz);

  if (!quiz) {
    throw new Error("Failed to generate quiz content");
  }

  // Get the current user
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  // Parse the quiz text into structured data
  const quizData = parseQuizText(quiz);
  console.log(quizData);

  if (!quizData.questions.length) {
    throw new Error("No questions generated from the provided text");
  }

  try {
    // Save to database
    const savedQuiz = await prisma.quiz.create({
      data: {
        userId,
        title: quizData.title || "Untitled Quiz",
        summary: quizData.summary,
        questions: {
          create: quizData.questions.map((q) => ({
            question: q.question,
            answer: q.answer,
          })),
        },
      },
      include: {
        questions: true,
      },
    });

    return savedQuiz;
  } catch (dbError) {
    console.error("Database save error:", dbError);
    throw new Error("Failed to save quiz to database");
  } finally {
    await prisma.$disconnect();
  }
}
