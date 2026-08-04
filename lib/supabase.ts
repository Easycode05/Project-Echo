import { createClient } from '@supabase/supabase-js';
import { DECKS, PROMPTS } from './data';
import { Deck, Prompt } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a singleton Supabase client if credentials exist
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

function getLocalCustomDecks(): Deck[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem('echo_custom_decks') || '[]'); } catch(e) { return []; }
}

function getLocalCustomPrompts(): Prompt[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem('echo_custom_prompts') || '[]'); } catch(e) { return []; }
}

/**
 * Service to fetch Decks. Falls back to local data if Supabase is not configured.
 */
export async function getDecks(): Promise<Deck[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from('decks')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching decks:', error);
      return [...getLocalCustomDecks(), ...DECKS]; // Fallback with custom decks
    }
    
    if (data && data.length > 0) {
      // Map DB snake_case to app camelCase
      const appDecks = data.map(d => ({
        id: d.id,
        name: d.name,
        description: d.description,
        roomSubtitle: d.theme,
        environmentMood: d.theme,
        accentColor: d.accent_color,
        glowClass: '', // Legacy, handled by inline styles now
        cardBgClass: '',
        iconBgClass: '',
        iconName: d.icon,
      })) as Deck[];
      return [...getLocalCustomDecks(), ...appDecks];
    }
  }
  
  return [...getLocalCustomDecks(), ...DECKS];
}

/**
 * Service to fetch Prompts for a given deck. Falls back to local data.
 */
export async function getPrompts(deckId: string): Promise<Prompt[]> {
  if (supabase) {
    let query = supabase
      .from('prompts')
      .select('*')
      .eq('active', true);
      
    if (deckId !== 'surprise') {
      query = query.eq('deck_id', deckId);
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching prompts:', error);
      const customFallback = getLocalCustomPrompts().filter(p => deckId === 'surprise' || p.deckId === deckId);
      return deckId === 'surprise' 
        ? [...customFallback, ...PROMPTS] 
        : [...customFallback, ...PROMPTS.filter(p => p.deckId === deckId)];
    }

    if (data && data.length > 0) {
      const appPrompts = data.map(p => ({
        id: p.id,
        deckId: p.deck_id,
        text: p.prompt,
        difficulty: p.difficulty,
      })) as Prompt[];
      
      const custom = getLocalCustomPrompts().filter(p => deckId === 'surprise' || p.deckId === deckId);
      return [...custom, ...appPrompts];
    }
  }

  // Fallback
  const customFallback = getLocalCustomPrompts().filter(p => deckId === 'surprise' || p.deckId === deckId);
  if (deckId === 'surprise') {
    return [...customFallback, ...PROMPTS];
  }
  return [...customFallback, ...PROMPTS.filter(p => p.deckId === deckId)];
}

/**
 * Helper to securely log analytics without identifying users.
 */
export async function trackEvent(eventName: string, metadata: Record<string, any> = {}) {
  // Always log to console in dev
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics] ${eventName}`, metadata);
  }

  if (supabase) {
    try {
      await supabase.from('analytics_events').insert({
        event_name: eventName,
        metadata,
        platform: navigator.userAgent,
        app_version: '1.0.0', // This could be dynamic
      });
    } catch (err) {
      console.error('Analytics tracking failed:', err);
    }
  }
}

/**
 * Helper to record session completion to backend
 */
export async function recordSessionBackend(
  deckId: string, 
  duration: number, 
  completed: boolean, 
  continuedAfterTimer: boolean
) {
  if (supabase) {
    try {
      await supabase.from('sessions').insert({
        deck_id: deckId,
        duration,
        completed,
        continued_after_timer: continuedAfterTimer,
      });
    } catch (e) {
      console.error('Failed to log event', e);
    }
  }
}

/**
 * Helper to save custom decks to local storage
 */
export function saveCustomDeck(name: string, promptsText: string) {
  if (typeof window === 'undefined') return;
  
  const deckId = 'custom_' + Date.now();
  const newDeck: Deck = {
    id: deckId as any,
    name,
    description: 'Personal custom deck.',
    roomSubtitle: 'Your personal custom prompts.',
    environmentMood: 'A quiet, personal space for reflection.',
    accentColor: '#9333EA', 
    glowClass: '', 
    cardBgClass: '',
    iconBgClass: '',
    iconName: 'Sparkles',
  };

  const newPrompts: Prompt[] = promptsText
    .split(',')
    .map(p => p.trim())
    .filter(p => p.length > 0)
    .map(p => ({
      id: 'prompt_' + Date.now() + Math.random(),
      deckId: deckId as any,
      text: p,
      difficulty: 'reflective'
    }));

  if (newPrompts.length === 0) return;

  const currentDecks = getLocalCustomDecks();
  localStorage.setItem('echo_custom_decks', JSON.stringify([...currentDecks, newDeck]));
  
  const currentPrompts = getLocalCustomPrompts();
  localStorage.setItem('echo_custom_prompts', JSON.stringify([...currentPrompts, ...newPrompts]));
}

/**
 * Helper to delete a custom deck from local storage
 */
export function deleteCustomDeck(deckId: string) {
  if (typeof window === 'undefined') return;
  
  const currentDecks = getLocalCustomDecks();
  const updatedDecks = currentDecks.filter(d => d.id !== deckId);
  localStorage.setItem('echo_custom_decks', JSON.stringify(updatedDecks));
  
  const currentPrompts = getLocalCustomPrompts();
  const updatedPrompts = currentPrompts.filter(p => p.deckId !== deckId);
  localStorage.setItem('echo_custom_prompts', JSON.stringify(updatedPrompts));
}
