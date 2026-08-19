import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Fan,
  Lightbulb,
  Loader2,
  Lock,
  LockOpen,
  MapPin,
  Package,
  Zap,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAura } from "@/state/AuraContext";
import { cn } from "@/lib/utils";

export const QuickAction = ({
  icon: Icon,
  label,
  active,
  pending,
  done,
  onClick,
  layout = "tile",
}) => {
  const content = (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active ? true : undefined}
      className={cn(
        "group relative flex items-center justify-center gap-2 outline-none",
        "transition-[transform,background-color,box-shadow] duration-400 ease-calm",
        "active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        layout === "tile"
          ? "h-14 w-14 rounded-full glass hover:shadow-float"
          : "h-12 w-full rounded-2xl glass px-4 hover:shadow-float",
        active && "bg-primary/95 text-primary-foreground shadow-float"
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        {pending ? (
          <motion.span key="p" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Loader2 className="h-[18px] w-[18px] animate-spin" />
          </motion.span>
        ) : done ? (
          <motion.span key="d" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}>
            <Check className="h-[18px] w-[18px] text-brand-strong" />
          </motion.span>
        ) : (
          <motion.span key="i" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Icon className="h-[18px] w-[18px]" strokeWidth={1.6} />
          </motion.span>
        )}
      </AnimatePresence>
      {layout === "row" && (
        <span className="flex-1 text-left text-sm font-medium">{label}</span>
      )}
    </button>
  );

  if (layout === "row") return content;

  return (
    <Tooltip delayDuration={120}>
      <TooltipTrigger asChild>{content}</TooltipTrigger>
      <TooltipContent side="right" className="rounded-full px-3 py-1.5 text-xs">
        {label}
      </TooltipContent>
    </Tooltip>
  );
};

/** orientation: rail (vertical, desktop hero) | grid (mobile) | row (list) */
export const QuickActions = ({ orientation = "rail", className, only }) => {
  const { state, lock, unlock, toggleClimate, toggleLights, locate, toggleTrunk, toggleCharge } =
    useAura();
  const { vehicle, pendingAction } = state;

  const items = [
    {
      id: vehicle.locked ? "unlock" : "lock",
      key: "lockToggle",
      icon: vehicle.locked ? LockOpen : Lock,
      label: vehicle.locked ? "Unlock" : "Lock",
      onClick: vehicle.locked ? unlock : lock,
      active: false,
    },
    { id: "climate", key: "climate", icon: Fan, label: "Climate", onClick: toggleClimate, active: vehicle.climateOn },
    { id: "lights", key: "lights", icon: Lightbulb, label: "Lights", onClick: toggleLights, active: vehicle.lightsOn },
    { id: "locate", key: "locate", icon: MapPin, label: "Locate", onClick: locate },
    { id: "charge", key: "charge", icon: Zap, label: "Charge", onClick: toggleCharge, active: vehicle.charging },
    { id: "trunk", key: "trunk", icon: Package, label: "Trunk", onClick: toggleTrunk, active: vehicle.trunkOpen },
  ].filter((i) => (only ? only.includes(i.key) : true));

  return (
    <TooltipProvider>
      <div
        className={cn(
          orientation === "rail" && "flex flex-col gap-3",
          orientation === "grid" && "grid grid-cols-3 gap-3",
          orientation === "row" && "flex flex-col gap-2.5",
          className
        )}
      >
        {items.map((item) => (
          <QuickAction
            key={item.key}
            icon={item.icon}
            label={item.label}
            active={item.active}
            pending={pendingAction === item.id}
            onClick={item.onClick}
            layout={orientation === "row" ? "row" : "tile"}
          />
        ))}
      </div>
    </TooltipProvider>
  );
};

export default QuickActions;
