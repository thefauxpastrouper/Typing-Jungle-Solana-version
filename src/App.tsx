import React, { useState, useEffect } from 'react';
import curriculumData from './data/curriculum.json';
import { Navbar } from './components/Navbar';
import { CourseMap, UserProgress } from './components/CourseMap';
import { TypingStage, Lesson } from './components/TypingStage';
import { CurriculumDrawer } from './components/CurriculumDrawer';

export const App: React.FC = () => {
  const { metadata, chapters, lessons } = curriculumData as unknown as {
    metadata: {
      name: string;
      repo: string;
      version: string;
      baseCommit: string;
      totalLessons: number;
      totalChapters: number;
      totalModulesCovered: number;
    };
    chapters: any[];
    lessons: Lesson[];
  };

  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Load progress from localStorage
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem('typing_jungle_agave_progress');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      completedLessons: {},
      currentLessonId: 1
    };
  });

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('typing_jungle_agave_progress', JSON.stringify(progress));
  }, [progress]);

  const handleSaveProgress = (lessonId: number, stars: number, wpm: number, accuracy: number) => {
    setProgress((prev) => {
      const current = prev.completedLessons[lessonId];
      const bestStars = Math.max(current?.stars || 0, stars);
      const bestWpm = Math.max(current?.wpm || 0, wpm);
      const bestAcc = Math.max(current?.accuracy || 0, accuracy);

      return {
        ...prev,
        currentLessonId: Math.max(prev.currentLessonId, lessonId + 1),
        completedLessons: {
          ...prev.completedLessons,
          [lessonId]: {
            stars: bestStars,
            wpm: bestWpm,
            accuracy: bestAcc
          }
        }
      };
    });
  };

  const handleNextLesson = () => {
    if (!activeLesson) return;
    const nextLesson = lessons.find((l) => l.id === activeLesson.id + 1);
    if (nextLesson) {
      setActiveLesson(nextLesson);
    } else {
      setActiveLesson(null);
    }
  };

  const handleResetProgress = () => {
    if (window.confirm('Are you sure you want to reset all your progress and stars?')) {
      setProgress({
        completedLessons: {},
        currentLessonId: 1
      });
      localStorage.removeItem('typing_jungle_agave_progress');
      setActiveLesson(null);
    }
  };

  // Aggregated global stats
  const completedEntries = Object.values(progress.completedLessons);
  const completedCount = completedEntries.length;
  const totalStars = completedEntries.reduce((sum, item) => sum + item.stars, 0);
  const avgWpm =
    completedCount > 0
      ? Math.round(completedEntries.reduce((sum, item) => sum + item.wpm, 0) / completedCount)
      : 0;
  const avgAccuracy =
    completedCount > 0
      ? Math.round(completedEntries.reduce((sum, item) => sum + item.accuracy, 0) / completedCount)
      : 0;

  return (
    <div className="min-h-screen bg-[#f5f3f0] flex flex-col font-sans">
      {activeLesson ? (
        <TypingStage
          lesson={activeLesson}
          onBackToMap={() => setActiveLesson(null)}
          onNextLesson={handleNextLesson}
          onSaveProgress={handleSaveProgress}
        />
      ) : (
        <>
          <Navbar
            totalStars={totalStars}
            completedCount={completedCount}
            totalLessons={metadata.totalLessons}
            avgWpm={avgWpm}
            avgAccuracy={avgAccuracy}
            version={metadata.version}
            onOpenCurriculumDrawer={() => setIsDrawerOpen(true)}
            onResetProgress={handleResetProgress}
          />
          <CourseMap
            chapters={chapters}
            lessons={lessons}
            progress={progress}
            onSelectLesson={(l) => setActiveLesson(l)}
            metadata={metadata}
          />
        </>
      )}

      {/* Curriculum Browser Drawer */}
      <CurriculumDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        chapters={chapters}
        lessons={lessons}
        progress={progress}
        onSelectLesson={(l) => setActiveLesson(l)}
      />
    </div>
  );
};
