import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/** Accessible battery ring — state communicated by text + shape, not colour alone. */
export const BatteryRing = ({
  value = 82,
  range,
  size = 132,
  charging = false,
  className,
}) => {
  const stroke = 7;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div
      className={cn("relative shrink-0", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Battery ${clamped} percent${range ? `, ${range} kilometres of range` : ""}${charging ? ", charging" : ""}`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="hsl(var(--foreground) / 0.08)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={
            clamped <= 20 ? "hsl(var(--warning))" : "hsl(var(--brand))"
          }
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (clamped / 100) * c }}
          transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="num text-[26px] font-medium leading-none text-foreground">
          {clamped}
          <span className="text-sm text-muted-foreground">%</span>
        </span>
        {range != null && (
          <span className="num mt-1.5 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            {range} km
          </span>
        )}
        {charging && (
          <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.14em] text-brand-strong">
            Charging
          </span>
        )}
      </div>
    </div>
  );
};

export const BatteryBar = ({ value = 82, label, className }) => (
  <div className={cn("w-full", className)}>
    <div className="mb-1.5 flex items-baseline justify-between">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="num text-xs font-medium text-foreground">{value}%</span>
    </div>
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-foreground/[0.08]">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${value}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "h-full rounded-full",
          value <= 25 ? "bg-warning" : "bg-brand"
        )}
      />
    </div>
  </div>
);

export default BatteryRing;
