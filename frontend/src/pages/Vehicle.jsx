import React from "react";
import { useSearchParams } from "react-router-dom";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
} from "recharts";
import { CircleDot, Fan, Gauge, Snowflake, Sun, Wrench, Zap } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard, CardLabel, Metric } from "@/components/aura/GlassCard";
import { BatteryRing, BatteryBar } from "@/components/aura/BatteryRing";
import { QuickActions } from "@/components/aura/QuickActions";
import { HeroVehicle } from "@/components/aura/HeroVehicle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { chargers, energyTrend, healthSeed, SIDE_VEHICLE_IMG, CHARGING_IMG } from "@/data/mock";
import { useAura } from "@/state/AuraContext";

const TABS = [
  { value: "overview", label: "Overview" },
  { value: "health", label: "Health" },
  { value: "charging", label: "Charging" },
  { value: "climate", label: "Climate" },
];

export default function VehiclePage() {
  const [params, setParams] = useSearchParams();
  const tab = TABS.some((t) => t.value === params.get("tab")) ? params.get("tab") : "overview";
  const {
    state,
    toggleCharge,
    toggleClimate,
    toggleLights,
    setChargeLimit,
    setClimateTemp,
    scheduleCharging,
  } = useAura();
  const { vehicle, pendingAction, chargingScheduled } = state;

  return (
    <AppShell>
      <PageHeader
        eyebrow="Vehicle"
        title={vehicle.name}
        description={`${vehicle.trim} · ${vehicle.colour} · ${vehicle.software}`}
        actions={
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3.5 py-2 text-xs font-medium text-brand-strong">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-strong" /> {vehicle.status}
            </span>
            <Button variant="hairline" size="lg" onClick={toggleLights} disabled={pendingAction === "lights"}>
              {vehicle.lightsOn ? "Lights off" : "Flash lights"}
            </Button>
          </div>
        }
      />

      <Tabs
        value={tab}
        onValueChange={(v) => setParams(v === "overview" ? {} : { tab: v })}
        className="mt-10"
      >
        <TabsList className="h-auto rounded-full bg-foreground/[0.04] p-1">
          {TABS.map((t) => (
            <TabsTrigger
              key={t.value}
              value={t.value}
              className="rounded-full px-5 py-2 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none"
            >
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ---------------- OVERVIEW ---------------- */}
        <TabsContent value="overview" className="mt-8 focus-visible:outline-none">
          <div className="grid gap-6 lg:grid-cols-12">
            <GlassCard className="lg:col-span-7">
              <div className="flex items-start justify-between">
                <div>
                  <CardLabel>Live status</CardLabel>
                  <h3 className="mt-2 text-lg font-medium">Everything looks good</h3>
                </div>
                <QuickActions orientation="grid" className="grid-cols-3" only={["lockToggle", "climate", "locate"]} />
              </div>
              <HeroVehicle src={SIDE_VEHICLE_IMG} brightness={1.2} className="mx-auto mt-2 w-full max-w-[560px]" alt="AURA E7 side profile" />
              <div className="grid grid-cols-2 gap-6 border-t border-foreground/[0.08] pt-6 sm:grid-cols-4">
                <Metric value={vehicle.battery} unit="%" label="Battery" />
                <Metric value={vehicle.range} unit="km" label="Range" />
                <Metric value={vehicle.efficiency} unit="km/kWh" label="Efficiency" />
                <Metric value={vehicle.odometer.toLocaleString()} unit="km" label="Odometer" />
              </div>
            </GlassCard>

            <div className="flex flex-col gap-6 lg:col-span-5">
              <GlassCard className="flex items-center gap-6" delay={0.06}>
                <BatteryRing value={vehicle.battery} range={vehicle.range} charging={vehicle.charging} />
                <div className="flex-1 space-y-4">
                  <div>
                    <CardLabel>Energy</CardLabel>
                    <p className="mt-1.5 text-sm text-muted-foreground">
                      Enough for today's 42 km with{" "}
                      <span className="num text-foreground">{Math.max(0, vehicle.battery - 21)}%</span> left.
                    </p>
                  </div>
                  <BatteryBar value={vehicle.chargeLimit} label="Charge limit" />
                </div>
              </GlassCard>

              <GlassCard className="flex flex-col" delay={0.12}>
                <CardLabel>Last 7 days</CardLabel>
                <div className="mt-4 h-[168px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={energyTrend} margin={{ top: 6, right: 4, bottom: 0, left: 4 }}>
                      <defs>
                        <linearGradient id="kwh" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(var(--brand))" stopOpacity={0.35} />
                          <stop offset="100%" stopColor="hsl(var(--brand))" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                      />
                      <RTooltip
                        contentStyle={{
                          borderRadius: 16,
                          border: "1px solid hsl(var(--border))",
                          background: "hsl(var(--card))",
                          fontSize: 12,
                        }}
                        formatter={(v, n) => [n === "kwh" ? `${v} kWh` : `${v} km`, n === "kwh" ? "Energy" : "Distance"]}
                      />
                      <Area
                        type="monotone"
                        dataKey="kwh"
                        stroke="hsl(var(--brand))"
                        strokeWidth={2}
                        fill="url(#kwh)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <p className="mt-auto pt-2 text-xs text-muted-foreground">
                  52.8 kWh used · 318 km driven · 6.1 km/kWh average
                </p>
              </GlassCard>
            </div>
          </div>
        </TabsContent>

        {/* ---------------- HEALTH ---------------- */}
        <TabsContent value="health" className="mt-8 focus-visible:outline-none">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {healthSeed.map((item, i) => (
              <GlassCard key={item.id} className="flex flex-col" delay={i * 0.05}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardLabel>{item.label}</CardLabel>
                    <p className="mt-2 text-lg font-medium text-foreground">{item.state}</p>
                  </div>
                  <span className="num text-sm text-muted-foreground">{item.value}%</span>
                </div>
                <Progress
                  value={item.value}
                  className="mt-5 h-1.5 bg-foreground/[0.08] [&>div]:bg-brand"
                />
                <p className="mt-auto pt-5 text-xs text-muted-foreground">{item.detail}</p>
              </GlassCard>
            ))}
            <GlassCard className="flex flex-col md:col-span-2 xl:col-span-3" delay={0.3}>
              <div className="flex flex-col gap-6 md:flex-row md:items-center">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-secondary">
                  <Wrench className="h-5 w-5" strokeWidth={1.6} />
                </span>
                <div className="flex-1">
                  <p className="text-base font-medium text-foreground">
                    AURA OS 4.3.0 is ready to install
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Improved route-aware preconditioning and faster charging curve. 1.2 GB · 22 min.
                    Best installed tonight while parked at home.
                  </p>
                </div>
                <Button variant="pill" size="lg" className="mt-auto md:mt-0" onClick={scheduleCharging}>
                  Install tonight
                </Button>
              </div>
            </GlassCard>
          </div>
        </TabsContent>

        {/* ---------------- CHARGING ---------------- */}
        <TabsContent value="charging" className="mt-8 focus-visible:outline-none">
          <div className="grid gap-6 lg:grid-cols-12">
            <GlassCard className="flex flex-col lg:col-span-5">
              <CardLabel>Charging</CardLabel>
              <div className="mt-5 flex items-center gap-6">
                <BatteryRing value={vehicle.battery} range={vehicle.range} charging={vehicle.charging} />
                <div className="space-y-1">
                  <p className="num text-2xl font-medium text-foreground">
                    {vehicle.charging ? "180 kW" : "Idle"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {vehicle.charging ? "80% in 18 minutes" : "Not connected"}
                  </p>
                  <p className="text-xs text-muted-foreground">Est. cost ₹412 · 22.3 kWh</p>
                </div>
              </div>

              <div className="mt-8">
                <div className="mb-3 flex items-baseline justify-between">
                  <Label className="text-sm text-muted-foreground">Charge limit</Label>
                  <span className="num text-sm font-medium">{vehicle.chargeLimit}%</span>
                </div>
                <Slider
                  value={[vehicle.chargeLimit]}
                  min={50}
                  max={100}
                  step={5}
                  onValueChange={([v]) => setChargeLimit(v)}
                  aria-label="Charge limit"
                />
              </div>

              <div className="mt-8 flex flex-wrap gap-3 pt-2">
                <Button variant="pill" size="lg" onClick={toggleCharge} disabled={pendingAction === "charge"}>
                  <Zap className="h-4 w-4" />
                  {pendingAction === "charge"
                    ? "Working\u2026"
                    : vehicle.charging
                      ? "Stop charging"
                      : "Start charging"}
                </Button>
                <Button variant="hairline" size="lg" onClick={scheduleCharging} disabled={chargingScheduled}>
                  {chargingScheduled ? "Scheduled 23:30" : "Schedule for 23:30"}
                </Button>
              </div>

              <img
                src={CHARGING_IMG}
                alt="AURA E7 charging port with illuminated ring"
                loading="lazy"
                className="mt-8 h-40 w-full rounded-3xl object-cover"
              />
            </GlassCard>

            <div className="flex flex-col gap-6 lg:col-span-7">
              <GlassCard delay={0.06}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardLabel>Smart charging</CardLabel>
                    <h3 className="mt-2 text-lg font-medium">Planned around your calendar</h3>
                  </div>
                  <span className="rounded-full bg-brand-soft px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] text-brand-strong">
                    Off-peak
                  </span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Tomorrow's airport drop needs 240 km. AURA will start charging at 23:30 and stop
                  at {vehicle.chargeLimit}% — ready by 04:10, at the cheapest tariff of the night.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-4">
                  <Metric value="23:30" label="Starts" />
                  <Metric value="04:10" label="Ready" />
                  <Metric value="₹6.4" unit="/kWh" label="Tariff" />
                  <Metric value="11" unit="kW" label="Home wallbox" />
                </div>
              </GlassCard>

              <GlassCard className="flex flex-col" delay={0.12}>
                <CardLabel>Nearby chargers</CardLabel>
                <ul className="mt-5 divide-y divide-foreground/[0.07]">
                  {chargers.map((c) => (
                    <li key={c.id} className="flex flex-wrap items-center gap-4 py-4 first:pt-0 last:pb-0">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary">
                        <Zap className="h-4 w-4" strokeWidth={1.7} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">{c.name}</p>
                        <p className="num text-xs text-muted-foreground">
                          {c.distance} · {c.power} · {c.available} · {c.price}
                        </p>
                      </div>
                      <span className="num text-xs text-muted-foreground">{c.eta}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </div>
          </div>
        </TabsContent>

        {/* ---------------- CLIMATE ---------------- */}
        <TabsContent value="climate" className="mt-8 focus-visible:outline-none">
          <div className="grid gap-6 lg:grid-cols-12">
            <GlassCard className="flex flex-col lg:col-span-5">
              <CardLabel>Cabin</CardLabel>
              <div className="mt-6 flex items-end gap-2">
                <span className="num text-6xl font-light leading-none text-foreground">
                  {vehicle.cabinTemp}
                </span>
                <span className="mb-2 text-xl text-muted-foreground">°C</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Outside {vehicle.outsideTemp}°C · {vehicle.climateOn ? "Conditioning" : "Standby"}
              </p>
              <Slider
                value={[vehicle.cabinTemp]}
                min={16}
                max={28}
                step={1}
                onValueChange={([v]) => setClimateTemp(v)}
                aria-label="Cabin temperature"
                className="mt-8"
              />
              <div className="mt-3 flex justify-between text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Snowflake className="h-3 w-3" /> 16°
                </span>
                <span className="inline-flex items-center gap-1">
                  <Sun className="h-3 w-3" /> 28°
                </span>
              </div>
              <Button
                variant={vehicle.climateOn ? "hairline" : "pill"}
                size="lg"
                className="mt-auto w-full justify-center pt-0"
                onClick={toggleClimate}
                disabled={pendingAction === "climate"}
              >
                <Fan className="h-4 w-4" />
                {pendingAction === "climate"
                  ? "Working\u2026"
                  : vehicle.climateOn
                    ? "Stop climate"
                    : "Precondition now"}
              </Button>
            </GlassCard>

            <GlassCard className="flex flex-col lg:col-span-7" delay={0.06}>
              <CardLabel>Comfort routines</CardLabel>
              <div className="mt-5 space-y-1">
                {[
                  { id: "r1", label: "Precondition before calendar departures", detail: "Starts 8 min before you leave", on: true },
                  { id: "r2", label: "Seat heating on cold mornings", detail: "Below 18°C outside", on: false },
                  { id: "r3", label: "Cabin cooling while parked in sun", detail: "Keeps cabin under 30°C", on: true },
                  { id: "r4", label: "Air purification in heavy traffic", detail: "Uses live AQI", on: true },
                ].map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center gap-4 border-b border-foreground/[0.07] py-4 last:border-0"
                  >
                    <CircleDot className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.6} />
                    <div className="min-w-0 flex-1">
                      <Label htmlFor={r.id} className="text-sm font-medium text-foreground">
                        {r.label}
                      </Label>
                      <p className="mt-0.5 text-xs text-muted-foreground">{r.detail}</p>
                    </div>
                    <Switch id={r.id} defaultChecked={r.on} className="data-[state=checked]:bg-brand" />
                  </div>
                ))}
              </div>
              <div className="mt-auto flex items-center gap-3 pt-6 text-xs text-muted-foreground">
                <Gauge className="h-4 w-4" strokeWidth={1.6} />
                Preconditioning uses about 1.2% of battery per session.
              </div>
            </GlassCard>
          </div>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
