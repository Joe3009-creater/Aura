import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Settings2 } from "lucide-react";
import { AuraLogo } from "@/components/aura/AuraLogo";
import { NotificationBell } from "@/components/aura/Notifications";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAura } from "@/state/AuraContext";
import { cn } from "@/lib/utils";

export const NAV_ITEMS = [
  { to: "/", label: "Today" },
  { to: "/vehicle", label: "Vehicle" },
  { to: "/journey", label: "Journey" },
  { to: "/assistant", label: "Assistant" },
  { to: "/devices", label: "Devices" },
];

export const DesktopNav = () => {
  const { state } = useAura();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 w-full px-4 pt-4 sm:px-8 sm:pt-6">
      <nav className="mx-auto flex max-w-[1400px] items-center gap-4 rounded-full glass px-4 py-2.5 sm:px-5">
        <Link to="/" aria-label="AURA Mobility home" className="shrink-0">
          <AuraLogo />
        </Link>

        <div className="hidden flex-1 items-center justify-center md:flex">
          <div className="relative flex items-center gap-1 rounded-full bg-foreground/[0.04] p-1">
            {NAV_ITEMS.map((item) => {
              const active =
                item.to === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.to);
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-sm transition-colors duration-300",
                    active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-primary"
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <span className="hidden items-center gap-2 rounded-full border border-foreground/10 px-3.5 py-2 text-xs text-muted-foreground lg:inline-flex">
            <MapPin className="h-3.5 w-3.5" strokeWidth={1.8} />
            {state.vehicle.location}
          </span>
          <NotificationBell />
          <Link
            to="/case-study"
            aria-label="Case study"
            className="hidden h-10 w-10 place-items-center rounded-full border border-foreground/10 bg-card/60 text-foreground transition-colors duration-300 hover:bg-card sm:grid"
          >
            <Settings2 className="h-4 w-4" strokeWidth={1.7} />
          </Link>
          <Avatar className="h-10 w-10 border border-foreground/10">
            <AvatarFallback className="bg-primary text-xs font-medium text-primary-foreground">
              {state.user.initials}
            </AvatarFallback>
          </Avatar>
        </div>
      </nav>
    </header>
  );
};

export default DesktopNav;
