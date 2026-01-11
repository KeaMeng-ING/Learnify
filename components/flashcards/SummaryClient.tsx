"use client";

import BgGradient from "@/components/layout/BgGradient";
import { Badge } from "@/components/ui/badge";
import React, { useState } from "react";
import {
  ChevronLeft,
  RotateCcw,
  Shuffle,
  BookOpen,
  Sparkles,
  Check,
  X,
  Calendar,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const SummaryClient = ({
  title,
  minRead,
}: {
  title: string;
  minRead: number | null;
}) => {
  const [isLoaded, setIsLoaded] = useState(true);
  // Show loading state while progress is being loaded
  if (!isLoaded) {
    return (
      <div className="h-screen relative overflow-hidden flex items-center justify-center">
        <BgGradient />
        <div className="relative z-10 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your progress...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="h-[calc(100vh-64px)] relative  w-full flex flex-col">
      <BgGradient />
      <div className="container mx-auto px-2 lg:px-8 flex flex-col justify-start py-8">
        <div className="flex flex-wrap justify-between items-center mb-4 w-full">
          <div className="flex flex-wrap items-center gap-4 mb-4 sm:mb-0">
            <Badge
              variant="outline"
              className="bg-white text-purple-500 shadow-md font-bold px-2"
            >
              AI Summary
            </Badge>

            <div className="flex items-center gap-1 text-purple-500">
              <Calendar size={18} />
              <p className="text-sm text-gray-500">
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div className="flex items-center gap-1 text-purple-500">
              <Clock size={18} />
              <p className="text-sm text-gray-500">{minRead} min read</p>
            </div>
          </div>

          <Link href="/dashboard" className="-translate-y-1.5">
            <Button
              variant="secondary"
              className="flex items-center gap-1 bg-purple-500 hover:bg-purple-600 text-white transition-all duration-300 rounded-full"
            >
              <ChevronLeft size={16} />
              Dashboard
            </Button>
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row w-full gap-3 lg:gap-4 items-start">
          <h1 className="w-full text-2xl sm:text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-600 to-red-600 drop-shadow-sm mt-4">
            {title}
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col pb-8">
        <div className="w-full max-w-4xl mx-auto px-4 flex-1 flex flex-col pt-12 ">
          <div className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-200/50 p-8 lg:p-10 lg:pb-8 flex-1">
            <div className="bg-white rounded-3xl shadow-2xl p-8 lg:mx-30 lg:p-12 border border-purple-500/20 flex-1 h-full">
              {/* Content goes here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryClient;
