import { useLocation, Link, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Navigation,
  CloudSun,
  Shield,
  DollarSign,
  Route,
  Sparkles
} from "lucide-react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { SurvivalPlan, PlanPlace } from "../types";
import { cn } from "../lib/utils";
import { useEffect, useMemo, useState } from "react";
import { fetchPlanHistoryDetail } from "../services/historyService";

function riskClass(risk?: "low" | "medium" | "high") {
  if (risk === "high") return "chip chip-danger";
  if (risk === "medium") return "chip chip-warn";
  return "chip chip-safe";
}

function areaLabel(area?: PlanPlace["areaAccess"]) {
  if (area === "public") return "Public";
  if (area === "semi-public") return "Semi-public";
  return "Private/Unknown";
}

function fmtDistance(km?: number) {
  if (typeof km !== "number") return "N/A";
  const miles = km * 0.621371;
  return `${miles.toFixed(1)} mi`;
}

function fmtEta(minutes?: number) {
  if (typeof minutes !== "number") return "N/A";
  return `${minutes} min`;
}

function weatherIconUrl(code?: string) {
  const icon = code && /^[0-9]{2}[dn]$/.test(code) ? code : "03d";
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}

function weatherAnimClass(code?: string) {
  if (!code) return "weather-float";
  if (code.startsWith("11")) return "weather-pulse";
  if (code.startsWith("09") || code.startsWith("10")) return "weather-bob";
  if (code.startsWith("13")) return "weather-drift";
  return "weather-float";
}

function sectionTitle(label: string) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <img
        src="/assets/icons/thiings/futuristic-caveman/motif-primitive-core.png"
        alt=""
        aria-hidden="true"
        className="w-5 h-5 opacity-80"
      />
      <div className="w-8 h-px bg-primary/60" />
      <h2 className="text-xl font-display font-bold text-on-surface">{label}</h2>
    </div>
  );
}

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const [loadedPlan, setLoadedPlan] = useState<SurvivalPlan | null>((location.state?.plan as SurvivalPlan) || null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const plan = loadedPlan;
  const [viewMode, setViewMode] = useState<"tactical" | "full">("tactical");

  useEffect(() => {
    if (plan) {
      return;
    }

    if (!params.id) {
      navigate("/planner");
      return;
    }

    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    fetchPlanHistoryDetail(params.id)
      .then((detail) => {
        if (!cancelled) {
          setLoadedPlan(detail.result);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setLoadError(error instanceof Error ? error.message : "Failed to load plan detail");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [plan, params.id, navigate]);

  useEffect(() => {
    if (!plan) return;
    document.title = `${plan.topChoice?.name || "Plan"} | StoneAgeOS Results`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", plan.constraintsSummary || "Structured survival plan with routes, cost, and safety.");
    }
  }, [plan]);

  const normalized = useMemo(() => {
    const raw = (plan ?? {}) as any;
    const alternatives: PlanPlace[] = Array.isArray(raw.alternatives) ? raw.alternatives : [];
    const steps: string[] = Array.isArray(raw.steps)
      ? raw.steps
      : Array.isArray(raw.priorityActions)
        ? raw.priorityActions.map((item: any) => item?.action).filter(Boolean)
        : [];
    const categorySummaries: Array<{ category: string; summary: string }> = Array.isArray(raw.categorySummaries)
      ? raw.categorySummaries
      : [];
    const placesByNeed: Array<{
      need: string;
      places: Array<{
        name: string;
        address?: string;
        distanceKm?: number;
        estimatedTravelMinutes?: number;
        directionsUrl?: string;
      }>;
    }> = Array.isArray(raw.placesByNeed) ? raw.placesByNeed : [];

    return {
      topChoice: raw.topChoice as PlanPlace | undefined,
      alternatives,
      steps,
      categorySummaries,
      placesByNeed,
      weatherSummary: raw.weatherSummary || "Weather unavailable",
      weatherIcon: raw.weatherIcon as string | undefined,
      constraintsSummary: raw.constraintsSummary || "No constraint summary available.",
      fallbackPlan: raw.fallbackPlan || "No fallback plan available.",
      riskLevel: raw.riskLevel as "low" | "medium" | "high" | undefined,
      estimatedSpend: typeof raw.estimatedSpend === "number" ? raw.estimatedSpend : 0
    };
  }, [plan]);

  const topMetrics = useMemo(
    () => [
      { label: "Distance", value: fmtDistance(normalized.topChoice?.distanceKm), icon: <Route size={14} className="text-primary" /> },
      { label: "ETA", value: fmtEta(normalized.topChoice?.estimatedTravelMinutes), icon: <Navigation size={14} className="text-primary" /> },
      {
        label: "Cost / Person",
        value: typeof normalized.topChoice?.estimatedCostPerPerson === "number" ? `$${normalized.topChoice.estimatedCostPerPerson}` : "N/A",
        icon: <DollarSign size={14} className="text-primary" />
      },
      {
        label: "Safety",
        value: normalized.topChoice?.safetyLevel ? normalized.topChoice.safetyLevel.toUpperCase() : "N/A",
        icon: <Shield size={14} className="text-primary" />
      }
    ],
    [normalized.topChoice]
  );

  if (loading) {
    return <div className="py-12 text-on-surface-variant">Loading plan details...</div>;
  }

  if (loadError) {
    return (
      <div className="py-12 space-y-4">
        <p className="text-error">{loadError}</p>
        <Link to="/history" className="chip chip-muted">Back to History</Link>
      </div>
    );
  }

  if (!plan) return null;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 pb-20 space-y-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
        <Link to="/planner">
          <button className="flex items-center gap-2 text-on-surface-variant font-sans text-sm hover:text-primary transition-colors group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Planner
          </button>
        </Link>

        <div className="flex bg-white p-1 rounded-xl border border-outline-variant shadow-sm">
          <button
            onClick={() => setViewMode("tactical")}
            className={cn(
              "px-6 py-2 rounded-lg font-sans text-sm font-medium transition-all",
              viewMode === "tactical" ? "bg-primary text-on-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"
            )}
          >
            Tactical Overview
          </button>
          <button
            onClick={() => setViewMode("full")}
            className={cn(
              "px-6 py-2 rounded-lg font-sans text-sm font-medium transition-all",
              viewMode === "full" ? "bg-primary text-on-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"
            )}
          >
            Full Details
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === "tactical" ? (
          <motion.div
            key="tactical"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card variant="surface" className="md:col-span-2 p-8 bg-white relative overflow-hidden">
                <img
                  src="/assets/icons/thiings/futuristic-caveman/motif-tribal-circuit.png"
                  alt=""
                  aria-hidden="true"
                  className="pointer-events-none absolute right-2 top-2 w-24 h-24 opacity-10"
                />
                <img
                  src="/assets/icons/thiings/futuristic-caveman/barbarian.png"
                  alt=""
                  aria-hidden="true"
                  className="pointer-events-none absolute right-6 bottom-4 w-20 h-20 object-contain opacity-[0.12] motif-float"
                />
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={riskClass(normalized.riskLevel)}>
                      Risk: {normalized.riskLevel || "N/A"}
                    </span>
                    <span className="chip chip-warn">
                      Area: {areaLabel(normalized.topChoice?.areaAccess)}
                    </span>
                    <span className="chip chip-safe">
                      <CloudSun size={12} /> {normalized.weatherSummary}
                    </span>
                    <span className="chip chip-muted">
                      <Sparkles size={12} /> Futuristic Caveman
                    </span>
                  </div>

                  <h1 className="text-4xl font-display font-bold text-on-surface tracking-tight leading-tight">
                    {normalized.topChoice?.name || "No top choice"}
                  </h1>
                  <p className="text-on-surface-variant font-sans text-base leading-relaxed max-w-xl">{normalized.topChoice?.reason}</p>
                  {normalized.topChoice?.address && <p className="text-sm text-on-surface-variant">{normalized.topChoice.address}</p>}
                  {normalized.topChoice?.directionsUrl && (
                    <a
                      href={normalized.topChoice.directionsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
                    >
                      Get Directions <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </Card>

                <Card variant="surface" className="p-6 bg-white relative overflow-hidden">
                  <img
                    src="/assets/icons/thiings/futuristic-caveman/motif-stone-signal.png"
                    alt=""
                    aria-hidden="true"
                    className="pointer-events-none absolute right-2 -bottom-2 w-20 h-20 opacity-10"
                  />
                  <div className="space-y-2">
                  <p className="font-sans text-xs font-medium text-primary uppercase tracking-wider">Estimated Spend</p>
                  <p className="text-4xl font-display font-bold text-on-surface">${normalized.estimatedSpend}</p>
                </div>
                <div className="pt-4 mt-4 border-t border-outline-variant/60 space-y-2">
                  {topMetrics.map((m) => (
                    <div key={m.label} className="flex items-center justify-between text-xs">
                      <span className="text-on-surface-variant flex items-center gap-2">{m.icon}{m.label}</span>
                      <span className="text-on-surface font-bold">{m.value}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card variant="surface" className="p-6 bg-white">
                <p className="text-[10px] uppercase tracking-widest text-primary font-bold mb-4">Action Steps</p>
                <div className="space-y-3">
                  {normalized.steps.map((step, i) => (
                    <div key={i} className="flex items-start gap-3 rounded-xl border border-outline-variant/50 bg-surface-variant/50 p-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary mt-0.5">
                        {i + 1}
                      </div>
                      <p className="text-sm text-on-surface">{step}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card variant="surface" className="p-6 bg-error-container/20 border-error/20">
                <p className="text-[10px] uppercase tracking-widest text-error font-bold mb-4 flex items-center gap-2">
                  <AlertTriangle size={14} /> Fallback Plan
                </p>
                <p className="text-sm text-on-surface-variant italic">"{normalized.fallbackPlan}"</p>
              </Card>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button className="flex-1 py-5 text-base tracking-wide rounded-2xl" onClick={() => setViewMode("full")}>
                View Full Details <ChevronDown className="ml-2" size={18} />
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <section>
                  {sectionTitle("1. Alternatives")}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {normalized.alternatives.map((alt, i) => (
                      <Card key={i} variant="surface" className="p-5 bg-white">
                        <h4 className="text-base font-bold text-on-surface mb-1">{alt.name}</h4>
                        <p className="text-sm text-on-surface-variant mb-3">{alt.reason}</p>
                        <div className="space-y-1 text-xs text-on-surface-variant">
                          <p>Distance: <span className="text-on-surface">{fmtDistance(alt.distanceKm)}</span></p>
                          <p>ETA: <span className="text-on-surface">{fmtEta(alt.estimatedTravelMinutes)}</span></p>
                          <p>Public Access: <span className="text-on-surface">{areaLabel(alt.areaAccess)}</span></p>
                          <p>Cost / Person: <span className="text-on-surface">{typeof alt.estimatedCostPerPerson === "number" ? `$${alt.estimatedCostPerPerson}` : "N/A"}</span></p>
                          <p>Safety: <span className="text-on-surface">{alt.safetyLevel ? alt.safetyLevel.toUpperCase() : "N/A"}</span></p>
                        </div>
                        {alt.directionsUrl && (
                          <a
                            href={alt.directionsUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary"
                          >
                            Open Directions <ExternalLink size={12} />
                          </a>
                        )}
                      </Card>
                    ))}
                  </div>
                </section>

                <section>
                  {sectionTitle("2. Places By Need")}
                  {normalized.placesByNeed.length > 0 ? (
                    <div className="space-y-4">
                      {normalized.placesByNeed.map((group, i) => (
                        <Card key={`${group.need}-${i}`} variant="surface" className="p-5 bg-white">
                          <p className="text-[10px] uppercase tracking-widest text-primary font-bold mb-3">{group.need}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {group.places.map((p, idx) => (
                              <div key={`${p.name}-${idx}`} className="rounded-xl border border-outline-variant/50 bg-surface-variant/50 p-3">
                                <p className="text-sm font-bold text-on-surface">{p.name}</p>
                                {p.address && <p className="text-xs text-on-surface-variant">{p.address}</p>}
                                <p className="text-xs text-on-surface-variant mt-2">
                                  Distance: <span className="text-on-surface">{fmtDistance(p.distanceKm)}</span>
                                </p>
                                <p className="text-xs text-on-surface-variant">
                                  ETA: <span className="text-on-surface">{fmtEta(p.estimatedTravelMinutes)}</span>
                                </p>
                                {p.directionsUrl && (
                                  <a
                                    href={p.directionsUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary"
                                  >
                                    Get Directions <ExternalLink size={12} />
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card variant="surface" className="p-5 bg-white">
                      <p className="text-sm text-on-surface-variant">No grouped places available for current needs.</p>
                    </Card>
                  )}
                </section>

                <section>
                  {sectionTitle("3. Category Overview")}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {normalized.categorySummaries.length > 0 ? normalized.categorySummaries.map((c, i) => (
                      <Card key={i} variant="surface" className="p-5 bg-white">
                        <p className="text-[10px] uppercase tracking-widest text-primary font-bold mb-2">{c.category}</p>
                        <p className="text-sm text-on-surface-variant">{c.summary}</p>
                      </Card>
                    )) : (
                      <Card variant="surface" className="p-5 bg-white">
                        <p className="text-sm text-on-surface-variant">Category insights are unavailable for this plan response.</p>
                      </Card>
                    )}
                  </div>
                </section>
              </div>

              <div className="space-y-6">
                <Card variant="surface" className="p-5 bg-white relative overflow-hidden">
                  <img
                    src="/assets/icons/thiings/futuristic-caveman/motif-obsidian-compass.png"
                    alt=""
                    aria-hidden="true"
                    className="pointer-events-none absolute right-3 top-3 w-10 h-10 opacity-15"
                  />
                  <h2 className="text-lg font-display font-bold text-primary mb-3">Weather on Route/Area</h2>
                  <div className="flex items-center gap-3">
                    <img
                      src={weatherIconUrl(normalized.weatherIcon)}
                      alt={normalized.weatherSummary}
                      className={cn("w-14 h-14 drop-shadow-sm", weatherAnimClass(normalized.weatherIcon))}
                    />
                    <p className="text-sm text-on-surface-variant">{normalized.weatherSummary}</p>
                  </div>
                </Card>

                <Card variant="surface" className="p-5 bg-white">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-lg font-display font-bold text-primary mb-3">Constraint Summary</h2>
                    <img
                      src="/assets/icons/thiings/futuristic-caveman/indigenous.png"
                      alt=""
                      aria-hidden="true"
                      className="w-8 h-8 object-contain opacity-[0.25]"
                    />
                  </div>
                  <p className="text-sm text-on-surface-variant">{normalized.constraintsSummary}</p>
                </Card>

                <Card variant="surface" className="p-5 bg-error-container/20 border-error/20">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-lg font-display font-bold text-error mb-3">Fallback</h2>
                    <img
                      src="/assets/icons/thiings/futuristic-caveman/totem-pole.png"
                      alt=""
                      aria-hidden="true"
                      className="w-8 h-8 object-contain opacity-[0.2]"
                    />
                  </div>
                  <p className="text-sm text-on-surface-variant italic">{normalized.fallbackPlan}</p>
                </Card>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Button variant="outline" className="px-12 py-4 rounded-2xl" onClick={() => setViewMode("tactical")}>
                Return to Tactical Overview <ChevronUp className="ml-2" size={16} />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
