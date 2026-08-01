'use client';

import React from 'react';
import { LayoutDashboard, Mic, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSoundSystem } from '../hooks/use-sound-system';

export type TabType = 'home' | 'decks' | 'history';

export interface BottomNavProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  soundEnabled?: boolean;
}

const TABS: { id: TabType; icon: React.ElementType; label: string }[] = [
  { id: 'home', icon: LayoutDashboard, label: 'Home' },
  { id: 'decks', icon: Mic, label: 'Practice' },
  { id: 'history', icon: BarChart3, label: 'History' },
];

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab, soundEnabled = true }) => {
  const sounds = useSoundSystem(soundEnabled);

  return (
    <div className="fixed bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-50 pointer-events-none w-full px-4 flex justify-center pb-[env(safe-area-inset-bottom)]">
      <nav
        className="pointer-events-auto flex items-center gap-1 p-1.5 bg-[var(--bg-main)]/60 backdrop-blur-2xl border border-[var(--surface-border)] rounded-full shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)]"
        aria-label="Main navigation"
      >
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`nav-${tab.id}`}
              onClick={() => {
                if (!isActive) sounds.playTap();
                onSelectTab(tab.id);
              }}
              className={`relative flex items-center gap-2.5 px-5 py-2.5 rounded-full transition-all duration-500 focus:outline-none group ${
                isActive ? 'text-[var(--bg-main)]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-[var(--text-main)] rounded-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <Icon className="relative z-10 w-4 h-4" />
              <span
                className="relative z-10 font-mono text-[10px] uppercase tracking-widest font-medium"
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
