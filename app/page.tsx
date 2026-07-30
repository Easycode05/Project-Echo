'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { BottomNav, TabType } from '../components/BottomNav';
import { HomeView } from '../components/HomeView';
import { DeckSelectionView } from '../components/DeckSelectionView';
import { PromptView } from '../components/PromptView';
import { SessionView } from '../components/SessionView';
import { CompletionView } from '../components/CompletionView';
import { HistoryView } from '../components/HistoryView';
import { OnboardingModal } from '../components/OnboardingModal';
import { SettingsModal } from '../components/SettingsModal';
import { Deck, UserProgress } from '../lib/types';
import { DECKS } from '../lib/data';
import {
  getStoredProgress,
  saveProgress,
  recordCompletedSession,
} from '../lib/storage';
import { AnimatePresence, motion } from 'motion/react';

export default function Page() {
  const [progress, setProgress] = useState<UserProgress>(() => {
    if (typeof window !== 'undefined') {
      return getStoredProgress();
    }
    return {
      currentStreak: 12,
      longestStreak: 14,
      totalSessions: 8,
      totalMinutes: 24,
      lastSessionDate: null,
      history: [],
      skipsRemaining: 2,
      hasCompletedOnboarding: false,
      audioRecordingEnabled: true,
      soundEnabled: true,
      hapticsEnabled: true,
    };
  });
  const [activeDeck, setActiveDeck] = useState<Deck>(DECKS[0]);

  // Current Screen State
  const [view, setView] = useState<
    'home' | 'decks' | 'prompt' | 'session' | 'completion' | 'history'
  >('home');

  // Bottom Nav Tab mapping
  const [activeTab, setActiveTab] = useState<TabType>('home');

  // Active session parameters
  const [currentPromptText, setCurrentPromptText] = useState<string>('');
  const [selectedDuration, setSelectedDuration] = useState<number>(120);
  const [completedSessionDuration, setCompletedSessionDuration] = useState<number>(120);

  // Modals
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const loaded = getStoredProgress();
      return !loaded.hasCompletedOnboarding;
    }
    return false;
  });
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // Sync theme attribute on document root
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', progress?.theme || 'dark');
    }
  }, [progress?.theme]);

  if (!progress) {
    return (
      <div className="min-h-screen w-full bg-[#050505] flex items-center justify-center text-white font-mono text-xs">
        Initializing Echo...
      </div>
    );
  }

  // Handle Bottom Nav selection
  const handleSelectTab = (tab: TabType) => {
    setActiveTab(tab);
    if (tab === 'home') setView('home');
    if (tab === 'decks') setView('decks');
    if (tab === 'history') setView('history');
  };

  // Skip prompt logic
  const handleUseSkip = () => {
    const nextSkips = progress.skipsRemaining > 1 ? progress.skipsRemaining - 1 : 2;
    const updated = {
      ...progress,
      skipsRemaining: nextSkips,
    };
    setProgress(updated);
    saveProgress(updated);
  };

  // Start practice session
  const handleBeginPractice = (promptText: string, durationSeconds: number) => {
    setCurrentPromptText(promptText);
    setSelectedDuration(durationSeconds);
    setView('session');
  };

  // Session completion
  const handleSessionCompleted = (result: {
    durationSeconds: number;
    continuedAfterTimer: boolean;
    audioUrl?: string;
  }) => {
    setCompletedSessionDuration(result.durationSeconds);
    setView('completion');
  };

  // Finish completion & record session
  const handleFinishCompletion = (
    finalDuration: number,
    continuedAfterTimer: boolean
  ) => {
    const updated = recordCompletedSession({
      deckId: activeDeck.id,
      deckName: activeDeck.name,
      promptText: currentPromptText,
      durationSeconds: finalDuration,
      continuedAfterTimer,
    });
    // Ensure skips are restored to 2 after completing session
    const restored = {
      ...updated,
      skipsRemaining: 2,
    };
    setProgress(restored);
    saveProgress(restored);
    setView('history');
    setActiveTab('history');
  };

  // Onboarding completion
  const handleCompleteOnboarding = () => {
    setShowOnboarding(false);
    const updated = {
      ...progress,
      hasCompletedOnboarding: true,
    };
    setProgress(updated);
    saveProgress(updated);
  };

  // Reset user data
  const handleResetData = () => {
    localStorage.removeItem('echo_app_user_progress_v1');
    const fresh = getStoredProgress();
    setProgress(fresh);
    setView('home');
    setActiveTab('home');
  };

  const isFullscreenView = view === 'session' || view === 'completion';

  return (
    <div className="min-h-screen w-full bg-[#050505] text-[#e5e2e1] font-sans relative select-none">
      {/* Top App Bar Header (Hidden in transactional session screens) */}
      {!isFullscreenView && (
        <Header
          title="ECHO"
          showBack={view === 'prompt' || view === 'decks'}
          showClose={view === 'prompt'}
          onBack={() => {
            if (view === 'prompt') setView('decks');
            else if (view === 'decks') setView('home');
          }}
          onClose={() => setView('home')}
          onOpenSettings={() => setShowSettings(true)}
        />
      )}

      {/* View Switcher Container */}
      <AnimatePresence mode="wait">
        {view === 'home' && (
          <motion.div
            key="view-home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <HomeView
              progress={progress}
              activeDeck={activeDeck}
              onStartSession={() => {
                setView('prompt');
              }}
              onSelectDeck={() => {
                setView('decks');
                setActiveTab('decks');
              }}
            />
          </motion.div>
        )}

        {view === 'decks' && (
          <motion.div
            key="view-decks"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <DeckSelectionView
              currentDeckId={activeDeck.id}
              onSelectDeck={(deck) => setActiveDeck(deck)}
              onProceedToPrompt={(deck) => {
                setActiveDeck(deck);
                setView('prompt');
              }}
            />
          </motion.div>
        )}

        {view === 'prompt' && (
          <motion.div
            key="view-prompt"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <PromptView
              deck={activeDeck}
              onBeginPractice={handleBeginPractice}
            />
          </motion.div>
        )}

        {view === 'session' && (
          <motion.div
            key="view-session"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <SessionView
              deck={activeDeck}
              promptText={currentPromptText}
              targetDurationSeconds={selectedDuration}
              onCompleteSession={handleSessionCompleted}
              onCancelSession={() => setView('home')}
            />
          </motion.div>
        )}

        {view === 'completion' && (
          <motion.div
            key="view-completion"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <CompletionView
              deck={activeDeck}
              durationSeconds={completedSessionDuration}
              progress={progress}
              onFinish={handleFinishCompletion}
            />
          </motion.div>
        )}

        {view === 'history' && (
          <motion.div
            key="view-history"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <HistoryView progress={progress} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Bottom Nav Dock (Hidden in full-screen session & completion modes) */}
      {!isFullscreenView && (
        <BottomNav activeTab={activeTab} onSelectTab={handleSelectTab} />
      )}

      {/* Onboarding Overlay */}
      {showOnboarding && (
        <OnboardingModal onComplete={handleCompleteOnboarding} />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          progress={progress}
          onClose={() => setShowSettings(false)}
          onUpdateProgress={(updated) => {
            setProgress(updated);
            saveProgress(updated);
          }}
          onResetData={handleResetData}
        />
      )}
    </div>
  );
}
