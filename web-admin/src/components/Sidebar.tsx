import React from "react";
import {
  LayoutDashboard,
  School,
  GraduationCap,
  Users,
  CalendarCheck,
  CreditCard,
  Bell,
  LogOut,
  BookOpen,
  Award,
  Bus,
  ShieldCheck,
  LifeBuoy
} from "lucide-react";

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  institute: any;
  user: any;
  onLogout: () => void;
  isSuperAdmin?: boolean;
  currentPath?: string;
  onSwitchPortal?: (target: "admin" | "super-admin") => void;
}

export const Sidebar: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  institute,
  user,
  onLogout,
  isSuperAdmin,
  currentPath,
  onSwitchPortal,
}) => {
  const schoolNavItems = [
    { id: "dashboard", label: "Dashboard Overview", icon: LayoutDashboard },
    { id: "academics", label: "Classes & Sections", icon: School },
    { id: "homework", label: "Homework Diary", icon: BookOpen },
    { id: "exams", label: "Exams & Marksheets", icon: Award },
    { id: "admissions", label: "Student Registry", icon: GraduationCap },
    { id: "staff", label: "Teachers & Staff", icon: Users },
    { id: "attendance", label: "Daily Attendance Hub", icon: CalendarCheck },
    { id: "fees", label: "Fee Management (Razorpay)", icon: CreditCard },
    { id: "transport", label: "Bus & Transport Tracking", icon: Bus },
    { id: "notices", label: "Notices & Circulars", icon: Bell },
    { id: "tickets", label: "Helpdesk & Tickets", icon: LifeBuoy },
  ];

  const superAdminNavItems = [
    { id: "super-dashboard", label: "Platform Overview", icon: LayoutDashboard },
    { id: "schools-mgmt", label: "All Schools Directory", icon: School },
    { id: "saas-plans", label: "Subscription Plans", icon: CreditCard },
    { id: "super-tickets", label: "Escalated School Tickets", icon: LifeBuoy },
  ];

  const items = isSuperAdmin ? superAdminNavItems : schoolNavItems;

  return (
    <aside style={{
      width: "280px",
      minWidth: "280px",
      background: "#FFFFFF",
      borderRight: "1px solid #E2E8F0",
      color: "#0F172A",
      padding: "24px 16px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      position: "sticky",
      top: 0,
      height: "100vh",
      boxShadow: "4px 0 20px -5px rgba(15, 23, 42, 0.03)"
    }}>
      <div>
        {/* School / Platform Header Card */}
        <div style={{
          padding: "16px",
          background: isSuperAdmin ? "#F5F3FF" : "#F8FAFC",
          border: `1px solid ${isSuperAdmin ? "#DDD6FE" : "#E2E8F0"}`,
          borderRadius: "16px",
          marginBottom: "20px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
            <div style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              background: isSuperAdmin
                ? "linear-gradient(135deg, #1E1B4B 0%, #4338CA 100%)"
                : "linear-gradient(135deg, #474A74 0%, #312E81 100%)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "900",
              boxShadow: "0 6px 16px -2px rgba(71, 74, 116, 0.3)"
            }}>
              {isSuperAdmin ? <ShieldCheck size={22} /> : <School size={22} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                title={isSuperAdmin ? "Radhix SaaS Platform" : (institute?.name || "Delhi Public Academy")}
                style={{
                  fontWeight: "800",
                  fontSize: "14px",
                  color: "#0F172A",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}
              >
                {isSuperAdmin ? "Radhix School ERP SaaS" : (institute?.name || "Delhi Public Academy")}
              </div>
              <div style={{ fontSize: "11px", color: "#64748B", marginTop: "2px" }}>
                <span>{isSuperAdmin ? "Platform Owner Console" : `Code: ${institute?.code || "DPA101"}`}</span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 10px",
              borderRadius: "20px",
              fontSize: "11px",
              fontWeight: "800",
              background: isSuperAdmin ? "#DDD6FE" : "#EDE9FE",
              color: isSuperAdmin ? "#4338CA" : "#6D28D9",
            }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10B981" }} />
              <span>{isSuperAdmin ? "SUPER ADMIN" : "SCHOOL ERP"}</span>
            </div>

            <span style={{ fontSize: "11px", color: "#64748B", fontWeight: "600" }}>2026-27</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          {items.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "11px 14px",
                  borderRadius: "12px",
                  background: active ? "#474A74" : "transparent",
                  color: active ? "#FFFFFF" : "#64748B",
                  fontWeight: active ? "700" : "600",
                  fontSize: "13px",
                  textAlign: "left",
                  border: "none",
                  cursor: "pointer",
                  boxShadow: active ? "0 4px 12px rgba(71, 74, 116, 0.25)" : "none",
                  transition: "all 0.2s ease"
                }}
              >
                <Icon size={17} color={active ? "#FFFFFF" : "#64748B"} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Path Indicator and Portal Switcher for Super Admin */}
      <div style={{ marginTop: "auto", marginBottom: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "6px 12px",
          background: isSuperAdmin ? "#F5F3FF" : "#F8FAFC",
          borderRadius: "8px",
          border: `1px solid ${isSuperAdmin ? "#DDD6FE" : "#E2E8F0"}`,
          fontSize: "11px",
          fontWeight: 700,
          color: isSuperAdmin ? "#6D28D9" : "#475569"
        }}>
          <span>Active Route:</span>
          <code style={{ fontFamily: "monospace", fontWeight: 800 }}>{isSuperAdmin ? "/super-admin" : "/admin"}</code>
        </div>

        {user?.role === "SUPER_ADMIN" && onSwitchPortal && (
          <button
            onClick={() => onSwitchPortal(isSuperAdmin ? "admin" : "super-admin")}
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              border: `1px solid ${isSuperAdmin ? "#CBD5E1" : "#DDD6FE"}`,
              background: isSuperAdmin ? "#F8FAFC" : "#EDE9FE",
              color: isSuperAdmin ? "#334155" : "#6D28D9",
              fontSize: "11px",
              fontWeight: 800,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px"
            }}
          >
            {isSuperAdmin ? "🏫 Switch to School Admin (/admin)" : "👑 Switch to Super Admin (/super-admin)"}
          </button>
        )}
      </div>

      {/* User Profile & Logout */}
      <div style={{
        background: "#F8FAFC",
        border: "1px solid #E2E8F0",
        borderRadius: "14px",
        padding: "12px 14px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: "#474A74",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "800",
            fontSize: "12px"
          }}>
            {isSuperAdmin ? "SA" : "PR"}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: "13px",
              fontWeight: "700",
              color: "#0F172A",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}>
              {user?.username || user?.email || "Admin User"}
            </div>
            <div style={{ fontSize: "11px", color: "#64748B" }}>
              {isSuperAdmin ? "Platform Owner" : "School Principal"}
            </div>
          </div>
          <button
            onClick={onLogout}
            title="Log Out"
            style={{
              background: "#FEE2E2",
              color: "#DC2626",
              padding: "8px",
              borderRadius: "8px",
              border: "1px solid #FECACA",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer"
            }}
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
};
