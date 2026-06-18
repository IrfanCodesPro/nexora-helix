import React, { useState } from "react";
import { Innovation, PREVIOUS_INNOVATIONS } from "../types";
import { X, BookOpen, Fingerprint } from "lucide-react";

export default function Innovations() {
  const [selectedProject, setSelectedProject] = useState<Innovation | null>(null);

  return (
    <section id="innovations" className="py-20 px-6 border-b border-slate-900 bg-black relative">
      {/* Pitch-black background with NO radial glow backdrops or overlays as requested */}
      
      <div className="max-w-7xl mx-auto">
        
        {/* Section Heading */}
        <div className="text-center mb-16 relative">
          <h3 className="text-xs uppercase tracking-[0.3em] text-cyan-glow font-mono font-bold mb-3">
            TECHNICAL PORTFOLIOS
          </h3>
          <h2 className="text-3xl md:text-5xl font-black tracking-widest text-[#FFFFFF] font-sans">
            OUR <span className="text-cyan-glow">PROJECTS</span>
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-silver-light to-cyan-glow mx-auto mt-4"></div>
          <p className="text-xs text-silver-dark uppercase tracking-widest mt-4">
            Interactive blueprints of successfully launched final year assets
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PREVIOUS_INNOVATIONS.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="group relative rounded-xl border border-slate-800 bg-[#070b19]/30 p-6 md:p-8 cursor-pointer overflow-hidden transition-all duration-300 hover:border-cyan-glow/60 hover:bg-[#070b19]/80 hover:scale-[1.01]"
            >
              {/* Corner Sci-fi Notch Deco */}
              <div className="absolute top-0 right-0 h-4 w-4 bg-slate-800 group-hover:bg-cyan-glow transition-colors origin-top-right rotate-45 transform translate-x-2 -translate-y-2"></div>
              
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 text-[10px] uppercase tracking-widest font-mono font-bold rounded border border-cyan-glow/30 text-cyan-glow bg-cyan-glow/5">
                  {project.category}
                </span>
                <span className="text-[11px] text-silver-dark font-mono uppercase bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {project.metrics}
                </span>
              </div>

              <h3 className="text-lg md:text-xl font-extrabold text-white group-hover:text-cyan-glow tracking-wider transition-colors mb-2 uppercase font-sans">
                {project.title}
              </h3>
              
              <p className="text-xs text-cyan-glow/85 uppercase tracking-wider font-mono mb-4">
                {project.tagline}
              </p>

              <p className="text-xs text-silver-dark leading-relaxed mb-6 font-sans">
                {project.abstract}
              </p>

              {/* Technologies array */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="text-[9px] font-mono tracking-widest uppercase bg-slate-950 text-slate-400 px-2 py-1 rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Live deployments port links */}
              {(project.demoUrl || project.extraDemoUrl) && (
                <div className="flex flex-col gap-1.5 mt-4 p-3 rounded bg-black/60 border border-slate-900" onClick={(e) => e.stopPropagation()}>
                  <p className="text-[9px] uppercase tracking-wider text-slate-500 font-mono">Live system deployment:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {project.demoUrl && (
                      <a 
                        href={project.demoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 text-[10px] bg-cyan-glow/10 hover:bg-cyan-glow/20 border border-cyan-glow/40 hover:border-cyan-glow text-cyan-glow rounded font-mono transition-all font-semibold"
                      >
                        Launch Main System ↗
                      </a>
                    )}
                    {project.extraDemoUrl && (
                      <a 
                        href={project.extraDemoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 text-[10px] bg-electric/10 hover:bg-electric/20 border border-electric/40 hover:border-electric text-electric rounded font-mono transition-all font-semibold"
                      >
                        Webinar Node ↗
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Read Abstract Button */}
              <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-cyan-glow tracking-widest mt-6 group-hover:translate-x-1.5 transition-transform">
                <BookOpen size={12} />
                <span>Decompress Technical Abstract</span>
              </div>
            </div>
          ))}
        </div>

        {/* Abstract Modal / Popup Details view */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-fadeIn" onClick={() => setSelectedProject(null)}>
            <div 
              className="relative w-full max-w-2xl rounded-2xl border border-cyan-glow/60 bg-black p-6 md:p-10 [box-shadow:0_0_50px_rgba(0,229,255,0.2)] overflow-y-auto max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-5 right-5 p-2 rounded-full border border-slate-800 text-slate-400 hover:text-white hover:border-cyan-glow transition-all"
              >
                <X size={16} />
              </button>

              {/* Inside Modal Header */}
              <div className="mb-6 pb-6 border-b border-slate-800">
                <span className="px-3 py-1 text-[10px] uppercase tracking-widest font-mono bg-cyan-glow/10 text-cyan-glow border border-cyan-glow/30 rounded-full inline-block mb-3">
                  {selectedProject.category}
                </span>
                
                <h3 className="text-xl md:text-3xl font-black text-white tracking-widest uppercase font-sans">
                  {selectedProject.title}
                </h3>
                <p className="text-xs md:text-sm text-cyan-glow font-mono uppercase tracking-widest mt-1">
                  {selectedProject.tagline}
                </p>
              </div>

              {/* Technical Abstract body */}
              <div className="mb-8 font-sans">
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-silver-dark font-mono mb-3">
                  <Fingerprint size={12} className="text-cyan-glow" />
                  <span>Verified Abstract Blueprint Documentation</span>
                </div>
                <p className="text-sm text-slate-350 leading-relaxed text-slate-300 font-sans">
                  {selectedProject.abstract}
                </p>
              </div>

              {/* Project Details Panel */}
              <div className="grid grid-cols-2 gap-4 mb-6 p-4 rounded-xl border border-slate-800/80 bg-slate-950/60 font-mono text-[11px] uppercase tracking-wider text-slate-400">
                <div>
                  <p className="text-slate-500 text-[9px] mb-1">Delivered Efficiency</p>
                  <p className="text-white text-xs font-bold">{selectedProject.metrics}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-[9px] mb-1">Architecture Standard</p>
                  <p className="text-white text-xs font-bold">IEEE Compliant Documentation</p>
                </div>
              </div>

              {/* Tech stack tags */}
              <div className="mb-8">
                <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-2.5">
                  Integrated Technologies Stack:
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.technologies.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded bg-slate-950 border border-slate-800 text-xs text-slate-400 font-mono"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Live portal action triggers in the modal */}
              {(selectedProject.demoUrl || selectedProject.extraDemoUrl) && (
                <div className="mb-8 border-t border-slate-800/80 pt-6">
                  <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-3">
                    Active Live System Portals:
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {selectedProject.demoUrl && (
                      <a 
                        href={selectedProject.demoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-4 py-2 text-xs bg-cyan-glow text-black hover:opacity-90 font-black rounded uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)]"
                      >
                        Launch Main System ↗
                      </a>
                    )}
                    {selectedProject.extraDemoUrl && (
                      <a 
                        href={selectedProject.extraDemoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-4 py-2 text-xs border border-cyan-glow text-cyan-glow hover:bg-cyan-glow/10 font-bold rounded uppercase tracking-wider transition-all"
                      >
                        Launch Webinar Node ↗
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Footer buttons */}
              <div className="flex justify-end pt-4 border-t border-slate-800">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-6 py-2.5 rounded bg-gradient-to-r from-silver-light to-cyan-glow text-[#030712] text-xs font-bold uppercase tracking-widest transition-all hover:scale-105 active:scale-95"
                >
                  Exit Blueprint
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
