import { motion } from "motion/react";
import { ArrowRight, Shield, Zap, Map as MapIcon, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { cn } from "../lib/utils";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    document.title = "StoneAgeOS | Survival is Precision";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Welcome to StoneAgeOS. The ultimate interface for the neo-primitive era. Analyze environments, calculate risks, and secure your tribe's future.");
    }
  }, []);

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative py-12 lg:py-24 overflow-hidden rounded-3xl bg-surface-container border border-outline-variant">
        <div className="absolute inset-0 topographic-bg opacity-10" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent" />
        
        <div className="relative z-10 px-8 lg:px-16 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/30 rounded-full mb-6">
              <span className="material-symbols-outlined text-primary text-sm">bolt</span>
              <span className="text-[10px] font-display font-bold text-primary uppercase tracking-widest">System Online: v4.2.0</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-display font-bold text-on-surface leading-tight mb-8 tracking-tighter">
              SURVIVAL IS <span className="text-primary neon-glow">PRECISION</span>
            </h1>
            
            <p className="text-lg text-on-surface-variant max-w-2xl mb-12 font-sans leading-relaxed">
              Welcome to StoneAgeOS. The ultimate interface for the neo-primitive era. 
              Analyze environments, calculate risks, and secure your tribe's future with 
              high-fidelity survival planning.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link to="/planner">
                <button className="px-8 py-4 rounded-2xl bg-primary text-on-primary font-display font-bold uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,180,171,0.3)]">
                  Initialize Planner <ArrowRight size={18} />
                </button>
              </Link>
              <button className="px-8 py-4 rounded-2xl border border-outline-variant text-on-surface font-display font-bold uppercase tracking-widest hover:bg-surface-variant transition-colors">
                View Tribal Records
              </button>
            </div>
          </motion.div>
        </div>

        {/* Decorative Element */}
        <div className="absolute bottom-0 right-0 p-8 opacity-20 hidden lg:block">
          <span className="material-symbols-outlined text-[200px] text-primary">skull</span>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Active Tribes", value: "1,204", icon: "shield", color: "text-primary" },
          { label: "Energy Reserves", value: "84%", icon: "bolt", color: "text-error" },
          { label: "Mapped Regions", value: "42,800km", icon: "map", color: "text-primary" },
          { label: "Survival Rate", value: "92.4%", icon: "monitoring", color: "text-primary" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
          >
            <Card variant="surface" className="flex items-center gap-4">
              <div className={cn("p-3 rounded-2xl bg-inverse-on-surface border border-outline-variant", stat.color)}>
                <span className="material-symbols-outlined">{stat.icon}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-display font-bold">{stat.label}</span>
                <span className="text-2xl font-display font-bold text-on-surface">{stat.value}</span>
              </div>
            </Card>
          </motion.div>
        ))}
      </section>

      {/* How It Works */}
      <section className="space-y-12 py-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl lg:text-5xl font-display font-bold text-on-surface uppercase tracking-tighter">
            HOW IT <span className="text-primary neon-glow">WORKS</span>
          </h2>
          <p className="text-on-surface-variant font-sans max-w-2xl mx-auto">
            Our neural-primitive engine calculates the path of least resistance in any environment.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: "01", title: "Input Constraints", desc: "Define your current energy, credits, and environmental nuances.", icon: "input" },
            { step: "02", title: "Neural Analysis", desc: "Our AI simulates thousands of survival scenarios based on your tribal needs.", icon: "neurology" },
            { step: "03", title: "Deploy Protocol", desc: "Receive a high-fidelity action plan with ranked priorities and fallback options.", icon: "rocket_launch" },
          ].map((step, i) => (
            <div key={i} className="relative group p-8 rounded-3xl bg-surface-container border border-outline-variant hover:border-primary/40 transition-all">
              <div className="absolute top-0 right-0 p-6 text-6xl font-display font-bold text-primary/5 group-hover:text-primary/10 transition-colors">
                {step.step}
              </div>
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                <span className="material-symbols-outlined">{step.icon}</span>
              </div>
              <h3 className="text-xl font-display font-bold text-on-surface uppercase mb-4 tracking-tight">{step.title}</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="space-y-12 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <h2 className="text-3xl lg:text-5xl font-display font-bold text-on-surface uppercase tracking-tighter">
              SYSTEM <span className="text-primary neon-glow">CAPABILITIES</span>
            </h2>
            <p className="text-on-surface-variant font-sans max-w-xl">
              Advanced modules designed for the modern caveman navigating the digital wilderness.
            </p>
          </div>
          <Link to="/planner">
            <button className="px-6 py-3 rounded-2xl border border-primary text-primary font-display font-bold uppercase tracking-widest text-xs hover:bg-primary/10 transition-colors">
              Explore All Modules
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "Topographic Mapping", desc: "Real-time terrain analysis for optimal cave placement and resource gathering.", icon: "map" },
            { title: "Energy Management", desc: "Monitor tribal vitality, caloric intake, and thermal regulation across seasons.", icon: "energy_savings_leaf" },
            { title: "Threat Detection", desc: "Early warning system for predators, environmental hazards, and rival tribes.", icon: "radar" },
            { title: "Resource Allocation", desc: "Optimize your limited credits for maximum survival probability.", icon: "payments" },
            { title: "Extraction Timing", desc: "Precise window calculations for safe movement between sectors.", icon: "schedule" },
            { title: "Tactical Nuance", desc: "AI-driven insights into the subtle environmental factors others miss.", icon: "psychology" },
          ].map((feature, i) => (
            <Card key={i} variant="surface" className="group hover:border-primary/40 transition-all border border-outline-variant">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-inverse-on-surface flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-xl">{feature.icon}</span>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-display font-bold text-on-surface uppercase tracking-widest">{feature.title}</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Modules */}
        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-2xl font-display font-bold text-primary uppercase tracking-widest flex items-center gap-3">
            <div className="w-8 h-px bg-primary" /> Active Modules
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card variant="surface" className="group hover:border-primary/60 transition-colors cursor-pointer flex flex-col gap-4 border border-outline-variant">
              <div className="text-primary group-hover:scale-110 transition-transform duration-300">
                <span className="material-symbols-outlined text-4xl">map</span>
              </div>
              <div>
                <h3 className="text-xl font-display font-bold mb-2 uppercase tracking-tight text-on-surface">Topographic Mapping</h3>
                <p className="text-sm text-on-surface-variant">Real-time terrain analysis for optimal cave placement and resource gathering.</p>
              </div>
              <div className="mt-auto pt-4 flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest">
                Launch Module <ArrowRight size={14} />
              </div>
            </Card>
            <Card variant="surface" className="group hover:border-error/60 transition-colors cursor-pointer flex flex-col gap-4 border border-outline-variant">
              <div className="text-error group-hover:scale-110 transition-transform duration-300">
                <span className="material-symbols-outlined text-4xl">energy_savings_leaf</span>
              </div>
              <div>
                <h3 className="text-xl font-display font-bold mb-2 uppercase tracking-tight text-on-surface">Energy Management</h3>
                <p className="text-sm text-on-surface-variant">Monitor tribal vitality, caloric intake, and thermal regulation across seasons.</p>
              </div>
              <div className="mt-auto pt-4 flex items-center gap-2 text-error text-xs font-bold uppercase tracking-widest">
                Launch Module <ArrowRight size={14} />
              </div>
            </Card>
          </div>

          {/* Tribal Leaderboard */}
          <div className="space-y-6">
            <h2 className="text-2xl font-display font-bold text-primary uppercase tracking-widest flex items-center gap-3">
              <div className="w-8 h-px bg-primary" /> Tribal Leaderboard
            </h2>
            <Card variant="surface" className="border border-outline-variant p-0 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-inverse-on-surface">
                    <th className="p-4 font-display text-[10px] uppercase tracking-widest text-on-surface-variant">Rank</th>
                    <th className="p-4 font-display text-[10px] uppercase tracking-widest text-on-surface-variant">Tribe</th>
                    <th className="p-4 font-display text-[10px] uppercase tracking-widest text-on-surface-variant">Survival Score</th>
                    <th className="p-4 font-display text-[10px] uppercase tracking-widest text-on-surface-variant">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {[
                    { rank: "01", name: "Obsidian Fang", score: "9,842", status: "Dominant" },
                    { rank: "02", name: "Cyber Mammoth", score: "9,210", status: "Stable" },
                    { rank: "03", name: "Neon Nomad", score: "8,950", status: "Expanding" },
                    { rank: "04", name: "Iron Flint", score: "8,402", status: "Stable" },
                  ].map((tribe) => (
                    <tr key={tribe.rank} className="hover:bg-surface-variant transition-colors">
                      <td className="p-4 font-mono text-primary">{tribe.rank}</td>
                      <td className="p-4 font-display font-bold uppercase text-on-surface">{tribe.name}</td>
                      <td className="p-4 font-mono text-on-surface-variant">{tribe.score}</td>
                      <td className="p-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-primary/10 text-primary border border-primary/20">
                          {tribe.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        </div>

        {/* Right: Logs & Feed */}
        <div className="space-y-8">
          <h2 className="text-2xl font-display font-bold text-primary uppercase tracking-widest flex items-center gap-3">
            <div className="w-8 h-px bg-primary" /> System Logs
          </h2>
          <Card variant="surface" className="h-[400px] overflow-y-auto space-y-4 scrollbar-hide border border-outline-variant">
            {[
              "New territory mapped: Obsidian Peak",
              "Tribe 'Alpha' secured fresh water source",
              "Warning: Solar flare detected in Sector 7",
              "Tech Level upgrade: Bone-Cybernetics v2",
              "Migration pattern shift: Mammoth herds",
              "System maintenance complete",
              "New survival plan generated for 'Tundra'",
              "Intrusion detected in Sector 4 - Countermeasures active",
              "Resource drop scheduled for Sector 9",
            ].map((log, i) => (
              <div key={i} className="flex gap-3 text-[10px] font-mono border-b border-outline-variant pb-3">
                <span className="text-primary/40">[{new Date().toLocaleTimeString()}]</span>
                <span className="text-on-surface-variant uppercase tracking-tighter">{log}</span>
              </div>
            ))}
          </Card>

          {/* Global Survival Feed */}
          <div className="space-y-4">
            <h3 className="text-sm font-display font-bold text-on-surface uppercase tracking-widest">Global Feed</h3>
            <div className="space-y-3">
              {[
                { user: "Nomad_X", action: "Secured Shelter", time: "2m ago" },
                { user: "Cave_Hacker", action: "Crafted Cyber-Spear", time: "5m ago" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-inverse-on-surface border border-outline-variant">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-sm">person</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-on-surface uppercase tracking-widest">{item.user}</p>
                    <p className="text-[10px] text-on-surface-variant">{item.action}</p>
                  </div>
                  <span className="text-[8px] font-mono text-on-surface-variant/40">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
