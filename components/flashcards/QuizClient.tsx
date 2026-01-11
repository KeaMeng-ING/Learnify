"use client";

import React, { useState, useEffect } from "react";
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
import Confetti from "react-confetti";
import { Button } from "@/components/ui/button";
import BgGradient from "@/components/layout/BgGradient";
import ProgressBar from "@/components/flashcards/ProgressBar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Quiz = {
  id: string;
  question: string;
  answer: string;
  quizId: string;
};

type QuizProgress = {
  currentIndex: number;
  knownCards: string[];
  unknownCards: string[];
  hasCelebrated: boolean;
  lastUpdated: number;
};

export default function QuizClient({
  title,
  minRead,
  questions,
  id,
  demoMode = false,
}: {
  questions: Quiz[];
  title: string;
  minRead: number | null;
  id: string;
  demoMode?: boolean;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cards, setCards] = useState<Quiz[]>(questions);

  const [isShuffling, setIsShuffling] = useState(false);
  const [slideDirection, setSlideDirection] = useState("");
  const [knownCards, setKnownCards] = useState(new Set<string>());
  const [unknownCards, setUnknownCards] = useState(new Set<string>());
  const [showStats, setShowStats] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [hasCelebrated, setHasCelebrated] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const STORAGE_KEY = `quiz_progress_${id}`;

  // Load progress from localStorage on component mount
  useEffect(() => {
    const loadProgress = () => {
      try {
        const savedProgress = localStorage.getItem(STORAGE_KEY);
        if (savedProgress) {
          const progress: QuizProgress = JSON.parse(savedProgress);

          // Check if progress is not too old (optional - remove if you want indefinite storage)
          const daysSinceUpdate =
            (Date.now() - progress.lastUpdated) / (1000 * 60 * 60 * 24);

          if (daysSinceUpdate < 30) {
            // Keep progress for 30 days
            setCurrentIndex(progress.currentIndex);
            setKnownCards(new Set(progress.knownCards));
            setUnknownCards(new Set(progress.unknownCards));
            setHasCelebrated(progress.hasCelebrated);
          }
        }
      } catch (error) {
        console.error("Error loading quiz progress:", error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadProgress();
  }, [id, STORAGE_KEY]);

  // Save progress to localStorage whenever relevant state changes
  useEffect(() => {
    if (!isLoaded) return; // Don't save during initial load

    const saveProgress = () => {
      try {
        const progress: QuizProgress = {
          currentIndex,
          knownCards: Array.from(knownCards),
          unknownCards: Array.from(unknownCards),
          hasCelebrated,
          lastUpdated: Date.now(),
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      } catch (error) {
        console.error("Error saving quiz progress:", error);
      }
    };

    saveProgress();
  }, [
    currentIndex,
    knownCards,
    unknownCards,
    hasCelebrated,
    isLoaded,
    STORAGE_KEY,
  ]);

  // Clear progress from localStorage
  const clearProgress = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing quiz progress:", error);
    }
  };

  const flipCard = () => setIsFlipped(!isFlipped);
  const currentCard = cards[currentIndex];
  if (!currentCard) return null;

  const markAsKnown = () => {
    const cardId = currentCard.id;
    setKnownCards((prev) => new Set([...prev, cardId]));
    setUnknownCards((prev) => {
      const newSet = new Set(prev);
      newSet.delete(cardId);
      return newSet;
    });
    nextCard();
  };

  const markAsUnknown = () => {
    const cardId = currentCard.id;
    setUnknownCards((prev) => new Set([...prev, cardId]));
    setKnownCards((prev) => {
      const newSet = new Set(prev);
      newSet.delete(cardId);
      return newSet;
    });
    nextCard();
  };

  const nextCard = () => {
    if (currentIndex < cards.length - 1) {
      setSlideDirection("slide-left");
      setTimeout(() => {
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
        setIsFlipped(false);
        setSlideDirection("");

        if (nextIndex >= cards.length - 1 && !hasCelebrated) {
          setShowCelebration(true);
          setShowConfetti(true);
          setHasCelebrated(true);
          setTimeout(() => setShowConfetti(false), 5000);
          fetch("/api/complete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
          });
        }
      }, 200);
    } else {
      if (!hasCelebrated) {
        setShowCelebration(true);
        setShowConfetti(true);
        setHasCelebrated(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setSlideDirection("slide-right");
      setTimeout(() => {
        setCurrentIndex(currentIndex - 1);
        setIsFlipped(false);
        setSlideDirection("");
      }, 200);
    }
  };

  const resetCards = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setSlideDirection("");
    setKnownCards(new Set());
    setUnknownCards(new Set());
    setShowCelebration(false);
    setHasCelebrated(false);
    clearProgress(); // Clear saved progress
  };

  const shuffleCards = () => {
    setIsShuffling(true);
    setTimeout(() => {
      const shuffled = [...cards].sort(() => Math.random() - 0.5);
      setCards(shuffled);
      setCurrentIndex(0);
      setIsFlipped(false);
      setIsShuffling(false);
      // Clear progress when shuffling since card order changed
      clearProgress();
      setKnownCards(new Set());
      setUnknownCards(new Set());
      setHasCelebrated(false);
    }, 600);
  };

  const progress = ((currentIndex + 1) / cards.length) * 100;
  const knownCount = knownCards.size;
  const unknownCount = unknownCards.size;
  const totalAnswered = knownCount + unknownCount;

  const isCurrentCardKnown = knownCards.has(currentCard.id);
  const isCurrentCardUnknown = unknownCards.has(currentCard.id);

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
      {/* Background decoration */}
      {id !== "demo-quiz" && <BgGradient />}
      <div className="container mx-auto px-2 lg:px-8 flex flex-col justify-start py-8">
        <div className="flex flex-wrap justify-between items-center mb-4 w-full">
          <div className="flex flex-wrap items-center gap-4 mb-4 sm:mb-0">
            <Badge
              variant="outline"
              className="bg-white text-purple-500 shadow-md font-bold px-2"
            >
              AI Quiz
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
              <p className="text-sm text-gray-500">{minRead} min quiz</p>
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
          <h1 className="w-full lg:w-[30%] text-2xl sm:text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-600 to-red-600 drop-shadow-sm mt-4">
            {title}
          </h1>

          <div className="w-full lg:flex-1">
            <ProgressBar
              currentIndex={currentIndex}
              total={cards.length}
              progress={progress}
              knownCount={knownCount}
              unknownCount={unknownCount}
              totalAnswered={totalAnswered}
              showStats={showStats}
              toggleStats={() => setShowStats(!showStats)}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-2 lg:px-8 flex flex-col lg:flex-row items-start lg:items-stretch gap-6">
        <div className="w-full lg:w-[80%]">
          {/* Flashcard Container */}
          <div className="relative w-full perspective-1000 mb-8">
            <div
              className={`relative w-full h-[28rem] lg:h-[32rem] transition-all duration-500 ease-in-out transform-style-preserve-3d cursor-pointer ${
                isFlipped ? "rotate-y-180" : ""
              } ${slideDirection} ${isShuffling ? "is-shuffling" : ""}`}
              onClick={flipCard}
            >
              {/* Front of card (Question) */}
              <div className="absolute inset-0 w-full h-full backface-hidden rounded-3xl bg-white/90 backdrop-blur-sm shadow-xl border border-gray-200/50 ">
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-pink-400/10 to-purple-400/10 rounded-full translate-y-12 -translate-x-12" />

                {/* Card status indicator */}
                {(isCurrentCardKnown || isCurrentCardUnknown) && (
                  <div className="absolute top-4 right-4">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        isCurrentCardKnown ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {isCurrentCardKnown ? (
                        <Check size={14} className="text-white" />
                      ) : (
                        <X size={14} className="text-white" />
                      )}
                    </div>
                  </div>
                )}

                <div className="relative p-8 h-full flex flex-col justify-center">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl mb-6">
                      <BookOpen className="text-white" size={24} />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-6">
                      Question
                    </h2>
                    <p className="text-gray-700 text-xl leading-relaxed font-medium max-w-2xl mx-auto">
                      {currentCard.question}
                    </p>
                  </div>
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                      <span>Click to reveal answer</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back of card (Answer) */}
              <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-3xl bg-white/90 backdrop-blur-sm shadow-xl border border-gray-200/50 ">
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-teal-400/10 to-green-400/10 rounded-full translate-y-12 -translate-x-12" />

                {/* Card status indicator */}
                {(isCurrentCardKnown || isCurrentCardUnknown) && (
                  <div className="absolute top-4 right-4">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        isCurrentCardKnown ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {isCurrentCardKnown ? (
                        <Check size={14} className="text-white" />
                      ) : (
                        <X size={14} className="text-white" />
                      )}
                    </div>
                  </div>
                )}

                <div className="relative p-8 h-full flex flex-col justify-center">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl mb-6">
                      <Sparkles className="text-white" size={24} />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-6">
                      Answer
                    </h2>
                    <p className="text-gray-700 text-xl leading-relaxed font-medium max-w-2xl mx-auto">
                      {currentCard.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Controls - 2x2 Grid */}
        <div
          className={cn(
            "w-full lg:w-[20%] grid gap-3 lg:gap-4 xl:gap-5 h-[14rem] sm:h-[24rem] lg:h-[32rem]",
            demoMode ? "grid-cols-1 grid-rows-4" : "grid-cols-2"
          )}
        >
          {/* Previous Button */}
          <button
            onClick={prevCard}
            disabled={currentIndex === 0}
            className={`flex items-center justify-center w-full rounded-xl lg:rounded-2xl transition-all duration-300 ${
              currentIndex === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white hover:bg-purple-50 text-purple-600 hover:text-purple-700 shadow-lg hover:shadow-xl hover:scale-105 border-2 border-purple-200"
            }`}
            title="Previous Card"
          >
            <ChevronLeft size={24} className="lg:w-8 lg:h-8" />
          </button>

          {/* Action Button (I Know / Don't Know) */}
          {!isFlipped ? (
            <button
              onClick={markAsKnown}
              className={`flex flex-col items-center justify-center gap-1 lg:gap-2 w-full rounded-xl lg:rounded-2xl transition-all duration-300 ${
                currentIndex === cards.length - 1
                  ? "bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl hover:scale-105"
                  : "bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl hover:scale-105"
              }`}
            >
              <Check size={20} className="lg:w-7 lg:h-7" />
              <span className="font-semibold text-xs lg:text-sm xl:text-base">
                I Know
              </span>
            </button>
          ) : (
            <button
              onClick={markAsUnknown}
              className="flex flex-col items-center justify-center gap-1 lg:gap-2 w-full rounded-xl lg:rounded-2xl bg-red-500 hover:bg-red-600 text-white transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <X size={20} className="lg:w-7 lg:h-7" />
              <span className="font-semibold text-xs lg:text-sm xl:text-base">
                Don&#39;t Know
              </span>
            </button>
          )}

          {/* Shuffle Button */}
          <button
            onClick={shuffleCards}
            className="flex items-center justify-center w-full rounded-xl lg:rounded-2xl bg-purple-300 hover:bg-purple-400 text-white transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            title="Shuffle Cards"
          >
            <Shuffle size={20} className="lg:w-7 lg:h-7" />
          </button>

          {/* Reset Button */}
          <button
            onClick={resetCards}
            className="flex items-center justify-center w-full rounded-xl lg:rounded-2xl bg-purple-200 hover:bg-purple-300 text-purple-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            title="Reset Progress"
          >
            <RotateCcw size={20} className="lg:w-7 lg:h-7" />
          </button>
        </div>
      </div>
    </div>
  );
}
