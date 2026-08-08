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
    
    const cloudCustomDecks = await getCloudCustomDecks();
    
    if (error) {
      console.error('Error fetching decks:', error);
      return [...cloudCustomDecks, ...getLocalCustomDecks(), ...DECKS]; // Fallback with custom decks
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
      return [...cloudCustomDecks, ...getLocalCustomDecks(), ...appDecks];
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
      // If it's a custom cloud deck, fetch from there directly
      if (!deckId.startsWith('custom_')) {
        const cloudPrompts = await getCloudCustomPrompts(deckId);
        if (cloudPrompts.length > 0) {
          return cloudPrompts;
        }
      }
      query = query.eq('deck_id', deckId);
    }

    const { data, error } = await query;
    const cloudCustomPrompts = deckId === 'surprise' ? [] : await getCloudCustomPrompts(deckId);
    const customLocal = getLocalCustomPrompts().filter(p => deckId === 'surprise' || p.deckId === deckId);
    
    if (error) {
      console.error('Error fetching prompts:', error);
      return deckId === 'surprise' 
        ? [...customLocal, ...PROMPTS] 
        : [...cloudCustomPrompts, ...customLocal, ...PROMPTS.filter(p => p.deckId === deckId)];
    }

    if (data && data.length > 0) {
      const appPrompts = data.map(p => ({
        id: p.id,
        deckId: p.deck_id,
        text: p.prompt,
        difficulty: p.difficulty,
      })) as Prompt[];
      
      return [...cloudCustomPrompts, ...customLocal, ...appPrompts];
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
      const { data: { session } } = await supabase.auth.getSession();
      await supabase.from('sessions').insert({
        deck_id: deckId.startsWith('custom_') ? null : deckId, // Avoid foreign key errors for local custom decks
        duration,
        completed,
        continued_after_timer: continuedAfterTimer,
        user_id: session?.user?.id || null,
      });
    } catch (e) {
      console.error('Failed to log event', e);
    }
  }
}

/**
 * Helper to save custom decks. Saves to Supabase if logged in, otherwise local.
 */
export async function saveCustomDeck(name: string, promptsText: string) {
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

  let savedToCloud = false;

  if (supabase) {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      try {
        const { data: deckData, error: deckError } = await supabase
          .from('custom_decks')
          .insert({
            user_id: session.user.id,
            name: newDeck.name,
            description: newDeck.description,
            theme: newDeck.environmentMood,
            accent_color: newDeck.accentColor,
          })
          .select()
          .single();

        if (!deckError && deckData) {
          const cloudPrompts = newPrompts.map(p => ({
            deck_id: deckData.id,
            user_id: session.user.id,
            prompt: p.text,
          }));

          const { error: promptError } = await supabase
            .from('custom_prompts')
            .insert(cloudPrompts);
            
          if (!promptError) {
            savedToCloud = true;
          }
        }
      } catch (err) {
        console.error('Failed to save custom deck to cloud', err);
      }
    }
  }

  if (!savedToCloud && typeof window !== 'undefined') {
    const currentDecks = getLocalCustomDecks();
    localStorage.setItem('echo_custom_decks', JSON.stringify([...currentDecks, newDeck]));
    
    const currentPrompts = getLocalCustomPrompts();
    localStorage.setItem('echo_custom_prompts', JSON.stringify([...currentPrompts, ...newPrompts]));
  }
}

/**
 * Helper to delete a custom deck.
 */
export async function deleteCustomDeck(deckId: string) {
  if (supabase && !deckId.startsWith('custom_')) {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await supabase.from('custom_decks').delete().eq('id', deckId);
      return;
    }
  }

  if (typeof window === 'undefined') return;
  const currentDecks = getLocalCustomDecks();
  const updatedDecks = currentDecks.filter(d => d.id !== deckId);
  localStorage.setItem('echo_custom_decks', JSON.stringify(updatedDecks));
  
  const currentPrompts = getLocalCustomPrompts();
  const updatedPrompts = currentPrompts.filter(p => p.deckId !== deckId);
  localStorage.setItem('echo_custom_prompts', JSON.stringify(updatedPrompts));
}

/**
 * Fetch cloud custom decks
 */
export async function getCloudCustomDecks(): Promise<Deck[]> {
  if (!supabase) return [];
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return [];

  const { data, error } = await supabase
    .from('custom_decks')
    .select('*')
    .eq('user_id', session.user.id);

  if (error || !data) return [];

  return data.map(d => ({
    id: d.id,
    name: d.name,
    description: d.description || 'Personal custom deck.',
    roomSubtitle: d.theme || 'Your personal custom prompts.',
    environmentMood: d.theme || 'A quiet, personal space for reflection.',
    accentColor: d.accent_color || '#9333EA',
    glowClass: '',
    cardBgClass: '',
    iconBgClass: '',
    iconName: 'Sparkles',
  }));
}

/**
 * Fetch cloud custom prompts
 */
export async function getCloudCustomPrompts(deckId: string): Promise<Prompt[]> {
  if (!supabase) return [];
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return [];

  const { data, error } = await supabase
    .from('custom_prompts')
    .select('*')
    .eq('user_id', session.user.id)
    .eq('deck_id', deckId);

  if (error || !data) return [];

  return data.map(p => ({
    id: p.id,
    deckId: p.deck_id,
    text: p.prompt,
    difficulty: 'reflective'
  }));
}
