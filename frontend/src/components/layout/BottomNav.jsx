import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Car, Home, Navigation, Sparkles, Watch } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Today", icon: Home },
  { to: "/vehicle", label: "Vehicle", icon: Car },
  { to: "/journey", label: "Journey", icon: Navigation },
  { to: "/assistant", label: "AURA", icon: Sparkles },
  { to: "/devices", label: "Devices", icon: Watch },
];

export const BottomNav = () => {
  const location = useLocation();
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-3 bottom-3 z-40 flex items-center justify-between rounded-full glass-strong px-2 py-2 md:hidden"
    >
      {items.map((item) => {
        const active =
          item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to);
        return (
          <NavLink
            key={item.to}
            to={item.to}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 rounded-full py-1.5 text-[10px] transition-colors duration-300",
              active ? "text-foreground" : "text-muted-foreground"
            )}
          >
            <span
              className={cn(
                "grid h-8 w-8 place-items-center rounded-full transition-colors duration-300",
                active && "bg-primary text-primary-foreground"
              )}
            >
              <item.icon className="h-4 w-4" strokeWidth={1.7} />
            </span>
            {item.label}
          </NavLink>
        );
      })}
    </nav>
  );
};

export default BottomNav;
