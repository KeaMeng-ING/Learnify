import { notFound } from "next/navigation";

import QuizClient from "@/components/flashcards/QuizClient";
import { prisma } from "@/lib/prisma";

export default async function QuizPage({
  params,
}: {
  params: Promise<{ quizId: string }>;
}) {
  const { quizId } = await params;
  const data = await prisma.quiz.findFirst({
    where: { id: quizId },
    include: {
      questions: true,
    },
  });

  if (!data) {
    notFound();
  }

  return (
    <QuizClient
      questions={data.questions}
      title={data.title}
      id={quizId}
      minRead={data.minRead}
    />
  );
}
