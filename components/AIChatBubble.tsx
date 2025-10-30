import React from 'react';
import { ChatMessage, StructuredAIResponse } from '../types';
import { KeyFindingCard } from './KeyFindingCard';
import { LabResultVisualizer } from './LabResultVisualizer';
import { PatientIcon } from './icons/PatientIcon';
import { ChartVisualizer } from './ChartVisualizer';
import { DoctorAdviceCard } from './DoctorAdviceCard';

export const AIChatBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
    let data: StructuredAIResponse;
    try {
        data = JSON.parse(message.text);
    } catch (error) {
        return (
            <div className="flex items-end justify-start">
                <div className="max-w-md md:max-w-lg px-4 py-3 rounded-2xl bg-white text-gray-800 rounded-bl-none shadow-sm">
                    <p className="font-semibold text-red-600">Error: Could not parse AI response.</p>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{message.text}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex items-start gap-3">
            <div className="flex-shrink-0 bg-teal-600 rounded-full w-8 h-8 flex items-center justify-center text-white mt-1">
                <PatientIcon className="w-5 h-5" />
            </div>
            <div className="w-full max-w-lg p-3 bg-slate-50 rounded-xl rounded-bl-none shadow-md border border-slate-200/80 space-y-4">
                
                {/* Summary Section */}
                <div className="px-1 py-2">
                  <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">{data.summary}</p>
                </div>
                
                {/* Visualizations Section */}
                {data.visualizations && data.visualizations.length > 0 && (
                    <div className="pt-4 border-t border-slate-200">
                        <ChartVisualizer visualizations={data.visualizations} />
                    </div>
                )}

                {/* Key Findings Section */}
                {data.keyFindings && data.keyFindings.length > 0 && (
                    <div className="pt-4 border-t border-slate-200">
                        <h3 className="text-lg font-bold text-gray-800 mb-3 px-1">Key Findings</h3>
                        <div className="space-y-2">
                            {data.keyFindings.map((finding, index) => (
                                <KeyFindingCard key={index} finding={finding} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Doctor's Advice Section */}
                {data.doctorAdvice && (
                     <div className="pt-4 border-t border-slate-200">
                       <DoctorAdviceCard advice={data.doctorAdvice} />
                    </div>
                )}

                {/* Lab Results Section */}
                {data.labResults && data.labResults.length > 0 && (
                     <div className="pt-4 border-t border-slate-200">
                        <h3 className="text-lg font-bold text-gray-800 mb-3 px-1">Detailed Results</h3>
                        <LabResultVisualizer results={data.labResults} />
                    </div>
                )}
            </div>
        </div>
    );
};