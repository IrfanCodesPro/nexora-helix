import React from "react";
import { 
  Bot, 
  Code, 
  Settings, 
  BookOpen, 
  Terminal, 
  Layers, 
  Users, 
  Compass, 
  BadgePercent, 
  Sparkles,
  ArrowUpRight,
  Tv
} from "lucide-react";

export default function Services() {
  const coreServices = [
    {
      icon: Bot,
      title: "Agentic AI Solutions & Agents",
      desc: "Architecting autonomous intelligent agents that schedule, evaluate, audit, and transact securely over high-utility networks."
    },
    {
      icon: Code,
      title: "Full Stack Web Development",
      desc: "Robust client-server infrastructures using modern Web assets, optimized database relays, and responsive user-facing screens."
    },
    {
      icon: Terminal,
      title: "AI & Machine Learning Projects",
      desc: "Neural models, computer vision arrays, semantic classifiers, and interactive prediction matrices constructed securely."
    },
    {
      icon: Layers,
      title: "Complete Source Code Included",
      desc: "Receive beautifully documented, structured, and deployment-ready clean codebases with zero missing references."
    },
    {
      icon: BookOpen,
      title: "PPT & Research Documentation",
      desc: "Academic & corporate review compliance ready with professional slides templates and exhaustive project documentation."
    },
    {
      icon: Tv,
      title: "IEEE & Custom Architectures",
      desc: "Tailored software builds mapping perfectly to modern research journals (IEEE) and custom developer pipelines."
    },
    {
      icon: Users,
      title: "Individual & Team Collaborations",
      desc: "Full management support for solo developer projects or coordinated team final year milestones."
    },
    {
      icon: Settings,
      title: "Dynamic Project Customization",
      desc: "Need custom fields or database updates? We fine-tune models and interfaces to map precisely to code goals."
    },
    {
      icon: Compass,
      title: "1-on-1 Mentorship & Support",
      desc: "We explain core architectures, run deployment installations, and guide students safely through academic examinations."
    }
  ];

  return (
    <section id="services" className="py-20 px-6 border-b border-slate-900 bg-black relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h3 className="text-xs uppercase tracking-[0.3em] text-cyan-glow font-mono font-bold mb-3 animate-pulse">
            PLATFORM CAPABILITIES
          </h3>
          <h2 className="text-3xl md:text-5xl font-black tracking-widest text-white uppercase font-sans">
            OUR INNOVATIVE <span className="text-cyan-glow">SERVICES</span>
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-silver-light to-cyan-glow mx-auto mt-4"></div>
          <p className="text-xs text-silver-dark uppercase tracking-widest mt-4">
            From Idea to Deployment — Engineered for students and professionals
          </p>
        </div>

        {/* Services Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreServices.map((srv, index) => {
            const IconComponent = srv.icon;
            return (
              <div 
                key={index}
                className="group relative rounded-xl border border-slate-800 p-6 bg-space-card/25 hover:bg-space-card/75 transition-all duration-300 hover:border-cyan-glow/50 flex flex-col justify-between"
              >
                <div>
                  <div className="p-3 w-fit rounded-lg bg-cyan-glow/5 border border-cyan-glow/20 mb-5 group-hover:bg-cyan-glow/10 group-hover:border-cyan-glow/40 transition-colors">
                    <IconComponent className="h-6 w-6 text-cyan-glow" />
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-white mb-2 tracking-wide uppercase font-sans">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-silver-dark leading-relaxed font-sans mt-2">
                    {srv.desc}
                  </p>
                </div>
                
                <div className="mt-6 pt-4 border-t border-slate-900 flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-slate-500 group-hover:text-cyan-glow transition-colors">
                  <span>Engineered Blueprint</span>
                  <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Poster Student Special Offer Announcement Banner styled as space HUD */}
        <div className="mt-16 overflow-hidden rounded-2xl border border-cyan-glow/30 bg-gradient-to-r from-space-card/85 to-slate-950/20 p-8 relative">

          <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
            <div className="flex gap-4 items-start text-left">
              <div className="p-3.5 rounded-xl bg-cyan-glow/10 border border-cyan-glow/30 shrink-0 text-cyan-glow">
                <BadgePercent size={32} />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/40 text-[9px] font-bold font-mono text-amber-500 uppercase tracking-widest">
                  SPECIAL CAMPAIGN
                </span>
                <h4 className="text-lg md:text-2xl font-extrabold text-white tracking-widest uppercase mt-2.5 font-sans">
                  STUDENT SPECIAL OFFERS AVAILABLE
                </h4>
                <p className="text-xs text-silver-dark leading-relaxed font-sans max-w-2xl mt-1">
                  We empower candidates toward professional excellence with verified discount brackets, adaptive payment structures, templates setups, and extensive examine-review blueprints.
                </p>
              </div>
            </div>

            <div className="text-center md:text-right px-6 py-4 rounded-xl border border-slate-800 bg-space-black shrink-0">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-[#00E5FF] font-mono justify-center md:justify-end mb-1">
                <Sparkles size={11} />
                <span>Our Motto</span>
              </div>
              <p className="text-sm font-extrabold text-white tracking-wider font-sans uppercase">
                QUALITY PROJECTS.
              </p>
              <p className="text-sm font-extrabold text-cyan-glow tracking-wider font-sans uppercase">
                REAL IMPACT.
              </p>
              <p className="text-[10px] text-silver-dark font-mono uppercase tracking-widest mt-1">
                BRIGHTER FUTURE.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
