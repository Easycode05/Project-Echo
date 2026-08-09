import { UserProgress, Session } from './types';

const STORAGE_KEY = 'echo_app_user_progress_v1';

const defaultProgress: UserProgress = {
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

export function getStoredProgress(): UserProgress {
  if (typeof window === 'undefined') return defaultProgress;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProgress));
      return defaultProgress;
    }
    const parsed = JSON.parse(raw) as UserProgress;

    return {
      ...defaultProgress,
      ...parsed,
    };
  } catch (err) {
    console.error('Failed to read Echo user progress:', err);
    return defaultProgress;
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (err) {
    console.error('Failed to save Echo user progress:', err);
  }
}

export function recordCompletedSession(sessionData: {
  deckId: string;
  deckName: string;
  promptText: string;
  durationSeconds: number;
  continuedAfterTimer: boolean;
  audioUrl?: string;
}): UserProgress {
  const current = getStoredProgress();
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  let newStreak = current.currentStreak;
  const lastDate = current.lastSessionDate ? new Date(current.lastSessionDate) : null;

  if (lastDate) {
    const lastDateStr = lastDate.toISOString().split('T')[0];
    const diffTime = Math.abs(now.getTime() - lastDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (lastDateStr !== todayStr) {
      if (diffDays <= 1) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }
    }
  } else {
    newStreak = Math.max(1, current.currentStreak);
  }

  const newSession: Session = {
    id: `session-${Date.now()}`,
    date: now.toISOString(),
    deckId: sessionData.deckId as any,
    deckName: sessionData.deckName,
    promptText: sessionData.promptText,
    durationSeconds: sessionData.durationSeconds,
    completed: true,
    continuedAfterTimer: sessionData.continuedAfterTimer,
    audioUrl: sessionData.audioUrl,
  };

  const updatedHistory = [newSession, ...current.history];
  const totalMins = current.totalMinutes + Math.round(sessionData.durationSeconds / 60);

  const updated: UserProgress = {
    ...current,
    currentStreak: newStreak,
    longestStreak: Math.max(newStreak, current.longestStreak),
    totalSessions: current.totalSessions + 1,
    totalMinutes: totalMins,
    lastSessionDate: now.toISOString(),
    history: updatedHistory,
    skipsRemaining: 2, // Reset skips after session
  };

  saveProgress(updated);
  return updated;
}
