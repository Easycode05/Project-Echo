import React from 'react';

interface EchoLogoProps {
  className?: string;
}

export const EchoLogo: React.FC<EchoLogoProps> = ({ className }) => (
  <svg 
    viewBox="0 0 40 40" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
  >
    {/* Outer Echo */}
    <circle cx="22" cy="20" r="16" stroke="currentColor" strokeWidth="2.5" opacity="0.3" />
    
    {/* Inner Echo */}
    <circle cx="16" cy="20" r="10" stroke="currentColor" strokeWidth="2.5" opacity="0.7" />
    
    {/* The Source (Voice/Origin) */}
    <circle cx="10" cy="20" r="4" fill="currentColor" />
  </svg>
);
