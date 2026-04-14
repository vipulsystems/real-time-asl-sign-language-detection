import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";

import AppLayout from "./layout/AppLayout";
import Home from "./pages/Home";
import Detector from "./pages/Detector";
import Practice from "./pages/Practice";
import Alphabet from "./pages/Alphabet";
import Dictionary from "./pages/Dictionary";
import Spelling from "./pages/Spelling";

// Helper to reset scroll position on every page change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    /* initial={false} prevents the animation from playing on the very first load 
       if you prefer the site to be immediately visible. 
       mode="wait" handles the exit-then-entry sequence.
    */
    <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/detector" element={<Detector />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/alphabet" element={<Alphabet />} />
        <Route path="/dictionary" element={<Dictionary />} />
        <Route path="/spelling" element={<Spelling />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      {/* Ensures the user starts at the top of the new page */}
      <ScrollToTop />
      <AppLayout>
        <AnimatedRoutes />
      </AppLayout>
    </BrowserRouter>
  );
}