-- Supabase Schema for Project Echo
-- Relational database setup for Decks, Prompts, Sessions, and Analytics

-- Create Deck Table
CREATE TABLE public.decks (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    theme TEXT NOT NULL,
    accent_color TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Prompt Table
CREATE TABLE public.prompts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deck_id TEXT NOT NULL REFERENCES public.decks(id) ON DELETE CASCADE,
    prompt TEXT NOT NULL,
    difficulty TEXT CHECK (difficulty IN ('gentle', 'reflective', 'deep')),
    tags TEXT[] DEFAULT '{}'::TEXT[],
    active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Session Table (for user history, if users are authenticated later)
-- Note: Currently anonymous, so we might want to store a device_id or user_id later
CREATE TABLE public.sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prompt_id UUID REFERENCES public.prompts(id) ON DELETE SET NULL,
    deck_id TEXT REFERENCES public.decks(id) ON DELETE SET NULL,
    duration INTEGER NOT NULL,
    completed BOOLEAN NOT NULL,
    continued_after_timer BOOLEAN NOT NULL,
    device_id TEXT, -- For anonymous tracking
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create AnalyticsEvent Table
CREATE TABLE public.analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_name TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::JSONB,
    device_id TEXT, -- For anonymous tracking
    platform TEXT,
    app_version TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add updated_at trigger for prompts
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_prompts_updated_at
    BEFORE UPDATE ON public.prompts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) setup
ALTER TABLE public.decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Anonymous access policies
-- 1. Anyone can read active decks and prompts
CREATE POLICY "Allow public read access to decks" ON public.decks FOR SELECT USING (true);
CREATE POLICY "Allow public read access to active prompts" ON public.prompts FOR SELECT USING (active = true);

-- 2. Anyone can insert sessions and analytics (insert only, no read/update/delete)
CREATE POLICY "Allow anonymous session inserts" ON public.sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous analytics inserts" ON public.analytics_events FOR INSERT WITH CHECK (true);

-- Indexing for performance
CREATE INDEX idx_prompts_deck_id ON public.prompts(deck_id);
CREATE INDEX idx_prompts_active ON public.prompts(active);
CREATE INDEX idx_sessions_created_at ON public.sessions(created_at);
CREATE INDEX idx_analytics_event_name ON public.analytics_events(event_name);
