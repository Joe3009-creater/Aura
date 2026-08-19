import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mic } from "lucide-react";
import { DesktopNav } from "@/components/layout/DesktopNav";
import { BottomNav } from "@/components/layout/BottomNav";
import { AssistantPanel } from "@/components/aura/AssistantPanel";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export const AppShell = ({ children, hideAssistantFab = false }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      {/* ambient wash — kept under 20% of viewport, top corners only */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[42vh] ambient opacity-70"
      />
      <div aria-hidden="true" className="grain pointer-events-none absolute inset-0" />

      <div className="relative">
        <DesktopNav />
        <main className="mx-auto w-full max-w-[1400px] px-4 pb-32 pt-8 sm:px-8 sm:pt-12 md:pb-24">
          {children}
        </main>
        <BottomNav />
      </div>

      {!hideAssistantFab && (
        <>
          <motion.button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Ask AURA"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "fixed bottom-24 right-4 z-40 flex items-center gap-2 rounded-full bg-primary px-5 py-3.5 text-sm font-medium text-primary-foreground shadow-float",
              "transition-transform duration-300 ease-calm active:scale-95 md:hidden"
            )}
          >
            <Mic className="h-4 w-4" strokeWidth={1.8} />
            Ask AURA
          </motion.button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent
              side="bottom"
              className="h-[86vh] rounded-t-[32px] border-foreground/[0.08] bg-background/80 p-3 backdrop-blur-2xl"
            >
              <SheetTitle className="sr-only">AURA Assistant</SheetTitle>
              <SheetDescription className="sr-only">
                Ask AURA about your vehicle, schedule, charging or route by voice or text.
              </SheetDescription>
              <AssistantPanel variant="full" chipCount={9} className="h-full" />
            </SheetContent>
          </Sheet>
        </>
      )}
    </div>
  );
};

export default AppShell;
