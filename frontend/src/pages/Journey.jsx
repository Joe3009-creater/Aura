import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, Clock, Loader2, MapPin, Navigation, Zap } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard, CardLabel, Metric } from "@/components/aura/GlassCard";
import { MapCard } from "@/components/aura/MapCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { chargers } from "@/data/mock";
import { useAura } from "@/state/AuraContext";

const ROUTE_PREFS = ["Fastest", "Most efficient", "Fewest stops", "Avoid tolls"];
const CHARGE_PREFS = ["Only if needed", "Always top up", "Arrive above 40%", "Home charging only"];

export default function JourneyPage() {
  const { state, dispatch, sendToVehicle } = useAura();
  const { journey, vehicle } = state;
  const [calculating, setCalculating] = useState(false);

  const patch = (payload) => dispatch({ type: "PATCH_JOURNEY", payload });

  const arrivalBattery = useMemo(
    () => Math.max(5, vehicle.battery - Math.round(journey.distance * 0.45)),
    [vehicle.battery, journey.distance]
  );

  const recalc = () => {
    setCalculating(true);
    window.setTimeout(() => {
      patch({
        duration: journey.routePreference === "Most efficient" ? 38 : 34,
        batteryAtDestination: arrivalBattery,
        sent: false,
      });
      setCalculating(false);
    }, 1100);
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Journey"
        title="Plan the route, not just the destination."
        description="AURA blends live traffic, your calendar and state of charge into a single departure time."
        actions={
          <span className="inline-flex items-center gap-2 rounded-full border border-foreground/10 px-3.5 py-2 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" strokeWidth={1.8} /> Updated 40 seconds ago
          </span>
        }
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-12">
        {/* ---------- planner form ---------- */}
        <GlassCard className="flex flex-col lg:col-span-5">
          <CardLabel>Route</CardLabel>

          <div className="mt-6 space-y-5">
            <div className="relative space-y-5 pl-8">
              <span className="absolute left-[9px] top-3 h-[calc(100%-28px)] w-px bg-foreground/15" />
              <span className="absolute left-1.5 top-2.5 h-2.5 w-2.5 rounded-full border-2 border-brand bg-background" />
              <span className="absolute bottom-2.5 left-1.5 h-2.5 w-2.5 rounded-full bg-primary" />
              <div>
                <Label htmlFor="from" className="text-xs text-muted-foreground">From</Label>
                <Input
                  id="from"
                  value={journey.from}
                  onChange={(e) => patch({ from: e.target.value, sent: false })}
                  className="mt-1.5 h-12 rounded-2xl border-foreground/10 bg-card/70 text-sm focus-visible:ring-brand"
                />
              </div>
              <div>
                <Label htmlFor="to" className="text-xs text-muted-foreground">To</Label>
                <Input
                  id="to"
                  value={journey.to}
                  onChange={(e) => patch({ to: e.target.value, sent: false })}
                  className="mt-1.5 h-12 rounded-2xl border-foreground/10 bg-card/70 text-sm focus-visible:ring-brand"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="depart" className="text-xs text-muted-foreground">Departure</Label>
                <Input
                  id="depart"
                  type="time"
                  value={journey.depart}
                  onChange={(e) => patch({ depart: e.target.value, sent: false })}
                  className="num mt-1.5 h-12 rounded-2xl border-foreground/10 bg-card/70 text-sm focus-visible:ring-brand"
                />
              </div>
              <div>
                <Label htmlFor="arrive" className="text-xs text-muted-foreground">Arrive by</Label>
                <Input
                  id="arrive"
                  type="time"
                  value={journey.arrive}
                  onChange={(e) => patch({ arrive: e.target.value, sent: false })}
                  className="num mt-1.5 h-12 rounded-2xl border-foreground/10 bg-card/70 text-sm focus-visible:ring-brand"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-xs text-muted-foreground">Route preference</Label>
                <Select
                  value={journey.routePreference}
                  onValueChange={(v) => patch({ routePreference: v, sent: false })}
                >
                  <SelectTrigger className="mt-1.5 h-12 rounded-2xl border-foreground/10 bg-card/70 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    {ROUTE_PREFS.map((p) => (
                      <SelectItem key={p} value={p} className="text-sm">
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Charging</Label>
                <Select
                  value={journey.chargePreference}
                  onValueChange={(v) => patch({ chargePreference: v, sent: false })}
                >
                  <SelectTrigger className="mt-1.5 h-12 rounded-2xl border-foreground/10 bg-card/70 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    {CHARGE_PREFS.map((p) => (
                      <SelectItem key={p} value={p} className="text-sm">
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="mt-auto flex flex-wrap gap-3 pt-8">
            <Button variant="hairline" size="lg" onClick={recalc} disabled={calculating}>
              {calculating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
              {calculating ? "Recalculating\u2026" : "Recalculate"}
            </Button>
            <Button variant="pill" size="lg" onClick={sendToVehicle} disabled={journey.sent}>
              {journey.sent ? <Check className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
              {journey.sent ? "Sent to vehicle" : "Send to Vehicle"}
            </Button>
          </div>
        </GlassCard>

        {/* ---------- summary + map ---------- */}
        <div className="flex flex-col gap-6 lg:col-span-7">
          <GlassCard delay={0.06}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <CardLabel>Summary</CardLabel>
                <h3 className="mt-2 text-lg font-medium text-foreground">
                  {journey.duration} min · {journey.distance} km
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Leaving {journey.depart} arrives {journey.arrive} · {journey.routePreference}
                </p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3.5 py-2 text-xs font-medium text-brand-strong">
                Traffic {journey.traffic} · +{journey.trafficDelta} min
              </span>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-6 border-t border-foreground/[0.08] pt-6 sm:grid-cols-4">
              <Metric value={journey.distance} unit="km" label="Distance" />
              <Metric value={journey.duration} unit="min" label="Drive time" />
              <Metric value={arrivalBattery} unit="%" label="Battery on arrival" />
              <Metric value={journey.chargeStop} label="Charging stop" />
            </div>
          </GlassCard>

          <MapCard
            delay={0.12}
            title="Route preview"
            subtitle={journey.to}
            height="min-h-[280px]"
            chargers
          />
        </div>
      </div>

      {/* ---------- alternatives ---------- */}
      <section className="mt-6 grid gap-6 md:grid-cols-3">
        {[
          { name: "Via 100 Ft Road", time: "34 min", detail: "9.4 km · arrives 78%", tag: "Recommended" },
          { name: "Via Inner Ring Road", time: "38 min", detail: "11.1 km · arrives 76%", tag: "Fewer signals" },
          { name: "Via Ejipura", time: "41 min", detail: "8.9 km · arrives 79%", tag: "Most efficient" },
        ].map((r, i) => (
          <motion.button
            key={r.name}
            type="button"
            onClick={() => patch({ duration: parseInt(r.time, 10), sent: false })}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col rounded-[28px] glass p-6 text-left transition-[transform,box-shadow] duration-500 ease-calm hover:-translate-y-1 hover:shadow-float"
          >
            <span className="text-[11px] uppercase tracking-[0.16em] text-brand-strong">{r.tag}</span>
            <p className="mt-3 text-base font-medium text-foreground">{r.name}</p>
            <p className="num mt-1 text-sm text-muted-foreground">{r.detail}</p>
            <span className="num mt-auto pt-6 text-2xl font-medium text-foreground">{r.time}</span>
          </motion.button>
        ))}
      </section>

      {/* ---------- charging along route ---------- */}
      <GlassCard className="mt-6 flex flex-col" delay={0.05}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <CardLabel>Charging along the way</CardLabel>
            <p className="mt-2 text-sm text-muted-foreground">
              Not required for this route — shown in case your plans change.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" /> 3 within 3 km
          </span>
        </div>
        <ul className="mt-6 grid gap-4 md:grid-cols-3">
          {chargers.map((c) => (
            <li key={c.id} className="flex flex-col rounded-3xl border border-foreground/[0.08] p-5">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-secondary">
                <Zap className="h-4 w-4" strokeWidth={1.7} />
              </span>
              <p className="mt-4 text-sm font-medium text-foreground">{c.name}</p>
              <p className="num mt-1 text-xs text-muted-foreground">
                {c.distance} · {c.power} · {c.price}
              </p>
              <span className="num mt-auto pt-4 text-xs text-brand-strong">{c.eta}</span>
            </li>
          ))}
        </ul>
      </GlassCard>
    </AppShell>
  );
}
