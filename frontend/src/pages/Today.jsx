import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CloudSun, Mic, Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { HeroVehicle } from "@/components/aura/HeroVehicle";
import { QuickActions } from "@/components/aura/QuickActions";
import { AssistantPanel } from "@/components/aura/AssistantPanel";
import { DayTimeline } from "@/components/aura/DayTimeline";
import { MapCard } from "@/components/aura/MapCard";
import { VehicleStatusCard } from "@/components/aura/VehicleStatusCard";
import { ProactiveCard } from "@/components/aura/ProactiveCard";
import { GlassCard, CardLabel } from "@/components/aura/GlassCard";
import { BatteryRing } from "@/components/aura/BatteryRing";
import { Button } from "@/components/ui/button";
import { useAura } from "@/state/AuraContext";

const StatusPill = ({ children }) => (
  <span className="rounded-full border border-foreground/10 bg-card/60 px-3.5 py-1.5 text-xs text-muted-foreground">
    {children}
  </span>
);

export default function TodayPage() {
  const navigate = useNavigate();
  const { state, startDay, scheduleCharging, sendToVehicle } = useAura();
  const { vehicle, user, weather, dayStarted } = state;

  return (
    <AppShell hideAssistantFab>
      {/* ================= HERO ================= */}
      <section className="relative" aria-label="Today overview">
        {/* vertical quick-action rail (large screens) */}
        <div className="absolute left-0 top-1/2 z-20 hidden -translate-y-1/2 xl:block">
          <QuickActions orientation="rail" />
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-12 xl:pl-24">
          <div className="lg:col-span-4">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground"
            >
              Wednesday 14 February · 08:04
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="mt-4 text-4xl font-medium leading-[1.02] text-foreground sm:text-5xl lg:text-6xl"
            >
              Good morning,
              <br />
              {user.name}.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground md:text-lg"
            >
              Here's how your day is looking. Traffic is heavier than usual, so I've
              moved your departure to 08:12.
            </motion.p>

            <div className="mt-7 flex flex-wrap gap-2">
              <StatusPill>{vehicle.name}</StatusPill>
              <StatusPill>{vehicle.colour}</StatusPill>
              <StatusPill>
                <span className="num">{vehicle.battery}%</span> ·{" "}
                <span className="num">{vehicle.range} km</span>
              </StatusPill>
              <StatusPill>
                <CloudSun className="mr-1 inline h-3.5 w-3.5" strokeWidth={1.8} />
                {weather.temp}°C {weather.condition}
              </StatusPill>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button
                variant={dayStarted ? "hairline" : "pill"}
                size="xl"
                onClick={startDay}
                disabled={dayStarted}
              >
                {dayStarted ? "Day in progress" : "Start my day"}
                {!dayStarted && <ArrowRight className="h-4 w-4" />}
              </Button>
              <Button variant="glass" size="xl" onClick={() => navigate("/assistant")}>
                <Mic className="h-4 w-4" /> Ask AURA
              </Button>
            </div>
          </div>

          <div className="relative lg:col-span-8">
            <HeroVehicle className="mx-auto w-full max-w-[820px]" />

            {/* floating range chip on the vehicle */}
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute bottom-6 left-2 hidden items-center gap-3 rounded-full glass px-4 py-2.5 sm:flex"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-brand animate-pulse-ring" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-strong" />
              </span>
              <span className="text-xs text-muted-foreground">
                {vehicle.status} · cabin{" "}
                <span className="num text-foreground">{vehicle.cabinTemp}°C</span>
              </span>
            </motion.div>

            {/* desktop floating assistant — overlaps the vehicle like the reference */}
            <div className="absolute -right-2 top-0 hidden w-[366px] xl:block">
              <AssistantPanel />
            </div>
          </div>
        </div>

        {/* quick actions + assistant for small / medium screens */}
        <div className="mt-10 grid gap-6 xl:hidden">
          <GlassCard className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex items-center gap-5">
              <BatteryRing value={vehicle.battery} range={vehicle.range} size={96} charging={vehicle.charging} />
              <div>
                <CardLabel>Vehicle</CardLabel>
                <p className="mt-1.5 text-base font-medium text-foreground">{vehicle.name}</p>
                <p className="text-xs text-muted-foreground">
                  {vehicle.locked ? "Locked" : "Unlocked"} · {vehicle.location}
                </p>
              </div>
            </div>
            <QuickActions orientation="grid" className="sm:ml-auto sm:grid-cols-6" />
          </GlassCard>
          <AssistantPanel />
        </div>
      </section>

      {/* ================= FLOATING CARDS ================= */}
      <section className="mt-16 grid gap-6 lg:grid-cols-12" aria-label="Day, location and vehicle">
        <DayTimeline className="lg:col-span-5" delay={0.05} />
        <MapCard className="lg:col-span-4" delay={0.12} subtitle="5th Block, Koramangala" />
        <VehicleStatusCard className="lg:col-span-3" delay={0.19} compact />
      </section>

      {/* ================= PROACTIVE AI ================= */}
      <section className="mt-6 grid gap-6 lg:grid-cols-2" aria-label="AURA recommendations">
        <ProactiveCard
          lines={[
            "Your first meeting starts in 45 minutes.",
            "Traffic on Sarjapur Road has increased by 12 minutes. Leaving at 08:12 still gets you there by 08:46.",
          ]}
          cta="Start navigation"
          onCta={sendToVehicle}
          secondaryCta="Open journey"
          onSecondary={() => navigate("/journey")}
          delay={0.05}
        />
        <ProactiveCard
          eyebrow="Learned pattern"
          lines={[
            "You usually charge on Wednesday evenings.",
            `Battery will be at ${Math.max(0, vehicle.battery - 21)}% when you get home. Off-peak tariff starts at 23:30 · ₹6.4/kWh.`,
          ]}
          cta={state.chargingScheduled ? "Charging scheduled" : "Schedule charging"}
          onCta={scheduleCharging}
          secondaryCta="Find a charger"
          onSecondary={() => navigate("/vehicle?tab=charging")}
          delay={0.12}
        />
      </section>

      {/* ================= CONTINUITY STRIP ================= */}
      <section className="mt-6">
        <GlassCard className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-soft text-brand-strong">
              <Sparkles className="h-4 w-4" strokeWidth={1.8} />
            </span>
            <div>
              <CardLabel>Continuity</CardLabel>
              <p className="mt-1 text-sm text-foreground">
                Everything you do here appears on your phone, watch and vehicle.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 md:ml-auto">
            {state.devices.map((d) => (
              <span
                key={d.id}
                className="inline-flex items-center gap-2 rounded-full border border-foreground/10 px-3 py-1.5 text-xs text-muted-foreground"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                {d.name}
              </span>
            ))}
            <Button variant="hairline" size="lg" onClick={() => navigate("/devices")}>
              View devices
            </Button>
          </div>
        </GlassCard>
      </section>
    </AppShell>
  );
}
