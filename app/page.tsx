'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { HomeView } from '../components/HomeView';
import { DeckSelectionView } from '../components/DeckSelectionView';
import { PromptView } from '../components/PromptView';
import { SessionView } from '../components/SessionView';
import { CompletionView } from '../components/CompletionView';
import { HistoryView } from '../components/HistoryView';
import { OnboardingModal } from '../components/OnboardingModal';
import { SettingsModal } from '../components/SettingsModal';
import { AuthModal } from '../components/AuthModal';
import { Deck, UserProgress } from '../lib/types';
import { DECKS } from '../lib/data';
import {
  getStoredProgress,
  saveProgress,
  recordCompletedSession,
} from '../lib/storage';
import { trackEvent, recordSessionBackend, getDecks, supabase } from '../lib/supabase';
import { AnimatePresence, motion } from 'framer-motion';

export default function Page() {
  const [decks, setDecks] = useState<Deck[]>(DECKS);
  const [isDecksLoaded, setIsDecksLoaded] = useState(false);
  const [progress, setProgress] = useState<UserProgress>(() => {
    if (typeof window !== 'undefined') {
      return getStoredProgress();
    }
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalSessions: 0,
      totalMinutes: 0,
      lastSessionDate: null,
      history: [],
      skipsRemaining: 2,
      hasCompletedOnboarding: false,
      audioRecordingEnabled: true,
      soundEnabled: true,
      hapticsEnabled: true,
      theme: 'dark',
    };
  });
  const [activeDeck, setActiveDeck] = useState<Deck>(DECKS[0]);

  // Current Screen State
  const [view, setView] = useState<
    'home' | 'decks' | 'prompt' | 'session' | 'completion' | 'history'
  >('home');

  // Bottom Nav Tab mapping
  const [activeTab, setActiveTab] = useState<'home' | 'decks' | 'history'>('home');

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
  
  // Auth state
  const [user, setUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  // Sync auth state
  useEffect(() => {
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
      });
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        setUser(session?.user ?? null);
        if (event === 'SIGNED_IN') {
          setView('history');
          setActiveTab('history');
        }
      });
      return () => subscription.unsubscribe();
    }
  }, []);

  // Sync theme attribute on document root
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', progress?.theme || 'dark');
    }
  }, [progress?.theme]);

  // Track App Launch
  useEffect(() => {
    if (progress) {
      trackEvent('app_launch', { 
        total_sessions: progress.totalSessions,
        streak: progress.currentStreak 
      });
    }
  }, []);

  // Fetch decks on mount
  useEffect(() => {
    async function load() {
      const fetched = await getDecks();
      if (fetched && fetched.length > 0) {
        setDecks(fetched);
        setActiveDeck(fetched[0]);
      }
      setIsDecksLoaded(true);
    }
    load();
  }, []);

  if (!progress || !isDecksLoaded) {
    return (
      <div className="min-h-screen w-full bg-[var(--bg-main)] flex items-center justify-center text-[var(--text-muted)] font-mono text-xs transition-colors duration-300">
        Connecting to Echo...
      </div>
    );
  }

  // Handle Bottom Nav selection
  const handleSelectTab = (tab: 'home' | 'decks' | 'history') => {
    if (tab === 'history' && !user) {
      setShowAuthModal(true);
      return;
    }
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
    
    trackEvent('session_started', {
      deck_id: activeDeck.id,
      duration_target: durationSeconds,
    });
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
    
    // Backend tracking
    recordSessionBackend(activeDeck.id, finalDuration, true, continuedAfterTimer);
    trackEvent('session_completed', {
      deck_id: activeDeck.id,
      duration_actual: finalDuration,
      continued: continuedAfterTimer,
      new_streak: restored.currentStreak
    });

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
    <div className="min-h-screen w-full bg-[var(--bg-main)] text-[var(--text-main)] font-sans relative select-none transition-colors duration-300">
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
          activeTab={view === 'home' || view === 'decks' || view === 'history' ? activeTab : undefined}
          onSelectTab={handleSelectTab}
          soundEnabled={progress.soundEnabled}
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
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <HomeView
              progress={progress}
              activeDeck={activeDeck}
              onStartSession={() => {
                setView('prompt');
              }}
              onSelectDeck={() => {
                trackEvent('deck_selection_opened');
                setView('decks');
                setActiveTab('decks');
              }}
            />
          </motion.div>
        )}

        {view === 'decks' && (
          <motion.div
            key="view-decks"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <DeckSelectionView
              decks={decks}
              currentDeckId={activeDeck.id}
              user={user}
              onRequireAuth={() => setShowAuthModal(true)}
              onSelectDeck={(deck) => setActiveDeck(deck)}
              onProceedToPrompt={(deck) => {
                trackEvent('deck_selected', { deck_id: deck.id });
                setActiveDeck(deck);
                setView('prompt');
              }}
            />
          </motion.div>
        )}

        {view === 'prompt' && (
          <motion.div
            key="view-prompt"
            initial={{ opacity: 0, y: 20, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
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
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <SessionView
              deck={activeDeck}
              promptText={currentPromptText}
              targetDurationSeconds={selectedDuration}
              onCompleteSession={handleSessionCompleted}
              onCancelSession={() => setView('home')}
              soundEnabled={progress.soundEnabled}
            />
          </motion.div>
        )}

        {view === 'completion' && (
          <motion.div
            key="view-completion"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <CompletionView
              deck={activeDeck}
              promptText={currentPromptText}
              durationSeconds={completedSessionDuration}
              progress={progress}
              onFinish={handleFinishCompletion}
            />
          </motion.div>
        )}

        {view === 'history' && (
          <motion.div
            key="view-history"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <HistoryView 
              progress={progress} 
              user={user}
              onSignOut={async () => {
                if (supabase) {
                  await supabase.auth.signOut();
                  setUser(null);
                  setView('home');
                }
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Onboarding Overlay */}
      {showOnboarding && (
        <OnboardingModal onComplete={handleCompleteOnboarding} />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          progress={progress}
          user={user}
          onRequireAuth={() => {
            setShowSettings(false);
            setShowAuthModal(true);
          }}
          onClose={() => setShowSettings(false)}
          onUpdateProgress={(updated) => {
            setProgress(updated);
            saveProgress(updated);
          }}
          onResetData={handleResetData}
          onSignOut={async () => {
            if (supabase) {
              await supabase.auth.signOut();
              setUser(null);
              setShowSettings(false);
              setView('home');
            }
          }}
        />
      )}

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        soundEnabled={progress.soundEnabled}
      />
    </div>
  );
}
