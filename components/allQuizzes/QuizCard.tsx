"use client";

import { FileDiff, Trash2 } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteQuiz } from "@/lib/deleteQuiz";
import LoadingOverlay from "@/components/allQuizzes/LoadingOverlay";
import ConfirmModal from "@/components/allQuizzes/ConfirmModal";

type Quiz = {
  id: string;
  title: string | null;
  summary: string | null;
  minRead: number | null;
  complete: boolean | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  userId: string;
};

export default function QuizCard({ quiz }: { quiz: Quiz }) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDeleteClick() {
    setShowConfirm(true);
  }

  function handleConfirm() {
    setShowConfirm(false);
    startTransition(async () => {
      await deleteQuiz(quiz.id);
      router.refresh();
    });
  }

  function handleCancel() {
    setShowConfirm(false);
  }

  return (
    <>
      <div className="w-100 relative">
        <div className="relative h-full bg-white border border-gray-200">
          <div
            onClick={handleDeleteClick}
            className="absolute top-2 right-2 bg-gray-100 w-8 h-8 rounded-sm flex items-center justify-center cursor-pointer hover:bg-gray-200"
          >
            <Trash2 size={18} className="text-gray-400" />
          </div>

          <Link href={`/quiz/${quiz.id}`} className="flex flex-col px-2">
            <div className="flex p-4 pb-2 sm:p-5 sm:pb-2">
              <div className="pr-3 translate-y-2">
                <FileDiff size={26} className="text-purple-500" />
              </div>
              <div className="flex flex-col text-left justify-start w-full">
                <h3 className="text-base xl:text-lg font-semibold text-gray-900 truncate w-4/5">
                  {quiz.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(quiz.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>

            <div className="line-clamp-2 text-gray-500 px-4 text-left h-12">
              {quiz.summary}
            </div>

            <div className="flex justify-start p-4">
              {quiz.complete ? (
                <Badge className="bg-[#e6ffe6] text-[#339933] shadow-md">
                  Completed
                </Badge>
              ) : (
                <Badge className="bg-[#fff0f0] text-[#ff4d4d] shadow-md">
                  Not Completed
                </Badge>
              )}
            </div>
          </Link>
        </div>

        {showConfirm && (
          <ConfirmModal
            title="Delete Quiz"
            description="Are you sure you want to delete this quiz? This action cannot be undone."
            onConfirm={handleConfirm}
            onCancel={handleCancel}
          />
        )}
      </div>
      {isPending && <LoadingOverlay />}
    </>
  );
}
