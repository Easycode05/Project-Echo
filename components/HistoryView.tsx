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
  Flame,
  Mic,
  Award,
  Quote,
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
  const [currentPage, setCurrentPage] = useState(1);

  // Group past sessions by relative day
  const sessions = progress.history || [];
  const itemsPerPage = 5;
  const totalPages = Math.ceil(sessions.length / itemsPerPage);
  const currentSessions = sessions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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

  // Motivational Quotes
  const quotes = [
    "There is no such thing as public speaking. There is only private speaking in a public place.",
    "Speech is power: speech is to persuade, to convert, to compel.",
    "They may forget what you said, but they will never forget how you made them feel.",
    "Courage is what it takes to stand up and speak; courage is also what it takes to sit down and listen.",
    "The right word may be effective, but no word was ever as effective as a rightly timed pause."
  ];
  const dailyQuote = quotes[new Date().getDay() % quotes.length];

  // Speaker Level Logic
  const getSpeakerLevel = (minutes: number) => {
    if (minutes < 15) return { level: 1, title: 'Novice Orator', next: 15 };
    if (minutes < 60) return { level: 2, title: 'Beginner Speaker', next: 60 };
    if (minutes < 180) return { level: 3, title: 'Confident Speaker', next: 180 };
    if (minutes < 400) return { level: 4, title: 'Articulate Presenter', next: 400 };
    if (minutes < 1000) return { level: 5, title: 'Master Orator', next: 1000 };
    return { level: 6, title: 'Echo Legend', next: null };
  };
  const currentLevel = getSpeakerLevel(progress.totalMinutes);

  // Topics Distribution
  const topicsDist: Record<string, number> = {};
  sessions.forEach(s => {
    topicsDist[s.deckId] = (topicsDist[s.deckId] || 0) + 1;
  });
  const topTopics = Object.entries(topicsDist)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

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
              {user ? `Welcome, ${user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0]}` : 'Your History'}
            </h1>
            <div className="flex items-center gap-3 text-[var(--text-muted)] font-mono text-[10px] uppercase tracking-[0.2em] pt-2">
              <Award className="w-4 h-4 text-emerald-500" />
              <span>Level {currentLevel.level}: <span className="text-[var(--text-main)] font-semibold">{currentLevel.title}</span></span>
              {currentLevel.next && (
                <span className="opacity-60 ml-2">({Math.ceil(currentLevel.next - progress.totalMinutes)} mins to next level)</span>
              )}
            </div>
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

        {/* Daily Quote */}
        <div className="p-6 border-l-2 border-[var(--text-main)] bg-[var(--surface-bg)] flex gap-4 items-start">
          <Quote className="w-6 h-6 shrink-0 text-[var(--text-muted)] opacity-50" />
          <p className="font-serif text-lg md:text-xl font-light italic text-[var(--text-muted)]">
            "{dailyQuote}"
          </p>
        </div>

        {/* Quick Stats Dashboard */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-6 border border-[var(--surface-border)] bg-[var(--surface-bg)] flex flex-col gap-2 relative overflow-hidden group hover:border-[var(--text-main)] transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Clock className="w-12 h-12" />
            </div>
            <span className="font-mono text-[9px] tracking-[0.2em] text-[var(--text-muted)] uppercase">Time Spoken</span>
            <span className="text-3xl font-light tracking-tight">{Math.floor(progress.totalMinutes / 60)}h {progress.totalMinutes % 60}m</span>
          </div>
          
          <div className="p-6 border border-[var(--surface-border)] bg-[var(--surface-bg)] flex flex-col gap-2 relative overflow-hidden group hover:border-[var(--text-main)] transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-orange-500 group-hover:opacity-20 transition-opacity">
              <Flame className="w-12 h-12" />
            </div>
            <span className="font-mono text-[9px] tracking-[0.2em] text-[var(--text-muted)] uppercase">Current Streak</span>
            <span className="text-3xl font-light tracking-tight text-orange-500">{progress.currentStreak} {progress.currentStreak === 1 ? 'Day' : 'Days'}</span>
          </div>

          <div className="p-6 border border-[var(--surface-border)] bg-[var(--surface-bg)] flex flex-col gap-2 relative overflow-hidden group hover:border-[var(--text-main)] transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Mic className="w-12 h-12" />
            </div>
            <span className="font-mono text-[9px] tracking-[0.2em] text-[var(--text-muted)] uppercase">Total Sessions</span>
            <span className="text-3xl font-light tracking-tight">{progress.totalSessions}</span>
          </div>
          
          <div className="p-6 border border-[var(--surface-border)] bg-[var(--surface-bg)] flex flex-col gap-2 relative overflow-hidden group hover:border-[var(--text-main)] transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-purple-500 group-hover:opacity-20 transition-opacity">
              <Sparkles className="w-12 h-12" />
            </div>
            <span className="font-mono text-[9px] tracking-[0.2em] text-[var(--text-muted)] uppercase">Longest Streak</span>
            <span className="text-3xl font-light tracking-tight">{progress.longestStreak} {progress.longestStreak === 1 ? 'Day' : 'Days'}</span>
          </div>
        </section>

        {/* Topics Distribution Bar */}
        {topTopics.length > 0 && (
          <section className="space-y-4">
            <h2 className="font-mono text-[10px] tracking-[0.2em] text-[var(--text-muted)] uppercase font-semibold">
              Top Topics
            </h2>
            <div className="h-4 w-full flex overflow-hidden rounded-full bg-[var(--surface-border)]">
              {topTopics.map(([deckId, count], idx) => {
                const deck = getDeckInfo(deckId);
                const percent = (count / sessions.length) * 100;
                return (
                  <div
                    key={deckId}
                    style={{ width: `${percent}%`, backgroundColor: deck.accentColor }}
                    className="h-full transition-all duration-1000"
                    title={`${deck.name}: ${Math.round(percent)}%`}
                  />
                );
              })}
            </div>
            <div className="flex flex-wrap gap-4 pt-2">
              {topTopics.map(([deckId, count]) => {
                const deck = getDeckInfo(deckId);
                const percent = Math.round((count / sessions.length) * 100);
                return (
                  <div key={deckId} className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)]">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: deck.accentColor }} />
                    <span>{deck.name} ({percent}%)</span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

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
            <div className="flex flex-col gap-6">
              {currentSessions.map((session) => {
                const deck = getDeckInfo(session.deckId);
                const IconComp = ICON_MAP[deck.iconName] || Sparkles;
                const sessionDate = new Date(session.date);
                const dateStr = sessionDate.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' });
                const timeStr = sessionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                return (
                  <motion.div
                    key={session.id}
                    onClick={() => setSelectedSession(session)}
                    className="relative overflow-hidden p-6 md:p-8 border border-[var(--surface-border)] bg-[var(--surface-bg)] hover:border-[var(--text-main)] cursor-pointer transition-all duration-500 group flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-2xl hover:-translate-y-1"
                    style={{
                      boxShadow: `0 10px 40px -10px ${deck.accentColor}00`
                    }}
                    whileHover={{
                      boxShadow: `0 10px 40px -10px ${deck.accentColor}25`
                    }}
                  >
                    {/* Glowing Accent Border */}
                    <div 
                      className="absolute left-0 top-0 bottom-0 w-1 transition-all duration-500 opacity-50 group-hover:opacity-100 group-hover:w-2"
                      style={{ backgroundColor: deck.accentColor }}
                    />
                    
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-[0.02] group-hover:opacity-[0.05] pointer-events-none transition-opacity"
                         style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }}
                    />

                    <div className="flex flex-col flex-grow z-10 w-full md:w-auto">
                      <div className="flex items-center gap-3 mb-3">
                        <IconComp className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-colors" />
                        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
                          {dateStr} • {timeStr}
                        </span>
                      </div>
                      
                      <div className="font-sans text-2xl md:text-3xl font-medium text-[var(--text-main)] tracking-tight mb-2">
                        {deck.name}
                      </div>
                      
                      <p className="font-serif text-sm md:text-base text-[var(--text-muted)] italic font-light line-clamp-2 max-w-xl">
                        "{session.promptText}"
                      </p>
                    </div>

                    <div className="flex md:flex-col items-center justify-between w-full md:w-auto md:items-end gap-4 md:gap-2 z-10 border-t md:border-t-0 border-[var(--surface-border)] pt-4 md:pt-0">
                      <div className="text-left md:text-right">
                        <div className="font-mono text-2xl md:text-3xl font-light text-[var(--text-main)] tracking-tight">
                          {formatSecs(session.durationSeconds)}
                        </div>
                        <div className="font-mono text-[9px] text-[var(--text-muted)] uppercase tracking-[0.2em]">
                          Duration
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-[9px] font-mono uppercase tracking-[0.2em] text-[var(--text-main)] bg-[var(--text-main)]/10 px-4 py-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                        <span>Details</span>
                        <ChevronRight className="w-3 h-3" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-8 pt-8 border-t border-[var(--surface-border)]">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-[var(--surface-border)] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--surface-bg)] transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 rotate-180" />
                  </button>
                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-8 h-8 font-mono text-xs flex items-center justify-center transition-colors ${
                          currentPage === i + 1 
                            ? 'bg-[var(--text-main)] text-[var(--bg-main)]' 
                            : 'border border-[var(--surface-border)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--text-main)]'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-[var(--surface-border)] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--surface-bg)] transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
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

