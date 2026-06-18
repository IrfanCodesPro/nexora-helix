import React from "react";
import { PUBLIC_ACHIEVEMENTS } from "../types";
import { Award, Zap, BookOpen, Clock, Activity, Target } from "lucide-react";

export default function Achievements() {
  const getIcon = (id: string) => {
    switch (id) {
      case "ach-1":
        return <Target className="h-6 w-6 text-cyan-glow" />;
      case "ach-2":
        return <Award className="h-6 w-6 text-cyan-glow animate-pulse" />;
      case "ach-3":
        return <BookOpen className="h-6 w-6 text-cyan-glow" />;
      default:
        return <Clock className="h-6 w-6 text-cyan-glow" />;
    }
  };

  return (
    <section id="achievements" className="py-20 px-6 border-b border-slate-900 bg-black relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 flex flex-col items-center">
          {/* Nexora Logo centered in Achievements section */}
          <img 
            src="/nexoralogo.jpeg" 
            alt="Nexora Helix Logo" 
            className="h-16 w-auto object-contain mb-5"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />

          <h3 className="text-xs uppercase tracking-[0.3em] text-cyan-glow font-mono font-bold mb-3">
            VERIFIED SUCCESS INDEX
          </h3>
          <h2 className="text-3xl md:text-5xl font-black tracking-widest text-[#FFFFFF] font-sans">
            OUR <span className="text-cyan-glow">ACHIEVEMENTS</span>
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-silver-light to-cyan-glow mx-auto mt-4"></div>
          <p className="text-xs text-silver-dark uppercase tracking-widest mt-4">
            A concrete summary of our engineering milestones across academic spheres
          </p>
        </div>

        {/* Dashboard Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PUBLIC_ACHIEVEMENTS.map((ach) => (
            <div 
              key={ach.id}
              className="relative p-6 rounded-xl border border-slate-800 bg-space-card/30 hover:bg-space-card/85 transition-all duration-300 hover:border-cyan-glow/65 hover:scale-[1.02] flex flex-col justify-between"
            >
              {/* Floating ID Tag */}
              <span className="absolute top-4 right-4 text-[9px] font-mono text-slate-600 tracking-widest">
                {ach.date}
              </span>

              <div className="mb-6">
                {/* Metric Icon */}
                <div className="p-3 bg-cyan-glow/5 border border-cyan-glow/25 rounded-lg w-fit mb-5">
                  {getIcon(ach.id)}
                </div>

                {/* Big Metric Display */}
                <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-cyan-glow tracking-tight uppercase font-sans mb-2">
                  {ach.value}
                </p>

                <h4 className="text-xs font-black uppercase text-cyan-glow tracking-widest mb-3.5">
                  {ach.title}
                </h4>

                <p className="text-xs text-silver-dark leading-relaxed font-sans">
                  {ach.description}
                </p>
              </div>

              {/* Decorative terminal footer */}
              <div className="pt-3 border-t border-slate-900/40 flex justify-between items-center text-[8px] font-mono tracking-widest text-slate-600">
                <span>SYSTEM STATUS // OK</span>
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-glow animate-ping"></span>
              </div>
            </div>
          ))}
        </div>

        {/* Highlight Terminal block detailing active status */}
        <div className="mt-12 p-5 rounded-lg border border-slate-800 bg-slate-950/80 font-mono text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex gap-2.5 items-center">
            <Activity size={16} className="text-[#00E5FF] animate-pulse" />
            <p className="text-slate-400">
              <span className="text-white font-bold">&gt; NEXORA_HELIX_ORACLE_UPDATE:</span> Academic Year 2026 systems active. New IEEE project guidelines integrated successfully.
            </p>
          </div>
          <span className="text-[10px] bg-cyan-glow/10 text-cyan-glow px-2.5 py-1 rounded border border-cyan-glow/25 shrink-0 uppercase tracking-widest">
            COGNITIVE MAPPING: ON
          </span>
        </div>

      </div>
    </section>
  );
}
