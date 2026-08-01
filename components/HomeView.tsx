'use client';

import React from 'react';
import { Play, Clock, Flame, ArrowRight } from 'lucide-react';
import { Orb } from './Orb';
import { UserProgress, Deck } from '../lib/types';
import { PROMPTS } from '../lib/data';
import { motion } from 'framer-motion';
import { useSoundSystem } from '../hooks/use-sound-system';

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
  const deckPrompts = PROMPTS.filter((p) => p.deckId === activeDeck.id);
  const previewPrompt = deckPrompts[0]?.text || 'What belief have you changed your mind about?';
  
  const sounds = useSoundSystem(progress.soundEnabled);

  return (
    <div className="relative min-h-screen w-full flex flex-col pt-[calc(env(safe-area-inset-top)+128px)] pb-[calc(env(safe-area-inset-bottom)+144px)] px-6 md:px-8 overflow-x-hidden overflow-y-auto bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-500">
      
      {/* Environmental subtle gradient, very faint, no glass */}
      <div
        className="absolute inset-0 z-0 pointer-events-none transition-all duration-1000 opacity-30"
        style={{
          background: `radial-gradient(circle at 70% 30%, ${activeDeck.accentColor}15 0%, transparent 50%)`,
        }}
      />

      {/* Top Editorial Stats */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex items-center gap-8 mb-16 text-xs uppercase tracking-[0.15em] text-[var(--text-muted)] font-mono"
      >
        <div className="flex items-center gap-2">
          <span>TIME</span>
          <span className="text-[var(--text-main)] font-medium">{progress.totalMinutes}M</span>
        </div>
        <div className="flex items-center gap-2">
          <span>SESSIONS</span>
          <span className="text-[var(--text-main)] font-medium">{progress.totalSessions}</span>
        </div>
        {progress.currentStreak > 0 && (
          <div className="flex items-center gap-2 text-[var(--accent-warm)]">
            <span>STREAK</span>
            <span className="font-medium">{progress.currentStreak}</span>
          </div>
        )}
      </motion.div>

      {/* Main focal area: Left aligned, editorial feel */}
      <main className="relative z-10 flex flex-col flex-grow w-full max-w-6xl mx-auto mt-12 md:mt-24">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 flex-grow">
          
          {/* Left Column: Typography & Info */}
          <div className="flex flex-col justify-between space-y-24">
            
            {/* Hero Typography */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-10"
            >
              <h1
                className="text-5xl sm:text-7xl md:text-[90px] tracking-[-0.04em] font-medium text-[var(--text-main)] leading-[0.95]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Speak with<br />
                <span className="text-[var(--text-muted)] font-light italic tracking-tight">intention.</span>
              </h1>

              <p
                className="text-xl sm:text-2xl text-[var(--text-muted)] font-light max-w-md leading-relaxed tracking-wide"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Practice articulating your thoughts through daily speaking sessions.
              </p>
            </motion.div>

            {/* Deck Info (Bottom Left) */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-8 max-w-md pb-12"
            >
              <div className="flex items-center gap-6 border-b border-[var(--surface-border)] pb-6">
                <span
                  className="w-2.5 h-2.5 rounded-none shrink-0"
                  style={{ backgroundColor: activeDeck.accentColor }}
                />
                <button
                  onClick={() => {
                    sounds.playTap();
                    onSelectDeck();
                  }}
                  className="group flex items-center justify-between w-full text-xs text-[var(--text-main)] transition-colors"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  <span className="uppercase tracking-[0.2em] font-medium">
                    {activeDeck.name}
                  </span>
                  <span className="text-[var(--text-muted)] flex items-center gap-2 group-hover:text-[var(--text-main)] transition-colors">
                    CHANGE <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </div>

              <p
                className="text-base sm:text-lg text-[var(--text-muted)] italic leading-relaxed font-light"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                "{previewPrompt}"
              </p>
            </motion.div>

          </div>

          {/* Right Column: Orb and Play Button */}
          <div className="relative flex items-center justify-center min-h-[500px]">
            {/* Glowing Orb */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-90 mix-blend-screen scale-110">
              <Orb accentColor={activeDeck.accentColor} size={500} />
            </div>

            {/* Circular CTA exactly centered in Orb */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10"
            >
              <button
                onClick={() => {
                  sounds.playTap();
                  onStartSession();
                }}
                id="begin-practice-btn"
                className="group flex flex-col items-center justify-center w-36 h-36 rounded-full bg-[var(--bg-main)] text-[var(--text-main)] transition-all duration-700 shadow-2xl hover:shadow-[0_0_60px_-10px_rgba(255,255,255,0.1)] hover:scale-105 active:scale-95"
                style={{
                  boxShadow: `0 0 40px ${activeDeck.accentColor}20, inset 0 0 20px ${activeDeck.accentColor}10`,
                  border: `1px solid ${activeDeck.accentColor}30`
                }}
                aria-label="Begin Practice"
              >
                <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 mix-blend-screen" 
                     style={{ background: `radial-gradient(circle at center, ${activeDeck.accentColor}40 0%, transparent 70%)` }} />
                
                <div className="relative z-10 flex flex-col items-center gap-3 group-hover:scale-110 transition-transform duration-500 ease-out">
                  <Play className="w-8 h-8 ml-1" style={{ fill: 'currentColor' }} />
                  <span className="text-[9px] uppercase tracking-[0.3em] font-mono opacity-60 group-hover:opacity-100 transition-opacity duration-500">
                    Begin
                  </span>
                </div>

                {/* Subtle ripple effect rings */}
                <div className="absolute inset-0 rounded-full border border-[var(--text-main)] opacity-0 group-hover:animate-ping" style={{ animationDuration: '3s' }} />
              </button>
            </motion.div>
          </div>

        </div>
      </main>
    </div>
  );
};

