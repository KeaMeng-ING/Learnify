"use client";

import React from "react";
import { BarChart3 } from "lucide-react";

type ProgressBarProps = {
  currentIndex: number;
  total: number;
  progress: number;
  knownCount: number;
  unknownCount: number;
  totalAnswered: number;
  showStats: boolean;
  toggleStats: () => void;
};

export default function ProgressBar({
  currentIndex,
  total,
  progress,
  knownCount,
  unknownCount,
  totalAnswered,
  showStats,
  toggleStats,
}: ProgressBarProps) {
  return (
    <div className="mb-4 lg:mb-8 w-full bg-white/70 backdrop-blur-sm rounded-xl p-3 lg:p-4 border border-gray-200/50">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 text-sm text-gray-600 mb-3">
        <span className="font-medium text-xs sm:text-sm">Progress</span>
        <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <span className="font-medium text-xs sm:text-sm">
            {currentIndex + 1} / {total}
          </span>
          <button
            onClick={toggleStats}
            className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <BarChart3 size={12} />
            <span className="hidden xs:inline">Stats</span>
          </button>
        </div>
      </div>

      <div className="w-full bg-gray-200/50 rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {showStats && (
        <div className="mt-4 pt-4 border-t border-gray-200/50">
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
              <span className="text-gray-600">Known: {knownCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full flex-shrink-0"></div>
              <span className="text-gray-600">Unknown: {unknownCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-400 rounded-full flex-shrink-0"></div>
              <span className="text-gray-600">
                Unanswered: {total - totalAnswered}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
