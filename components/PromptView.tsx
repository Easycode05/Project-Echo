'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { Deck, Prompt } from '../lib/types';
import { PROMPTS } from '../lib/data';
import { motion, AnimatePresence } from 'framer-motion';
import { useSoundSystem } from '../hooks/use-sound-system';
import { getPrompts, trackEvent } from '../lib/supabase';

interface PromptViewProps {
  deck: Deck;
  skipsRemaining?: number;
  onUseSkip?: () => void;
  onBeginPractice: (promptText: string, durationSeconds: number) => void;
  soundEnabled?: boolean;
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
  soundEnabled = true,
}) => {
  const sounds = useSoundSystem(soundEnabled);
  
  const [deckPrompts, setDeckPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch prompts asynchronously
  useEffect(() => {
    async function loadPrompts() {
      setIsLoading(true);
      const fetched = await getPrompts(deck.id);
      setDeckPrompts(fetched);
      setIsLoading(false);
    }
    loadPrompts();
  }, [deck.id]);

  // Session-bound skips state (always starts with 2 per speaking session)
  const [skipsRemaining, setSkipsRemaining] = useState<number>(2);

  const [currentPromptText, setCurrentPromptText] = useState<string>('');
  const [seenPrompts, setSeenPrompts] = useState<string[]>([]);

  // Pick initial random prompt once loaded
  useEffect(() => {
    if (!isLoading && deckPrompts.length > 0 && !currentPromptText) {
      const randomIndex = Math.floor(Math.random() * deckPrompts.length);
      const text = deckPrompts[randomIndex].text;
      setCurrentPromptText(text);
      setSeenPrompts([text]);
      
      trackEvent('prompt_displayed', { deck_id: deck.id, prompt: text });
    }
  }, [isLoading, deckPrompts, currentPromptText, deck.id]);

  const [selectedDuration, setSelectedDuration] = useState<number>(120);

  const handleSkipPrompt = () => {
    if (skipsRemaining <= 0 || deckPrompts.length === 0) return;

    trackEvent('prompt_skipped', { deck_id: deck.id, prompt: currentPromptText });

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
    
    trackEvent('prompt_displayed', { deck_id: deck.id, prompt: newPromptText });
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-6 md:px-8 overflow-x-hidden overflow-y-auto bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-500">
      {/* Background Room Environmental Ambient Layer */}
      <div
        className="absolute inset-0 z-0 opacity-20 transition-all duration-1000 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${deck.accentColor} 0%, transparent 60%)`,
        }}
      />

      {/* Main Content Canvas */}
      <main className="relative z-10 w-full max-w-[800px] text-center flex flex-col items-center justify-center pt-[calc(env(safe-area-inset-top)+128px)] pb-[calc(env(safe-area-inset-bottom)+96px)] flex-grow">
        
        {/* Deck Category Label */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <div className="flex items-center justify-center gap-4">
            <span
              className="w-2.5 h-2.5 rounded-none"
              style={{ backgroundColor: deck.accentColor }}
            />
            <span className="font-mono text-xs tracking-[0.2em] text-[var(--text-muted)] uppercase font-medium">
              {deck.name} Deck
            </span>
          </div>
        </motion.div>

        {/* The Quote Prompt */}
        <div className="min-h-[140px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm font-mono tracking-widest uppercase text-[var(--text-muted)] animate-pulse"
              >
                Connecting...
              </motion.div>
            ) : (
              <motion.h1
                key={currentPromptText}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl sm:text-5xl md:text-6xl font-light text-[var(--text-main)] leading-[1.1] mb-12 tracking-[-0.02em] italic max-w-[90%]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                "{currentPromptText}"
              </motion.h1>
            )}
          </AnimatePresence>
        </div>

        {/* Skip button control */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 1 }}
          className="mb-auto"
        >
          <button
            onClick={() => {
              sounds.playCancel();
              handleSkipPrompt();
            }}
            disabled={skipsRemaining <= 0}
            className="flex items-center gap-3 text-xs font-mono text-[var(--text-muted)] uppercase tracking-widest hover:text-[var(--text-main)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed pb-2 border-b border-transparent hover:border-[var(--text-main)]"
            title={
              skipsRemaining > 0
                ? `Skip prompt (${skipsRemaining} remaining)`
                : 'No skips remaining'
            }
          >
            <RefreshCw className="w-4 h-4" />
            <span>Generate Alternative</span>
            <div className="flex items-center gap-1.5 ml-2 border-l border-[var(--surface-border)] pl-3">
              <span
                className={`w-1.5 h-1.5 rounded-none transition-colors ${
                  skipsRemaining >= 1 ? 'bg-[var(--text-main)]' : 'bg-[var(--surface-border)]'
                }`}
              />
              <span
                className={`w-1.5 h-1.5 rounded-none transition-colors ${
                  skipsRemaining >= 2 ? 'bg-[var(--text-main)]' : 'bg-[var(--surface-border)]'
                }`}
              />
            </div>
          </button>
        </motion.div>

        {/* Action Area */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-sm flex flex-col items-center gap-10 mt-20"
        >
          
          {/* Duration Selector */}
          <div className="flex flex-col items-center gap-4 w-full">
            <span className="font-mono text-[10px] text-[var(--text-muted)] tracking-[0.2em] uppercase">
              Target Duration
            </span>
            <div className="flex items-center justify-center gap-6">
              {DURATION_OPTIONS.map((opt) => {
                const isSelected = selectedDuration === opt.seconds;
                return (
                  <button
                    key={opt.seconds}
                    onClick={() => {
                      sounds.playTap();
                      setSelectedDuration(opt.seconds);
                    }}
                    className={`font-mono text-sm tracking-wider transition-colors pb-1 border-b-2 ${
                      isSelected
                        ? 'text-[var(--text-main)] border-[var(--text-main)] font-medium'
                        : 'text-[var(--text-muted)] border-transparent hover:text-[var(--text-main)] font-light'
                    }`}
                  >
                    {opt.label.split(' ')[0]}
                    <span className="text-[10px] ml-1">M</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            disabled={isLoading || !currentPromptText}
            onClick={() => {
              sounds.playTap();
              trackEvent('prompt_accepted', { deck_id: deck.id, prompt: currentPromptText });
              onBeginPractice(currentPromptText, selectedDuration);
            }}
            className="w-full py-6 bg-[var(--text-main)] text-[var(--bg-main)] hover:bg-[var(--accent-warm)] transition-colors duration-300 ease-out flex items-center justify-center gap-6 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span
              className="text-xs tracking-[0.2em] uppercase font-medium"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              Begin Practice
            </span>
            <span className="font-mono text-[10px] opacity-60 group-hover:opacity-100 transition-opacity">
              {selectedDuration / 60} MIN
            </span>
          </button>
        </motion.div>
      </main>
    </div>
  );
};

