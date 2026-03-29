import { useEffect, useState } from "react";
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
  const [error, setError] = useState<string | null>(null);
  const [hoveredPriority, setHoveredPriority] = useState<string | null>(null);
  const [activeAdvancedPriority, setActiveAdvancedPriority] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [input, setInput] = useState<SurvivalInput>({
    location: 'Sector 7G - Urban Ruins',
    credits: 250,
    extractionTime: 120,
    energyLevel: 80,
    priorities: ['safety', 'comms'],
    priorityDetails: {},
    tacticalNuances: '',
  });

  const handleAutoDetect = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setInput(prev => ({
          ...prev,
          location: `LAT: ${latitude.toFixed(4)}, LON: ${longitude.toFixed(4)}`
        }));
        setIsDetecting(false);
      },
      (err) => {
        console.error(err);
        setError("Unable to retrieve your location. Please enter it manually.");
        setIsDetecting(false);
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
    setIsLoading(true);
    setError(null);
    try {
      const plan = await generateSurvivalPlan(input);
      navigate('/result', { state: { plan } });
    } catch (err) {
      console.error(err);
      setError("Failed to initialize survival protocol. System error detected.");
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

  if (error) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center space-y-8">
        <div className="w-20 h-20 bg-error-container/10 border border-error-container/30 rounded-full flex items-center justify-center neon-glow-ember">
          <AlertTriangle className="text-error" size={40} />
        </div>
        <div className="text-center space-y-4 max-w-md">
          <h2 className="text-2xl font-display font-bold text-error uppercase tracking-widest">Protocol Failure</h2>
          <p className="text-sm text-on-surface-variant font-mono">{error}</p>
          <Button variant="ember" onClick={() => setError(null)}>Retry Initialization</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      {/* Header */}
      <header className="mb-12 relative pl-6">
        <div className="absolute left-0 top-0 w-1 h-full bg-primary rounded-full" />
        <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tight mb-4 text-on-surface">
          Survival <span className="text-primary">Planner</span>
        </h1>
        <p className="font-sans text-on-surface-variant max-w-2xl text-lg">
          Configure your survival protocol. Input your environmental parameters to generate a custom tactical plan.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form */}
        <div className="lg:col-span-7 space-y-6">
          {/* Location Card */}
          <Card variant="surface" className="flex flex-col gap-4 border-none bg-surface-container/50">
            <div className="flex flex-col gap-1">
              <h2 className="text-on-surface font-display text-xl font-bold">Location Matrix</h2>
              <p className="text-on-surface-variant font-sans text-sm">Where are you currently stationed?</p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-inverse-on-surface border border-outline-variant/30">
                <MapPin className="text-primary" size={20} />
                <input 
                  type="text"
                  value={input.location}
                  onChange={(e) => setInput({ ...input, location: e.target.value })}
                  placeholder="Enter coordinates or sector name..."
                  className="bg-transparent border-none focus:ring-0 text-on-surface font-sans w-full outline-none"
                />
              </div>
              <button 
                onClick={handleAutoDetect}
                disabled={isDetecting}
                className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-secondary-container text-on-secondary-container hover:bg-secondary transition-colors group disabled:opacity-50"
              >
                <Navigation className={cn("transition-transform", isDetecting && "animate-spin")} size={18} />
                <span className="font-sans font-bold text-sm">
                  {isDetecting ? "Detecting..." : "Auto-Detect Location"}
                </span>
              </button>
            </div>
            <div className="mt-2 h-32 rounded-2xl overflow-hidden relative border border-outline-variant">
              <img 
                src="https://picsum.photos/seed/terrain/800/400" 
                alt="Tactical Map" 
                className="w-full h-full object-cover opacity-40 grayscale contrast-125"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container to-transparent" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <span className="material-symbols-outlined text-error text-4xl animate-pulse">target</span>
              </div>
            </div>
          </Card>

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
                    onChange={(e) => setInput({ ...input, credits: parseInt(e.target.value) || 0 })}
                    className="bg-transparent border-none focus:ring-0 text-on-surface font-sans w-full outline-none"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-on-surface-variant font-sans text-[10px] uppercase tracking-widest font-bold">Extraction Time (Min)</label>
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-inverse-on-surface border border-outline-variant/30">
                  <Timer className="text-primary" size={18} />
                  <input 
                    type="number"
                    value={input.extractionTime}
                    onChange={(e) => setInput({ ...input, extractionTime: parseInt(e.target.value) || 0 })}
                    className="bg-transparent border-none focus:ring-0 text-on-surface font-sans w-full outline-none"
                    placeholder="60"
                  />
                </div>
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
                onChange={(e) => setInput({ ...input, energyLevel: parseInt(e.target.value) })}
                className="w-full h-1 bg-outline-variant rounded-lg appearance-none cursor-pointer accent-primary mt-2"
              />
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
                      onClick={() => togglePriority(opt.id)}
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

            {/* Advanced Options Modal/Overlay */}
            <AnimatePresence>
              {activeAdvancedPriority && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
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
                            onChange={(e) => updatePriorityDetail(activeAdvancedPriority, e.target.value)}
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
            </AnimatePresence>
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
                onChange={(e) => setInput({ ...input, tacticalNuances: e.target.value })}
                className="bg-transparent border-none focus:ring-0 text-on-surface font-sans w-full outline-none h-32 resize-none"
                placeholder="e.g., 'Indoor only', 'Stealth required', 'Near public transit'..."
              />
            </div>
          </Card>
        </div>

        {/* Right Column: Live Summary Panel */}
        <aside className="lg:col-span-5 sticky top-24">
          <div className="bg-surface-container rounded-3xl p-8 shadow-xl overflow-hidden relative border border-outline-variant/30">
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
                      <span key={p} className="bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest py-1.5 px-3 rounded-lg border border-primary/20">
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
            <button 
              onClick={handleGenerate}
              className="w-full py-6 rounded-3xl font-display font-bold text-xl tracking-tight text-on-primary bg-primary shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-95 transition-all duration-300 flex items-center justify-center gap-3"
            >
              <Zap size={20} />
              Generate Survival Plan
            </button>
            <div className="flex gap-4">
              <button 
                onClick={() => setInput({
                  location: '',
                  credits: 0,
                  extractionTime: 0,
                  energyLevel: 50,
                  priorities: [],
                  tacticalNuances: '',
                })}
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
