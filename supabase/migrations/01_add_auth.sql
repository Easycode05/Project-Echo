-- Auth Integration Migration

-- 1. Create Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Custom Decks Table
CREATE TABLE IF NOT EXISTS public.custom_decks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    theme TEXT DEFAULT 'default',
    accent_color TEXT DEFAULT '#ffffff',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Custom Prompts Table
CREATE TABLE IF NOT EXISTS public.custom_prompts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deck_id UUID NOT NULL REFERENCES public.custom_decks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    prompt TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure Sessions table exists first
CREATE TABLE IF NOT EXISTS public.sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prompt_id UUID,
    deck_id TEXT,
    duration INTEGER NOT NULL,
    completed BOOLEAN NOT NULL,
    continued_after_timer BOOLEAN NOT NULL,
    device_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Update Sessions to link to user_id
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_prompts ENABLE ROW LEVEL SECURITY;

-- Profile Policies
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Custom Decks Policies
CREATE POLICY "Users can read own custom decks" ON public.custom_decks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own custom decks" ON public.custom_decks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own custom decks" ON public.custom_decks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own custom decks" ON public.custom_decks FOR DELETE USING (auth.uid() = user_id);

-- Custom Prompts Policies
CREATE POLICY "Users can read own custom prompts" ON public.custom_prompts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own custom prompts" ON public.custom_prompts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own custom prompts" ON public.custom_prompts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own custom prompts" ON public.custom_prompts FOR DELETE USING (auth.uid() = user_id);

-- Session Policies update (Allow reading own sessions)
CREATE POLICY "Users can read own sessions" ON public.sessions FOR SELECT USING (auth.uid() = user_id);

-- Ensure updated_at function exists
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_custom_decks_updated_at BEFORE UPDATE ON public.custom_decks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_custom_prompts_updated_at BEFORE UPDATE ON public.custom_prompts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
