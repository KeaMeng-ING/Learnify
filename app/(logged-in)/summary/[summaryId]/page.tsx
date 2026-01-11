import SummaryClient from "@/components/flashcards/SummaryClient";

export default async function SummaryPage({
  params,
}: {
  params: Promise<{ summaryId: string }>;
}) {
  const { summaryId } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/summaries?id=${summaryId}`);
  if (!res.ok) {
    throw new Error("Failed to fetch summary");
  }
  const data = await res.json();

  return <SummaryClient title={data.title} minRead={data.minRead} />;
}
