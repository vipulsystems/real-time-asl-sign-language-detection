import Webcam from "react-webcam";
import { useRef, useState, useEffect } from "react";
import api from "../../services/api";
import { motion, AnimatePresence } from "framer-motion";
import GestureStatus from "./GestureStatus";

export default function CameraFeed({ onDetect }: any) {
  const webcamRef = useRef<Webcam | null>(null);
  const [text, setText] = useState("System Idle");
  const [confidence, setConfidence] = useState<number | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const capture = async () => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    setIsAnalyzing(true);
    const blob = await fetch(imageSrc).then((r) => r.blob());
    const formData = new FormData();
    formData.append("file", blob, "capture.jpg");

    try {
      const res = await api.post("/detect", formData);
      const detectedText = res.data.text || "Unknown";
      const conf = res.data.confidence || 0;

      setText(detectedText);
      setConfidence(conf);
      if (detectedText !== "Unknown") {
        setHistory((prev) => [detectedText, ...prev].slice(0, 8));
      }

      if (onDetect) onDetect(detectedText);
    } catch (err) {
      console.error("Detection error:", err);
      setText("Link Failure");
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    let interval: any;
    if (isLive) {
      interval = setInterval(() => { capture(); }, 1200);
    }
    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <div className="glass-card p-6 md:p-10 rounded-[3rem] border border-white/5 relative overflow-hidden bg-white/[0.01]">
      
      {/* 1. ENGINE TELEMETRY HEADER */}
      <div className="flex justify-between items-center mb-8 px-2">
        <div className="flex items-center gap-4">
          <div className="relative flex h-3 w-3">
            <div className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-40 ${isLive ? 'bg-[var(--primary)]' : 'bg-red-500'}`} />
            <div className={`relative inline-flex rounded-full h-3 w-3 ${isLive ? 'bg-[var(--primary)] shadow-[0_0_10px_var(--primary)]' : 'bg-red-500'}`} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">
              {isLive ? "Neural Link: Active" : "Neural Link: Standby"}
            </span>
            <span className="text-[8px] font-mono text-white/20 uppercase">Core_v1.0.4 // Stream_Encoded</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-mono text-[var(--primary)] bg-[var(--primary)]/10 px-3 py-1 rounded-md border border-[var(--primary)]/20">
            LATENCY: {isAnalyzing ? "142ms" : "0ms"}
          </span>
        </div>
      </div>

      {/* 2. THE VIEWPORT (THE STAGE) */}
      <div className="relative aspect-video overflow-hidden rounded-[2.5rem] border border-white/10 bg-black group shadow-2xl">
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className={`w-full h-full object-cover transition-opacity duration-700 ${isLive ? 'opacity-70' : 'opacity-20'}`}
          videoConstraints={{ facingMode: "user" }}
        />

        {/* AI HUD Overlay */}
        <div className="absolute inset-0 pointer-events-none p-8 flex flex-col justify-between">
          {/* Scanning Line */}
          <AnimatePresence>
            {isLive && (
              <motion.div 
                initial={{ top: "-10%" }}
                animate={{ top: "110%" }}
                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                className="absolute left-0 right-0 h-[100px] bg-gradient-to-b from-transparent via-[var(--primary)]/10 to-transparent z-20 opacity-50"
              />
            )}
          </AnimatePresence>

          {/* HUD Brackets */}
          <div className="flex justify-between w-full">
            <div className="w-10 h-10 border-t-2 border-l-2 border-white/20 rounded-tl-xl" />
            <div className="w-10 h-10 border-t-2 border-r-2 border-white/20 rounded-tr-xl" />
          </div>

          {/* Processing Glitch Effect */}
          {isAnalyzing && (
            <div className="absolute inset-0 bg-[var(--primary)]/5 backdrop-invert-[0.05] animate-pulse" />
          )}

          <div className="flex justify-between w-full items-end">
            <div className="w-10 h-10 border-b-2 border-l-2 border-white/20 rounded-bl-xl" />
            <div className="w-10 h-10 border-b-2 border-r-2 border-white/20 rounded-br-xl" />
          </div>
          
          {/* Center Target */}
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-64 h-64 border border-white/5 rounded-full flex items-center justify-center opacity-20">
                <div className="w-48 h-48 border border-white/10 rounded-full border-dashed animate-[spin_20s_linear_infinite]" />
             </div>
          </div>
        </div>
      </div>

      {/* 3. DIAGNOSTICS & CONTROLS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
        
        {/* Left: Result Telemetry */}
        <div className="space-y-6">
          <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl">
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-4">Detected Output</p>
            <GestureStatus text={text} />
          </div>
          
          {confidence !== null && (
            <div className="px-2">
              <div className="flex justify-between text-[9px] font-black text-white/30 uppercase tracking-[0.3em] mb-3">
                <span>Signal Strength</span>
                <span className="text-[var(--primary)]">{(confidence * 100).toFixed(1)}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${confidence * 100}%` }}
                  className="h-full bg-gradient-to-r from-[var(--primary)] to-emerald-400 shadow-[0_0_15px_var(--primary-glow)]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Right: Command Controls */}
        <div className="flex flex-col gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={capture}
            disabled={isAnalyzing}
            className="w-full py-6 bg-white text-black font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-[var(--primary)] transition-all duration-300 shadow-xl text-xs uppercase tracking-widest"
          >
            {isAnalyzing ? "ANALYZING_DATA..." : "EXECUTE_CAPTURE"}
          </motion.button>

          <button
            onClick={() => setIsLive(!isLive)}
            className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all border-2 ${
              isLive 
              ? "bg-red-500/5 border-red-500/20 text-red-500 hover:bg-red-500/10" 
              : "bg-[var(--primary)]/5 border-[var(--primary)]/20 text-[var(--primary)] hover:bg-[var(--primary)]/10"
            }`}
          >
            {isLive ? "TERMINATE_FEED" : "INITIALIZE_LIVE_LINK"}
          </button>
        </div>
      </div>

      {/* 4. CHRONOLOGY (History) */}
      <div className="mt-12 pt-10 border-t border-white/5">
        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-6">
          Sequence History
        </h3>
        <div className="flex flex-wrap gap-3">
          <AnimatePresence mode="popLayout">
            {history.map((item, index) => (
              <motion.span
                layout
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                key={index + item}
                className="px-5 py-2.5 bg-white/[0.03] border border-white/5 rounded-xl text-[10px] font-black text-white/60 uppercase tracking-widest hover:border-[var(--primary)]/30 transition-colors"
              >
                {item}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}