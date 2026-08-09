import { UserProgress, Session } from './types';

const STORAGE_KEY = 'echo_app_user_progress_v1';

const defaultProgress: UserProgress = {
  currentStreak: 12, // Initial realistic momentum matching visual PRD mockup, can be updated by actual practice
  longestStreak: 14,
  totalSessions: 8,
  totalMinutes: 24,
  lastSessionDate: null,
  history: [
    {
      id: 'mock-1',
      date: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // Today
      deckId: 'reflection',
      deckName: 'Reflection',
      promptText: 'What belief have you changed your mind about?',
      durationSeconds: 270, // 4m 30s
      completed: true,
      continuedAfterTimer: true,
    },
    {
      id: 'mock-2',
      date: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(), // Yesterday
      deckId: 'philosophy',
      deckName: 'Philosophy',
      promptText: 'Is it better to seek certainty or embrace ambiguity?',
      durationSeconds: 735, // 12m 15s
      completed: true,
      continuedAfterTimer: true,
    },
    {
      id: 'mock-3',
      date: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(), // Yesterday morning
      deckId: 'stories',
      deckName: 'Stories',
      promptText: 'Describe a stranger you met once but have never forgotten.',
      durationSeconds: 120, // 2m 00s
      completed: true,
      continuedAfterTimer: false,
    },
    {
      id: 'mock-4',
      date: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
      deckId: 'career',
      deckName: 'Career',
      promptText: 'What work endeavor made you feel most effective?',
      durationSeconds: 525, // 8m 45s
      completed: true,
      continuedAfterTimer: true,
    },
  ],
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
