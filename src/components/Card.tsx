import { HTMLAttributes, forwardRef } from "react";
import { cn } from "../lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'outline' | 'ember';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'glass', ...props }, ref) => {
    const variants = {
      glass: "glass-panel",
      outline: "bg-white border border-outline-variant rounded-xl shadow-sm",
      ember: "bg-error-container/30 border border-error/30 rounded-xl",
      surface: "bg-white rounded-3xl p-4 border border-outline-variant shadow-sm",
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
