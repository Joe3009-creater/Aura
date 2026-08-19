import React from "react";
import { motion } from "framer-motion";
import { Lock, LockOpen, MapPin, Mic, Thermometer } from "lucide-react";
import { useAura } from "@/state/AuraContext";
import { cn } from "@/lib/utils";

const WatchAction = ({ icon: Icon, label, onClick, active }) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[9px] transition-colors duration-300",
      active ? "bg-brand text-brand-foreground" : "bg-foreground/[0.08] text-foreground/80"
    )}
  >
    <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
    {label}
  </button>
);

/** Purpose-built glanceable watch UI — not a shrunken phone app. */
export const WatchPreview = ({ className }) => {
  const { state, lock, unlock, locate, toggleClimate } = useAura();
  const { vehicle, dayStarted } = state;

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="relative">
        {/* crown */}
        <span className="absolute -right-1.5 top-[30%] h-10 w-[7px] rounded-full bg-foreground/25" />
        <span className="absolute -right-1.5 top-[52%] h-6 w-[7px] rounded-full bg-foreground/15" />
        {/* case */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-[44px] bg-foreground p-[10px] shadow-float"
        >
          {/* screen */}
          <div className="h-[290px] w-[246px] overflow-hidden rounded-[36px] bg-background p-4">
            <div className="flex items-center justify-between">
              <span className="num text-[10px] font-medium text-muted-foreground">08:04</span>
              <span className="text-[9px] font-medium uppercase tracking-[0.14em] text-brand-strong">
                AURA
              </span>
            </div>

            <div className="mt-3 flex items-end gap-1">
              <span className="num text-[44px] font-medium leading-none text-foreground">
                {vehicle.battery}
              </span>
              <span className="mb-1.5 text-base text-muted-foreground">%</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-foreground/10">
              <div className="h-full rounded-full bg-brand" style={{ width: `${vehicle.battery}%` }} />
            </div>

            <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
              <span className="num">{vehicle.range} km</span>
              <span className="inline-flex items-center gap-1 text-foreground">
                {vehicle.locked ? <Lock className="h-3 w-3" /> : <LockOpen className="h-3 w-3" />}
                {vehicle.locked ? "Locked" : "Open"}
              </span>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-1.5">
              <WatchAction
                icon={vehicle.locked ? LockOpen : Lock}
                label={vehicle.locked ? "Unlock" : "Lock"}
                onClick={vehicle.locked ? unlock : lock}
              />
              <WatchAction icon={MapPin} label="Locate" onClick={locate} />
              <WatchAction
                icon={Thermometer}
                label="Climate"
                onClick={toggleClimate}
                active={vehicle.climateOn}
              />
            </div>

            <div className="mt-3 rounded-2xl bg-foreground/[0.06] px-3 py-2.5">
              <p className="text-[10px] font-medium leading-tight text-foreground">
                {dayStarted ? "Leave in 8 min" : "Meeting in 30 min"}
              </p>
              <p className="mt-0.5 text-[9px] text-muted-foreground">
                {dayStarted ? "Route on vehicle · Aura Labs" : "Design review · Aura Labs"}
              </p>
            </div>

            <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[9px] text-muted-foreground">
              <Mic className="h-3 w-3" strokeWidth={1.8} /> “Hey AURA”
            </div>
          </div>
        </motion.div>
      </div>
      <p className="mt-5 text-xs text-muted-foreground">Glanceable · 3 taps maximum</p>
    </div>
  );
};

export default WatchPreview;
