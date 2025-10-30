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
        bg: 'bg-green-500'
      };
    case 'low':
       return {
        icon: <WarningIcon className="w-5 h-5 text-amber-600" />,
        color: 'text-amber-700',
        bg: 'bg-amber-500'
      };
    case 'high':
    case 'abnormal':
    case 'positive':
      return {
        icon: <WarningIcon className="w-5 h-5 text-red-600" />,
        color: 'text-red-700',
        bg: 'bg-red-500'
      };
    default:
      return {
        icon: <div className="w-5 h-5" />,
        color: 'text-slate-700',
        bg: 'bg-slate-500'
      };
  }
};


const InteractiveResultGraph: React.FC<{ result: LabResultDataPoint }> = ({ result }) => {
    const value = parseFloat(result.value);
    const rangeParts = result.normalRange.split('-').map(s => parseFloat(s.trim()));

    if (isNaN(value) || rangeParts.length !== 2 || isNaN(rangeParts[0]) || isNaN(rangeParts[1])) {
        return null; // Don't render graph for non-numeric ranges
    }

    const [minNormal, maxNormal] = rangeParts;

    // Define the graph's visual scale to be wider than the normal range for context
    const rangeSpan = maxNormal - minNormal;
    const graphMin = minNormal - rangeSpan * 0.75;
    const graphMax = maxNormal + rangeSpan * 0.75;

    const toPercent = (v: number) => {
        const percentage = ((v - graphMin) / (graphMax - graphMin)) * 100;
        return Math.max(0, Math.min(100, percentage));
    };

    const normalStartPercent = toPercent(minNormal);
    const normalWidthPercent = toPercent(maxNormal) - normalStartPercent;
    const valuePositionPercent = toPercent(value);

    const config = getStatusConfig(result.status);

    return (
        <div className="mt-4 mb-2">
            <div className="relative group">
                {/* Graph track with colored zones */}
                <div className="h-3 w-full flex rounded-full overflow-hidden">
                    <div className="bg-amber-300" style={{ width: `${normalStartPercent}%` }}></div>
                    <div className="bg-green-300" style={{ width: `${normalWidthPercent}%` }}></div>
                    <div className="bg-red-300 flex-1"></div>
                </div>

                {/* Value Pointer */}
                <div 
                    className="absolute top-1/2 h-full flex items-center" 
                    style={{ left: `${valuePositionPercent}%`, transform: 'translateX(-50%)' }}
                >
                    <div className={`w-4 h-4 rounded-full ${config.bg} border-2 border-white shadow-md`}></div>
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 w-max px-2 py-1 bg-slate-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                        Your Value: {result.value} ({result.status})
                    </div>
                </div>
            </div>
            {/* Ticks for normal range */}
            <div className="relative h-4 text-xs text-slate-500 font-medium">
                <span className="absolute -translate-x-1/2" style={{ left: `${normalStartPercent}%` }}>{minNormal}</span>
                <span className="absolute -translate-x-1/2" style={{ left: `${toPercent(maxNormal)}%` }}>{maxNormal}</span>
            </div>
        </div>
    );
};


export const LabResultVisualizer: React.FC<{ results: LabResultDataPoint[] }> = ({ results }) => {
  return (
    <div className="space-y-3">
      {results.map((result, index) => {
        const config = getStatusConfig(result.status);
        return (
          <div key={index} className="bg-white/80 p-4 rounded-xl border border-slate-200/80">
            <div className="flex justify-between items-start">
                <div>
                    <span className="text-sm font-bold text-slate-800">{result.name}</span>
                     <div className="text-xs text-slate-500 mt-1">
                        Normal Range: {result.normalRange} {result.unit}
                    </div>
                </div>
                <div className={`flex items-center text-sm font-bold ${config.color} flex-shrink-0 ml-2`}>
                    {config.icon}
                    <span className="ml-2">{result.value} {result.unit}</span>
                </div>
            </div>
            <InteractiveResultGraph result={result} />
          </div>
        );
      })}
    </div>
  );
};