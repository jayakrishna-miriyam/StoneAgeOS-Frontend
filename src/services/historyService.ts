import { PlanHistoryDetailResponse, PlanHistoryResponse } from "../types";

export async function fetchPlanHistory(query: string): Promise<PlanHistoryResponse> {
  const apiBase = import.meta.env.VITE_API_BASE_URL || window.location.origin;
  const search = query.trim();
  const url = `${apiBase}/api/history?limit=100${search ? `&q=${encodeURIComponent(search)}` : ""}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    let message = "Failed to fetch history";
    try {
      const body = await response.json();
      if (body?.error) {
        message = body.error;
      }
    } catch {
      const fallback = await response.text();
      if (fallback) {
        message = fallback;
      }
    }
    throw new Error(message);
  }

  return (await response.json()) as PlanHistoryResponse;
}

export async function fetchPlanHistoryDetail(id: string): Promise<PlanHistoryDetailResponse> {
  const apiBase = import.meta.env.VITE_API_BASE_URL || window.location.origin;
  const response = await fetch(`${apiBase}/api/history/${encodeURIComponent(id)}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    let message = "Failed to fetch history detail";
    try {
      const body = await response.json();
      if (body?.error) {
        message = body.error;
      }
    } catch {
      const fallback = await response.text();
      if (fallback) {
        message = fallback;
      }
    }
    throw new Error(message);
  }

  return (await response.json()) as PlanHistoryDetailResponse;
}
