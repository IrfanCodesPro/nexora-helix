import React from "react";
import { Shield, Orbit, Award, Layers } from "lucide-react";

interface HeroProps {
  onGetStarted: () => void;
  onBrowseInnovations: () => void;
}

export default function Hero({ onGetStarted, onBrowseInnovations }: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pb-28 px-6 border-b border-slate-900 bg-black">
      {/* Pitch-black canvas without grid lines or glows as explicitly requested by user */}

      <div className="relative max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Supreme Brand Hero Logo Image - Replaces the previous plain text */}
        <div className="relative mb-8 flex justify-center w-full max-w-2xl md:max-w-4xl px-4">
          <img 
            src="/nexoralogo.jpeg" 
            alt="Nexora Helix Logo" 
            className="w-full h-auto object-contain max-h-[350px] md:max-h-[420px]"
            referrerPolicy="no-referrer"
          />
        </div>
        {/* Description message */}
        <p className="text-sm md:text-lg text-slate-400 max-w-2xl leading-relaxed font-sans mb-10 text-center font-normal">
          We engineer elite, custom, client-deployable research and business software. Transform your conceptual ideations into responsive, industry-grade architectures verified by rigorous technical mentorship.
        </p>

        {/* Interaction call to action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md">
          <button
            onClick={onGetStarted}
            className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-gradient-to-r from-silver-light via-slate-100 to-cyan-glow text-[#030712] font-black text-xs uppercase tracking-[0.15em] transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(0,229,255,0.4)] cursor-pointer"
          >
            Launch Your Project
          </button>
          <button
            onClick={onBrowseInnovations}
            className="w-full sm:w-auto px-8 py-3.5 rounded-lg border border-slate-700 hover:border-cyan-glow text-silver-light hover:text-cyan-glow font-bold text-xs uppercase tracking-[0.15em] bg-space-card/40 hover:bg-space-card/90 transition-all cursor-pointer"
          >
            Our Innovations
          </button>
        </div>

        {/* Highlights Banner mimicking electronic console */}
        <div className="w-full mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl border border-cyan-glow/10 bg-space-card/20 backdrop-blur-sm">
          <div className="text-center p-2 border-r border-slate-850 last:border-0">
            <p className="text-xl md:text-2xl font-black text-white font-sans">AI & ML</p>
            <p className="text-[9px] uppercase tracking-wider text-cyan-cyan text-silver-dark font-mono mt-1">Autonomous Systems</p>
          </div>
          <div className="text-center p-2 border-r border-slate-850 last:border-0">
            <p className="text-xl md:text-2xl font-black text-white font-sans">FULL-STACK</p>
            <p className="text-[9px] uppercase tracking-wider text-silver-dark font-mono mt-1">High-Speed Web</p>
          </div>
          <div className="text-center p-2 border-r border-slate-850 last:border-0">
            <p className="text-xl md:text-2xl font-black text-white font-sans">AGENTIC AI</p>
            <p className="text-[9px] uppercase tracking-wider text-silver-dark font-mono mt-1">Cognitive Swarms</p>
          </div>
          <div className="text-center p-2 last:border-0">
            <p className="text-xl md:text-2xl font-black text-white font-sans">SUPPORT</p>
            <p className="text-[9px] uppercase tracking-wider text-silver-dark font-mono mt-1">1:1 Mentorship</p>
          </div>
        </div>

        {/* Slogan details on the poster */}
        <div className="mt-8 flex flex-col md:flex-row gap-6 text-xs text-silver-dark uppercase tracking-widest font-mono">
          <span className="flex items-center gap-2 justify-center">
            <Shield size={14} className="text-cyan-glow" /> Smart AI Architectures
          </span>
          <span className="hidden md:inline text-slate-800">|</span>
          <span className="flex items-center gap-2 justify-center">
            <Layers size={14} className="text-cyan-glow" /> Original Source Code included
          </span>
          <span className="hidden md:inline text-slate-800">|</span>
          <span className="flex items-center gap-2 justify-center">
            <Award size={14} className="text-cyan-glow" /> IEEE Research Compliant
          </span>
        </div>
      </div>
    </section>
  );
}
