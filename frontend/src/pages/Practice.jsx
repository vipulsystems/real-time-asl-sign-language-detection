import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Section from "../components/ui/Section";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function Practice() {
  const [searchParams] = useSearchParams();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Get letter from URL or default to 'A'
  const [targetLetter, setTargetLetter] = useState(searchParams.get("letter")?.toUpperCase() || "A");
  const [detected, setDetected] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Sync state if URL changes
  useEffect(() => {
    const letter = searchParams.get("letter");
    if (letter && alphabet.includes(letter.toUpperCase())) {
      setTargetLetter(letter.toUpperCase());
    }
  }, [searchParams]);

  useEffect(() => {
    let stream = null;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) { console.error("Camera Error:", err); }
    };

    startCamera();
    const interval = setInterval(() => {
      if (!isSuccess && !isProcessing) captureFrame();
    }, 1000);

    return () => {
      clearInterval(interval);
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
  }, [targetLetter, isSuccess, isProcessing]);

  const captureFrame = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || video.readyState !== 4) return;

    setIsProcessing(true);
    const ctx = canvas.getContext("2d");
    canvas.width = 640; canvas.height = 480;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise(r => canvas.toBlob(r, "image/jpeg", 0.7));
    const formData = new FormData();
    formData.append("file", blob);
    formData.append("target", targetLetter);

    try {
      const res = await fetch("http://localhost:8000/practice-check", { method: "POST", body: formData });
      const data = await res.json();
      setDetected(data.detected);
      setConfidence(Math.round(data.confidence * 100));

      if (data.correct && data.confidence > 0.65) {
        setIsSuccess(true);
        setTimeout(() => {
          setTargetLetter(alphabet[(alphabet.indexOf(targetLetter) + 1) % 26]);
          setIsSuccess(false);
        }, 2000);
      }
    } catch (err) { console.error("API Error:", err);
    } finally { setIsProcessing(false); }
  };

  return (
    <Section title="Neural Practice" subtitle={`Focus: ${targetLetter}`}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-8 rounded-[2.5rem] border border-white/5 text-center">
            <p className="text-[10px] font-black text-[var(--primary)] uppercase tracking-[0.3em] mb-4">Target Gesture</p>
            <motion.div key={targetLetter} initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="text-[12rem] font-black text-white italic">{targetLetter}</motion.div>
            <img src={`/signs/${targetLetter}.png`} className="w-32 h-32 mx-auto opacity-20 grayscale" alt="hint" />
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="glass-card p-4 rounded-[3rem] bg-black relative overflow-hidden shadow-2xl">
            <div className="relative aspect-video rounded-[2rem] overflow-hidden bg-zinc-900">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover opacity-60" />
              <AnimatePresence>
                {isSuccess && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[var(--primary)]/20 backdrop-blur-sm flex items-center justify-center z-20">
                    <div className="bg-white text-black px-8 py-3 rounded-full font-black text-2xl">MATCH CONFIRMED</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/5 text-center">
                <span className="block text-[8px] text-white/20 font-black uppercase">Detected</span>
                <span className="text-2xl font-mono font-black text-white">{detected || "---"}</span>
              </div>
              <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/5 text-center">
                <span className="block text-[8px] text-white/20 font-black uppercase">Confidence</span>
                <span className="text-2xl font-mono font-black text-white">{confidence}%</span>
              </div>
              <div className="bg-white/[0.03] p-4 rounded-2xl flex items-center justify-center font-black text-[10px] text-[var(--primary)]">
                {isProcessing ? "ANALYZING..." : "LIVE_SYNC"}
              </div>
            </div>
          </div>
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </Section>
  );
}