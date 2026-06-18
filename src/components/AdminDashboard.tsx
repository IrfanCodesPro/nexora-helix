import React, { useState, useEffect } from "react";
import { User, ProjectRequest } from "../types";
import { 
  Users, 
  Layers, 
  Settings, 
  Terminal, 
  AlertCircle, 
  CheckCircle, 
  FileText, 
  Star, 
  ExternalLink, 
  RefreshCw, 
  X,
  UploadCloud,
  Database
} from "lucide-react";

interface AdminDashboardProps {
  onAdminStateChange: (loggedIn: boolean) => void;
  isAdminLoggedIn: boolean;
}

export default function AdminDashboard({ onAdminStateChange, isAdminLoggedIn }: AdminDashboardProps) {
  // Authentication states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  
  // Data lists
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);
  const [projectRequests, setProjectRequests] = useState<ProjectRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Update Status Modal/Form States
  const [editingRequest, setEditingRequest] = useState<ProjectRequest | null>(null);
  const [newStatus, setNewStatus] = useState<"pending" | "in_progress" | "done">("pending");
  const [pptUrl, setPptUrl] = useState("");
  const [abstractContent, setAbstractContent] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);

  // Tab views
  const [adminTab, setAdminTab] = useState<"users" | "requests" | "ratings">("requests");

  const handleAdminVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    
    if (username === "NEXORA" && password === "neXora_helix") {
      onAdminStateChange(true);
      fetchAdminData();
    } else {
      setAuthError("CRYPTOGRAPHIC REJECTION: Access code mismatch.");
    }
  };

  const fetchAdminData = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "NEXORA",
          password: "neXora_helix"
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to load database lists");
      }

      setRegisteredUsers(data.users || []);
      setProjectRequests(data.requests || []);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to download admin telemetry.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminLoggedIn) {
      fetchAdminData();
    }
  }, [isAdminLoggedIn]);

  const openStatusEditor = (req: ProjectRequest) => {
    setEditingRequest(req);
    setNewStatus(req.status);
    setPptUrl(req.ppt_url || "");
    setAbstractContent(req.abstract_content || "");
  };

  const submitUpdateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRequest) return;

    setUpdateLoading(true);
    try {
      const res = await fetch("/api/admin/update-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "NEXORA",
          password: "neXora_helix",
          requestId: editingRequest.id,
          status: newStatus,
          ppt_url: pptUrl,
          abstract_content: abstractContent
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update project assets");
      }

      setEditingRequest(null);
      fetchAdminData();
    } catch (err: any) {
      alert(err.message || "Failed to write updates.");
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      
      {/* 1. If not logged in as Admin, show Space-style security login */}
      {!isAdminLoggedIn ? (
        <div className="max-w-md mx-auto py-16 animate-fadeIn">
          <div className="rounded-2xl border border-cyan-glow bg-space-card [box-shadow:0_0_50px_rgba(0,229,255,0.25)] p-8">
            <div className="text-center mb-6">
              <div className="h-14 w-14 rounded-lg bg-cyan-glow/10 border border-cyan-glow/30 flex items-center justify-center text-cyan-glow mx-auto mb-4">
                <Terminal size={28} className="animate-pulse" />
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white tracking-widest uppercase font-sans">
                ADMIN CONSOLE DECRYPT
              </h2>
              <p className="text-[10px] text-silver-dark font-mono uppercase tracking-[0.2em] mt-1.5">
                Restricted Core Administration Sync
              </p>
            </div>

            {authError && (
              <div className="p-3.5 rounded border border-red-500/30 bg-red-500/10 text-red-500 text-xs mb-5 flex items-center gap-2 select-text font-mono">
                <AlertCircle size={15} />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleAdminVerify} className="flex flex-col gap-4 font-mono text-[11px] uppercase tracking-wider">
              <div>
                <label className="text-[9px] text-slate-500 tracking-widest block mb-1">
                  Access Username
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. NEXORA"
                  className="w-full px-4 py-2.5 rounded bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-glow select-text"
                />
              </div>

              <div>
                <label className="text-[9px] text-slate-500 tracking-widest block mb-1">
                  Access Key Pass
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Pass"
                  className="w-full px-4 py-2.5 rounded bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-glow"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-gradient-to-r from-silver-light to-cyan-glow text-space-black font-extrabold text-xs uppercase tracking-widest transition-all hover:scale-102 active:scale-98 select-none mt-4 cursor-pointer shadow-[0_0_15px_rgba(0,229,255,0.25)]"
              >
                COMPILE ADMIN SYSTEM
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* 2. Admin Desk View Panel once authorized */
        <div className="animate-fadeIn">
          
          {/* Header */}
          <div className="mb-8 p-6 rounded-2xl border border-cyan-glow/20 bg-cyan-glow/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <div className="flex items-center gap-2 text-cyan-glow font-mono text-xs uppercase tracking-widest">
                <Database size={13} />
                <span>SECURE DATABASE SYNC ACTIVE</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-widest font-sans mt-1.5">
                NEXORA HELIX <span className="text-cyan-glow">ADMIN CONTROL</span>
              </h2>
            </div>

            <div className="flex gap-3">
              <button
                onClick={fetchAdminData}
                disabled={loading}
                className="p-2.5 rounded border border-slate-800 hover:border-cyan-glow text-cyan-glow bg-[#070b19]/30 hover:bg-cyan-glow/10 transition-all cursor-pointer"
                title="Refresh Row Catalogs"
              >
                <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
              </button>
              
              <button
                onClick={() => { onAdminStateChange(false); setUsername(""); setPassword(""); }}
                className="px-4 py-2 text-xs uppercase font-bold tracking-widest text-red-400 border border-red-500/30 rounded bg-red-950/10 hover:bg-red-950/30 transition-all cursor-pointer"
              >
                Exit Session
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded border border-red-500/30 bg-red-500/10 text-red-500 text-xs mb-6 font-mono select-text">
              {errorMsg}
            </div>
          )}

          {/* Tab controls */}
          <div className="grid grid-cols-3 text-center border-b border-slate-950 mb-8 select-none">
            <button
              onClick={() => setAdminTab("requests")}
              className={`py-3 text-xs md:text-sm font-black uppercase tracking-widest transition-all border-b-2 flex items-center justify-center gap-2 ${adminTab === "requests" ? "text-cyan-glow border-cyan-glow bg-cyan-glow/5 font-extrabold" : "text-slate-500 border-transparent hover:text-slate-300"}`}
            >
              <Layers size={14} />
              <span>PROJECT SPECIFICATIONS ({projectRequests.length})</span>
            </button>
            <button
              onClick={() => setAdminTab("users")}
              className={`py-3 text-xs md:text-sm font-black uppercase tracking-widest transition-all border-b-2 flex items-center justify-center gap-2 ${adminTab === "users" ? "text-cyan-glow border-cyan-glow bg-cyan-glow/5 font-extrabold" : "text-slate-500 border-transparent hover:text-slate-300"}`}
            >
              <Users size={14} />
              <span>REGISTERED ROWS ({registeredUsers.length})</span>
            </button>
            <button
              onClick={() => setAdminTab("ratings")}
              className={`py-3 text-xs md:text-sm font-black uppercase tracking-widest transition-all border-b-2 flex items-center justify-center gap-2 ${adminTab === "ratings" ? "text-cyan-glow border-cyan-glow bg-cyan-glow/5 font-extrabold" : "text-slate-500 border-transparent hover:text-slate-300"}`}
            >
              <Star size={14} />
              <span>RATINGS & FEEDBACKS ({projectRequests.filter(r => r.rating > 0).length})</span>
            </button>
          </div>

          {loading ? (
            <div className="py-24 text-center font-mono text-xs uppercase text-slate-500 tracking-[0.25em] animate-pulse">
              SYNCING REDUNDANCY DISK REPLICAS...
            </div>
          ) : (
            <div>
              {/* Tab 1: Project Specifications table */}
              {adminTab === "requests" && (
                <div className="overflow-x-auto rounded-xl border border-slate-900 bg-space-card/25">
                  <table className="w-full text-left font-sans text-xs border-collapse">
                    <thead className="bg-slate-950 text-slate-400 font-mono text-[9px] tracking-widest uppercase border-b border-slate-900">
                      <tr>
                        <th className="p-4">TOKEN ID</th>
                        <th className="p-4">CLIENT NAME / EMAIL</th>
                        <th className="p-4">SPECIFICATION TEXT ("WHAT TO DO")</th>
                        <th className="p-4">STATUS STATE</th>
                        <th className="p-4">PPT PRESENTATION / ABSTRACT</th>
                        <th className="p-4 text-center">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900 text-slate-300">
                      {projectRequests.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-slate-500 font-mono">
                            No active project submissions discovered.
                          </td>
                        </tr>
                      ) : (
                        projectRequests.map((req) => (
                          <tr key={req.id} className="hover:bg-slate-950/40 transition-colors">
                            <td className="p-4 font-mono font-bold text-[10.5px] text-white">
                              {req.id}
                              <p className="text-[8px] text-slate-600 mt-0.5">
                                {new Date(req.created_at).toLocaleDateString()}
                              </p>
                            </td>
                            <td className="p-4 select-text">
                              <p className="font-bold text-white max-w-[150px] truncate">{req.name}</p>
                              <p className="text-[10px] text-cyan-glow select-text">{req.email}</p>
                              <p className="text-[9px] text-slate-500 font-mono select-text">PH: {req.phone}</p>
                            </td>
                            <td className="p-4 max-w-xs select-text">
                              <div className="bg-slate-950/60 p-2.5 rounded border border-slate-900 overflow-y-auto max-h-[80px] text-[10.5px] leading-relaxed text-slate-400 whitespace-pre-wrap select-text font-mono">
                                {req.what_to_do}
                              </div>
                            </td>
                            <td className="p-4">
                              {req.status === "pending" && (
                                <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/40 text-amber-500 font-mono text-[9px] uppercase font-bold rounded">
                                  Pending Review
                                </span>
                              )}
                              {req.status === "in_progress" && (
                                <span className="px-2 py-0.5 bg-cyan-glow/10 border border-cyan-glow/40 text-cyan-glow font-mono text-[9px] uppercase font-bold rounded animate-pulse">
                                  In Progress
                                </span>
                              )}
                              {req.status === "done" && (
                                <span className="px-2 py-0.5 bg-green-500/10 border border-green-500/40 text-green-500 font-mono text-[9px] uppercase font-bold rounded">
                                  Done / Delivered
                                </span>
                              )}
                            </td>
                            <td className="p-4 max-w-[200px]">
                              {req.status === "done" ? (
                                <div className="text-[10.5px] flex flex-col gap-1 font-mono">
                                  <p className="text-green-400 font-bold uppercase text-[8px]">✓ Assets Compiled</p>
                                  {req.ppt_url ? (
                                    <p className="text-slate-500 truncate select-text" title={req.ppt_url}>
                                      PPT: {req.ppt_url}
                                    </p>
                                  ) : (
                                    <p className="text-red-500 italic text-[9px]">Missing PPT Link</p>
                                  )}
                                  {req.abstract_content ? (
                                    <p className="text-slate-500 truncate select-text" title={req.abstract_content}>
                                      ABSTRACT: {req.abstract_content}
                                    </p>
                                  ) : (
                                    <p className="text-red-500 italic text-[9px]">Missing Abstract Text</p>
                                  )}
                                </div>
                              ) : (
                                <span className="text-[10px] text-slate-600 italic">
                                  Active compiling phase
                                </span>
                              )}
                            </td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() => openStatusEditor(req)}
                                className="px-3 py-1.5 border border-cyan-glow/30 hover:border-cyan-glow text-cyan-glow hover:bg-cyan-glow/10 rounded font-mono text-[10px] uppercase transition-all select-none cursor-pointer"
                              >
                                Edit assets
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Tab 2: Registered Rows table */}
              {adminTab === "users" && (
                <div className="overflow-x-auto rounded-xl border border-slate-900 bg-space-card/25">
                  <table className="w-full text-left font-sans text-xs border-collapse">
                    <thead className="bg-slate-950 text-slate-400 font-mono text-[9px] tracking-widest uppercase border-b border-slate-900">
                      <tr>
                        <th className="p-4">USER NAME</th>
                        <th className="p-4">CLASSIFICATION</th>
                        <th className="p-4">SECURE EMAIL PIN</th>
                        <th className="p-4">TELEPHONE PHONE</th>
                        <th className="p-4">COLLEGE / COMPANY DESIGNATION</th>
                        <th className="p-4">SIGNUP REGISTER DATE</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900 text-slate-350">
                      {registeredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-slate-500 font-mono">
                            No accounts registered.
                          </td>
                        </tr>
                      ) : (
                        registeredUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-slate-950/40 transition-colors">
                            <td className="p-4 font-bold text-white select-text">
                              {user.name}
                            </td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 text-[9px] uppercase font-bold tracking-widest font-mono rounded ${user.role === "student" ? "bg-cyan-glow/10 border border-cyan-glow/30 text-cyan-glow" : "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"}`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="p-4 select-text font-mono text-[11px] text-cyan-glow">
                              {user.email}
                            </td>
                            <td className="p-4 select-text font-mono text-[11px] text-slate-300">
                              {user.phone}
                            </td>
                            <td className="p-4">
                              {user.role === "student" ? (
                                <div>
                                  <p className="font-bold text-white select-text">{user.college}</p>
                                  <p className="text-[10px] text-slate-500 uppercase font-mono mt-0.5">{user.dept} ({user.yr})</p>
                                </div>
                              ) : (
                                <div>
                                  <p className="font-bold text-white select-text">{user.company}</p>
                                  <p className="text-[10px] text-slate-500 uppercase font-mono mt-0.5">{user.designation}</p>
                                </div>
                              )}
                            </td>
                            <td className="p-4 font-mono text-[10px] text-slate-500">
                              {user.created_at ? new Date(user.created_at).toLocaleDateString() : "Historical"}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Tab 3: Ratings and Feedbacks Panel (Requested saparately) */}
              {adminTab === "ratings" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {projectRequests.filter(r => r.rating > 0).length === 0 ? (
                    <div className="col-span-2 py-16 text-center border-2 border-dashed border-slate-900 rounded-xl bg-space-card/10 text-slate-500 font-mono text-xs uppercase tracking-widest">
                      No ratings or feedback received. Encourage student dashboard submissions!
                    </div>
                  ) : (
                    projectRequests.filter(r => r.rating > 0).map((rf) => (
                      <div 
                        key={rf.id}
                        className="p-5 rounded-xl border border-slate-800 bg-space-card/20 flex flex-col gap-3"
                      >
                        <div className="flex justify-between items-center border-b border-slate-900 pb-3 font-mono text-[10px]">
                          <div>
                            <span className="text-slate-500 uppercase">PROJECT REF //</span>
                            <span className="text-white font-bold ml-1">{rf.id}</span>
                          </div>
                          
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star 
                                key={s} 
                                size={12} 
                                className={s <= rf.rating! ? "text-yellow-400 fill-yellow-400" : "text-slate-800"} 
                              />
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-0.5">STUDENT EVALUATOR</p>
                          <p className="text-white text-xs font-bold">{rf.name} ({rf.email})</p>
                        </div>

                        <div>
                          <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-1.5">WRITTEN FEEDBACK</p>
                          <p className="text-xs text-slate-350 bg-slate-950 p-3 rounded font-sans antialiased border border-slate-900 select-text leading-relaxed">
                            {rf.feedback ? `"${rf.feedback}"` : "Rated without comments."}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* EDIT ASSETS & DONE STATUS MODAL */}
          {editingRequest && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
              <div 
                className="relative w-full max-w-xl rounded-2xl border border-cyan-glow/50 bg-black p-6 md:p-8 [box-shadow:0_0_50px_rgba(0,229,255,0.15)]"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setEditingRequest(null)}
                  className="absolute top-5 right-5 p-2 rounded-full border border-slate-800 text-slate-400 hover:text-white"
                >
                  <X size={15} />
                </button>

                <h3 className="text-lg md:text-xl font-black text-white tracking-widest uppercase font-sans mb-3 text-cyan-glow">
                  WRITE COMPILATION ASSETS
                </h3>
                <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest mb-5">
                  Update status, link PPT layouts, and write technical abstracts immediately.
                </p>

                <form onSubmit={submitUpdateRequest} className="flex flex-col gap-4 font-mono text-[11px] uppercase tracking-wider text-slate-300">
                  <div>
                    <label className="text-[9px] text-slate-500 block mb-1">Status Class</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as any)}
                      className="w-full py-2.5 px-3 rounded bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-glow"
                    >
                      <option value="pending">Pending Review (waiting for call)</option>
                      <option value="in_progress">In Progress</option>
                      <option value="done">Done / Assets Delivered</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[9px] text-slate-500 block mb-1">PPT Presentation URL</label>
                    <div className="relative">
                      <input
                        type="url"
                        value={pptUrl}
                        onChange={(e) => setPptUrl(e.target.value)}
                        placeholder="e.g. https://docs.google.com/presentation/d/your-id/edit"
                        className="w-full px-4 py-2.5 rounded bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-glow select-text"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] text-slate-500 block mb-1">Technical Abstract Content</label>
                    <textarea
                      value={abstractContent}
                      onChange={(e) => setAbstractContent(e.target.value)}
                      placeholder="Write core abstract paragraphs, methodologies, and database layout descriptions here..."
                      rows={4}
                      className="w-full p-3.5 rounded bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-glow font-sans leading-relaxed select-text"
                    ></textarea>
                  </div>

                  <div className="flex justify-end gap-3.5 pt-4 border-t border-slate-900 mt-2 select-none">
                    <button
                      type="button"
                      onClick={() => setEditingRequest(null)}
                      className="px-4 py-2 rounded border border-slate-800 text-slate-500 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updateLoading}
                      className="px-6 py-2 rounded bg-gradient-to-r from-silver-light to-cyan-glow text-[#030712] hover:opacity-90 font-extrabold text-xs tracking-widest transition-all cursor-pointer"
                    >
                      {updateLoading ? "WRITING DISK..." : "COMMIT ASSETS"}
                    </button>
                  </div>
                </form>

              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
