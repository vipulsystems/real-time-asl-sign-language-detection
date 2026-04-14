import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

const initialLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(letter => ({
  word: letter,
  image: `/signs/${letter}.png`,
}));

export default function Alphabet() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [displaySigns, setDisplaySigns] = useState(initialLetters);
  const [testMode, setTestMode] = useState(false);
  const [revealedCards, setRevealedCards] = useState({});

  const filtered = useMemo(() => 
    displaySigns.filter(sign => sign.word.toLowerCase().includes(query.toLowerCase())),
    [displaySigns, query]
  );

  const masteryCount = Object.keys(revealedCards).length;
  const masteryPercent = (masteryCount / 26) * 100;

  useEffect(() => {
    if (testMode && masteryCount === 26) {
      const duration = 3 * 1000;
      const end = Date.now() + duration;
      const frame = () => {
        confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#22c55e', '#3b82f6'] });
        confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#22c55e', '#3b82f6'] });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    }
  }, [masteryCount, testMode]);

  const handleShuffle = () => {
    setDisplaySigns([...displaySigns].sort(() => Math.random() - 0.5));
    setRevealedCards({});
  };

  const toggleTestMode = () => {
    setTestMode(!testMode);
    setRevealedCards({});
    if (!testMode) setDisplaySigns(initialLetters);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-deep)] text-[var(--text-main)] py-12 px-6">
      <AnimatePresence>
        {masteryCount === 26 && testMode && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-[var(--bg-deep)]/90 backdrop-blur-xl">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="text-center p-16 glass-card border border-[var(--primary)]/30 rounded-[3.5rem] shadow-2xl">
              <div className="text-8xl mb-6 animate-bounce">🏆</div>
              <h2 className="text-6xl font-black text-white mb-3 tracking-tighter">Mastered!</h2>
              <button onClick={toggleTestMode} className="px-10 py-5 bg-white text-black font-black rounded-2xl hover:bg-[var(--primary)] transition-all">RETURN TO LIBRARY</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1400px] mx-auto">
        <nav className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center font-black text-xl">ASL</div>
            <h1 className="text-2xl font-black text-white">SIGNS.<span className="text-[var(--primary)]">IO</span></h1>
          </div>
          <div className="flex bg-white/[0.03] border border-white/5 p-1.5 rounded-2xl">
            <button onClick={() => setTestMode(false)} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase ${!testMode ? "bg-white text-black" : "text-white/40"}`}>Library</button>
            <button onClick={toggleTestMode} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase ${testMode ? "bg-[var(--primary)] text-black" : "text-white/40"}`}>Test Mode</button>
          </div>
        </nav>

        <div className="flex flex-col md:flex-row gap-5 mb-16">
          <input type="text" placeholder="Filter alphabet matrix..." value={query} onChange={(e) => setQuery(e.target.value)} className="flex-1 bg-white/[0.02] border border-white/10 rounded-2xl px-8 py-6 outline-none focus:border-[var(--primary)]/50 transition-all text-white" />
          <button onClick={handleShuffle} className="px-10 py-6 bg-white/[0.02] border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white">🔀 Shuffle</button>
        </div>

        {testMode && (
          <div className="glass-card p-8 rounded-[2.5rem] border border-white/5 mb-16 flex items-center gap-10">
            <div className="text-5xl font-black text-white">{Math.round(masteryPercent)}%</div>
            <div className="flex-1 h-3 bg-white/[0.03] rounded-full overflow-hidden">
              <motion.div className="h-full bg-gradient-to-r from-[var(--primary)] to-emerald-400" animate={{ width: `${masteryPercent}%` }} />
            </div>
          </div>
        )}

        <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((sign, index) => {
              const isRevealed = !testMode || revealedCards[sign.word];
              return (
                <motion.div
                  layout key={sign.word} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -10 }}
                  onClick={() => {
                    if (testMode && !revealedCards[sign.word]) {
                      setRevealedCards(p => ({ ...p, [sign.word]: true }));
                    } else {
                      navigate(`/practice?letter=${sign.word}`);
                    }
                  }}
                  className="group relative cursor-pointer"
                >
                  <div className={`aspect-[4/5] rounded-[2.5rem] border transition-all duration-700 p-8 flex flex-col justify-between overflow-hidden ${isRevealed ? "glass-card border-white/10" : "bg-black/40 border-white/5 border-dashed"}`}>
                    <span className="text-[8rem] absolute -top-10 -left-6 font-black italic text-white/[0.03]">{sign.word}</span>
                    <div className="flex-1 flex items-center justify-center relative z-10">
                      <img src={sign.image} className={`max-h-full transition-all duration-700 ${!isRevealed ? "brightness-0 opacity-0 blur-xl scale-50" : "group-hover:scale-110"}`} alt="sign" />
                      {!isRevealed && <div className="absolute text-4xl font-black text-white/10">?</div>}
                    </div>
                    <div className="z-10">
                      <h3 className={`text-4xl font-black ${isRevealed ? "text-white" : "text-white/5"}`}>{isRevealed ? sign.word : "???"}</h3>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}