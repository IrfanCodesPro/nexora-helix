import React from "react";
import { LogOut, LayoutDashboard, Terminal, Menu, X, Rocket, Send } from "lucide-react";
import { User } from "../types";

interface HeaderProps {
  currentUser: User | null;
  isAdmin: boolean;
  onOpenAuth: () => void;
  onLogout: () => void;
  onNavigateTo: (view: "home" | "dashboard" | "admin") => void;
  currentView: "home" | "dashboard" | "admin";
  onOpenAskProject?: () => void;
}

export default function Header({
  currentUser,
  isAdmin,
  onOpenAuth,
  onLogout,
  onNavigateTo,
  currentView,
  onOpenAskProject
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 bg-space-black/85 backdrop-blur-md border-b border-cyan-glow/20 py-4 px-6 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo and Brand */}
        <div 
          onClick={() => onNavigateTo("home")}
          className="flex items-center gap-3 cursor-pointer group"
          id="brand-logo"
        >
          <div className="relative h-10 w-10 flex items-center justify-center shrink-0">
            <img 
              src="/nexoralogo.jpeg" 
              alt="Nexora Helix Logo" 
              className="h-full w-full object-contain"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // Fallback if image fails to load
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl md:text-2xl font-black tracking-widest text-white group-hover:text-cyan-glow transition-colors font-sans">
                NEXORA
              </h1>
              <span className="text-xl md:text-2xl font-black tracking-widest text-cyan-glow">
                HELIX
              </span>
            </div>
            <p className="text-[9px] uppercase tracking-[0.25em] text-silver-dark font-sans hidden md:block">
              Orchestrating Autonomous Intelligence
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8 font-sans text-xs uppercase tracking-wider">
          <button
            onClick={() => { onNavigateTo("home"); setTimeout(() => document.getElementById("innovations")?.scrollIntoView({ behavior: "smooth" }), 100); }}
            className="text-silver-dark hover:text-cyan-glow hover:underline transition-colors cursor-pointer"
          >
             innovations
          </button>
          <button
            onClick={() => { onNavigateTo("home"); setTimeout(() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" }), 100); }}
            className="text-silver-dark hover:text-cyan-glow hover:underline transition-colors cursor-pointer"
          >
            services
          </button>
          <button
            onClick={() => { onNavigateTo("home"); setTimeout(() => document.getElementById("achievements")?.scrollIntoView({ behavior: "smooth" }), 100); }}
            className="text-silver-dark hover:text-cyan-glow hover:underline transition-colors cursor-pointer"
          >
            achievements
          </button>
          <button
            onClick={() => { onNavigateTo("home"); setTimeout(() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }), 100); }}
            className="text-silver-dark hover:text-cyan-glow hover:underline transition-colors cursor-pointer"
          >
            contact
          </button>

        </nav>

        {/* Action Buttons (Top Right Corner Get Started) */}
        <div className="hidden sm:flex items-center gap-4">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigateTo("dashboard")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-cyan-glow/40 hover:border-cyan-glow text-xs uppercase tracking-wider text-cyan-glow bg-cyan-glow/5 hover:bg-cyan-glow/15 transition-all cursor-pointer"
              >
                <LayoutDashboard size={14} />
                Dashboard
              </button>

              {onOpenAskProject && (
                <button
                  onClick={onOpenAskProject}
                  className="relative group overflow-hidden px-4 py-1.5 rounded-md font-sans text-xs font-bold uppercase tracking-widest text-[#030712] transition-all cursor-pointer shadow-[0_0_15px_rgba(0,229,255,0.3)] bg-gradient-to-r from-silver-light to-cyan-glow hover:scale-105 active:scale-95"
                >
                  <span className="flex items-center gap-1">
                    <Send size={12} className="text-space-black" />
                    ASK PROJECT
                  </span>
                </button>
              )}

              <div className="h-6 w-px bg-slate-800"></div>

              <div className="text-right">
                <p className="text-[10px] text-silver-dark uppercase tracking-wider">Welcome,</p>
                <p className="text-[11px] font-bold text-white max-w-[120px] truncate">{currentUser.name}</p>
              </div>

              <button
                onClick={onLogout}
                className="p-2 rounded-md hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : isAdmin ? (
            <div className="flex items-center gap-4">
              <span className="px-2.5 py-1 rounded bg-cyan-glow/10 border border-cyan-glow/30 text-[10px] text-cyan-glow font-mono tracking-widest uppercase">
                SYSTEM ADM
              </span>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-3 py-1.5 rounded border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs uppercase tracking-widest transition-all cursor-pointer"
              >
                <LogOut size={13} />
                Exit System
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              id="get-started-button"
              className="relative overflow-hidden group px-6 py-2 rounded-md font-sans text-xs font-bold uppercase tracking-widest cursor-pointer border border-cyan-glow text-[#030712] transition-all [box-shadow:0_0_15px_rgba(0,229,255,0.25)] hover:[box-shadow:0_0_25px_rgba(0,229,255,0.5)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white via-slate-300 to-cyan-glow group-hover:opacity-90 transition-opacity"></div>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,229,255,0.4)_0%,transparent_70%)] animate-pulse"></div>
              <span className="relative z-10 flex items-center gap-1.5 text-space-black font-extrabold uppercase">
                <Rocket size={13} className="text-black inline" />
                GET STARTED
              </span>
            </button>
          )}
        </div>

        {/* Mobile Hamburger menu */}
        <div className="lg:hidden flex items-center gap-3">
          {currentUser && onOpenAskProject && (
            <button
              onClick={onOpenAskProject}
              className="px-2.5 py-1.5 rounded text-[10px] font-bold bg-cyan-glow text-space-black"
            >
              ASK PROJECT
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 border border-slate-800 rounded text-silver-light hover:border-cyan-glow"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-4 pt-4 border-t border-slate-800/80 flex flex-col gap-4 font-sans text-xs uppercase tracking-wider animate-fadeIn">
          <button
            onClick={() => { setMobileMenuOpen(false); onNavigateTo("home"); setTimeout(() => document.getElementById("innovations")?.scrollIntoView({ behavior: "smooth" }), 100); }}
            className="text-left text-silver-dark hover:text-cyan-glow py-1"
          >
            innovations
          </button>
          <button
            onClick={() => { setMobileMenuOpen(false); onNavigateTo("home"); setTimeout(() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" }), 100); }}
            className="text-left text-silver-dark hover:text-cyan-glow py-1"
          >
            services
          </button>
          <button
            onClick={() => { setMobileMenuOpen(false); onNavigateTo("home"); setTimeout(() => document.getElementById("achievements")?.scrollIntoView({ behavior: "smooth" }), 100); }}
            className="text-left text-silver-dark hover:text-cyan-glow py-1"
          >
            achievements
          </button>
          <button
            onClick={() => { setMobileMenuOpen(false); onNavigateTo("home"); setTimeout(() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }), 100); }}
            className="text-left text-silver-dark hover:text-cyan-glow py-1"
          >
            contact
          </button>
          <div className="h-px bg-slate-800 my-1"></div>

          {currentUser ? (
            <div className="flex flex-col gap-3">
              <div className="text-left py-1">
                <p className="text-[9px] text-slate-500">USER PROFILE</p>
                <p className="text-[11px] font-bold text-white">{currentUser.name}</p>
                <p className="text-[9px] text-cyan-glow">{currentUser.email}</p>
              </div>
              <button
                onClick={() => { setMobileMenuOpen(false); onNavigateTo("dashboard"); }}
                className="w-full text-center py-2 rounded border border-cyan-glow/40 text-cyan-glow text-[11px]"
              >
                Dashboard Area
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); onLogout(); }}
                className="w-full text-center py-2 rounded bg-red-950/40 border border-red-500/30 text-red-400 text-[11px]"
              >
                Logout Account
              </button>
            </div>
          ) : isAdmin ? (
            <div className="flex flex-col gap-2">
              <span className="text-cyan-glow text-[10px] py-1 font-mono">ADMINISTRATOR SESSION</span>
              <button
                onClick={() => { setMobileMenuOpen(false); onLogout(); }}
                className="w-full text-center py-2 rounded border border-red-500/40 text-red-400 text-[11px]"
              >
                Logout From System
              </button>
            </div>
          ) : (
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenAuth(); }}
              className="w-full text-center py-2.5 rounded bg-gradient-to-r from-silver-light to-cyan-glow font-bold text-space-black text-[11px]"
            >
              GET STARTED
            </button>
          )}
        </div>
      )}
    </header>
  );
}
