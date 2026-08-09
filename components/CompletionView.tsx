'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Flame, BarChart3, Check, Share2, Loader2 } from 'lucide-react';
import { toPng } from 'html-to-image';
import { UserProgress, Deck } from '../lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { useSoundSystem } from '../hooks/use-sound-system';

interface CompletionViewProps {
  deck: Deck;
  promptText: string;
  durationSeconds: number;
  progress: UserProgress;
  onFinish: (finalDuration: number, continuedAfterTimer: boolean) => void;
}

export const CompletionView: React.FC<CompletionViewProps> = ({
  deck,
  promptText,
  durationSeconds,
  progress,
  onFinish,
}) => {
  const [isContinuing, setIsContinuing] = useState(false);
  const [totalSecs, setTotalSecs] = useState(durationSeconds);
  const [burstDone, setBurstDone] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const sounds = useSoundSystem(progress.soundEnabled);

  useEffect(() => {
    // Play completion sound when the view appears
    sounds.playComplete();
  }, []);

  useEffect(() => {
    if (!isContinuing) return;
    const timer = setInterval(() => setTotalSecs((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, [isContinuing]);

  // Mark burst as done after animation completes
  useEffect(() => {
    const t = setTimeout(() => setBurstDone(true), 1800);
    return () => clearTimeout(t);
  }, []);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainderSecs = secs % 60;
    return `${mins}:${remainderSecs < 10 ? '0' : ''}${remainderSecs}`;
  };

  const handleShare = async () => {
    if (!cardRef.current) return;
    setIsSharing(true);
    sounds.playTap();
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 3, // High resolution
        style: { transform: 'scale(1)', opacity: '1', display: 'flex' }
      });
      
      const link = document.createElement('a');
      link.download = `echo-prompt-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate image', err);
    } finally {
      setIsSharing(false);
      // Wait a moment for the DOM to reset if needed
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col px-6 md:px-8 overflow-x-hidden overflow-y-auto bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-500 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      {/* Ambient Room Glow */}
      <div
        className="absolute inset-0 z-0 pointer-events-none transition-all duration-1000 opacity-20"
        style={{
          background: `radial-gradient(circle at center, ${deck.accentColor} 0%, transparent 60%)`,
        }}
      />

      {/* ✨ Radial burst rings — fire on mount, then fade away */}
      {!burstDone && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute border border-[var(--surface-border)]"
              style={{
                borderColor: deck.accentColor,
                width: 80,
                height: 80,
              }}
              initial={{ scale: 0.5, opacity: 0.5 }}
              animate={{ scale: 6 + i * 2, opacity: 0 }}
              transition={{
                delay: i * 0.15,
                duration: 1.5,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          ))}
        </div>
      )}

      {/* Main Content */}
      <main className="relative z-10 w-full max-w-[600px] mx-auto flex-1 flex flex-col items-center justify-center pt-20 pb-32">

        {/* Success headline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <h1
            className="text-6xl sm:text-7xl font-light text-[var(--text-main)] mb-4 tracking-[-0.02em] leading-none"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Practice<br />Complete.
          </h1>
          <p className="font-sans text-lg text-[var(--text-muted)] font-light">
            You completed your speaking session.
          </p>
        </motion.div>

        {/* Animated timer — ticks upward if continuing */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 text-center border-y border-[var(--surface-border)] py-8 w-full"
        >
          <AnimatePresence mode="popLayout">
            <motion.div
              key={totalSecs}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.2 }}
              className="text-7xl sm:text-8xl font-light tracking-tight text-[var(--text-main)] tabular-nums leading-none"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {formatTime(totalSecs)}
            </motion.div>
          </AnimatePresence>
          <div className="font-mono text-xs tracking-[0.25em] text-[var(--text-muted)] uppercase mt-6">
            {isContinuing ? 'Speaking Continuously' : 'Session Length'}
          </div>
        </motion.div>

        {/* Stat cards — staggered entrance */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-12 w-full px-4"
        >
          {/* Streak card */}
          <motion.div
            className="flex flex-col items-center sm:items-start gap-2"
          >
            <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-[0.2em]">
              Practice Streak
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-light text-[var(--text-main)] leading-none" style={{ fontFamily: 'var(--font-display)' }}>
                {(() => {
                  const lastDateStr = progress.lastSessionDate ? new Date(progress.lastSessionDate).toISOString().split('T')[0] : '';
                  const todayStr = new Date().toISOString().split('T')[0];
                  return lastDateStr !== todayStr ? progress.currentStreak + 1 : Math.max(1, progress.currentStreak);
                })()}
              </span>
              <span className="font-sans text-sm text-[var(--text-muted)] font-light italic">Days</span>
            </div>
          </motion.div>

          {/* Total minutes card */}
          <motion.div
            className="flex flex-col items-center sm:items-end gap-2"
          >
            <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-[0.2em]">
              Speaking Volume
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-light text-[var(--text-main)] leading-none" style={{ fontFamily: 'var(--font-display)' }}>
                {progress.totalMinutes + Math.round(totalSecs / 60)}
              </span>
              <span className="font-sans text-sm text-[var(--text-muted)] font-light italic">Minutes</span>
            </div>
          </motion.div>
        </motion.div>
      </main>

      <footer className="fixed bottom-0 left-0 w-full z-50 flex flex-col items-center gap-6 pb-[calc(env(safe-area-inset-bottom)+48px)] px-6 md:px-8 bg-gradient-to-t from-[var(--bg-main)] via-[var(--bg-main)]/90 to-transparent pt-12 pointer-events-none">
        <div className="w-full max-w-sm flex gap-4 pointer-events-auto">
          <motion.button
            onClick={handleShare}
            disabled={isSharing}
            className="flex-1 bg-[var(--surface-bg)] border border-[var(--surface-border)] text-[var(--text-main)] font-mono font-medium text-[10px] tracking-[0.2em] uppercase py-5 transition-all flex items-center justify-center gap-3 hover:bg-[var(--surface-border)]"
          >
            {isSharing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
            <span>Share</span>
          </motion.button>
          
          <motion.button
            onClick={() => {
              sounds.playTap();
              onFinish(totalSecs, isContinuing);
            }}
            className="flex-[2] bg-[var(--text-main)] text-[var(--bg-main)] font-mono font-medium text-xs tracking-[0.2em] uppercase py-5 transition-all flex items-center justify-center gap-3 hover:bg-[var(--accent-warm)]"
          >
            <span>Finish Session</span>
            <Check className="w-4 h-4" />
          </motion.button>
        </div>

        <AnimatePresence>
          {!isContinuing && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                sounds.playTap();
                setIsContinuing(true);
              }}
              className="font-mono text-[10px] tracking-[0.2em] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors uppercase border-b border-transparent hover:border-[var(--text-main)] pb-1 pointer-events-auto"
            >
              Continue Speaking
            </motion.button>
          )}
        </AnimatePresence>
      </footer>

      {/* HIDDEN OFF-SCREEN ELEMENT FOR IMAGE GENERATION */}
      <div 
        className="fixed top-[-9999px] left-[-9999px] z-[-1]"
        style={{ width: '1080px', height: '1080px' }}
      >
        <div
          ref={cardRef}
          className="w-full h-full flex flex-col items-center justify-center p-24 text-center relative overflow-hidden"
          style={{ backgroundColor: '#0D0D0F' }}
        >
          {/* Subtle glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at center, ${deck.accentColor} 0%, transparent 60%)`,
              opacity: 0.2
            }}
          />

          <div className="z-10 flex flex-col items-center justify-between h-full w-full py-12">
            <div className="space-y-6">
              <span className="font-mono text-xl tracking-[0.3em] uppercase" style={{ color: deck.accentColor }}>
                {deck.name}
              </span>
            </div>

            <div 
              className="text-6xl font-light tracking-[-0.02em] leading-[1.3] text-[#F3F3F3] max-w-4xl mx-auto"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              "{promptText}"
            </div>

            <div className="flex flex-col items-center gap-6 mt-12">
              <svg width="60" height="60" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="22" cy="20" r="16" stroke="#FFFFFF" strokeWidth="2.5" opacity="0.3" />
                <circle cx="16" cy="20" r="10" stroke="#FFFFFF" strokeWidth="2.5" opacity="0.7" />
                <circle cx="10" cy="20" r="4" fill="#FFFFFF" />
              </svg>
              <span className="font-mono text-sm tracking-[0.4em] text-[#A1A1AA] uppercase">
                Project Echo
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

