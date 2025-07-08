"use client";
import React, { useState } from "react";
import { ChevronLeft, RotateCcw, Shuffle, Check, X } from "lucide-react";

const Controls = (currentIndex) => {
  const [slideDirection, setSlideDirection] = useState("");
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

  return (
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
  );
};

export default Controls;
