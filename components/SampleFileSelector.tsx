import React, { useState, useRef, useEffect } from 'react';
import { patientSampleReport, doctorSampleReport } from '../sampleData';
import { DocumentIcon } from './icons/DocumentIcon';

interface SampleFileSelectorProps {
  onSampleSelect: (content: string, type: 'patient' | 'doctor') => void;
  userRole: 'patient' | 'doctor' | null;
}

export const SampleFileSelector: React.FC<SampleFileSelectorProps> = ({ onSampleSelect, userRole }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const handleSelect = (type: 'patient' | 'doctor') => {
    const content = type === 'patient' ? patientSampleReport : doctorSampleReport;
    onSampleSelect(content, type);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 rounded-full text-gray-600 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50 transition-colors"
        aria-label="Use sample report"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <DocumentIcon className="w-6 h-6" />
      </button>
      {isOpen && (
        <div className="absolute bottom-full mb-2 w-56 bg-white rounded-lg shadow-xl border border-slate-200 z-20" role="menu">
          <div className="p-2">
            <button
              onClick={() => handleSelect('patient')}
              className="w-full text-left px-3 py-2 text-sm text-slate-700 rounded-md hover:bg-slate-100"
              role="menuitem"
            >
              Sample Patient Report
            </button>
            <button
              onClick={() => handleSelect('doctor')}
              className="w-full text-left px-3 py-2 text-sm text-slate-700 rounded-md hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              role="menuitem"
              disabled={userRole === 'patient'}
              title={userRole === 'patient' ? "Doctor mode is not available for patient users." : ""}
            >
              Sample Doctor Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
};