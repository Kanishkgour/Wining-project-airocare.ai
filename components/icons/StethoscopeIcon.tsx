import React from 'react';

export const StethoscopeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w.org/2000/svg"
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4.8 2.3A.1.1 0 0 1 5 2.2h.4a.3.3 0 0 1 .3.3v.8a.3.3 0 0 1-.3.3H5a.3.3 0 0 1-.3-.3V2.6a.3.3 0 0 1 .1-.3Z" />
    <path d="M8 2.2h.4a.3.3 0 0 1 .3.3v.8a.3.3 0 0 1-.3.3H8a.3.3 0 0 1-.3-.3V2.6a.3.3 0 0 1 .3-.3Z" />
    <path d="M6.5 2.2V4c0 1.5-1.5 3-1.5 3H3c-1 0-2 1-2 2v4c0 1 1 2 2 2h2" />
    <path d="M9.5 2.2V4c0 1.5 1.5 3 1.5 3H13c1 0 2 1 2 2v4c0 1-1 2-2 2h-2" />
    <path d="M5.5 16v.5c0 1.4 1.1 2.5 2.5 2.5h3c1.4 0 2.5-1.1 2.5-2.5V16" />
    <circle cx="12" cy="16" r="4" />
    <path d="m12 15-1 1" />
  </svg>
);