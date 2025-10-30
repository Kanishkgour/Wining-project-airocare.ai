import React from 'react';
import { KeyFinding } from '../types';
import { InfoIcon } from './icons/InfoIcon';
import { WarningIcon } from './icons/WarningIcon';

const severityConfig = {
  info: {
    icon: <InfoIcon className="w-5 h-5 text-sky-600" />,
    borderColor: 'border-sky-500',
    titleColor: 'text-sky-800',
  },
  low: {
    icon: <InfoIcon className="w-5 h-5 text-slate-600" />,
    borderColor: 'border-slate-500',
    titleColor: 'text-slate-800',
  },
  medium: {
    icon: <WarningIcon className="w-5 h-5 text-amber-600" />,
    borderColor: 'border-amber-500',
    titleColor: 'text-amber-800',
  },
  high: {
    icon: <WarningIcon className="w-5 h-5 text-red-600" />,
    borderColor: 'border-red-500',
    titleColor: 'text-red-800',
  },
};

export const KeyFindingCard: React.FC<{ finding: KeyFinding }> = ({ finding }) => {
  const config = severityConfig[finding.severity] || severityConfig.info;

  return (
    <div className={`bg-white/70 p-4 rounded-lg border-l-4 ${config.borderColor} shadow-sm`}>
      <div className="flex items-center">
        {config.icon}
        <h4 className={`ml-2 text-md font-semibold ${config.titleColor}`}>{finding.title}</h4>
      </div>
      <p className="mt-2 text-sm text-slate-700">{finding.explanation}</p>
    </div>
  );
};
