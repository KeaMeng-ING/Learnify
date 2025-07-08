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
  BarChart3,
} from "lucide-react";
import Confetti from "react-confetti";
import { Button } from "@/components/ui/button";
import BgGradient from "@/components/layout/BgGradient";
import ProgressBar from "@/components/flashcards/ProgressBar";

type Quiz = {
  id: string;
  question: string;
  answer: string;
  quizId: string;
};

export default function FlashcardApp() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cards, setCards] = useState<Quiz[]>([]);

  const [isShuffling, setIsShuffling] = useState(false);
  const [slideDirection, setSlideDirection] = useState("");
  const [knownCards, setKnownCards] = useState(new Set());
  const [unknownCards, setUnknownCards] = useState(new Set());
  const [showStats, setShowStats] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [hasCelebrated, setHasCelebrated] = useState(false);

  useEffect(() => {
    const fetchFlashcards = async () => {
      const res = await fetch("/api/upload");
      if (!res.ok) {
        console.error("Failed to load flashcards");
        return;
      }
      const data = await res.json();
      setCards(data.questions);
    };

    fetchFlashcards();
  }, []);

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const currentCard = cards[currentIndex];
  if (!currentCard) return null; // safeguard

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
          setHasCelebrated(true); // Mark as celebrated
          setTimeout(() => setShowConfetti(false), 5000);
        }
      }, 200);
    } else {
      if (!hasCelebrated) {
        setShowCelebration(true);
        setShowConfetti(true);
        setHasCelebrated(true); // Mark as celebrated
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
    setHasCelebrated(false); // Reset celebration flag
  };
  const shuffleCards = () => {
    setIsShuffling(true);
    setTimeout(() => {
      const shuffled = [...cards].sort(() => Math.random() - 0.5);
      setCards(shuffled);
      setCurrentIndex(0);
      setIsFlipped(false);
      setIsShuffling(false);
    }, 600);
  };

  const progress = ((currentIndex + 1) / cards.length) * 100;
  const knownCount = knownCards.size;
  const unknownCount = unknownCards.size;
  const totalAnswered = knownCount + unknownCount;

  const isCurrentCardKnown = knownCards.has(currentCard.id);
  const isCurrentCardUnknown = unknownCards.has(currentCard.id);

  return (
    <div className="h-screen relative overflow-hidden ">
      {/* Background decoration */}
      <BgGradient />

      {/* Main Content */}
      <div className="relative z-10 px-4 flex flex-col items-center justify-center min-h-screen max-w-4xl mx-auto ">
        {/* Progress Bar */}
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

        {/* Flashcard Container */}
        <div className="relative w-full perspective-1000 mb-8">
          <div
            className={`relative w-full h-96 transition-all duration-500 ease-in-out transform-style-preserve-3d cursor-pointer ${
              isFlipped ? "rotate-y-180" : ""
            } ${slideDirection} ${isShuffling ? "animate-bounce" : ""}`}
            onClick={flipCard}
          >
            {/* Front of card (Question) */}
            <div className="absolute inset-0 w-full h-full backface-hidden rounded-3xl bg-white/90 backdrop-blur-sm shadow-xl border border-gray-200/50 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/10 to-blue-400/10 rounded-full -translate-y-16 translate-x-16" />
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
            <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-3xl bg-white/90 backdrop-blur-sm shadow-xl border border-gray-200/50 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/10 to-emerald-400/10 rounded-full -translate-y-16 translate-x-16" />
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

        {/* Navigation Controls */}
        <div className="flex justify-center items-center gap-4 ">
          <button
            onClick={prevCard}
            disabled={currentIndex === 0}
            className={`flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ${
              currentIndex === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white/80 hover:bg-white text-gray-700 hover:text-gray-900 shadow-lg hover:shadow-xl hover:scale-105 border border-gray-200/50"
            }`}
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex gap-3">
            <button
              onClick={shuffleCards}
              className="flex items-center justify-center w-12 h-12 rounded-2xl bg-purple-500 hover:bg-purple-600 text-white transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              title="Shuffle Cards"
            >
              <Shuffle size={18} />
            </button>

            <button
              onClick={resetCards}
              className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              title="Reset Progress"
            >
              <RotateCcw size={18} />
            </button>
          </div>

          {!isFlipped ? (
            <button
              onClick={markAsKnown}
              // remove disabled or modify condition
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl transition-all duration-300 ${
                // no disabling, just styling change if last card
                currentIndex === cards.length - 1
                  ? "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl hover:scale-105"
                  : "bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl hover:scale-105"
              }`}
            >
              <Check size={18} />
              <span className="font-medium">I know this</span>
            </button>
          ) : (
            <button
              onClick={markAsUnknown}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-red-500 hover:bg-red-600 text-white transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <X size={18} />
              <span className="font-medium">I don't know this</span>
            </button>
          )}
        </div>
      </div>

      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          {showConfetti && (
            <Confetti width={window.innerWidth} height={window.innerHeight} />
          )}
          <div className="relative bg-white/90 backdrop-blur-lg p-8 rounded-3xl shadow-2xl text-center max-w-sm w-full animate-scale-in">
            {/* Close Button */}
            <Button
              onClick={() => setShowCelebration(false)}
              className="absolute top-4 right-4 p-2 rounded-full  text-black  transition "
              aria-label="Close celebration"
            >
              <X size={24} className="flex-shrink-0" />
            </Button>

            <h2 className="text-3xl font-extrabold text-purple-700 mb-4">
              🎉 Well Done!
            </h2>
            <p className="text-gray-700 text-lg mb-4">
              You’ve mastered all the flashcards.
            </p>
            <p className="text-gray-600 mb-6">
              Keep learning and try new quizzes to expand your knowledge!
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={resetCards}
                className="flex-1 px-5 py-3 rounded-xl bg-purple-500 hover:bg-purple-700 text-white font-semibold shadow-md transition-all"
              >
                🔁 Restart Practice
              </button>
              <button
                onClick={() => (window.location.href = "/quizzes")}
                className="flex-1 px-5 py-3 rounded-xl bg-blue-400 hover:bg-blue-600 text-white font-semibold shadow-md transition-all"
              >
                📚 All Quizzes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
