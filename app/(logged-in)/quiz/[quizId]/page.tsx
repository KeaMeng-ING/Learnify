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

const mockFlashcards = [
  {
    id: 1,
    question: "What is the purpose of the App Router in Next.js 13+?",
    answer:
      "The App Router provides a new way to structure pages with layouts, nested routes, and better server-side rendering capabilities.",
  },
  {
    id: 2,
    question: "Explain server components in Next.js.",
    answer:
      "Server components allow rendering parts of the UI on the server, reducing client-side bundle size and improving performance.",
  },
  {
    id: 3,
    question: "What are React Server Components?",
    answer:
      "React Server Components are a new paradigm that allows components to be rendered on the server, sending only the rendered output to the client.",
  },
  {
    id: 4,
    question: "How does Next.js handle API routes?",
    answer:
      "Next.js API routes allow you to create serverless functions that handle HTTP requests, providing a full-stack solution within your Next.js application.",
  },
  {
    id: 5,
    question: "What is the difference between SSR and SSG in Next.js?",
    answer:
      "SSR (Server-Side Rendering) renders pages on each request, while SSG (Static Site Generation) pre-renders pages at build time for better performance.",
  },
];

export default function FlashcardApp() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cards, setCards] = useState(mockFlashcards);
  const [isShuffling, setIsShuffling] = useState(false);
  const [slideDirection, setSlideDirection] = useState("");
  const [knownCards, setKnownCards] = useState(new Set());
  const [unknownCards, setUnknownCards] = useState(new Set());
  const [showStats, setShowStats] = useState(false);

  const currentCard = cards[currentIndex];

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

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
        setCurrentIndex(currentIndex + 1);
        setIsFlipped(false);
        setSlideDirection("");
      }, 200);
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl" />
        <div className="absolute top-40 right-20 w-48 h-48 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/3 w-56 h-56 bg-pink-200/20 rounded-full blur-3xl" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-4 max-w-4xl mx-auto pt-6">
        {/* Progress Bar */}
        <div className="mb-8 bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
          <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
            <span className="font-medium">Progress</span>
            <div className="flex items-center gap-4">
              <span className="font-medium">
                {currentIndex + 1} / {cards.length}
              </span>
              <button
                onClick={() => setShowStats(!showStats)}
                className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <BarChart3 size={12} />
                Stats
              </button>
            </div>
          </div>
          <div className="w-full bg-gray-200/50 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Stats */}
          {showStats && (
            <div className="mt-4 pt-4 border-t border-gray-200/50">
              <div className="flex justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">Known: {knownCount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-gray-600">Unknown: {unknownCount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <span className="text-gray-600">
                    Unanswered: {cards.length - totalAnswered}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Flashcard Container */}
        <div className="relative perspective-1000 mb-8">
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
        <div className="flex justify-center items-center gap-4 mb-8">
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
              disabled={currentIndex === cards.length - 1}
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl transition-all duration-300 ${
                currentIndex === cards.length - 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
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
    </div>
  );
}
