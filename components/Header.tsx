'use client';

import React from 'react';
import { Mic, ArrowLeft, X, Settings } from 'lucide-react';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showClose?: boolean;
  showMicStatus?: boolean;
  onBack?: () => void;
  onClose?: () => void;
  onOpenSettings?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'ECHO',
  showBack = false,
  showClose = false,
  showMicStatus = true,
  onBack,
  onClose,
  onOpenSettings,
}) => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-transparent backdrop-blur-md transition-all duration-300">
      <div className="flex items-center gap-3">
        {showBack ? (
          <button
            onClick={onBack}
            className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors active:scale-95 p-1.5 rounded-full focus:outline-none"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        ) : showMicStatus ? (
          <button
            onClick={onOpenSettings}
            className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors active:scale-95 p-1.5 rounded-full focus:outline-none"
            aria-label="Microphone settings"
          >
            <Mic className="w-5 h-5" />
          </button>
        ) : (
          <div className="w-6" />
        )}
      </div>

      <h1 className="font-mono text-[11px] tracking-[0.3em] text-[var(--text-muted)] uppercase select-none font-semibold">
        {title}
      </h1>

      <div className="flex items-center gap-3">
        {showClose ? (
          <button
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors active:scale-95 p-1.5 rounded-full focus:outline-none"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={onOpenSettings}
            className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors active:scale-95 p-1.5 rounded-full focus:outline-none"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        )}
      </div>
    </header>
  );
};
