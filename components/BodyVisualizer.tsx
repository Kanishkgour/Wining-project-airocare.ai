import React from 'react';
import { KeyFinding } from '../types';
import { BodySilhouetteIcon } from './icons/BodySilhouetteIcon';

interface BodyVisualizerProps {
  findings: KeyFinding[];
}

const partEmojiMap: Record<string, string> = {
  head: '🧠',
  heart: '❤️',
  lungs: '🫁',
  liver: '🧡', // No liver emoji, using orange heart
  kidneys: '💜', // No kidney emoji, using purple heart
  stomach: '🤰',
  blood: '🩸',
};

// Replicating severity styles for consistency with other components
const severityBadgeConfig: Record<KeyFinding['severity'], { bg: string, text: string }> = {
    high: { bg: 'bg-red-100', text: 'text-red-800' },
    medium: { bg: 'bg-amber-100', text: 'text-amber-800' },
    low: { bg: 'bg-slate-100', text: 'text-slate-800' },
    info: { bg: 'bg-sky-100', text: 'text-sky-800' },
};

const severityOrder: Record<KeyFinding['severity'], number> = {
    info: 0,
    low: 1,
    medium: 2,
    high: 3,
};


export const BodyVisualizer: React.FC<BodyVisualizerProps> = ({ findings }) => {
  // Determine the highest severity for each affected body part to color the icon
  const partSeverities = findings.reduce((acc, finding) => {
    const part = finding.affectedBodyPart;
    if (part && part !== 'general' && part !== 'blood') {
      const currentSeverity = acc[part];
      const newSeverity = finding.severity;
      if (!currentSeverity || severityOrder[newSeverity] > severityOrder[currentSeverity]) {
        acc[part] = newSeverity;
      }
    }
    return acc;
  }, {} as Record<string, KeyFinding['severity']>);


  return (
    <div className="bg-white/70 p-4 rounded-xl shadow-sm border border-slate-200/80 flex flex-col sm:flex-row items-center gap-4">
      <div className="flex-shrink-0 w-28">
        <BodySilhouetteIcon partSeverities={partSeverities} />
      </div>
      <div className="flex-1 w-full">
        <ul className="space-y-3">
          {findings.map((finding, index) => {
            if (!finding.affectedBodyPart || finding.affectedBodyPart === 'general') return null;
            const emoji = partEmojiMap[finding.affectedBodyPart] || '👉';
            const badgeStyle = severityBadgeConfig[finding.severity] || severityBadgeConfig.info;

            return (
              <li key={index} className="flex items-start">
                <span className="text-xl mr-3 mt-0.5">{emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                     <h4 className="font-semibold text-sm text-slate-800">{finding.title}</h4>
                     <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${badgeStyle.bg} ${badgeStyle.text} capitalize flex-shrink-0`}>
                         {finding.severity}
                     </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{finding.explanation}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
