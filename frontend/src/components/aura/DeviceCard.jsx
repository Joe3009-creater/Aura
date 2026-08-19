import React from "react";
import { motion } from "framer-motion";
import { Car, Laptop, Smartphone, Watch } from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS = { vehicle: Car, phone: Smartphone, watch: Watch, desktop: Laptop };

export const DeviceCard = ({ device, delay = 0, className }) => {
  const Icon = ICONS[device.type] || Car;
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "flex flex-col rounded-[28px] glass p-6 transition-shadow duration-500 ease-calm hover:shadow-float",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-secondary text-foreground">
          <Icon className="h-5 w-5" strokeWidth={1.6} />
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-brand-strong">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-strong" />
          {device.status}
        </span>
      </div>

      <h3 className="mt-5 text-base font-medium text-foreground">{device.name}</h3>
      <p className="mt-1 text-xs text-muted-foreground">{device.detail}</p>

      <div className="mt-auto flex items-center justify-between pt-6 text-xs text-muted-foreground">
        <span className="num">
          {device.battery != null ? `${device.battery}% battery` : "Mains power"}
        </span>
        {(device.primary || device.thisDevice) && (
          <span className="rounded-full border border-foreground/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.12em]">
            {device.primary ? "Primary" : "This device"}
          </span>
        )}
      </div>
    </motion.article>
  );
};

export default DeviceCard;
