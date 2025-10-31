import React from 'react';
import { KeyFinding } from '../../types';

interface BodySilhouetteIconProps {
  partSeverities: Record<string, KeyFinding['severity']>;
}

const severityColorMap: Record<KeyFinding['severity'], { fill: string; stroke: string; }> = {
  high:   { fill: 'rgba(239, 68, 68, 0.7)',   stroke: 'rgba(185, 28, 28, 1)' },   // Red
  medium: { fill: 'rgba(245, 158, 11, 0.7)',  stroke: 'rgba(180, 83, 9, 1)' },    // Amber
  low:    { fill: 'rgba(100, 116, 139, 0.7)', stroke: 'rgba(51, 65, 85, 1)' },     // Slate
  info:   { fill: 'rgba(2, 132, 199, 0.7)',   stroke: 'rgba(3, 105, 161, 1)' },    // Sky
};

const defaultStyle = {
  fill: '#E2E8F0',
  stroke: '#94A3B8',
  strokeWidth: 0.5,
  transition: 'all 0.3s ease-in-out',
};

export const BodySilhouetteIcon: React.FC<BodySilhouetteIconProps> = ({ partSeverities }) => {
  const getPartStyle = (part: string) => {
    const severity = partSeverities[part];
    if (severity && severityColorMap[severity]) {
      return {
        ...severityColorMap[severity],
        strokeWidth: 1.5,
        transition: 'all 0.3s ease-in-out',
      };
    }
    return defaultStyle;
  };

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 300" aria-label="Human body diagram with color-coded areas based on finding severity">
      {/* Head */}
      <circle data-part="head" cx="75" cy="35" r="25" style={getPartStyle('head')} />
      {/* Body Trunk */}
      <path d="M50 70 Q75 65, 100 70 L110 180 Q75 220, 40 180 Z" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="0.5" />
      {/* Lungs */}
      <path data-part="lungs" d="M65 80 a 15 20 0 0 1 20 0 L 90 115 a 15 20 0 0 1 -30 0 L 60 115 a 15 20 0 0 1 5 -35z M85 80 a 15 20 0 0 0 -20 0" style={getPartStyle('lungs')} />
      {/* Heart */}
      <path data-part="heart" d="M75,100 a 10 10 0 0 1 0 20 a 10 10 0 0 1 0 -20" transform="rotate(15 75 110)" style={getPartStyle('heart')} />
      {/* Liver */}
      <path data-part="liver" d="M78 125 C 95 120, 100 145, 80 148 Z" style={getPartStyle('liver')} />
      {/* Stomach */}
      <path data-part="stomach" d="M72 125 C 55 120, 50 145, 70 148 Z" style={getPartStyle('stomach')} />
      {/* Kidneys */}
      <ellipse data-part="kidneys" cx="65" cy="160" rx="8" ry="12" style={getPartStyle('kidneys')} />
      <ellipse data-part="kidneys" cx="85" cy="160" rx="8" ry="12" style={getPartStyle('kidneys')} />
    </svg>
  );
};
