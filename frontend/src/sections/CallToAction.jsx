import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function CallToAction() {
  return (
    <section className="relative py-32 overflow-hidden bg-[var(--bg-deep)]">
      
      {/* 1. BACKGROUND ATMOSPHERE (Radial Glow) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl aspect-square bg-[var(--primary)]/10 blur-[160px] rounded-full opacity-40" />
      </div>

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="glass-card glass-sheen p-12 md:p-24 rounded-[48px] border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent shadow-2xl"
        >
          {/* TECHNICAL BADGE */}
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--primary)] mb-8 block">
            Phase 01 — Testing
          </span>

          <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-tight mb-8">
            Ready to break the <br />
            <span className="text-[var(--text-muted)] italic">silence?</span>
          </h2>

          <p className="text-[var(--text-muted)] max-w-md mx-auto mb-12 text-sm md:text-lg leading-relaxed font-medium">
            Initialize the Real-Time Translation engine and experience 
            the power of AI-driven accessibility first-hand.
          </p>

          {/* THE BUTTON */}
          <Link to="/detector" className="inline-block group relative">
            {/* High-End Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[var(--primary)] to-emerald-400 rounded-2xl blur-lg opacity-20 group-hover:opacity-60 transition duration-500" />
            
            <button className="relative px-14 py-6 bg-white text-black font-black rounded-2xl transition-all duration-300 transform group-hover:-translate-y-1.5 group-active:scale-95 shadow-2xl">
              Launch Live Detector
            </button>
          </Link>

          {/* SYSTEM SPECS TAG */}
          <div className="mt-16 flex justify-center items-center gap-8 md:gap-12 border-t border-white/5 pt-12">
             {[
               { label: "LOW LATENCY", value: "24MS" },
               { label: "HD VISION", value: "60FPS" },
               { label: "CLOUD SYNC", value: "v2.0" }
             ].map((spec, i) => (
               <div key={i} className="flex flex-col items-center group/spec">
                  <span className="text-[9px] font-black text-white/40 tracking-widest group-hover/spec:text-[var(--primary)] transition-colors">
                    {spec.label}
                  </span>
                  <span className="text-[8px] text-white/20 mt-1">{spec.value}</span>
                  <div className="h-[1px] w-4 bg-white/10 group-hover/spec:w-8 group-hover/spec:bg-[var(--primary)] transition-all duration-500 mt-2" />
               </div>
             ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}