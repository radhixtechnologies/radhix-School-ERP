import { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { LoginView } from "./components/LoginView";
import { DashboardView } from "./components/DashboardView";
import { AcademicsView } from "./components/AcademicsView";
import { AdmissionsView } from "./components/AdmissionsView";
import { StaffView } from "./components/StaffView";
import { AttendanceView } from "./components/AttendanceView";
import { NoticesView } from "./components/NoticesView";
import { FeesView } from "./components/FeesView";
import { HomeworkView } from "./components/HomeworkView";
import { ExamsView } from "./components/ExamsView";
import { TransportView } from "./components/TransportView";
import { SuperAdminView } from "./components/SuperAdminView";
import { TicketsView } from "./components/TicketsView";
import {
  Calendar,
  Bell,
  ShieldCheck,
  School,
  ArrowRightLeft,
  ExternalLink,
  Lock,
  LogOut,
  ChevronRight,
  Palette
} from "lucide-react";


export interface ThemeConfig {
  id: string;
  name: string;
  primary: string;
  accent: string;
  gradient: string;
  lightBg: string;
}

export const THEME_PRESETS: ThemeConfig[] = [
  { id: "royal_indigo", name: "Royal Indigo", primary: "#474A74", accent: "#312E81", gradient: "linear-gradient(135deg, #474A74 0%, #312E81 100%)", lightBg: "#EEF2FF" },
  { id: "emerald_green", name: "Emerald Green", primary: "#059669", accent: "#047857", gradient: "linear-gradient(135deg, #059669 0%, #047857 100%)", lightBg: "#ECFDF5" },
  { id: "royal_purple", name: "Royal Purple", primary: "#7C3AED", accent: "#6D28D9", gradient: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)", lightBg: "#F5F3FF" },
  { id: "crimson_ruby", name: "Crimson Ruby", primary: "#E11D48", accent: "#BE123C", gradient: "linear-gradient(135deg, #E11D48 0%, #BE123C 100%)", lightBg: "#FFF1F2" },
  { id: "sunset_amber", name: "Sunset Amber", primary: "#D97706", accent: "#B45309", gradient: "linear-gradient(135deg, #D97706 0%, #B45309 100%)", lightBg: "#FFFBEB" },
  { id: "midnight_dark", name: "Midnight Dark", primary: "#1E293B", accent: "#0F172A", gradient: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)", lightBg: "#F1F5F9" },
];

type PortalType = "admin" | "super-admin";

export default function App() {
  // Determine current portal and tab from URL
  const getInitialRoute = (): { portal: PortalType; tab: string } => {
    const path = window.location.pathname.toLowerCase();
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get("tab");

    if (path.startsWith("/super-admin")) {
      return {
        portal: "super-admin",
        tab: tabParam || "super-dashboard"
      };
    }

    // Default to /admin
    return {
      portal: "admin",
      tab: tabParam || "dashboard"
    };
  };

  const initial = getInitialRoute();
  const [currentPortal, setCurrentPortal] = useState<PortalType>(initial.portal);
  const [activeTab, setActiveTab] = useState<string>(initial.tab);

  const [token, setToken] = useState<string | null>(localStorage.getItem("ia_token"));
  const [user, setUser] = useState<any>(null);
  const [institute, setInstitute] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState<boolean>(!!token);
  // Theme state with local persistence
  const [currentTheme, setCurrentTheme] = useState<string>(localStorage.getItem("ia_theme") || "royal_indigo");
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const activeTheme = THEME_PRESETS.find((t) => t.id === currentTheme) || THEME_PRESETS[0];

  useEffect(() => {
    localStorage.setItem("ia_theme", currentTheme);
    document.documentElement.style.setProperty("--primary-color", activeTheme.primary);
    document.documentElement.style.setProperty("--primary-accent", activeTheme.accent);
    document.documentElement.style.setProperty("--primary-gradient", activeTheme.gradient);
  }, [currentTheme]);


  // Synchronize browser history and path
  const navigateTo = (portal: PortalType, tab?: string) => {
    const basePath = portal === "super-admin" ? "/super-admin" : "/admin";
    const selectedTab = tab || (portal === "super-admin" ? "super-dashboard" : "dashboard");
    const targetUrl = `${basePath}?tab=${selectedTab}`;

    window.history.pushState(null, "", targetUrl);
    setCurrentPortal(portal);
    setActiveTab(selectedTab);
  };

  // Listen for browser forward/back buttons
  useEffect(() => {
    const handlePopState = () => {
      const route = getInitialRoute();
      setCurrentPortal(route.portal);
      setActiveTab(route.tab);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Normalize root URL "/" to "/admin"
  useEffect(() => {
    const path = window.location.pathname;
    if (path === "/" || path === "") {
      const defaultPortal = user?.role === "SUPER_ADMIN" ? "super-admin" : "admin";
      navigateTo(defaultPortal);
    }
  }, [user]);

  // Load user profile on mount
  useEffect(() => {
    if (token) {
      loadProfileAndStats();
    } else {
      setLoadingProfile(false);
    }
  }, [token]);

  const loadProfileAndStats = async () => {
    setLoadingProfile(true);
    try {
      const meRes = await fetch("http://localhost:5000/api/v1/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const meData = await meRes.json();
      if (meData.success) {
        setUser(meData.user);
        setInstitute(meData.institute);

        // If user is SUPER_ADMIN and currently on /admin without a school chosen, default to Delhi Public
        if (meData.user.role === "SUPER_ADMIN" && !meData.institute) {
          setInstitute({
            id: "1",
            name: "Delhi Public Academy",
            code: "DPA101",
            type: "SCHOOL",
            institute_type: "SCHOOL"
          });
        }

        // Fetch stats if in school admin mode
        if (meData.user.role !== "SUPER_ADMIN" || currentPortal === "admin") {
          fetchDashboardStats(token);
        }
      } else {
        handleLogout();
        return;
      }
    } catch {
      handleLogout();
    } finally {
      setLoadingProfile(false);
    }
  };

  const fetchDashboardStats = async (authToken: string | null) => {
    if (!authToken) return;
    try {
      const statsRes = await fetch("http://localhost:5000/api/v1/tenant-admin/dashboard-stats", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const statsData = await statsRes.json();
      if (statsData.success) {
        setStats(statsData.data);
      }
    } catch {
      // Ignore stats failure
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("ia_token");
    setToken(null);
    setUser(null);
    setInstitute(null);
    setStats(null);
  };

  // Tab switch handler that updates browser URL
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    const basePath = currentPortal === "super-admin" ? "/super-admin" : "/admin";
    window.history.replaceState(null, "", `${basePath}?tab=${tabId}`);
  };

  const handleSwitchToSchoolFromSuperAdmin = (schoolId: string, schoolName: string) => {
    setInstitute({
      id: schoolId,
      name: schoolName,
      code: "DPA101",
      type: "SCHOOL",
      institute_type: "SCHOOL"
    });
    navigateTo("admin", "dashboard");
  };

  // If user is not authenticated, render LoginView with selected portal
  if (!token || !user) {
    if (loadingProfile) {
      return (
        <div style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F8FAFC",
          fontSize: "14px",
          color: "#64748B",
          fontWeight: 700
        }}>
          Loading portal session...
        </div>
      );
    }

    return (
      <LoginView
        portal={currentPortal}
        onSwitchPortal={(portal) => navigateTo(portal)}
        onLoginSuccess={(t, u, inst) => {
          setToken(t);
          setUser(u);
          setInstitute(inst);

          // Route to proper portal based on user role
          if (u.role === "SUPER_ADMIN") {
            navigateTo("super-admin", "super-dashboard");
          } else {
            navigateTo("admin", "dashboard");
          }
        }}
      />
    );
  }

  // ACCESS GUARD: If a School Admin visits "/super-admin", show an access denied prompt
  if (currentPortal === "super-admin" && user.role !== "SUPER_ADMIN") {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)",
        padding: "24px"
      }}>
        <div style={{
          background: "#FFFFFF",
          borderRadius: "20px",
          padding: "36px",
          maxWidth: "480px",
          width: "100%",
          textAlign: "center",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)"
        }}>
          <div style={{
            width: "56px",
            height: "56px",
            borderRadius: "16px",
            background: "#FEE2E2",
            color: "#DC2626",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "16px"
          }}>
            <Lock size={28} />
          </div>
          <h2 style={{ fontSize: "20px", fontWeight: 900, color: "#0F172A", margin: "0 0 8px 0" }}>
            Super Admin Access Only
          </h2>
          <p style={{ fontSize: "14px", color: "#64748B", lineHeight: "1.5", margin: "0 0 24px 0" }}>
            You are signed in as <strong>{user.username || user.email}</strong> with role <strong>School Admin</strong>.
            The route <code style={{ color: "#4F46E5", fontWeight: 700 }}>/super-admin</code> is reserved exclusively for the SaaS Platform Owner.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <button
              onClick={() => navigateTo("admin", "dashboard")}
              style={{
                background: "#474A74",
                color: "#FFFFFF",
                border: "none",
                padding: "12px 20px",
                borderRadius: "12px",
                fontWeight: 800,
                fontSize: "14px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px"
              }}
            >
              <School size={16} />
              <span>Go to School Admin Portal (/admin)</span>
            </button>

            <button
              onClick={handleLogout}
              style={{
                background: "#F1F5F9",
                color: "#64748B",
                border: "none",
                padding: "10px",
                borderRadius: "10px",
                fontWeight: 700,
                fontSize: "13px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px"
              }}
            >
              <LogOut size={15} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isSuperAdminPortal = currentPortal === "super-admin";

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F8FAFC" }}>
      {/* Isolated Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        institute={institute}
        user={user}
        onLogout={handleLogout}
        isSuperAdmin={isSuperAdminPortal}
        currentPath={isSuperAdminPortal ? "/super-admin" : "/admin"}
        onSwitchPortal={(target) => navigateTo(target)}
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Top Header Bar */}
        <header style={{
          height: "68px",
          background: "#FFFFFF",
          borderBottom: "1px solid #E2E8F0",
          padding: "0 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 40,
          boxShadow: "0 2px 10px rgba(0,0,0,0.02)"
        }}>
          {/* Left Title & Route Pill */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              background: isSuperAdminPortal
                ? "linear-gradient(135deg, #1E1B4B 0%, #4338CA 100%)"
                : "linear-gradient(135deg, #474A74 0%, #312E81 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 800,
              fontSize: "14px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
            }}>
              {isSuperAdminPortal ? <ShieldCheck size={22} /> : <School size={22} />}
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "16px", fontWeight: "800", color: "#0F172A" }}>
                  {isSuperAdminPortal
                    ? "Radhix Technology — Multi-Vendor School ERP SaaS"
                    : (institute?.name || "Delhi Public Academy")}
                </span>

                <span style={{
                  fontSize: "11px",
                  fontWeight: "800",
                  padding: "3px 8px",
                  borderRadius: "12px",
                  background: isSuperAdminPortal ? "#EDE9FE" : "#F1F5F9",
                  color: isSuperAdminPortal ? "#6D28D9" : "#475569",
                  fontFamily: "monospace"
                }}>
                  {isSuperAdminPortal ? "/super-admin" : "/admin"}
                </span>
              </div>

              <div style={{ fontSize: "12px", color: "#64748B" }}>
                {isSuperAdminPortal
                  ? "Platform Owner Level • Multi-Tenant Central Hub"
                  : "K-12 School Management System • Session 2026-27"}
              </div>
            </div>
          </div>

          {/* Right Action Icons & Portal Switcher */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            {/* Quick Portal Switcher for Super Admin users */}
            {user.role === "SUPER_ADMIN" && (
              <button
                onClick={() => navigateTo(isSuperAdminPortal ? "admin" : "super-admin")}
                style={{
                  background: isSuperAdminPortal ? "#F8FAFC" : "#EDE9FE",
                  color: isSuperAdminPortal ? "#334155" : "#6D28D9",
                  border: `1px solid ${isSuperAdminPortal ? "#CBD5E1" : "#DDD6FE"}`,
                  padding: "8px 14px",
                  borderRadius: "10px",
                  fontSize: "12px",
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                <ArrowRightLeft size={14} />
                <span>{isSuperAdminPortal ? "Switch to School Admin (/admin)" : "Return to Super Admin (/super-admin)"}</span>
              </button>
            )}

            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              background: "#F1F5F9",
              borderRadius: "20px",
              fontSize: "12px",
              color: "#475569",
              fontWeight: "600"
            }}>
              <Calendar size={14} />
              <span>Oct 2026</span>
            </div>

            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "#F1F5F9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#64748B",
              position: "relative",
              cursor: "pointer"
            }}>
              <Bell size={18} />
              <span style={{
                position: "absolute",
                top: "8px",
                right: "8px",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#EF4444",
                border: "2px solid #fff"
              }} />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: isSuperAdminPortal ? "#1E1B4B" : "#474A74",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "800",
                fontSize: "13px"
              }}>
                {user.role === "SUPER_ADMIN" ? "SA" : "AD"}
              </div>
              <div>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "#0F172A" }}>
                  {user.role === "SUPER_ADMIN" ? "Platform Owner" : "Principal"}
                </div>
                <div style={{ fontSize: "11px", color: "#10B981", fontWeight: "700" }}>
                  ● Active Session
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Super Admin Inspection Mode Banner if Super Admin is on /admin */}
        {!isSuperAdminPortal && user.role === "SUPER_ADMIN" && (
          <div style={{
            background: "linear-gradient(90deg, #1E1B4B 0%, #4338CA 100%)",
            color: "#FFFFFF",
            padding: "10px 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "13px",
            fontWeight: 700
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <ShieldCheck size={18} color="#A7F3D0" />
              <span>
                <strong>Super Admin Mode:</strong> You are inspecting the School Admin portal at <code>/admin</code>. Any edits will affect live school data.
              </span>
            </div>
            <button
              onClick={() => navigateTo("super-admin", "super-dashboard")}
              style={{
                background: "#FFFFFF",
                color: "#1E1B4B",
                border: "none",
                padding: "6px 14px",
                borderRadius: "8px",
                fontWeight: 800,
                fontSize: "12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              <span>Back to Super Admin (/super-admin)</span>
              <ChevronRight size={14} />
            </button>
          </div>
        )}

        {/* Main Content Area */}
        <main style={{ flex: 1, overflowY: "auto" }}>
          {isSuperAdminPortal ? (
            <SuperAdminView
              token={token}
              onSwitchToSchool={handleSwitchToSchoolFromSuperAdmin}
              activeTab={activeTab}
              setActiveTab={handleTabChange}
              onNavigateToSchoolAdmin={() => navigateTo("admin", "dashboard")}
            />
          ) : (
            <>
              {activeTab === "dashboard" && (
                <DashboardView
                  stats={stats}
                  institute={institute}
                  user={user}
                  onNavigateTab={handleTabChange}
                />
              )}
              {activeTab === "academics" && <AcademicsView institute={institute} token={token} />}
              {activeTab === "homework" && <HomeworkView token={token} institute={institute} />}
              {activeTab === "exams" && <ExamsView />}
              {activeTab === "admissions" && <AdmissionsView token={token} institute={institute} />}
              {activeTab === "staff" && <StaffView token={token} institute={institute} />}
              {activeTab === "attendance" && <AttendanceView token={token} institute={institute} />}
              {activeTab === "fees" && <FeesView token={token} institute={institute} />}
              {activeTab === "transport" && <TransportView token={token} />}
              {activeTab === "notices" && <NoticesView token={token || ""} />}
              {activeTab === "tickets" && <TicketsView token={token} user={user} institute={institute} />}
              {activeTab === "super-tickets" && <SuperAdminView token={token || ""} onSwitchToSchool={handleSwitchToSchoolFromSuperAdmin} activeTab="super-tickets" setActiveTab={handleTabChange} onNavigateToSchoolAdmin={() => navigateTo("admin", "dashboard")} />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
