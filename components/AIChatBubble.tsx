import React, { useState } from 'react';
import { ChatMessage, StructuredAIResponse } from '../types';
import { KeyFindingCard } from './KeyFindingCard';
import { LabResultVisualizer } from './LabResultVisualizer';
import { PatientIcon } from './icons/PatientIcon';
import { ChartVisualizer } from './ChartVisualizer';
import { DoctorAdviceCard } from './DoctorAdviceCard';
import { CopyIcon } from './icons/CopyIcon';
import { CheckmarkIcon } from './icons/CheckmarkIcon';
import { BodyVisualizer } from './BodyVisualizer';

// Helper function to format the structured data into a readable string
const formatResponseForClipboard = (data: StructuredAIResponse): string => {
  let text = `Airocare Analysis\n=================\n\n`;

  text += `Summary\n-------\n${data.summary}\n\n`;

  if (data.keyFindings && data.keyFindings.length > 0) {
    text += `Key Findings\n------------\n`;
    data.keyFindings.forEach(f => {
      text += `- ${f.title}: ${f.explanation} (Severity: ${f.severity})\n`;
    });
    text += `\n`;
  }

  if (data.doctorAdvice) {
    text += `Doctor's Advice\n---------------\n`;
    text += `${data.doctorAdvice.title}\n${data.doctorAdvice.advice}\n`;
    if (data.doctorAdvice.recommendations && data.doctorAdvice.recommendations.length > 0) {
        text += `Recommendations:\n`;
        data.doctorAdvice.recommendations.forEach(r => {
            text += `- ${r}\n`;
        });
    }
    text += `\n`;
  }

  if (data.labResults && data.labResults.length > 0) {
    text += `Detailed Results\n----------------\n`;
    data.labResults.forEach(r => {
      text += `- ${r.name}: ${r.value} ${r.unit} (Normal: ${r.normalRange}, Status: ${r.status})\n`;
    });
    text += `\n`;
  }

  if (data.visualizations && data.visualizations.length > 0) {
    text += `Visualizations\n--------------\n`;
    data.visualizations.forEach(v => {
        text += `- ${v.title} (Chart data available in app)\n`;
    });
    text += `\n`;
  }

  return text;
};


export const AIChatBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const [isCopied, setIsCopied] = useState(false);
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

    const handleCopy = () => {
        const textToCopy = formatResponseForClipboard(data);
        navigator.clipboard.writeText(textToCopy).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    };

    const findingsWithBodyParts = data.keyFindings?.filter(f => f.affectedBodyPart && f.affectedBodyPart !== 'general') || [];


    return (
        <div className="flex items-start gap-3">
            <div className="flex-shrink-0 bg-teal-600 rounded-full w-8 h-8 flex items-center justify-center text-white mt-1">
                <PatientIcon className="w-5 h-5" />
            </div>
            <div className="relative w-full max-w-lg p-3 bg-slate-50 rounded-xl rounded-bl-none shadow-md border border-slate-200/80 space-y-4">
                
                <button
                    onClick={handleCopy}
                    className="absolute top-2 right-2 p-1.5 rounded-full text-slate-500 hover:bg-slate-200 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                    aria-label="Copy to clipboard"
                    title="Copy to clipboard"
                >
                    {isCopied ? (
                        <CheckmarkIcon className="w-5 h-5 text-teal-600" />
                    ) : (
                        <CopyIcon className="w-5 h-5" />
                    )}
                </button>
                
                {/* Summary Section */}
                <div className="px-1 py-2 pr-8">
                  <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">{data.summary}</p>
                </div>

                {/* Visual Body Summary */}
                {findingsWithBodyParts.length > 0 && (
                    <div className="pt-4 border-t border-slate-200">
                        <h3 className="text-lg font-bold text-gray-800 mb-3 px-1">Visual Summary</h3>
                        <BodyVisualizer findings={findingsWithBodyParts} />
                    </div>
                )}
                
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