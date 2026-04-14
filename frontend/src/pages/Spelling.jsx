import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CameraFeed from "../components/camera/CameraFeed";
import Section from "../components/ui/Section";

export default function Spelling() {
  const [sentence, setSentence] = useState("");
  const [lastChar, setLastChar] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Memoize addLetter to prevent unnecessary re-renders of CameraFeed
  const addLetter = useCallback((letter) => {
    if (!letter || letter === "No hand") return;

    setSentence((prev) => {
      // Prevent rapid-fire double letters unless intentional
      if (prev.endsWith(letter)) return prev;
      
      // Trigger a brief visual "flash" to confirm detection
      setLastChar(letter);
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 300);
      
      return prev + letter;
    });
  }, []);

  const backspace = () => setSentence((prev) => prev.slice(0, -1));
  const clearSentence = () => {
    if(window.confirm("Purge local buffer?")) setSentence("");
  };
  const addSpace = () => setSentence((prev) => prev + " ");

  return (
    <Section title="Neural Scrivener" subtitle="Gesture-to-Text Terminal">
      <div className="max-w-4xl mx-auto">
        
        {/* TEXT OUTPUT TERMINAL */}
        <div className={`glass-card p-10 rounded-[3rem] border transition-all duration-300 bg-black/40 mb-12 relative overflow-hidden group ${
          isTyping ? "border-[var(--primary)] shadow-[0_0_40px_rgba(var(--primary-rgb),0.2)]" : "border-white/10"
        }`}>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none" />
          
          <div className="relative z-10 text-center">
            {/* STATUS HUD */}
            <div className="flex justify-center items-center gap-3 mb-6">
              <motion.div 
                animate={isTyping ? { scale: [1, 1.5, 1] } : {}}
                className={`w-2 h-2 rounded-full ${isTyping ? "bg-white" : "bg-[var(--primary)]"} animate-pulse`} 
              />
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em]">
                {isTyping ? `INJECTING_CHAR: ${lastChar}` : "Live Buffer Stream"}
              </p>
              <div className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
            </div>

            {/* THE TYPED TEXT */}
            <div className="min-h-[120px] flex flex-wrap justify-center items-center gap-1 px-4">
              <AnimatePresence mode="popLayout">
                {sentence.split("").map((char, i) => (
                  <motion.span
                    key={i + char + i} // Unique key for identical letters
                    initial={{ y: 20, opacity: 0, scale: 0.8 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className={`text-5xl md:text-7xl font-black italic tracking-tighter ${
                      char === " " ? "w-10" : "text-white"
                    }`}
                  >
                    {char}
                  </motion.span>
                ))}
              </AnimatePresence>
              
              <motion.div
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="w-1.5 h-12 md:h-16 bg-[var(--primary)] shadow-[0_0_15px_var(--primary)] ml-2"
              />
            </div>
          </div>
        </div>

        {/* ... (Existing Camera and Controls) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
           <div className="lg:col-span-8">
            <div className="rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl relative">
                {/* Overlay showing what was just typed on top of the camera */}
                <AnimatePresence>
                    {isTyping && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 2 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center bg-[var(--primary)]/10 z-10 pointer-events-none"
                        >
                            <span className="text-9xl font-black text-white/20">{lastChar}</span>
                        </motion.div>
                    )}
                </AnimatePresence>
                <CameraFeed onDetect={addLetter} />
            </div>
          </div>
          
          <div className="lg:col-span-4 flex flex-col gap-4">
             {/* COMMANDS (Keep your current layout) */}
             <div className="glass-card p-6 rounded-[2rem] border border-white/5 bg-white/[0.02]">
                <div className="flex flex-col gap-3">
                    <button onClick={addSpace} className="scriver-btn">[ Space_Bar ]</button>
                    <button onClick={backspace} className="scriver-btn hover:bg-amber-500/20">[ Backspace ]</button>
                    <button onClick={clearSentence} className="scriver-btn text-red-500 hover:bg-red-500 hover:text-white">[ Clear_All ]</button>
                </div>
             </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .scriver-btn {
          @apply w-full py-5 bg-white/5 border border-white/10 rounded-2xl text-white font-black text-xs uppercase tracking-widest transition-all;
        }
      `}</style>
    </Section>
  );
}