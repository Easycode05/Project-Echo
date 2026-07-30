'use client';

import React, { useState } from 'react';
import { ShieldCheck, CloudOff, Cpu, X, ChevronRight } from 'lucide-react';
import { Orb } from './Orb';
import { motion, AnimatePresence } from 'motion/react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050505] text-[#e5e2e1] overflow-hidden select-none">
      {/* Background Animated Orb */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <Orb accentColor="#1E1B4B" size={380} />
      </div>

      {/* Header Anchor */}
      <header className="fixed top-0 left-0 w-full flex items-center justify-between px-6 h-20 z-50">
        <span className="font-mono text-xs tracking-[0.25em] text-white uppercase font-medium">
          ECHO
        </span>
        <button
          onClick={onComplete}
          className="text-neutral-400 hover:text-white transition-opacity p-2"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 w-full max-w-[550px] px-6 flex flex-col items-center text-center my-auto">
        <AnimatePresence mode="wait">
          {/* SLIDE 0: Master your message */}
          {slide === 0 && (
            <motion.div
              key="slide-0"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.6 }}
              className="space-y-6 flex flex-col items-center"
            >
              <h1 className="font-sans text-4xl sm:text-5xl font-light text-white tracking-tight">
                Practice speaking every day.
              </h1>
              <p className="font-sans text-base sm:text-lg text-neutral-400 max-w-sm leading-relaxed font-light">
                One topic. Two minutes. Better communication and public speaking skills.
              </p>

              <div className="pt-12">
                <button
                  onClick={handleNext}
                  className="px-12 py-4 rounded-full bg-white/10 border border-white/20 backdrop-blur-2xl font-mono text-xs tracking-[0.2em] text-white uppercase hover:bg-white/20 transition-all active:scale-95 shadow-2xl"
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
              transition={{ duration: 0.6 }}
              className="space-y-6 flex flex-col items-center"
            >
              <h1 className="font-sans text-4xl sm:text-5xl font-light text-white tracking-tight">
                Speak with confidence.
              </h1>
              <p className="font-sans text-xl text-neutral-300 font-light max-w-md">
                Two minutes of continuous verbal delivery.
              </p>
              <p className="font-mono text-xs text-neutral-400 uppercase tracking-widest pt-2">
                Pick a topic, organize your thoughts, and speak continuously.
              </p>

              <div className="pt-8 flex flex-col items-center gap-4 w-full max-w-xs">
                <button
                  onClick={handleNext}
                  className="w-full py-4 rounded-full bg-white/10 border border-white/20 backdrop-blur-2xl font-mono text-xs tracking-[0.2em] text-white uppercase hover:bg-white/20 transition-all active:scale-95 shadow-2xl"
                >
                  Begin Practice
                </button>
                <button
                  onClick={onComplete}
                  className="font-mono text-xs text-neutral-400 underline underline-offset-8 hover:text-white transition-colors"
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
              transition={{ duration: 0.6 }}
              className="space-y-6 flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-white/[0.04] border border-white/10 backdrop-blur-2xl mb-2">
                <ShieldCheck className="w-8 h-8 text-[#c9c6c5]" />
              </div>

              <h1 className="font-sans text-3xl sm:text-4xl font-light text-white tracking-tight">
                Your voice belongs to you.
              </h1>
              <p className="font-sans text-sm text-neutral-300 max-w-md leading-relaxed">
                Echo is designed with a &quot;local-first&quot; philosophy. Your practice audio is processed entirely on this device and never uploaded or stored on cloud servers.
              </p>

              {/* Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full text-left pt-2">
                <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-4 rounded-2xl space-y-2">
                  <Cpu className="w-5 h-5 text-[#c9c6c5]" />
                  <h3 className="font-sans text-sm font-medium text-white">
                    On-Device Processing
                  </h3>
                  <p className="font-sans text-xs text-neutral-400 leading-normal">
                    Audio recording stays in a local sandbox, ensuring zero data leakage.
                  </p>
                </div>

                <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-4 rounded-2xl space-y-2">
                  <CloudOff className="w-5 h-5 text-[#c9c6c5]" />
                  <h3 className="font-sans text-sm font-medium text-white">
                    No Cloud Sync
                  </h3>
                  <p className="font-sans text-xs text-neutral-400 leading-normal">
                    Your practice audio stays on your hardware. We have no access to your voice.
                  </p>
                </div>
              </div>

              <div className="pt-6 w-full max-w-xs">
                <button
                  onClick={onComplete}
                  className="w-full py-4 rounded-full bg-[#c9c6c5] text-[#313030] font-sans font-medium text-sm tracking-widest uppercase hover:bg-white transition-all active:scale-95 shadow-xl flex items-center justify-center gap-2"
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
      <nav className="fixed bottom-8 left-0 w-full flex justify-center gap-3 items-center z-50">
        {[0, 1, 2].map((idx) => (
          <button
            key={idx}
            onClick={() => setSlide(idx)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              slide === idx ? 'bg-white scale-125' : 'bg-white/20 hover:bg-white/40'
            }`}
          />
        ))}
      </nav>
    </div>
  );
};
