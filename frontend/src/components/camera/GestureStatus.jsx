import { motion, AnimatePresence } from "framer-motion";

export default function GestureStatus({ text }) {
  // Key for the outer container triggers a re-sync animation on text change
  return (
    <div className="relative py-8 px-6 rounded-[2rem] bg-white/[0.01] border border-white/5 overflow-hidden shadow-inner">
      
      {/* 1. KINETIC ACCENTS (The 'Data Brackets') */}
      <div className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-transparent via-[var(--primary)]/40 to-transparent" />
      <div className="absolute top-0 right-0 w-[2px] h-full bg-gradient-to-b from-transparent via-[var(--primary)]/40 to-transparent" />

      <div className="relative z-10">
        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-[var(--text-muted)] mb-4 text-center">
          Neural Inference Terminal
        </p>

        <div className="flex items-center justify-center gap-4">
          {/* 2. THE SYSTEM CURSOR */}
          <motion.div 
            animate={{ opacity: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 1, ease: "steps(2)" }}
            className="w-1.5 h-10 bg-[var(--primary)] shadow-[0_0_15px_var(--primary)]"
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={text}
              initial={{ opacity: 0, x: -5, filter: "blur(12px) brightness(2)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px) brightness(1)" }}
              exit={{ opacity: 0, x: 5, filter: "blur(12px) brightness(0.5)" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative"
            >
              <h2 className="text-6xl font-black text-white tracking-tighter uppercase font-mono italic">
                {text}
                <span className="text-[var(--primary)]/30 animate-pulse ml-1">_</span>
              </h2>
              
              {/* Ghost Layer for 'CRT' Glow Effect */}
              <motion.h2 
                className="absolute inset-0 text-6xl font-black text-[var(--primary)] opacity-20 blur-md pointer-events-none font-mono italic"
                aria-hidden="true"
              >
                {text}
              </motion.h2>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 3. SIGNAL STRENGTH BITS */}
        <div className="mt-6 flex justify-center items-end gap-1.5 h-4">
          {[...Array(16)].map((_, i) => (
            <motion.div 
              key={i}
              animate={{ 
                height: [2, Math.random() * 12 + 4, 2],
                opacity: [0.1, 0.5, 0.1] 
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 1.5, 
                delay: i * 0.05,
                ease: "easeInOut"
              }}
              className="w-[3px] rounded-full bg-[var(--primary)]" 
            />
          ))}
        </div>
      </div>

      {/* 4. REACTIVE BACKGROUND PULSE */}
      <AnimatePresence>
        <motion.div 
          key={`pulse-${text}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 bg-[var(--primary)] pointer-events-none blur-[100px] -z-10"
        />
      </AnimatePresence>
    </div>
  );
}