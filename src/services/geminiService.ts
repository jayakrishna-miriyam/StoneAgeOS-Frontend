import { GoogleGenAI, Type } from "@google/genai";
import { SurvivalInput, SurvivalPlan } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const survivalPlanSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    summary: { type: Type.STRING },
    topChoice: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        reason: { type: Type.STRING }
      },
      required: ['name', 'reason']
    },
    alternatives: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          reason: { type: Type.STRING }
        },
        required: ['name', 'reason']
      }
    },
    priorityActions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          action: { type: Type.STRING },
          description: { type: Type.STRING },
          risk: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] }
        },
        required: ['action', 'description', 'risk']
      }
    },
    recommendedTools: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          utility: { type: Type.STRING }
        },
        required: ['name', 'utility']
      }
    },
    threatAssessment: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          threat: { type: Type.STRING },
          mitigation: { type: Type.STRING }
        },
        required: ['threat', 'mitigation']
      }
    },
    riskLevel: { type: Type.STRING, enum: ['low', 'medium', 'high'] },
    estimatedSpend: { type: Type.NUMBER },
    fallbackPlan: { type: Type.STRING },
    constraintsSummary: { type: Type.STRING }
  },
  required: [
    'title', 
    'summary', 
    'topChoice', 
    'alternatives', 
    'priorityActions', 
    'recommendedTools', 
    'threatAssessment', 
    'riskLevel', 
    'estimatedSpend', 
    'fallbackPlan', 
    'constraintsSummary'
  ]
};

export async function generateSurvivalPlan(input: SurvivalInput): Promise<SurvivalPlan> {
  const priorityDetailsStr = input.priorityDetails 
    ? Object.entries(input.priorityDetails)
        .filter(([id, detail]) => input.priorities.includes(id) && detail.trim().length > 0)
        .map(([id, detail]) => `- ${id.toUpperCase()}: ${detail}`)
        .join('\n')
    : 'None';

  const prompt = `Generate a detailed survival plan for a futuristic caveman scenario.
  Target Location: ${input.location}
  Budget: $${input.credits}
  Extraction Window: ${input.extractionTime} minutes
  Energy Reserve Level: ${input.energyLevel}%
  Survival Priorities: ${input.priorities.join(', ')}
  Priority Specific Details:
  ${priorityDetailsStr}
  Tactical Nuances/Constraints: ${input.tacticalNuances}
  
  The tone should be "StoneAgeOS" - a mix of primitive survivalism and futuristic UI precision.
  The plan should be practical but imaginative within this unique setting.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: survivalPlanSchema,
      systemInstruction: "You are StoneAgeOS, a high-precision survival AI for the neo-primitive era. You provide tactical advice for tribes navigating the intersection of ancient instincts and futuristic threats."
    }
  });

  return JSON.parse(response.text);
}
