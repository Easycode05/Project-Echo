'use client';

import React, { useState, useEffect } from 'react';
import { Mic, ArrowLeft, X, Settings, LayoutDashboard, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSoundSystem } from '../hooks/use-sound-system';
import { EchoLogo } from './EchoLogo';

export type TabType = 'home' | 'decks' | 'history';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showClose?: boolean;
  showMicStatus?: boolean;
  onBack?: () => void;
  onClose?: () => void;
  onOpenSettings?: () => void;
  activeTab?: TabType;
  onSelectTab?: (tab: TabType) => void;
  soundEnabled?: boolean;
}

const TABS: { id: TabType; icon: React.ElementType; label: string }[] = [
  { id: 'home', icon: LayoutDashboard, label: 'Home' },
  { id: 'decks', icon: Mic, label: 'Practice' },
  { id: 'history', icon: BarChart3, label: 'History' },
];

export const Header: React.FC<HeaderProps> = ({
  title = 'ECHO',
  showBack = false,
  showClose = false,
  showMicStatus = true,
  onBack,
  onClose,
  onOpenSettings,
  activeTab,
  onSelectTab,
  soundEnabled = true,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const sounds = useSoundSystem(soundEnabled);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 md:px-8 transition-all duration-500 ${
        scrolled 
          ? 'py-4 pt-[calc(env(safe-area-inset-top)+16px)] bg-[var(--bg-main)]/70 backdrop-blur-[30px] backdrop-saturate-[150%] border-b border-[var(--surface-border)] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] pointer-events-auto' 
          : 'py-6 pt-[calc(env(safe-area-inset-top)+24px)] pointer-events-none'
      }`}
    >
      {/* Left side: Logo & Back Button */}
      <div className="flex items-center gap-6 min-w-[120px] pointer-events-auto">
        {showBack && (
          <button
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors -ml-2"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        
        {/* Wordmark Logo */}
        <div className="flex items-center gap-2.5 select-none cursor-default group">
          <EchoLogo className="w-5 h-5 text-[var(--text-main)] group-hover:scale-110 transition-transform duration-300" />
          <div className="flex items-center gap-1.5 pt-0.5">
            <span className="text-[var(--text-main)] tracking-[0.2em] text-xs font-mono uppercase font-semibold">
              {title}
            </span>
          </div>
        </div>
      </div>

      {/* Centre Navigation (Desktop/Tablet) or Title */}
      <div className="flex-1 flex justify-center pointer-events-auto">
        {onSelectTab && activeTab ? (
          <nav className="flex items-center gap-1 sm:gap-2 p-1 bg-[var(--surface-bg)]/50 backdrop-blur-md border border-[var(--surface-border)] rounded-full">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (!isActive) sounds.playTap();
                    onSelectTab(tab.id);
                  }}
                  className={`relative flex items-center gap-2 sm:gap-2 px-4 py-2.5 sm:px-4 sm:py-2 rounded-full transition-all duration-300 focus:outline-none group ${
                    isActive ? 'text-[var(--bg-main)]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                  aria-label={tab.label}
                >
                  <Icon className="w-5 h-5 sm:w-4 sm:h-4 z-10" />
                  <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest z-10 hidden sm:block">
                    {tab.label}
                  </span>

                  {/* Active Indicator Background */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabBg"
                      className="absolute inset-0 bg-[var(--text-main)] rounded-full shadow-sm"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>
        ) : (
          <div className="flex items-center gap-2 select-none">
            {/* Fallback wordmark if no nav */}
            {showBack && (
              <>
                <span className="text-[var(--text-main)] tracking-[0.2em] text-xs font-mono uppercase">
                  {title}
                </span>
                <span className="w-1.5 h-1.5 rounded-none" style={{ backgroundColor: 'var(--text-main)' }} />
              </>
            )}
          </div>
        )}
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center justify-end gap-1 sm:gap-2 min-w-[120px] pointer-events-auto">
        {showMicStatus && !showClose && (
          <button
            onClick={onOpenSettings}
            className="w-10 h-10 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
            aria-label="Microphone status"
          >
            <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        )}
        
        {showClose ? (
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={onOpenSettings}
            className="w-10 h-10 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        )}
      </div>
    </header>
  );
};
