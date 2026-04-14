import { motion } from "framer-motion";

export default function Features() {
  const projectFeatures = [
    { 
      title: "Real-Time ASL", 
      tag: "Recognition", 
      color: "var(--primary)", 
      desc: "Instant translation of American Sign Language using high-speed computer vision." 
    },
    { 
      title: "Voice-to-Sign", 
      tag: "Reverse Flow", 
      color: "#3b82f6", 
      desc: "Translates spoken words into visual sign language tutorials for seamless two-way talk." 
    },
    { 
      title: "Cloud-Powered", 
      tag: "Backend", 
      color: "#a855f7", 
      desc: "Utilizes scalable cloud services for high-accuracy gesture processing with minimal latency." 
    },
    { 
      title: "Gesture Tutorials", 
      tag: "Education", 
      color: "#f59e0b", 
      desc: "Interactive learning modules designed to teach sign language to non-signers." 
    },
    { 
      title: "Multi-Regional", 
      tag: "Linguistic", 
      color: "#ec4899", 
      desc: "Support for diverse sign variants and regional dialects to ensure global inclusivity." 
    },
    { 
      title: "Inclusive Design", 
      tag: "Accessibility", 
      color: "#10b981", 
      desc: "A user-friendly interface built specifically for the deaf and hard-of-hearing community." 
    }
  ];

  // Double the array for the infinite loop effect
  const scrollerContent = [...projectFeatures, ...projectFeatures];

  return (
    <section className="py-24 bg-[var(--bg-deep)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-20">
        <div className="flex flex-col items-center md:items-start">
          <span className="px-3 py-1 rounded-md bg-[var(--primary)]/10 border border-[var(--primary)]/20 text-[var(--primary)] text-[10px] font-black uppercase tracking-[0.3em] mb-4">
            System Capabilities
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
            Smart. Inclusive. <span className="text-[var(--text-muted)]">Real-Time.</span>
          </h2>
        </div>
      </div>

      {/* INFINITE SCROLLER CONTAINER */}
      <div className="relative flex group">
        {/* Edge Fades: Matches bg-deep for a "disappearing" effect */}
        <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[var(--bg-deep)] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-[var(--bg-deep)] to-transparent z-10 pointer-events-none" />

        <motion.div 
          className="flex gap-8 py-4 px-4"
          animate={{ x: [0, -2500] }} 
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 40, // Slightly slower for readability
              ease: "linear",
            },
          }}
          // Pauses the animation on hover
          whileHover={{ animationPlayState: "paused" }}
        >
          {scrollerContent.map((f, i) => (
            <div
              key={i}
              className="w-[400px] shrink-0 glass-card glass-sheen p-10 rounded-[3rem] border border-white/5 hover:border-[var(--primary)]/30 transition-all duration-500 group/card cursor-pointer"
            >
              <div className="flex justify-between items-center mb-10">
                <div 
                  className="w-12 h-1 rounded-full opacity-40 group-hover/card:opacity-100 transition-opacity" 
                  style={{ backgroundColor: f.color }} 
                />
                <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest px-3 py-1 rounded-full border border-white/5 bg-white/[0.02]">
                  {f.tag}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-white mb-4 group-hover/card:text-[var(--primary)] transition-colors">
                {f.title}
              </h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed whitespace-normal font-medium">
                {f.desc}
              </p>

              {/* Technical Metadata Footer */}
              <div className="mt-12 pt-6 border-t border-white/5 flex items-center justify-between">
                <div className="flex gap-1.5">
                  {[1, 2, 3].map((dot) => (
                    <div key={dot} className="w-1 h-1 rounded-full bg-white/10 group-hover/card:bg-[var(--primary)]/40 transition-colors" />
                  ))}
                </div>
                <div 
                  className="w-2.5 h-2.5 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)] group-hover/card:animate-pulse" 
                  style={{ backgroundColor: f.color, boxShadow: `0 0 15px ${f.color}60` }} 
                />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}