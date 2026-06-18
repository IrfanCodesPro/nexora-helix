import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, HelpCircle, Shield, ChevronRight } from "lucide-react";

export default function Footer() {
  const [emailText, setEmailText] = useState("");
  const [msgSubmitted, setMsgSubmitted] = useState(false);

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailText) return;
    setMsgSubmitted(true);
    setEmailText("");
  };

  return (
    <footer id="contact" className="relative border-t border-slate-900 bg-space-black pt-20 pb-10 px-6 overflow-hidden">
      {/* Decorative cosmic background mesh */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-glow/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pb-16 border-b border-slate-900">
          
          {/* Column 1: Brand details */}
          <div className="flex flex-col gap-4 text-left">
            <div className="flex items-center gap-3">
              <img 
                src="/nexoralogo.jpeg" 
                alt="Nexora Helix Logo" 
                className="h-8 w-8 object-contain shrink-0"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <h3 className="text-xl font-black text-white tracking-widest font-sans">
                NEXORA <span className="text-cyan-glow">HELIX</span>
              </h3>
            </div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-glow/80 font-mono font-bold">
              Orchestrating Autonomous Intelligence
            </p>
            <p className="text-xs text-silver-dark leading-relaxed font-sans max-w-sm mt-2">
              We specialize in final year academic systems development, robust enterprise micro-frontends, and intelligent multi-agent swarms. Build custom, production-compliant software with absolute peace of mind.
            </p>
          </div>

          {/* Column 2: Specific Contact Channels */}
          <div className="flex flex-col gap-6 text-left">
            <h4 className="text-xs font-black uppercase text-white tracking-widest font-sans">
              OFFICIAL CONTACT NODES
            </h4>

            <div className="flex flex-col gap-3.5 font-mono text-xs">
              <div className="group flex items-center gap-3.5 p-3.5 rounded-lg border border-slate-800 bg-space-card/20 hover:border-cyan-glow/40 hover:bg-space-card/50 transition-all">
                <Mail className="h-5 w-5 text-cyan-glow shrink-0" />
                <div>
                  <p className="text-slate-500 text-[9px] uppercase tracking-wider">ELECTRONIC MAIL</p>
                  <a 
                    href="mailto:shairfan2005@gmail.com" 
                    className="text-white hover:text-cyan-glow text-[11px] font-bold select-text"
                  >
                    shairfan2005@gmail.com
                  </a>
                </div>
              </div>

              <div className="group flex items-center gap-3.5 p-3.5 rounded-lg border border-slate-800 bg-space-card/20 hover:border-cyan-glow/40 hover:bg-space-card/50 transition-all">
                <Phone className="h-5 w-5 text-cyan-glow shrink-0" />
                <div>
                  <p className="text-slate-500 text-[9px] uppercase tracking-wider">SECURE TELEMETRY LINE</p>
                  <a 
                    href="tel:7200621273" 
                    className="text-white hover:text-cyan-glow text-[11px] font-bold select-text"
                  >
                    7200621273
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Quick Newsletter/Information form */}
          <div className="flex flex-col gap-6 text-left">
            <h4 className="text-xs font-black uppercase text-white tracking-widest font-sans">
              COGNITIVE NEWSLETTER
            </h4>
            <p className="text-xs text-silver-dark leading-relaxed font-sans">
              Register your workspace email destination to receive premium notification briefs on upcoming IEEE guidelines and AI agent releases.
            </p>

            {msgSubmitted ? (
              <div className="p-3.5 rounded border border-green-500/20 bg-green-500/5 text-green-400 text-xs font-mono">
                ✓ EMAIL COORDINATES SUCCESSFULLY REGISTERED!
              </div>
            ) : (
              <form onSubmit={handleQuickSubmit} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={emailText}
                  onChange={(e) => setEmailText(e.target.value)}
                  placeholder="Enter email..."
                  className="flex-1 px-3 py-2.5 rounded bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-glow font-sans select-text"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-silver-light to-cyan-glow text-space-black rounded font-black text-xs hover:scale-103 active:scale-97 transition-all cursor-pointer"
                >
                  <Send size={14} />
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Footer Meta bottom */}
        <div className="pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] text-slate-500 font-mono uppercase tracking-widest text-center select-none">
          <p>© {new Date().getFullYear()} Nexora Helix. All Rights Reserved.</p>
          <div className="flex gap-6">
            <span className="flex items-center gap-1.5 justify-center">
              <Shield size={11} className="text-cyan-glow" /> Secure TLS Handshake
            </span>
            <span className="flex items-center gap-1.5 justify-center">
              <HelpCircle size={11} className="text-cyan-glow" /> 3-Hour SLA Active
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
