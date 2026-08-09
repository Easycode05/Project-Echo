export type DeckId = 
  | 'reflection'
  | 'stories'
  | 'life'
  | 'philosophy'
  | 'spirituality'
  | 'imagination'
  | 'fun'
  | 'relationships'
  | 'career'
  | 'medicine'
  | 'dentistry'
  | 'surprise';

export interface Deck {
  id: DeckId;
  name: string;
  description: string;
  roomSubtitle: string;
  environmentMood: string;
  accentColor: string; // Hex or CSS color
  glowClass: string;
  cardBgClass: string;
  iconBgClass: string;
  iconName: string; // Lucide icon name string
}

export interface Prompt {
  id: string;
  deckId: DeckId;
  text: string;
  difficulty?: 'gentle' | 'reflective' | 'deep';
}

export interface Session {
  id: string;
  date: string; // ISO string
  deckId: DeckId;
  deckName: string;
  promptText: string;
  durationSeconds: number;
  completed: boolean;
  continuedAfterTimer: boolean;
  audioUrl?: string; // Optional local base64 audio recording
}


export interface UserProgress {
  currentStreak: number;
  longestStreak: number;
  totalSessions: number;
  totalMinutes: number;
  lastSessionDate: string | null;
  history: Session[];
  skipsRemaining: number;
  hasCompletedOnboarding: boolean;
  audioRecordingEnabled: boolean;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  theme?: 'dark' | 'light';
}
