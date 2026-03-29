export type Environment = 'Cave' | 'Forest' | 'Desert' | 'Tundra' | 'Volcano';
export type Goal = 'Survival' | 'Exploration' | 'Conquest' | 'Diplomacy';

export interface SurvivalInput {
  location: string;
  credits: number;
  extractionTime: number;
  energyLevel: number; // 0-100
  priorities: string[];
  priorityDetails?: Record<string, string>;
  tacticalNuances: string;
}

export interface SurvivalPlan {
  title: string;
  summary: string;
  topChoice: {
    name: string;
    reason: string;
  };
  alternatives: {
    name: string;
    reason: string;
  }[];
  priorityActions: {
    action: string;
    description: string;
    risk: 'Low' | 'Medium' | 'High';
  }[];
  recommendedTools: {
    name: string;
    utility: string;
  }[];
  threatAssessment: {
    threat: string;
    mitigation: string;
  }[];
  riskLevel: 'low' | 'medium' | 'high';
  estimatedSpend: number;
  fallbackPlan: string;
  constraintsSummary: string;
}
