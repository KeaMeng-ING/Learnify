import { Button } from "@/components/ui/button";
import React from "react";
import Link from "next/link";
import { FileText, Plus } from "lucide-react";
import BgGradient from "@/components/layout/BgGradient";
import ContentCard from "@/components/allQuizzes/ContentCard";
// import { PrismaClient } from "@/app/generated/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const params = await searchParams;
  const feature = params.feature;

  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  let card: any[] = [];
  const isQuiz = feature === "quiz";
  const isSummary = feature === "summary";

  if (isQuiz) {
    card = await prisma.quiz.findMany({
      where: { userId },
    });
  } else if (isSummary) {
    card = await prisma.summary.findMany({
      where: { userId },
    });
  }

  console.log("card", card);

  return (
    <div className="flex flex-col items-center justify-center gap-6 text-center w-full sm:px-14">
      <BgGradient className="from-purple-500 via-cyan-500 to-blue-500" />
      <div className="flex justify-between items-center w-full px-8 mt-10">
        <div className="">
          <h1 className="text-3xl text-start">
            Your {isQuiz ? "Quizzes" : "Summaries"}
          </h1>
          <p className="text-gray-500 text-start">
            Transform your PDFs into{" "}
            {isQuiz ? "Interactive Quizzes" : "Clear Summaries"}
          </p>
        </div>

        {isQuiz ? (
          <Link href="/upload">
            <Button className="bg-purple-500">
              <Plus /> New Quiz
            </Button>
          </Link>
        ) : (
          <Link href="/learn/summary">
            <Button className="bg-purple-500">
              <Plus /> New Summary
            </Button>
          </Link>
        )}
      </div>

      <div className="flex flex-wrap w-full px-8  justify-center sm:justify-start items-center gap-3">
        {card.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 w-full h-96">
            <FileText size={75} className="text-gray-400" />
            <h3 className="font-bold text-gray-400 text-lg">
              No {isQuiz ? "Quizzes" : "Summaries"} Yet
            </h3>
            <p className="text-gray-500">
              Upload your first PDF to get started with AI-Powered{" "}
              {isQuiz ? "quizzes" : "summaries"}
            </p>
            <Link href={isQuiz ? "/upload" : "/learn/summary"}>
              <Button className="bg-gradient-to-r from-purple-500 to-purple-700 mt-5">
                Create Your First {isQuiz ? "Quiz" : "Summary"}
              </Button>
            </Link>
          </div>
        )}
        {card.map((item) => (
          <ContentCard
            item={item}
            key={item.id}
            type={isQuiz ? "quiz" : "summary"}
          />
        ))}
      </div>
    </div>
  );
};

export default page;
