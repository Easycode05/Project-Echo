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
  ChevronLeft,
  LayoutGrid,
  SlidersHorizontal,
  Search,
} from 'lucide-react';
import { Deck, DeckId } from '../lib/types';
import { DECKS } from '../lib/data';
import { motion, AnimatePresence } from 'motion/react';

interface DeckSelectionViewProps {
  currentDeckId: DeckId;
  onSelectDeck: (deck: Deck) => void;
  onProceedToPrompt: (deck: Deck) => void;
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

export const DeckSelectionView: React.FC<DeckSelectionViewProps> = ({
  currentDeckId,
  onSelectDeck,
  onProceedToPrompt,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'carousel'>('grid');
  const [activeHoverId, setActiveHoverId] = useState<DeckId>(currentDeckId);
  const [searchQuery, setSearchQuery] = useState('');
  const [carouselIndex, setCarouselIndex] = useState(() => {
    const idx = DECKS.findIndex((d) => d.id === currentDeckId);
    return idx >= 0 ? idx : 0;
  });

  const filteredDecks = DECKS.filter(
    (deck) =>
      deck.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deck.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deck.roomSubtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeDeck = DECKS.find((d) => d.id === activeHoverId) || DECKS[0];

  const handlePrevCarousel = () => {
    setCarouselIndex((prev) => (prev > 0 ? prev - 1 : DECKS.length - 1));
  };

  const handleNextCarousel = () => {
    setCarouselIndex((prev) => (prev < DECKS.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center pt-24 pb-32 px-4 overflow-hidden bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300">
      {/* Ambient Background Glow (Dynamic based on active deck) */}
      <div
        className="absolute inset-0 z-0 pointer-events-none transition-all duration-1000 opacity-20"
        style={{
          background: `radial-gradient(circle at center, ${activeDeck.accentColor} 0%, transparent 75%)`,
        }}
      />

      {/* Page Header */}
      <div className="text-center mb-6 z-10 max-w-xl space-y-2">
        <span className="font-mono text-[11px] tracking-[0.25em] text-[var(--text-muted)] uppercase px-3 py-1 rounded-full bg-[var(--surface-bg)] border border-[var(--surface-border)]">
          Speaking Decks ({DECKS.length} Available)
        </span>
        <h1 className="font-sans text-3xl sm:text-4xl font-light text-[var(--text-main)] tracking-tight pt-1">
          Explore All Decks
        </h1>
        <p className="font-sans text-sm text-[var(--text-muted)] leading-relaxed max-w-md mx-auto font-light">
          Choose from 11 topic decks designed to develop key communication and public speaking skills.
        </p>
      </div>

      {/* Control Bar: Search & View Toggle */}
      <div className="w-full max-w-5xl z-10 flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search decks..."
            className="w-full pl-10 pr-4 py-2 rounded-full bg-[var(--surface-bg)] border border-[var(--surface-border)] text-xs text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--surface-border-hover)] font-sans transition-colors"
          />
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-full bg-[var(--surface-bg)] border border-[var(--surface-border)] text-xs font-mono">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
              viewMode === 'grid'
                ? 'bg-[var(--button-bg)] text-[var(--button-text)] font-medium shadow-md'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Grid View ({DECKS.length})</span>
          </button>
          <button
            onClick={() => setViewMode('carousel')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
              viewMode === 'carousel'
                ? 'bg-[var(--button-bg)] text-[var(--button-text)] font-medium shadow-md'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Carousel</span>
          </button>
        </div>
      </div>

      {/* GRID VIEW */}
      {viewMode === 'grid' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="w-full max-w-5xl z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {filteredDecks.map((deck) => {
            const IconComponent = ICON_MAP[deck.iconName] || Sparkles;
            const isSelected = deck.id === currentDeckId;

            return (
              <motion.div
                key={deck.id}
                onMouseEnter={() => setActiveHoverId(deck.id)}
                onClick={() => {
                  onSelectDeck(deck);
                  onProceedToPrompt(deck);
                }}
                whileHover={{ y: -4, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className={`rounded-2xl p-5 flex flex-col text-left cursor-pointer transition-all duration-300 border relative overflow-hidden group ${
                  isSelected
                    ? 'bg-[var(--surface-bg)] border-emerald-500/50 shadow-lg ring-1 ring-emerald-500/30'
                    : 'bg-[var(--surface-bg)] border-[var(--surface-border)] hover:border-[var(--surface-border-hover)]'
                }`}
              >
                {/* Subtle environmental room accent bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ backgroundColor: deck.accentColor }}
                />

                <div className="flex items-start justify-between mb-4 pt-1">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform text-white"
                    style={{ backgroundColor: deck.accentColor }}
                  >
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  {isSelected && (
                    <span className="font-mono text-[9px] text-emerald-500 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">
                      Selected
                    </span>
                  )}
                </div>

                <h3 className="font-sans text-lg font-medium text-[var(--text-main)] mb-1 transition-colors">
                  {deck.name}
                </h3>
                <p className="font-sans text-xs text-[var(--text-muted)] leading-relaxed mb-4 flex-grow line-clamp-2 font-light">
                  {deck.description}
                </p>

                <div className="mt-auto pt-3 border-t border-[var(--surface-border)] flex items-center justify-between text-xs font-mono text-[var(--text-muted)] group-hover:text-[var(--text-main)]">
                  <span className="uppercase text-[10px] tracking-wider font-medium">
                    Select Deck
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* CAROUSEL VIEW */}
      {viewMode === 'carousel' && (
        <div className="w-full max-w-4xl z-10 flex flex-col items-center">
          <div className="relative w-full flex items-center justify-center">
            {/* Left Prev Button */}
            <button
              onClick={handlePrevCarousel}
              className="absolute left-0 z-20 p-3 rounded-full bg-[var(--surface-bg)] border border-[var(--surface-border)] hover:border-[var(--surface-border-hover)] text-[var(--text-main)] backdrop-blur-md transition-all active:scale-90"
              title="Previous Deck"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Carousel Active Deck Card */}
            <AnimatePresence mode="wait">
              {(() => {
                const deck = DECKS[carouselIndex];
                if (!deck) return null;
                const IconComponent = ICON_MAP[deck.iconName] || Sparkles;
                const isSelected = deck.id === currentDeckId;

                return (
                  <motion.div
                    key={deck.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-md rounded-3xl p-8 flex flex-col items-center text-center bg-[var(--surface-bg)] border border-[var(--surface-border)] backdrop-blur-xl shadow-2xl my-4"
                  >
                    <div
                      className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6 shadow-xl text-white"
                      style={{ backgroundColor: deck.accentColor }}
                    >
                      <IconComponent className="w-10 h-10 text-white" />
                    </div>

                    <span className="font-mono text-xs text-[var(--text-muted)] tracking-widest uppercase mb-2">
                      Deck {carouselIndex + 1} of {DECKS.length}
                    </span>

                    <h2 className="font-sans text-2xl font-light text-[var(--text-main)] mb-2">
                      {deck.name}
                    </h2>
                    <p className="font-sans text-sm text-[var(--text-muted)] leading-relaxed mb-4 font-light">
                      {deck.description}
                    </p>
                    <p className="font-sans text-xs text-[var(--text-muted)] italic mb-8 max-w-xs">
                      {deck.roomSubtitle}
                    </p>

                    <button
                      onClick={() => {
                        onSelectDeck(deck);
                        onProceedToPrompt(deck);
                      }}
                      className="w-full py-4 rounded-full bg-[var(--button-bg)] text-[var(--button-text)] font-mono text-xs tracking-[0.2em] font-medium uppercase transition-all shadow-xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-95"
                    >
                      <span>{isSelected ? 'Start Practice with Deck' : 'Select Deck & Practice'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                );
              })()}
            </AnimatePresence>

            {/* Right Next Button */}
            <button
              onClick={handleNextCarousel}
              className="absolute right-0 z-20 p-3 rounded-full bg-[var(--surface-bg)] border border-[var(--surface-border)] hover:border-[var(--surface-border-hover)] text-[var(--text-main)] backdrop-blur-md transition-all active:scale-90"
              title="Next Deck"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Pagination Indicators */}
          <div className="flex items-center gap-2 mt-6">
            {DECKS.map((d, i) => (
              <button
                key={d.id}
                onClick={() => setCarouselIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  carouselIndex === i ? 'bg-[var(--text-main)] w-6' : 'bg-[var(--surface-border)]'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
