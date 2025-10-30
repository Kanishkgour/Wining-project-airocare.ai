import React from 'react';
import { LabResultDataPoint } from '../types';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { WarningIcon } from './icons/WarningIcon';

const getStatusConfig = (status: LabResultDataPoint['status']) => {
  switch (status) {
    case 'normal':
      return {
        icon: <CheckCircleIcon className="w-5 h-5 text-green-600" />,
        color: 'text-green-700',
        barBg: 'bg-green-500'
      };
    case 'low':
    case 'high':
    case 'abnormal':
    case 'positive':
      return {
        icon: <WarningIcon className="w-5 h-5 text-red-600" />,
        color: 'text-red-700',
        barBg: 'bg-red-500'
      };
    default:
      return {
        icon: <div className="w-5 h-5" />,
        color: 'text-slate-700',
        barBg: 'bg-slate-500'
      };
  }
};

const getBarPosition = (value: number, min: number, max: number): number => {
    if (value < min) return 0;
    if (value > max) return 100;
    if (max === min) return 50; // Avoid division by zero
    return ((value - min) / (max - min)) * 100;
}

const LabResultBar: React.FC<{ result: LabResultDataPoint }> = ({ result }) => {
    const rangeParts = result.normalRange.split('-').map(s => parseFloat(s.trim()));
    if (rangeParts.length !== 2 || isNaN(rangeParts[0]) || isNaN(rangeParts[1])) {
        return null; // Don't render bar if range is not a simple numeric range
    }
    const [min, max] = rangeParts;
    const value = parseFloat(result.value);
    if (isNaN(value)) {
        return null;
    }

    const position = getBarPosition(value, min, max);

    return (
        <div className="w-full bg-slate-200 rounded-full h-2.5 my-1 relative">
            <div className={`absolute top-0 h-2.5 rounded-full ${getStatusConfig(result.status).barBg}`} style={{ left: `${position}%`, width: '4px', transform: 'translateX(-2px)' }} title={`Your value: ${result.value}`}></div>
        </div>
    )
}

export const LabResultVisualizer: React.FC<{ results: LabResultDataPoint[] }> = ({ results }) => {
  return (
    <div className="space-y-3">
      {results.map((result, index) => {
        const config = getStatusConfig(result.status);
        return (
          <div key={index} className="bg-white/70 p-3 rounded-lg">
            <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-slate-800">{result.name}</span>
                <div className={`flex items-center text-sm font-bold ${config.color}`}>
                    {config.icon}
                    <span className="ml-2">{result.value} {result.unit}</span>
                </div>
            </div>
            <LabResultBar result={result} />
            <div className="text-xs text-slate-500 flex justify-between">
                <span>Normal Range: {result.normalRange} {result.unit}</span>
                <span className="font-semibold capitalize">{result.status}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
