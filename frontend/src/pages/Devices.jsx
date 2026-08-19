import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Laptop, Loader2, RefreshCw, Smartphone, Watch } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard, CardLabel } from "@/components/aura/GlassCard";
import { DeviceCard } from "@/components/aura/DeviceCard";
import { WatchPreview } from "@/components/aura/WatchPreview";
import { PhonePreview } from "@/components/aura/PhonePreview";
import { NotificationCard } from "@/components/aura/Notifications";
import { Button } from "@/components/ui/button";
import { useAura } from "@/state/AuraContext";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    id: "s1",
    device: "Desktop",
    icon: Laptop,
    title: "“Plan my route to the office.”",
    detail: "AURA answers here and builds the route with live traffic.",
  },
  {
    id: "s2",
    device: "Phone",
    icon: Smartphone,
    title: "Route ready on your phone",
    detail: "Turn-by-turn handover, ready in your pocket.",
  },
  {
    id: "s3",
    device: "Watch",
    icon: Watch,
    title: "Leave in 8 min",
    detail: "A single glanceable nudge — no route detail needed.",
  },
];

export default function DevicesPage() {
  const { state, dispatch, notify, sendToVehicle } = useAura();
  const [active, setActive] = useState(-1);
  const [running, setRunning] = useState(false);

  const runContinuity = () => {
    if (running) return;
    setRunning(true);
    setActive(0);
    sendToVehicle();
    window.setTimeout(() => {
      setActive(1);
      notify({
        title: "Route ready on your phone",
        body: "Aura Labs · 34 min · open to continue.",
        kind: "journey",
      });
    }, 1200);
    window.setTimeout(() => {
      setActive(2);
      notify({ title: "Leave in 8 min", body: "Delivered to your watch.", kind: "schedule" });
      toast.success("Handover complete", { description: "Desktop → phone → watch" });
      setRunning(false);
    }, 2400);
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Devices"
        title="One product. Four screens."
        description="The vehicle, phone, watch and desktop share a single state. Act on one, and the rest catch up instantly."
        actions={
          <Button variant="pill" size="lg" onClick={runContinuity} disabled={running}>
            {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            {running ? "Handing over\u2026" : "Run continuity demo"}
          </Button>
        }
      />

      <section className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {state.devices.map((d, i) => (
          <DeviceCard key={d.id} device={d} delay={i * 0.06} />
        ))}
      </section>

      {/* continuity */}
      <section className="mt-6 grid gap-6 lg:grid-cols-12">
        <GlassCard className="flex flex-col lg:col-span-7">
          <CardLabel>Continuity</CardLabel>
          <h3 className="mt-2 text-lg font-medium text-foreground">
            An interaction that moves between devices
          </h3>
          <ol className="mt-7 space-y-3">
            {STEPS.map((s, i) => (
              <li key={s.id}>
                <div
                  className={cn(
                    "flex items-start gap-4 rounded-3xl border p-5 transition-[background-color,border-color,transform] duration-500 ease-calm",
                    active === i
                      ? "-translate-y-0.5 border-brand/40 bg-brand-soft/60"
                      : active > i
                        ? "border-foreground/[0.08] bg-card/50"
                        : "border-foreground/[0.08]"
                  )}
                >
                  <span
                    className={cn(
                      "grid h-10 w-10 shrink-0 place-items-center rounded-full",
                      active >= i && active !== -1
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-foreground"
                    )}
                  >
                    {active > i ? <Check className="h-4 w-4" /> : <s.icon className="h-4 w-4" strokeWidth={1.7} />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                      {s.device}
                    </p>
                    <p className="mt-1.5 text-sm font-medium text-foreground">{s.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{s.detail}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-auto pt-6 text-xs text-muted-foreground">
            Simulated with shared frontend state — no backend required.
          </p>
        </GlassCard>

        <GlassCard className="flex flex-col lg:col-span-5" delay={0.06}>
          <CardLabel>Delivered notifications</CardLabel>
          <div className="scrollbar-none mt-5 max-h-[430px] space-y-2.5 overflow-y-auto">
            <AnimatePresence initial={false}>
              {state.notifications.map((n) => (
                <NotificationCard
                  key={n.id}
                  item={n}
                  onDismiss={(id) => dispatch({ type: "DISMISS_NOTIFICATION", payload: id })}
                />
              ))}
            </AnimatePresence>
          </div>
        </GlassCard>
      </section>

      {/* device previews */}
      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <GlassCard className="flex flex-col items-center py-12">
          <div className="mb-8 w-full">
            <CardLabel>Smartwatch</CardLabel>
            <h3 className="mt-2 text-lg font-medium text-foreground">Glanceable, not miniature</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Three numbers, three actions, one nudge. Controls are live — tap them.
            </p>
          </div>
          <WatchPreview className="flex-1 justify-center" />
        </GlassCard>

        <GlassCard className="flex flex-col items-center py-12" delay={0.06}>
          <div className="mb-8 w-full">
            <CardLabel>Smartphone</CardLabel>
            <h3 className="mt-2 text-lg font-medium text-foreground">Built for thumbs</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Bottom navigation, battery first, AURA one tap away. Resize this window to try it.
            </p>
          </div>
          <PhonePreview />
        </GlassCard>
      </section>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-10 text-center text-xs text-muted-foreground"
      >
        AURA Mobility is a fictional product. Vehicle data, devices and notifications are mock data.
      </motion.p>
    </AppShell>
  );
}
