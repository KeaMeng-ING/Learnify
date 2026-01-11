export default async function QuizPage({
  params,
}: {
  params: Promise<{ summaryId: string }>;
}) {
  const { summaryId } = await params;
  const res = await fetch(
    `${process.env.DOMAIN}/api/summaries?id=${summaryId}`
  );
  const data = await res.json();
  console.log(data);

  return <h1>{summaryId}</h1>;
}
