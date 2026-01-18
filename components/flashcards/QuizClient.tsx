"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  BookOpen,
  Sparkles,
  Check,
  X,
  Calendar,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import BgGradient from "@/components/layout/BgGradient";

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
  const [slideDirection, setSlideDirection] = useState("");
  const [knownCards, setKnownCards] = useState(new Set<string>());
  const [unknownCards, setUnknownCards] = useState(new Set<string>());
  const [showCelebration, setShowCelebration] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [hasCelebrated, setHasCelebrated] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const STORAGE_KEY = `quiz_progress_${id}`;

  useEffect(() => {
    const loadProgress = () => {
      try {
        const savedProgress = localStorage.getItem(STORAGE_KEY);
        if (savedProgress) {
          const progress: QuizProgress = JSON.parse(savedProgress);
          const daysSinceUpdate =
            (Date.now() - progress.lastUpdated) / (1000 * 60 * 60 * 24);

          if (daysSinceUpdate < 30) {
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

  useEffect(() => {
    if (!isLoaded) return;

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

  const clearProgress = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing quiz progress:", error);
    }
  };

  const flipCard = () => setIsFlipped(!isFlipped);
  const currentCard = cards[currentIndex];

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
    clearProgress();
  };

  const knownCount = knownCards.size;
  const unknownCount = unknownCards.size;
  const isCurrentCardKnown = knownCards.has(currentCard?.id);
  const isCurrentCardUnknown = unknownCards.has(currentCard?.id);

  // Mark quiz as complete when all cards are answered
  useEffect(() => {
    if (!isLoaded || demoMode) return;

    const allAnswered = cards.every(
      (card) => knownCards.has(card.id) || unknownCards.has(card.id),
    );

    if (allAnswered && cards.length > 0) {
      markQuizAsComplete();
    }
  }, [knownCards, unknownCards, isLoaded, demoMode, cards]);

  const markQuizAsComplete = async () => {
    try {
      const response = await fetch("/api/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, type: "quiz" }),
      });

      if (!response.ok) {
        throw new Error("Failed to mark quiz as complete");
      }

      console.log("Quiz marked as complete");
    } catch (error) {
      console.error("Error marking quiz as complete:", error);
    }
  };

  if (!isLoaded) {
    return (
      <div className="h-screen relative overflow-hidden flex items-center justify-center">
        <div className="relative z-10 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your progress...</p>
        </div>
      </div>
    );
  }

  if (!currentCard) return null;

  return (
    <div className="h-screen w-full overflow-hidden flex flex-col ">
      {/* <BgGradient /> */}
      {!demoMode && (
        <BgGradient className="from-purple-500 via-cyan-500 to-blue-500" />
      )}
      <div className="container mx-auto px-2 lg:px-8 flex flex-col justify-start py-4 flex-shrink-0">
        <div className="flex flex-wrap justify-between items-center mb-2 w-full">
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
                  {Array.from({ length: cards.length }).map((_, index) => {
                    const cardId = cards[index].id;
                    const isKnown = knownCards.has(cardId);
                    const isUnknown = unknownCards.has(cardId);

                    return (
                      <div
                        key={index}
                        className={cn(
                          "h-2 flex-1 rounded-full transition-all duration-300",
                          isKnown && "bg-green-500",
                          isUnknown && "bg-red-500",
                          !isKnown &&
                            !isUnknown &&
                            index <= currentIndex &&
                            "bg-gray-400",
                          !isKnown &&
                            !isUnknown &&
                            index > currentIndex &&
                            "bg-gray-200",
                        )}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Known: {knownCount}</span>
                  <span>Unknown: {unknownCount}</span>
                </div>
              </div>

              {/* Card Content */}
              <div className="flex-1 overflow-y-auto min-h-0">
                <div
                  className={`relative w-full h-full transition-all duration-500 ease-in-out transform-style-preserve-3d cursor-pointer ${
                    isFlipped ? "rotate-y-180" : ""
                  }`}
                  onClick={flipCard}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Front - Question */}
                  <div
                    className="absolute inset-0 w-full h-full backface-hidden"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <div className="h-full flex flex-col justify-center items-center text-center px-4">
                      <h2 className="text-lg font-semibold text-gray-800 mb-6">
                        Question
                      </h2>
                      <p className="text-gray-700 text-lg leading-relaxed">
                        {currentCard.question}
                      </p>
                      <div className="mt-6">
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                          <span>Click to reveal answer</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Back - Answer */}
                  <div
                    className="absolute inset-0 w-full h-full backface-hidden"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    <div className="h-full flex flex-col justify-center items-center text-center px-4">
                      <h2 className="text-lg font-semibold text-gray-800 mb-6">
                        Answer
                      </h2>
                      <p className="text-gray-700 text-lg leading-relaxed">
                        {currentCard.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation and Actions */}
              <div className="flex flex-col gap-4 mt-4 pt-4 border-t border-gray-200 flex-shrink-0">
                {/* Navigation Buttons */}
                <div className="flex justify-between items-center">
                  <Button
                    onClick={prevCard}
                    disabled={currentIndex === 0}
                    className={cn(
                      "flex items-center justify-center transition-all duration-300 rounded-full w-10 h-10 p-0",
                      currentIndex === 0
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-purple-500 hover:bg-purple-600 text-white shadow-lg hover:shadow-xl",
                    )}
                  >
                    <ChevronLeft size={20} />
                  </Button>

                  <div className="text-sm text-gray-500">
                    Card {currentIndex + 1} of {cards.length}
                  </div>

                  <Button
                    onClick={nextCard}
                    disabled={currentIndex === cards.length - 1}
                    className={cn(
                      "flex items-center justify-center transition-all duration-300 rounded-full w-10 h-10 p-0",
                      currentIndex === cards.length - 1
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-purple-500 hover:bg-purple-600 text-white shadow-lg hover:shadow-xl",
                    )}
                  >
                    <ChevronRight size={20} />
                  </Button>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    onClick={markAsKnown}
                    className="bg-purple-500 hover:bg-purple-600 text-white flex flex-col items-center justify-center gap-1 h-16 rounded-xl"
                  >
                    <Check size={20} />
                    <span className="text-xs">Know</span>
                  </Button>

                  <Button
                    onClick={markAsUnknown}
                    className="bg-purple-100 hover:bg-purple-300 text-purple-700 flex flex-col items-center justify-center gap-1 h-16 rounded-xl"
                  >
                    <X size={20} />
                    <span className="text-xs">Don't</span>
                  </Button>

                  <Button
                    onClick={resetCards}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 flex flex-col items-center justify-center gap-1 h-16 rounded-xl"
                  >
                    <RotateCcw size={20} />
                    <span className="text-xs">Reset</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
