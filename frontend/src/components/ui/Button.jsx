import { motion } from "framer-motion";

export default function Button({ children, onClick, type = "primary", className = "" }) {
  
  // Base styles with improved typography and touch targets
  const base = "relative overflow-hidden px-8 py-4 rounded-2xl font-bold tracking-wide transition-all duration-300 flex items-center justify-center gap-2 group";

  const styles = {
    // High-contrast primary with a "glow" shadow
    primary: `
      bg-white text-black 
      hover:bg-green-400 hover:text-white
      shadow-[0_0_20px_rgba(255,255,255,0.05)]
      hover:shadow-[0_0_30px_rgba(34,197,94,0.3)]
    `,

    // Subtle glass-morphism secondary
    secondary: `
      bg-white/5 text-white border border-white/10 
      hover:bg-white/10 hover:border-white/20
      backdrop-blur-md
    `,

    // Ghost/Outline style
    outline: `
      bg-transparent text-gray-300 border border-white/10
      hover:border-green-400 hover:text-white
    `,
  };

  return (
    <motion.button
      whileHover={{ y: -2 }} // Subtle lift is more "premium" than just scale
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`${base} ${styles[type]} ${className}`}
    >
      {/* Glossy Overlay (The secret to expensive-looking buttons) */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      </div>

      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}