import React from "react";
import { BookOpen, Sparkles, RotateCcw } from "lucide-react";

const loading = () => {
  return (
    <div className="h-screen relative overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large floating circles */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full animate-pulse" />
        <div className="absolute top-1/4 right-10 w-32 h-32 bg-gradient-to-br from-pink-400/20 to-purple-400/20 rounded-full animate-pulse delay-1000" />
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-teal-400/20 rounded-full animate-pulse delay-2000" />

        {/* Floating particles */}
        <div className="absolute top-1/3 left-1/5 w-3 h-3 bg-purple-400 rounded-full animate-bounce delay-500" />
        <div className="absolute top-2/3 right-1/4 w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-1500" />
        <div className="absolute bottom-1/4 left-2/3 w-4 h-4 bg-pink-400 rounded-full animate-bounce delay-700" />
      </div>

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

        {/* Loading Progress Bar */}
        <div className="w-80 bg-white/70 backdrop-blur-sm rounded-full h-2 overflow-hidden shadow-inner">
          <div className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 rounded-full animate-progress" />
        </div>

        {/* Loading Stats Preview */}
        <div className="mt-8 grid grid-cols-3 gap-4 w-80">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center border border-white/50">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg mx-auto mb-2 animate-pulse" />
            <p className="text-xs text-gray-600">Questions</p>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center border border-white/50">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg mx-auto mb-2 animate-pulse delay-500" />
            <p className="text-xs text-gray-600">Knowledge</p>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center border border-white/50">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-lg mx-auto mb-2 animate-pulse delay-1000" />
            <p className="text-xs text-gray-600">Progress</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default loading;
