import React, { Suspense, lazy, useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "@/components/ui/sonner";
import { AuraProvider } from "@/state/AuraContext";
import TodayPage from "@/pages/Today";

const VehiclePage = lazy(() => import("@/pages/Vehicle"));
const JourneyPage = lazy(() => import("@/pages/Journey"));
const AssistantPage = lazy(() => import("@/pages/Assistant"));
const DevicesPage = lazy(() => import("@/pages/Devices"));
const CaseStudyPage = lazy(() => import("@/pages/CaseStudy"));

const PageFallback = () => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <span className="h-8 w-8 animate-spin rounded-full border-2 border-foreground/15 border-t-brand" />
  </div>
);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <Suspense fallback={<PageFallback />}>
          <Routes location={location}>
            <Route path="/" element={<TodayPage />} />
            <Route path="/vehicle" element={<VehiclePage />} />
            <Route path="/journey" element={<JourneyPage />} />
            <Route path="/assistant" element={<AssistantPage />} />
            <Route path="/devices" element={<DevicesPage />} />
            <Route path="/case-study" element={<CaseStudyPage />} />
            <Route path="*" element={<TodayPage />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuraProvider>
          <ScrollToTop />
          <AnimatedRoutes />
          <Toaster
            position="top-center"
            toastOptions={{
              classNames: {
                toast:
                  "rounded-2xl border-foreground/10 bg-card/90 backdrop-blur-xl text-foreground shadow-float",
              },
            }}
          />
        </AuraProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
