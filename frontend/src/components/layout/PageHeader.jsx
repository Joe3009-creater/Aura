import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const PageHeader = ({ eyebrow, title, description, actions, className }) => (
  <div className={cn("flex flex-col gap-6 md:flex-row md:items-end md:justify-between", className)}>
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-2xl"
    >
      {eyebrow && (
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
          {eyebrow}
        </p>
      )}
      <h1 className="mt-3 text-4xl font-medium leading-[1.05] text-foreground sm:text-5xl">
        {title}
      </h1>
      {description && (
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-lg">
          {description}
        </p>
      )}
    </motion.div>
    {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
  </div>
);

export default PageHeader;
