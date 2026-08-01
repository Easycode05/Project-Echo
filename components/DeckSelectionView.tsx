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
  Trash2,
} from 'lucide-react';
import { Tooth } from './ToothIcon';
import { Deck, DeckId } from '../lib/types';
import { saveCustomDeck, deleteCustomDeck } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { useSoundSystem } from '../hooks/use-sound-system';

interface DeckSelectionViewProps {
  decks: Deck[];
  currentDeckId: DeckId | string;
  onSelectDeck: (deck: Deck) => void;
  onProceedToPrompt: (deck: Deck) => void;
  soundEnabled?: boolean;
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
  Tooth,
  Stethoscope: Tooth, // Alias for users who haven't updated their backend yet
};

export const DeckSelectionView: React.FC<DeckSelectionViewProps> = ({
  decks,
  currentDeckId,
  onSelectDeck,
  onProceedToPrompt,
  soundEnabled = true,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'carousel'>('grid');
  const [activeHoverId, setActiveHoverId] = useState<DeckId | string>(currentDeckId);
  const [searchQuery, setSearchQuery] = useState('');
  const [carouselIndex, setCarouselIndex] = useState(() => {
    const idx = decks.findIndex((d) => d.id === currentDeckId);
    return idx >= 0 ? idx : 0;
  });

  const sounds = useSoundSystem(soundEnabled);

  const filteredDecks = decks.filter(
    (deck) =>
      deck.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deck.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deck.roomSubtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeDeck = decks.find((d) => d.id === activeHoverId) || decks[0];

  const handlePrevCarousel = () => {
    sounds.playTap();
    setCarouselIndex((prev) => (prev > 0 ? prev - 1 : decks.length - 1));
  };

  const handleNextCarousel = () => {
    sounds.playTap();
    setCarouselIndex((prev) => (prev < decks.length - 1 ? prev + 1 : 0));
  };

  const handleCreateDeck = () => {
    sounds.playTap();
    const name = window.prompt("Enter a name for your Custom Deck (e.g., 'Job Interview'):");
    if (!name || name.trim() === '') return;
    
    const promptsStr = window.prompt("Enter your prompts, separated by commas (e.g., 'Tell me about yourself, Why do you want this job?'):");
    if (!promptsStr || promptsStr.trim() === '') return;
    
    saveCustomDeck(name, promptsStr);
    window.location.reload(); 
  };

  const handleDeleteDeck = (e: React.MouseEvent, deckId: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this custom deck?')) {
      deleteCustomDeck(deckId);
      window.location.reload();
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col pt-[calc(env(safe-area-inset-top)+128px)] pb-[calc(env(safe-area-inset-bottom)+128px)] px-6 md:px-8 overflow-x-hidden overflow-y-auto bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-500">
      
      {/* Ambient Background Glow (Dynamic based on active deck) */}
      <div
        className="absolute inset-0 z-0 pointer-events-none transition-all duration-1000 opacity-20"
        style={{
          background: `radial-gradient(circle at 80% 20%, ${activeDeck.accentColor}10 0%, transparent 60%)`,
        }}
      />

      {/* Page Header */}
      <div className="mb-16 z-10 w-full flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
        <div className="max-w-4xl space-y-4">
          <span className="font-mono text-[10px] tracking-[0.2em] text-[var(--text-muted)] uppercase">
            Speaking Decks &middot; {decks.length} Available
          </span>
          <h1
            className="text-5xl sm:text-6xl md:text-7xl font-light text-[var(--text-main)] tracking-[-0.02em] leading-none"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Explore<br />Environments
          </h1>
          <p className="text-lg text-[var(--text-muted)] leading-relaxed max-w-xl font-light mt-4">
            Choose from {decks.length} topic decks designed to develop key communication and public speaking skills. Each deck offers a unique atmosphere.
          </p>
        </div>
        
        <button
          onClick={handleCreateDeck}
          className="shrink-0 font-mono text-[10px] tracking-[0.2em] uppercase px-6 py-3 border border-[var(--surface-border)] bg-[var(--surface-bg)] text-[var(--text-main)] hover:bg-[var(--text-main)] hover:text-[var(--bg-main)] transition-colors rounded-none"
        >
          + Create Personal Deck
        </button>
      </div>

      {/* Control Bar: Search & View Toggle */}
      <div className="w-full z-10 flex flex-col sm:flex-row items-end justify-between gap-6 mb-12 border-b border-[var(--surface-border)] pb-6">
        
        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search decks..."
            className="w-full pl-8 pr-4 py-2 bg-transparent border-none text-sm text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-0 font-sans transition-colors"
          />
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-6 text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">
          <button
            onClick={() => {
              sounds.playToggleOff();
              setViewMode('grid');
            }}
            className={`transition-colors pb-1 border-b ${
              viewMode === 'grid'
                ? 'text-[var(--text-main)] border-[var(--text-main)]'
                : 'border-transparent hover:text-[var(--text-main)]'
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => {
              sounds.playToggleOn();
              setViewMode('carousel');
            }}
            className={`transition-colors pb-1 border-b ${
              viewMode === 'carousel'
                ? 'text-[var(--text-main)] border-[var(--text-main)]'
                : 'border-transparent hover:text-[var(--text-main)]'
            }`}
          >
            Carousel
          </button>
        </div>
      </div>

      {/* GRID VIEW */}
      {viewMode === 'grid' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="w-full z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16"
        >
          {filteredDecks.map((deck) => {
            const IconComponent = ICON_MAP[deck.iconName] || Sparkles;
            const isSelected = deck.id === currentDeckId;

            return (
              <motion.div
                key={deck.id}
                onMouseEnter={() => setActiveHoverId(deck.id)}
                onClick={() => {
                  sounds.playTap();
                  onSelectDeck(deck);
                  onProceedToPrompt(deck);
                }}
                className={`flex flex-col text-left cursor-pointer transition-all duration-300 group ${
                  isSelected ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-1.5 h-12 shrink-0 transition-transform group-hover:scale-y-110"
                    style={{ backgroundColor: deck.accentColor }}
                  />
                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <IconComponent className="w-5 h-5 mb-1" style={{ color: isSelected ? deck.accentColor : 'var(--text-muted)' }} />
                      {isSelected && (
                        <span className="font-mono text-[9px] tracking-widest uppercase text-[var(--text-main)]">
                          Selected
                        </span>
                      )}
                    </div>
                    <h3 className="font-sans text-xl font-medium text-[var(--text-main)] tracking-tight flex items-center justify-between">
                      <span>{deck.name}</span>
                      {deck.id.startsWith('custom_') && (
                        <button
                          onClick={(e) => handleDeleteDeck(e, deck.id)}
                          className="text-[var(--text-muted)] hover:text-red-500 transition-colors p-1"
                          title="Delete Custom Deck"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </h3>
                  </div>
                </div>

                <p className="font-sans text-sm text-[var(--text-muted)] leading-relaxed mb-6 flex-grow font-light">
                  {deck.description}
                </p>

                <div className="mt-auto flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-colors">
                  <span className="uppercase tracking-widest font-medium">
                    Select
                  </span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* CAROUSEL VIEW */}
      {viewMode === 'carousel' && (
        <div className="w-full z-10 flex flex-col items-center justify-center flex-grow mt-8">
          <div className="relative w-full max-w-3xl flex items-center justify-center">
            
            {/* Left Prev Button */}
            <button
              onClick={handlePrevCarousel}
              className="absolute left-0 z-20 p-2 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
              title="Previous Deck"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            {/* Carousel Active Deck */}
            <AnimatePresence mode="wait">
              {(() => {
                const deck = decks[carouselIndex];
                if (!deck) return null;
                const IconComponent = ICON_MAP[deck.iconName] || Sparkles;
                const isSelected = deck.id === currentDeckId;

                return (
                  <motion.div
                    key={deck.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full px-8 sm:px-16 flex flex-col items-center text-center space-y-8"
                  >
                    <div className="flex flex-col items-center gap-4">
                      <IconComponent className="w-8 h-8" style={{ color: deck.accentColor }} />
                      <span className="font-mono text-xs text-[var(--text-muted)] tracking-widest uppercase">
                        {String(carouselIndex + 1).padStart(2, '0')} / {String(decks.length).padStart(2, '0')}
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-center gap-4">
                        <h2
                          className="text-5xl sm:text-6xl font-medium text-[var(--text-main)] tracking-tight leading-none"
                          style={{ fontFamily: 'var(--font-display)' }}
                        >
                          {deck.name}
                        </h2>
                        {deck.id.startsWith('custom_') && (
                          <button
                            onClick={(e) => handleDeleteDeck(e, deck.id)}
                            className="text-[var(--text-muted)] hover:text-red-500 transition-colors p-2 rounded-full border border-transparent hover:border-red-500/30 bg-red-500/0 hover:bg-red-500/10"
                            title="Delete Custom Deck"
                          >
                            <Trash2 className="w-6 h-6" />
                          </button>
                        )}
                      </div>
                      <p className="font-sans text-lg text-[var(--text-muted)] leading-relaxed max-w-lg mx-auto font-light">
                        {deck.description}
                      </p>
                      <p className="font-serif text-sm text-[var(--text-main)] italic opacity-70">
                        {deck.roomSubtitle}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        sounds.playTap();
                        onSelectDeck(deck);
                        onProceedToPrompt(deck);
                      }}
                      className="mt-8 px-10 py-5 bg-[var(--text-main)] text-[var(--bg-main)] font-mono text-xs tracking-[0.2em] font-medium uppercase transition-all flex items-center justify-center gap-3 hover:bg-[var(--accent-warm)]"
                    >
                      <span>{isSelected ? 'Start Practice' : 'Select Deck'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                );
              })()}
            </AnimatePresence>

            {/* Right Next Button */}
            <button
              onClick={handleNextCarousel}
              className="absolute right-0 z-20 p-2 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
              title="Next Deck"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

