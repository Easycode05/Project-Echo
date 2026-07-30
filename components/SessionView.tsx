'use client';

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Pause, Play, CheckCircle2, Mic } from 'lucide-react';
import { Orb } from './Orb';
import { Deck } from '../lib/types';
import { useAudioRecorder } from '../hooks/use-audio-recorder';
import { motion, AnimatePresence } from 'motion/react';

interface SessionViewProps {
  deck: Deck;
  promptText: string;
  targetDurationSeconds?: number;
  onCompleteSession: (result: {
    durationSeconds: number;
    continuedAfterTimer: boolean;
    audioUrl?: string;
  }) => void;
  onCancelSession: () => void;
}

export const SessionView: React.FC<SessionViewProps> = ({
  deck,
  promptText,
  targetDurationSeconds = 120,
  onCompleteSession,
}) => {
  // Stage state: 'countdown' | 'speaking'
  const [stage, setStage] = useState<'countdown' | 'speaking'>('countdown');
  const [countdownStep, setCountdownStep] = useState<number | 'Speak.'>(3);

  // Timer: starts at targetDurationSeconds (e.g. 60, 120, 180, 300)
  const [secondsRemaining, setSecondsRemaining] = useState<number>(targetDurationSeconds);
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [showPromptText, setShowPromptText] = useState<boolean>(true);

  // Audio recording hook
  const { audioLevel, audioUrl, startRecording, stopRecording } =
    useAudioRecorder();

  // 1. Handle countdown sequence (3 -> 2 -> 1 -> Speak. -> start)
  useEffect(() => {
    if (stage !== 'countdown') return;

    const timer = setInterval(() => {
      setCountdownStep((prev) => {
        if (prev === 3) return 2;
        if (prev === 2) return 1;
        if (prev === 1) return 'Speak.';
        if (prev === 'Speak.') {
          clearInterval(timer);
          setStage('speaking');
          startRecording();
          return 'Speak.';
        }
        return 3;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [stage, startRecording]);

  // 2. Handle active timer
  useEffect(() => {
    if (stage !== 'speaking' || isPaused) return;

    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
      setSecondsRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [stage, isPaused]);

  // Handle completion when time runs out
  useEffect(() => {
    if (stage === 'speaking' && secondsRemaining === 0) {
      stopRecording();
      onCompleteSession({
        durationSeconds: targetDurationSeconds,
        continuedAfterTimer: false,
        audioUrl: audioUrl || undefined,
      });
    }
  }, [secondsRemaining, stage, stopRecording, onCompleteSession, targetDurationSeconds, audioUrl]);

  // 3. Prompt text auto-fade after 5 seconds in speaking mode
  useEffect(() => {
    if (stage === 'speaking') {
      const fadeTimer = setTimeout(() => {
        setShowPromptText(false);
      }, 5000);
      return () => clearTimeout(fadeTimer);
    }
  }, [stage]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainderSecs = secs % 60;
    return `${mins}:${remainderSecs < 10 ? '0' : ''}${remainderSecs}`;
  };

  const handleManualFinish = () => {
    stopRecording();
    onCompleteSession({
      durationSeconds: secondsElapsed,
      continuedAfterTimer: false,
      audioUrl: audioUrl || undefined,
    });
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-6 overflow-hidden bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300">
      {/* Background Ambient Atmospheric Glow */}
      <div
        className="absolute inset-0 z-0 pointer-events-none transition-all duration-1000 opacity-20"
        style={{
          background: `radial-gradient(circle at center, ${deck.accentColor} 0%, transparent 80%)`,
        }}
      />

      {/* STAGE 1: COUNTDOWN */}
      <AnimatePresence mode="wait">
        {stage === 'countdown' && (
          <motion.div
            key="countdown-stage"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 flex flex-col items-center justify-center text-center space-y-6"
          >
            <span className="font-mono text-xs tracking-[0.3em] text-[var(--text-muted)] uppercase font-medium">
              {deck.name} PRACTICE
            </span>
            <div className="font-sans text-8xl font-light text-[var(--text-main)] tracking-tighter my-4">
              {countdownStep}
            </div>
            <p className="font-sans text-sm text-[var(--text-muted)] max-w-xs italic font-light">
              Organize your thoughts and speak continuously.
            </p>
          </motion.div>
        )}

        {/* STAGE 2: HERO SPEAKING SESSION */}
        {stage === 'speaking' && (
          <motion.div
            key="speaking-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="relative z-10 w-full max-w-[600px] flex flex-col items-center justify-between min-h-[80vh] py-8"
          >
            {/* Top Prompt Display Bar */}
            <div className="w-full flex flex-col items-center text-center pt-4">
              <div className="flex items-center gap-3 mb-3">
                <span className="font-mono text-[11px] tracking-[0.25em] text-[var(--text-muted)] uppercase font-semibold">
                  {deck.name}
                </span>
                <button
                  onClick={() => setShowPromptText((prev) => !prev)}
                  className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors p-1"
                  title={showPromptText ? 'Hide prompt' : 'Show prompt'}
                >
                  {showPromptText ? (
                    <EyeOff className="w-3.5 h-3.5" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Fading Prompt */}
              <AnimatePresence>
                {showPromptText && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.5 }}
                    className="font-sans text-lg text-[var(--text-main)] font-light max-w-md px-4 leading-relaxed italic"
                  >
                    &quot;{promptText}&quot;
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Central Focal Point: Real-time Audio Orb & Countdown Timer */}
            <div className="relative my-auto flex flex-col items-center justify-center">
              <Orb accentColor={deck.accentColor} audioLevel={audioLevel} size={280} />

              {/* Central Timer Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="font-sans text-6xl sm:text-7xl font-light text-[var(--text-main)] tracking-tight">
                  {formatTime(secondsRemaining)}
                </div>
                <p className="font-mono text-[11px] tracking-[0.25em] text-[var(--text-muted)] uppercase mt-2 font-medium">
                  Keep Speaking.
                </p>

                {/* Mic Activity Pulse */}
                <div className="flex items-center gap-2 mt-4 px-3 py-1 rounded-full bg-[var(--surface-bg)] border border-[var(--surface-border)] text-xs text-[var(--text-main)] shadow-sm">
                  <Mic className="w-3 h-3 text-emerald-500 animate-pulse" />
                  <span className="font-mono text-[10px] tracking-wider uppercase text-[var(--text-muted)] font-medium">
                    Recording Live
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Session Controls */}
            <div className="w-full flex items-center justify-center gap-6 pb-4">
              <button
                onClick={() => setIsPaused((prev) => !prev)}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--surface-bg)] border border-[var(--surface-border)] hover:border-[var(--surface-border-hover)] text-xs font-mono text-[var(--text-main)] uppercase tracking-wider transition-all active:scale-95"
              >
                {isPaused ? (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Resume</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Pause</span>
                  </>
                )}
              </button>

              <button
                onClick={handleManualFinish}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--button-bg)] text-[var(--button-text)] text-xs font-mono uppercase tracking-wider transition-all active:scale-95 shadow-lg font-semibold"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Finish Early</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
