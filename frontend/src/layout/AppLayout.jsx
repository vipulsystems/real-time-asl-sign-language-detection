import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

export default function AppLayout({ children }) {
  const location = useLocation();

  return (
    <div className="relative min-h-screen bg-[var(--bg-deep)] text-[var(--text-main)] selection:bg-[var(--primary)]/30 overflow-x-hidden">
      
      {/* 1. GLOBAL ATMOSPHERIC LIGHTING */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        {/* Main Central Glow */}
        <div className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[120vw] h-[70vh] bg-[var(--primary)]/5 blur-[160px] rounded-full opacity-60" />
        
        {/* Soft Blue Accent (AI Feel) */}
        <div className="absolute top-[20%] left-[-10%] w-[50vw] h-[50vw] bg-blue-600/[0.03] blur-[140px] rounded-full" />
        
        {/* Deep Purple/Emerald Balance */}
        <div className="absolute bottom-[-10%] right-[-5%] w-[45vw] h-[45vw] bg-emerald-500/[0.04] blur-[140px] rounded-full" />

        {/* Cinematic Noise/Grain Overlay */}
        <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      {/* 2. NAVIGATION */}
      <Navbar />

      {/* 3. MAIN CONTENT STAGE */}
      {/* Removed strict max-width constraints to allow sections to control their own width (up to 1400px) */}
      <main className="relative z-10 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ 
              duration: 0.4, 
              ease: [0.22, 1, 0.36, 1] // Custom "Expo" ease for premium feel
            }}
            className="min-h-[80vh]"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 4. FOOTER */}
      <Footer />
    </div>
  );
}