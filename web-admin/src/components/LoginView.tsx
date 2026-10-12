import React, { useState, useEffect } from "react";
import { School, ShieldCheck, Lock, Mail, AlertTriangle, Smartphone, ArrowRight } from "lucide-react";

interface Props {
  portal: "admin" | "super-admin";
  onSwitchPortal: (portal: "admin" | "super-admin") => void;
  onLoginSuccess: (token: string, user: any, institute: any) => void;
}

export const LoginView: React.FC<Props> = ({ portal, onSwitchPortal, onLoginSuccess }) => {
  const isSuper = portal === "super-admin";

  const [identifier, setIdentifier] = useState(isSuper ? "superadmin@radhix.com" : "schooladmin@radhix.com");
  const [password, setPassword] = useState(isSuper ? "Admin@123" : "School@123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update fields when portal prop switches
  useEffect(() => {
    if (portal === "super-admin") {
      setIdentifier("superadmin@radhix.com");
      setPassword("Admin@123");
    } else {
      setIdentifier("schooladmin@radhix.com");
      setPassword("School@123");
    }
    setError(null);
  }, [portal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:5000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok || !data.success) {
        setError(data.message || "Invalid authentication credentials");
        return;
      }

      const role = data.user?.role;

      // Strict access validation: Only ADMIN and SUPER ADMIN are permitted in Web Admin
      if (role === "TEACHER" || role === "PARENT" || role === "STUDENT") {
        setError("Access Denied: Teacher, Parent, and Student accounts cannot log in to Web Admin. Please access your account via the Radhix Mobile App.");
        return;
      }

      // If user is attempting to login on /super-admin, enforce SUPER_ADMIN role
      if (isSuper && role !== "SUPER_ADMIN") {
        setError("Access Denied: Super Admin privileges required for '/super-admin'. Please switch to the School Admin Portal at '/admin'.");
        return;
      }

      localStorage.setItem("ia_token", data.token);
      onLoginSuccess(data.token, data.user, data.institute);
    } catch {
      setError("Cannot connect to server. Please ensure backend API is running on port 5000.");
      setLoading(false);
    }
  };

  const setDemoAccount = (id: string, pass: string) => {
    setIdentifier(id);
    setPassword(pass);
    setError(null);
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: isSuper
        ? "linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #312E81 100%)"
        : "linear-gradient(135deg, #F8FAFC 0%, #EEF2FF 50%, #E2E8F0 100%)",
      padding: "24px",
      transition: "background 0.3s ease"
    }}>
      <div style={{
        background: "#FFFFFF",
        borderRadius: "24px",
        padding: "36px",
        width: "100%",
        maxWidth: "490px",
        boxShadow: isSuper
          ? "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(99, 102, 241, 0.2)"
          : "0 20px 40px -15px rgba(15, 23, 42, 0.1), 0 0 0 1px #E2E8F0",
        border: "1px solid #E2E8F0"
      }}>
        {/* Path Selector Tabs: School Admin vs Super Admin */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          background: "#F1F5F9",
          padding: "4px",
          borderRadius: "14px",
          marginBottom: "28px"
        }}>
          <button
            type="button"
            onClick={() => onSwitchPortal("admin")}
            style={{
              padding: "10px 14px",
              borderRadius: "10px",
              border: "none",
              background: !isSuper ? "#FFFFFF" : "transparent",
              color: !isSuper ? "#474A74" : "#64748B",
              fontWeight: 800,
              fontSize: "12px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              boxShadow: !isSuper ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
              transition: "all 0.2s"
            }}
          >
            <School size={16} />
            <span>School Admin (/admin)</span>
          </button>

          <button
            type="button"
            onClick={() => onSwitchPortal("super-admin")}
            style={{
              padding: "10px 14px",
              borderRadius: "10px",
              border: "none",
              background: isSuper ? "#1E1B4B" : "transparent",
              color: isSuper ? "#FFFFFF" : "#64748B",
              fontWeight: 800,
              fontSize: "12px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              boxShadow: isSuper ? "0 2px 8px rgba(30,27,75,0.25)" : "none",
              transition: "all 0.2s"
            }}
          >
            <ShieldCheck size={16} />
            <span>Super Admin (/super-admin)</span>
          </button>
        </div>

        {/* Brand Header */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{
            width: "58px",
            height: "58px",
            borderRadius: "18px",
            background: isSuper
              ? "linear-gradient(135deg, #1E1B4B 0%, #4338CA 100%)"
              : "linear-gradient(135deg, #474A74 0%, #312E81 100%)",
            color: "#fff",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: isSuper
              ? "0 10px 20px -5px rgba(67, 56, 202, 0.5)"
              : "0 10px 20px -5px rgba(71, 74, 116, 0.4)",
            marginBottom: "12px"
          }}>
            {isSuper ? <ShieldCheck size={30} /> : <School size={30} />}
          </div>

          <div style={{
            display: "inline-block",
            fontSize: "11px",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            padding: "3px 10px",
            borderRadius: "20px",
            background: isSuper ? "#EDE9FE" : "#E2E8F0",
            color: isSuper ? "#6D28D9" : "#334155",
            marginBottom: "8px"
          }}>
            {isSuper ? "👑 SUPER ADMIN SAAS HUB" : "🏫 SCHOOL ADMIN & PRINCIPAL"}
          </div>

          <h1 style={{ fontSize: "22px", fontWeight: 900, color: "#0F172A", margin: "0 0 6px 0" }}>
            {isSuper ? "Radhix Multi-Vendor SaaS" : "Delhi Public Academy"}
          </h1>
          <p style={{ fontSize: "13px", color: "#64748B", margin: 0 }}>
            {isSuper
              ? "Platform Owner Level • Multi-Tenant Central Management"
              : "School Management System • Principal & Administrative Portal"}
          </p>
        </div>

        {error && (
          <div style={{
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            color: "#B91C1C",
            padding: "12px 14px",
            borderRadius: "12px",
            fontSize: "13px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
            lineHeight: "1.4"
          }}>
            <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: "2px" }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>
              {isSuper ? "Super Admin Email" : "Admin Username / Email"}
            </label>
            <div style={{ position: "relative" }}>
              <Mail size={16} color="#94A3B8" style={{ position: "absolute", left: "12px", top: "14px" }} />
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                placeholder={isSuper ? "superadmin@radhix.com" : "schooladmin@radhix.com"}
                style={{
                  width: "100%",
                  padding: "12px 12px 12px 38px",
                  borderRadius: "12px",
                  border: "1px solid #CBD5E1",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box"
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <Lock size={16} color="#94A3B8" style={{ position: "absolute", left: "12px", top: "14px" }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: "12px 12px 12px 38px",
                  borderRadius: "12px",
                  border: "1px solid #CBD5E1",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box"
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              background: isSuper ? "linear-gradient(135deg, #1E1B4B 0%, #4338CA 100%)" : "#474A74",
              color: "#FFFFFF",
              border: "none",
              padding: "14px",
              borderRadius: "12px",
              fontWeight: 800,
              fontSize: "15px",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: isSuper
                ? "0 6px 16px -2px rgba(67, 56, 202, 0.4)"
                : "0 6px 16px -2px rgba(71, 74, 116, 0.35)",
              marginTop: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px"
            }}
          >
            <span>{loading ? "Authenticating..." : (isSuper ? "Login to Super Admin Console" : "Login to School Admin Portal")}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* 1-Tap Demo Credentials strictly for this portal */}
        <div style={{ marginTop: "24px", borderTop: "1px solid #E2E8F0", paddingTop: "18px" }}>
          <div style={{ fontSize: "11px", fontWeight: 800, color: "#64748B", textTransform: "uppercase", marginBottom: "10px", textAlign: "center" }}>
            Quick 1-Tap Demo Login ({isSuper ? "Super Admin" : "School Admin"}):
          </div>

          {isSuper ? (
            <button
              type="button"
              onClick={() => setDemoAccount("superadmin@radhix.com", "Admin@123")}
              style={{
                width: "100%",
                background: identifier === "superadmin@radhix.com" ? "#EEF2FF" : "#F8FAFC",
                border: `1px solid ${identifier === "superadmin@radhix.com" ? "#6366F1" : "#E2E8F0"}`,
                padding: "10px 14px",
                borderRadius: "12px",
                fontSize: "13px",
                fontWeight: 700,
                color: "#1E1B4B",
                cursor: "pointer",
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <span>👑 <strong>Super Admin</strong> (superadmin@radhix.com)</span>
              <span style={{ fontSize: "11px", color: "#6366F1", fontWeight: 800 }}>Fill & Ready</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setDemoAccount("schooladmin@radhix.com", "School@123")}
              style={{
                width: "100%",
                background: identifier === "schooladmin@radhix.com" ? "#EEF2FF" : "#F8FAFC",
                border: `1px solid ${identifier === "schooladmin@radhix.com" ? "#474A74" : "#E2E8F0"}`,
                padding: "10px 14px",
                borderRadius: "12px",
                fontSize: "13px",
                fontWeight: 700,
                color: "#1E293B",
                cursor: "pointer",
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <span>🏫 <strong>Principal / Admin</strong> (schooladmin@radhix.com)</span>
              <span style={{ fontSize: "11px", color: "#474A74", fontWeight: 800 }}>Fill & Ready</span>
            </button>
          )}

          {/* Explicit Note that Mobile App is for Teachers, Parents, Students */}
          <div style={{
            marginTop: "16px",
            background: "#F8FAFC",
            border: "1px solid #E2E8F0",
            borderRadius: "12px",
            padding: "10px 12px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "12px",
            color: "#64748B"
          }}>
            <Smartphone size={20} color="#64748B" style={{ flexShrink: 0 }} />
            <span>
              <strong>Mobile App Exclusive:</strong> Teachers, Parents, and Students access their accounts via the Radhix Mobile App.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
