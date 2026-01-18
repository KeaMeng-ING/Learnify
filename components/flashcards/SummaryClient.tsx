"use client";

import BgGradient from "@/components/layout/BgGradient";
import { Badge } from "@/components/ui/badge";
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Slide = {
  id: string;
  heading: string;
  content: string;
  summaryId: string;
};

type SummaryProgress = {
  currentSlideIndex: number;
  lastUpdated: number;
};

const SummaryClient = ({
  title,
  minRead,
  slides,
  overview,
  keyTakeaway,
  summaryId,
}: {
  title: string;
  minRead: number | null;
  slides: Slide[];
  overview: string | null;
  keyTakeaway: string | null;
  summaryId: string;
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(-1);
  const [isMarking, setIsMarking] = useState(false);

  const STORAGE_KEY = `summary_progress_${summaryId}`;
  const totalSlides = slides.length + 2;
  const progress = currentSlideIndex + 2;

  // Load progress from localStorage
  useEffect(() => {
    const loadProgress = () => {
      try {
        const savedProgress = localStorage.getItem(STORAGE_KEY);
        if (savedProgress) {
          const progressData: SummaryProgress = JSON.parse(savedProgress);
          const daysSinceUpdate =
            (Date.now() - progressData.lastUpdated) / (1000 * 60 * 60 * 24);

          // Only restore if less than 30 days old
          if (daysSinceUpdate < 30) {
            setCurrentSlideIndex(progressData.currentSlideIndex);
          }
        }
      } catch (error) {
        console.error("Error loading summary progress:", error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadProgress();
  }, [summaryId, STORAGE_KEY]);

  // Save progress to localStorage whenever slide changes
  useEffect(() => {
    if (!isLoaded) return;

    const saveProgress = () => {
      try {
        const progressData: SummaryProgress = {
          currentSlideIndex,
          lastUpdated: Date.now(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progressData));
      } catch (error) {
        console.error("Error saving summary progress:", error);
      }
    };

    saveProgress();
  }, [currentSlideIndex, isLoaded, STORAGE_KEY]);

  // Mark summary as complete when reaching the end
  useEffect(() => {
    if (currentSlideIndex === slides.length && !isMarking) {
      markSummaryAsComplete();
    }
  }, [currentSlideIndex, slides.length, isMarking]);

  const markSummaryAsComplete = async () => {
    setIsMarking(true);
    try {
      const response = await fetch("/api/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: summaryId, type: "summary" }),
      });

      if (!response.ok) {
        throw new Error("Failed to mark summary as complete");
      }

      console.log("Summary marked as complete");
    } catch (error) {
      console.error("Error marking summary as complete:", error);
    } finally {
      setIsMarking(false);
    }
  };

  const nextSlide = () => {
    if (currentSlideIndex < slides.length) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlideIndex > -1) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const getCurrentContent = () => {
    if (currentSlideIndex === -1) {
      return {
        heading: "Overview",
        content: overview || "No overview available",
        isOverview: true,
      };
    } else if (currentSlideIndex === slides.length) {
      return {
        heading: "Key Takeaway",
        content: keyTakeaway || "No key takeaway available",
        isKeyTakeaway: true,
      };
    } else {
      return {
        ...slides[currentSlideIndex],
        isOverview: false,
        isKeyTakeaway: false,
      };
    }
  };

  const currentContent = getCurrentContent();

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
    <div className="h-[calc(100vh-64px)] w-full overflow-hidden flex flex-col">
      <BgGradient />
      <div className="container mx-auto px-2 lg:px-8 flex flex-col justify-start py-4 flex-shrink-0">
        <div className="flex flex-wrap justify-between items-center mb-2 w-full">
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

          <Link href="/dashboard?feature=summary" className="-translate-y-1.5">
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
          <h1 className="w-full text-2xl sm:text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-600 to-red-600 drop-shadow-sm">
            {title}
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col overflow-hidden min-h-0">
        <div className="w-full max-w-3xl mx-auto px-4 h-full flex items-center py-4">
          <div className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-200/50 p-6 lg:p-8 w-full h-full max-h-[calc(100vh-200px)]">
            <div className="bg-white rounded-3xl shadow-2xl p-6 lg:p-8 border border-purple-500/20 h-full flex flex-col mx-auto max-w-[500px]">
              {/* Progress Bar */}
              <div className="mb-6 flex-shrink-0">
                <div className="flex items-center justify-between gap-2 mb-2">
                  {Array.from({ length: totalSlides }).map((_, index) => (
                    <div
                      key={index}
                      className={cn(
                        "h-2 flex-1 rounded-full transition-all duration-300",
                        index < progress ? "bg-purple-500" : "bg-gray-200",
                      )}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>
                    {currentSlideIndex === -1
                      ? "Overview"
                      : currentSlideIndex === slides.length
                        ? "Key Takeaway"
                        : `Slide ${currentSlideIndex + 1} of ${slides.length}`}
                  </span>
                  <span>{Math.round((progress / totalSlides) * 100)}%</span>
                </div>
              </div>

              {/* Slide Content */}
              <div className="flex-1 overflow-y-auto min-h-0">
                <div
                  className={cn(
                    "mb-6",
                    currentContent.isKeyTakeaway &&
                      "p-6 bg-purple-50 rounded-xl border-l-4 border-purple-500",
                  )}
                >
                  <h2
                    className={cn(
                      "text-2xl font-bold mb-4 text-center",
                      currentContent.isOverview && "text-gray-800",
                      currentContent.isKeyTakeaway && "text-purple-800",
                      !currentContent.isOverview &&
                        !currentContent.isKeyTakeaway &&
                        "text-purple-600",
                    )}
                  >
                    {currentContent.heading}
                  </h2>
                  <div className="text-gray-700 text-lg whitespace-pre-line leading-relaxed">
                    {currentContent.content}
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 flex-shrink-0">
                <Button
                  onClick={prevSlide}
                  disabled={currentSlideIndex === -1}
                  className={cn(
                    "flex items-center justify-center transition-all duration-300 rounded-full w-10 h-10 p-0",
                    currentSlideIndex === -1
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-purple-500 hover:bg-purple-600 text-white shadow-lg hover:shadow-xl",
                  )}
                >
                  <ChevronLeft size={20} />
                </Button>

                <div className="text-sm text-gray-500">
                  {currentSlideIndex === -1 && "Overview"}
                  {currentSlideIndex >= 0 &&
                    currentSlideIndex < slides.length &&
                    `Slide ${currentSlideIndex + 1}`}
                  {currentSlideIndex === slides.length && "Key Takeaway"}
                </div>

                <Button
                  onClick={nextSlide}
                  disabled={currentSlideIndex === slides.length}
                  className={cn(
                    "flex items-center justify-center transition-all duration-300 rounded-full w-10 h-10 p-0",
                    currentSlideIndex === slides.length
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-purple-500 hover:bg-purple-600 text-white shadow-lg hover:shadow-xl",
                  )}
                >
                  <ChevronRight size={20} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryClient;
