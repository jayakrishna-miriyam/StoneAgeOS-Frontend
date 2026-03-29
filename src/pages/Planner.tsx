import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import { 
  MapPin, 
  Target, 
  Zap, 
  Loader2, 
  AlertTriangle, 
  Compass, 
  Navigation, 
  Package, 
  CreditCard, 
  Timer, 
  CheckSquare, 
  FileText, 
  RefreshCcw, 
  Bolt,
  Utensils,
  Home as HomeIcon,
  Shield,
  BatteryCharging,
  Wifi,
  Briefcase,
  Route,
  Hammer,
  Brain,
  Info,
  Settings2,
  X
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { SurvivalInput } from "../types";
import { generateSurvivalPlan } from "../services/geminiService";
import { cn } from "../lib/utils";
import { AnimatePresence } from "motion/react";

type FormField =
  | "location"
  | "credits"
  | "extractionTime"
  | "energyLevel"
  | "priorities"
  | "priorityDetails"
  | "tacticalNuances";

type FormErrors = Partial<Record<FormField, string>>;
type LocationValidationStatus = "idle" | "validating" | "valid" | "invalid";

interface ParsedCoordinates {
  lat: number;
  lng: number;
}

interface LocationSuggestion {
  label: string;
  value: string;
}

const priorityOptions = [
  { id: 'food', label: 'Food', icon: 'restaurant', description: 'Focuses on locating sustenance, identifying edible local flora/fauna, or finding the nearest reliable supply points.' },
  { id: 'shelter', label: 'Shelter', icon: 'home', description: 'Prioritizes finding or creating a secure place to sleep and stay protected from environmental elements (weather, temperature).' },
  { id: 'safety', label: 'Safety', icon: 'shield', description: 'Focuses on security, threat avoidance, and medical preparedness. It looks for "low-profile" zones or areas with emergency services.' },
  { id: 'charging', label: 'Charging', icon: 'battery_charging_full', description: 'Essential for the modern nomad; this prioritizes finding power sources, solar-optimal spots, or public charging hubs to keep your tech alive.' },
  { id: 'comms', label: 'Comms', icon: 'wifi', description: 'Focuses on connectivity. It prioritizes areas with strong cellular signals, satellite visibility, or reliable Wi-Fi mesh networks.' },
  { id: 'workspace', label: 'Workspace', icon: 'work', description: 'Tailors the plan toward productivity, looking for quiet areas with ergonomic setups or "digital nomad" friendly environments.' },
  { id: 'route', label: 'Route', icon: 'route', description: 'Focuses on navigation and movement. It calculates the safest or most efficient paths between your current location and your next objective.' },
  { id: 'tools', label: 'Tools', icon: 'build', description: 'Prioritizes gear maintenance and resourcefulness—finding hardware, repair shops, or creative ways to use your existing equipment.' },
];

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

function reverseLabelFromNominatim(data: any): string {
  const addr = data?.address ?? {};
  const city = addr.city || addr.town || addr.village || addr.hamlet || addr.suburb;
  const state = addr.state || addr.region;
  const country = addr.country;
  const parts = [city, state, country].filter(Boolean);
  if (parts.length > 0) {
    return parts.join(", ");
  }
  return data?.display_name || "";
}

export default function Planner() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Build Your Survival Plan | StoneAgeOS";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Configure your survival parameters. Input location, budget, energy, and priorities to generate a high-fidelity tactical plan.");
    }
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [hoveredPriority, setHoveredPriority] = useState<string | null>(null);
  const [activeAdvancedPriority, setActiveAdvancedPriority] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [locationStatus, setLocationStatus] = useState<LocationValidationStatus>("idle");
  const [locationStatusText, setLocationStatusText] = useState("");
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const validationRequestId = useRef(0);
  const locationSuggestAbortRef = useRef<AbortController | null>(null);
  const locationSuggestBoxRef = useRef<HTMLDivElement | null>(null);
  const [lastValidatedLocation, setLastValidatedLocation] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);
  const [isSuggestingLocation, setIsSuggestingLocation] = useState(false);
  const [isLocationSuggestionOpen, setIsLocationSuggestionOpen] = useState(false);
  const [locationStatusAnimTick, setLocationStatusAnimTick] = useState(0);
  const [input, setInput] = useState<SurvivalInput>({
    location: 'Sector 7G - Urban Ruins',
    credits: 250,
    extractionTime: 120,
    energyLevel: 80,
    priorities: ['safety', 'comms'],
    priorityDetails: {},
    tacticalNuances: '',
  });
  const locationVisualStatus = formErrors.location || locationStatus === "invalid"
    ? "invalid"
    : locationStatus === "valid"
      ? "valid"
      : "default";
  const previousLocationVisualStatus = useRef(locationVisualStatus);
  const locationIconClass = locationVisualStatus === "invalid"
    ? "text-error"
    : locationVisualStatus === "valid"
      ? "text-green-600"
      : "text-primary";

  useEffect(() => {
    if (!activeAdvancedPriority) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [activeAdvancedPriority]);

  useEffect(() => {
    if (previousLocationVisualStatus.current !== locationVisualStatus) {
      setLocationStatusAnimTick((prev) => prev + 1);
      previousLocationVisualStatus.current = locationVisualStatus;
    }
  }, [locationVisualStatus]);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (!locationSuggestBoxRef.current) {
        return;
      }
      if (!locationSuggestBoxRef.current.contains(event.target as Node)) {
        setIsLocationSuggestionOpen(false);
      }
    };

    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    const query = input.location.trim();
    if (query.length < 2 || parseCoordinates(query)) {
      locationSuggestAbortRef.current?.abort();
      setLocationSuggestions([]);
      setIsSuggestingLocation(false);
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      locationSuggestAbortRef.current?.abort();
      const controller = new AbortController();
      locationSuggestAbortRef.current = controller;
      setIsSuggestingLocation(true);

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=6&addressdetails=1&q=${encodeURIComponent(query)}`,
          {
            method: "GET",
            signal: controller.signal
          }
        );

        if (!response.ok) {
          setLocationSuggestions([]);
          return;
        }

        const data = (await response.json()) as Array<{ display_name?: string }>;
        const next = data
          .map((item) => (item.display_name || "").trim())
          .filter(Boolean)
          .slice(0, 6)
          .map((name) => ({ label: name, value: name }));

        setLocationSuggestions(next);
        setIsLocationSuggestionOpen(next.length > 0);
      } catch {
        setLocationSuggestions([]);
      } finally {
        setIsSuggestingLocation(false);
      }
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [input.location]);

  const clearFieldError = (field: FormField) => {
    setFormErrors((prev) => {
      if (!prev[field]) {
        return prev;
      }
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const validateForm = (value: SurvivalInput): FormErrors => {
    const errors: FormErrors = {};
    const location = value.location.trim();
    const notes = value.tacticalNuances.trim();
    const detailValues = Object.values(value.priorityDetails ?? {});

    if (!location) {
      errors.location = "Location is required.";
    } else if (location.length < 2) {
      errors.location = "Location must be at least 2 characters.";
    }

    if (!Number.isFinite(value.credits) || value.credits < 0) {
      errors.credits = "Budget must be a non-negative number.";
    } else if (value.credits > 10000) {
      errors.credits = "Budget looks too high (max 10000).";
    }

    if (!Number.isFinite(value.extractionTime) || value.extractionTime <= 0) {
      errors.extractionTime = "Available time must be greater than 0 minutes.";
    } else if (value.extractionTime > 1440) {
      errors.extractionTime = "Available time cannot exceed 1440 minutes.";
    }

    if (!Number.isFinite(value.energyLevel) || value.energyLevel < 0 || value.energyLevel > 100) {
      errors.energyLevel = "Energy reserve must be between 0% and 100%.";
    }

    if (!Array.isArray(value.priorities) || value.priorities.length === 0) {
      errors.priorities = "Select at least one survival priority.";
    }

    if (notes.length > 500) {
      errors.tacticalNuances = "Additional context must be 500 characters or fewer.";
    }

    if (detailValues.some((detail) => detail.trim().length > 200)) {
      errors.priorityDetails = "Each advanced parameter must be 200 characters or fewer.";
    }

    return errors;
  };

  const validateLocation = async (
    locationInput: string,
    options: { force?: boolean } = {}
  ): Promise<boolean> => {
    const location = locationInput.trim();
    if (!location) {
      setLocationStatus("invalid");
      setLocationStatusText("Location is required.");
      return false;
    }

    if (!options.force && location === lastValidatedLocation && locationStatus === "valid") {
      return true;
    }

    const coords = parseCoordinates(location);
    if (coords) {
      setLocationStatus("valid");
      setLocationStatusText(`Coordinates verified (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})`);
      setLastValidatedLocation(location);
      return true;
    }

    const requestId = ++validationRequestId.current;
    setLocationStatus("validating");
    setLocationStatusText("Validating location...");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(location)}`,
        {
          method: "GET",
          signal: controller.signal
        }
      );

      if (requestId !== validationRequestId.current) {
        return false;
      }

      if (!response.ok) {
        setLocationStatus("invalid");
        setLocationStatusText("Could not validate location right now.");
        return false;
      }

      const data = (await response.json()) as Array<{ display_name?: string; lat?: string; lon?: string }>;
      const first = data?.[0];

      if (!first?.lat || !first?.lon) {
        setLocationStatus("invalid");
        setLocationStatusText("Enter a real place or valid coordinates.");
        return false;
      }

      setLocationStatus("valid");
      setLocationStatusText(first.display_name ? `Validated: ${first.display_name}` : "Location validated.");
      setLastValidatedLocation(location);
      return true;
    } catch {
      if (requestId !== validationRequestId.current) {
        return false;
      }
      setLocationStatus("invalid");
      setLocationStatusText("Location validation failed. Check spelling or use coordinates.");
      return false;
    } finally {
      clearTimeout(timeout);
    }
  };

  const handleAutoDetect = () => {
    if (!navigator.geolocation) {
      setSubmitError("Geolocation is not supported by your browser.");
      return;
    }

    setIsDetecting(true);
    setSubmitError(null);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        let resolvedLocation = `LAT: ${latitude.toFixed(4)}, LON: ${longitude.toFixed(4)}`;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
            { signal: AbortSignal.timeout(7000) }
          );
          if (response.ok) {
            const data = await response.json();
            const label = reverseLabelFromNominatim(data);
            if (label) {
              resolvedLocation = label;
            }
          }
        } catch {
          // Keep coordinate fallback if reverse geocoding fails.
        }

        setInput((prev) => ({
          ...prev,
          location: resolvedLocation
        }));
        clearFieldError("location");
        const valid = await validateLocation(resolvedLocation, { force: true });
        if (!valid) {
          setFormErrors((prev) => ({
            ...prev,
            location: "Auto-detected location could not be validated. Please edit manually."
          }));
        }
        setIsDetecting(false);
      },
      (err) => {
        console.error(err);
        if (err.code === 1) {
          setSubmitError("Location permission denied. Please allow browser location access.");
        } else if (err.code === 2) {
          setSubmitError("Unable to detect your current location. Try again or enter it manually.");
        } else if (err.code === 3) {
          setSubmitError("Location detection timed out. Please retry.");
        } else {
          setSubmitError("Unable to retrieve your location. Please enter it manually.");
        }
        setIsDetecting(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const togglePriority = (id: string) => {
    setInput(prev => ({
      ...prev,
      priorities: prev.priorities.includes(id)
        ? prev.priorities.filter(p => p !== id)
        : [...prev.priorities, id]
    }));
  };

  const updatePriorityDetail = (id: string, detail: string) => {
    setInput(prev => ({
      ...prev,
      priorityDetails: {
        ...prev.priorityDetails,
        [id]: detail
      }
    }));
  };

  const handleGenerate = async () => {
    const validationErrors = validateForm(input);
    setFormErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      setSubmitError("Please fix the highlighted fields before generating a plan.");
      return;
    }

    const isLocationValid = await validateLocation(input.location, { force: true });
    if (!isLocationValid) {
      setFormErrors((prev) => ({
        ...prev,
        location: "Enter a valid location name or coordinates before generating."
      }));
      setSubmitError("Please fix the highlighted fields before generating a plan.");
      return;
    }

    setIsLoading(true);
    setSubmitError(null);
    try {
      const plan = await generateSurvivalPlan(input);
      navigate('/result', { state: { plan } });
    } catch (err) {
      console.error(err);
      setSubmitError("Failed to initialize survival protocol. System error detected.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center space-y-8">
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 border-4 border-primary/20 border-t-primary rounded-full neon-glow"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="text-primary animate-pulse" size={32} />
          </div>
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-display font-bold text-primary uppercase tracking-widest animate-pulse">Initializing Protocol</h2>
          <p className="text-sm text-on-surface-variant uppercase tracking-tighter font-mono">Analyzing terrain... Calculating risks... Generating tactical data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      {/* Header */}
      <header className="mb-12 relative pl-6">
        <div className="absolute left-0 top-0 w-1 h-full bg-primary rounded-full" />
        <img
          src="/assets/icons/thiings/futuristic-caveman/motif-primitive-core.png"
          alt=""
          aria-hidden="true"
          className="absolute -right-2 -top-2 w-14 h-14 opacity-25"
        />
        <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tight mb-4 text-on-surface">
          Survival <span className="text-primary">Planner</span>
        </h1>
        <div className="absolute right-4 top-16 hidden md:block">
          <img
            src="/assets/icons/thiings/futuristic-caveman/totem-pole.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none w-24 h-24 object-contain opacity-[0.14] motif-float"
          />
        </div>
        <p className="font-sans text-on-surface-variant max-w-2xl text-lg">
          Configure your survival protocol. Input your environmental parameters to generate a custom tactical plan.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form */}
        <div className="lg:col-span-7 space-y-6">
          {/* Location Section */}
          <section className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-on-surface font-display text-xl font-bold">Location Matrix</h2>
              <p className="text-on-surface-variant font-sans text-sm">Where are you currently stationed?</p>
            </div>
            <div className="flex flex-col gap-2" ref={locationSuggestBoxRef}>
              <div className="relative flex items-center gap-3 p-4 rounded-2xl bg-inverse-on-surface border border-outline-variant/30">
                <MapPin
                  key={`${locationVisualStatus}-${locationStatusAnimTick}`}
                  className={cn(locationIconClass, "location-status-bounce")}
                  size={20}
                />
                <input 
                  type="text"
                  value={input.location}
                  onChange={(e) => {
                    setInput({ ...input, location: e.target.value });
                    clearFieldError("location");
                    setLocationStatus("idle");
                    setLocationStatusText("");
                    setLastValidatedLocation("");
                    setIsLocationSuggestionOpen(true);
                  }}
                  onFocus={() => {
                    if (locationSuggestions.length > 0) {
                      setIsLocationSuggestionOpen(true);
                    }
                  }}
                  onBlur={() => {
                    if (input.location.trim()) {
                      void validateLocation(input.location);
                    }
                  }}
                  placeholder="Enter coordinates or sector name..."
                  className="bg-transparent border-none focus:ring-0 text-on-surface font-sans w-full outline-none pr-36"
                />
                <button
                  type="button"
                  onClick={handleAutoDetect}
                  disabled={isDetecting}
                  className="absolute right-4 inline-flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors disabled:opacity-50"
                >
                  <Navigation className={cn("transition-transform", isDetecting && "animate-spin")} size={14} />
                  <span>{isDetecting ? "Detecting..." : "Auto-Detect"}</span>
                </button>
                {isLocationSuggestionOpen && (locationSuggestions.length > 0 || isSuggestingLocation) && (
                  <div className="absolute z-30 left-0 right-0 top-[calc(100%+8px)] rounded-2xl border border-outline-variant bg-white shadow-lg overflow-hidden">
                    {isSuggestingLocation ? (
                      <div className="px-4 py-3 text-sm text-on-surface-variant flex items-center gap-2">
                        <Loader2 size={14} className="animate-spin" />
                        Searching places...
                      </div>
                    ) : (
                      <ul className="max-h-64 overflow-y-auto">
                        {locationSuggestions.map((suggestion) => (
                          <li key={suggestion.value}>
                            <button
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                setInput((prev) => ({ ...prev, location: suggestion.value }));
                                clearFieldError("location");
                                setLocationStatus("idle");
                                setLocationStatusText("");
                                setLastValidatedLocation("");
                                setIsLocationSuggestionOpen(false);
                              }}
                              className="w-full px-4 py-3 text-left text-sm text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-colors"
                            >
                              {suggestion.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>
            {formErrors.location && <p className="text-xs text-error mt-1">{formErrors.location}</p>}
          </section>

          {/* Resource Card */}
          <Card variant="surface" className="flex flex-col gap-4 border-none bg-surface-container/50">
            <div className="flex flex-col gap-1">
              <h2 className="text-on-surface font-display text-xl font-bold">Resource Availability</h2>
              <p className="text-on-surface-variant font-sans text-sm">What assets are at your disposal?</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-on-surface-variant font-sans text-[10px] uppercase tracking-widest font-bold">Budget Allocation ($)</label>
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-inverse-on-surface border border-outline-variant/30">
                  <CreditCard className="text-primary" size={18} />
                  <input 
                    type="number"
                    value={input.credits}
                    min={0}
                    max={10000}
                    step={1}
                    onChange={(e) => {
                      setInput({ ...input, credits: parseInt(e.target.value, 10) || 0 });
                      clearFieldError("credits");
                    }}
                    className="bg-transparent border-none focus:ring-0 text-on-surface font-sans w-full outline-none"
                    placeholder="0.00"
                  />
                </div>
                {formErrors.credits && <p className="text-xs text-error mt-1">{formErrors.credits}</p>}
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-on-surface-variant font-sans text-[10px] uppercase tracking-widest font-bold">Extraction Time (Min)</label>
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-inverse-on-surface border border-outline-variant/30">
                  <Timer className="text-primary" size={18} />
                  <input 
                    type="number"
                    value={input.extractionTime}
                    min={1}
                    max={1440}
                    step={1}
                    onChange={(e) => {
                      setInput({ ...input, extractionTime: parseInt(e.target.value, 10) || 0 });
                      clearFieldError("extractionTime");
                    }}
                    className="bg-transparent border-none focus:ring-0 text-on-surface font-sans w-full outline-none"
                    placeholder="60"
                  />
                </div>
                {formErrors.extractionTime && <p className="text-xs text-error mt-1">{formErrors.extractionTime}</p>}
              </div>
            </div>
            <div className="mt-4 space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-on-surface-variant font-display text-[10px] uppercase tracking-widest font-bold">Energy Reserve Levels</label>
                <span className="text-primary font-display font-bold">{input.energyLevel}%</span>
              </div>
              <div className="grid grid-cols-10 gap-1.5">
                {[...Array(10)].map((_, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "h-3 rounded-sm transition-all duration-500",
                      i < input.energyLevel / 10 ? "bg-primary shadow-[0_0_8px_rgba(255,180,171,0.5)]" : "bg-inverse-on-surface"
                    )}
                  />
                ))}
              </div>
              <input 
                type="range" min="0" max="100" step="10"
                value={input.energyLevel}
                onChange={(e) => {
                  setInput({ ...input, energyLevel: parseInt(e.target.value, 10) });
                  clearFieldError("energyLevel");
                }}
                className="w-full h-1 bg-outline-variant rounded-lg appearance-none cursor-pointer accent-primary mt-2"
              />
              {formErrors.energyLevel && <p className="text-xs text-error mt-1">{formErrors.energyLevel}</p>}
            </div>
          </Card>

          {/* Needs Selector */}
          <Card variant="surface" className="flex flex-col gap-4 overflow-visible border-none bg-surface-container/50">
            <div className="flex flex-col gap-1">
              <h2 className="text-on-surface font-display text-xl font-bold">Survival Priorities</h2>
              <p className="text-on-surface-variant font-sans text-sm">Select your primary objectives.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {priorityOptions.map((opt) => {
                const isActive = input.priorities.includes(opt.id);
                const hasDetails = !!input.priorityDetails?.[opt.id]?.length;
                
                return (
                  <div key={opt.id} className="relative group/card">
                    <button
                      onClick={() => {
                        togglePriority(opt.id);
                        clearFieldError("priorities");
                      }}
                      className={cn(
                        "w-full p-4 rounded-2xl flex flex-col gap-2 border transition-all relative",
                        isActive 
                          ? "bg-primary-container border-primary text-on-primary-container" 
                          : "bg-inverse-on-surface border-outline-variant/30 text-on-surface-variant hover:bg-surface-variant"
                      )}
                    >
                      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", isActive ? "bg-primary text-on-primary" : "bg-primary/10 text-primary")}>
                        {opt.id === 'food' && <Utensils size={18} />}
                        {opt.id === 'shelter' && <HomeIcon size={18} />}
                        {opt.id === 'safety' && <Shield size={18} />}
                        {opt.id === 'charging' && <BatteryCharging size={18} />}
                        {opt.id === 'comms' && <Wifi size={18} />}
                        {opt.id === 'workspace' && <Briefcase size={18} />}
                        {opt.id === 'route' && <Route size={18} />}
                        {opt.id === 'tools' && <Hammer size={18} />}
                      </div>
                      <span className="font-sans text-xs font-bold">{opt.label}</span>
                      
                      {/* Status Indicator for Advanced Options */}
                      {hasDetails && (
                        <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      )}
                    </button>

                    {/* Action Icons */}
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity">
                      <div 
                        className="relative"
                        onMouseEnter={() => setHoveredPriority(opt.id)}
                        onMouseLeave={() => setHoveredPriority(null)}
                      >
                        <button 
                          className="p-1 rounded-full bg-surface-container/80 backdrop-blur-sm text-on-surface-variant hover:text-primary transition-colors"
                          title="Information"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Info size={12} />
                        </button>
                        
                        {/* Tooltip */}
                        <AnimatePresence>
                          {hoveredPriority === opt.id && (
                            <motion.div
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 5 }}
                              className="absolute bottom-full right-0 mb-2 w-48 p-3 bg-surface border border-outline-variant rounded-xl shadow-2xl z-50 pointer-events-none"
                            >
                              <p className="text-[10px] font-sans text-on-surface leading-relaxed uppercase tracking-wider">
                                {opt.description}
                              </p>
                              <div className="absolute top-full right-2 w-2 h-2 bg-surface border-r border-b border-outline-variant rotate-45 -translate-y-1" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveAdvancedPriority(opt.id);
                        }}
                        className={cn(
                          "p-1 rounded-full bg-surface-container/80 backdrop-blur-sm transition-colors",
                          hasDetails ? "text-primary" : "text-on-surface-variant hover:text-primary"
                        )}
                        title="Advanced Options"
                      >
                        <Settings2 size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            {formErrors.priorities && <p className="text-xs text-error mt-1">{formErrors.priorities}</p>}
            {formErrors.priorityDetails && <p className="text-xs text-error mt-1">{formErrors.priorityDetails}</p>}

            {/* Advanced Options Modal/Overlay */}
            {typeof document !== "undefined" &&
              createPortal(
                <AnimatePresence>
                  {activeAdvancedPriority && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
                      onClick={() => setActiveAdvancedPriority(null)}
                    >
                      <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="w-full max-w-md bg-surface-container rounded-3xl border border-outline-variant shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface">
                          <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary">
                              {priorityOptions.find(o => o.id === activeAdvancedPriority)?.icon}
                            </span>
                            <h3 className="font-display text-xl font-bold uppercase tracking-widest text-on-surface">
                              {priorityOptions.find(o => o.id === activeAdvancedPriority)?.label} <span className="text-primary">Parameters</span>
                            </h3>
                          </div>
                          <button
                            onClick={() => setActiveAdvancedPriority(null)}
                            className="p-2 rounded-full hover:bg-inverse-on-surface transition-colors text-on-surface-variant"
                          >
                            <X size={20} />
                          </button>
                        </div>

                        <div className="p-8 space-y-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-display font-bold uppercase tracking-[0.2em] text-primary">Specific Requirements</label>
                            <p className="text-xs text-on-surface-variant font-sans mb-4">
                              Detail your specific needs for {priorityOptions.find(o => o.id === activeAdvancedPriority)?.label.toLowerCase()}.
                              The AI will prioritize these nuances in your plan.
                            </p>
                            <div className="bg-inverse-on-surface border border-outline-variant rounded-2xl p-4 focus-within:border-primary transition-colors">
                              <textarea
                                autoFocus
                                value={input.priorityDetails?.[activeAdvancedPriority] || ''}
                                maxLength={200}
                                onChange={(e) => {
                                  updatePriorityDetail(activeAdvancedPriority, e.target.value);
                                  clearFieldError("priorityDetails");
                                }}
                                className="w-full bg-transparent border-none focus:ring-0 text-on-surface font-sans text-sm outline-none h-32 resize-none placeholder:text-on-surface-variant/30"
                                placeholder={`e.g., "High protein only", "Stealthy location", "Fast Wi-Fi required"...`}
                              />
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <Button
                              className="flex-1"
                              onClick={() => {
                                if (!input.priorities.includes(activeAdvancedPriority)) {
                                  togglePriority(activeAdvancedPriority);
                                }
                                setActiveAdvancedPriority(null);
                              }}
                            >
                              Save Parameters
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                updatePriorityDetail(activeAdvancedPriority, '');
                                setActiveAdvancedPriority(null);
                              }}
                            >
                              Clear
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>,
                document.body
              )}
          </Card>

          {/* Notes Card */}
          <Card variant="surface" className="flex flex-col gap-4 border-none bg-surface-container/50">
            <div className="flex flex-col gap-1">
              <h2 className="text-on-surface font-display text-xl font-bold">Additional Context</h2>
              <p className="text-on-surface-variant font-sans text-sm">Specify any environmental constraints or specific needs.</p>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-inverse-on-surface border border-outline-variant/30">
              <textarea 
                value={input.tacticalNuances}
                maxLength={500}
                onChange={(e) => {
                  setInput({ ...input, tacticalNuances: e.target.value });
                  clearFieldError("tacticalNuances");
                }}
                className="bg-transparent border-none focus:ring-0 text-on-surface font-sans w-full outline-none h-32 resize-none"
                placeholder="e.g., 'Indoor only', 'Stealth required', 'Near public transit'..."
              />
            </div>
            {formErrors.tacticalNuances && <p className="text-xs text-error mt-1">{formErrors.tacticalNuances}</p>}
          </Card>
        </div>

        {/* Right Column: Live Summary Panel */}
        <aside className="lg:col-span-5 sticky top-24">
          <div className="bg-surface-container rounded-3xl p-8 shadow-xl overflow-hidden relative border border-outline-variant/30">
            <img
              src="/assets/icons/thiings/futuristic-caveman/motif-cave-grid.png"
              alt=""
              aria-hidden="true"
              className="absolute right-2 top-2 w-16 h-16 opacity-20"
            />
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div>
                <h3 className="font-display text-2xl font-bold text-on-surface tracking-tight">Plan Summary</h3>
                <p className="text-[10px] font-sans text-primary uppercase tracking-widest mt-1">Status: Ready to Generate</p>
              </div>
              <RefreshCcw className="text-primary/40" size={20} />
            </div>

            <div className="space-y-8 relative z-10">
              {/* Terrain Section */}
              <div className="relative pl-6 border-l-2 border-primary/20">
                <p className="font-sans text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Location</p>
                <p className="font-sans text-lg font-bold text-on-surface">{input.location || "Not Specified"}</p>
              </div>

              {/* Resource Indicators */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-inverse-on-surface/50 p-4 rounded-2xl border border-outline-variant/20">
                  <p className="font-sans text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Budget</p>
                  <p className="font-sans text-xl font-bold text-on-surface">${input.credits.toFixed(2)}</p>
                </div>
                <div className="bg-inverse-on-surface/50 p-4 rounded-2xl border border-outline-variant/20">
                  <p className="font-sans text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Time</p>
                  <p className="font-sans text-xl font-bold text-on-surface">{input.extractionTime}m</p>
                </div>
              </div>

              {/* Selected Needs */}
              <div>
                <p className="font-sans text-[10px] uppercase tracking-widest text-on-surface-variant mb-3">Objectives</p>
                <div className="flex flex-wrap gap-2">
                  {input.priorities.length > 0 ? (
                    input.priorities.map(p => (
                      <span key={p} className="chip chip-soft">
                        {priorityOptions.find(o => o.id === p)?.label}
                      </span>
                    ))
                  ) : (
                    <span className="text-on-surface-variant/40 text-[10px] font-medium uppercase tracking-widest">
                      No objectives selected
                    </span>
                  )}
                </div>
              </div>

              {/* Expected Strategy */}
              <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10 group/projection relative">
                <div className="flex items-center gap-3 mb-2">
                  <Brain className="text-primary" size={16} />
                  <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-primary">AI Projection</p>
                </div>
                <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
                  Strategy: <span className="text-on-surface font-bold">Fast-Strike Scavenge</span>. Focusing on rapid perimeter security and high-efficiency data extraction.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Area */}
          <div className="mt-8 space-y-4">
            {submitError && (
              <div className="w-full p-4 rounded-2xl border border-error/40 bg-error-container/10 text-error text-sm font-medium flex items-start gap-2">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <span>{submitError}</span>
              </div>
            )}
            <button 
              onClick={handleGenerate}
              disabled={isLoading || isDetecting || locationStatus === "validating"}
              className="w-full py-6 rounded-3xl font-display font-bold text-xl tracking-tight text-on-primary bg-primary shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <Zap size={20} />
              Generate Survival Plan
            </button>
            <div className="flex gap-4">
              <button 
                onClick={() => {
                  setInput({
                    location: '',
                    credits: 0,
                    extractionTime: 0,
                    energyLevel: 50,
                    priorities: [],
                    priorityDetails: {},
                    tacticalNuances: '',
                  });
                  setFormErrors({});
                  setSubmitError(null);
                  setLocationStatus("idle");
                  setLocationStatusText("");
                  setLastValidatedLocation("");
                }}
                className="flex-1 py-4 rounded-2xl font-sans text-sm font-bold text-on-surface-variant hover:text-on-surface bg-inverse-on-surface border border-outline-variant/30 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCcw size={16} />
                Reset Form
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
