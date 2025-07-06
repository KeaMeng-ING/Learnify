"use client";

import generateQuiz from "@/actions/generateQuiz";
import UploadInput from "@/components/upload/UploadInput";
import React, { useState } from "react";
import { toast } from "sonner";

const UploadForm = () => {
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

        // Parse the text from PDF using langchain
        // const quiz = await generateQuiz(result.data.text);
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

  return (
    <div>
      <UploadInput onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};

export default UploadForm;
