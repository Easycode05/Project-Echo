'use client';

import { useCallback } from 'react';

// Singleton AudioContext to prevent generating multiple contexts
let audioCtx: AudioContext | null = null;

const getContext = () => {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

// State for ambient noise
let ambientNode: AudioBufferSourceNode | null = null;
let ambientGain: GainNode | null = null;

const createBrownNoise = (ctx: AudioContext) => {
  const bufferSize = ctx.sampleRate * 5; // 5 seconds of noise
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = buffer.getChannelData(0);
  let lastOut = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    output[i] = (lastOut + (0.02 * white)) / 1.02;
    lastOut = output[i];
    output[i] *= 3.5; // Compensate for gain
  }
  return buffer;
};

export const useSoundSystem = (enabled: boolean = true) => {
  const playTone = useCallback((
    frequency: number,
    type: OscillatorType = 'sine',
    duration: number = 0.1,
    volume: number = 0.1,
    slideFreq?: number
  ) => {
    if (!enabled) return;
    const ctx = getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = type;
    
    // Lowpass filter to ensure the sound is soft and premium, not piercing
    filter.type = 'lowpass';
    filter.frequency.value = type === 'sine' ? 3000 : 1500;
    
    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    const now = ctx.currentTime;
    
    osc.frequency.setValueAtTime(frequency, now);
    if (slideFreq) {
      osc.frequency.exponentialRampToValueAtTime(slideFreq, now + duration);
    }

    // Soft attack, smooth exponential decay for an elegant 'tink' or 'chime'
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(volume, now + Math.min(0.02, duration * 0.1));
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.start(now);
    osc.stop(now + duration);
  }, [enabled]);

  return {
    playTap: () => playTone(350, 'sine', 0.05, 0.02),
    playToggleOn: () => {
      playTone(400, 'sine', 0.05, 0.02);
      setTimeout(() => playTone(600, 'sine', 0.08, 0.02), 60);
    },
    playToggleOff: () => {
      playTone(600, 'sine', 0.05, 0.02);
      setTimeout(() => playTone(400, 'sine', 0.08, 0.02), 60);
    },
    playStart: () => {
      // Warm rising interval
      playTone(440, 'sine', 0.4, 0.03); 
      setTimeout(() => playTone(554.37, 'sine', 0.6, 0.035), 150); 
    },
    playComplete: () => {
      // Gentle major chord
      playTone(523.25, 'sine', 1.5, 0.03); 
      playTone(659.25, 'sine', 1.5, 0.025); 
      playTone(783.99, 'sine', 1.5, 0.02); 
    },
    playTick: () => playTone(800, 'sine', 0.02, 0.005),
    playStreak: () => {
      // Celebratory but soft upward sweep
      playTone(440, 'sine', 0.2, 0.03, 880);
      setTimeout(() => playTone(554.37, 'sine', 0.8, 0.04), 200);
    },
    playCancel: () => {
      playTone(300, 'sine', 0.15, 0.03, 200);
    },
    startAmbient: () => {
      if (!enabled) return;
      const ctx = getContext();
      if (!ctx || ambientNode) return;
      
      const buffer = createBrownNoise(ctx);
      ambientNode = ctx.createBufferSource();
      ambientNode.buffer = buffer;
      ambientNode.loop = true;
      
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 350; // Deep comforting rumble
      
      ambientGain = ctx.createGain();
      ambientGain.gain.setValueAtTime(0, ctx.currentTime);
      ambientGain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 3); // Fade in over 3s
      
      ambientNode.connect(filter);
      filter.connect(ambientGain);
      ambientGain.connect(ctx.destination);
      ambientNode.start();
    },
    stopAmbient: () => {
      const ctx = getContext();
      if (ambientNode && ambientGain && ctx) {
        ambientGain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 2);
        const nodeToStop = ambientNode;
        ambientNode = null;
        setTimeout(() => {
          try {
            nodeToStop.stop();
            nodeToStop.disconnect();
          } catch (e) {}
        }, 2000);
      }
    },
  };
};
