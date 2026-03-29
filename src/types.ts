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

export interface PlanPlace {
  name: string;
  reason: string;
  address?: string;
  distanceKm?: number;
  estimatedTravelMinutes?: number;
  directionsUrl?: string;
  areaAccess?: "public" | "semi-public" | "private-or-unknown";
  estimatedCostPerPerson?: number;
  safetyLevel?: "low" | "medium" | "high";
}

export interface CategorySummary {
  category: string;
  summary: string;
}

export interface NeedPlacesGroup {
  need: string;
  places: Array<{
    name: string;
    address?: string;
    distanceKm?: number;
    estimatedTravelMinutes?: number;
    directionsUrl?: string;
    areaAccess?: "public" | "semi-public" | "private-or-unknown";
    estimatedCostPerPerson?: number;
    safetyLevel?: "low" | "medium" | "high";
  }>;
}

export interface SurvivalPlan {
  topChoice: PlanPlace;
  alternatives: PlanPlace[];
  riskLevel: 'low' | 'medium' | 'high';
  estimatedSpend: number;
  steps: string[];
  fallbackPlan: string;
  weatherSummary: string;
  weatherIcon?: string;
  constraintsSummary: string;
  categorySummaries: CategorySummary[];
  placesByNeed: NeedPlacesGroup[];
}

export interface GeneratePlanResponse {
  id: string;
  plan: SurvivalPlan;
}

export interface PlanHistoryItem {
  id: string;
  createdAt: string;
  locationLabel: string;
  needs: string[];
  budget: number;
  battery: number;
  timeAvailableMinutes: number;
  topChoiceName: string;
  riskLevel: "low" | "medium" | "high";
  estimatedSpend: number;
  weatherSummary: string;
}

export interface PlanHistoryResponse {
  items: PlanHistoryItem[];
  total: number;
}

export interface PlanHistoryDetailResponse {
  id: string;
  createdAt: string;
  request: {
    location: {
      lat?: number;
      lng?: number;
      label: string;
    };
    budget: number;
    battery: number;
    timeAvailableMinutes: number;
    needs: string[];
    notes: string;
  };
  result: SurvivalPlan;
}
