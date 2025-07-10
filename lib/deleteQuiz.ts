"use server";

import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function deleteQuiz(quizId: string) {
  try {
    const deletedQuiz = await prisma.quiz.delete({
      where: { id: quizId },
    });
    return deletedQuiz;
  } catch (error) {
    console.error("Error deleting quiz:", error);
    throw new Error("Failed to delete quiz");
  } finally {
    await prisma.$disconnect();
  }
}
