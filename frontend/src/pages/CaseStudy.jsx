import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { AuraLogo } from "@/components/aura/AuraLogo";
import { GlassCard, CardLabel } from "@/components/aura/GlassCard";
import { HeroVehicle } from "@/components/aura/HeroVehicle";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SIDE_VEHICLE_IMG } from "@/data/mock";

const Section = ({ eyebrow, title, children, className }) => (
  <motion.section
    initial={{ opacity: 0, y: 18 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    className={`border-t border-foreground/[0.08] py-16 md:py-24 ${className || ""}`}
  >
    <div className="grid gap-10 md:grid-cols-12">
      <div className="md:col-span-4">
        {eyebrow && (
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {eyebrow}
          </p>
        )}
        <h2 className="mt-3 text-2xl font-medium leading-tight text-foreground sm:text-3xl">
          {title}
        </h2>
      </div>
      <div className="md:col-span-8">{children}</div>
    </div>
  </motion.section>
);

const Prose = ({ children }) => (
  <div className="max-w-2xl space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
    {children}
  </div>
);

const Bullets = ({ items }) => (
  <ul className="mt-6 grid gap-3 sm:grid-cols-2">
    {items.map((i) => (
      <li
        key={i}
        className="rounded-2xl border border-foreground/[0.08] bg-card/50 px-4 py-3 text-sm text-foreground"
      >
        {i}
      </li>
    ))}
  </ul>
);

const SWATCHES = [
  { name: "Canvas", value: "#F6F6F4", className: "bg-background" },
  { name: "Ink", value: "#111111", className: "bg-primary" },
  { name: "Secondary ink", value: "#6F6F6F", className: "bg-muted-foreground" },
  { name: "Accent", value: "#6F8F84", className: "bg-brand" },
  { name: "Accent strong", value: "#4A6B5E", className: "bg-brand-strong" },
  { name: "Glass", value: "rgba(255,255,255,.6)", className: "glass" },
];

export default function CaseStudyPage() {
  return (
    <div className="relative min-h-screen bg-background">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[34vh] ambient opacity-60" />
      <div aria-hidden="true" className="grain pointer-events-none absolute inset-0" />

      <header className="sticky top-0 z-40 px-4 pt-4 sm:px-8 sm:pt-6">
        <nav className="mx-auto flex max-w-[1200px] items-center gap-4 rounded-full glass px-5 py-2.5">
          <Link to="/" aria-label="Back to AURA Mobility">
            <AuraLogo />
          </Link>
          <span className="hidden text-xs uppercase tracking-[0.18em] text-muted-foreground sm:inline">
            Case study
          </span>
          <Button asChild variant="pill" size="lg" className="ml-auto">
            <Link to="/">
              Open the product <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </nav>
      </header>

      <main className="relative mx-auto w-full max-w-[1200px] px-4 pb-28 pt-14 sm:px-8">
        {/* hero */}
        <div className="grid items-center gap-10 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Frontend engineering · Product UX · 2026
            </p>
            <h1 className="mt-5 text-4xl font-medium leading-[1.03] text-foreground sm:text-5xl lg:text-6xl">
              AURA Mobility
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-lg">
              An intelligent automotive companion that spans vehicle, phone, watch and desktop —
              designed and built as one continuous product, not four disconnected apps.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {["React", "Component architecture", "Framer Motion", "Design tokens", "Web Speech API", "Responsive", "Accessibility"].map(
                (t) => (
                  <span
                    key={t}
                    className="rounded-full border border-foreground/10 bg-card/60 px-3.5 py-1.5 text-xs text-muted-foreground"
                  >
                    {t}
                  </span>
                )
              )}
            </div>
          </div>
          <div className="md:col-span-6">
            <HeroVehicle className="w-full" />
          </div>
        </div>

        <Section eyebrow="01 · Overview" title="A companion that understands the day, not just the car.">
          <Prose>
            <p>
              Most connected-car apps are remote controls: a lock button, a battery percentage, a
              map. AURA Mobility starts from the opposite end — the user's day — and works backwards
              to the vehicle.
            </p>
            <p>
              The product reads schedule, traffic, weather, location and state of charge, then
              produces a single decision: when to leave, and what the car should do about it.
            </p>
          </Prose>
          <Bullets
            items={[
              "4 device experiences, 1 shared state",
              "14 reusable components",
              "Voice in and voice out, in-browser",
              "Zero external APIs required",
            ]}
          />
        </Section>

        <Section eyebrow="02 · Problem" title="Information without a decision is noise.">
          <Prose>
            <p>
              Drivers already have the data — calendar in one app, traffic in another, charge level in
              a third. The cognitive work of joining them up is left to the human, usually while
              running late.
            </p>
            <p>
              The design problem: how do you compress five sources into one sentence a person can act
              on in under two seconds, glanceable on a watch and expandable on a desktop?
            </p>
          </Prose>
        </Section>

        <Section eyebrow="03 · Concept" title="Proactive, not conversational.">
          <Prose>
            <p>
              AURA speaks first. “Traffic is heavier than usual — leave at 08:12 and you'll arrive at
              08:46. Your 82% charge covers the whole day.” One CTA: <em>Start my day</em>.
            </p>
            <p>
              The chat interface exists, but it is the fallback, not the product. The intelligence is
              expressed as cards and recommendations that already contain the answer.
            </p>
          </Prose>
          <Bullets
            items={[
              "Proactive cards with a single primary action",
              "Learned patterns (“you usually charge on Wednesdays”)",
              "Vehicle state folded into the timeline",
              "Voice as an accelerator, not a gimmick",
            ]}
          />
        </Section>

        <Section eyebrow="04 · User" title="Arjun, 34 · five stops a day.">
          <Prose>
            <p>
              Works hybrid in Bengaluru, drives an EV, lives inside his calendar. He does not want to
              open an app — he wants the right nudge at the right moment on whichever screen is
              closest.
            </p>
            <p>
              Desktop for planning in the morning. Phone in transit. Watch when his hands are
              occupied. The vehicle for everything in between.
            </p>
          </Prose>
        </Section>

        <Section eyebrow="05 · Design direction" title="Editorial white, black type, glass depth.">
          <Prose>
            <p>
              A near-white canvas (#F6F6F4) with near-black type keeps the vehicle render as the only
              real image on screen. Depth comes from translucency and shadow rather than colour.
            </p>
            <p>
              A single restrained accent — muted sage green — carries status, progress and route. No
              rainbow dashboards, no decorative gradients.
            </p>
          </Prose>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {SWATCHES.map((s) => (
              <div key={s.name} className="rounded-3xl border border-foreground/[0.08] p-4">
                <div className={`h-16 w-full rounded-2xl border border-foreground/[0.06] ${s.className}`} />
                <p className="mt-3 text-sm font-medium text-foreground">{s.name}</p>
                <p className="num text-xs text-muted-foreground">{s.value}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section eyebrow="06 · Ecosystem" title="Four contexts, one mental model.">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { d: "Vehicle", role: "The physical environment. Everything else serves it." },
              { d: "Phone", role: "Full control in transit. Bottom navigation, thumb-first." },
              { d: "Watch", role: "Three numbers, three actions, one nudge." },
              { d: "Desktop", role: "Planning surface: day, journeys, health, deep AI." },
            ].map((x) => (
              <GlassCard key={x.d} className="flex flex-col">
                <CardLabel>{x.d}</CardLabel>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{x.role}</p>
              </GlassCard>
            ))}
          </div>
        </Section>

        <Section eyebrow="07 · IA & flows" title="Five destinations. Nothing buried.">
          <Prose>
            <p>
              Today · Vehicle · Journey · Assistant · Devices. Every vehicle action is reachable in one
              tap from any screen through the persistent quick-action rail or the assistant.
            </p>
          </Prose>
          <Accordion type="single" collapsible className="mt-8">
            {[
              {
                q: "Morning flow",
                a: "Open Today → read AURA's recommendation → Start my day → cabin preconditions, route loads, watch shows “Leave in 8 min”.",
              },
              {
                q: "Voice flow",
                a: "Tap mic → listening waveform → transcription → processing → spoken answer plus an actionable card. Errors offer Try again and always fall back to typing.",
              },
              {
                q: "Continuity flow",
                a: "Ask on desktop → notification says “Route ready on your phone” → watch reduces it to a departure nudge. All three read the same store.",
              },
              {
                q: "Charging flow",
                a: "AURA detects a learned pattern and tomorrow's range need → proposes 23:30 off-peak → one tap schedules it and notifies every device.",
              },
            ].map((f) => (
              <AccordionItem key={f.q} value={f.q} className="border-foreground/[0.08]">
                <AccordionTrigger className="text-sm font-medium hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Section>

        <Section eyebrow="08 · Design system" title="Tokens first, components second.">
          <Prose>
            <p>
              Every colour, shadow, radius and easing curve is an HSL design token in a single
              stylesheet, consumed through Tailwind. Components never hardcode colour, so light and
              dark themes are one token switch apart.
            </p>
          </Prose>
          <Bullets
            items={[
              "Semantic tokens: background, foreground, brand, muted, warning",
              "Glass recipe: 60% white, 24px blur, 1px light border, low-opacity shadow",
              "Button variants: pill, brand, glass, hairline, quiet",
              "Motion: 0.45–0.8s, cubic-bezier(0.22, 1, 0.36, 1), no bounce",
            ]}
          />
        </Section>

        <Section eyebrow="09 · Glassmorphism" title="Depth used with restraint.">
          <Prose>
            <p>
              Glass is reserved for floating, contextual layers: the assistant, quick actions,
              vehicle status, notifications, planner and watch cards. The canvas itself stays opaque
              so type never fights a blurred backdrop.
            </p>
          </Prose>
          <div className="relative mt-8 overflow-hidden rounded-[32px] border border-foreground/[0.08] bg-background-deep p-8">
            <img
              src={SIDE_VEHICLE_IMG}
              alt="AURA E7 behind layered glass panels"
              loading="lazy"
              className="mx-auto h-40 w-full max-w-md object-contain mix-blend-multiply"
              style={{ filter: "brightness(1.2) contrast(1.03)" }}
            />
            <div className="absolute left-6 top-6 rounded-3xl glass px-5 py-4">
              <CardLabel>Glass 60%</CardLabel>
              <p className="num mt-1 text-lg font-medium">blur 24px</p>
            </div>
            <div className="absolute bottom-6 right-6 rounded-3xl glass-strong px-5 py-4">
              <CardLabel>Glass 78%</CardLabel>
              <p className="num mt-1 text-lg font-medium">blur 30px</p>
            </div>
          </div>
        </Section>

        <Section eyebrow="10 · Responsive" title="Redesigned, not reflowed.">
          <Prose>
            <p>
              Desktop is editorial and spacious with an overlapping assistant panel. Tablet collapses
              to two columns and moves the assistant inline. Mobile becomes a single column with
              bottom navigation and a persistent “Ask AURA” action that opens a sheet. The watch is a
              purpose-built 246×290 surface.
            </p>
          </Prose>
        </Section>

        <Section eyebrow="11 · Voice" title="Web Speech, with graceful degradation.">
          <Prose>
            <p>
              A <code>useVoice</code> hook wraps SpeechRecognition and speechSynthesis, exposing
              five explicit states: idle, listening, processing, responding, error. Interim results
              stream into the transcript; a calm waveform reflects input level.
            </p>
            <p>
              Where the browser has no recognition support, the mic surfaces an inline explanation
              and typing takes over — the feature never becomes a dead end.
            </p>
          </Prose>
        </Section>

        <Section eyebrow="12 · Architecture" title="API-ready by construction.">
          <Prose>
            <p>
              A reducer-backed context owns vehicle, schedule, journey, notifications, devices and
              assistant state, with localStorage persistence. Every vehicle command flows through one
              async pipeline that produces pending → success states, a toast and a notification.
            </p>
            <p>
              Mock data lives behind a single module and the intent engine has an async-friendly
              signature, so swapping in telemetry, calendar or LLM endpoints touches no component.
            </p>
          </Prose>
          <Bullets
            items={[
              "state/AuraContext · single source of truth",
              "lib/assistant · intent resolution, swappable for an LLM",
              "hooks/useVoice · browser speech abstraction",
              "data/mock · the only place fixtures exist",
            ]}
          />
        </Section>

        <Section eyebrow="13 · Accessibility" title="Status never depends on colour alone.">
          <Bullets
            items={[
              "Semantic landmarks, lists and ordered timelines",
              "Visible focus rings on the accent colour",
              "ARIA labels on every icon-only control",
              "aria-live regions for assistant state",
              "prefers-reduced-motion honoured globally",
              "WCAG AA contrast on all text",
            ]}
          />
        </Section>

        <Section eyebrow="14 · Next" title="Where it goes from here.">
          <Bullets
            items={[
              "Live map SDK with route polylines",
              "Streaming LLM assistant with tool calls",
              "Real calendar and weather providers",
              "Offline-first vehicle command queue",
              "Charging network pricing in real time",
              "Multi-vehicle and family profiles",
            ]}
          />
        </Section>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-foreground/[0.08] pt-12">
          <p className="max-w-md text-xs leading-relaxed text-muted-foreground">
            AURA Mobility is an original fictional product, unaffiliated with any vehicle
            manufacturer. All vehicle data, devices and notifications are mock data.
          </p>
          <Button asChild variant="pill" size="xl">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" /> Back to the product
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
