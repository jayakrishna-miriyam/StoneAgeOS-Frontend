import { HTMLAttributes, forwardRef } from "react";
import { cn } from "../lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'outline' | 'ember';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'glass', ...props }, ref) => {
    const variants = {
      glass: "glass-panel bg-slate-dark/40 border-cyan/20",
      outline: "bg-transparent border border-cyan/30 rounded-xl",
      ember: "bg-ember/10 border border-ember/30 rounded-xl",
      surface: "bg-surface-container rounded-3xl p-4",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden p-6 transition-all duration-300",
          variants[variant],
          className
        )}
        {...props}
      >
        {/* Topographic overlay */}
        <div className="absolute inset-0 topographic-bg pointer-events-none opacity-10" />
        <div className="relative z-10">{props.children}</div>
      </div>
    );
  }
);

Card.displayName = "Card";

export { Card };
