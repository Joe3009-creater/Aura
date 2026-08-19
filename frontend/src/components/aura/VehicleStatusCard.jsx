import React from "react";
import { Link } from "react-router-dom";
import { Gauge, Lock, LockOpen, MapPin, Thermometer } from "lucide-react";
import { GlassCard, CardLabel } from "@/components/aura/GlassCard";
import { BatteryRing, BatteryBar } from "@/components/aura/BatteryRing";
import { Button } from "@/components/ui/button";
import { useAura } from "@/state/AuraContext";
import { cn } from "@/lib/utils";

const Row = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3">
    <Icon className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.6} />
    <span className="flex-1 truncate text-sm text-muted-foreground">{label}</span>
    <span className="num text-sm font-medium text-foreground">{value}</span>
  </div>
);

export const VehicleStatusCard = ({ className, delay = 0, compact = false }) => {
  const { state } = useAura();
  const { vehicle } = state;

  return (
    <GlassCard className={cn("flex flex-col", className)} delay={delay}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <CardLabel>Vehicle</CardLabel>
          <h3 className="mt-2 text-lg font-medium text-foreground">{vehicle.name}</h3>
          <p className="text-sm text-muted-foreground">{vehicle.trim}</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-brand-strong">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-brand animate-pulse-ring" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-strong" />
          </span>
          {vehicle.status}
        </span>
      </div>

      <div className="mt-6 flex items-center gap-6">
        <BatteryRing value={vehicle.battery} range={vehicle.range} charging={vehicle.charging} size={compact ? 108 : 124} />
        <div className="flex-1 space-y-3">
          <Row
            icon={vehicle.locked ? Lock : LockOpen}
            label="Security"
            value={vehicle.locked ? "Locked" : "Unlocked"}
          />
          <Row icon={Thermometer} label="Cabin" value={`${vehicle.cabinTemp}°C`} />
          <Row icon={MapPin} label="Parked" value={vehicle.location} />
          <Row icon={Gauge} label="Odo" value={`${vehicle.odometer.toLocaleString()} km`} />
        </div>
      </div>

      <div className="mt-7 space-y-4 border-t border-foreground/[0.08] pt-6">
        <BatteryBar value={vehicle.chargeLimit} label="Charge limit" />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Today's plan uses</span>
          <span className="num text-foreground">21% · 42 km</span>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Software</span>
          <span className="text-foreground">{vehicle.softwareUpdate}</span>
        </div>
      </div>

      <Button asChild variant="hairline" size="lg" className="mt-auto w-full justify-center">
        <Link to="/vehicle">Vehicle details</Link>
      </Button>
    </GlassCard>
  );
};

export default VehicleStatusCard;
