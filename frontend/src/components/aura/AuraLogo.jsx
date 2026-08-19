import React from "react";
import { cn } from "@/lib/utils";

/** Minimal abstract A-inspired mark. Original mark — no automotive brand. */
export const AuraLogo = ({ className, withWordmark = true, label = "AURA" }) => (
  <div className={cn("flex items-center gap-2.5", className)}>
    <span
      aria-hidden="true"
      className="relative grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground"
    >
      <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none">
        <path
          d="M4 19.5 12 4l8 15.5"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
        />
        <path
          d="M8.4 14.6h7.2"
          stroke="hsl(var(--brand))"
          strokeWidth="1.9"
          strokeLinecap="round"
        />
      </svg>
    </span>
    {withWordmark && (
      <span className="text-[15px] font-semibold tracking-[0.16em] text-foreground">
        {label}
      </span>
    )}
  </div>
);

export default AuraLogo;
