import Section from "../components/ui/Section";
import Card from "../components/ui/Card";
import { motion } from "framer-motion";

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Vision Input",
      desc: "The system initializes the webcam stream with low-latency frame capturing for real-time analysis.",
      tech: "MediaPipe Stream",
      icon: "📷"
    },
    {
      number: "02",
      title: "Neural Mapping",
      desc: "AI identifies 21 key hand landmarks and calculates spatial coordinates in a 3D coordinate system.",
      tech: "Landmark Tracking",
      icon: "🧠"
    },
    {
      number: "03",
      title: "Inference & Output",
      desc: "Our custom TensorFlow model classifies the gesture and outputs the translated text instantly.",
      tech: "TF.js Classifier",
      icon: "✨"
    }
  ];

  return (
    <Section 
      subtitle="The Process" 
      title="How it Works" 
      id="how-it-works"
    >
      <div className="relative grid md:grid-cols-3 gap-8">
        
        {/* DECORATIVE CONNECTING LINE (Visible on Desktop) */}
        <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-[var(--primary)]/20 to-transparent z-0" />

        {steps.map((step, index) => (
          <Card 
            key={index} 
            delay={index * 0.2} 
            className="glass-card glass-sheen relative z-10 group p-8 border border-white/5 hover:border-[var(--primary)]/30 transition-all duration-500"
          >
            <div className="flex flex-col h-full">
              
              {/* STEP HEADER */}
              <div className="flex justify-between items-start mb-8">
                <span className="text-5xl font-black text-white/[0.03] group-hover:text-[var(--primary)]/10 transition-colors duration-500 italic">
                  {step.number}
                </span>
                <div className="text-2xl w-14 h-14 bg-white/[0.03] rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-[var(--primary)]/50 group-hover:shadow-[0_0_20px_var(--primary-glow)] transition-all duration-500">
                  {step.icon}
                </div>
              </div>

              {/* CONTENT */}
              <h3 className="text-xl font-bold text-white mb-4 tracking-tight group-hover:text-[var(--primary)] transition-colors">
                {step.title}
              </h3>
              <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-8 flex-grow">
                {step.desc}
              </p>

              {/* TECH TAG */}
              <div className="pt-5 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--primary)]">
                    {step.tech}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* FOOTER NOTE */}
      <motion.p 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-16 text-[10px] text-gray-600 font-mono uppercase tracking-[0.3em]"
      >
        Real-time Inference latency: ~24ms
      </motion.p>
    </Section>
  );
}