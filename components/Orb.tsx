'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface OrbProps {
  accentColor?: string; // e.g. '#1B2E1E' or hex
  audioLevel?: number; // 0 to 1
  size?: number; // width/height in px
  pulseSpeed?: number;
  interactiveMouse?: boolean;
}

export const Orb: React.FC<OrbProps> = ({
  accentColor = '#3a3939',
  audioLevel = 0,
  size = 320,
  pulseSpeed = 8,
  interactiveMouse = true,
}) => {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!interactiveMouse) return;

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 35;
      const y = (e.clientY / window.innerHeight - 0.5) * 35;
      setMouseOffset({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [interactiveMouse]);

  // Audio level scaling factor
  const audioScale = 1 + audioLevel * 0.4;
  const audioGlowOpacity = 0.35 + audioLevel * 0.5;

  return (
    <div className="relative flex items-center justify-center pointer-events-none select-none">
      {/* Dynamic Outer Diffused Glow */}
      <motion.div
        className="absolute rounded-full blur-[70px] transition-all duration-700 opacity-30"
        style={{
          width: size * 1.5,
          height: size * 1.5,
          backgroundColor: accentColor,
          transform: `translate(${mouseOffset.x}px, ${mouseOffset.y}px) scale(${audioScale})`,
          opacity: audioGlowOpacity,
        }}
        animate={{
          scale: [1 * audioScale, 1.15 * audioScale, 1 * audioScale],
        }}
        transition={{
          duration: pulseSpeed,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Outer Circle Sphere */}
      <motion.div
        className="relative rounded-full flex items-center justify-center border border-[var(--surface-border)] backdrop-blur-3xl bg-[var(--surface-bg)] shadow-[0_0_50px_rgba(0,0,0,0.1)] transition-colors duration-500"
        style={{
          width: size,
          height: size,
          transform: `translate(${mouseOffset.x * 0.7}px, ${mouseOffset.y * 0.7}px) scale(${audioScale})`,
        }}
        animate={{
          scale: [1 * audioScale, 1.05 * audioScale, 1 * audioScale],
        }}
        transition={{
          duration: pulseSpeed * 0.9,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Inner Subtle Orb Sphere */}
        <div
          className="w-[70%] h-[70%] rounded-full opacity-50 blur-[24px] transition-colors duration-1000"
          style={{
            background: `radial-gradient(circle at center, ${accentColor} 0%, transparent 80%)`,
          }}
        />
      </motion.div>
    </div>
  );
};
