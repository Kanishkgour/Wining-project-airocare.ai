import { GoogleGenAI, Chat, Type } from "@google/genai";
import { ChatMode } from '../types';

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "A concise summary of the report, tailored to the target audience (patient or doctor)."
    },
    keyFindings: {
      type: Type.ARRAY,
      description: "An array of the most important findings from the report.",
      items: {
        type: Type.OBJECT,
        properties: {
          title: {
            type: Type.STRING,
            description: "A short, descriptive title for the finding."
          },
          explanation: {
            type: Type.STRING,
            description: "A detailed explanation of the finding."
          },
          severity: {
            type: Type.STRING,
            enum: ['info', 'low', 'medium', 'high'],
            description: "An assessment of the finding's severity or importance."
          }
        },
        required: ['title', 'explanation', 'severity']
      }
    },
    labResults: {
      type: Type.ARRAY,
      description: "An array of structured lab results, if present in the report. Should be empty if no lab results are found.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Name of the lab test (e.g., 'Hemoglobin')." },
          value: { type: Type.STRING, description: "The measured value." },
          unit: { type: Type.STRING, description: "The unit of measurement (e.g., 'g/dL')." },
          normalRange: { type: Type.STRING, description: "The normal range for this test (e.g., '14-18')." },
          status: {
            type: Type.STRING,
            enum: ['low', 'normal', 'high', 'abnormal', 'positive', 'negative', 'na'],
            description: "The status of the result relative to the normal range."
          }
        },
        required: ['name', 'value', 'unit', 'normalRange', 'status']
      }
    }
  },
  required: ['summary', 'keyFindings']
};


const getSystemInstruction = (mode: ChatMode): string => {
  if (mode === ChatMode.Doctor) {
    return `You are an expert medical analysis AI for doctors. When given a medical report, provide a structured JSON response. 
    The JSON object must conform to this schema: ${JSON.stringify(responseSchema)}.
    - 'summary': Provide a concise clinical summary highlighting critical data points.
    - 'keyFindings': Detail significant findings, differential diagnoses, and potential next steps. Use technical language. Set severity based on clinical urgency.
    - 'labResults': Extract all quantitative lab results precisely.
    Your tone must be professional, technical, and data-driven.`;
  }
  return `You are a friendly and empathetic medical analysis AI for patients. When given a medical report, provide a structured JSON response.
  The JSON object must conform to this schema: ${JSON.stringify(responseSchema)}.
  - 'summary': Explain the report's purpose and overall result in simple, easy-to-understand language. Avoid jargon.
  - 'keyFindings': Break down complex terms and findings. For each finding, explain what it means in a reassuring tone. Set severity to 'high' for anything that requires immediate consultation, 'medium' for follow-ups, and 'low' or 'info' for minor notes.
  - 'labResults': Extract key lab results and explain what each test measures.
  IMPORTANT: You must never provide a diagnosis or medical advice. Always end the summary with a clear disclaimer to consult their doctor.`;
};

let chat: Chat | null = null;
let currentMode: ChatMode | null = null;

export const generateResponse = async (mode: ChatMode, prompt: string): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    if (mode !== currentMode || !chat) {
      currentMode = mode;
      const systemInstruction = getSystemInstruction(mode);
      chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: systemInstruction,
          temperature: mode === ChatMode.Doctor ? 0.2 : 0.7,
          responseMimeType: "application/json",
          responseSchema: responseSchema,
        },
      });
    }

    const response = await chat.sendMessage({ message: prompt });
    return response.text;
  } catch (error) {
    console.error("Error generating response from Gemini API:", error);
    return JSON.stringify({
      summary: "I'm sorry, I encountered an error while analyzing the report. This can sometimes happen with complex documents. Please try again.",
      keyFindings: [{
        title: "Analysis Error",
        explanation: "There was a problem processing the request with the AI model. Please check the browser console for technical details.",
        severity: "high"
      }],
      labResults: []
    });
  }
};

export const resetChat = () => {
    chat = null;
    currentMode = null;
}
