"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import React, { forwardRef } from "react";

interface UploadInputProps {
  onSubmit: (file: File) => Promise<void>;
  isLoading: boolean;
}

const UploadInput = forwardRef<HTMLDivElement, UploadInputProps>(
  ({ onSubmit, isLoading }, ref) => {
    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const file = formData.get("file") as File;
      if (file) {
        await onSubmit(file);
      }
    };

    return (
      <div ref={ref}>
        <form className="flex flex-col gap-6" onSubmit={handleFormSubmit}>
          <div className="flex justify-end items-center gap-1.5">
            <Input
              id="file"
              type="file"
              name="file"
              accept="application/pdf"
              required
              className={cn(isLoading && "opacity-50 cursor-not-allowed")}
              disabled={isLoading}
            />
            <Button
              disabled={isLoading}
              type="submit"
              className="bg-purple-500 hover:bg-purple-600 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                  Processing...
                </>
              ) : (
                "Upload your PDF"
              )}
            </Button>
          </div>
        </form>
      </div>
    );
  }
);

UploadInput.displayName = "UploadInput";

export default UploadInput;
