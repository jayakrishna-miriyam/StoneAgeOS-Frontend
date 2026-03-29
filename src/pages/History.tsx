import { Clock3, MapPin, Search, ShieldAlert, Wallet } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "../components/Card";
import { fetchPlanHistory } from "../services/historyService";
import { PlanHistoryItem } from "../types";
import { cn } from "../lib/utils";

function riskChipClass(risk: PlanHistoryItem["riskLevel"]) {
  if (risk === "high") return "chip chip-danger";
  if (risk === "medium") return "chip chip-warn";
  return "chip chip-safe";
}

function needsLabel(needs: string[]) {
  return needs.map((need) => need.toUpperCase()).join(" / ");
}

export default function History() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<PlanHistoryItem[]>([]);

  useEffect(() => {
    document.title = "Plan History | StoneAgeOS";
  }, []);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetchPlanHistory(query);
        setItems(response.items);
      } catch {
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [query]);

  const emptyMessage = useMemo(() => {
    if (query.trim()) {
      return "No history matches your search.";
    }
    return "No history found.";
  }, [query]);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8 relative">
      <img
        src="/assets/icons/thiings/futuristic-caveman/indigenous.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute right-2 top-2 w-32 h-32 opacity-10"
      />

      <header className="space-y-2">
        <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-on-surface">
          Plan <span className="text-primary">History</span>
        </h1>
        <p className="text-on-surface-variant">Search and review your previously generated survival plans.</p>
      </header>

      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by location, top choice, weather, or need..."
          className="w-full rounded-2xl border border-outline-variant bg-white py-3 pl-12 pr-4 text-sm outline-none focus:border-primary"
        />
      </div>

      {isLoading ? (
        <div className="min-h-[220px] flex items-center justify-center text-sm text-on-surface-variant">Loading history...</div>
      ) : items.length === 0 ? (
        <div className="min-h-[220px] flex items-center justify-center text-on-surface-variant text-3xl md:text-4xl font-display font-semibold text-center">
          {emptyMessage}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {items.map((item) => (
            <Link key={item.id} to={`/result/${item.id}`} className="block focus-visible:outline-2 focus-visible:outline-primary rounded-2xl">
              <Card variant="surface" className="bg-white border border-outline-variant/80 space-y-4 relative overflow-hidden hover:border-primary/40 transition-colors">
                <img
                  src="/assets/icons/thiings/futuristic-caveman/barbarian.png"
                  alt=""
                  aria-hidden="true"
                  className="pointer-events-none absolute right-2 bottom-1 w-16 h-16 object-contain opacity-10"
                />
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-display font-bold text-on-surface">{item.topChoiceName}</h3>
                    <p className="text-xs text-on-surface-variant">{new Date(item.createdAt).toLocaleString()}</p>
                  </div>
                  <span className={riskChipClass(item.riskLevel)}>
                    <ShieldAlert size={12} />
                    {item.riskLevel.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <MapPin size={14} />
                    <span className="truncate">{item.locationLabel}</span>
                  </div>
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <Wallet size={14} />
                    <span>${item.estimatedSpend}</span>
                  </div>
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <Clock3 size={14} />
                    <span>{item.timeAvailableMinutes}m</span>
                  </div>
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <span className="material-symbols-outlined text-sm">bolt</span>
                    <span>{item.battery}%</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className={cn("chip chip-muted")}>{needsLabel(item.needs)}</span>
                  <span className={cn("chip chip-soft")}>{item.weatherSummary}</span>
                </div>

                <p className="text-xs text-primary font-semibold">Open details</p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
