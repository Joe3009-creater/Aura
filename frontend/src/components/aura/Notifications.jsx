import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Battery,
  Bell,
  CalendarClock,
  Car,
  Navigation,
  X,
  Zap,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useAura } from "@/state/AuraContext";
import { cn } from "@/lib/utils";

const ICONS = {
  vehicle: Car,
  schedule: CalendarClock,
  charging: Zap,
  journey: Navigation,
  battery: Battery,
};

export const NotificationCard = ({ item, onDismiss, onAction, className }) => {
  const Icon = ICONS[item.kind] || Bell;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group relative flex gap-3 rounded-2xl border border-foreground/[0.08] bg-card/70 p-4",
        item.unread && "bg-card",
        className
      )}
    >
      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-secondary text-foreground">
        <Icon className="h-4 w-4" strokeWidth={1.7} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-2">
          <p className="flex-1 text-sm font-medium leading-snug text-foreground">{item.title}</p>
          {item.unread && <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />}
        </div>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.body}</p>
        <div className="mt-2.5 flex items-center gap-3">
          <span className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            {item.time}
          </span>
          {item.cta && (
            <Button
              variant="quiet"
              size="sm"
              className="h-7"
              onClick={() => onAction?.(item)}
            >
              {item.cta}
            </Button>
          )}
        </div>
      </div>
      {onDismiss && (
        <button
          type="button"
          aria-label={`Dismiss: ${item.title}`}
          onClick={() => onDismiss(item.id)}
          className="absolute right-2.5 top-2.5 grid h-6 w-6 place-items-center rounded-full text-muted-foreground opacity-0 transition-opacity duration-300 hover:bg-accent focus-visible:opacity-100 group-hover:opacity-100"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </motion.div>
  );
};

export const NotificationBell = () => {
  const { state, dispatch, scheduleCharging, sendToVehicle } = useAura();
  const unread = state.notifications.filter((n) => n.unread).length;

  const handleAction = (item) => {
    if (item.kind === "charging") scheduleCharging();
    else sendToVehicle();
  };

  return (
    <Popover onOpenChange={(o) => o && dispatch({ type: "READ_NOTIFICATIONS" })}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`Notifications, ${unread} unread`}
          className="relative grid h-10 w-10 place-items-center rounded-full border border-foreground/10 bg-card/60 text-foreground transition-colors duration-300 hover:bg-card"
        >
          <Bell className="h-4 w-4" strokeWidth={1.7} />
          {unread > 0 && (
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-brand" />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={12}
        className="w-[360px] rounded-[24px] border-foreground/[0.08] glass-strong p-4"
      >
        <div className="mb-3 flex items-center justify-between px-1">
          <p className="text-sm font-medium text-foreground">Notifications</p>
          <span className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            All devices
          </span>
        </div>
        <div className="scrollbar-none max-h-[380px] space-y-2 overflow-y-auto">
          <AnimatePresence initial={false}>
            {state.notifications.map((n) => (
              <NotificationCard
                key={n.id}
                item={n}
                onDismiss={(id) => dispatch({ type: "DISMISS_NOTIFICATION", payload: id })}
                onAction={handleAction}
              />
            ))}
          </AnimatePresence>
          {state.notifications.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              You're all caught up.
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
