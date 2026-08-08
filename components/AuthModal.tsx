'use client';

import React, { useState } from 'react';
import { X, Mail, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useSoundSystem } from '../hooks/use-sound-system';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  soundEnabled?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  title = "Sign In to Echo",
  subtitle = "Save your custom decks, history, and practice statistics across all devices.",
  soundEnabled = true 
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sounds = useSoundSystem(soundEnabled);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    
    setLoading(true);
    setError(null);
    sounds.playTap();

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        
        if (data.user && !data.session) {
          setError("Account created! Please check your email to confirm your address.");
          return; // Stop here, do not close modal yet
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
      sounds.playCancel();
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    if (!supabase) return;
    sounds.playTap();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/` : undefined,
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Google authentication failed.');
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--bg-main)]/95 backdrop-blur-md px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md bg-[var(--surface-bg)] border border-[var(--surface-border)] p-8 relative shadow-2xl"
          >
            <button
              onClick={() => {
                sounds.playCancel();
                onClose();
              }}
              className="absolute top-4 right-4 p-2 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-8 space-y-2">
              <div className="w-12 h-12 rounded-full border border-[var(--surface-border)] flex items-center justify-center mb-6">
                <div className="w-4 h-4 rounded-full bg-[var(--text-main)] animate-pulse" />
              </div>
              <h2 className="text-2xl font-light tracking-tight text-[var(--text-main)] font-display">
                {title}
              </h2>
              <p className="text-sm text-[var(--text-muted)] font-light leading-relaxed">
                {subtitle}
              </p>
            </div>

            <div className="space-y-6">
              <button
                onClick={handleGoogleAuth}
                disabled={loading}
                className="w-full py-3 px-4 border border-[var(--surface-border)] hover:bg-[var(--text-main)] hover:text-[var(--bg-main)] transition-colors flex items-center justify-center gap-3 font-mono text-xs uppercase tracking-widest disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[var(--surface-border)]"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-[var(--surface-bg)] px-4 text-[var(--text-muted)] font-mono uppercase tracking-widest">Or email</span>
                </div>
              </div>

              <form onSubmit={handleEmailAuth} className="space-y-4">
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-b border-[var(--surface-border)] px-0 py-3 text-sm text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--text-main)] transition-colors"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-b border-[var(--surface-border)] px-0 py-3 text-sm text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--text-main)] transition-colors"
                  required
                />
                
                {error && (
                  <p className="text-rose-500 text-xs font-mono">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-[var(--text-main)] text-[var(--bg-main)] font-mono text-xs uppercase tracking-widest hover:bg-[var(--accent-warm)] transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      {isSignUp ? 'Create Account' : 'Sign In'} <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <p className="text-center text-xs text-[var(--text-muted)] font-mono">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-[var(--text-main)] hover:underline"
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
