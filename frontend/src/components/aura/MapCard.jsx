import React from "react";
import { motion } from "framer-motion";
import { Expand, MapPin, Navigation, Zap } from "lucide-react";
import { GlassCard, CardLabel } from "@/components/aura/GlassCard";
import { MAP_IMG } from "@/data/mock";
import { cn } from "@/lib/utils";

const Pin = ({ x, y, tone = "brand", icon: Icon = MapPin, label, pulse }) => (
  <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${x}%`, top: `${y}%` }}>
    <div className="relative flex flex-col items-center">
      {pulse && (
        <span className="absolute top-0 h-9 w-9 rounded-full bg-brand/25 animate-pulse-ring" />
      )}
      <span
        className={cn(
          "grid h-9 w-9 place-items-center rounded-full shadow-float",
          tone === "brand" ? "bg-brand text-brand-foreground" : "bg-primary text-primary-foreground"
        )}
      >
        <Icon className="h-4 w-4" strokeWidth={1.8} />
      </span>
      {label && (
        <span className="mt-1.5 whitespace-nowrap rounded-full bg-card/85 px-2.5 py-1 text-[10px] font-medium text-foreground shadow-soft">
          {label}
        </span>
      )}
    </div>
  </div>
);

/** Tasteful mock map — no API key required. Swappable for a real map SDK. */
export const MapCard = ({ className, delay = 0, height = "min-h-[230px]", title = "My location", subtitle, showRoute = true, chargers = false }) => {
  const { } = {};
  return (
    <GlassCard className={cn("flex flex-col overflow-hidden", className)} delay={delay}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <CardLabel>{title}</CardLabel>
          <h3 className="mt-2 text-lg font-medium text-foreground">
            {subtitle || "5th Block, Koramangala"}
          </h3>
          <p className="text-sm text-muted-foreground">Bengaluru · 560095</p>
        </div>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-foreground/10 text-muted-foreground">
          <Expand className="h-3.5 w-3.5" strokeWidth={1.8} />
        </span>
      </div>

      <div
        className={cn(
          "relative mt-5 w-full flex-1 overflow-hidden rounded-3xl border border-foreground/[0.08] bg-background-deep",
          height
        )}
      >
        <img
          src={MAP_IMG}
          alt="Minimal map of the surrounding area"
          loading="lazy"
          className="h-full w-full object-cover opacity-90"
        />
        {showRoute && (
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <motion.path
              d="M22 74 C 36 64, 40 48, 54 42 S 70 30, 80 22"
              fill="none"
              stroke="hsl(var(--brand))"
              strokeWidth="1.4"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            />
          </svg>
        )}
        <Pin x={22} y={74} tone="brand" icon={Navigation} label="AURA E7" pulse />
        <Pin x={80} y={22} tone="dark" icon={MapPin} label="Aura Labs" />
        {chargers && <Pin x={52} y={56} tone="dark" icon={Zap} label="180 kW" />}
      </div>
    </GlassCard>
  );
};

export default MapCard;
