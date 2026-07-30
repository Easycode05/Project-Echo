'use client';

import React from 'react';
import { LayoutDashboard, Mic, BarChart3 } from 'lucide-react';

export type TabType = 'home' | 'decks' | 'history';

interface BottomNavProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 pb-6 px-4 pointer-events-auto">
      <div className="bg-[var(--nav-bg)] backdrop-blur-2xl border border-[var(--surface-border)] rounded-full flex items-center gap-2 p-1.5 shadow-2xl transition-colors duration-300">
        <button
          onClick={() => onSelectTab('home')}
          className={`flex items-center justify-center p-3 w-12 h-12 rounded-full transition-all duration-300 active:scale-90 ${
            activeTab === 'home'
              ? 'bg-[var(--button-bg)] text-[var(--button-text)] shadow-md font-semibold'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--surface-bg)]'
          }`}
          title="Dashboard / Momentum"
          aria-label="Dashboard"
        >
          <LayoutDashboard className="w-5 h-5" />
        </button>

        <button
          onClick={() => onSelectTab('decks')}
          className={`flex items-center justify-center p-3 w-12 h-12 rounded-full transition-all duration-300 active:scale-90 ${
            activeTab === 'decks'
              ? 'bg-[var(--button-bg)] text-[var(--button-text)] shadow-md font-semibold'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--surface-bg)]'
          }`}
          title="Decks & Rooms"
          aria-label="Decks"
        >
          <Mic className="w-5 h-5" />
        </button>

        <button
          onClick={() => onSelectTab('history')}
          className={`flex items-center justify-center p-3 w-12 h-12 rounded-full transition-all duration-300 active:scale-90 ${
            activeTab === 'history'
              ? 'bg-[var(--button-bg)] text-[var(--button-text)] shadow-md font-semibold'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--surface-bg)]'
          }`}
          title="Analytics & Consistency"
          aria-label="Analytics"
        >
          <BarChart3 className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
};
