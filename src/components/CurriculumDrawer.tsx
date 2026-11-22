import React, { useState } from 'react';
import { X, Search, CheckCircle, Star, BookOpen, Layers, Terminal, Settings, Code, Cpu, Database, ShieldCheck, Network, Sliders, Lock } from 'lucide-react';
import { Chapter, UserProgress } from './CourseMap';
import { Lesson } from './TypingStage';

interface CurriculumDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  chapters: Chapter[];
  lessons: Lesson[];
  progress: UserProgress;
  onSelectLesson: (lesson: Lesson) => void;
}

export const CurriculumDrawer: React.FC<CurriculumDrawerProps> = ({
  isOpen,
  onClose,
  chapters,
  lessons,
  progress,
  onSelectLesson
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChapterTab, setActiveChapterTab] = useState<number>(1);

  if (!isOpen) return null;

  const filteredLessons = lessons.filter((l) => {
    if (!searchQuery) return l.chapterId === activeChapterTab;
    const q = searchQuery.toLowerCase();
    return (
      l.title.toLowerCase().includes(q) ||
      l.module.toLowerCase().includes(q) ||
      l.file.toLowerCase().includes(q) ||
      l.id.toString() === q
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              Solana Agave Curriculum Browser
            </h2>
            <p className="text-xs text-slate-500">
              Explore 1,754 lessons across 11 chapters and 134 modules
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by module (e.g. poh, accounts-db, Cargo.toml) or lesson #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-100 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-mono"
            />
          </div>
        </div>

        {/* Chapter Tabs Carousel (hidden if search query active) */}
        {!searchQuery && (
          <div className="flex items-center gap-1.5 p-3 overflow-x-auto no-scrollbar border-b border-slate-200 bg-slate-50">
            {chapters.map((ch) => (
              <button
                key={ch.id}
                onClick={() => setActiveChapterTab(ch.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeChapterTab === ch.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                Ch {ch.id}: {ch.title.split('(')[0]}
              </button>
            ))}
          </div>
        )}

        {/* Lessons List View */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100">
          {filteredLessons.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p>No lessons found matching your search.</p>
            </div>
          ) : (
            filteredLessons.map((l) => {
              const result = progress.completedLessons[l.id];
              const isCompleted = !!result;

              return (
                <div
                  key={l.id}
                  onClick={() => {
                    onSelectLesson(l);
                    onClose();
                  }}
                  className="py-3 px-3 hover:bg-blue-50/70 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-4 group"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-800 font-black'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {l.id}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                          {l.title}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          {l.module}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-slate-400">
                          {l.language}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-mono truncate max-w-md mt-0.5">
                        {l.file}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {isCompleted && (
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3 h-3 ${
                              s <= result.stars
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                    <span className="text-xs font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      Start →
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
