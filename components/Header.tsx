import React from 'react';
import { ShieldIcon } from './icons/ShieldIcon';

export const Header: React.FC<{ isPrivacyMode?: boolean }> = ({ isPrivacyMode = false }) => (
  <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-10">
    <div className="max-w-4xl mx-auto py-4 px-4 flex items-center justify-center relative">
      <svg className="w-8 h-8 text-teal-600 mr-3" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C10.15 2 8.5 3.65 8.5 5.5S10.15 9 12 9s3.5-1.65 3.5-3.5S13.85 2 12 2zm0 10c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm0-8c.83 0 1.5.67 1.5 1.5S12.83 7 12 7s-1.5-.67-1.5-1.5S11.17 4 12 4zm0 10c-1.67 0-3.14.5-4.22 1.25.04.01.08.02.12.03.04.01.09.01.13.02.04.01.09.01.13.01h8c.04 0 .09 0 .13-.01.04 0 .09-.01.13-.01.04-.01.08-.02.12-.03C15.14 16.5 13.67 16 12 16z"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-2c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/>
        <path d="M15.5 11h-7a.5.5 0 000 1h7a.5.5 0 000-1zM12 7.5a.5.5 0 00-.5.5v7a.5.5 0 001 0v-7a.5.5 0 00-.5-.5z"/>
      </svg>
      <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
        Airocare
      </h1>
      {isPrivacyMode && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2" title="Privacy Mode Enabled">
          <ShieldIcon className="w-6 h-6 text-teal-600" />
        </div>
      )}
    </div>
  </header>
);