import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const BARS = 28;

/** Calm, non-gaming waveform. Animates only while listening or speaking. */
export const VoiceVisualizer = ({
  active = false,
  level = 0,
  bars = BARS,
  className,
  tone = "brand",
}) => (
  <div
    className={cn("flex h-10 items-center justify-center gap-[3px]", className)}
    aria-hidden="true"
  >
    {Array.from({ length: bars }).map((_, i) => {
      const centre = Math.abs(i - (bars - 1) / 2) / ((bars - 1) / 2);
      const shape = 1 - centre * 0.72;
      const target = active ? Math.max(0.16, shape * (0.45 + level * 0.9)) : 0.1;
      return (
        <motion.span
          key={i}
          className={cn(
            "w-[3px] rounded-full",
            tone === "brand" ? "bg-brand" : "bg-foreground/45"
          )}
          animate={{ height: `${target * 40}px`, opacity: active ? 1 : 0.45 }}
          transition={{
            duration: 0.26,
            ease: [0.22, 1, 0.36, 1],
            delay: active ? (i % 5) * 0.015 : 0,
          }}
          style={{ height: 4 }}
        />
      );
    })}
  </div>
);

export default VoiceVisualizer;
