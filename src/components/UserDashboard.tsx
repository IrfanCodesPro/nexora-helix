import React, { useState, useEffect } from "react";
import { User, ProjectRequest } from "../types";
import { 
  Send, 
  HelpCircle, 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  CheckCircle, 
  FileText, 
  Download, 
  Star, 
  ChevronRight, 
  AlertCircle, 
  Sparkles,
  Bot,
  Code,
  Terminal,
  Layers,
  Award,
  X
} from "lucide-react";

interface UserDashboardProps {
  currentUser: User;
  onLogout: () => void;
  openAskProjectDirectly?: boolean;
  onCloseAskProjectDirectly?: () => void;
}

export default function UserDashboard({ 
  currentUser, 
  onLogout, 
  openAskProjectDirectly = false,
  onCloseAskProjectDirectly
}: UserDashboardProps) {
  const [requests, setRequests] = useState<ProjectRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Ask project form states
  const [askProjectOpen, setAskProjectOpen] = useState(false);
  const [whatToDo, setWhatToDo] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Rating States for Done Projects
  const [activeRatingRequestId, setActiveRatingRequestId] = useState<string | null>(null);
  const [ratingStars, setRatingStars] = useState(5);
  const [feedbackText, setFeedbackText] = useState("");
  const [ratingSubmitLoading, setRatingSubmitLoading] = useState(false);

  // Auto close notifications or triggers
  useEffect(() => {
    if (openAskProjectDirectly) {
      setAskProjectOpen(true);
    }
  }, [openAskProjectDirectly]);

  // Fetch Requests on mount
  const fetchUserRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/projects/user/${encodeURIComponent(currentUser.email)}`);
      const data = await res.json();
      if (res.ok) {
        setRequests(data.requests || []);
      }
    } catch (err) {
      console.error("Failed to load user requests", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserRequests();
  }, [currentUser.email]);

  const handleAskProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!whatToDo.trim()) return;

    setSubmitLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/projects/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_email: currentUser.email,
          name: currentUser.name,
          email: currentUser.email,
          phone: currentUser.phone,
          what_to_do: whatToDo
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Submission error");
      }

      setSubmitSuccess(true);
      setWhatToDo("");
      fetchUserRequests();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit project request.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleRatingSubmit = async (requestId: string) => {
    setRatingSubmitLoading(true);
    try {
      const res = await fetch(`/api/projects/rate/${requestId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: ratingStars,
          feedback: feedbackText
        })
      });

      if (res.ok) {
        setActiveRatingRequestId(null);
        setFeedbackText("");
        setRatingStars(5);
        fetchUserRequests();
      }
    } catch (err) {
      console.error("Failed to submit rating", err);
    } finally {
      setRatingSubmitLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      
      {/* Subpage Header Banner */}
      <div className="mb-12 p-6 md:p-8 rounded-2xl border border-cyan-glow/20 bg-space-card/20 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute right-0 top-0 w-48 h-48 bg-cyan-glow/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div>
          <span className="px-2 py-0.5 rounded bg-cyan-glow/15 text-[9px] font-mono text-cyan-glow uppercase tracking-widest border border-cyan-glow/30">
            SECURE STUDENT PROFILE DASHBOARD
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-widest uppercase font-sans mt-3">
            {currentUser.name}
          </h2>
          <p className="text-xs text-silver-dark font-mono uppercase tracking-widest mt-1">
            CLASS: {currentUser.role === "student" ? `${currentUser.dept} // ${currentUser.college} (${currentUser.yr})` : `${currentUser.designation} at ${currentUser.company}`}
          </p>
        </div>

        <button 
          onClick={() => { setAskProjectOpen(true); setSubmitSuccess(false); }}
          className="relative overflow-hidden group px-6 py-3 rounded-lg bg-gradient-to-r from-silver-light to-cyan-glow text-[#030712] font-black text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(0,229,255,0.25)] select-none cursor-pointer"
        >
          <span className="flex items-center gap-1.5 font-bold uppercase">
            <Send size={13} className="text-black" />
            ASK PROJECT
          </span>
        </button>
      </div>

      {/* Grid of details & dynamic updates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Requests and Finished Projects Downloads */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Main Requests module */}
          <div className="p-6 md:p-8 rounded-2xl border border-slate-800 bg-space-card/40">
            <h3 className="text-base md:text-lg font-black text-white tracking-widest uppercase mb-6 font-sans">
              ACTIVE PROJECT TRACKER
            </h3>

            {loading ? (
              <div className="py-12 text-center text-xs text-silver-dark font-mono uppercase tracking-widest">
                DECRYPTING SYSTEM DIRECTORIES...
              </div>
            ) : requests.length === 0 ? (
              <div className="py-12 text-center border border-dashed border-slate-800 rounded-xl p-8 bg-slate-950/20">
                <p className="text-xs text-silver-dark uppercase tracking-widest font-mono mb-4">
                  No project requests registered under your credentials.
                </p>
                <button
                  onClick={() => { setAskProjectOpen(true); setSubmitSuccess(false); }}
                  className="px-4 py-2 border border-cyan-glow/40 hover:border-cyan-glow text-cyan-glow text-[10px] uppercase font-bold tracking-widest font-mono transition-all rounded bg-cyan-glow/5"
                >
                  Create request now
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {requests.map((req) => (
                  <div 
                    key={req.id}
                    className="p-5 rounded-xl border border-slate-800 bg-slate-950/40 hover:border-slate-700/80 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-900 pb-4 mb-4 font-mono text-[11px]">
                      <div>
                        <p className="text-slate-500 uppercase text-[9px]">PROJECT TOKEN ID</p>
                        <p className="text-white font-bold">{req.id}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 text-[9px] uppercase">PROJECT STATUS //</span>
                        {req.status === "pending" && (
                          <span className="px-2.5 py-1 text-[9px] uppercase font-bold text-amber-400 bg-amber-400/5 border border-amber-400/25 rounded">
                            WAIT CUSTOM CALL (3H max)
                          </span>
                        )}
                        {req.status === "in_progress" && (
                          <span className="px-2.5 py-1 text-[9px] uppercase font-bold text-cyan-glow bg-cyan-glow/10 border border-cyan-glow/30 rounded animate-pulse">
                            IN PROGRESS / COMPILING
                          </span>
                        )}
                        {req.status === "done" && (
                          <span className="px-2.5 py-1 text-[9px] uppercase font-bold text-green-400 bg-green-400/10 border border-green-400/30 rounded">
                            DELIVERED / ASSETS ONLINE
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-1">
                        YOUR DIRECTIVE ("WHAT TO DO")
                      </p>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans mt-1 bg-slate-950/80 p-3 rounded border border-slate-900 overflow-auto max-h-[120px] select-text whitespace-pre-wrap">
                        {req.what_to_do}
                      </p>
                    </div>

                    {/* Admin uploaded assets container for Done projects */}
                    {req.status === "done" && (
                      <div className="mt-5 p-4 rounded-xl border border-cyan-glow/20 bg-cyan-glow/5 flex flex-col gap-4">
                        <div className="flex items-center gap-1.5 text-[10px] text-cyan-glow font-bold tracking-widest uppercase font-mono">
                          <CheckCircle size={14} className="text-green-400" />
                          <span>ADMIN COMPILATION ASSETS READY:</span>
                        </div>

                        {req.abstract_content ? (
                          <div className="bg-slate-950/80 p-3.5 rounded border border-slate-900">
                            <p className="text-[9px] text-[#00E5FF] font-bold tracking-widest uppercase font-mono mb-1.5">
                              1. Abstract Documentation Context:
                            </p>
                            <p className="text-xs text-slate-350 leading-relaxed font-sans text-slate-300 select-text">
                              {req.abstract_content}
                            </p>
                          </div>
                        ) : (
                          <p className="text-[10px] text-slate-500 font-mono italic">
                            Abstract documentation compiling...
                          </p>
                        )}

                        {req.ppt_url ? (
                          <div className="flex justify-between items-center bg-slate-950/80 p-3.5 rounded border border-slate-900">
                            <div>
                              <p className="text-[9px] text-[#00E5FF] font-bold tracking-widest uppercase font-mono mb-1">
                                2. Interactive Presentation Link:
                              </p>
                              <p className="text-[10.5px] text-slate-400 truncate max-w-[250px] font-mono select-text">
                                {req.ppt_url}
                              </p>
                            </div>
                            <a
                              href={req.ppt_url}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3.5 py-1.5 rounded bg-cyan-glow/15 text-cyan-glow border border-cyan-glow/30 text-[10px] uppercase font-bold tracking-widest hover:bg-cyan-glow hover:text-[#030712] transition-colors flex items-center gap-1.5"
                            >
                              <Download size={12} />
                              PPT Slide
                            </a>
                          </div>
                        ) : (
                          <p className="text-[10px] text-slate-500 font-mono italic">
                            PPT documentation preparing...
                          </p>
                        )}

                        {/* Rating block */}
                        <div className="border-t border-slate-900 pt-4 mt-2 flex flex-col gap-3">
                          <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">
                            {req.rating ? "Your Submitted Rating Summary" : "Quality Feedback Loop Assessment"}
                          </p>

                          {req.rating ? (
                            <div className="p-3 bg-slate-950/40 rounded border border-slate-900 flex flex-col gap-2">
                              <div className="flex gap-1.5">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <Star 
                                    key={s} 
                                    size={14} 
                                    className={s <= req.rating! ? "text-yellow-400 fill-yellow-400" : "text-slate-800"} 
                                  />
                                ))}
                              </div>
                              {req.feedback && (
                                <p className="text-xs text-slate-400 italic font-sans select-text mt-1">
                                  "{req.feedback}"
                                </p>
                              )}
                            </div>
                          ) : (
                            <div>
                              {activeRatingRequestId === req.id ? (
                                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 flex flex-col gap-3.5">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-white uppercase font-sans">Set Score:</span>
                                    <div className="flex gap-1.5">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                          type="button"
                                          key={star}
                                          onClick={() => setRatingStars(star)}
                                          className="hover:scale-110 transition-transform cursor-pointer"
                                        >
                                          <Star 
                                            size={20} 
                                            className={star <= ratingStars ? "text-yellow-500 fill-yellow-500" : "text-slate-700"} 
                                          />
                                        </button>
                                      ))}
                                    </div>
                                  </div>

                                  <div>
                                    <label className="text-[9px] text-slate-500 block mb-1 uppercase font-mono">
                                      Optional Feedback (We appreciate your review)
                                    </label>
                                    <textarea
                                      value={feedbackText}
                                      onChange={(e) => setFeedbackText(e.target.value)}
                                      placeholder="Write feedback comments here"
                                      className="w-full h-16 p-2 rounded bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-glow font-sans select-text"
                                    ></textarea>
                                  </div>

                                  <div className="flex justify-end gap-2.5">
                                    <button
                                      type="button"
                                      onClick={() => setActiveRatingRequestId(null)}
                                      className="px-3 py-1.5 text-[10px] uppercase font-mono border border-slate-800 text-slate-500 hover:text-white rounded"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      type="button"
                                      disabled={ratingSubmitLoading}
                                      onClick={() => handleRatingSubmit(req.id)}
                                      className="px-4 py-1.5 text-[10px] uppercase font-mono bg-cyan-glow text-space-black font-extrabold rounded hover:scale-105 active:scale-95 transition-all cursor-pointer"
                                    >
                                      {ratingSubmitLoading ? "SAVING..." : "COMMIT RATING"}
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveRatingRequestId(req.id);
                                    setRatingStars(5);
                                    setFeedbackText("");
                                  }}
                                  className="w-fit px-4 py-1.5 border border-cyan-glow/40 hover:border-cyan-glow text-cyan-glow text-[10px] uppercase font-bold tracking-widest font-mono rounded bg-cyan-glow/5 hover:scale-102 transition-all cursor-pointer block"
                                >
                                  Submit Stars Rating & Feedback
                                </button>
                              )}
                            </div>
                          )}

                        </div>
                      </div>
                    )}

                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Poster Details Quick Reference */}
        <div className="flex flex-col gap-8">
          
          {/* Quick Contact Block */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-space-card/40">
            <h3 className="text-sm font-black text-white tracking-widest uppercase mb-5 font-sans">
              OFFICE TELEMETRY
            </h3>

            <div className="flex flex-col gap-4 font-sans text-xs">
              <p className="text-slate-400 leading-relaxed mb-1">
                If our personal representative has not reached you regarding your request within 3 hours, call or email directly via:
              </p>
              
              <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-850 bg-slate-950/60 font-mono text-cyan-glow">
                <Phone size={14} />
                <a href="tel:7200621273" className="hover:underline select-text text-[11px]">7200621273</a>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-850 bg-slate-950/60 font-mono text-cyan-glow">
                <Mail size={14} />
                <a href="mailto:shairfan2005@gmail.com" className="hover:underline select-text text-[11px] truncate">shairfan2005@gmail.com</a>
              </div>
            </div>
          </div>

          {/* Top Software Domains and Industry Verticals */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-space-card/20 text-left">
            <div className="flex items-center gap-2 mb-5">
              <Sparkles size={16} className="text-cyan-glow animate-pulse" />
              <h4 className="text-xs font-black text-cyan-glow tracking-widest uppercase font-mono">
                TOP SOFTWARE DOMAINS
              </h4>
            </div>

            <div className="flex flex-col gap-4 font-sans text-xs text-slate-300">
              <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-900">
                <p className="font-bold text-silver-light text-[11px] uppercase tracking-wider mb-1">
                  1. FINTECH & SECURE LEDGERS
                </p>
                <p className="text-[10px] text-silver-dark leading-relaxed">
                  High-frequency double-entry ledgers, smart transaction validation state-machines, automated invoice auditing, and fraud anomaly detection.
                </p>
              </div>

              <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-900">
                <p className="font-bold text-silver-light text-[11px] uppercase tracking-wider mb-1">
                  2. CYBERSECURITY SYSTEMS
                </p>
                <p className="text-[10px] text-silver-dark leading-relaxed">
                  End-to-end encrypted tunneling, automated socket audits, raw transport security layers (TLS), and predictive intrusion alerting engines.
                </p>
              </div>

              <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-900">
                <p className="font-bold text-silver-light text-[11px] uppercase tracking-wider mb-1">
                  3. HEALTHTECH & COMPLIANCE
                </p>
                <p className="text-[10px] text-silver-dark leading-relaxed">
                  Highly confidential electronic health record sync systems, medical image pathology classifiers, and compliant patient reporting interfaces.
                </p>
              </div>

              <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-900">
                <p className="font-bold text-silver-light text-[11px] uppercase tracking-wider mb-1">
                  4. IOT & PRECISION AUTOMATION
                </p>
                <p className="text-[10px] text-silver-dark leading-relaxed">
                  Low-latency machine instrumentation, MQTT payload stream routing, ambient sensor monitoring swarms, and interactive hardware charts.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Expanded Comprehensive Scientific Services Specification (Full Width) */}
      <div className="mt-12 p-6 md:p-8 rounded-2xl border border-slate-800 bg-space-card/10 text-left">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-900 pb-6 mb-8">
          <div>
            <span className="text-[9px] text-cyan-glow font-mono uppercase tracking-[0.3em] font-black">
              NEXORA TECHNICAL MANUAL // SECTION 04
            </span>
            <h3 className="text-xl md:text-2xl font-black text-white tracking-widest uppercase font-sans mt-1">
              SYSTEM ARCHITECTURE & SERVICE GUIDES
            </h3>
          </div>
          <span className="px-3 py-1 bg-cyan-glow/10 border border-cyan-glow/30 text-cyan-glow text-[10px] font-mono rounded tracking-widest uppercase">
            7 ACTIVE CODES
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* 1. Artificial Intelligence */}
          <div className="p-5 rounded-2xl border border-slate-850 bg-slate-950/45 hover:border-cyan-glow/45 transition-all flex flex-col gap-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-cyan-glow text-[10px] font-mono font-black tracking-widest bg-cyan-glow/10 px-2 py-0.5 rounded">01</span>
              <h4 className="text-xs font-black text-white font-sans uppercase tracking-widest">ARTIFICIAL INTELLIGENCE</h4>
            </div>
            <div className="text-[11px] text-silver-dark leading-relaxed font-normal antialiased flex flex-col gap-2">
              <p>
                1. System Core: Deploy industrial-grade machine learning pipelines, deep predictive neural architectures, computer vision model sets, and neural transformer systems.
              </p>
              <p>
                2. Processing: Engines perform high-throughput classification and time-series predictive audits with parallelized vector transformations.
              </p>
              <p>
                3. Interfaces: Feeds high-fidelity real-time telemetry pipelines to generate semantic clusters, feature importance maps, and custom dashboards.
              </p>
              <p className="pt-2 border-t border-slate-900/40 text-[10.5px] text-cyan-glow">
                Example: Image recognition network parsing assembly line defect streams, running on localized CNN classifiers with 99.8% precision at 120 FPS.
              </p>
            </div>
          </div>

          {/* 2. Agentic AI */}
          <div className="p-5 rounded-2xl border border-slate-850 bg-slate-950/45 hover:border-cyan-glow/45 transition-all flex flex-col gap-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-cyan-glow text-[10px] font-mono font-black tracking-widest bg-cyan-glow/10 px-2 py-0.5 rounded">02</span>
              <h4 className="text-xs font-black text-white font-sans uppercase tracking-widest">AGENTIC AI SYSTEMS</h4>
            </div>
            <div className="text-[11px] text-silver-dark leading-relaxed font-normal antialiased flex flex-col gap-2">
              <p>
                1. System Core: Architect multi-agent autonomous swarms executing nested planning workflows, dynamic environment tools, and recursive code feedback loops.
              </p>
              <p>
                2. Processing: Leverages stateful reasoning sequences, automated error correction paths, and real-time knowledge retrieval synthesis databases safely.
              </p>
              <p>
                3. Interfaces: Operates within strict execution sandboxes to synchronize structured data objects across isolated server terminals deterministically.
              </p>
              <p className="pt-2 border-t border-slate-900/40 text-[10.5px] text-cyan-glow">
                Example: Cyber intelligence swarm parsing customer ticket repositories, querying code models to write custom hotfixes & update git branches.
              </p>
            </div>
          </div>

          {/* 3. Web Development */}
          <div className="p-5 rounded-2xl border border-slate-850 bg-slate-950/45 hover:border-cyan-glow/45 transition-all flex flex-col gap-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-cyan-glow text-[10px] font-mono font-black tracking-widest bg-cyan-glow/10 px-2 py-0.5 rounded">03</span>
              <h4 className="text-xs font-black text-white font-sans uppercase tracking-widest">WEB DEVELOPMENT</h4>
            </div>
            <div className="text-[11px] text-silver-dark leading-relaxed font-normal antialiased flex flex-col gap-2">
              <p>
                1. System Core: Craft lightning-fast, high-density web assets powered by modern React, Vite compilers, and Tailwind CSS layouts natively.
              </p>
              <p>
                2. Processing: Maintains optimal layout calculations, efficient rendering routines, and optimized package sizes to guarantee zero layout shifting.
              </p>
              <p>
                3. Interfaces: Supports rich UI structures, micro-interaction timelines, responsive grid scaling, and accessible element focus trees beautifully.
              </p>
              <p className="pt-2 border-t border-slate-900/40 text-[10.5px] text-cyan-glow">
                Example: Custom client analytics portals containing canvas-driven flowcharts, drag-and-drop workflow nodes, and live websocket charts.
              </p>
            </div>
          </div>

          {/* 4. Fullstack Development */}
          <div className="p-5 rounded-2xl border border-slate-850 bg-slate-950/45 hover:border-cyan-glow/45 transition-all flex flex-col gap-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-cyan-glow text-[10px] font-mono font-black tracking-widest bg-cyan-glow/10 px-2 py-0.5 rounded">04</span>
              <h4 className="text-xs font-black text-white font-sans uppercase tracking-widest">FULLSTACK DEVELOPMENT</h4>
            </div>
            <div className="text-[11px] text-silver-dark leading-relaxed font-normal antialiased flex flex-col gap-2">
              <p>
                1. System Core: Bridge responsive frontends directly to auto-scaling server microservices, RESTful and RPC frameworks, and secure session management layers.
              </p>
              <p>
                2. Processing: Handles high-volume atomic database transactions, resilient custom API paths, automated error reporting, and secure database operations.
              </p>
              <p>
                3. Interfaces: Orchestrates end-to-end data pipelines, multi-tenant databases schemas, cached database reads, and high-frequency rate-limiting defenses.
              </p>
              <p className="pt-2 border-t border-slate-900/40 text-[10.5px] text-cyan-glow">
                Example: Enterprise user directory linking React forms to secure Node.js routers, synchronizing persistent Postgres records under JWT.
              </p>
            </div>
          </div>

          {/* 5. Android App */}
          <div className="p-5 rounded-2xl border border-slate-850 bg-slate-950/45 hover:border-cyan-glow/45 transition-all flex flex-col gap-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-cyan-glow text-[10px] font-mono font-black tracking-widest bg-cyan-glow/10 px-2 py-0.5 rounded">05</span>
              <h4 className="text-xs font-black text-white font-sans uppercase tracking-widest">ANDROID APPLICATION</h4>
            </div>
            <div className="text-[11px] text-silver-dark leading-relaxed font-normal antialiased flex flex-col gap-2">
              <p>
                1. System Core: Construct robust native mobile software leveraging Jetpack Compose UI frameworks, modern architectural components, and Kotlin routines.
              </p>
              <p>
                2. Processing: Manages low-overhead background synchronization tasks, battery-efficient coordinate feeds, and offline database synchronization schemas safely.
              </p>
              <p>
                3. Interfaces: Renders responsive interfaces across multiple Android display sizes, featuring polished gestures and local database caches natively.
              </p>
              <p className="pt-2 border-t border-slate-900/40 text-[10.5px] text-cyan-glow">
                Example: Encrypted telemetry mobile tracker logging physical metrics to a local SQLite database, auto-uploading via background secure REST APIs.
              </p>
            </div>
          </div>

          {/* 6. Cloud App */}
          <div className="p-5 rounded-2xl border border-slate-850 bg-slate-950/45 hover:border-cyan-glow/45 transition-all flex flex-col gap-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-cyan-glow text-[10px] font-mono font-black tracking-widest bg-cyan-glow/10 px-2 py-0.5 rounded">06</span>
              <h4 className="text-xs font-black text-white font-sans uppercase tracking-widest">CLOUD APP SOLUTIONS</h4>
            </div>
            <div className="text-[11px] text-silver-dark leading-relaxed font-normal antialiased flex flex-col gap-2">
              <p>
                1. System Core: Deploy serverless, distributed cloud environments containerized with Docker and scaled-to-zero architectures across major providers.
              </p>
              <p>
                2. Processing: Configures health monitoring systems, dynamic ingress route tables, managed bucket storage controls, and robust load-testing frameworks.
              </p>
              <p>
                3. Interfaces: Incorporates secure isolated virtual private clouds, key management secrets vaults, and automated code compile channels uniformly.
              </p>
              <p className="pt-2 border-t border-slate-900/40 text-[10.5px] text-cyan-glow">
                Example: Cloud compute cluster spinning up microservices dynamically on Cloud Run, scaling instantly from 0 to 500 concurrent container instances.
              </p>
            </div>
          </div>

          {/* 7. Quantum */}
          <div className="p-5 rounded-2xl border border-slate-850 bg-slate-950/45 hover:border-cyan-glow/45 transition-all flex flex-col gap-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-cyan-glow text-[10px] font-mono font-black tracking-widest bg-cyan-glow/10 px-2 py-0.5 rounded">07</span>
              <h4 className="text-xs font-black text-white font-sans uppercase tracking-widest">QUANTUM COMPUTING</h4>
            </div>
            <div className="text-[11px] text-silver-dark leading-relaxed font-normal antialiased flex flex-col gap-2">
              <p>
                1. System Core: Translate high-level mathematical mechanics including spin qubits, logic gate entangled circuits, and phase distributions classically.
              </p>
              <p>
                2. Processing: Runs classical simulated matrix mathematical solvers modeling Shor's and Grover's search techniques fast and accurately.
              </p>
              <p>
                3. Interfaces: Renders beautiful web interfaces representing Bloch spheres, real-time wave probabilities, and drag-and-drop gates.
              </p>
              <p className="pt-2 border-t border-slate-900/40 text-[10.5px] text-cyan-glow">
                Example: Interactive gate simulator displaying superposition states, measuring matrix operations and exporting classical Python qiskit code.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Ask Project Form Popup/Modal overlay */}
      {askProjectOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-black/90 backdrop-blur-md animate-fadeIn">
          <div 
            className="relative w-full max-w-xl rounded-2xl border border-cyan-glow bg-space-card p-6 md:p-8 [box-shadow:0_0_50px_rgba(0,229,255,0.3)] overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => {
                setAskProjectOpen(false);
                if (onCloseAskProjectDirectly) onCloseAskProjectDirectly();
              }}
              className="absolute top-5 right-5 p-2 rounded-full border border-slate-800 text-slate-400 hover:text-white hover:border-cyan-glow transition-all"
            >
              <X size={15} />
            </button>

            {submitSuccess ? (
              <div className="py-6 text-center flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-green-500/10 border-2 border-green-400 flex items-center justify-center text-green-400 mb-6 animate-pulse">
                  <CheckCircle size={32} />
                </div>
                
                <h3 className="text-xl md:text-2xl font-black text-white tracking-widest uppercase font-sans mb-3 text-center">
                  REQUEST SUBMITTED SUCCESSFULLY!
                </h3>
                
                <p className="text-[10px] text-cyan-glow uppercase tracking-[0.25em] mb-6 font-mono">
                  Autonomous Intelligence Queue Active
                </p>

                {/* Directive layout alert box requested */}
                <div className="p-5 rounded-xl border border-cyan-glow/30 bg-cyan-glow/5 text-left mb-8 max-w-md font-sans text-xs leading-relaxed text-slate-200">
                  <span className="font-bold text-white block mb-1">⏰ Callback Window Notice:</span>
                  Wait for the office personal call. If the call doesn't arrive within 3hrs, call or email to ask.
                </div>

                {/* Core contacts details */}
                <div className="flex flex-col gap-3.5 w-full max-w-xs font-mono text-[11px] text-left">
                  <div className="flex items-center gap-3.5 p-3 rounded bg-slate-950 border border-slate-850">
                    <Phone size={14} className="text-cyan-glow" />
                    <span className="text-white">Call: </span>
                    <a href="tel:7200621273" className="hover:underline select-text text-cyan-glow">7200621273</a>
                  </div>

                  <div className="flex items-center gap-3.5 p-3 rounded bg-slate-950 border border-slate-850">
                    <Mail size={14} className="text-cyan-glow" />
                    <span className="text-white">Email: </span>
                    <a href="mailto:shairfan2005@gmail.com" className="hover:underline select-text text-cyan-glow truncate">shairfan2005@gmail.com</a>
                  </div>
                </div>

                <div className="mt-8 flex gap-4">
                  <button
                    onClick={() => {
                      setAskProjectOpen(false);
                      setSubmitSuccess(false);
                      if (onCloseAskProjectDirectly) onCloseAskProjectDirectly();
                    }}
                    className="px-8 py-3 rounded-lg bg-gradient-to-r from-silver-light to-cyan-glow text-space-black font-extrabold text-xs uppercase tracking-widest cursor-pointer"
                  >
                    Return to Dashboard
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {/* Heading */}
                <div className="mb-6 pb-4 border-b border-slate-900">
                  <h3 className="text-lg md:text-2xl font-black text-white tracking-widest uppercase font-sans">
                    ASK PROJECT BLUEPRINT
                  </h3>
                  <p className="text-[9px] text-cyan-glow font-mono uppercase tracking-[0.2em] mt-1">
                    Orchestrated Auto-Request Compiler
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-3.5 rounded border border-red-500/30 bg-red-500/10 text-red-400 text-xs flex items-center gap-2 mb-4 font-mono select-text">
                    <AlertCircle size={14} />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Form fields */}
                <form onSubmit={handleAskProjectSubmit} className="flex flex-col gap-4 font-mono text-[11px] uppercase tracking-wider">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] text-slate-500 tracking-widest block mb-1">
                        Prepopulated Name
                      </label>
                      <input
                        type="text"
                        disabled
                        value={currentUser.name}
                        className="w-full px-3 py-2.5 rounded bg-slate-900/60 border border-slate-820 text-xs text-slate-400 cursor-not-allowed select-text"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] text-slate-500 tracking-widest block mb-1">
                        Prepopulated Email
                      </label>
                      <input
                        type="email"
                        disabled
                        value={currentUser.email}
                        className="w-full px-3 py-2.5 rounded bg-slate-900/60 border border-slate-820 text-xs text-slate-400 cursor-not-allowed select-text"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] text-slate-500 tracking-widest block mb-1">
                      Prepopulated Phone (phn)
                    </label>
                    <input
                      type="tel"
                      disabled
                      value={currentUser.phone}
                      className="w-full px-3 py-2.5 rounded bg-slate-900/60 border border-slate-820 text-xs text-slate-400 cursor-not-allowed select-text"
                    />
                  </div>

                  {/* Main textbox asked */}
                  <div>
                    <label className="text-[10px] text-[#00E5FF] tracking-widest block mb-1 font-bold">
                      What to do <span className="text-red-400">*</span>
                    </label>
                    <p className="text-[8px] text-slate-500 tracking-widest uppercase block mb-1 font-mono">
                      (State project ideas, guidelines, technology preferences, or timelines clearly)
                    </p>
                    <textarea
                      required
                      value={whatToDo}
                      onChange={(e) => setWhatToDo(e.target.value)}
                      placeholder="e.g. Develop an Autonomous multi-agent compiler with D3 data analysis layout..."
                      rows={5}
                      className="w-full p-3.5 rounded bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-glow font-sans leading-relaxed select-text"
                    ></textarea>
                  </div>

                  {/* Submit buttons */}
                  <div className="flex gap-4.5 justify-end pt-4 border-t border-slate-900 mt-2 select-none">
                    <button
                      type="button"
                      onClick={() => {
                        setAskProjectOpen(false);
                        if (onCloseAskProjectDirectly) onCloseAskProjectDirectly();
                      }}
                      className="px-4 py-2.5 rounded border border-slate-800 text-slate-400 text-xs hover:text-white uppercase"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitLoading}
                      className="px-6 py-2.5 rounded bg-gradient-to-r from-silver-light to-cyan-glow text-space-black font-extrabold text-xs uppercase tracking-widest hover:scale-103 active:scale-97 transition-all cursor-pointer"
                    >
                      {submitLoading ? "TRANSMITTING SPEC..." : "SUBMIT SPECIFICATION"}
                    </button>
                  </div>

                </form>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
