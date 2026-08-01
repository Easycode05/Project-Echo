'use client';

import React from 'react';
import { X, Mic, Volume2, ShieldCheck, Trash2, Sun, Moon } from 'lucide-react';
import { UserProgress } from '../lib/types';
import { motion } from 'framer-motion';
import { useSoundSystem } from '../hooks/use-sound-system';

interface SettingsModalProps {
  progress: UserProgress;
  onClose: () => void;
  onUpdateProgress: (updated: UserProgress) => void;
  onResetData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  progress,
  onClose,
  onUpdateProgress,
  onResetData,
}) => {
  const sounds = useSoundSystem(progress.soundEnabled);

  const toggleRecording = () => {
    sounds.playTap();
    onUpdateProgress({
      ...progress,
      audioRecordingEnabled: !progress.audioRecordingEnabled,
    });
  };

  const toggleSound = () => {
    const nextState = !progress.soundEnabled;
    // We instantiate a temporary sound hook for immediate feedback if toggling ON
    if (nextState) {
       // Since state hasn't propagated yet, we bypass enabled check for this one tick
       // Actually we can just wait for re-render, but playTap is fine.
    }
    onUpdateProgress({
      ...progress,
      soundEnabled: nextState,
    });
  };

  const toggleTheme = (newTheme: 'dark' | 'light') => {
    if (newTheme === 'dark') sounds.playToggleOff();
    else sounds.playToggleOn();
    
    onUpdateProgress({
      ...progress,
      theme: newTheme,
    });
  };

  const currentTheme = progress.theme || 'dark';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[var(--bg-main)]/95 backdrop-blur-md select-none pt-[calc(env(safe-area-inset-top)+48px)] pb-[calc(env(safe-area-inset-bottom)+48px)] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="bg-[var(--bg-main)] mx-auto border border-[var(--surface-border)] p-8 md:p-10 w-full max-w-lg space-y-12 shadow-2xl relative text-[var(--text-main)]"
      >
        <div className="flex items-center justify-between border-b border-[var(--surface-border)] pb-6">
          <div className="space-y-1">
            <span className="font-mono text-[10px] tracking-[0.2em] text-[var(--text-muted)] uppercase">
              PREFERENCES
            </span>
            <h2
              className="text-4xl font-light text-[var(--text-main)] tracking-[-0.02em]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Settings
            </h2>
          </div>
          <button
            onClick={() => {
              sounds.playTap();
              onClose();
            }}
            className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors p-2"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Toggles */}
        <div className="space-y-8">
          {/* Theme Selector */}
          <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4 border-b border-[var(--surface-border)] pb-8">
            <div className="flex items-start gap-4">
              {currentTheme === 'dark' ? (
                <Moon className="w-5 h-5 text-indigo-400 mt-1" />
              ) : (
                <Sun className="w-5 h-5 text-amber-500 mt-1" />
              )}
              <div>
                <div className="font-sans text-base font-medium text-[var(--text-main)]">
                  Appearance Mode
                </div>
                <div className="font-sans text-sm text-[var(--text-muted)] mt-1 font-light">
                  {currentTheme === 'dark' ? 'Dark Atmospheric' : 'Pristine Light'}
                </div>
              </div>
            </div>

            <div className="relative flex items-center bg-[var(--surface-bg)] rounded-full p-1 border border-[var(--surface-border)] w-full sm:w-[220px]">
              <motion.div
                className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[var(--text-main)] rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.1)]"
                animate={{
                  left: currentTheme === 'dark' ? '4px' : 'calc(50%)',
                }}
                transition={{ type: "spring", stiffness: 500, damping: 35, mass: 1 }}
              />
              <button
                onClick={() => toggleTheme('dark')}
                className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 transition-colors duration-300 ${
                  currentTheme === 'dark'
                    ? 'text-[var(--bg-main)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span className="uppercase tracking-widest text-[10px] font-mono">Dark</span>
              </button>
              <button
                onClick={() => toggleTheme('light')}
                className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 transition-colors duration-300 ${
                  currentTheme === 'light'
                    ? 'text-[var(--bg-main)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span className="uppercase tracking-widest text-[10px] font-mono">Light</span>
              </button>
            </div>
          </div>

          {/* Audio Recording */}
          <div className="flex items-center justify-between border-b border-[var(--surface-border)] pb-8">
            <div className="flex items-start gap-4">
              <Mic className="w-5 h-5 text-emerald-500 mt-1" />
              <div>
                <div className="font-sans text-base font-medium text-[var(--text-main)]">
                  Record Local Audio
                </div>
                <div className="font-sans text-sm text-[var(--text-muted)] mt-1 font-light">
                  Save voice recordings locally on this device
                </div>
              </div>
            </div>
            <button
              onClick={toggleRecording}
              className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
            >
              <span>{progress.audioRecordingEnabled ? 'Enabled' : 'Disabled'}</span>
              <div
                className={`w-10 h-1 transition-colors ${
                  progress.audioRecordingEnabled ? 'bg-emerald-500' : 'bg-[var(--surface-border)]'
                }`}
              />
            </button>
          </div>

          {/* Sound Cues */}
          <div className="flex items-center justify-between border-b border-[var(--surface-border)] pb-8">
            <div className="flex items-start gap-4">
              <Volume2 className="w-5 h-5 text-[var(--text-muted)] mt-1" />
              <div>
                <div className="font-sans text-base font-medium text-[var(--text-main)]">
                  Interface Sounds
                </div>
                <div className="font-sans text-sm text-[var(--text-muted)] mt-1 font-light">
                  Play subtle audio cues for interactions
                </div>
              </div>
            </div>
            <button
              onClick={toggleSound}
              className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
            >
              <span>{progress.soundEnabled ? 'Enabled' : 'Disabled'}</span>
              <div
                className={`w-10 h-1 transition-colors ${
                  progress.soundEnabled ? 'bg-emerald-500' : 'bg-[var(--surface-border)]'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Privacy Card */}
        <div className="p-6 bg-[var(--surface-bg)] border-l-2 border-emerald-500 space-y-3">
          <div className="flex items-center gap-3 text-emerald-500 font-mono text-xs">
            <ShieldCheck className="w-4 h-4" />
            <span className="uppercase tracking-[0.2em]">Local-First Sandbox</span>
          </div>
          <p className="font-sans text-sm text-[var(--text-muted)] leading-relaxed font-light">
            Zero cloud uploads. Zero speech transcription or AI evaluations. All practice data remains strictly on your device.
          </p>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-[var(--surface-border)] flex items-center justify-between mt-8">
          <button
            onClick={() => {
              sounds.playTap();
              if (confirm('Reset practice progress and streak history?')) {
                sounds.playCancel();
                onResetData();
                onClose();
              }
            }}
            className="flex items-center gap-2 text-[10px] font-mono text-rose-500 hover:text-rose-400 transition-colors py-2 tracking-[0.1em] uppercase border-b border-transparent hover:border-rose-400"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>

          <button
            onClick={() => {
              sounds.playTap();
              onClose();
            }}
            className="px-8 py-4 bg-[var(--text-main)] text-[var(--bg-main)] font-mono text-[10px] tracking-[0.2em] uppercase transition-colors hover:bg-[var(--accent-warm)]"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
};

