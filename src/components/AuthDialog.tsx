import React, { useState } from "react";
import { X, Lock, Mail, Phone, School, Award, Briefcase, GraduationCap, ShieldCheck, AlertCircle } from "lucide-react";
import { User } from "../types";

interface AuthDialogProps {
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
}

export default function AuthDialog({ onClose, onAuthSuccess }: AuthDialogProps) {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [role, setRole] = useState<"student" | "professional">("student");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Student role states
  const [college, setCollege] = useState("");
  const [yr, setYr] = useState("");
  const [dept, setDept] = useState("");

  // Professional role states
  const [company, setCompany] = useState("");
  const [designation, setDesignation] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    if (activeTab === "register") {
      // Validations
      if (!name || !email || !phone || !password || !confirmPassword) {
        setErrorMsg("Please fill in all core fields.");
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setErrorMsg("Passwords do not match.");
        setLoading(false);
        return;
      }

      if (role === "student" && (!college || !yr || !dept)) {
        setErrorMsg("Please provide all Student details including College, Year, and Department.");
        setLoading(false);
        return;
      }

      if (role === "professional" && (!company || !designation)) {
        setErrorMsg("Please provide all Professional details including Company and Designation.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            password,
            role,
            phone,
            college,
            yr,
            dept,
            company,
            designation
          })
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Registration failed");
        }

        onAuthSuccess(data.user);
        onClose();
      } catch (err: any) {
        setErrorMsg(err.message || "An error occurred during registration.");
      } finally {
        setLoading(false);
      }
    } else {
      // Login flow
      if (!email || !password) {
        setErrorMsg("Email and password are required.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Login failed");
        }

        onAuthSuccess(data.user);
        onClose();
      } catch (err: any) {
        setErrorMsg(err.message || "Authentication failed. Check your credentials.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-black/90 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-lg rounded-2xl border border-cyan-glow/50 bg-space-card [box-shadow:0_0_50px_rgba(0,229,255,0.25)] overflow-hidden max-h-[95vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Grid decoration */}
        <div className="bg-gradient-to-r from-space-card to-space-deep p-6 relative shrink-0 border-b border-slate-900">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full border border-slate-800 text-slate-400 hover:text-white hover:border-cyan-glow transition-all"
          >
            <X size={15} />
          </button>

          <h3 className="text-xl md:text-2xl font-black text-white tracking-widest uppercase font-sans">
            NEXORA <span className="text-cyan-glow">ORACLE PORTAL</span>
          </h3>
          <p className="text-[10px] text-silver-dark font-mono uppercase tracking-[0.25em] mt-1.5">
            Synchronize Credentials for Autonomous Access
          </p>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-2 text-center border-b border-slate-900 shrink-0 select-none">
          <button
            onClick={() => { setActiveTab("login"); setErrorMsg(""); }}
            className={`py-3.5 text-xs font-bold uppercase tracking-widest font-sans transition-all border-b-2 ${activeTab === "login" ? "text-cyan-glow border-cyan-glow bg-cyan-glow/5" : "text-slate-500 border-transparent hover:text-slate-300"}`}
          >
            DECRYPT SIGN-IN
          </button>
          <button
            onClick={() => { setActiveTab("register"); setErrorMsg(""); }}
            className={`py-3.5 text-xs font-bold uppercase tracking-widest font-sans transition-all border-b-2 ${activeTab === "register" ? "text-cyan-glow border-cyan-glow bg-cyan-glow/5" : "text-slate-500 border-transparent hover:text-slate-300"}`}
          >
            INITIALIZE SIGN-UP
          </button>
        </div>

        {/* Scrollable Form body container */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 flex flex-col gap-5">
          
          {errorMsg && (
            <div className="p-3.5 rounded border border-red-500/30 bg-red-500/10 text-red-400 text-xs flex items-center gap-2.5 font-sans">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {activeTab === "register" && (
            <div>
              {/* Role selector */}
              <label className="text-[10px] text-slate-500 font-mono uppercase tracking-widest block mb-2">
                CLASSIFICATION TYPE
              </label>
              <div className="grid grid-cols-2 gap-3.5 bg-slate-950/80 p-1.5 rounded-lg border border-slate-900">
                <button
                  type="button"
                  onClick={() => setRole("student")}
                  className={`py-2 text-xs font-bold rounded flex items-center justify-center gap-1.5 transition-all ${role === "student" ? "bg-cyan-glow/15 text-cyan-glow border border-cyan-glow/40" : "text-slate-500 hover:text-slate-300 border border-transparent"}`}
                >
                  <GraduationCap size={14} />
                  STUDENT
                </button>
                <button
                  type="button"
                  onClick={() => setRole("professional")}
                  className={`py-2 text-xs font-bold rounded flex items-center justify-center gap-1.5 transition-all ${role === "professional" ? "bg-cyan-glow/15 text-cyan-glow border border-cyan-glow/40" : "text-slate-500 hover:text-slate-300 border border-transparent"}`}
                >
                  <Briefcase size={14} />
                  PROFESSIONAL
                </button>
              </div>
            </div>
          )}

          {/* Form Fields container */}
          <div className="flex flex-col gap-4 font-mono text-[11px] uppercase tracking-wider">
            
            {activeTab === "register" && (
              <div>
                <label className="text-[10px] text-slate-500 tracking-widest block mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your registered name"
                    className="w-full pl-10 pr-4 py-2.5 rounded bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-glow select-text"
                  />
                  <ShieldCheck size={14} className="absolute left-3.5 top-3.5 text-slate-500" />
                </div>
              </div>
            )}

            <div>
              <label className="text-[10px] text-slate-500 tracking-widest block mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full pl-10 pr-4 py-2.5 rounded bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-glow select-text"
                />
                <Mail size={14} className="absolute left-3.5 top-3.5 text-slate-500" />
              </div>
            </div>

            {activeTab === "register" && (
              <div>
                <label className="text-[10px] text-slate-500 tracking-widest block mb-1">
                  Phone Number (phn)
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className="w-full pl-10 pr-4 py-2.5 rounded bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-glow select-text"
                  />
                  <Phone size={14} className="absolute left-3.5 top-3.5 text-slate-500" />
                </div>
              </div>
            )}

            {/* Dynamic details for Student register */}
            {activeTab === "register" && role === "student" && (
              <div className="p-4 rounded-xl border border-cyan-glow/20 bg-cyan-glow/5 flex flex-col gap-3.5">
                <p className="text-[9px] text-cyan-glow font-bold tracking-[0.2em] mb-1">
                  STUDENT DEMOGRAPHICS REQUIRED
                </p>

                <div>
                  <label className="text-[9px] text-slate-400 tracking-widest block mb-1">
                    College/University Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      placeholder="e.g. Oxford Institute of Technology"
                      className="w-full pl-10 pr-4 py-2.5 rounded bg-slate-950/90 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-glow select-text"
                    />
                    <School size={14} className="absolute left-3.5 top-3.5 text-cyan-glow/50" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] text-slate-400 tracking-widest block mb-1">
                      Academic Year (yr)
                    </label>
                    <select
                      required
                      value={yr}
                      onChange={(e) => setYr(e.target.value)}
                      className="w-full py-2.5 px-3 rounded bg-slate-950/90 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-glow"
                    >
                      <option value="">Choose Yr</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year (Final)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-400 tracking-widest block mb-1">
                      Department (dept)
                    </label>
                    <input
                      type="text"
                      required
                      value={dept}
                      onChange={(e) => setDept(e.target.value)}
                      placeholder="e.g. CSE / IT / ECE"
                      className="w-full px-3 py-2.5 rounded bg-slate-950/90 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-glow select-text"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Dynamic details for Professional register */}
            {activeTab === "register" && role === "professional" && (
              <div className="p-4 rounded-xl border border-cyan-glow/20 bg-cyan-glow/5 flex flex-col gap-3.5">
                <p className="text-[9px] text-cyan-glow font-bold tracking-[0.2em] mb-1">
                  PROFESSIONAL PARTICULARS REQUIRED
                </p>

                <div>
                  <label className="text-[9px] text-slate-400 tracking-widest block mb-1">
                    Company/Organization Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Acme Intelligence Corp"
                      className="w-full pl-10 pr-4 py-2.5 rounded bg-slate-950/90 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-glow select-text"
                    />
                    <Briefcase size={14} className="absolute left-3.5 top-3.5 text-cyan-glow/50" />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] text-slate-400 tracking-widest block mb-1">
                    Your Title/Designation
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      placeholder="e.g. Lead Systems Analyst / Architect"
                      className="w-full pl-10 pr-4 py-2.5 rounded bg-slate-950/90 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-glow select-text"
                    />
                    <Award size={14} className="absolute left-3.5 top-3.5 text-cyan-glow/50" />
                  </div>
                </div>
              </div>
            )}

            <div className={activeTab === "register" ? "grid grid-cols-2 gap-3" : "flex flex-col"}>
              <div>
                <label className="text-[10px] text-slate-500 tracking-widest block mb-1">
                  {activeTab === "register" ? "Create Password" : "Password"}
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full pl-10 pr-4 py-2.5 rounded bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-glow"
                  />
                  <Lock size={14} className="absolute left-3.5 top-3.5 text-slate-500" />
                </div>
              </div>

              {activeTab === "register" && (
                <div>
                  <label className="text-[10px] text-slate-500 tracking-widest block mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Retype password"
                      className="w-full pl-10 pr-4 py-2.5 rounded bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-glow"
                    />
                    <Lock size={14} className="absolute left-3.5 top-3.5 text-slate-500" />
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-silver-light to-cyan-glow text-space-black font-extrabold text-xs uppercase tracking-widest transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50 select-none cursor-pointer mt-auto shrink-0 [box-shadow:0_0_15px_rgba(0,229,255,0.2)]"
          >
            {loading ? "PROCESSING COGNITIVE STREAM..." : activeTab === "register" ? "REGISTER ACCOUNT NOW" : "AUTHENTICATE DECRYPTED SESSION"}
          </button>
        </form>

        {/* Alternate link Footer */}
        <div className="bg-slate-950/80 p-4 border-t border-slate-900 text-center text-[10px] text-slate-500 font-mono tracking-wider shrink-0 select-none">
          {activeTab === "login" ? (
            <p>
              DON'T HAVE A SECURE LINK SYNC?{" "}
              <button
                type="button"
                onClick={() => { setActiveTab("register"); setErrorMsg(""); }}
                className="text-cyan-glow hover:underline uppercase"
              >
                Create Account
              </button>
            </p>
          ) : (
            <p>
              ALREADY REGISTERED SECURE ID?{" "}
              <button
                type="button"
                onClick={() => { setActiveTab("login"); setErrorMsg(""); }}
                className="text-cyan-glow hover:underline uppercase"
              >
                Log In Here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
