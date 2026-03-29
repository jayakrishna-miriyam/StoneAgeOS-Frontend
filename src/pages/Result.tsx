import { useLocation, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, 
  Shield, 
  Zap, 
  Map as MapIcon, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Hammer, 
  Info, 
  LayoutDashboard, 
  FileText,
  ChevronDown,
  ChevronUp,
  Download,
  Terminal,
  Target
} from "lucide-react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { SurvivalPlan } from "../types";
import { cn } from "../lib/utils";
import { useEffect, useState } from "react";

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const plan = location.state?.plan as SurvivalPlan;
  const [viewMode, setViewMode] = useState<'tactical' | 'full'>('tactical');

  useEffect(() => {
    if (plan) {
      document.title = `${plan.title} | StoneAgeOS Protocol`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute("content", plan.summary);
      }
    } else {
      navigate('/planner');
    }
  }, [plan, navigate]);

  if (!plan) return null;

  const toggleView = () => setViewMode(prev => prev === 'tactical' ? 'full' : 'tactical');

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 pb-20 space-y-8">
      {/* Navigation & Mode Toggle */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
        <Link to="/planner">
          <button className="flex items-center gap-2 text-on-surface-variant font-sans text-sm hover:text-primary transition-colors group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
            Back to Planner
          </button>
        </Link>

        <div className="flex bg-surface-container p-1 rounded-xl border border-outline-variant">
          <button 
            onClick={() => setViewMode('tactical')}
            className={cn(
              "px-6 py-2 rounded-lg font-sans text-sm font-medium transition-all",
              viewMode === 'tactical' ? "bg-primary text-on-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"
            )}
          >
            Tactical Overview
          </button>
          <button 
            onClick={() => setViewMode('full')}
            className={cn(
              "px-6 py-2 rounded-lg font-sans text-sm font-medium transition-all",
              viewMode === 'full' ? "bg-primary text-on-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"
            )}
          >
            Full Details
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'tactical' ? (
          <motion.div
            key="tactical"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="space-y-6"
          >
            {/* Tactical Dashboard Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card variant="surface" className="md:col-span-2 p-8 border-none bg-surface-container/50 relative overflow-hidden">
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded">
                      Protocol Active
                    </span>
                    <span className={cn(
                      "px-2 py-0.5 border text-[10px] font-bold uppercase tracking-widest rounded",
                      plan.riskLevel === 'high' ? "bg-error-container/20 border-error/30 text-error" : "bg-primary/10 border-primary/30 text-primary"
                    )}>
                      Risk: {plan.riskLevel}
                    </span>
                  </div>
                  <h1 className="text-4xl font-display font-bold text-on-surface tracking-tight leading-tight">
                    {plan.title}
                  </h1>
                  <p className="text-on-surface-variant font-sans text-base leading-relaxed max-w-xl">
                    {plan.summary}
                  </p>
                </div>
              </Card>

              <div className="space-y-6">
                <Card variant="surface" className="p-6 flex flex-col justify-between h-full bg-primary/5 border-none">
                  <div className="space-y-1">
                    <p className="font-sans text-xs font-medium text-primary uppercase tracking-wider">Estimated Cost</p>
                    <p className="text-4xl font-display font-bold text-on-surface">${plan.estimatedSpend}</p>
                  </div>
                  <div className="pt-4 border-t border-outline-variant/30 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Zap size={14} className="text-primary" />
                      <span className="text-[10px] font-sans text-on-surface-variant">Confidence: 94.8%</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Tactical Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Primary Directive */}
              <Card variant="surface" className="p-6 border-none bg-surface-container/50 relative group">
                <div className="mb-4 flex items-center gap-2">
                  <Target size={16} className="text-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Primary Objective</span>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-display font-bold text-on-surface leading-tight">
                    {plan.topChoice?.name}
                  </h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed italic">
                    {plan.topChoice?.reason}
                  </p>
                </div>
              </Card>

              {/* Execution Checklist */}
              <Card variant="surface" className="p-6 flex flex-col gap-4 border-none bg-surface-container/50">
                <h3 className="text-[10px] uppercase tracking-widest text-primary font-bold flex items-center gap-2">
                  <CheckCircle2 size={14} /> Key Actions
                </h3>
                <div className="space-y-3">
                  {plan.priorityActions.slice(0, 4).map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                        {i + 1}
                      </div>
                      <span className="text-sm font-sans text-on-surface truncate">
                        {item.action}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Threat Matrix */}
              <Card variant="surface" className="p-6 flex flex-col gap-4 bg-error-container/5 border-none">
                <h3 className="text-[10px] uppercase tracking-widest text-error font-bold flex items-center gap-2">
                  <AlertTriangle size={14} /> Threat Assessment
                </h3>
                <div className="space-y-4">
                  {plan.threatAssessment.slice(0, 3).map((threat, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold uppercase">
                        <span className="text-on-surface">{threat.threat}</span>
                        <span className="text-error">Active</span>
                      </div>
                      <div className="h-1.5 w-full bg-inverse-on-surface rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 1, delay: i * 0.2 }}
                          className="h-full bg-error/60"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                className="flex-1 py-6 text-base tracking-wide rounded-2xl"
                onClick={() => setViewMode('full')}
              >
                View Detailed Protocol <ChevronDown className="ml-2" size={20} />
              </Button>
              <Button 
                variant="outline"
                className="flex-1 py-6 text-base tracking-wide rounded-2xl"
              >
                Export PDF <Download className="ml-2" size={20} />
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-12"
          >
            {/* Full Protocol View (Existing Content but polished) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-10">
                {/* Action Detailed Steps */}
                <section className="space-y-6">
                  <h2 className="text-xl font-display font-bold text-on-surface flex items-center gap-3">
                    <div className="w-6 h-px bg-primary" /> Execution Steps
                  </h2>
                  <div className="space-y-4">
                    {plan.priorityActions.map((item, i) => (
                      <Card key={i} variant="surface" className="group border-none bg-surface-container/30 hover:bg-surface-container/50 transition-all duration-300">
                        <div className="flex items-start gap-4 p-2">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border",
                            item.risk === 'High' ? "bg-error-container/10 border-error/20 text-error" :
                            item.risk === 'Medium' ? "bg-primary/5 border-primary/20 text-primary" :
                            "bg-inverse-on-surface border-outline-variant/30 text-on-surface-variant"
                          )}>
                            <span className="font-display font-bold text-lg">{i + 1}</span>
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex justify-between items-center">
                              <h3 className="text-base font-bold text-on-surface">{item.action}</h3>
                              <span className={cn(
                                "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded",
                                item.risk === 'High' ? "text-error bg-error/5" :
                                item.risk === 'Medium' ? "text-primary bg-primary/5" :
                                "text-on-surface-variant bg-on-surface-variant/5"
                              )}>
                                {item.risk} Risk
                              </span>
                            </div>
                            <p className="text-sm text-on-surface-variant leading-relaxed">{item.description}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </section>

                {/* Alternatives */}
                <section className="space-y-6">
                  <h2 className="text-xl font-display font-bold text-on-surface-variant flex items-center gap-3">
                    <div className="w-6 h-px bg-on-surface-variant" /> Contingency Plans
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {plan.alternatives.map((alt, i) => (
                      <Card key={i} variant="surface" className="p-5 border-none bg-surface-container/30 hover:bg-surface-container/50 transition-colors">
                        <h4 className="text-base font-bold text-on-surface mb-2">{alt.name}</h4>
                        <p className="text-sm text-on-surface-variant leading-relaxed">{alt.reason}</p>
                      </Card>
                    ))}
                  </div>
                </section>
              </div>

              {/* Sidebar */}
              <div className="space-y-10">
                <div className="space-y-4">
                  <h2 className="text-lg font-display font-bold text-primary flex items-center gap-3">
                    <div className="w-4 h-px bg-primary" /> Logic
                  </h2>
                  <Card variant="surface" className="p-5 border-none bg-primary/5">
                    <p className="text-sm text-on-surface-variant leading-relaxed font-sans">
                      {plan.constraintsSummary}
                    </p>
                  </Card>
                </div>

                <div className="space-y-4">
                  <h2 className="text-lg font-display font-bold text-error flex items-center gap-3">
                    <div className="w-4 h-px bg-error" /> Fallback
                  </h2>
                  <Card variant="surface" className="p-5 border-none bg-error-container/5">
                    <p className="text-sm text-on-surface-variant leading-relaxed font-sans italic">
                      "{plan.fallbackPlan}"
                    </p>
                  </Card>
                </div>

                <div className="space-y-4">
                  <h2 className="text-lg font-display font-bold text-primary flex items-center gap-3">
                    <div className="w-4 h-px bg-primary" /> Recommended Gear
                  </h2>
                  <div className="grid grid-cols-1 gap-3">
                    {plan.recommendedTools.map((tool, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-surface-container/30 border border-outline-variant/10">
                        <div className="w-2 h-2 rounded-full bg-primary/40" />
                        <div>
                          <p className="text-xs font-bold text-on-surface">{tool.name}</p>
                          <p className="text-[10px] text-on-surface-variant">{tool.utility}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-lg font-display font-bold text-primary flex items-center gap-3">
                    <div className="w-4 h-px bg-primary" /> Protocol Stats
                  </h2>
                  <Card variant="surface" className="p-5 border-none bg-primary/5">
                    <div className="space-y-3">
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-on-surface-variant uppercase">Confidence</span>
                        <span className="text-primary font-bold">94.8%</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-on-surface-variant uppercase">Data Points</span>
                        <span className="text-primary font-bold">1,402</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-on-surface-variant uppercase">Sync Status</span>
                        <span className="text-primary font-bold">Live</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-8">
              <Button 
                variant="outline" 
                className="px-12 py-4 rounded-2xl"
                onClick={() => setViewMode('tactical')}
              >
                Return to Tactical Overview <ChevronUp className="ml-2" size={16} />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
