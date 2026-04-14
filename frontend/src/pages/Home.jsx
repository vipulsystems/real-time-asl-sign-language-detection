import Hero from "../sections/Hero";
import Features from "../sections/Features";
import HowItWorks from "../sections/HowItWorks";
import CallToAction from "../sections/CallToAction";
import { motion, useScroll, useSpring } from "framer-motion";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="relative bg-[#030408] min-h-screen">
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-green-500 origin-left z-[60]" 
        style={{ scaleX }} 
      />

      {/* Main content with negative margin top to pull Hero closer to Navbar if needed */}
      <main className="relative z-10 flex flex-col">
        <Hero />
        
        {/* We use a flex container with no extra spacing between children */}
        <Features />
        <HowItWorks />
        <CallToAction />
      </main>
    </div>
  );
}