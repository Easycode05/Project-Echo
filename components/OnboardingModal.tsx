'use client';

import React, { useState } from 'react';
import { ShieldCheck, CloudOff, Cpu, X, ChevronRight } from 'lucide-react';
import { Orb } from './Orb';
import { motion, AnimatePresence } from 'framer-motion';

interface OnboardingModalProps {
  onComplete: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete }) => {
  const [slide, setSlide] = useState<number>(0);

  const handleNext = () => {
    if (slide < 2) {
      setSlide((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6 md:px-8 bg-[var(--bg-main)] text-[var(--text-main)] overflow-x-hidden overflow-y-auto select-none transition-colors duration-500 pt-[calc(env(safe-area-inset-top)+48px)] pb-[calc(env(safe-area-inset-bottom)+48px)]">
      {/* Background Animated Orb */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <Orb accentColor="#1E1B4B" size={380} />
      </div>

      {/* Header Anchor */}
      <header className="fixed top-0 left-0 w-full flex items-center justify-between px-6 md:px-8 pt-[calc(env(safe-area-inset-top)+32px)] pb-6 z-50">
        <span className="font-mono text-[10px] tracking-[0.2em] text-[var(--text-muted)] uppercase">
          ECHO PROJECT
        </span>
        <button
          onClick={onComplete}
          className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors p-2"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 w-full max-w-[600px] px-8 flex flex-col items-center text-center my-auto">
        <AnimatePresence mode="wait">
          {/* SLIDE 0: Master your message */}
          {slide === 0 && (
            <motion.div
              key="slide-0"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6 flex flex-col items-center"
            >
              <h1
                className="text-5xl sm:text-6xl font-light text-[var(--text-main)] tracking-[-0.02em] leading-none"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Practice speaking<br/>every day.
              </h1>
              <p className="font-sans text-lg text-[var(--text-muted)] max-w-sm leading-relaxed font-light mt-4">
                One topic. Two minutes. Better communication and public speaking skills.
              </p>

              <div className="pt-12 w-full max-w-[280px]">
                <button
                  onClick={handleNext}
                  className="w-full px-10 py-5 bg-[var(--text-main)] text-[var(--bg-main)] font-mono text-[10px] tracking-[0.2em] uppercase transition-colors hover:bg-[var(--accent-warm)]"
                >
                  Get Started
                </button>
              </div>
            </motion.div>
          )}

          {/* SLIDE 1: Create your space */}
          {slide === 1 && (
            <motion.div
              key="slide-1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6 flex flex-col items-center"
            >
              <h1
                className="text-5xl sm:text-6xl font-light text-[var(--text-main)] tracking-[-0.02em] leading-none"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Speak with<br/>confidence.
              </h1>
              <p className="font-sans text-xl text-[var(--text-main)] font-light max-w-md mt-4">
                Two minutes of continuous verbal delivery.
              </p>
              <p className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-[0.2em] mt-2 border-t border-[var(--surface-border)] pt-4">
                Pick a topic, organize your thoughts, and speak continuously.
              </p>

              <div className="pt-12 flex flex-col items-center gap-6 w-full max-w-[280px]">
                <button
                  onClick={handleNext}
                  className="w-full px-10 py-5 bg-[var(--text-main)] text-[var(--bg-main)] font-mono text-[10px] tracking-[0.2em] uppercase transition-colors hover:bg-[var(--accent-warm)]"
                >
                  Begin Practice
                </button>
                <button
                  onClick={onComplete}
                  className="font-mono text-[10px] text-[var(--text-muted)] tracking-[0.1em] uppercase hover:text-[var(--text-main)] transition-colors border-b border-transparent hover:border-[var(--text-main)] pb-1"
                >
                  Skip setup for now
                </button>
              </div>
            </motion.div>
          )}

          {/* SLIDE 2: Your voice belongs to you */}
          {slide === 2 && (
            <motion.div
              key="slide-2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8 flex flex-col items-center"
            >
              <h1
                className="text-4xl sm:text-5xl font-light text-[var(--text-main)] tracking-[-0.02em] leading-none"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Your voice belongs<br/>to you.
              </h1>
              <p className="font-sans text-base text-[var(--text-muted)] max-w-md leading-relaxed font-light">
                Echo is designed with a "local-first" philosophy. Your practice audio is processed entirely on this device and never uploaded or stored on cloud servers.
              </p>

              {/* Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px w-full text-left pt-6 bg-[var(--surface-border)]">
                <div className="bg-[var(--bg-main)] p-8 flex flex-col gap-4">
                  <Cpu className="w-5 h-5 text-[var(--text-main)]" />
                  <div>
                    <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-main)] mb-2">
                      On-Device
                    </h3>
                    <p className="font-sans text-xs text-[var(--text-muted)] leading-relaxed font-light">
                      Audio recording stays in a local sandbox, ensuring zero data leakage.
                    </p>
                  </div>
                </div>

                <div className="bg-[var(--bg-main)] p-8 flex flex-col gap-4">
                  <CloudOff className="w-5 h-5 text-[var(--text-main)]" />
                  <div>
                    <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-main)] mb-2">
                      No Cloud Sync
                    </h3>
                    <p className="font-sans text-xs text-[var(--text-muted)] leading-relaxed font-light">
                      Your practice audio stays on your hardware. We have no access to your voice.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-8 w-full max-w-[280px]">
                <button
                  onClick={onComplete}
                  className="w-full px-10 py-5 bg-[var(--text-main)] text-[var(--bg-main)] font-mono text-[10px] tracking-[0.2em] uppercase transition-colors hover:bg-[var(--accent-warm)] flex items-center justify-center gap-3"
                >
                  <span>Continue</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Progress Dots Nav */}
      <nav className="fixed bottom-[calc(env(safe-area-inset-bottom)+32px)] left-0 w-full flex justify-center gap-4 items-center z-50 pointer-events-auto">
        {[0, 1, 2].map((idx) => (
          <button
            key={idx}
            onClick={() => setSlide(idx)}
            className={`w-2 h-2 transition-all duration-300 rounded-none ${
              slide === idx ? 'bg-[var(--text-main)] scale-110' : 'bg-[var(--surface-border)] hover:bg-[var(--text-muted)]'
            }`}
          />
        ))}
      </nav>
    </div>
  );
};
