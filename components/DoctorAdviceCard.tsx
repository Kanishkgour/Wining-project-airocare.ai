import React from 'react';
import { DoctorAdvice } from '../types';
import { StethoscopeIcon } from './icons/StethoscopeIcon';
import { CheckmarkIcon } from './icons/CheckmarkIcon';

export const DoctorAdviceCard: React.FC<{ advice: DoctorAdvice }> = ({ advice }) => {
  return (
    <div className="bg-teal-50/70 p-4 rounded-lg border-l-4 border-teal-500 shadow-sm">
      <div className="flex items-center">
        <StethoscopeIcon className="w-6 h-6 text-teal-700" />
        <h3 className="ml-2 text-md font-bold text-teal-800">{advice.title}</h3>
      </div>
      <p className="mt-2 text-sm text-slate-700 leading-relaxed">{advice.advice}</p>
      {advice.recommendations && advice.recommendations.length > 0 && (
        <div className="mt-3">
            <ul className="space-y-2">
                {advice.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                        <CheckmarkIcon className="w-4 h-4 text-teal-600 flex-shrink-0 mt-1 mr-2" />
                        <span className="text-sm text-slate-800">{rec}</span>
                    </li>
                ))}
            </ul>
        </div>
      )}
    </div>
  );
};