'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Eye, EyeOff, CheckCircle2, Mic } from 'lucide-react';
import { Orb } from './Orb';
import { Deck } from '../lib/types';
import { useAudioRecorder } from '../hooks/use-audio-recorder';
import { motion, AnimatePresence } from 'framer-motion';
import { useSoundSystem } from '../hooks/use-sound-system';

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
  soundEnabled?: boolean;
  ambientSound?: 'none' | 'space' | 'rain' | 'binaural';
}

export const SessionView: React.FC<SessionViewProps> = ({
  deck,
  promptText,
  targetDurationSeconds = 120,
  onCompleteSession,
  onCancelSession,
  soundEnabled = true,
  ambientSound = 'none',
}) => {
  const [stage, setStage] = useState<'countdown' | 'speaking'>('countdown');
  const [countdownStep, setCountdownStep] = useState<number | 'Speak.'>(3);

  const [secondsRemaining, setSecondsRemaining] = useState<number>(targetDurationSeconds);
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [showPromptText, setShowPromptText] = useState<boolean>(true);

  const { audioUrl, startRecording, stopRecording } =
    useAudioRecorder();

  const sounds = useSoundSystem(soundEnabled);

  // Countdown sequence
  useEffect(() => {
    if (stage !== 'countdown') return;

    const timer = setInterval(() => {
      setCountdownStep((prev) => {
        if (prev === 3) {
          sounds.playTick();
          return 2;
        }
        if (prev === 2) {
          sounds.playTick();
          return 1;
        }
        if (prev === 1) {
          sounds.playStart();
          return 'Speak.';
        }
        if (prev === 'Speak.') {
          clearInterval(timer);
          setStage('speaking');
          startRecording();
          return 'Speak.';
        }
        sounds.playTick();
        return 3;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [stage, startRecording]);

  // Active timer & Ambient Sound
  useEffect(() => {
    if (stage !== 'speaking') {
      sounds.stopAmbientSoundscape();
      return;
    }
    
    sounds.playAmbientSoundscape(ambientSound);

    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
      setSecondsRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => {
      clearInterval(timer);
      sounds.stopAmbientSoundscape();
    };
  }, [stage, sounds, ambientSound]);

  // Auto-complete when timer hits zero
  useEffect(() => {
    if (stage === 'speaking' && secondsRemaining === 0) {
      stopRecording().then((url) => {
        onCompleteSession({
          durationSeconds: targetDurationSeconds,
          continuedAfterTimer: false,
          audioUrl: url || undefined,
        });
      });
    }
  }, [secondsRemaining, stage, stopRecording, onCompleteSession, targetDurationSeconds]);

  // Auto-fade prompt after 5s
  useEffect(() => {
    if (stage === 'speaking') {
      const fadeTimer = setTimeout(() => setShowPromptText(false), 5000);
      return () => clearTimeout(fadeTimer);
    }
  }, [stage]);

  const handleManualFinish = useCallback(async () => {
    sounds.playCancel();
    const url = await stopRecording();
    onCompleteSession({
      durationSeconds: secondsElapsed,
      continuedAfterTimer: false,
      audioUrl: url || undefined,
    });
  }, [stopRecording, onCompleteSession, secondsElapsed, sounds]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainderSecs = secs % 60;
    return `${mins}:${remainderSecs < 10 ? '0' : ''}${remainderSecs}`;
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-6 md:px-8 overflow-x-hidden overflow-y-auto bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-500">
      {/* Background Ambient Glow */}
      <div
        className="absolute inset-0 z-0 pointer-events-none transition-all duration-1000 opacity-20"
        style={{
          background: `radial-gradient(circle at center, ${deck.accentColor} 0%, transparent 60%)`,
        }}
      />

      {/* STAGE 1: COUNTDOWN */}
      <AnimatePresence mode="wait">
        {stage === 'countdown' && (
          <motion.div
            key="countdown-stage"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex flex-col items-center justify-center text-center space-y-8"
          >
            <div className="flex items-center gap-4">
              <span
                className="w-2.5 h-2.5 rounded-none"
                style={{ backgroundColor: deck.accentColor }}
              />
              <span className="font-mono text-xs tracking-[0.2em] text-[var(--text-muted)] uppercase">
                {deck.name} PRACTICE
              </span>
            </div>

            {/* Animated countdown number — re-mounts each tick */}
            <AnimatePresence mode="wait">
              <motion.div
                key={String(countdownStep)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="text-9xl sm:text-[150px] font-light text-[var(--text-main)] tracking-[-0.03em] my-8 leading-none"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {countdownStep}
              </motion.div>
            </AnimatePresence>

            <p className="font-sans text-lg text-[var(--text-muted)] max-w-sm font-light">
              Organise your thoughts and speak continuously.
            </p>
          </motion.div>
        )}

        {/* STAGE 2: SPEAKING SESSION */}
        {stage === 'speaking' && (
          <motion.div
            key="speaking-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-[800px] flex flex-col items-center justify-between min-h-[85vh] pt-[calc(env(safe-area-inset-top)+64px)] pb-[calc(env(safe-area-inset-bottom)+48px)] flex-grow"
          >
            {/* Prompt display */}
            <div className="w-full flex flex-col items-center text-center pt-8 mb-8">
              <div className="flex items-center gap-6 mb-6">
                <span className="font-mono text-[10px] tracking-[0.2em] text-[var(--text-muted)] uppercase">
                  {deck.name}
                </span>
                <button
                  onClick={() => {
                    sounds.playTap();
                    setShowPromptText((prev) => !prev);
                  }}
                  className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors p-1"
                  title={showPromptText ? 'Hide prompt' : 'Show prompt'}
                >
                  {showPromptText ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              <AnimatePresence>
                {showPromptText && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="text-2xl sm:text-3xl text-[var(--text-main)] font-light max-w-2xl px-4 leading-tight italic"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    "{promptText}"
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Center Orb with Timer */}
            <div className="relative flex-grow flex flex-col items-center justify-center my-4 min-h-[300px]">
              <div className="scale-100 sm:scale-110 md:scale-125">
                <Orb 
                  accentColor={deck.accentColor} 
                  size={280}
                  progress={1 - (secondsRemaining / targetDurationSeconds)}
                >
                  <div
                    className="text-5xl md:text-6xl font-light text-[var(--text-main)] tracking-[-0.02em] tabular-nums leading-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {formatTime(secondsRemaining)}
                  </div>
                </Orb>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="w-full max-w-xs flex flex-col items-center gap-6 mt-8 pb-8 md:pb-12 px-6">
              {/* Mic indicator */}
              <div className="flex items-center gap-3">
                <Mic className="w-3.5 h-3.5 text-[var(--text-main)] animate-pulse" />
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--text-main)]">
                  Recording Live
                </span>
              </div>

              <button
                onClick={handleManualFinish}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[var(--surface-bg)] border border-[var(--surface-border)] text-[var(--text-main)] hover:bg-[var(--surface-border-hover)] font-mono text-[10px] uppercase tracking-[0.2em] transition-colors shadow-lg"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Finish Early</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

