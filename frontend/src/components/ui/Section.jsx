import { motion } from "framer-motion";

export default function Section({ title, subtitle, children, className = "", id }) {
  return (
    <section 
      id={id}
      className={`relative py-24 md:py-32 overflow-hidden ${className}`}
    >
      {/* 1. TOP HORIZON LINE */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
      
      {/* BACKGROUND DEPTH (Subtle glow) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[var(--primary)]/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        
        {/* 2. ENHANCED HUD HEADER */}
        {title && (
          <div className="mb-20 md:mb-28">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-start md:items-center md:text-center"
            >
              {/* Technical Badge */}
              {subtitle && (
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-px bg-[var(--primary)]/50" />
                  <span className="text-[10px] font-black tracking-[0.5em] text-[var(--primary)] uppercase">
                    {subtitle}
                  </span>
                  <div className="w-2 h-2 rounded-full border border-[var(--primary)]/50" />
                </div>
              )}
              
              <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-white leading-[0.9] uppercase italic">
                {title.split(' ').map((word, i) => (
                  <span key={i} className={i % 2 !== 0 ? "text-white/20" : "text-white"}>
                    {word}{' '}
                  </span>
                ))}
              </h2>
              
              {/* Data Accents */}
              <div className="mt-8 flex items-center gap-4 opacity-30">
                <div className="text-[9px] font-mono text-white tracking-widest">COORD_001</div>
                <div className="w-12 h-px bg-white/20" />
                <div className="text-[9px] font-mono text-white tracking-widest">STR_OP_88</div>
              </div>
            </motion.div>
          </div>
        )}

        {/* 3. CONTENT AREA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {children}
        </motion.div>
      </div>

      {/* 4. SIDE DECORATION (Optional - subtle vertical markers) */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-10 hidden xl:flex">
         {[...Array(4)].map((_, i) => (
           <div key={i} className="w-1 h-1 bg-white rounded-full" />
         ))}
      </div>
    </section>
  );
}