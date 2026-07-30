'use client';

import React, { useState, useEffect } from 'react';
import { Flame, BarChart3, Check } from 'lucide-react';
import { UserProgress, Deck } from '../lib/types';
import { motion } from 'motion/react';

interface CompletionViewProps {
  deck: Deck;
  durationSeconds: number;
  progress: UserProgress;
  onFinish: (finalDuration: number, continuedAfterTimer: boolean) => void;
}

export const CompletionView: React.FC<CompletionViewProps> = ({
  deck,
  durationSeconds,
  progress,
  onFinish,
}) => {
  const [isContinuing, setIsContinuing] = useState(false);
  const [totalSecs, setTotalSecs] = useState(durationSeconds);

  // If user clicks "Continue Speaking", timer counts upward continuously
  useEffect(() => {
    if (!isContinuing) return;

    const timer = setInterval(() => {
      setTotalSecs((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isContinuing]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainderSecs = secs % 60;
    return `${mins}:${remainderSecs < 10 ? '0' : ''}${remainderSecs}`;
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-6 overflow-hidden bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300">
      {/* Ambient Room Glow Background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none transition-all duration-1000 opacity-20"
        style={{
          background: `radial-gradient(circle at center, ${deck.accentColor} 0%, transparent 80%)`,
        }}
      />

      {/* Main Content Canvas */}
      <main className="relative z-10 w-full max-w-[500px] flex-1 flex flex-col items-center justify-center pt-20 pb-32">
        {/* Central Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="font-sans text-4xl sm:text-5xl font-light text-[var(--text-main)] mb-2">
            Great practice.
          </h1>
          <p className="font-sans text-base text-[var(--text-muted)] font-light">
            You completed your speaking session.
          </p>
        </motion.div>

        {/* Primary Stat: Timer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-10 text-center"
        >
          <div className="font-sans text-7xl sm:text-8xl font-extralight tracking-tight text-[var(--text-main)]">
            {formatTime(totalSecs)}
          </div>
          <span className="font-mono text-[11px] tracking-[0.25em] text-[var(--text-muted)] uppercase font-medium">
            {isContinuing ? 'Speaking Continuously' : 'Session Length'}
          </span>
        </motion.div>

        {/* Daily Progress Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full"
        >
          {/* Streak Card */}
          <div className="bg-[var(--surface-bg)] backdrop-blur-2xl border border-[var(--surface-border)] p-5 rounded-2xl flex flex-col items-start gap-2 overflow-hidden relative group hover:border-[var(--surface-border-hover)] transition-all">
            <span className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider font-medium">
              Practice Streak
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-sans text-3xl font-normal text-[var(--text-main)]">
                {progress.currentStreak}
              </span>
              <span className="font-sans text-xs text-[var(--text-muted)] font-light">Day Streak</span>
            </div>
            <div className="absolute -right-3 -bottom-3 opacity-10 text-[var(--text-main)]">
              <Flame className="w-20 h-20" />
            </div>
          </div>

          {/* Total Minutes Card */}
          <div className="bg-[var(--surface-bg)] backdrop-blur-2xl border border-[var(--surface-border)] p-5 rounded-2xl flex flex-col items-start gap-2 overflow-hidden relative group hover:border-[var(--surface-border-hover)] transition-all">
            <span className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider font-medium">
              Speaking Volume
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-sans text-3xl font-normal text-[var(--text-main)]">
                {progress.totalMinutes + Math.round(totalSecs / 60)}
              </span>
              <span className="font-sans text-xs text-[var(--text-muted)] font-light">Total Minutes</span>
            </div>
            <div className="absolute -right-3 -bottom-3 opacity-10 text-[var(--text-main)]">
              <BarChart3 className="w-16 h-16" />
            </div>
          </div>
        </motion.div>
      </main>

      {/* Bottom Actions Container */}
      <footer className="fixed bottom-0 left-0 w-full z-50 flex flex-col items-center gap-3 pb-8 px-6 bg-gradient-to-t from-[var(--bg-main)] via-[var(--bg-main)]/90 to-transparent">
        <button
          onClick={() => onFinish(totalSecs, isContinuing)}
          className="w-full max-w-sm bg-[var(--button-bg)] text-[var(--button-text)] font-sans font-semibold text-base py-4 rounded-full transition-all duration-300 active:scale-[0.98] shadow-xl flex items-center justify-center gap-2 hover:opacity-90"
        >
          <Check className="w-5 h-5" />
          <span>Finish</span>
        </button>

        {!isContinuing && (
          <button
            onClick={() => setIsContinuing(true)}
            className="font-mono text-xs tracking-wider text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors py-2 active:scale-95 uppercase font-medium"
          >
            Continue Speaking
          </button>
        )}
      </footer>
    </div>
  );
};
