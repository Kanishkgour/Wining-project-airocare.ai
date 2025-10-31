export enum ChatMode {
  Patient = 'patient',
  Doctor = 'doctor',
}

export interface ChatMessage {
  sender: 'user' | 'ai' | 'system';
  text: string; // For user/system, plain text. For AI, a JSON string of StructuredAIResponse
}

// --- New Types for Structured AI Response ---

export interface LabResultDataPoint {
  name: string;
  value: string;
  unit: string;
  normalRange: string;
  status: 'low' | 'normal' | 'high' | 'abnormal' | 'positive' | 'negative' | 'na';
}

export interface KeyFinding {
  title: string;
  explanation: string;
  severity: 'info' | 'low' | 'medium' | 'high';
  affectedBodyPart?: 'head' | 'heart' | 'lungs' | 'liver' | 'kidneys' | 'stomach' | 'blood' | 'general';
}

export interface ChartDataPoint {
    label: string;
    value: number;
}

export interface Visualization {
    title: string;
    type: 'bar'; // Currently supporting only bar charts
    data: ChartDataPoint[];
}

export interface DoctorAdvice {
    title: string;
    advice: string;
    recommendations: string[];
}

export interface StructuredAIResponse {
  summary: string;
  keyFindings: KeyFinding[];
  labResults?: LabResultDataPoint[];
  visualizations?: Visualization[];
  doctorAdvice?: DoctorAdvice;
}