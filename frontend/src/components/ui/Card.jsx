import { motion } from "framer-motion";

export default function Card({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.8, 
        delay: delay, 
        ease: [0.16, 1, 0.3, 1] 
      }}
      className={`
        glass-card group relative overflow-hidden 
        rounded-[32px] p-8 
        border border-white/10
        hover:border-green-500/30 
        transition-all duration-500
        ${className}
      `}
    >
      {/* 1. INTERNAL GLOW (Top-Left Highlight) */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-green-500/5 blur-[80px] group-hover:bg-green-500/10 transition-colors duration-500" />

      {/* 2. THE RIM LIGHT (Subtle top border shine) */}
      <div className="absolute inset-0 border-t border-white/10 rounded-[32px] pointer-events-none" />

      {/* 3. CONTENT WRAPPER */}
      <div className="relative z-10 flex flex-col h-full">
        {children}
      </div>

      {/* 4. HOVER DECORATION (A subtle line that grows) */}
      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-green-500 to-emerald-400 group-hover:w-full transition-all duration-700 ease-out" />
    </motion.div>
  );
}