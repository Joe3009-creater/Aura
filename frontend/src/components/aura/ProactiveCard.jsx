import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Proactive AURA insight — the product's differentiator. */
export const ProactiveCard = ({
  eyebrow = "AURA recommends",
  lines = [],
  cta,
  onCta,
  secondaryCta,
  onSecondary,
  className,
  delay = 0,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    className={cn(
      "flex flex-col rounded-[28px] glass p-6",
      className
    )}
  >
    <div className="flex items-center gap-2.5">
      <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-soft text-brand-strong">
        <Sparkles className="h-3.5 w-3.5" strokeWidth={1.8} />
      </span>
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {eyebrow}
      </p>
    </div>

    <div className="mt-5 space-y-2.5">
      {lines.map((line, i) => (
        <p
          key={line}
          className={cn(
            "leading-snug",
            i === 0
              ? "text-xl font-medium text-foreground sm:text-2xl"
              : "text-sm text-muted-foreground"
          )}
        >
          {line}
        </p>
      ))}
    </div>

    {(cta || secondaryCta) && (
      <div className="mt-auto flex flex-wrap gap-2.5 pt-6">
        {cta && (
          <Button variant="pill" size="lg" onClick={onCta}>
            {cta} <ArrowRight className="h-4 w-4" />
          </Button>
        )}
        {secondaryCta && (
          <Button variant="hairline" size="lg" onClick={onSecondary}>
            {secondaryCta}
          </Button>
        )}
      </div>
    )}
  </motion.div>
);

export default ProactiveCard;
