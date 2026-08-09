'use client';

import React from 'react';
import { X, Mic, Volume2, ShieldCheck, Trash2, Sun, Moon } from 'lucide-react';
import { UserProgress } from '../lib/types';
import { motion } from 'framer-motion';
import { useSoundSystem } from '../hooks/use-sound-system';
import { supabase } from '../lib/supabase';

interface SettingsModalProps {
  progress: UserProgress;
  user?: any;
  onRequireAuth?: () => void;
  onClose: () => void;
  onUpdateProgress: (updated: UserProgress) => void;
  onResetData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  progress,
  user,
  onRequireAuth,
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

  const changeAmbientSound = (e: React.ChangeEvent<HTMLSelectElement>) => {
    sounds.playTap();
    const sound = e.target.value as any;
    onUpdateProgress({
      ...progress,
      ambientSound: sound,
    });
    // Let the hook handle the actual playing via useEffect in page.tsx or app-wide listener.
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

          {/* Account */}
          <div className="flex items-center justify-between border-b border-[var(--surface-border)] pb-8">
            <div className="flex items-start gap-4">
              <div className="w-5 h-5 mt-1 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div>
                <div className="font-sans text-base font-medium text-[var(--text-main)]">
                  Echo Account
                </div>
                <div className="font-sans text-sm text-[var(--text-muted)] mt-1 font-light">
                  {user ? `Signed in as ${user.email}` : 'Sync history & custom decks'}
                </div>
              </div>
            </div>
            {user ? (
              <button
                onClick={async () => {
                  sounds.playTap();
                  await supabase?.auth.signOut();
                }}
                className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] hover:text-rose-400 transition-colors"
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => {
                  sounds.playTap();
                  onRequireAuth?.();
                }}
                className="font-mono text-[10px] uppercase tracking-[0.2em] px-4 py-2 bg-[var(--text-main)] text-[var(--bg-main)] hover:bg-[var(--accent-warm)] transition-colors"
              >
                Sign In
              </button>
            )}
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
          {/* Interface Sound Effects */}
          <div className="flex items-center justify-between border-b border-[var(--surface-border)] pb-8">
            <div className="flex items-start gap-4">
              <Volume2 className="w-5 h-5 text-[var(--text-muted)] mt-1" />
              <div>
                <div className="font-sans text-base font-medium text-[var(--text-main)]">
                  Interface Sound Effects
              </div>
              <div className="font-sans text-sm text-[var(--text-muted)] mt-1 font-light">
                Micro-interactions and ambient chimes
              </div>
            </div>
            <button
              onClick={toggleSound}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                progress.soundEnabled ? 'bg-[var(--text-main)]' : 'bg-[var(--surface-border)]'
              }`}
            >
              <motion.div
                animate={{
                  left: progress.soundEnabled ? '26px' : '4px',
                }}
                className={`absolute top-1 w-4 h-4 rounded-full shadow-sm transition-colors ${
                  progress.soundEnabled ? 'bg-[var(--bg-main)]' : 'bg-[var(--text-muted)]'
                }`}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </div>

          {/* Ambient Soundscape Selection */}
          <div className="flex items-start justify-between border-b border-[var(--surface-border)] pb-8">
            <div className="max-w-[70%]">
              <div className="font-sans text-base font-medium text-[var(--text-main)]">
                Ambient Soundscapes
              </div>
              <div className="font-sans text-sm text-[var(--text-muted)] mt-1 font-light">
                Continuous background atmosphere during sessions
              </div>
            </div>
            <select 
              value={progress.ambientSound || 'none'} 
              onChange={changeAmbientSound}
              className="bg-transparent border border-[var(--surface-border)] text-[var(--text-main)] text-sm font-mono uppercase tracking-widest p-2 outline-none cursor-pointer"
            >
              <option value="none">None</option>
              <option value="space">Deep Space</option>
              <option value="rain">Rain on Glass</option>
              <option value="binaural">Binaural Focus</option>
            </select>
          </div>

        {/* Privacy Card */}
        <div className="p-6 bg-[var(--surface-bg)] border-l-2 border-emerald-500 space-y-3">
          <div className="flex items-center gap-3 text-emerald-500 font-mono text-xs">
            <ShieldCheck className="w-4 h-4" />
            <span className="uppercase tracking-[0.2em]">Privacy Sandbox</span>
          </div>
          <p className="font-sans text-sm text-[var(--text-muted)] leading-relaxed font-light">
            Zero cloud uploads. Zero speech transcription. All voice practice data remains strictly on your device.
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

