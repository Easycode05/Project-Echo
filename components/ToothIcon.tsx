import React from 'react';

export const Tooth = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M12 20.5c-1 0-1.5-1-1.5-2.5v-3c0-.8-.7-1.5-1.5-1.5s-1.5.7-1.5 1.5v3.5c0 1.5-.5 3-2 3-1.5 0-2-1-2.5-3.5L2.5 10c-.5-3 1-5 4-5 1.5 0 2.5 1 3.5 2 1 .8 1.5 1 2 1s1-.2 2-1c1-1 2-2 3.5-2 3 0 4.5 2 4 5l-.5 8c-.5 2.5-1 3.5-2.5 3.5-1.5 0-2-1.5-2-3v-3.5c0-.8-.7-1.5-1.5-1.5s-1.5.7-1.5 1.5v3c0 1.5-.5 2.5-1.5 2.5z" />
  </svg>
);
