'use client';

import React from 'react';
import { Play, Clock, Compass, ArrowRight } from 'lucide-react';
import { Orb } from './Orb';
import { UserProgress, Deck } from '../lib/types';
import { PROMPTS } from '../lib/data';
import { motion } from 'motion/react';

interface HomeViewProps {
  progress: UserProgress;
  activeDeck: Deck;
  onStartSession: () => void;
  onSelectDeck: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  progress,
  activeDeck,
  onStartSession,
  onSelectDeck,
}) => {
  // Get first prompt for active deck as preview
  const deckPrompts = PROMPTS.filter((p) => p.deckId === activeDeck.id);
  const previewPrompt = deckPrompts[0]?.text || 'What belief have you changed your mind about?';

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between pt-28 pb-36 px-6 overflow-hidden bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300">
      {/* Dynamic Environmental Radial Aura */}
      <div
        className="absolute inset-0 z-0 pointer-events-none transition-all duration-1000 opacity-20"
        style={{
          background: `radial-gradient(circle at 50% 40%, ${activeDeck.accentColor} 0%, transparent 65%)`,
        }}
      />

      {/* Main Sanctuary Focal Area */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center max-w-xl w-full my-auto py-6">
        {/* Background Animated Orb */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <Orb accentColor={activeDeck.accentColor} size={420} />
        </div>

        {/* Unboxed Display Typography Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-3 mb-12 relative z-10"
        >
          <h1 className="font-sans text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[var(--text-main)]">
            Practice Speaking.
          </h1>

          <p className="font-sans text-base sm:text-lg text-[var(--text-muted)] font-light max-w-md mx-auto leading-relaxed">
            One topic. Two minutes. Every day.
          </p>

          {progress.currentStreak > 0 && (
            <p className="font-mono text-[11px] tracking-[0.2em] text-amber-500 font-semibold uppercase pt-1">
              {progress.currentStreak} Day Practice Streak
            </p>
          )}
        </motion.div>

        {/* Action Button: Interactive Pulsing Glass Play Orb */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="flex flex-col items-center relative z-10 mb-12"
        >
          <button
            onClick={onStartSession}
            className="group relative flex flex-col items-center justify-center gap-4 transition-transform duration-500 active:scale-90 focus:outline-none"
            aria-label="Start Session"
          >
            {/* Outer Pulsing Aura Ring */}
            <div className="absolute -inset-5 rounded-full bg-[var(--surface-bg)] blur-xl group-hover:bg-[var(--surface-border-hover)] transition-all duration-700 animate-pulse" />

            {/* Glass Play Orb Button */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[var(--button-bg)] text-[var(--button-text)] flex items-center justify-center shadow-xl transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl relative">
              <Play className="w-9 h-9 sm:w-10 sm:h-10 fill-current translate-x-0.5 transition-transform group-hover:scale-105" />
            </div>

            <span className="font-mono text-xs text-[var(--text-muted)] tracking-[0.25em] uppercase group-hover:text-[var(--text-main)] transition-colors pt-2 font-medium">
              BEGIN PRACTICE
            </span>
          </button>
        </motion.div>

        {/* Selected Deck & Prompt Peek Pill */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="w-full max-w-sm relative z-10"
        >
          <div className="p-4 sm:p-5 rounded-2xl bg-[var(--surface-bg)] border border-[var(--surface-border)] backdrop-blur-xl text-left space-y-2.5 hover:border-[var(--surface-border-hover)] transition-all group">
            <div className="flex items-center justify-between">
              <button
                onClick={onSelectDeck}
                className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: activeDeck.accentColor }}
                />
                <span className="uppercase tracking-wider">DECK: {activeDeck.name}</span>
              </button>
              <button
                onClick={onSelectDeck}
                className="text-[11px] font-mono text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors flex items-center gap-1"
              >
                <span>Change Deck</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Prompt preview text */}
            <p className="font-sans text-xs sm:text-sm text-[var(--text-main)] italic line-clamp-2 pt-0.5 leading-relaxed font-light">
              &quot;{previewPrompt}&quot;
            </p>
          </div>
        </motion.div>
      </main>

      {/* Bottom Summary Stats Pill */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="relative z-10 flex items-center gap-6 px-6 py-2.5 rounded-full bg-[var(--surface-bg)] border border-[var(--surface-border)] font-mono text-xs text-[var(--text-muted)] backdrop-blur-md mt-4"
      >
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span>{progress.totalMinutes}m Spoken</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-[var(--text-muted)] opacity-40" />
        <div className="flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5" />
          <span>{progress.totalSessions} Sessions</span>
        </div>
      </motion.div>
    </div>
  );
};
