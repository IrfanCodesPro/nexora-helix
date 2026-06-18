import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Innovations from "./components/Innovations";
import Services from "./components/Services";
import Achievements from "./components/Achievements";
import Footer from "./components/Footer";
import AuthDialog from "./components/AuthDialog";
import UserDashboard from "./components/UserDashboard";
import AdminDashboard from "./components/AdminDashboard";
import { User } from "./types";
import { HelpCircle, ChevronRight, Sparkles, Send, Phone, Mail } from "lucide-react";

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<"home" | "dashboard" | "admin">("home");
  const [authDialogOpened, setAuthDialogOpened] = useState(false);
  
  // Custom smart flow states
  const [openAskProjectDirectly, setOpenAskProjectDirectly] = useState(false);

  // Restore authenticated session
  useEffect(() => {
    const savedUser = localStorage.getItem("nexora_user");
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to restore session user", e);
      }
    }
    const savedAdmin = localStorage.getItem("nexora_admin");
    if (savedAdmin === "true") {
      setIsAdminLoggedIn(true);
    }
  }, []);

  // Synchronize path/hash with currentView for hidden admin portal access
  useEffect(() => {
    const checkAdminRoute = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === "/admin" || hash === "#admin" || path.endsWith("/admin")) {
        setCurrentView("admin");
      }
    };
    checkAdminRoute();
    window.addEventListener("popstate", checkAdminRoute);
    window.addEventListener("hashchange", checkAdminRoute);
    const interval = setInterval(checkAdminRoute, 1000);
    return () => {
      window.removeEventListener("popstate", checkAdminRoute);
      window.removeEventListener("hashchange", checkAdminRoute);
      clearInterval(interval);
    };
  }, []);

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem("nexora_user", JSON.stringify(user));
    
    // Smooth redirection state
    if (openAskProjectDirectly) {
      setCurrentView("dashboard");
    } else {
      setCurrentView("dashboard");
    }
  };

  const handleAdminStateChange = (loggedIn: boolean) => {
    setIsAdminLoggedIn(loggedIn);
    if (loggedIn) {
      localStorage.setItem("nexora_admin", "true");
    } else {
      localStorage.removeItem("nexora_admin");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAdminLoggedIn(false);
    localStorage.removeItem("nexora_user");
    localStorage.removeItem("nexora_admin");
    setCurrentView("home");
    setOpenAskProjectDirectly(false);
  };

  const handleNavigateToView = (view: "home" | "dashboard" | "admin") => {
    if (view === "dashboard" && !currentUser) {
      setAuthDialogOpened(true);
      return;
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenAskProjectFlow = () => {
    if (!currentUser) {
      setOpenAskProjectDirectly(true);
      setAuthDialogOpened(true);
    } else {
      setCurrentView("dashboard");
      setOpenAskProjectDirectly(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black relative">
      
      {/* 2. Top Header Navigation */}
      <Header
        currentUser={currentUser}
        isAdmin={isAdminLoggedIn}
        onOpenAuth={() => { setOpenAskProjectDirectly(false); setAuthDialogOpened(true); }}
        onLogout={handleLogout}
        onNavigateTo={handleNavigateToView}
        currentView={currentView}
        onOpenAskProject={currentUser ? handleOpenAskProjectFlow : undefined}
      />

      {/* 3. Main Routing Layout blocks */}
      <main className="flex-grow relative">
        {currentView === "home" && (
          <div className="animate-fadeIn">
            {/* Hero module */}
            <Hero 
              onGetStarted={() => { setOpenAskProjectDirectly(false); setAuthDialogOpened(true); }}
              onBrowseInnovations={() => {
                const element = document.getElementById("innovations");
                element?.scrollIntoView({ behavior: "smooth" });
              }}
            />

            {/* Previous Innovations list as unifiedATS format */}
            <Innovations />

            {/* Poster Services catalog lists */}
            <Services />

            {/* Dynamic Milestones Accomplishments section */}
            <Achievements />

            {/* Elegant Space Grid Info block */}
            <section className="py-16 px-6 bg-slate-950/40 border-b border-slate-900 relative">
              <div className="max-w-4xl mx-auto p-8 rounded-2xl border border-cyan-glow/20 bg-space-card/25 flex flex-col md:flex-row items-center gap-8 justify-between">
                <div>
                  <h4 className="text-sm font-black text-cyan-glow tracking-widest font-mono uppercase mb-2">
                    Autonomous Intelligence Matrix
                  </h4>
                  <h3 className="text-xl md:text-2xl font-bold text-white tracking-wider font-sans uppercase">
                    Looking for custom paper customization?
                  </h3>
                  <p className="text-xs text-silver-dark leading-relaxed font-sans max-w-lg mt-2 font-normal">
                    Whether you are an engineering student finalizing key deliverables or a professional researching autonomous multi-agent solvers, we map compliant software components matching your core criteria.
                  </p>
                </div>
                
                <button
                  onClick={handleOpenAskProjectFlow}
                  className="px-6 py-3 rounded-lg border-2 border-cyan-glow text-cyan-glow text-xs uppercase font-extrabold tracking-widest hover:bg-cyan-glow hover:text-space-black transition-all cursor-pointer whitespace-nowrap shrink-0"
                >
                  Ask Project Now
                </button>
              </div>
            </section>

            {/* Silver & Electric Blue styled Footer */}
            <Footer />
          </div>
        )}

        {currentView === "dashboard" && currentUser && (
          <div className="animate-fadeIn">
            <UserDashboard 
              currentUser={currentUser}
              onLogout={handleLogout}
              openAskProjectDirectly={openAskProjectDirectly}
              onCloseAskProjectDirectly={() => setOpenAskProjectDirectly(false)}
            />
          </div>
        )}

        {currentView === "admin" && (
          <div className="animate-fadeIn">
            <AdminDashboard 
              isAdminLoggedIn={isAdminLoggedIn}
              onAdminStateChange={handleAdminStateChange}
            />
          </div>
        )}
      </main>

      {/* 4. Auth modal overlay for Guests */}
      {authDialogOpened && (
        <AuthDialog 
          onClose={() => setAuthDialogOpened(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}

    </div>
  );
}
