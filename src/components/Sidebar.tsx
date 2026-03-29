import { Home, Map, Shield, Activity, Settings, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";

const navItems = [
  { icon: "home", label: "Home", path: "/" },
  { icon: "map", label: "Planner", path: "/planner" },
];

export function Sidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-surface-container border border-outline-variant rounded-md text-primary"
      >
        <span className="material-symbols-outlined">{isOpen ? 'close' : 'menu'}</span>
      </button>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 w-64 bg-surface-container/90 border-r border-outline-variant z-40 transform transition-transform duration-300 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full p-6">
          <div className="mb-12 flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center neon-glow shadow-[0_0_15px_rgba(255,180,171,0.3)]">
              <span className="material-symbols-outlined text-on-primary text-2xl">shield</span>
            </div>
            <span className="font-display font-bold text-xl tracking-tighter text-primary">STONEAGE<span className="text-on-surface">OS</span></span>
          </div>

          <nav className="flex-1 space-y-2">
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
                      ? "bg-primary/10 text-primary border border-primary/20" 
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
            <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg border border-outline-variant">
              <div className="w-8 h-8 rounded-full bg-on-surface/10 flex items-center justify-center">
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
