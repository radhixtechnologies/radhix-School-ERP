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
import { AdmissionCounsellorView } from "./components/AdmissionCounsellorView";
import { FinanceView } from "./components/FinanceView";
import { OnlineClassesView } from "./components/OnlineClassesView";
import { CleanlinessInspectionView } from "./components/CleanlinessInspectionView";
import { GlobalLoader } from "./components/GlobalLoader";
import { triggerGlobalLoader } from "./services/apiMockInterceptor";
import { CustomerLandingPage } from "./components/CustomerLandingPage";
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
  Search,
  Moon,
  Sun,
  MessageSquare,
  Sparkles,
  Plus,
  GraduationCap,
  Globe
} from "lucide-react";

type PortalType = "admin" | "super-admin" | "landing";

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

    if (path.startsWith("/admin")) {
      return {
        portal: "admin",
        tab: tabParam || "dashboard"
      };
    }

    // Default to Public Customer Landing Website on "/" or "/landing"
    return {
      portal: "landing",
      tab: tabParam || "home"
    };
  };

  const initial = getInitialRoute();
  const [currentPortal, setCurrentPortal] = useState<PortalType>(initial.portal);
  const [activeTab, setActiveTab] = useState<string>(initial.tab);

  const [token, setToken] = useState<string | null>(localStorage.getItem("ia_token"));
  const [user, setUser] = useState<any>(() => {
    try {
      const u = localStorage.getItem("ia_user");
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  });
  const [institute, setInstitute] = useState<any>(() => {
    try {
      const inst = localStorage.getItem("ia_institute");
      return inst ? JSON.parse(inst) : null;
    } catch {
      return null;
    }
  });
  const [stats, setStats] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState<boolean>(false);

  // Pure 2-Theme Mode (Light & Dark Mode matching Preskool)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("theme_mode") === "dark";
  });

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme_mode", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme_mode", "light");
    }
  }, [isDarkMode]);

  // Synchronize browser history and path
  const navigateTo = (portal: PortalType, tab?: string) => {
    triggerGlobalLoader(280);
    let targetUrl = "/";
    if (portal === "super-admin") {
      const selectedTab = tab || "super-dashboard";
      targetUrl = `/super-admin?tab=${selectedTab}`;
      setActiveTab(selectedTab);
    } else if (portal === "admin") {
      const selectedTab = tab || "dashboard";
      targetUrl = `/admin?tab=${selectedTab}`;
      setActiveTab(selectedTab);
    } else {
      targetUrl = "/";
      setActiveTab("home");
    }

    window.history.pushState(null, "", targetUrl);
    setCurrentPortal(portal);
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

  // Load user profile on mount
  useEffect(() => {
    if (token) {
      loadProfileAndStats();
    } else {
      setLoadingProfile(false);
    }
  }, [token]);

  const loadProfileAndStats = async () => {
    if (!token) return;
    try {
      const meRes = await fetch("http://localhost:5000/api/v1/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const meData = await meRes.json();
      if (meData.success && meData.user) {
        setUser(meData.user);
        localStorage.setItem("ia_user", JSON.stringify(meData.user));
        if (meData.institute) {
          setInstitute(meData.institute);
          localStorage.setItem("ia_institute", JSON.stringify(meData.institute));
        }

        // If user is SUPER_ADMIN and currently on /admin without a school chosen, default to Delhi Public
        if (meData.user.role === "SUPER_ADMIN" && !meData.institute) {
          const defaultInst = {
            id: "3aea8ce8-a615-472e-b3ed-a555f44a2ed8",
            name: "Delhi Public Academy",
            code: "DPA101",
            type: "SCHOOL",
            institute_type: "SCHOOL",
            logo_url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=128&q=80",
            address: "Sector 14, Institutional Area, Rohini",
            city: "New Delhi",
            state: "Delhi",
            phone: "011-23456789",
          };
          setInstitute(defaultInst);
          localStorage.setItem("ia_institute", JSON.stringify(defaultInst));
        }

        if (meData.user.role !== "SUPER_ADMIN" || currentPortal === "admin") {
          fetchDashboardStats(token);
        }
      }
    } catch {
      // Don't auto-logout if we already have local session
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
    localStorage.removeItem("ia_user");
    localStorage.removeItem("ia_institute");
    setToken(null);
    setUser(null);
    setInstitute(null);
    setStats(null);
  };

  // Tab switch handler that updates browser URL
  const handleTabChange = (tabId: string) => {
    triggerGlobalLoader(250);
    setActiveTab(tabId);
    const basePath = currentPortal === "super-admin" ? "/super-admin" : "/admin";
    window.history.replaceState(null, "", `${basePath}?tab=${tabId}`);
  };

  const handleSwitchToSchoolFromSuperAdmin = (schoolId: string, schoolName: string, fullSchool?: any) => {
    const inst = fullSchool ? {
      ...fullSchool,
      type: fullSchool.institute_type || "SCHOOL",
      logo_url: fullSchool.logo_url || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=128&q=80",
    } : {
      id: schoolId,
      name: schoolName,
      code: "DPA101",
      type: "SCHOOL",
      institute_type: "SCHOOL",
      logo_url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=128&q=80",
    };
    setInstitute(inst);
    localStorage.setItem("ia_institute", JSON.stringify(inst));
    navigateTo("admin", "dashboard");
  };

  // 1. PUBLIC CUSTOMER SAAS LANDING PAGE (Canva Theme & Self-Registration)
  if (currentPortal === "landing") {
    return (
      <CustomerLandingPage
        onNavigateToLogin={(portal) => navigateTo(portal)}
        onInstantLoginSuccess={(t, u, inst) => {
          localStorage.setItem("ia_token", t);
          localStorage.setItem("ia_user", JSON.stringify(u));
          if (inst) {
            localStorage.setItem("ia_institute", JSON.stringify(inst));
          }
          setToken(t);
          setUser(u);
          setInstitute(inst);
          navigateTo("admin", "dashboard");
        }}
      />
    );
  }

  // 2. If user is not authenticated, render LoginView with selected portal
  if (!token || !user) {
    if (loadingProfile) {
      return (
        <div style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#F8FAFC",
        }}>
          <div className="top-loader-bar">
            <div className="top-loader-bar-inner" />
          </div>
          <div style={{
            width: "60px",
            height: "60px",
            borderRadius: "16px",
            background: "linear-gradient(135deg, #3D5EE1 0%, #2E47C7 100%)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 24px rgba(61, 94, 225, 0.3)",
            marginBottom: "16px"
          }}>
            <School size={28} />
          </div>
          <div style={{ fontSize: "16px", color: "#0F172A", fontWeight: 800 }}>
            Loading Radhix School ERP...
          </div>
          <div style={{ fontSize: "13px", color: "#64748B", marginTop: "4px" }}>
            Restoring session and initializing portal data
          </div>
        </div>
      );
    }

    return (
      <LoginView
        portal={currentPortal === "super-admin" ? "super-admin" : "admin"}
        onSwitchPortal={(portal) => navigateTo(portal)}
        onLoginSuccess={(t, u, inst) => {
          localStorage.setItem("ia_token", t);
          localStorage.setItem("ia_user", JSON.stringify(u));
          if (inst) {
            localStorage.setItem("ia_institute", JSON.stringify(inst));
          }
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
      {/* Global Top Progress Bar & Floating Loading Status Pill */}
      <GlobalLoader />

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
              overflow: "hidden",
              border: (!isSuperAdminPortal && (institute?.logo_url || institute?.logoUrl)) ? "1.5px solid #CBD5E1" : "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
            }}>
              {isSuperAdminPortal ? (
                <ShieldCheck size={22} />
              ) : (institute?.logo_url || institute?.logoUrl) ? (
                <img
                  src={institute.logo_url || institute.logoUrl}
                  alt={institute?.name || "School Logo"}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <School size={22} />
              )}
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
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            {/* Quick ERP Shortcuts */}
            {!isSuperAdminPortal && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <button
                  onClick={() => handleTabChange("admissions")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    background: "rgba(61, 94, 225, 0.08)",
                    color: "var(--primary-color)",
                    border: "1px solid rgba(61, 94, 225, 0.25)",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: 800,
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  <Plus size={13} />
                  <span>+ Admit</span>
                </button>

                <button
                  onClick={() => handleTabChange("cleanliness")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    background: "#ECFDF5",
                    color: "#059669",
                    border: "1px solid #A7F3D0",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: 800,
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  <Sparkles size={13} />
                  <span>Hygiene (4.9★)</span>
                </button>

                <button
                  onClick={() => handleTabChange("notices")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    background: "#FEF2F2",
                    color: "#DC2626",
                    border: "1px solid #FCA5A5",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: 800,
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  <Bell size={13} />
                  <span>Notice Push</span>
                </button>
              </div>
            )}

            {/* Quick Portal Switcher for Super Admin users */}
            {user.role === "SUPER_ADMIN" && (
              <button
                onClick={() => navigateTo(isSuperAdminPortal ? "admin" : "super-admin")}
                style={{
                  background: isSuperAdminPortal ? "#F8FAFC" : "#EDE9FE",
                  color: isSuperAdminPortal ? "#334155" : "#6D28D9",
                  border: `1px solid ${isSuperAdminPortal ? "#CBD5E1" : "#DDD6FE"}`,
                  padding: "7px 12px",
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
                <span>{isSuperAdminPortal ? "To School Admin" : "To Super Admin"}</span>
              </button>
            )}

            {/* Public Customer Website & Registration Link */}
            <button
              onClick={() => navigateTo("landing")}
              title="View Public Customer Website & Pricing"
              style={{
                background: "rgba(197, 157, 255, 0.12)",
                color: "#7C3AED",
                border: "1px solid rgba(197, 157, 255, 0.35)",
                padding: "7px 12px",
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
              <Globe size={14} color="#7C3AED" />
              <span>Customer Website</span>
            </button>

            {/* Global Search Bar */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: isDarkMode ? "#1E2535" : "#F4F6FB",
              border: `1px solid ${isDarkMode ? "#2B344A" : "#E9EDF4"}`,
              borderRadius: "10px",
              padding: "7px 14px",
              width: "220px"
            }}>
              <Search size={15} color={isDarkMode ? "#A0ABC0" : "#8F95B2"} />
              <input
                type="text"
                placeholder="Search portal..."
                style={{
                  border: "none",
                  background: "transparent",
                  outline: "none",
                  fontSize: "13px",
                  color: isDarkMode ? "#F3F4F8" : "#181C32",
                  width: "100%"
                }}
              />
              <span style={{
                fontSize: "10px",
                fontWeight: 800,
                padding: "2px 5px",
                background: isDarkMode ? "#2B344A" : "#FFFFFF",
                borderRadius: "4px",
                color: isDarkMode ? "#94A3B8" : "#8F95B2",
                border: `1px solid ${isDarkMode ? "#334155" : "#E2E8F0"}`
              }}>
                ⌘K
              </span>
            </div>

            {/* Academic Year Selector */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "7px 12px",
              background: isDarkMode ? "#1E2535" : "#F4F6FB",
              borderRadius: "10px",
              fontSize: "12px",
              fontWeight: 800,
              color: isDarkMode ? "#A0ABC0" : "#5E6278",
              border: `1px solid ${isDarkMode ? "#2B344A" : "#E9EDF4"}`
            }}>
              <Calendar size={14} color="#3D5EE1" />
              <span>AY 2026-27</span>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: isDarkMode ? "#1E2535" : "#F4F6FB",
                border: `1px solid ${isDarkMode ? "#2B344A" : "#E9EDF4"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: isDarkMode ? "#FACC15" : "#5E6278",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              {isDarkMode ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {/* Notifications Bell */}
            <div
              title="Official Notices & Alerts"
              onClick={() => handleTabChange("notices")}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: isDarkMode ? "#1E2535" : "#F4F6FB",
                border: `1px solid ${isDarkMode ? "#2B344A" : "#E9EDF4"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: isDarkMode ? "#A0ABC0" : "#5E6278",
                position: "relative",
                cursor: "pointer"
              }}
            >
              <Bell size={17} />
              <span style={{
                position: "absolute",
                top: "7px",
                right: "7px",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#EF4444",
                boxShadow: "0 0 6px #EF4444"
              }} />
            </div>

            {/* User Profile Pill & Logout */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: isDarkMode ? "#1E2535" : "#F8FAFC",
              padding: "4px 10px 4px 6px",
              borderRadius: "12px",
              border: `1px solid ${isDarkMode ? "#2B344A" : "#E2E8F0"}`
            }}>
              <div style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: isSuperAdminPortal
                  ? "linear-gradient(135deg, #1E1B4B 0%, #4338CA 100%)"
                  : "var(--primary-gradient, linear-gradient(135deg, #3D5EE1 0%, #2E47C7 100%))",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "800",
                fontSize: "12px"
              }}>
                {user.role === "SUPER_ADMIN" ? "SA" : "AD"}
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: "12px", fontWeight: "800", color: isDarkMode ? "#F3F4F8" : "#0F172A", lineHeight: 1.2 }}>
                  {user.role === "SUPER_ADMIN" ? "Platform Owner" : "Principal"}
                </div>
                <div style={{ fontSize: "10.5px", color: "#10B981", fontWeight: "700" }}>
                  ● Session Online
                </div>
              </div>

              <button
                onClick={handleLogout}
                title="Sign Out"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#94A3B8",
                  cursor: "pointer",
                  padding: "4px",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <LogOut size={14} />
              </button>
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
                  token={token}
                  onNavigateTab={handleTabChange}
                />
              )}
              {activeTab === "academics" && <AcademicsView institute={institute} token={token} />}
              {activeTab === "homework" && <HomeworkView token={token} institute={institute} />}
              {activeTab === "exams" && <ExamsView institute={institute} />}
              {activeTab === "admissions" && <AdmissionsView token={token} institute={institute} onNavigateTab={handleTabChange} />}
              {activeTab === "staff" && <StaffView token={token} institute={institute} />}
              {activeTab === "attendance" && <AttendanceView token={token} institute={institute} />}
              {activeTab === "cleanliness" && <CleanlinessInspectionView token={token} institute={institute} />}
              {activeTab === "finance" && <FinanceView token={token || ""} institute={institute} />}
              {activeTab === "online-classes" && <OnlineClassesView token={token || ""} institute={institute} />}
              {activeTab === "fees" && <FeesView token={token} institute={institute} />}
              {activeTab === "transport" && <TransportView token={token} institute={institute} defaultTab="tracking" />}
              {activeTab === "drivers" && <TransportView token={token} institute={institute} defaultTab="drivers" />}
              {activeTab === "vehicles" && <TransportView token={token} institute={institute} defaultTab="vehicles" />}
              {activeTab === "notices" && <NoticesView token={token || ""} institute={institute} />}
              {activeTab === "counsellor" && <AdmissionCounsellorView token={token} institute={institute} />}

              {activeTab === "tickets" && <TicketsView token={token} user={user} institute={institute} />}
              {activeTab === "super-tickets" && <SuperAdminView token={token || ""} onSwitchToSchool={handleSwitchToSchoolFromSuperAdmin} activeTab="super-tickets" setActiveTab={handleTabChange} onNavigateToSchoolAdmin={() => navigateTo("admin", "dashboard")} />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
