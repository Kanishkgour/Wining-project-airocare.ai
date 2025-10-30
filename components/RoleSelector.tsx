import React from 'react';
import { DoctorIcon } from './icons/DoctorIcon';
import { PatientIcon } from './icons/PatientIcon';

interface RoleSelectorProps {
  onSelectRole: (role: 'patient' | 'doctor') => void;
}

const RoleButton: React.FC<{ onClick: () => void; icon: React.ReactNode; title: string; description: string; }> = ({ onClick, icon, title, description }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center justify-center text-center p-6 md:p-8 border-2 border-transparent rounded-2xl bg-white/80 shadow-lg hover:shadow-xl hover:border-teal-500 transition-all duration-300 transform hover:-translate-y-1 w-full md:w-64"
  >
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-gray-800">{title}</h3>
    <p className="mt-2 text-sm text-gray-600">{description}</p>
  </button>
);

export const RoleSelector: React.FC<RoleSelectorProps> = ({ onSelectRole }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 tracking-tight">Welcome to Airocare</h1>
        <p className="mt-3 text-lg text-gray-600">Your AI-powered medical knowledge assistant.</p>
        <p className="mt-1 text-lg font-semibold text-gray-700">Please select your role to begin.</p>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <RoleButton
          onClick={() => onSelectRole('patient')}
          icon={<PatientIcon className="w-16 h-16 text-teal-600" />}
          title="I am a Patient"
          description="Get simplified explanations of your medical reports and answers to your health questions."
        />
        <RoleButton
          onClick={() => onSelectRole('doctor')}
          icon={<DoctorIcon className="w-16 h-16 text-teal-600" />}
          title="I am a Healthcare Professional"
          description="Access clinical references, dosage guidelines, and detailed report analysis."
        />
      </div>
    </div>
  );
};