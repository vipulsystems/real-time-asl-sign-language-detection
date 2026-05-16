import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Section from "../components/ui/Section";

let lastUpdate = 0; // 🔥 prevents flicker

export default function Detector() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [sign, setSign] = useState("");
  const [sentence, setSentence] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { width: 1280, height: 720 } })
        .then((stream) => {
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

    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.7)
    );

    const formData = new FormData();
    formData.append("file", blob);

    try {
      const res = await fetch("http://localhost:8000/detect", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      console.log(data); // 🔍 debug

      setSign(data.sign);
      setConfidence(Math.round(data.confidence * 100));

      // ✅ USE TEXT INSTEAD OF SENTENCE
      if (data.text) {
        const now = Date.now();

        if (now - lastUpdate > 1200) {
          setSentence(data.text);
          lastUpdate = now;
        }
      } else {
        setSentence("");
      }

    } catch (err) {
      console.error("Neural Link Error:", err);
    }
  };

  const speak = () => {
    if (!sentence) return;

    const synth = window.speechSynthesis;

    if (synth.speaking) {
      synth.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(sentence);

    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.lang = "en-US";

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    synth.speak(utterance);
  };

  return (
    <Section title="Live Translator" subtitle="Universal Sign Engine">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* CAMERA (SMALLER NOW) */}
        <div className="relative glass-card p-4 rounded-[3rem] border border-white/10 bg-black shadow-2xl overflow-hidden">
          <div className="relative aspect-video max-w-[600px] mx-auto rounded-[2rem] overflow-hidden bg-zinc-900">
            
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover opacity-80 contrast-125"
            />

            {/* HUD */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

              {/* Confidence */}
              <div className="absolute top-4 right-4 bg-black/60 px-3 py-1 rounded-lg border border-white/10">
                <span className="text-xs text-white/60">Confidence</span>
                <div className="text-sm font-bold text-[var(--primary)]">
                  {confidence}%
                </div>
              </div>

              {/* Sign */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={sign}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className="bg-[var(--primary)] text-black px-6 py-2 rounded-full font-bold text-lg"
                  >
                    {sign || "Detecting..."}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* OUTPUT */}
        <div className="glass-card p-8 rounded-[2rem] border border-white/10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            {sentence || "Show a gesture..."}
          </h2>

          {/* SPEAK BUTTON */}
          <button
            onClick={speak}
            disabled={!sentence || isSpeaking}
            className="mt-6 px-6 py-3 rounded-full bg-[var(--primary)] text-black font-bold"
          >
            {isSpeaking ? "Speaking..." : "🔊 Speak"}
          </button>
        </div>

      </div>

      <canvas ref={canvasRef} className="hidden" />
    </Section>
  );
}