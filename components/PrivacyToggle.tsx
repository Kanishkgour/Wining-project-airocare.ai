import React from 'react';
import { ShieldIcon } from './icons/ShieldIcon';

interface PrivacyToggleProps {
  isPrivacyMode: boolean;
  onToggle: (isEnabled: boolean) => void;
}

export const PrivacyToggle: React.FC<PrivacyToggleProps> = ({ isPrivacyMode, onToggle }) => {
  const toggleClasses = isPrivacyMode ? 'bg-teal-600' : 'bg-slate-300';
  const circleClasses = isPrivacyMode ? 'translate-x-5' : 'translate-x-0';

  return (
    <div className="flex items-center space-x-2" title={isPrivacyMode ? "Disable Privacy Mode" : "Enable Privacy Mode"}>
        <ShieldIcon className={`w-5 h-5 transition-colors ${isPrivacyMode ? 'text-teal-600' : 'text-gray-500'}`} />
        <button
            role="switch"
            aria-checked={isPrivacyMode}
            onClick={() => onToggle(!isPrivacyMode)}
            className={`${toggleClasses} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2`}
        >
            <span
            className={`${circleClasses} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
            />
        </button>
    </div>
  );
};