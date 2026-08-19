import React from "react";
import { motion } from "framer-motion";
import { HERO_VEHICLE_IMG } from "@/data/mock";
import { cn } from "@/lib/utils";

/** Hero vehicle — original render, blended into the near-white canvas. */
export const HeroVehicle = ({
  className,
  src = HERO_VEHICLE_IMG,
  brightness = 1.09,
  alt = "AURA E7 electric crossover, three-quarter front view",
}) => (
  <div className={cn("relative select-none", className)}>
    {/* soft grounding shadow */}
    <div
      aria-hidden="true"
      className="absolute bottom-[12%] left-1/2 h-10 w-[68%] -translate-x-1/2 rounded-[100%] bg-foreground/10 blur-2xl"
    />
    <motion.img
      src={src}
      alt={alt}
      initial={{ opacity: 0, scale: 1.04, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full animate-float-slow object-contain mix-blend-multiply"
      style={{
        // brighten the render's studio backdrop toward white so multiply blending
        // dissolves the image edges into the canvas
        filter: `brightness(${brightness}) contrast(1.04) saturate(0.95)`,
        WebkitMaskImage:
          "radial-gradient(115% 105% at 50% 50%, hsl(0 0% 0%) 62%, transparent 100%)",
        maskImage:
          "radial-gradient(115% 105% at 50% 50%, hsl(0 0% 0%) 62%, transparent 100%)",
      }}
    />
  </div>
);

export default HeroVehicle;
