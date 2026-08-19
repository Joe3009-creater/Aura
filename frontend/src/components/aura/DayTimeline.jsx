import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Zap } from "lucide-react";
import { GlassCard, CardLabel } from "@/components/aura/GlassCard";
import { Button } from "@/components/ui/button";
import { useAura } from "@/state/AuraContext";
import { cn } from "@/lib/utils";

const trafficTone = {
  Light: "text-brand-strong",
  Moderate: "text-foreground",
  Heavy: "text-warning",
};

export const DayTimeline = ({ className, delay = 0, dense = false }) => {
  const { state, startDay } = useAura();
  const { schedule, dayStarted } = state;

  return (
    <GlassCard className={cn("flex flex-col", className)} delay={delay}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <CardLabel>Your day</CardLabel>
          <h3 className="mt-2 text-lg font-medium text-foreground">
            {schedule.length} stops · 42 km
          </h3>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
          <Clock className="h-3 w-3" strokeWidth={1.8} /> Wed 14 Feb
        </span>
      </div>

      <ol className="mt-6 flex-1 space-y-0">
        {schedule.map((event, i) => (
          <motion.li
            key={event.id}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            className="group relative flex gap-4 pb-5 last:pb-0"
          >
            {/* rail */}
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "mt-1.5 h-2 w-2 shrink-0 rounded-full ring-4 ring-background/60",
                  i === 0 ? "bg-brand" : "bg-foreground/25"
                )}
              />
              {i < schedule.length - 1 && (
                <span className="mt-1 w-px flex-1 bg-foreground/10" />
              )}
            </div>

            <div className="flex-1 pb-1">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="num text-sm font-medium text-foreground">{event.time}</span>
                <span className="text-sm text-foreground">{event.title}</span>
                <span className="text-xs text-muted-foreground">{event.place}</span>
              </div>

              {!dense && (
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  {event.distance && <span className="num">{event.distance}</span>}
                  {event.traffic && (
                    <span className={cn(trafficTone[event.traffic])}>
                      Traffic · {event.traffic}
                    </span>
                  )}
                  {event.battery != null && (
                    <span className="num inline-flex items-center gap-1">
                      <Zap className="h-3 w-3" strokeWidth={1.8} />
                      {event.battery}%
                    </span>
                  )}
                  {event.arrival && <span className="num">Arrive {event.arrival}</span>}
                </div>
              )}

              {event.note && (
                <p className="mt-2 rounded-xl bg-brand-soft/70 px-3 py-2 text-xs text-brand-strong">
                  {event.note}
                </p>
              )}
            </div>
          </motion.li>
        ))}
      </ol>

      <div className="mt-6 flex flex-col gap-3 border-t border-foreground/[0.08] pt-5 sm:flex-row sm:items-center">
        <p className="flex-1 text-xs text-muted-foreground">
          AURA · You have enough range for today's plans.
        </p>
        <Button
          variant={dayStarted ? "hairline" : "pill"}
          size="lg"
          className="mt-auto"
          onClick={startDay}
          disabled={dayStarted}
        >
          {dayStarted ? "Day in progress" : "Start my day"}
          {!dayStarted && <ArrowRight className="h-4 w-4" />}
        </Button>
      </div>
    </GlassCard>
  );
};

export default DayTimeline;
