import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Section from "../components/ui/Section";

export default function Detector() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [sign, setSign] = useState("");
  const [sentence, setSentence] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } })
        .then(stream => {
          if (videoRef.current) videoRef.current.srcObject = stream;
        });
    }

    const interval = setInterval(captureFrame, 900);
    return () => clearInterval(interval);
  }, []);

  const captureFrame = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || video.readyState !== 4) return;

    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/jpeg", 0.7));
    const formData = new FormData();
    formData.append("file", blob);

    try {
      const res = await fetch("http://localhost:8000/detect", {
        method: "POST",
        body: formData
      });
      const data = await res.json();

      setSign(data.sign);
      setSentence(data.sentence);
      setConfidence(Math.round(data.confidence * 100));
    } catch (err) {
      console.error("Neural Link Error:", err);
    }
  };

  const speak = () => {
    if (!sentence) return;
    setIsSpeaking(true);
    const audio = new Audio(`http://localhost:8000/speak?text=${encodeURIComponent(sentence)}`);
    audio.onended = () => setIsSpeaking(false);
    audio.play().catch(() => setIsSpeaking(false));
  };

  return (
    <Section title="Live Translator" subtitle="Universal Sign Engine">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* VIEWPORT CONTAINER */}
        <div className="relative glass-card p-4 rounded-[3rem] border border-white/10 bg-black shadow-2xl overflow-hidden">
          <div className="relative aspect-video rounded-[2rem] overflow-hidden bg-zinc-900">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover opacity-80 contrast-125" 
            />
            
            {/* HUD SCANNER OVERLAYS */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
              
              {/* Corner Data Brackets */}
              <div className="absolute top-8 left-8 flex flex-col gap-1">
                <span className="text-[10px] font-black text-[var(--primary)] uppercase tracking-widest">Status: Active</span>
                <span className="text-[10px] font-mono text-white/20">BUFF_TYPE: SENTENCE_AUTO</span>
              </div>

              {/* Top Status Badges */}
              <div className="absolute top-8 right-8 flex gap-4">
                <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3">
                  <span className="text-[8px] font-black text-white/40 uppercase">Confidence</span>
                  <span className="text-sm font-mono font-black text-[var(--primary)]">{confidence}%</span>
                </div>
              </div>

              {/* Real-time Sign Label */}
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={sign}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className="bg-[var(--primary)] text-black px-6 py-2 rounded-full font-black text-xl tracking-tighter shadow-[0_0_30px_var(--primary-glow)]"
                  >
                    {sign || "READING..."}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* TRANSLATION OUTPUT BOX */}
        <div className="glass-card p-10 rounded-[2.5rem] border border-white/5 relative">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 w-full">
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-4">Output Sequence</p>
              <div className="min-h-[80px] flex items-center">
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-tight italic">
                  {sentence || <span className="opacity-10">Awaiting stream input...</span>}
                </h2>
              </div>
            </div>

            {/* SPEAK ACTION */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={speak}
              disabled={!sentence || isSpeaking}
              className={`h-24 w-24 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${
                isSpeaking 
                ? "bg-[var(--primary)] border-[var(--primary)] shadow-[0_0_30px_var(--primary)]" 
                : "bg-white/[0.05] border-white/10 text-white hover:border-[var(--primary)]/50"
              }`}
            >
              {isSpeaking ? (
                <div className="flex gap-1 h-6">
                  {[1,2,3].map(i => (
                    <motion.div 
                      key={i} 
                      animate={{ height: [8, 24, 8] }} 
                      transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                      className="w-1.5 bg-black rounded-full" 
                    />
                  ))}
                </div>
              ) : (
                <span className="text-2xl">🔊</span>
              )}
            </motion.button>
          </div>
        </div>

      </div>
      <canvas ref={canvasRef} className="hidden" />
    </Section>
  );
}