'use client';

import React, { useState } from 'react';
import {
  Trees,
  BookOpen,
  Compass,
  Sparkles,
  SunMedium,
  Palette,
  Smile,
  Heart,
  Building2,
  Activity,
  Shuffle,
  ChevronRight,
  Calendar,
  Clock,
  X,
} from 'lucide-react';
import { UserProgress, Session } from '../lib/types';
import { DECKS } from '../lib/data';
import { motion, AnimatePresence } from 'framer-motion';

interface HistoryViewProps {
  progress: UserProgress;
  user?: any;
  onSignOut?: () => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Trees,
  BookOpen,
  Compass,
  Sparkles,
  SunMedium,
  Palette,
  Smile,
  Heart,
  Building2,
  Activity,
  Shuffle,
};

export const HistoryView: React.FC<HistoryViewProps> = ({ progress, user, onSignOut }) => {
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  // Group past sessions by relative day
  const sessions = progress.history || [];

  const formatSecs = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  const getDeckInfo = (deckId: string) => {
    return DECKS.find((d) => d.id === deckId) || DECKS[0];
  };

  // Generate last 364 days for the heatmap (52 weeks * 7 days)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const heatmapDays = Array.from({ length: 364 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (363 - i));
    return d;
  });

  const sessionMap = new Map<string, Session[]>();
  sessions.forEach(s => {
    const dStr = new Date(s.date).toDateString();
    if (!sessionMap.has(dStr)) sessionMap.set(dStr, []);
    sessionMap.get(dStr)!.push(s);
  });

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center pt-[calc(env(safe-area-inset-top)+128px)] pb-[calc(env(safe-area-inset-bottom)+128px)] px-6 md:px-8 overflow-x-hidden overflow-y-auto bg-[var(--bg-main)] text-[var(--text-main)] no-scrollbar transition-colors duration-500">
      <main className="relative z-10 w-full max-w-[800px] mx-auto flex flex-col space-y-20">
        
        {/* Header */}
        <div className="space-y-4 flex justify-between items-end">
          <div className="space-y-4">
            <span className="font-mono text-[10px] tracking-[0.2em] text-[var(--text-muted)] uppercase flex items-center gap-2">
              <Activity className="w-3.5 h-3.5" />
              Activity Log
            </span>
            <h1
              className="text-5xl md:text-7xl font-light text-[var(--text-main)] tracking-[-0.02em] leading-none"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {user ? `Welcome, ${user.user_metadata?.name || user.email?.split('@')[0]}` : 'Your History'}
            </h1>
          </div>
          {user && onSignOut && (
            <button
              onClick={onSignOut}
              className="font-mono text-[10px] uppercase tracking-[0.2em] border-b border-transparent hover:border-rose-400 text-[var(--text-muted)] hover:text-rose-400 transition-colors pb-1 mb-2"
            >
              Sign Out
            </button>
          )}
        </div>

        {/* Consistency Section */}
        <section className="space-y-8 border-t border-[var(--surface-border)] pt-8">
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-[10px] tracking-[0.2em] text-[var(--text-muted)] uppercase font-semibold">
              Practice Consistency
            </h2>
          </div>

          <div className="p-8 border border-[var(--surface-border)] bg-[var(--surface-bg)] overflow-hidden">
            <div className="flex flex-col gap-6 w-full">
              <div className="w-full overflow-x-auto no-scrollbar pb-2" style={{ direction: 'rtl' }}>
                <div className="grid grid-flow-col grid-rows-7 gap-1.5 w-max" style={{ direction: 'ltr' }}>
                  {heatmapDays.map((day, idx) => {
                    const dStr = day.toDateString();
                    const daySessions = sessionMap.get(dStr) || [];
                    const hasSession = daySessions.length > 0;
                    
                    let bgColor = 'transparent';
                    let borderColor = 'var(--surface-border)';
                    let opacity = 1;
                    
                    if (hasSession) {
                      const deckId = daySessions[0].deckId;
                      const deck = getDeckInfo(deckId);
                      bgColor = deck.accentColor;
                      borderColor = deck.accentColor;
                      
                      // Intensity based on session count
                      if (daySessions.length === 1) opacity = 0.4;
                      else if (daySessions.length === 2) opacity = 0.7;
                      else opacity = 1;
                    }
                    
                    return (
                      <div
                        key={idx}
                        className="w-3 h-3 rounded-[2px] transition-transform hover:scale-125 cursor-pointer"
                        style={{ 
                          backgroundColor: bgColor, 
                          borderColor: borderColor,
                          borderWidth: '1px',
                          opacity: hasSession ? opacity : 1
                        }}
                        title={`${day.toLocaleDateString()}: ${daySessions.length} session(s)`}
                      />
                    );
                  })}
                </div>
              </div>
              <div className="flex justify-between font-mono text-[9px] text-[var(--text-muted)] uppercase tracking-widest pt-4 border-t border-[var(--surface-border)]">
                <span>1 Year Ago</span>
                <span>Today</span>
              </div>
            </div>
          </div>
        </section>

        {/* Past Sessions List */}
        <section className="space-y-8 border-t border-[var(--surface-border)] pt-8">
          <h2 className="font-mono text-[10px] tracking-[0.2em] text-[var(--text-muted)] uppercase font-semibold">
            Past Sessions
          </h2>

          {sessions.length === 0 ? (
            <div className="p-12 border border-[var(--surface-border)] bg-[var(--surface-bg)] text-center">
              <p className="font-sans text-lg text-[var(--text-muted)] font-light">
                No recorded speaking practice sessions yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sessions.map((session) => {
                const deck = getDeckInfo(session.deckId);
                const IconComp = ICON_MAP[deck.iconName] || Sparkles;
                const sessionDate = new Date(session.date);
                const dateStr = sessionDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
                const timeStr = sessionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                return (
                  <motion.div
                    key={session.id}
                    onClick={() => setSelectedSession(session)}
                    className="p-6 border border-[var(--surface-border)] bg-[var(--surface-bg)] hover:border-[var(--text-main)] cursor-pointer transition-colors group flex flex-col gap-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-1.5 h-8 shrink-0 transition-transform group-hover:scale-y-110"
                          style={{ backgroundColor: deck.accentColor }}
                        />
                        <IconComp className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-colors" />
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-xl font-light text-[var(--text-main)] tracking-tight">
                          {formatSecs(session.durationSeconds)}
                        </div>
                        <div className="font-mono text-[9px] text-[var(--text-muted)] uppercase tracking-[0.2em]">
                          Duration
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="font-sans text-xl font-medium text-[var(--text-main)] mb-1">
                        {session.deckName}
                      </div>
                      <div className="font-sans text-xs text-[var(--text-muted)] font-light">
                        {dateStr} • {timeStr}
                      </div>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[9px] font-mono uppercase tracking-[0.2em] text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-colors border-t border-[var(--surface-border)] pt-4">
                      <span>View Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Session Details Modal */}
      <AnimatePresence>
        {selectedSession && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-[var(--bg-main)]/95">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[var(--bg-main)] border border-[var(--surface-border)] p-10 w-full max-w-lg space-y-10 shadow-2xl relative text-[var(--text-main)]"
            >
              <button
                onClick={() => setSelectedSession(null)}
                className="absolute top-6 right-6 text-[var(--text-muted)] hover:text-[var(--text-main)] p-2 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="space-y-2 border-b border-[var(--surface-border)] pb-8">
                <span className="font-mono text-[10px] tracking-[0.2em] text-[var(--text-muted)] uppercase">
                  SESSION DETAILS
                </span>
                <h3
                  className="text-4xl font-light text-[var(--text-main)] tracking-[-0.02em]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {selectedSession.deckName}
                </h3>
              </div>

              <div className="space-y-4">
                <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-[0.2em]">
                  PROMPT
                </span>
                <p className="font-sans text-xl text-[var(--text-main)] font-light italic leading-relaxed border-l-2 border-[var(--text-muted)] pl-6">
                  "{selectedSession.promptText}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8 text-[10px] font-mono tracking-[0.2em] uppercase pt-8 border-t border-[var(--surface-border)]">
                <div className="flex flex-col gap-3">
                  <span className="text-[var(--text-muted)]">Duration</span>
                  <div className="flex items-center gap-3 text-lg text-[var(--text-main)] font-light">
                    <Clock className="w-4 h-4 text-[var(--text-muted)]" />
                    <span>{formatSecs(selectedSession.durationSeconds)} min</span>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <span className="text-[var(--text-muted)]">Date</span>
                  <div className="flex items-center gap-3 text-lg text-[var(--text-main)] font-light">
                    <Calendar className="w-4 h-4 text-[var(--text-muted)]" />
                    <span>
                      {new Date(selectedSession.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {selectedSession.audioUrl && (
                <div className="space-y-4 pt-8 border-t border-[var(--surface-border)]">
                  <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-[0.2em]">
                    LOCAL RECORDING
                  </span>
                  <div className="p-4 bg-[var(--surface-bg)] border border-[var(--surface-border)]">
                    <audio
                      controls
                      src={selectedSession.audioUrl}
                      className="w-full"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

