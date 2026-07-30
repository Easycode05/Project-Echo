'use client';

import React from 'react';
import { X, Mic, Volume2, ShieldCheck, Trash2, Sun, Moon } from 'lucide-react';
import { UserProgress } from '../lib/types';
import { motion } from 'motion/react';

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
  const toggleRecording = () => {
    onUpdateProgress({
      ...progress,
      audioRecordingEnabled: !progress.audioRecordingEnabled,
    });
  };

  const toggleSound = () => {
    onUpdateProgress({
      ...progress,
      soundEnabled: !progress.soundEnabled,
    });
  };

  const toggleTheme = (newTheme: 'dark' | 'light') => {
    onUpdateProgress({
      ...progress,
      theme: newTheme,
    });
  };

  const currentTheme = progress.theme || 'dark';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-md select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[var(--modal-bg)] border border-[var(--surface-border)] p-6 rounded-3xl w-full max-w-md space-y-6 shadow-2xl relative text-[var(--text-main)]"
      >
        <div className="flex items-center justify-between border-b border-[var(--surface-border)] pb-4">
          <div className="space-y-0.5">
            <span className="font-mono text-[10px] tracking-[0.2em] text-[var(--text-muted)] uppercase">
              PREFERENCES
            </span>
            <h2 className="font-sans text-xl font-light text-[var(--text-main)]">
              Echo Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--text-main)] p-1 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toggles */}
        <div className="space-y-4">
          {/* Theme Selector */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[var(--surface-bg)] border border-[var(--surface-border)]">
            <div className="flex items-center gap-3">
              {currentTheme === 'dark' ? (
                <Moon className="w-5 h-5 text-indigo-400" />
              ) : (
                <Sun className="w-5 h-5 text-amber-500" />
              )}
              <div>
                <div className="font-sans text-sm font-medium text-[var(--text-main)]">
                  Appearance Mode
                </div>
                <div className="font-sans text-xs text-[var(--text-muted)]">
                  {currentTheme === 'dark' ? 'Dark Atmospheric' : 'Pristine Light'}
                </div>
              </div>
            </div>

            <div className="flex items-center p-0.5 rounded-full bg-[var(--pill-bg)] border border-[var(--surface-border)] text-xs font-mono">
              <button
                onClick={() => toggleTheme('dark')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-all ${
                  currentTheme === 'dark'
                    ? 'bg-[var(--button-bg)] text-[var(--button-text)] font-semibold shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                <Moon className="w-3 h-3" />
                <span>Dark</span>
              </button>
              <button
                onClick={() => toggleTheme('light')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-all ${
                  currentTheme === 'light'
                    ? 'bg-[var(--button-bg)] text-[var(--button-text)] font-semibold shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                <Sun className="w-3 h-3" />
                <span>Light</span>
              </button>
            </div>
          </div>

          {/* Audio Recording */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[var(--surface-bg)] border border-[var(--surface-border)]">
            <div className="flex items-center gap-3">
              <Mic className="w-5 h-5 text-emerald-500" />
              <div>
                <div className="font-sans text-sm font-medium text-[var(--text-main)]">
                  Record Local Audio
                </div>
                <div className="font-sans text-xs text-[var(--text-muted)]">
                  Save voice recordings locally on this device
                </div>
              </div>
            </div>
            <button
              onClick={toggleRecording}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                progress.audioRecordingEnabled ? 'bg-emerald-500' : 'bg-neutral-400/40'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  progress.audioRecordingEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Sound Cues */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[var(--surface-bg)] border border-[var(--surface-border)]">
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-[var(--text-muted)]" />
              <div>
                <div className="font-sans text-sm font-medium text-[var(--text-main)]">
                  Completion Audio Cue
                </div>
                <div className="font-sans text-xs text-[var(--text-muted)]">
                  Play soft audio cue when practice completes
                </div>
              </div>
            </div>
            <button
              onClick={toggleSound}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                progress.soundEnabled ? 'bg-emerald-500' : 'bg-neutral-400/40'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  progress.soundEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Privacy Card */}
        <div className="p-4 rounded-2xl bg-[var(--surface-bg)] border border-[var(--surface-border)] space-y-2">
          <div className="flex items-center gap-2 text-emerald-500 font-mono text-xs">
            <ShieldCheck className="w-4 h-4" />
            <span className="uppercase tracking-wider">Local-First Sandbox</span>
          </div>
          <p className="font-sans text-xs text-[var(--text-muted)] leading-relaxed">
            Zero cloud uploads. Zero speech transcription or AI evaluations. All practice data remains strictly on your device.
          </p>
        </div>

        {/* Reset */}
        <div className="pt-2 border-t border-[var(--surface-border)] flex items-center justify-between">
          <button
            onClick={() => {
              if (confirm('Reset practice progress and streak history?')) {
                onResetData();
                onClose();
              }
            }}
            className="flex items-center gap-2 text-xs font-mono text-rose-500 hover:text-rose-400 transition-colors py-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Local History</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
