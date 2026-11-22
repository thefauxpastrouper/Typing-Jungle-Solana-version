import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ArrowLeft, RefreshCw, Volume2, VolumeX, Target, Zap, Clock, ShieldCheck } from 'lucide-react';
import { VirtualKeyboard } from './VirtualKeyboard';
import { HandsGuide } from './HandsGuide';
import { ScoreModal } from './ScoreModal';
import { getKeyDetailsForChar } from '../utils/keyboardMapping';
import { sounds } from '../utils/soundEffects';

export interface Lesson {
  id: number;
  chapterId: number;
  module: string;
  file: string;
  title: string;
  description: string;
  language: string;
  targetWpm: number;
  code: string;
}

interface TypingStageProps {
  lesson: Lesson;
  onBackToMap: () => void;
  onNextLesson: () => void;
  onSaveProgress: (lessonId: number, stars: number, wpm: number, accuracy: number) => void;
}

export const TypingStage: React.FC<TypingStageProps> = ({
  lesson,
  onBackToMap,
  onNextLesson,
  onSaveProgress
}) => {
  const code = lesson.code;
  const [cursorIndex, setCursorIndex] = useState(0);
  const [typedChars, setTypedChars] = useState<{ char: string; isCorrect: boolean }[]>([]);
  const [mistakesCount, setMistakesCount] = useState(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isMuted, setIsMuted] = useState(sounds.isMuted());

  const codeContainerRef = useRef<HTMLDivElement>(null);
  const activeCharRef = useRef<HTMLSpanElement>(null);

  // Timer loop
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (startTime && !isFinished) {
      interval = setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
      }, 500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [startTime, isFinished]);

  // Reset state when lesson changes
  useEffect(() => {
    setCursorIndex(0);
    setTypedChars([]);
    setMistakesCount(0);
    setTotalKeystrokes(0);
    setStartTime(null);
    setElapsedSeconds(0);
    setIsFinished(false);
  }, [lesson.id]);

  // Current target character details
  const currentTargetChar = cursorIndex < code.length ? code[cursorIndex] : '';
  const keyInfo = useMemo(() => getKeyDetailsForChar(currentTargetChar), [currentTargetChar]);

  // Auto-scroll to keep active character centered
  useEffect(() => {
    if (activeCharRef.current && codeContainerRef.current) {
      activeCharRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      });
    }
  }, [cursorIndex]);

  // Live Stats calculations
  const wpm = useMemo(() => {
    if (!startTime || elapsedSeconds < 1) return 0;
    const correctChars = typedChars.filter((c) => c.isCorrect).length;
    const minutes = elapsedSeconds / 60;
    return Math.max(0, Math.round(correctChars / 5 / minutes));
  }, [typedChars, startTime, elapsedSeconds]);

  const accuracy = useMemo(() => {
    if (totalKeystrokes === 0) return 100;
    const correctChars = typedChars.filter((c) => c.isCorrect).length;
    return Math.max(0, Math.min(100, Math.round((correctChars / totalKeystrokes) * 100)));
  }, [typedChars, totalKeystrokes]);

  // Keystroke listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFinished) return;

      // Ignore modifier keys alone
      if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab'].includes(e.key)) {
        if (e.key === 'Tab') e.preventDefault(); // prevent losing focus
        return;
      }

      // Handle Backspace
      if (e.key === 'Backspace') {
        e.preventDefault();
        if (cursorIndex > 0) {
          setCursorIndex((prev) => prev - 1);
          setTypedChars((prev) => prev.slice(0, -1));
          sounds.playKeyClick();
        }
        return;
      }

      // Ignore other non-character function keys
      if (e.key.length > 1 && e.key !== 'Enter') {
        return;
      }

      e.preventDefault();

      // Start timer on first keystroke
      if (!startTime) {
        setStartTime(Date.now());
      }

      const inputChar = e.key === 'Enter' ? '\n' : e.key;
      const expectedChar = code[cursorIndex];

      setTotalKeystrokes((prev) => prev + 1);

      if (inputChar === expectedChar) {
        sounds.playKeyClick(inputChar === ' ');
        setTypedChars((prev) => [...prev, { char: inputChar, isCorrect: true }]);
        const nextIndex = cursorIndex + 1;
        setCursorIndex(nextIndex);

        // Check if finished
        if (nextIndex >= code.length) {
          setIsFinished(true);
          const finalDuration = Math.max(1, Math.floor((Date.now() - (startTime || Date.now())) / 1000));
          const finalMinutes = finalDuration / 60;
          const finalWpm = Math.max(0, Math.round(code.length / 5 / finalMinutes));
          const finalAcc = Math.round((code.length / (totalKeystrokes + 1)) * 100);

          let stars = 1;
          if (finalAcc >= 98 && finalWpm >= lesson.targetWpm * 1.2) stars = 5;
          else if (finalAcc >= 95 && finalWpm >= lesson.targetWpm) stars = 4;
          else if (finalAcc >= 92 && finalWpm >= lesson.targetWpm * 0.85) stars = 3;
          else if (finalAcc >= 85) stars = 2;

          onSaveProgress(lesson.id, stars, finalWpm, finalAcc);
        }
      } else {
        sounds.playError();
        setMistakesCount((prev) => prev + 1);
        setTypedChars((prev) => [...prev, { char: inputChar, isCorrect: false }]);
        setCursorIndex((prev) => Math.min(code.length - 1, prev + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cursorIndex, code, isFinished, startTime, totalKeystrokes, lesson, onSaveProgress]);

  const toggleSound = () => {
    const muted = sounds.toggleMuted();
    setIsMuted(muted);
  };

  const handleRestart = () => {
    setCursorIndex(0);
    setTypedChars([]);
    setMistakesCount(0);
    setTotalKeystrokes(0);
    setStartTime(null);
    setElapsedSeconds(0);
    setIsFinished(false);
  };

  const progressPercent = Math.min(100, Math.round((cursorIndex / code.length) * 100));

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f3f0] text-slate-800">
      {/* Top Header / HUD */}
      <header className="sticky top-0 z-30 bg-[#122947] text-white shadow-md border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between">
          {/* Back button and Lesson info */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToMap}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Return to Course Map"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                  Lesson {lesson.id}
                </span>
                <span className="text-xs font-mono text-cyan-300 bg-cyan-900/40 px-2 py-0.5 rounded-md border border-cyan-700/40">
                  {lesson.module}
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline truncate max-w-[200px]">
                  {lesson.file}
                </span>
              </div>
              <h1 className="text-sm sm:text-base font-bold text-white line-clamp-1">
                {lesson.title}
              </h1>
            </div>
          </div>

          {/* Live Performance Gauges */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-1.5 text-center">
              <Zap className="w-4 h-4 text-blue-400" />
              <div>
                <span className="text-base sm:text-lg font-black text-white">{wpm}</span>
                <span className="text-[10px] text-slate-400 block -mt-1 uppercase tracking-wider">WPM</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-center">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-base sm:text-lg font-black text-white">{accuracy}%</span>
                <span className="text-[10px] text-slate-400 block -mt-1 uppercase tracking-wider">Accuracy</span>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-center">
              <Target className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-base sm:text-lg font-bold text-slate-300">{lesson.targetWpm}</span>
                <span className="text-[10px] text-slate-400 block -mt-1 uppercase tracking-wider">Goal</span>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-1.5 text-center">
              <Clock className="w-4 h-4 text-purple-400" />
              <div>
                <span className="text-base sm:text-lg font-bold text-slate-300">{elapsedSeconds}s</span>
                <span className="text-[10px] text-slate-400 block -mt-1 uppercase tracking-wider">Time</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1 border-l border-slate-700 pl-3">
              <button
                onClick={toggleSound}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button
                onClick={handleRestart}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Restart Lesson"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Lesson Progress Bar */}
        <div className="w-full bg-slate-800 h-1">
          <div
            className="bg-gradient-to-r from-blue-500 to-cyan-400 h-1 transition-all duration-150"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </header>

      {/* Main Typing Area */}
      <main className="flex-1 flex flex-col justify-between max-w-5xl w-full mx-auto p-4 sm:p-6">
        {/* Code Canvas Box */}
        <div
          ref={codeContainerRef}
          className="relative bg-white rounded-2xl shadow-md border border-slate-200 p-5 sm:p-7 min-h-[160px] max-h-[260px] overflow-y-auto font-mono text-sm sm:text-base leading-relaxed tracking-wide select-none"
        >
          <div className="whitespace-pre-wrap break-all">
            {code.split('').map((char, idx) => {
              const isTyped = idx < cursorIndex;
              const isCurrent = idx === cursorIndex;
              const typedInfo = typedChars[idx];

              if (isTyped) {
                return (
                  <span
                    key={idx}
                    className={
                      typedInfo?.isCorrect
                        ? 'text-slate-400 bg-slate-100/60 rounded-[2px]'
                        : 'text-white bg-red-500 font-bold px-0.5 rounded-[2px]'
                    }
                  >
                    {char === '\n' ? '↵\n' : char}
                  </span>
                );
              }

              if (isCurrent) {
                return (
                  <span
                    key={idx}
                    ref={activeCharRef}
                    className="relative inline-block text-blue-900 bg-blue-100 font-bold border-b-2 border-blue-600 rounded-[2px] shadow-sm animate-pulse"
                  >
                    {char === '\n' ? '↵\n' : char === ' ' ? '␣' : char}
                  </span>
                );
              }

              return (
                <span key={idx} className="text-slate-800">
                  {char}
                </span>
              );
            })}
          </div>
        </div>

        {/* Dynamic Interactive Keyboard & Hands Guide */}
        <div className="mt-4 flex flex-col items-center">
          <VirtualKeyboard
            activeKeyCode={keyInfo?.code || null}
            shiftKeyCode={keyInfo?.shiftKey || null}
            activeFinger={keyInfo?.finger || null}
          />

          <HandsGuide
            activeFinger={keyInfo?.finger || null}
            shiftFinger={
              keyInfo?.shiftKey === 'ShiftLeft'
                ? 'lp'
                : keyInfo?.shiftKey === 'ShiftRight'
                ? 'rp'
                : null
            }
          />
        </div>
      </main>

      {/* Score Modal on Finish */}
      {isFinished && (
        <ScoreModal
          wpm={wpm}
          accuracy={accuracy}
          mistakes={mistakesCount}
          timeSeconds={elapsedSeconds}
          targetWpm={lesson.targetWpm}
          lessonId={lesson.id}
          lessonTitle={lesson.title}
          onRetry={handleRestart}
          onNext={onNextLesson}
          onMap={onBackToMap}
        />
      )}
    </div>
  );
};
