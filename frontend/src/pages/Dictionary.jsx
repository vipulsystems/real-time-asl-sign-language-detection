import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const signs = letters.map(letter => ({
  word: letter,
  image: `/signs/${letter}.png`,
  description: `Official ASL gesture for the letter ${letter}`
}));

export default function Dictionary() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(null);

  const filtered = signs.filter(sign =>
    sign.word.toLowerCase().includes(query.toLowerCase())
  );

  const speak = async (text) => {
    setIsSpeaking(text);
    try {
      const res = await api.post(`/speak?text=${text}`);
      const audioUrl = `http://127.0.0.1:8000/static/${res.data.audio}`;
      const audio = new Audio(audioUrl);
      audio.onended = () => setIsSpeaking(null);
      await audio.play();
    } catch (err) {
      console.error("TTS error:", err);
      setIsSpeaking(null);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-deep)] text-[var(--text-main)] py-12 px-6">
      <div className="max-w-[1400px] mx-auto">
        
        {/* HEADER AREA */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <span className="text-[10px] font-black text-[var(--primary)] uppercase tracking-[0.4em] mb-4 block">
              Reference Database
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">
              SIGN <span className="text-white/20 italic">LEXICON</span>
            </h1>
          </div>
          
          <div className="hidden md:block text-right">
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Index Status</p>
            <p className="text-sm font-bold text-white/60">26/26 MODULES LOADED</p>
          </div>
        </div>

        {/* SEARCH COMMAND INPUT */}
        <div className="max-w-2xl mb-16 relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-[var(--primary)] to-blue-600 rounded-2xl blur opacity-10 group-focus-within:opacity-30 transition duration-500" />
          <div className="relative flex items-center bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden px-6 focus-within:border-[var(--primary)]/50 transition-all">
            <span className="text-white/20 font-mono text-sm mr-4">CMD_</span>
            <input
              type="text"
              placeholder="Query lexicon matrix..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full py-6 bg-transparent outline-none font-medium text-white placeholder:text-white/10 text-lg"
            />
            <div className="flex gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse" />
            </div>
          </div>
        </div>

        {/* DICTIONARY MATRIX */}
        <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((sign, index) => (
              <motion.div
                layout
                key={sign.word}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.01 }}
                whileHover={{ y: -5 }}
              >
                <div className="glass-card glass-sheen group flex flex-col h-full p-6 border border-white/5 rounded-[2.5rem] relative overflow-hidden">
                  {/* Identification Watermark */}
                  <span className="absolute top-4 right-6 text-[10px] font-mono text-white/10">MOD_{sign.word}</span>
                  
                  <div className="cursor-pointer flex-grow pt-4" onClick={() => setSelected(sign)}>
                    <div className="aspect-square mb-6 overflow-hidden rounded-2xl bg-black/20 flex items-center justify-center border border-white/5 group-hover:border-[var(--primary)]/20 transition-colors">
                      <img
                        src={sign.image}
                        alt={sign.word}
                        className="w-24 h-24 object-contain group-hover:scale-110 transition-transform duration-700 brightness-90 group-hover:brightness-110"
                      />
                    </div>
                    <h3 className="text-3xl font-black text-center text-white tracking-tighter group-hover:text-[var(--primary)] transition-colors">
                      {sign.word}
                    </h3>
                  </div>

                  <button
                    onClick={() => speak(sign.word)}
                    className={`mt-6 w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 overflow-hidden relative ${
                      isSpeaking === sign.word 
                      ? "bg-[var(--primary)] text-black" 
                      : "bg-white/[0.03] text-white/40 hover:text-white hover:bg-white/10 border border-white/5"
                    }`}
                  >
                    {isSpeaking === sign.word ? (
                      <div className="flex gap-1 items-end h-3">
                        {[1, 2, 3, 4].map(i => (
                          <motion.div 
                            key={i}
                            animate={{ height: [4, 12, 4] }}
                            transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                            className="w-1 bg-black rounded-full"
                          />
                        ))}
                      </div>
                    ) : (
                      "🔊 SPEAK"
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* DETAIL OVERLAY */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="absolute inset-0 bg-[var(--bg-deep)]/95 backdrop-blur-2xl"
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="relative w-full max-w-xl glass-card p-12 border border-white/10 rounded-[3.5rem] shadow-2xl overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-[var(--primary)]/10 blur-[100px] rounded-full" />

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-10">
                  <div className="bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
                    <span className="text-[10px] font-black text-[var(--primary)] tracking-widest uppercase">Visual Specimen</span>
                  </div>
                  <button onClick={() => setSelected(null)} className="text-white/20 hover:text-white transition-colors text-xl">✕</button>
                </div>

                <div className="bg-black/40 rounded-[2.5rem] p-12 mb-10 flex items-center justify-center border border-white/5 group">
                  <img src={selected.image} alt={selected.word} className="w-56 h-56 object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] group-hover:scale-105 transition-transform duration-700" />
                </div>

                <div className="text-center">
                  <h2 className="text-7xl font-black text-white mb-4 tracking-tighter italic">
                    {selected.word}
                  </h2>
                  <p className="text-[var(--text-muted)] text-lg mb-10 font-medium leading-relaxed">
                    {selected.description}
                  </p>

                  <button
                    onClick={() => speak(selected.word)}
                    className="w-full py-6 bg-white text-black font-black rounded-2xl hover:bg-[var(--primary)] hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-black/40 uppercase tracking-[0.2em] text-xs"
                  >
                    Generate Neural Voice
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}