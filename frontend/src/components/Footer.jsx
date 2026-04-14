import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-white/10 bg-gradient-to-b from-transparent to-white/[0.03] pt-16 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* COLUMN 1: BRANDING */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-xs font-black text-black shadow-lg shadow-green-500/20">
                R
              </div>
              <span className="font-black tracking-tight text-white uppercase text-base">
                Real-Time <span className="text-green-400">SLT</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Advanced neural interface for sign language recognition. 
              Bridging communication gaps through high-performance computer vision.
            </p>
          </div>

          {/* COLUMN 2: TECH STACK */}
          <div className="space-y-5">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              Project Architecture
            </h4>
            <div className="flex flex-wrap gap-2.5">
              {["React", "TensorFlow.js", "MediaPipe", "Framer Motion"].map((tech) => (
                <span 
                  key={tech} 
                  className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs font-semibold text-gray-300 hover:border-green-500/50 transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* COLUMN 3: STATUS & METRICS */}
          <div className="space-y-5 md:text-right">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              Engine Status
            </h4>
            <div className="flex items-center md:justify-end gap-3">
              <span className="text-sm font-bold text-green-400">System Ready</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]" />
            </div>
            <p className="text-sm text-gray-500">
              Build Version: 1.0.4-stable
            </p>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            © {currentYear} Real-Time Sign Language Translation
          </p>
          
          <div className="flex gap-8">
            <a href="#" className="text-xs text-gray-400 hover:text-green-400 transition-colors uppercase font-black tracking-widest">Docs</a>
            <a href="#" className="text-xs text-gray-400 hover:text-green-400 transition-colors uppercase font-black tracking-widest">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
}