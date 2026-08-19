import React from "react";
import {
  BatteryCharging,
  CalendarClock,
  CloudSun,
  Lock,
  MapPinned,
  Mic,
  Route,
  Volume2,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { AssistantPanel } from "@/components/aura/AssistantPanel";
import { GlassCard, CardLabel } from "@/components/aura/GlassCard";
import { suggestionChips } from "@/data/mock";

const SIGNALS = [
  { icon: BatteryCharging, label: "Vehicle telemetry", detail: "Charge, range, locks, climate" },
  { icon: CalendarClock, label: "Calendar", detail: "Meetings, travel, reminders" },
  { icon: Route, label: "Navigation", detail: "Live traffic and ETAs" },
  { icon: MapPinned, label: "Location", detail: "Vehicle and destinations" },
  { icon: CloudSun, label: "Weather", detail: "Conditions along your route" },
  { icon: Lock, label: "Security", detail: "Lock state and alerts" },
];

const VOICE_STATES = [
  { state: "Idle", copy: "“Ask AURA”" },
  { state: "Listening", copy: "“I'm listening…” with live waveform" },
  { state: "Processing", copy: "“Thinking…”" },
  { state: "Responding", copy: "Speech synthesis + playback indicator" },
  { state: "Error", copy: "“Sorry, I didn't catch that.” · Try again" },
];

export default function AssistantPage() {
  return (
    <AppShell hideAssistantFab>
      <PageHeader
        eyebrow="Assistant"
        title="Talk to AURA."
        description="Voice or text. AURA reads your vehicle, calendar, route and charging together — then acts on it."
        actions={
          <span className="inline-flex items-center gap-2 rounded-full border border-foreground/10 px-3.5 py-2 text-xs text-muted-foreground">
            <Volume2 className="h-3.5 w-3.5" strokeWidth={1.8} /> Speech in and out, on device
          </span>
        }
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <AssistantPanel variant="full" chipCount={9} className="min-h-[560px]" />
        </div>

        <div className="flex flex-col gap-6 lg:col-span-5">
          <GlassCard className="flex flex-col">
            <CardLabel>What AURA can hear</CardLabel>
            <ul className="mt-5 grid gap-2.5">
              {suggestionChips.map((c) => (
                <li
                  key={c}
                  className="flex items-center gap-3 rounded-2xl border border-foreground/[0.08] px-4 py-3 text-sm text-foreground"
                >
                  <Mic className="h-3.5 w-3.5 shrink-0 text-muted-foreground" strokeWidth={1.8} />
                  “{c}”
                </li>
              ))}
            </ul>
          </GlassCard>

          <GlassCard className="flex flex-col" delay={0.06}>
            <CardLabel>Voice states</CardLabel>
            <ul className="mt-5 divide-y divide-foreground/[0.07]">
              {VOICE_STATES.map((v) => (
                <li key={v.state} className="flex items-baseline gap-4 py-3 first:pt-0 last:pb-0">
                  <span className="w-24 shrink-0 text-xs font-medium uppercase tracking-[0.14em] text-brand-strong">
                    {v.state}
                  </span>
                  <span className="flex-1 text-sm text-muted-foreground">{v.copy}</span>
                </li>
              ))}
            </ul>
          </GlassCard>
        </div>
      </div>

      <section className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {SIGNALS.map((s, i) => (
          <GlassCard key={s.label} className="flex flex-col" delay={i * 0.05}>
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-secondary text-foreground">
              <s.icon className="h-5 w-5" strokeWidth={1.6} />
            </span>
            <h3 className="mt-5 text-base font-medium text-foreground">{s.label}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{s.detail}</p>
            <p className="mt-auto pt-6 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              Mock data · API ready
            </p>
          </GlassCard>
        ))}
      </section>
    </AppShell>
  );
}
