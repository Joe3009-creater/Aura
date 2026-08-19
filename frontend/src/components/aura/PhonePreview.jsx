import React from "react";
import { motion } from "framer-motion";
import { Car, Home, Navigation, Sparkles, User } from "lucide-react";
import { SIDE_VEHICLE_IMG } from "@/data/mock";
import { useAura } from "@/state/AuraContext";
import { cn } from "@/lib/utils";

const tabs = [
  { icon: Home, label: "Home", active: true },
  { icon: Car, label: "Vehicle" },
  { icon: Navigation, label: "Journey" },
  { icon: Sparkles, label: "AURA" },
  { icon: User, label: "Profile" },
];

/** Static phone mock used on the Devices page to show the mobile IA. */
export const PhonePreview = ({ className }) => {
  const { state } = useAura();
  const { vehicle } = state;

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-[46px] bg-foreground p-[10px] shadow-float"
      >
        <div className="relative h-[470px] w-[232px] overflow-hidden rounded-[38px] bg-background">
          <div className="absolute left-1/2 top-2 z-10 h-4 w-16 -translate-x-1/2 rounded-full bg-foreground" />
          <div className="h-full overflow-hidden px-4 pb-16 pt-8">
            <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Wed 14 Feb</p>
            <h4 className="mt-1 text-lg font-medium leading-tight text-foreground">
              Good morning,
              <br />
              Arjun.
            </h4>

            <div className="mt-3 rounded-3xl glass p-3">
              <img
                src={SIDE_VEHICLE_IMG}
                alt="AURA E7 side profile"
                loading="lazy"
                className="h-16 w-full object-contain mix-blend-multiply"
                style={{ filter: "brightness(1.2) contrast(1.03)" }}
              />
              <div className="mt-1 flex items-end justify-between">
                <span className="num text-2xl font-medium text-foreground">{vehicle.battery}%</span>
                <span className="num text-[10px] text-muted-foreground">{vehicle.range} km</span>
              </div>
              <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-foreground/10">
                <div className="h-full rounded-full bg-brand" style={{ width: `${vehicle.battery}%` }} />
              </div>
            </div>

            <div className="mt-3 grid grid-cols-4 gap-2">
              {["Lock", "Climate", "Locate", "Charge"].map((a) => (
                <div
                  key={a}
                  className="rounded-2xl bg-foreground/[0.05] py-2 text-center text-[8px] text-muted-foreground"
                >
                  {a}
                </div>
              ))}
            </div>

            <div className="mt-3 rounded-3xl border border-foreground/[0.08] p-3">
              <p className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">Next</p>
              <p className="mt-1 text-[11px] font-medium text-foreground">08:12 · Leave home</p>
              <p className="text-[9px] text-muted-foreground">Arrive Aura Labs 08:46</p>
            </div>

            <div className="mt-3 flex items-center gap-2 rounded-full bg-primary px-3 py-2.5">
              <Sparkles className="h-3 w-3 text-primary-foreground" />
              <span className="text-[10px] text-primary-foreground">Ask AURA</span>
            </div>
          </div>

          <div className="absolute inset-x-2 bottom-2 flex items-center justify-between rounded-full glass-strong px-3 py-2">
            {tabs.map((t) => (
              <span
                key={t.label}
                className={cn(
                  "grid h-7 w-7 place-items-center rounded-full",
                  t.active ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                )}
              >
                <t.icon className="h-3.5 w-3.5" strokeWidth={1.7} />
              </span>
            ))}
          </div>
        </div>
      </motion.div>
      <p className="mt-5 text-xs text-muted-foreground">Thumb-first · bottom navigation</p>
    </div>
  );
};

export default PhonePreview;
