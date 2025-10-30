import React from 'react';
import { Visualization } from '../types';

const BarChart: React.FC<{ chartData: Visualization }> = ({ chartData }) => {
    const maxValue = Math.max(...chartData.data.map(d => d.value), 0);
    
    return (
        <div className="space-y-3 p-2">
            {chartData.data.map((item, index) => {
                const barWidth = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
                return (
                    <div key={index} className="flex items-center group">
                        <span className="w-20 text-xs font-medium text-slate-600 text-right pr-3">{item.label}</span>
                        <div className="flex-1 bg-slate-200/70 rounded-md h-6">
                            <div
                                className="bg-teal-500 h-full rounded-md flex items-center justify-end px-2 transition-all duration-500 ease-out group-hover:shadow-lg group-hover:bg-teal-600"
                                style={{ width: `${barWidth}%` }}
                            >
                                <span className="text-xs font-bold text-white">{item.value}</span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};


export const ChartVisualizer: React.FC<{ visualizations: Visualization[] }> = ({ visualizations }) => {
  return (
    <div className="space-y-4">
      {visualizations.map((chart, index) => (
        <div key={index} className="bg-white/70 p-4 rounded-xl shadow-sm border border-slate-200/80">
            <h3 className="text-lg font-bold text-gray-800 mb-2 px-1">{chart.title}</h3>
            {chart.type === 'bar' && <BarChart chartData={chart} />}
        </div>
      ))}
    </div>
  );
};