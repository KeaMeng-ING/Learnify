"use server";

import { getGroqQuizCreation } from "@/utils/groqapi";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

type QuizData = {
  question: string;
  answer: string;
};

type ParsedQuiz = {
  title: string | null;
  summary: string | null;
  minuteRead: number | null;
  questions: QuizData[];
};

function parseQuizText(quizText: string): ParsedQuiz {
  const lines = quizText.split("\n").filter((line) => line.trim());
  const questions: QuizData[] = [];

  let currentQuestion = "";
  let currentAnswer = "";
  let title: string | null = null;
  let summary: string | null = null;
  let minuteRead: number | null = null;

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
    } else if (line.startsWith("Minute Read:")) {
      const minuteReadMatch = line.match(/Minute Read:\s*(\d+)/);
      if (minuteReadMatch) {
        minuteRead = parseInt(minuteReadMatch[1], 10);
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

  return { title, summary, questions, minuteRead };
}

export default async function generateQuiz(text: string) {
  let quiz;

  try {
    quiz = await getGroqQuizCreation(text);
  } catch (error) {
    throw new Error("Error generating quiz content: " + error);
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
        minRead: quizData.minuteRead || null,
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
