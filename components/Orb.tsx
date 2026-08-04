'use client';

import React from 'react';

interface OrbProps {
  accentColor?: string;
  size?: number;
  pulseSpeed?: number;
  interactiveMouse?: boolean;
  children?: React.ReactNode;
  progress?: number; // 0 to 1 for the circular ring
}

export const Orb: React.FC<OrbProps> = ({
  accentColor = '#3a3939',
  size = 320,
  children,
  progress,
}) => {
  // Use pure CSS animation variables to avoid JS rendering loop
  return (
    <div className="relative flex items-center justify-center pointer-events-none select-none">
      <style jsx global>{`
        @keyframes orb-ring-pulse {
          0%, 100% { transform: scale(1); opacity: 0.06; }
          50% { transform: scale(1.1); opacity: 0.15; }
        }
        @keyframes orb-float {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-orb { animation: orb-float 8s ease-in-out infinite; }
      `}</style>

      {/* Ring 3 — outermost slow pulse */}
      <div
        className="absolute rounded-full border opacity-10"
        style={{
          width: size * 1.9,
          height: size * 1.9,
          borderColor: accentColor,
          animation: 'orb-ring-pulse 11s ease-in-out infinite',
        }}
      />

      {/* Ring 2 — mid ring */}
      <div
        className="absolute rounded-full border opacity-20"
        style={{
          width: size * 1.45,
          height: size * 1.45,
          borderColor: accentColor,
          animation: 'orb-ring-pulse 8s ease-in-out infinite 0.5s',
        }}
      />

      {/* Outer diffused glow */}
      <div
        className="absolute rounded-full blur-[80px] animate-orb"
        style={{
          width: size * 1.6,
          height: size * 1.6,
          backgroundColor: accentColor,
          opacity: 0.4,
        }}
      />

      {/* Main orb sphere */}
      <div
        className="relative rounded-full flex items-center justify-center backdrop-blur-3xl animate-orb"
        style={{
          width: size,
          height: size,
          backgroundColor: 'var(--surface-bg)',
          border: '1px solid var(--surface-border)',
          boxShadow: `0 0 60px -10px ${accentColor}55, 0 20px 60px rgba(0,0,0,0.15)`,
          animationDuration: '7s'
        }}
      >
        {/* Inner gradient core */}
        <div
          className="absolute w-[65%] h-[65%] rounded-full blur-[28px] opacity-60"
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
            <circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke={accentColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="301.59"
              style={{
                strokeDashoffset: 301.59 - (progress * 301.59),
                transition: 'stroke-dashoffset 0.5s ease-out',
              }}
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
