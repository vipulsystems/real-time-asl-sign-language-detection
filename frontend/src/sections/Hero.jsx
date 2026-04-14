import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
    },
  };

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center py-12 md:py-16 overflow-hidden">
      
      {/* 1. ATMOSPHERIC BACKDROP */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        {/* Dynamic Glows using Theme Colors */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[var(--primary)] opacity-[0.07] blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-600/5 blur-[100px] rounded-full" />
        
        {/* Subtle Grain Texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto px-6 text-center"
      >
        {/* 2. PROJECT STATUS BADGE */}
        <motion.div variants={itemVariants} className="flex justify-center mb-10">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-[var(--glass-border)] bg-white/[0.02] backdrop-blur-xl shadow-2xl">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--primary)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--primary)]"></span>
            </span>
            <span className="text-[var(--primary)] text-[10px] font-black uppercase tracking-[0.3em]">
              Neural Engine Online
            </span>
          </div>
        </motion.div>

        {/* 3. THE BRANDED TITLE */}
        <motion.h1
          variants={itemVariants}
          className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.95] mb-10"
        >
          <span className="text-white">Real-Time</span> <br />
          <span className="bg-gradient-to-r from-[var(--primary)] via-emerald-400 to-green-500 bg-clip-text text-transparent italic px-2">
            Sign Language
          </span>
          <br /> 
          <span className="text-gradient">Translation.</span>
        </motion.h1>

        {/* 4. TECHNICAL DESCRIPTION */}
        <motion.p
          variants={itemVariants}
          className="text-[var(--text-muted)] max-w-2xl mx-auto mb-14 text-base md:text-lg leading-relaxed font-medium"
        >
          An advanced computer vision framework designed to bridge communication 
          barriers. Powered by MediaPipe landmark tracking and high-speed neural 
          inference for instant gesture-to-text conversion.
        </motion.p>

        {/* 5. CTA GROUP */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center gap-6">
          {/* Primary Action */}
          <button
            onClick={() => navigate("/detector")}
            className="group relative px-12 py-6 bg-white text-black font-black rounded-2xl transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-2xl shadow-green-500/20"
          >
            <span className="relative z-10">Launch Detector</span>
            <div className="absolute inset-0 rounded-2xl bg-[var(--primary)] blur-2xl opacity-0 group-hover:opacity-30 transition-opacity" />
          </button>

          {/* Secondary Action - Using your new glass-card and sheen */}
          <button
            onClick={() => navigate("/alphabet")}
            className="glass-card glass-sheen px-12 py-6 font-bold text-white transition-all border border-white/5 hover:border-[var(--primary)]/30 overflow-hidden"
          >
            Study Alphabet
          </button>
        </motion.div>
      </motion.div>

      {/* 6. SCROLL INDICATOR */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
      >
        <div className="w-[1px] h-20 bg-gradient-to-b from-[var(--primary)]/50 via-[var(--primary)]/10 to-transparent" />
      </motion.div>
    </section>
  );
}