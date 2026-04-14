import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

export default function Navbar() {
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Alphabet", path: "/alphabet" },
    { name: "Dictionary", path: "/dictionary" },
    { name: "Practice", path: "/practice" },
    { name: "Detector", path: "/detector" },
    { name: "Spelling", path: "/spelling" },
  ];

  return (
    <header className="sticky top-0 z-50 glass-nav">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
        
        {/* OFFICIAL PROJECT LOGO */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center gap-3"
        >
          {/* Geometric "R" Icon (Stands for Real-Time) */}
          <div className="relative w-10 h-10 flex items-center justify-center group cursor-default">
            <div className="absolute inset-0 bg-green-500/20 blur-lg rounded-full animate-pulse group-hover:bg-green-500/40 transition-all" />
            <div className="relative w-full h-full bg-white text-black rounded-xl flex items-center justify-center font-black text-xl shadow-xl transform group-hover:rotate-6 transition-transform">
              R
            </div>
          </div>

          {/* Stacked Branding */}
          <div className="flex flex-col leading-none">
            <span className="text-[10px] font-bold tracking-[0.3em] text-gray-500 uppercase">
              Real-Time
            </span>
            <h1 className="text-lg font-black tracking-tight text-white uppercase">
              SIGN <span className="text-green-400">LANGUAGE</span>
            </h1>
          </div>
        </motion.div>

        {/* NAVIGATION LINKS */}
        <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/5">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/"}
              className={({ isActive }) =>
                `relative px-4 py-2 text-xs font-bold tracking-wide uppercase transition-all duration-300 rounded-lg ${
                  isActive ? "text-green-400" : "text-gray-400 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className="relative z-10">{link.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-glow"
                      className="absolute inset-0 bg-white/5 rounded-lg shadow-[inset_0_0_12px_rgba(34,197,94,0.1)] border border-green-500/20"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}