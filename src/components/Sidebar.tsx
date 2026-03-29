import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";

const navItems = [
  { icon: "home", label: "Home", path: "/" },
  { icon: "map", label: "Planner", path: "/planner" },
  { icon: "history", label: "History", path: "/history" },
];

export function Sidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white border border-outline-variant rounded-md text-primary shadow-sm"
      >
        <span className="material-symbols-outlined">{isOpen ? 'close' : 'menu'}</span>
      </button>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-slate-900/35 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside className={cn(
        "md:hidden fixed inset-y-0 left-0 w-64 bg-white/95 border-r border-outline-variant z-40 transform transition-transform duration-300 shadow-sm overflow-hidden",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <img
          src="/assets/icons/thiings/futuristic-caveman/motif-tribal-circuit.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -top-10 -left-14 w-44 h-44 opacity-10"
        />
        <div className="flex flex-col h-full p-6">
          <div className="mb-12 flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center neon-glow border border-primary/20 overflow-hidden">
              <img
                src="/assets/icons/thiings/futuristic-caveman/motif-primitive-core.png"
                alt="StoneAgeOS glyph"
                className="w-7 h-7 object-contain"
              />
            </div>
            <span className="font-display font-bold text-xl tracking-tighter text-primary">STONEAGE<span className="text-on-surface">OS</span></span>
          </div>

          <nav aria-label="Mobile navigation" className="flex-1 space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                    isActive 
                      ? "bg-primary/10 text-primary border border-primary/25 shadow-sm" 
                      : "text-on-surface-variant hover:text-primary hover:bg-primary/5"
                  )}
                >
                  <span className={cn(
                    "material-symbols-outlined transition-colors",
                    isActive ? "text-primary" : "group-hover:text-primary"
                  )}>
                    {item.icon}
                  </span>
                  <span className="font-display font-medium uppercase tracking-widest text-xs">{item.label}</span>
                  {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary neon-glow" />}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-6 border-t border-outline-variant">
            <div className="relative flex items-center gap-3 p-3 bg-secondary-container rounded-lg border border-outline-variant overflow-hidden">
              <img
                src="/assets/icons/thiings/futuristic-caveman/motif-cave-grid.png"
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute right-0 bottom-0 w-16 h-16 opacity-20"
              />
              <div className="w-8 h-8 rounded-full bg-white/70 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-sm">activity_zone</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-tighter text-primary font-bold">Tribe Status</span>
                <span className="text-[10px] text-on-surface-variant">Operational: 98%</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
