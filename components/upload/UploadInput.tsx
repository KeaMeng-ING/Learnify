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

// Skeleton Loading Component
const SkeletonLoader = () => {
  return (
    <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 bg-purple-200 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
      </div>

      {/* Processing steps skeleton */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-purple-300 rounded-full animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded w-40 animate-pulse"></div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-purple-300 rounded-full animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded w-36 animate-pulse"></div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-purple-300 rounded-full animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded w-44 animate-pulse"></div>
        </div>
      </div>

      {/* Progress bar skeleton */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded w-12 animate-pulse"></div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-purple-300 h-2 rounded-full animate-pulse"
            style={{ width: "60%" }}
          ></div>
        </div>
      </div>

      {/* Content preview skeleton */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
      </div>
    </div>
  );
};

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

          {isLoading && <SkeletonLoader />}
        </form>
      </div>
    );
  }
);

UploadInput.displayName = "UploadInput";

export default UploadInput;
