'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface OrbProps {
  accentColor?: string;
  audioLevel?: number; // 0 to 1
  size?: number;
  pulseSpeed?: number;
  interactiveMouse?: boolean;
  children?: React.ReactNode;
  progress?: number; // 0 to 1 for the circular ring
}

export const Orb: React.FC<OrbProps> = ({
  accentColor = '#3a3939',
  audioLevel = 0,
  size = 320,
  pulseSpeed = 8,
  interactiveMouse = true,
  children,
  progress,
}) => {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!interactiveMouse) return;

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      setMouseOffset({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [interactiveMouse]);

  const audioScale = 1 + audioLevel * 0.35;
  const audioGlowOpacity = 0.28 + audioLevel * 0.45;

  return (
    <div className="relative flex items-center justify-center pointer-events-none select-none">

      {/* Ring 3 — outermost slow pulse */}
      <motion.div
        className="absolute rounded-full border"
        style={{
          width: size * 1.9,
          height: size * 1.9,
          borderColor: accentColor,
          opacity: 0.06 + audioLevel * 0.08,
          transform: `translate(${mouseOffset.x * 0.3}px, ${mouseOffset.y * 0.3}px)`,
        }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.06, 0.12, 0.06] }}
        transition={{ duration: pulseSpeed * 1.4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Ring 2 — mid ring */}
      <motion.div
        className="absolute rounded-full border"
        style={{
          width: size * 1.45,
          height: size * 1.45,
          borderColor: accentColor,
          opacity: 0.1 + audioLevel * 0.12,
          transform: `translate(${mouseOffset.x * 0.5}px, ${mouseOffset.y * 0.5}px)`,
        }}
        animate={{ scale: [1, 1.12, 1], opacity: [0.10, 0.20, 0.10] }}
        transition={{ duration: pulseSpeed * 1.1, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      />

      {/* Outer diffused glow */}
      <motion.div
        className="absolute rounded-full blur-[80px]"
        style={{
          width: size * 1.6,
          height: size * 1.6,
          backgroundColor: accentColor,
          opacity: audioGlowOpacity,
          transform: `translate(${mouseOffset.x}px, ${mouseOffset.y}px) scale(${audioScale})`,
        }}
        animate={{ scale: [1 * audioScale, 1.18 * audioScale, 1 * audioScale] }}
        transition={{ duration: pulseSpeed, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Main orb sphere */}
      <motion.div
        className="relative rounded-full flex items-center justify-center backdrop-blur-3xl"
        style={{
          width: size,
          height: size,
          backgroundColor: 'var(--surface-bg)',
          border: '1px solid var(--surface-border)',
          boxShadow: `0 0 60px -10px ${accentColor}55, 0 20px 60px rgba(0,0,0,0.15)`,
          transform: `translate(${mouseOffset.x * 0.7}px, ${mouseOffset.y * 0.7}px) scale(${audioScale})`,
        }}
        animate={{ scale: [1 * audioScale, 1.04 * audioScale, 1 * audioScale] }}
        transition={{ duration: pulseSpeed * 0.9, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Inner gradient core */}
        <div
          className="w-[65%] h-[65%] rounded-full blur-[28px] opacity-60"
          style={{
            background: `radial-gradient(circle at 40% 35%, ${accentColor} 0%, transparent 75%)`,
          }}
        />

        {/* Inner highlight shimmer */}
        <div
          className="absolute top-[18%] left-[22%] w-[30%] h-[20%] rounded-full blur-[16px] opacity-20"
          style={{ backgroundColor: '#ffffff' }}
        />

        {/* Progress Ring */}
        {progress !== undefined && (
          <svg
            className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="var(--surface-border)"
              strokeWidth="1.5"
              className="opacity-30"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke={accentColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="301.59"
              animate={{ strokeDashoffset: 301.59 - (progress * 301.59) }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </svg>
        )}

        {/* Children (Timer) */}
        {children && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            {children}
          </div>
        )}
      </motion.div>
    </div>
  );
};
