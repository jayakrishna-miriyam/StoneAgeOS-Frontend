import { GeneratePlanResponse, SurvivalInput, SurvivalPlan } from "../types";

interface PlanRequestPayload {
  location: string | {
    lat: number;
    lng: number;
    label: string;
  };
  budget: number;
  battery: number;
  timeAvailableMinutes: number;
  needs: string[];
  notes: string;
}

interface ParsedCoordinates {
  lat: number;
  lng: number;
}

function parseCoordinates(location: string): ParsedCoordinates | null {
  const trimmed = location.trim();
  const labelled = trimmed.match(/lat[:\s]+(-?\d+(?:\.\d+)?)\s*[, ]+\s*lon[g]?[:\s]+(-?\d+(?:\.\d+)?)/i);
  const plain = trimmed.match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/);
  const lat = Number(labelled?.[1] ?? plain?.[1]);
  const lng = Number(labelled?.[2] ?? plain?.[2]);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return null;
  }
  return { lat, lng };
}

function mapNeeds(priorities: string[]): string[] {
  return priorities.map((p) => (p === "comms" ? "wifi" : p));
}

async function resolveCoordinatesFromLabel(label: string): Promise<ParsedCoordinates | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(label)}`,
      { signal: AbortSignal.timeout(7000) }
    );
    if (!response.ok) return null;
    const data = (await response.json()) as Array<{ lat?: string; lon?: string }>;
    const lat = Number(data?.[0]?.lat);
    const lng = Number(data?.[0]?.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    return { lat, lng };
  } catch {
    return null;
  }
}

async function buildRequestPayload(input: SurvivalInput): Promise<PlanRequestPayload> {
  const rawLocation = input.location.trim();
  const coords = parseCoordinates(rawLocation) || (await resolveCoordinatesFromLabel(rawLocation));
  const notesParts = [input.tacticalNuances.trim()];
  if (input.priorityDetails) {
    const details = Object.entries(input.priorityDetails)
      .filter(([id, detail]) => input.priorities.includes(id) && detail.trim().length > 0)
      .map(([id, detail]) => `${id}: ${detail}`);
    if (details.length) {
      notesParts.push(`priority details -> ${details.join("; ")}`);
    }
  }

  return {
    location: coords
      ? { lat: coords.lat, lng: coords.lng, label: rawLocation }
      : rawLocation,
    budget: input.credits,
    battery: input.energyLevel,
    timeAvailableMinutes: input.extractionTime,
    needs: mapNeeds(input.priorities),
    notes: notesParts.filter(Boolean).join(" | ")
  };
}

export async function generateSurvivalPlan(input: SurvivalInput): Promise<SurvivalPlan> {
  const apiBase = import.meta.env.VITE_API_BASE_URL || window.location.origin;
  const payload = await buildRequestPayload(input);

  const response = await fetch(`${apiBase}/api/plan`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const msg = await response.text();
    throw new Error(msg || "Failed to fetch plan from backend");
  }

  const data = (await response.json()) as SurvivalPlan | GeneratePlanResponse;
  if ((data as GeneratePlanResponse).plan) {
    return (data as GeneratePlanResponse).plan;
  }
  return data as SurvivalPlan;
}
