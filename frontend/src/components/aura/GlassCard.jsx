import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * The core surface of the AURA design system.
 * variant: glass (translucent) | strong (more opaque glass) | plain (solid card)
 */
export const GlassCard = React.forwardRef(
  (
    {
      className,
      variant = "glass",
      interactive = false,
      delay = 0,
      as = "div",
      children,
      ...props
    },
    ref
  ) => {
    const Comp = motion[as] || motion.div;
    return (
      <Comp
        ref={ref}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "relative rounded-[28px] p-6",
          variant === "glass" && "glass",
          variant === "strong" && "glass-strong",
          variant === "plain" && "surface",
          interactive &&
            "cursor-pointer transition-[box-shadow,transform,background-color] duration-500 ease-calm hover:-translate-y-1 hover:shadow-float",
          className
        )}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);
GlassCard.displayName = "GlassCard";

export const CardLabel = ({ children, className }) => (
  <p
    className={cn(
      "text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground",
      className
    )}
  >
    {children}
  </p>
);

export const Metric = ({ value, unit, label, className }) => (
  <div className={cn("flex flex-col", className)}>
    <span className="num text-2xl font-medium text-foreground">
      {value}
      {unit && (
        <span className="ml-1 text-sm font-normal text-muted-foreground">{unit}</span>
      )}
    </span>
    <span className="mt-1 text-xs text-muted-foreground">{label}</span>
  </div>
);

export default GlassCard;
