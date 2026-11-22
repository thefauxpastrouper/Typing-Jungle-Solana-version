import React, { useState } from 'react';
import { Star, Lock, CheckCircle, Play, Sparkles, BookOpen, ChevronRight, Layers, FileCode } from 'lucide-react';
import { Lesson } from './TypingStage';

export interface Chapter {
  id: number;
  title: string;
  slug: string;
  description: string;
  icon: string;
  lessonCount: number;
  modules: string[];
}

export interface UserProgress {
  completedLessons: Record<number, { stars: number; wpm: number; accuracy: number }>;
  currentLessonId: number;
}

interface CourseMapProps {
  chapters: Chapter[];
  lessons: Lesson[];
  progress: UserProgress;
  onSelectLesson: (lesson: Lesson) => void;
  metadata: {
    version: string;
    totalLessons: number;
    totalModulesCovered: number;
  };
}

export const CourseMap: React.FC<CourseMapProps> = ({
  chapters,
  lessons,
  progress,
  onSelectLesson,
  metadata
}) => {
  const [selectedChapterId, setSelectedChapterId] = useState<number>(1);
  const [filterModule, setFilterModule] = useState<string>('all');

  const currentChapter = chapters.find((c) => c.id === selectedChapterId) || chapters[0];

  // Filter lessons for current chapter
  const chapterLessons = lessons.filter((l) => {
    if (l.chapterId !== selectedChapterId) return false;
    if (filterModule !== 'all' && l.module !== filterModule) return false;
    return true;
  });

  // Calculate chapter stats
  const chapterCompletedCount = chapterLessons.filter(
    (l) => progress.completedLessons[l.id]
  ).length;

  const totalStarsInChapter = chapterLessons.reduce((acc, l) => {
    return acc + (progress.completedLessons[l.id]?.stars || 0);
  }, 0);

  // Winding snake path geometry helper
  // We calculate x positions for nodes that oscillate in a smooth sine wave:
  // node index i -> xOffset = Math.sin(i * 0.5) * 140
  const getNodePosition = (index: number) => {
    const amplitude = 120; // horizontal swing
    const x = Math.sin(index * 0.45) * amplitude;
    return x;
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f3f0]">
      {/* Chapter Selection Bar */}
      <div className="sticky top-16 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm py-2 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Chapter Tabs Carousel */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {chapters.map((ch) => {
              const isSelected = ch.id === selectedChapterId;
              const chLessons = lessons.filter((l) => l.chapterId === ch.id);
              const done = chLessons.filter((l) => progress.completedLessons[l.id]).length;
              const isComplete = done === chLessons.length && chLessons.length > 0;

              return (
                <button
                  key={ch.id}
                  onClick={() => {
                    setSelectedChapterId(ch.id);
                    setFilterModule('all');
                  }}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <span>Ch {ch.id}</span>
                  <span className="hidden md:inline font-medium opacity-90 truncate max-w-[120px]">
                    {ch.title.split('(')[0]}
                  </span>
                  {isComplete ? (
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-blue-700' : 'bg-slate-200'}`}>
                      {done}/{chLessons.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Module Filter Dropdown */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-400 font-medium">Filter Module:</span>
            <select
              value={filterModule}
              onChange={(e) => setFilterModule(e.target.value)}
              className="text-xs font-mono bg-slate-100 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Modules ({currentChapter.modules.length})</option>
              {currentChapter.modules.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Roadmap Arena */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        {/* Chapter Header Card */}
        <div className="bg-gradient-to-br from-[#122947] to-[#1e3a5f] rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-12 relative overflow-hidden border border-slate-700">
          <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider border border-blue-400/20">
                  Chapter {currentChapter.id} of {chapters.length}
                </span>
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-400/20">
                  Agave {metadata.version}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
                {currentChapter.title}
              </h2>
              <p className="text-sm sm:text-base text-slate-300 max-w-xl">
                {currentChapter.description}
              </p>
            </div>

            {/* Chapter Metrics Badge */}
            <div className="flex sm:flex-col justify-around gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 shrink-0">
              <div className="text-center">
                <span className="text-2xl font-black text-amber-400 block">{totalStarsInChapter}</span>
                <span className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Stars Earned</span>
              </div>
              <div className="text-center">
                <span className="text-2xl font-black text-emerald-400 block">
                  {chapterCompletedCount}/{chapterLessons.length}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Completed</span>
              </div>
            </div>
          </div>

          {/* Module Pills List */}
          <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-slate-400 mr-2 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" /> Modules:
            </span>
            {currentChapter.modules.slice(0, 15).map((mod) => (
              <span
                key={mod}
                className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-white/10 text-slate-200 border border-white/5"
              >
                {mod}
              </span>
            ))}
            {currentChapter.modules.length > 15 && (
              <span className="text-[11px] text-slate-400">
                +{currentChapter.modules.length - 15} more crates
              </span>
            )}
          </div>
        </div>

        {/* The Famous Winding Snake Lesson Trail */}
        <div className="relative py-8 flex flex-col items-center">
          {chapterLessons.map((lesson, idx) => {
            const result = progress.completedLessons[lesson.id];
            const isCompleted = !!result;
            // First lesson of chapter is always unlocked, or if previous is completed
            const isUnlocked = idx === 0 || !!progress.completedLessons[chapterLessons[idx - 1]?.id];
            const isCurrent = isUnlocked && !isCompleted;
            const xOffset = getNodePosition(idx);

            return (
              <div
                key={lesson.id}
                className="relative my-4 flex flex-col items-center transition-all duration-200"
                style={{ transform: `translateX(${xOffset}px)` }}
              >
                {/* Connecting Trail Line to next node */}
                {idx < chapterLessons.length - 1 && (
                  <div
                    className="absolute top-16 left-1/2 -translate-x-1/2 w-1.5 h-12 rounded-full -z-0 opacity-40"
                    style={{
                      backgroundColor: isCompleted ? '#3b82f6' : '#cbd5e1'
                    }}
                  />
                )}

                {/* Level Circle Node */}
                <button
                  disabled={!isUnlocked}
                  onClick={() => onSelectLesson(lesson)}
                  className={`group relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex flex-col items-center justify-center font-black transition-all duration-200 z-10 cursor-pointer ${
                    isCompleted
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/40 hover:scale-105'
                      : isCurrent
                      ? 'bg-amber-400 hover:bg-amber-500 text-slate-900 shadow-xl ring-4 ring-amber-300 ring-offset-4 ring-offset-[#f5f3f0] animate-pulse hover:scale-110'
                      : 'bg-slate-300 text-slate-400 cursor-not-allowed opacity-75'
                  }`}
                  title={`${lesson.title} (${lesson.file})`}
                >
                  {isCompleted ? (
                    <span className="text-xl sm:text-2xl font-black">{lesson.id}</span>
                  ) : isCurrent ? (
                    <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-slate-900 ml-1" />
                  ) : (
                    <Lock className="w-6 h-6 text-slate-500" />
                  )}

                  {/* Level Number Pill */}
                  <span
                    className={`absolute -top-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      isCompleted
                        ? 'bg-blue-800 text-blue-200'
                        : isCurrent
                        ? 'bg-slate-900 text-amber-300'
                        : 'bg-slate-400 text-slate-200'
                    }`}
                  >
                    #{lesson.id}
                  </span>
                </button>

                {/* Stars Rating below the node */}
                <div className="flex items-center gap-0.5 mt-2 h-4">
                  {[1, 2, 3, 4, 5].map((starIdx) => {
                    const filled = isCompleted && starIdx <= (result?.stars || 0);
                    return (
                      <Star
                        key={starIdx}
                        className={`w-3.5 h-3.5 ${
                          filled ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                        }`}
                      />
                    );
                  })}
                </div>

                {/* Lesson Title & Module Tooltip preview */}
                <div className="mt-1 text-center max-w-[160px]">
                  <span className="text-xs font-bold text-slate-700 block truncate">
                    {lesson.title}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 block truncate">
                    {lesson.module}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};
