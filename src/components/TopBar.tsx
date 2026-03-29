import { Link, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Planner", path: "/planner" },
  { label: "History", path: "/history" }
];

export function TopBar() {
  const location = useLocation();

  return (
    <header className="h-20 border-b border-outline-variant bg-white/90 backdrop-blur-md sticky top-0 z-30">
      <div className="relative h-full max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between gap-4">
        <div className="hidden md:flex items-center min-w-0">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg border border-primary/25 bg-primary/10 flex items-center justify-center overflow-hidden">
              <img
                src="/assets/icons/thiings/futuristic-caveman/barbarian.png"
                alt=""
                aria-hidden="true"
                className="w-5 h-5 object-contain"
              />
            </div>
            <span className="font-display font-bold text-base leading-none tracking-tight text-primary">
              <span className="text-primary">STONEAGE</span>
              <span className="text-on-surface">OS</span>
            </span>
          </Link>
        </div>

        <nav aria-label="Primary navigation" className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "inline-flex items-center justify-center text-sm font-semibold transition-colors border-b-2 pb-1",
                  isActive
                    ? "text-primary border-primary"
                    : "text-on-surface-variant border-transparent hover:text-on-surface"
                )}
              >
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 ml-auto shrink-0">
          <div className="flex flex-col items-end hidden sm:flex leading-tight">
            <span className="text-xs font-display font-bold text-primary uppercase tracking-widest">Caveman</span>
            <span className="text-[10px] text-on-surface-variant uppercase tracking-tight">Stone Age Brain</span>
          </div>

          <div className="w-12 h-12 rounded-full border-2 border-primary/25 p-0.5 overflow-hidden bg-white shadow-[0_1px_4px_rgba(31,39,51,0.14)]">
            <img
              src="/assets/icons/thiings/futuristic-caveman/profile-img.png"
              alt="Caveman profile"
              className="w-full h-full rounded-full object-cover object-top scale-125"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
