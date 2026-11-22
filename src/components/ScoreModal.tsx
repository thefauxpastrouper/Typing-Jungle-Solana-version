import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Star, RefreshCw, ArrowRight, Map, CheckCircle2 } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface ScoreModalProps {
  wpm: number;
  accuracy: number;
  mistakes: number;
  timeSeconds: number;
  targetWpm: number;
  lessonId: number;
  lessonTitle: string;
  onRetry: () => void;
  onNext: () => void;
  onMap: () => void;
}

export const ScoreModal: React.FC<ScoreModalProps> = ({
  wpm,
  accuracy,
  mistakes,
  timeSeconds,
  targetWpm,
  lessonId,
  lessonTitle,
  onRetry,
  onNext,
  onMap
}) => {
  // Calculate stars: 1 to 5
  let stars = 1;
  if (accuracy >= 98 && wpm >= targetWpm * 1.2) {
    stars = 5;
  } else if (accuracy >= 95 && wpm >= targetWpm) {
    stars = 4;
  } else if (accuracy >= 92 && wpm >= targetWpm * 0.85) {
    stars = 3;
  } else if (accuracy >= 85) {
    stars = 2;
  }

  useEffect(() => {
    sounds.playFanfare(stars);

    if (stars >= 4) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onNext();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        onRetry();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onMap();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stars, onNext, onRetry, onMap]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 sm:p-8 text-center transform transition-all scale-100">
        {/* Header Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Lesson {lessonId} Completed
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-1 line-clamp-1">
          {lessonTitle}
        </h2>
        <p className="text-sm text-slate-500 mb-5">
          Great job! You just coded a piece of Solana Agave!
        </p>

        {/* 5 Stars Rating Animation */}
        <div className="flex justify-center items-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((index) => {
            const isEarned = index <= stars;
            return (
              <div
                key={index}
                className={`transition-all duration-300 transform ${
                  isEarned
                    ? 'text-amber-400 scale-110 drop-shadow-md animate-bounce'
                    : 'text-slate-200 scale-95'
                }`}
                style={{ animationDelay: `${index * 120}ms`, animationIterationCount: 1 }}
              >
                <Star
                  className={`w-9 h-9 sm:w-10 sm:h-10 ${
                    isEarned ? 'fill-amber-400' : 'fill-slate-100'
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white shadow-sm border border-slate-100">
            <span className="text-xs text-slate-400 font-medium">Speed</span>
            <span className="text-2xl font-black text-blue-600">{wpm}</span>
            <span className="text-[10px] text-slate-400">Words per minute</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white shadow-sm border border-slate-100">
            <span className="text-xs text-slate-400 font-medium">Accuracy</span>
            <span className={`text-2xl font-black ${accuracy >= 95 ? 'text-emerald-600' : accuracy >= 85 ? 'text-amber-600' : 'text-rose-600'}`}>
              {accuracy}%
            </span>
            <span className="text-[10px] text-slate-400">Key precision</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white shadow-sm border border-slate-100">
            <span className="text-xs text-slate-400 font-medium">Mistakes</span>
            <span className="text-lg font-bold text-slate-700">{mistakes}</span>
            <span className="text-[10px] text-slate-400">Errors made</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white shadow-sm border border-slate-100">
            <span className="text-xs text-slate-400 font-medium">Duration</span>
            <span className="text-lg font-bold text-slate-700">{formatTime(timeSeconds)}</span>
            <span className="text-[10px] text-slate-400">Time elapsed</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={onRetry}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Retry (R)
          </button>
          <button
            onClick={onNext}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            Next Lesson
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={onMap}
          className="mt-4 inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 font-medium transition-colors cursor-pointer"
        >
          <Map className="w-3.5 h-3.5" />
          Back to Course Map (Esc)
        </button>
      </div>
    </div>
  );
};
