import QuizClient from "@/components/flashcards/QuizClient";

export default async function QuizPage({
  params,
}: {
  params: Promise<{ quizId: string }>;
}) {
  const { quizId } = await params;
  const res = await fetch(`http://localhost:3000/api/quizzes?id=${quizId}`);
  const data = await res.json();

  return (
    <QuizClient
      questions={data.questions}
      title={data.title}
      id={quizId}
      minRead={data.minRead}
    />
  );
}
