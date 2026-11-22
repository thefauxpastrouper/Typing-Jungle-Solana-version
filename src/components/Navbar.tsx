import React, { useState } from 'react';
import { Star, Trophy, Volume2, VolumeX, RotateCcw, Compass, BookOpen, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface NavbarProps {
  totalStars: number;
  completedCount: number;
  totalLessons: number;
  avgWpm: number;
  avgAccuracy: number;
  version: string;
  onOpenCurriculumDrawer: () => void;
  onResetProgress: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  totalStars,
  completedCount,
  totalLessons,
  avgWpm,
  avgAccuracy,
  version,
  onOpenCurriculumDrawer,
  onResetProgress
}) => {
  const [isMuted, setIsMuted] = useState(sounds.isMuted());

  const toggleSound = () => {
    const muted = sounds.toggleMuted();
    setIsMuted(muted);
  };

  const progressPct = Math.min(100, Math.round((completedCount / (totalLessons || 1)) * 100));

  return (
    <nav className="sticky top-0 z-40 bg-[#122947] text-white border-b border-slate-700 shadow-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 flex items-center justify-center shadow-lg">
            {/* Jungle Tree / Solana Icon */}
            <span className="text-xl">🌴</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg sm:text-xl tracking-tight leading-none text-white">
                Typing<span className="text-amber-400">Jungle</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                Solana Agave {version}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 tracking-wide block -mt-0.5">
              Codebase Edition • 1,754 Lessons • 134 Modules
            </span>
          </div>
        </div>

        {/* Global Progress Metrics */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <div>
              <span className="text-sm font-black text-white">{totalStars}</span>
              <span className="text-[10px] text-slate-400 block -mt-1 uppercase">Stars</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <div>
              <span className="text-sm font-black text-white">{completedCount} / {totalLessons}</span>
              <span className="text-[10px] text-slate-400 block -mt-1 uppercase">Lessons ({progressPct}%)</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-400" />
            <div>
              <span className="text-sm font-black text-white">{avgWpm}</span>
              <span className="text-[10px] text-slate-400 block -mt-1 uppercase">Avg WPM</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-purple-400" />
            <div>
              <span className="text-sm font-black text-white">{avgAccuracy}%</span>
              <span className="text-[10px] text-slate-400 block -mt-1 uppercase">Accuracy</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCurriculumDrawer}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">All Chapters</span>
          </button>

          <button
            onClick={toggleSound}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={onResetProgress}
            className="p-2 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
            title="Reset All Progress"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
};
