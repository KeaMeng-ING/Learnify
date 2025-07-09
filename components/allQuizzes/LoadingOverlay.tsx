import React from "react";
import { BookOpen, Sparkles, RotateCcw } from "lucide-react";

const loading = () => {
  return (
    <div className="fixed inset-0 z-[9999] h-screen  overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Main Loading Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Loading Card Animation */}
        <div className="mb-8 relative">
          {/* Background cards for depth */}
          <div className="absolute inset-0 w-80 h-48 bg-white/30 rounded-2xl transform rotate-3 scale-95 blur-sm" />
          <div className="absolute inset-0 w-80 h-48 bg-white/40 rounded-2xl transform -rotate-2 scale-97 blur-sm" />

          {/* Main loading card */}
          <div className="relative w-80 h-48 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50 overflow-hidden">
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-shimmer" />

            {/* Card content */}
            <div className="relative p-6 h-full flex flex-col items-center justify-center">
              {/* Rotating icon */}
              <div className="relative mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center animate-spin-slow">
                  <BookOpen className="text-white" size={28} />
                </div>
                {/* Orbiting sparkles */}
                <div className="absolute inset-0 animate-spin">
                  <Sparkles
                    className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-yellow-400"
                    size={16}
                  />
                </div>
                <div className="absolute inset-0 animate-spin animation-delay-1000">
                  <Sparkles
                    className="absolute top-1/2 -right-2 transform -translate-y-1/2 text-pink-400"
                    size={12}
                  />
                </div>
                <div className="absolute inset-0 animate-spin animation-delay-2000">
                  <Sparkles
                    className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-purple-400"
                    size={14}
                  />
                </div>
              </div>

              {/* Loading text */}
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Loading Flashcards
              </h2>
              <p className="text-gray-600 text-center text-sm">
                Preparing your learning experience...
              </p>
            </div>
          </div>
        </div>

        {/* Animated Progress Dots */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" />
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-200" />
          <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce delay-400" />
        </div>
      </div>
    </div>
  );
};

export default loading;
