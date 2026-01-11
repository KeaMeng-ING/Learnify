"use client";

import UploadInput from "@/components/upload/UploadInput";
import generateQuiz from "@/utils/generateQuiz";
import generateSummary from "@/utils/generateSummary";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";

const UploadForm = ({
  limit,
  redirectTo = "quiz",
}: {
  limit: boolean;
  redirectTo?: "quiz" | "summary";
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (file: File) => {
    setIsLoading(true);

    // Show loading toast
    const loadingToast = toast.loading("Uploading PDF...", {
      description: "Please wait while we process your document ✨",
    });

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        toast.success("PDF uploaded successfully!", {
          id: loadingToast,
          description: "Your document has been processed successfully! 🎉",
        });

        // Redirect based on the redirectTo prop
        if (redirectTo === "summary") {
          const summary = await generateSummary(result.text);
          console.log("Generated Summary:", summary);
          window.location.href = `/summary/${summary.id}`;
        } else {
          const quiz = await generateQuiz(result.text);
          window.location.href = `/quiz/${quiz.id}`;
        }
      } else {
        toast.error(result.error || "Upload failed", {
          id: loadingToast,
          description:
            "There was an issue processing your document. Please try again.",
        });
      }

      // const quiz = await generateQuiz();
    } catch (error) {
      toast.error("Upload failed", {
        id: loadingToast,
      });
      console.error("Upload error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return limit ? (
    <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 text-rose-800">
      <p className="text-sm">
        You&#39;ve reached the limit uploads on the Basic plan.{" "}
        <Link
          href="/#pricing"
          className="text-rose-800 underline font-medium underline-offset-4 inline-flex items-center"
        >
          Click here to upgrade to Pro{" "}
          <ArrowRight className="w-4 h-4 inline-block" />
        </Link>{" "}
        for unlimited uploads.
      </p>
    </div>
  ) : (
    <div>
      <UploadInput onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};

export default UploadForm;
