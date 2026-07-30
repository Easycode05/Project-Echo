'use client';

import React, { useState, useMemo } from 'react';
import { RefreshCw, Clock } from 'lucide-react';
import { Deck } from '../lib/types';
import { PROMPTS } from '../lib/data';
import { motion } from 'motion/react';

interface PromptViewProps {
  deck: Deck;
  skipsRemaining?: number;
  onUseSkip?: () => void;
  onBeginPractice: (promptText: string, durationSeconds: number) => void;
}

const DURATION_OPTIONS = [
  { label: '1 MIN', seconds: 60 },
  { label: '2 MIN', seconds: 120 },
  { label: '3 MIN', seconds: 180 },
  { label: '5 MIN', seconds: 300 },
];

export const PromptView: React.FC<PromptViewProps> = ({
  deck,
  onBeginPractice,
}) => {
  // Available prompts for this deck
  const deckPrompts = useMemo(() => {
    if (deck.id === 'surprise') {
      return PROMPTS;
    }
    return PROMPTS.filter((p) => p.deckId === deck.id);
  }, [deck.id]);

  // Session-bound skips state (always starts with 2 per speaking session)
  const [skipsRemaining, setSkipsRemaining] = useState<number>(2);

  // Pick initial random prompt from deck
  const [currentPromptText, setCurrentPromptText] = useState<string>(() => {
    if (deckPrompts.length === 0) {
      return 'What belief have you changed your mind about?';
    }
    const randomIndex = Math.floor(Math.random() * deckPrompts.length);
    return deckPrompts[randomIndex].text;
  });

  // Track seen prompts in this pre-session selection to avoid immediate repeats
  const [seenPrompts, setSeenPrompts] = useState<string[]>([currentPromptText]);
  const [selectedDuration, setSelectedDuration] = useState<number>(120);

  const handleSkipPrompt = () => {
    if (skipsRemaining <= 0) return;

    // Filter out the current prompt
    const otherPrompts = deckPrompts.filter((p) => p.text !== currentPromptText);
    if (otherPrompts.length === 0) return;

    // Prefer prompts not yet seen in this session
    const unseenPrompts = otherPrompts.filter((p) => !seenPrompts.includes(p.text));
    const pool = unseenPrompts.length > 0 ? unseenPrompts : otherPrompts;

    const randomIndex = Math.floor(Math.random() * pool.length);
    const newPromptText = pool[randomIndex].text;

    setCurrentPromptText(newPromptText);
    setSeenPrompts((prev) => [...prev, newPromptText]);
    setSkipsRemaining((prev) => prev - 1);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-6 overflow-hidden bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300">
      {/* Background Room Environmental Ambient Layer */}
      <div
        className="absolute inset-0 z-0 opacity-30 transition-all duration-1000 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${deck.accentColor} 0%, transparent 80%)`,
        }}
      />

      {/* Main Content Canvas */}
      <main className="relative z-10 w-full max-w-[640px] text-center flex flex-col items-center justify-center py-12">
        {/* Deck Category Label */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <span className="font-mono text-xs tracking-[0.3em] text-[var(--text-muted)] uppercase px-3 py-1 rounded-full bg-[var(--surface-bg)] border border-[var(--surface-border)] font-medium">
            {deck.name} Deck
          </span>
        </motion.div>

        {/* The Quote Prompt */}
        <motion.h1
          key={currentPromptText}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-sans text-2xl sm:text-4xl md:text-5xl font-light text-[var(--text-main)] leading-tight mb-8 px-2"
        >
          &quot;{currentPromptText}&quot;
        </motion.h1>

        {/* Skip button control */}
        <div className="mb-8">
          <button
            onClick={handleSkipPrompt}
            disabled={skipsRemaining <= 0}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--surface-bg)] border border-[var(--surface-border)] hover:border-[var(--surface-border-hover)] text-xs font-mono text-[var(--text-main)] transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            title={
              skipsRemaining > 0
                ? `Skip prompt (${skipsRemaining} remaining)`
                : 'No skips remaining'
            }
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Skip Prompt</span>
            <div className="flex items-center gap-1 ml-1">
              <span
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  skipsRemaining >= 1 ? 'bg-emerald-500' : 'bg-neutral-400/30'
                }`}
              />
              <span
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  skipsRemaining >= 2 ? 'bg-emerald-500' : 'bg-neutral-400/30'
                }`}
              />
            </div>
          </button>
        </div>

        {/* Duration Selector */}
        <div className="w-full max-w-md p-4 rounded-2xl bg-[var(--surface-bg)] border border-[var(--surface-border)] backdrop-blur-md mb-8 space-y-3">
          <div className="flex items-center justify-center gap-2 text-[var(--text-muted)] font-mono text-xs tracking-widest uppercase">
            <Clock className="w-3.5 h-3.5" />
            <span>Select Practice Time</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {DURATION_OPTIONS.map((opt) => {
              const isSelected = selectedDuration === opt.seconds;
              return (
                <button
                  key={opt.seconds}
                  onClick={() => setSelectedDuration(opt.seconds)}
                  className={`py-2 px-1 rounded-xl font-mono text-xs tracking-wider transition-all border ${
                    isSelected
                      ? 'bg-[var(--button-bg)] text-[var(--button-text)] border-transparent font-semibold shadow-md scale-[1.02]'
                      : 'bg-[var(--surface-bg)] text-[var(--text-muted)] border-[var(--surface-border)] hover:text-[var(--text-main)]'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="w-full max-w-xs space-y-3">
          <motion.button
            onClick={() => onBeginPractice(currentPromptText, selectedDuration)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            className="w-full py-4 rounded-full bg-[var(--button-bg)] text-[var(--button-text)] font-mono text-xs tracking-[0.25em] font-semibold uppercase transition-all shadow-xl hover:opacity-90"
          >
            BEGIN PRACTICE
          </motion.button>

          {/* Contextual Hint */}
          <p className="font-sans text-xs text-[var(--text-muted)] animate-pulse">
            Tap to start your {selectedDuration / 60}-minute speaking session
          </p>
        </div>
      </main>
    </div>
  );
};
