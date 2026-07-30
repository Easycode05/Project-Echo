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
import { motion, AnimatePresence } from 'motion/react';

interface HistoryViewProps {
  progress: UserProgress;
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

export const HistoryView: React.FC<HistoryViewProps> = ({ progress }) => {
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

  // Build heatmap intensity levels (21 blocks representing 3 weeks)
  const heatmapData = Array.from({ length: 21 }).map((_, idx) => {
    if (idx === 8 || idx === 20) return 'bg-[var(--text-main)] opacity-90 shadow-sm';
    if (idx === 4 || idx === 11 || idx === 17) return 'bg-[var(--text-main)] opacity-50';
    if (idx === 2 || idx === 7 || idx === 18) return 'bg-[var(--text-main)] opacity-30';
    if (idx === 5 || idx === 12 || idx === 19) return 'bg-[var(--text-main)] opacity-15';
    return 'bg-[var(--surface-bg)] border border-[var(--surface-border)]';
  });

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center pt-20 pb-32 px-6 overflow-y-auto bg-[var(--bg-main)] text-[var(--text-main)] no-scrollbar transition-colors duration-300">
      <main className="relative z-10 w-full max-w-[600px] mx-auto flex flex-col space-y-8">
        {/* Consistency Section */}
        <section className="space-y-3 pt-4">
          <h2 className="font-mono text-xs tracking-[0.2em] text-[var(--text-muted)] uppercase font-semibold">
            Practice Consistency
          </h2>

          <div className="bg-[var(--surface-bg)] backdrop-blur-2xl border border-[var(--surface-border)] p-5 rounded-2xl">
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-7 gap-2.5">
                {heatmapData.map((bgClass, idx) => (
                  <div
                    key={idx}
                    className={`aspect-square rounded-md transition-all duration-300 hover:scale-110 cursor-pointer ${bgClass}`}
                    title={`Day ${idx + 1}`}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-1 font-mono text-[10px] text-[var(--text-muted)] uppercase">
                <span>3 weeks ago</span>
                <span>Today</span>
              </div>
            </div>
          </div>
        </section>

        {/* Past Sessions List */}
        <section className="space-y-4">
          <h2 className="font-mono text-xs tracking-[0.2em] text-[var(--text-muted)] uppercase font-semibold">
            Past Sessions
          </h2>

          {sessions.length === 0 ? (
            <div className="text-center py-12 bg-[var(--surface-bg)] border border-[var(--surface-border)] rounded-2xl text-[var(--text-muted)] text-sm font-light">
              No recorded speaking practice sessions yet.
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map((session) => {
                const deck = getDeckInfo(session.deckId);
                const IconComp = ICON_MAP[deck.iconName] || Sparkles;
                const sessionDate = new Date(session.date);
                const timeStr = sessionDate.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <motion.div
                    key={session.id}
                    onClick={() => setSelectedSession(session)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-[var(--surface-bg)] backdrop-blur-2xl border border-[var(--surface-border)] hover:border-[var(--surface-border-hover)] p-4 rounded-2xl flex items-center gap-4 cursor-pointer transition-all group"
                  >
                    {/* Room Icon */}
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 shadow-sm text-white"
                      style={{ backgroundColor: deck.accentColor }}
                    >
                      <IconComp className="w-5 h-5 text-white" />
                    </div>

                    {/* Room & Time Info */}
                    <div className="flex-grow min-w-0">
                      <div className="font-sans text-base font-medium text-[var(--text-main)] truncate">
                        {session.deckName}
                      </div>
                      <div className="font-sans text-xs text-[var(--text-muted)]">
                        {timeStr}
                      </div>
                    </div>

                    {/* Duration readout */}
                    <div className="text-right shrink-0">
                      <div className="font-mono text-xs font-semibold text-[var(--text-main)]">
                        {formatSecs(session.durationSeconds)}
                      </div>
                      <div className="font-mono text-[9px] text-[var(--text-muted)] uppercase">
                        MIN
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-colors shrink-0" />
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
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[var(--modal-bg)] border border-[var(--surface-border)] p-6 rounded-3xl w-full max-w-md space-y-6 shadow-2xl relative text-[var(--text-main)]"
            >
              <button
                onClick={() => setSelectedSession(null)}
                className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-main)] p-1 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <span className="font-mono text-[10px] tracking-[0.25em] text-[var(--text-muted)] uppercase font-semibold">
                  SESSION DETAILS
                </span>
                <h3 className="font-sans text-2xl font-light text-[var(--text-main)]">
                  {selectedSession.deckName}
                </h3>
              </div>

              <div className="bg-[var(--surface-bg)] p-4 rounded-xl border border-[var(--surface-border)] space-y-2">
                <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase font-medium">
                  PROMPT
                </span>
                <p className="font-sans text-sm text-[var(--text-main)] font-light italic leading-relaxed">
                  &quot;{selectedSession.promptText}&quot;
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="bg-[var(--surface-bg)] p-3 rounded-xl border border-[var(--surface-border)] flex items-center gap-2 text-[var(--text-main)]">
                  <Clock className="w-4 h-4 text-emerald-500" />
                  <span>{formatSecs(selectedSession.durationSeconds)} min</span>
                </div>
                <div className="bg-[var(--surface-bg)] p-3 rounded-xl border border-[var(--surface-border)] flex items-center gap-2 text-[var(--text-main)]">
                  <Calendar className="w-4 h-4 text-emerald-500" />
                  <span>
                    {new Date(selectedSession.date).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {selectedSession.audioUrl && (
                <div className="space-y-2 pt-2">
                  <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase font-medium">
                    LOCAL RECORDING
                  </span>
                  <audio
                    controls
                    src={selectedSession.audioUrl}
                    className="w-full rounded-lg"
                  />
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
