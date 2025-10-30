import React from 'react';
import { ChatMode } from '../types';
import { DoctorIcon } from './icons/DoctorIcon';
import { PatientIcon } from './icons/PatientIcon';

interface ModeSelectorProps {
  currentMode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
}

const ModeButton: React.FC<{
  mode: ChatMode;
  currentMode: ChatMode;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}> = ({ mode, currentMode, onClick, icon, label }) => {
  const isActive = mode === currentMode;
  return (
    <button
      onClick={onClick}
      className={`
        flex-1 flex items-center justify-center p-3 rounded-lg transition-all duration-300
        ${isActive
          ? 'bg-teal-600 text-white shadow-lg scale-105'
          : 'bg-white text-gray-700 hover:bg-slate-100 hover:text-teal-600'
        }
      `}
    >
      {icon}
      <span className="ml-2 font-semibold">{label}</span>
    </button>
  );
};

export const ModeSelector: React.FC<ModeSelectorProps> = ({ currentMode, onModeChange }) => {
  return (
    <div className="p-2 bg-slate-200 rounded-xl flex gap-2 max-w-sm mx-auto my-4">
      <ModeButton
        mode={ChatMode.Patient}
        currentMode={currentMode}
        onClick={() => onModeChange(ChatMode.Patient)}
        icon={<PatientIcon className="w-5 h-5" />}
        label="Patient Mode"
      />
      <ModeButton
        mode={ChatMode.Doctor}
        currentMode={currentMode}
        onClick={() => onModeChange(ChatMode.Doctor)}
        icon={<DoctorIcon className="w-5 h-5" />}
        label="Doctor Mode"
      />
    </div>
  );
};