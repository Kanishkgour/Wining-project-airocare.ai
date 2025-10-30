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
    },
    visualizations: {
        type: Type.ARRAY,
        description: "An array of chart objects to visualize data. Generate this only when there are multiple related data points suitable for a chart (e.g., a blood panel).",
        items: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING, description: "A descriptive title for the chart." },
                type: { type: Type.STRING, enum: ['bar'], description: "The type of chart to display. Currently, only 'bar' is supported." },
                data: {
                    type: Type.ARRAY,
                    description: "The data points for the chart.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            label: { type: Type.STRING, description: "The label for the data point (e.g., 'WBC')." },
                            value: { type: Type.NUMBER, description: "The numeric value for the data point. This MUST be a number." },
                        },
                        required: ['label', 'value']
                    }
                }
            },
            required: ['title', 'type', 'data']
        }
    },
    doctorAdvice: {
        type: Type.OBJECT,
        description: "A section for providing direct advice to the patient, written from the perspective of a caring doctor. This should only be populated for Patient Mode.",
        properties: {
            title: { type: Type.STRING, description: "A clear title, e.g., 'Doctor's Advice' or 'Next Steps'." },
            advice: { type: Type.STRING, description: "A paragraph of reassuring advice explaining the results and the overall situation in simple terms." },
            recommendations: {
                type: Type.ARRAY,
                description: "A list of clear, actionable recommendations for the patient.",
                items: { type: Type.STRING }
            }
        },
        required: ['title', 'advice', 'recommendations']
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
    - 'visualizations': If the report contains multiple related quantitative values (like a complete blood count), generate a 'bar' chart visualization. The values in the chart data must be numeric.
    - 'doctorAdvice': This field must be null or omitted for Doctor Mode.
    Your tone must be professional, technical, and data-driven.`;
  }
  return `You are a caring and knowledgeable doctor explaining a medical report to a patient. Your tone is empathetic, reassuring, and clear.
  When given a report, provide a structured JSON response that conforms to this schema: ${JSON.stringify(responseSchema)}.
  - 'summary': Explain the report's purpose and overall result in simple, easy-to-understand language. Avoid jargon.
  - 'keyFindings': Break down complex terms and findings. For each finding, explain what it means in a reassuring tone. Set severity to 'high' for anything that requires immediate consultation, 'medium' for follow-ups, and 'low' or 'info' for minor notes.
  - 'labResults': Extract key lab results and explain what each test measures.
  - 'visualizations': If there are related lab results, create a simple 'bar' chart to help visualize them. The values must be numeric.
  - 'doctorAdvice': THIS IS THE MOST IMPORTANT PART. Provide a dedicated section with your advice. Include a clear title, a paragraph explaining what to do next, and a bulleted list of 2-4 actionable recommendations (e.g., 'Schedule a follow-up appointment with your doctor', 'Continue monitoring your symptoms').
  IMPORTANT: You must never provide a final diagnosis. Always end the 'advice' text with a clear disclaimer to consult their real-world doctor for medical decisions.`;
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