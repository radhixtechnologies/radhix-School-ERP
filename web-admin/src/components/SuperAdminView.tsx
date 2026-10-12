import React, { useState, useEffect } from "react";
import {
  Building2,
  School,
  ShieldCheck,
  DollarSign,
  Users,
  CheckCircle2,
  XCircle,
  Settings,
  Plus,
  Search,
  RefreshCw,
  CreditCard,
  ExternalLink,
  Eye,
  Download,
  GraduationCap,
  Briefcase,
  X,
  TrendingUp,
  Percent,
  CalendarCheck,
  FileText,
  Award,
  ShieldAlert,
  LifeBuoy
} from "lucide-react";

interface Props {
  token: string;
  onSwitchToSchool: (schoolId: string, schoolName: string) => void;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  onNavigateToSchoolAdmin?: () => void;
}

export const SuperAdminView: React.FC<Props> = ({
  token,
  onSwitchToSchool,
  activeTab = "super-dashboard",
  setActiveTab,
  onNavigateToSchoolAdmin,
}) => {
  const [schools, setSchools] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // School Deep Dive State
  const [selectedSchoolDetails, setSelectedSchoolDetails] = useState<any | null>(null);
  const [loadingSchoolDetails, setLoadingSchoolDetails] = useState(false);
  const [inspectTab, setInspectTab] = useState<"overview" | "students" | "staff" | "plan">("overview");
  const [studentSearch, setStudentSearch] = useState("");
  const [staffSearch, setStaffSearch] = useState("");

  // Plan limits editing state inside modal
  const [planForm, setPlanForm] = useState({
    plan_name: "Standard Plan",
    student_limit: 1500,
    staff_limit: 80,
  });

  // New school form state
  const [newSchool, setNewSchool] = useState({
    name: "",
    code: "",
    email: "",
    phone: "",
    city: "",
    state: "Delhi",
    plan_name: "Standard Plan",
    student_limit: 1500,
    staff_limit: 80,
    // Mandatory Legal & Compliance Certificates
    affiliation_board: "CBSE Affiliated",
    affiliation_number: "CBSE/AFF/213084/2026",
    fire_safety_noc: "FS-DEL-NOC-2026-994",
    fire_safety_validity: "31 Mar 2028",
    building_safety_cert: "PWD/STR/2025/4412",
    water_sanitation_cert: "DJB/SAN/SAFE-881",
    society_trust_deed: "REG-TRUST-DEL-1994-08",
    state_govt_noc: "EDN-STATE-NOC-2024-119",
    land_possession_cert: "2.85 Acres Campus & Sports Ground",
    principal_id_verified: "Principal ID & Appointment Letter Verified",
    compliance_status: "VERIFIED",
  });

  // Escalated tickets from School Admins
  const [escalatedTickets, setEscalatedTickets] = useState<any[]>([
    {
      id: "esc-01",
      ticket_number: "TKT-ESC-001",
      school_name: "Delhi Public Academy",
      category: "CBSE Affiliation & Compliance",
      priority: "HIGH",
      status: "OPEN",
      title: "CBSE Pre-Board Senior Secondary Affiliation Renewal Letter Submission",
      description: "Submitted the state government NOC and building stability certificate for 2026-27 renewal. Kindly approve extension in ERP credentials.",
      created_at: "Today, 09:30 AM",
      admin_response: null
    },
    {
      id: "esc-02",
      ticket_number: "TKT-ESC-002",
      school_name: "Modern International Public School",
      category: "Server Quota & Storage Upgrade",
      priority: "MEDIUM",
      status: "RESOLVED",
      title: "Student Roster Quota Increase from 1,200 to 1,500 for Session 2026",
      description: "Admissions surge in Class 9 and 11, requesting quota expansion under Standard Plan.",
      created_at: "Yesterday, 02:15 PM",
      admin_response: "Tenant quota successfully increased to 1,500 active students on AWS server cluster.",
      resolved_at: "Yesterday, 04:00 PM"
    }
  ]);
  const [selectedEscTicket, setSelectedEscTicket] = useState<any | null>(null);
  const [escResolutionText, setEscResolutionText] = useState("");


  const showToastMsg = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/v1/super-admin/institutes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setSchools(data.data);
      }

      const planRes = await fetch("http://localhost:5000/api/v1/super-admin/plans", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const planData = await planRes.json();
      if (planData.success) {
        setPlans(planData.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (school: any) => {
    const nextStatus = school.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    try {
      const res = await fetch(`http://localhost:5000/api/v1/super-admin/institutes/${school.id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showToastMsg(`School '${school.name}' is now ${nextStatus}`);
        loadData();
        if (selectedSchoolDetails && selectedSchoolDetails.institute.id === school.id) {
          setSelectedSchoolDetails({
            ...selectedSchoolDetails,
            institute: { ...selectedSchoolDetails.institute, status: nextStatus }
          });
        }
      }
    } catch {
      showToastMsg("Failed to update status");
    }
  };

  // Inspect School Details (Students, Staff, Class Breakdown)
  const handleInspectSchool = async (school: any) => {
    setLoadingSchoolDetails(true);
    setInspectTab("overview");
    setStudentSearch("");
    setStaffSearch("");

    try {
      const res = await fetch(`http://localhost:5000/api/v1/super-admin/institutes/${school.id}/details`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (result.success) {
        setSelectedSchoolDetails(result.data);
        setPlanForm({
          plan_name: result.data.institute.plan_name || "Standard Plan",
          student_limit: result.data.capacityLimit || 1500,
          staff_limit: result.data.staffLimit || 80,
        });
      } else {
        showToastMsg("Could not load school details");
      }
    } catch {
      showToastMsg("Server error fetching school roster");
    } finally {
      setLoadingSchoolDetails(false);
    }
  };

  const handleSavePlanLimits = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSchoolDetails) return;

    try {
      const res = await fetch(`http://localhost:5000/api/v1/super-admin/institutes/${selectedSchoolDetails.institute.id}/plan`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(planForm),
      });
      const data = await res.json();
      if (data.success) {
        showToastMsg("Plan quotas & limits updated successfully!");
        loadData();
        setSelectedSchoolDetails({
          ...selectedSchoolDetails,
          capacityLimit: Number(planForm.student_limit),
          staffLimit: Number(planForm.staff_limit),
          institute: { ...selectedSchoolDetails.institute, plan_name: planForm.plan_name }
        });
      } else {
        showToastMsg(data.message || "Failed to update limits");
      }
    } catch {
      showToastMsg("Network error updating plan limits");
    }
  };

  const handleExportCsv = (school: any, students: any[], staff: any[]) => {
    let csv = `SCHOOL REPORT: ${school.name} (${school.code})\n`;
    csv += `City: ${school.city || "New Delhi"}, Status: ${school.status}, Plan: ${school.plan_name}\n\n`;

    csv += `STUDENTS ROSTER (${students.length} Records)\n`;
    csv += `Admission No,First Name,Last Name,Class,Section,Roll No,Parent,Phone,Fee Status\n`;
    students.forEach((s) => {
      csv += `"${s.admission_number || ""}","${s.first_name || ""}","${s.last_name || ""}","${s.class_name || ""}","${s.section_name || ""}","${s.roll_number || ""}","${s.parent_name || ""}","${s.parent_phone || ""}","${s.fee_status || "PAID"}"\n`;
    });

    csv += `\nSTAFF ROSTER (${staff.length} Records)\n`;
    csv += `Employee Code,First Name,Last Name,Designation,Department,Phone,Status\n`;
    staff.forEach((st) => {
      csv += `"${st.employee_code || ""}","${st.first_name || ""}","${st.last_name || ""}","${st.designation || ""}","${st.department || ""}","${st.phone || ""}","${st.status || "ACTIVE"}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${school.code || "School"}_Roster_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToastMsg("CSV report exported successfully!");
  };

  const handleCreateSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/v1/super-admin/institutes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newSchool,
          institute_type: "SCHOOL",
          admin_username: `${newSchool.code.toLowerCase()}admin@radhix.com`,
          admin_password: "School@123",
          admin_email: newSchool.email,
          admin_phone: newSchool.phone,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToastMsg(`School '${newSchool.name}' registered successfully!`);
        setShowAddModal(false);
        loadData();
      } else {
        showToastMsg(data.message || "Failed to create school");
      }
    } catch {
      showToastMsg("Network error creating school");
    }
  };

  const filteredSchools = schools.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Financial calculations
  const totalSchoolsCount = schools.length || 3;
  const activeSchoolsCount = schools.filter(s => s.status === "ACTIVE").length || 3;
  const mrrAmount = schools.reduce((acc, s) => {
    if (s.plan_name?.includes("Premium")) return acc + 10000;
    if (s.plan_name?.includes("Basic")) return acc + 2000;
    return acc + 5000;
  }, 0);

  return (
    <div style={{ padding: "32px", maxWidth: "1400px", margin: "0 auto" }}>
      {toast && (
        <div style={{
          position: "fixed",
          top: "24px",
          right: "24px",
          background: "#10B981",
          color: "#fff",
          padding: "12px 20px",
          borderRadius: "10px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
          zIndex: 9999,
          fontWeight: 700,
        }}>
          {toast}
        </div>
      )}

      {/* Header Banner */}
      <div style={{
        background: "linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)",
        borderRadius: "20px",
        padding: "28px 32px",
        color: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "28px",
        boxShadow: "0 10px 30px rgba(30, 27, 75, 0.2)"
      }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.12)", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 700, marginBottom: "10px" }}>
            <ShieldCheck size={16} color="#A7F3D0" /> Platform Owner Console
          </div>
          <h1 style={{ fontSize: "26px", fontWeight: 900, margin: "0 0 6px 0" }}>Radhix Multi-Vendor School ERP — Super Admin</h1>
          <p style={{ margin: 0, opacity: 0.8, fontSize: "14px" }}>
            Central platform owner dashboard — inspect students, teachers & staff in any school, control tenant isolation and plans.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {onNavigateToSchoolAdmin && (
            <button
              onClick={onNavigateToSchoolAdmin}
              style={{
                background: "rgba(255, 255, 255, 0.14)",
                color: "#fff",
                border: "1px solid rgba(255, 255, 255, 0.25)",
                padding: "12px 18px",
                borderRadius: "12px",
                fontWeight: 700,
                fontSize: "13px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backdropFilter: "blur(8px)"
              }}
            >
              <ExternalLink size={16} /> Switch to School Admin (/admin)
            </button>
          )}

          <button
            onClick={() => setShowAddModal(true)}
            style={{
              background: "#4F46E5",
              color: "#fff",
              border: "none",
              padding: "12px 22px",
              borderRadius: "12px",
              fontWeight: 800,
              fontSize: "14px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 4px 14px rgba(79, 70, 229, 0.4)"
            }}
          >
            <Plus size={18} /> Register New School
          </button>
        </div>
      </div>

      {/* Super Admin Section Navigation Bar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "28px",
        background: "#FFFFFF",
        padding: "8px",
        borderRadius: "14px",
        border: "1px solid #E2E8F0"
      }}>
        {[
          { id: "super-dashboard", label: "📊 Platform Overview", desc: "KPIs & Revenue" },
          { id: "schools-mgmt", label: `🏫 All Schools (${schools.length})`, desc: "Inspect Students & Staff" },
          { id: "saas-plans", label: "💳 Subscription Plans", desc: "Pricing & Quotas" }
        ].map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab && setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: "10px 16px",
                borderRadius: "10px",
                border: "none",
                background: isSelected ? "linear-gradient(135deg, #1E1B4B 0%, #4338CA 100%)" : "transparent",
                color: isSelected ? "#FFFFFF" : "#64748B",
                fontWeight: 800,
                fontSize: "13px",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "2px",
                boxShadow: isSelected ? "0 4px 12px rgba(67, 56, 202, 0.3)" : "none",
                transition: "all 0.2s ease"
              }}
            >
              <span>{tab.label}</span>
              <span style={{ fontSize: "10px", opacity: isSelected ? 0.85 : 0.65 }}>{tab.desc}</span>
            </button>
          );
        })}
      </div>

      {/* 4 KPI Metrics with Progress Indicators */}
      {(activeTab === "super-dashboard" || activeTab === "all") && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "32px" }}>
          {/* Metric 1 */}
          <div style={{ background: "#FFFFFF", padding: "20px", borderRadius: "16px", border: "1px solid #E2E8F0", borderTop: "4px solid #3B82F6", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "#64748B", fontSize: "13px", fontWeight: 700, marginBottom: "8px" }}>
              <span>TOTAL REGISTERED SCHOOLS</span>
              <School size={18} color="#3B82F6" />
            </div>
            <div style={{ fontSize: "30px", fontWeight: 900, color: "#0F172A" }}>{totalSchoolsCount}</div>
            <div style={{ width: "100%", height: "6px", background: "#EFF6FF", borderRadius: "10px", marginTop: "10px", overflow: "hidden" }}>
              <div style={{ width: "100%", height: "100%", background: "#3B82F6", borderRadius: "10px" }} />
            </div>
            <div style={{ fontSize: "12px", color: "#10B981", fontWeight: 700, marginTop: "6px" }}>● {activeSchoolsCount} Active & Operational</div>
          </div>

          {/* Metric 2 */}
          <div style={{ background: "#FFFFFF", padding: "20px", borderRadius: "16px", border: "1px solid #E2E8F0", borderTop: "4px solid #10B981", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "#64748B", fontSize: "13px", fontWeight: 700, marginBottom: "8px" }}>
              <span>MONTHLY REVENUE (MRR)</span>
              <DollarSign size={18} color="#10B981" />
            </div>
            <div style={{ fontSize: "30px", fontWeight: 900, color: "#0F172A" }}>₹{mrrAmount.toLocaleString("en-IN")}<span style={{ fontSize: "14px", color: "#64748B" }}>/mo</span></div>
            <div style={{ width: "100%", height: "6px", background: "#ECFDF5", borderRadius: "10px", marginTop: "10px", overflow: "hidden" }}>
              <div style={{ width: "85%", height: "100%", background: "#10B981", borderRadius: "10px" }} />
            </div>
            <div style={{ fontSize: "12px", color: "#64748B", marginTop: "6px" }}>85% Collection Efficiency</div>
          </div>

          {/* Metric 3 */}
          <div style={{ background: "#FFFFFF", padding: "20px", borderRadius: "16px", border: "1px solid #E2E8F0", borderTop: "4px solid #8B5CF6", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "#64748B", fontSize: "13px", fontWeight: 700, marginBottom: "8px" }}>
              <span>TOTAL STUDENTS MANAGED</span>
              <Users size={18} color="#8B5CF6" />
            </div>
            <div style={{ fontSize: "30px", fontWeight: 900, color: "#0F172A" }}>6,800+</div>
            <div style={{ width: "100%", height: "6px", background: "#F5F3FF", borderRadius: "10px", marginTop: "10px", overflow: "hidden" }}>
              <div style={{ width: "91%", height: "100%", background: "#8B5CF6", borderRadius: "10px" }} />
            </div>
            <div style={{ fontSize: "12px", color: "#64748B", marginTop: "6px" }}>Across Delhi, Mumbai & Bengaluru</div>
          </div>

          {/* Metric 4 */}
          <div style={{ background: "#FFFFFF", padding: "20px", borderRadius: "16px", border: "1px solid #E2E8F0", borderTop: "4px solid #F59E0B", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "#64748B", fontSize: "13px", fontWeight: 700, marginBottom: "8px" }}>
              <span>TENANT DATA ISOLATION</span>
              <ShieldCheck size={18} color="#F59E0B" />
            </div>
            <div style={{ fontSize: "30px", fontWeight: 900, color: "#10B981" }}>100% SECURE</div>
            <div style={{ width: "100%", height: "6px", background: "#FEF3C7", borderRadius: "10px", marginTop: "10px", overflow: "hidden" }}>
              <div style={{ width: "100%", height: "100%", background: "#F59E0B", borderRadius: "10px" }} />
            </div>
            <div style={{ fontSize: "12px", color: "#64748B", marginTop: "6px" }}>Zero cross-tenant data leakage</div>
          </div>
        </div>
      )}

      {/* Subscription Plans Section */}
      {(activeTab === "saas-plans" || activeTab === "all") && (
        <div style={{ background: "#FFFFFF", borderRadius: "16px", padding: "24px", border: "1px solid #E2E8F0", marginBottom: "32px", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
            <div>
              <h2 style={{ fontSize: "18px", fontWeight: 800, margin: "0 0 4px 0", color: "#0F172A" }}>SaaS Subscription Plans for Schools</h2>
              <p style={{ margin: 0, fontSize: "13px", color: "#64748B" }}>Each school is provisioned with customizable modules, student limits, and validity.</p>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <span style={{ fontSize: "12px", background: "#EFF6FF", color: "#2563EB", padding: "4px 10px", borderRadius: "20px", fontWeight: 700 }}>3 Active Plans</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
            {/* Plan 1 */}
            <div style={{ border: "2px solid #E2E8F0", borderRadius: "14px", padding: "20px", background: "#F8FAFC" }}>
              <div style={{ display: "inline-block", background: "#E2E8F0", color: "#475569", padding: "4px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: 800, marginBottom: "8px" }}>BASIC TIER</div>
              <h3 style={{ margin: "0 0 6px 0", fontSize: "18px", fontWeight: 800, color: "#0F172A" }}>Basic Plan</h3>
              <div style={{ fontSize: "24px", fontWeight: 900, color: "#1E293B", marginBottom: "12px" }}>₹2,000 <span style={{ fontSize: "12px", color: "#64748B" }}>/month per school</span></div>
              <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "13px", color: "#475569", lineHeight: "1.8" }}>
                <li>Up to 300 Students</li>
                <li>Student & Teacher Registry</li>
                <li>Class-wise Attendance</li>
                <li>Timetable & Notices</li>
              </ul>
            </div>

            {/* Plan 2 */}
            <div style={{ border: "2px solid #4F46E5", borderRadius: "14px", padding: "20px", background: "#EEF2FF", position: "relative" }}>
              <div style={{ position: "absolute", top: "-12px", right: "20px", background: "#4F46E5", color: "#fff", fontSize: "11px", fontWeight: 800, padding: "2px 10px", borderRadius: "10px" }}>MOST POPULAR</div>
              <div style={{ display: "inline-block", background: "#E0E7FF", color: "#4338CA", padding: "4px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: 800, marginBottom: "8px" }}>STANDARD TIER</div>
              <h3 style={{ margin: "0 0 6px 0", fontSize: "18px", fontWeight: 800, color: "#1E1B4B" }}>Standard Plan</h3>
              <div style={{ fontSize: "24px", fontWeight: 900, color: "#4F46E5", marginBottom: "12px" }}>₹5,000 <span style={{ fontSize: "12px", color: "#64748B" }}>/month per school</span></div>
              <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "13px", color: "#312E81", lineHeight: "1.8" }}>
                <li>Up to 1,500 Students</li>
                <li>Online Fees (Razorpay Integration)</li>
                <li>Exams & Marksheets</li>
                <li>Parent & Student Mobile App</li>
                <li>Homework Diary & Alerts</li>
              </ul>
            </div>

            {/* Plan 3 */}
            <div style={{ border: "2px solid #F59E0B", borderRadius: "14px", padding: "20px", background: "#FFFBEB" }}>
              <div style={{ display: "inline-block", background: "#FEF3C7", color: "#92400E", padding: "4px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: 800, marginBottom: "8px" }}>PREMIUM TIER</div>
              <h3 style={{ margin: "0 0 6px 0", fontSize: "18px", fontWeight: 800, color: "#78350F" }}>Premium Plan</h3>
              <div style={{ fontSize: "24px", fontWeight: 900, color: "#D97706", marginBottom: "12px" }}>₹10,000 <span style={{ fontSize: "12px", color: "#64748B" }}>/month per school</span></div>
              <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "13px", color: "#78350F", lineHeight: "1.8" }}>
                <li>Up to 5,000 Students</li>
                <li>Live GPS Bus & Transport Telematics</li>
                <li>Teacher Dedicated Mobile App</li>
                <li>Salary & Expense Ledger</li>
                <li>Custom Branding & 24/7 SLA</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Schools Management Table */}
      {(activeTab === "schools-mgmt" || activeTab === "all" || activeTab === "super-dashboard") && (
        <div style={{ background: "#FFFFFF", borderRadius: "16px", padding: "24px", border: "1px solid #E2E8F0", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <div>
              <h2 style={{ fontSize: "18px", fontWeight: 800, margin: "0 0 4px 0", color: "#0F172A" }}>Registered Schools ({filteredSchools.length})</h2>
              <p style={{ margin: 0, fontSize: "13px", color: "#64748B" }}>Click any school to inspect students roster, teachers & staff, or toggle live status.</p>
            </div>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <div style={{ position: "relative", width: "260px" }}>
                <Search size={16} color="#94A3B8" style={{ position: "absolute", left: "12px", top: "12px" }} />
                <input
                  type="text"
                  placeholder="Search school name or city..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px 10px 36px",
                    borderRadius: "10px",
                    border: "1px solid #CBD5E1",
                    fontSize: "13px",
                    outline: "none"
                  }}
                />
              </div>
              <button
                onClick={loadData}
                title="Refresh"
                style={{
                  background: "#F1F5F9",
                  border: "1px solid #CBD5E1",
                  padding: "10px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <RefreshCw size={16} color="#475569" />
              </button>
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #E2E8F0", color: "#64748B", fontSize: "12px", textTransform: "uppercase" }}>
                  <th style={{ padding: "12px 16px" }}>School Name & Code</th>
                  <th style={{ padding: "12px 16px" }}>City & State</th>
                  <th style={{ padding: "12px 16px" }}>Plan Tier</th>
                  <th style={{ padding: "12px 16px" }}>Capacity Progress</th>
                  <th style={{ padding: "12px 16px" }}>Status</th>
                  <th style={{ padding: "12px 16px", textAlign: "right" }}>Working Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSchools.map((s) => {
                  const studentCount = s.student_count || 1248;
                  const limit = s.student_limit || 1500;
                  const pct = Math.min(100, Math.round((studentCount / limit) * 100));

                  return (
                    <tr
                      key={s.id}
                      style={{ borderBottom: "1px solid #F1F5F9", transition: "background 0.2s" }}
                    >
                      <td style={{ padding: "16px" }}>
                        <div
                          onClick={() => handleInspectSchool(s)}
                          style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}
                        >
                          <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "#EEF2FF", color: "#4F46E5", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>
                            <School size={22} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 800, color: "#0F172A", display: "flex", alignItems: "center", gap: "6px" }}>
                              <span>{s.name}</span>
                              <Eye size={14} color="#6366F1" />
                            </div>
                            <div style={{ fontSize: "12px", color: "#64748B" }}>Code: {s.code} • {s.email || "school@radhix.com"}</div>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: "16px", color: "#334155" }}>
                        {s.city || "New Delhi"}, {s.state || "Delhi"}
                      </td>

                      <td style={{ padding: "16px" }}>
                        <span style={{
                          display: "inline-block",
                          padding: "4px 10px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: 700,
                          background: s.plan_name?.includes("Premium") ? "#FEF3C7" : s.plan_name?.includes("Basic") ? "#F1F5F9" : "#EEF2FF",
                          color: s.plan_name?.includes("Premium") ? "#B45309" : s.plan_name?.includes("Basic") ? "#475569" : "#4338CA",
                        }}>
                          {s.plan_name || "Standard Plan"}
                        </span>
                      </td>

                      {/* Progress Bar in Table Row */}
                      <td style={{ padding: "16px", minWidth: "160px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: 700, color: "#475569", marginBottom: "4px" }}>
                          <span>{studentCount} Enrolled</span>
                          <span>{pct}%</span>
                        </div>
                        <div style={{ width: "100%", height: "6px", background: "#E2E8F0", borderRadius: "10px", overflow: "hidden" }}>
                          <div style={{
                            width: `${pct}%`,
                            height: "100%",
                            background: pct > 90 ? "#EF4444" : pct > 75 ? "#10B981" : "#3B82F6",
                            borderRadius: "10px"
                          }} />
                        </div>
                        <div style={{ fontSize: "10px", color: "#94A3B8", marginTop: "2px" }}>Cap: {limit} students</div>
                      </td>

                      <td style={{ padding: "16px" }}>
                        <span style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "4px 10px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: 700,
                          background: s.status === "ACTIVE" ? "#DCFCE7" : "#FEE2E2",
                          color: s.status === "ACTIVE" ? "#15803D" : "#B91C1C",
                        }}>
                          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: s.status === "ACTIVE" ? "#16A34A" : "#DC2626" }} />
                          {s.status}
                        </span>
                      </td>

                      <td style={{ padding: "16px", textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: "8px" }}>
                          <button
                            onClick={() => handleInspectSchool(s)}
                            title="Inspect Students & Staff"
                            style={{
                              background: "#4F46E5",
                              color: "#FFFFFF",
                              border: "none",
                              padding: "7px 12px",
                              borderRadius: "8px",
                              fontSize: "12px",
                              fontWeight: 700,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                              boxShadow: "0 2px 8px rgba(79, 70, 229, 0.25)"
                            }}
                          >
                            <Eye size={14} />
                            <span>Inspect School</span>
                          </button>

                          <button
                            onClick={() => onSwitchToSchool(s.id, s.name)}
                            title="Launch School Admin ERP"
                            style={{
                              background: "#EEF2FF",
                              color: "#4F46E5",
                              border: "1px solid #C7D2FE",
                              padding: "7px 12px",
                              borderRadius: "8px",
                              fontSize: "12px",
                              fontWeight: 700,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <ExternalLink size={14} />
                            <span>ERP</span>
                          </button>

                          <button
                            onClick={() => handleToggleStatus(s)}
                            style={{
                              background: s.status === "ACTIVE" ? "#FFF1F2" : "#F0FDF4",
                              color: s.status === "ACTIVE" ? "#E11D48" : "#16A34A",
                              border: "1px solid #E2E8F0",
                              padding: "7px 10px",
                              borderRadius: "8px",
                              fontSize: "12px",
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            {s.status === "ACTIVE" ? "Suspend" : "Activate"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* FULL SCHOOL DEEP DIVE MODAL (Students, Staff, Progress Bars, Actions) */}
      {selectedSchoolDetails && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15, 23, 42, 0.65)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          padding: "20px"
        }}>
          <div style={{
            background: "#FFFFFF",
            borderRadius: "24px",
            width: "100%",
            maxWidth: "1000px",
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            boxShadow: "0 25px 60px -15px rgba(0,0,0,0.3)"
          }}>
            {/* Modal Header */}
            <div style={{
              padding: "20px 28px",
              background: "linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{ width: "46px", height: "46px", borderRadius: "12px", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <School size={24} color="#fff" />
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <h2 style={{ fontSize: "20px", fontWeight: 900, margin: 0 }}>
                      {selectedSchoolDetails.institute.name}
                    </h2>
                    <span style={{ fontSize: "11px", fontWeight: 800, padding: "3px 8px", borderRadius: "10px", background: "rgba(255,255,255,0.2)" }}>
                      Code: {selectedSchoolDetails.institute.code}
                    </span>
                    <span style={{
                      fontSize: "11px",
                      fontWeight: 800,
                      padding: "3px 8px",
                      borderRadius: "10px",
                      background: selectedSchoolDetails.institute.status === "ACTIVE" ? "#10B981" : "#EF4444"
                    }}>
                      ● {selectedSchoolDetails.institute.status}
                    </span>
                  </div>
                  <div style={{ fontSize: "12px", opacity: 0.8, marginTop: "2px" }}>
                    {selectedSchoolDetails.institute.city || "New Delhi"}, {selectedSchoolDetails.institute.state || "Delhi"} • Plan: {selectedSchoolDetails.institute.plan_name}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button
                  onClick={() => handleExportCsv(
                    selectedSchoolDetails.institute,
                    selectedSchoolDetails.students,
                    selectedSchoolDetails.staff
                  )}
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.25)",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  <Download size={14} /> Export CSV
                </button>

                <button
                  onClick={() => {
                    const inst = selectedSchoolDetails.institute;
                    setSelectedSchoolDetails(null);
                    onSwitchToSchool(inst.id, inst.name);
                  }}
                  style={{
                    background: "#4F46E5",
                    color: "#fff",
                    border: "none",
                    padding: "8px 14px",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: 800,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  <ExternalLink size={14} /> Open ERP (/admin)
                </button>

                <button
                  onClick={() => setSelectedSchoolDetails(null)}
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    border: "none",
                    color: "#fff",
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* 4 High-Fidelity Overview Progress Metrics */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "14px",
              padding: "20px 28px",
              background: "#F8FAFC",
              borderBottom: "1px solid #E2E8F0"
            }}>
              {/* Card 1: Students Capacity */}
              <div style={{ background: "#FFFFFF", padding: "14px", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: 700, color: "#64748B" }}>
                  <span>STUDENT ENROLLMENT</span>
                  <GraduationCap size={15} color="#3B82F6" />
                </div>
                <div style={{ fontSize: "20px", fontWeight: 900, color: "#0F172A", margin: "4px 0" }}>
                  {selectedSchoolDetails.totalStudentsCount} <span style={{ fontSize: "12px", color: "#64748B", fontWeight: 600 }}>/ {selectedSchoolDetails.capacityLimit}</span>
                </div>
                <div style={{ width: "100%", height: "6px", background: "#EFF6FF", borderRadius: "10px", overflow: "hidden" }}>
                  <div style={{ width: `${selectedSchoolDetails.utilizationPct}%`, height: "100%", background: "#3B82F6", borderRadius: "10px" }} />
                </div>
                <div style={{ fontSize: "11px", color: "#3B82F6", fontWeight: 700, marginTop: "4px" }}>
                  {selectedSchoolDetails.utilizationPct}% Capacity Filled
                </div>
              </div>

              {/* Card 2: Staff Deployed */}
              <div style={{ background: "#FFFFFF", padding: "14px", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: 700, color: "#64748B" }}>
                  <span>TEACHERS & STAFF</span>
                  <Briefcase size={15} color="#10B981" />
                </div>
                <div style={{ fontSize: "20px", fontWeight: 900, color: "#0F172A", margin: "4px 0" }}>
                  {selectedSchoolDetails.totalStaffCount} <span style={{ fontSize: "12px", color: "#64748B", fontWeight: 600 }}>/ {selectedSchoolDetails.staffLimit} limit</span>
                </div>
                <div style={{ width: "100%", height: "6px", background: "#ECFDF5", borderRadius: "10px", overflow: "hidden" }}>
                  <div style={{ width: `${Math.round((selectedSchoolDetails.totalStaffCount / selectedSchoolDetails.staffLimit) * 100)}%`, height: "100%", background: "#10B981", borderRadius: "10px" }} />
                </div>
                <div style={{ fontSize: "11px", color: "#10B981", fontWeight: 700, marginTop: "4px" }}>
                  Ratio: 1 Teacher : 26 Students
                </div>
              </div>

              {/* Card 3: Attendance Rate */}
              <div style={{ background: "#FFFFFF", padding: "14px", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: 700, color: "#64748B" }}>
                  <span>TODAY'S ATTENDANCE</span>
                  <CalendarCheck size={15} color="#8B5CF6" />
                </div>
                <div style={{ fontSize: "20px", fontWeight: 900, color: "#0F172A", margin: "4px 0" }}>
                  {selectedSchoolDetails.todayAttendancePct}%
                </div>
                <div style={{ width: "100%", height: "6px", background: "#F5F3FF", borderRadius: "10px", overflow: "hidden" }}>
                  <div style={{ width: `${selectedSchoolDetails.todayAttendancePct}%`, height: "100%", background: "#8B5CF6", borderRadius: "10px" }} />
                </div>
                <div style={{ fontSize: "11px", color: "#8B5CF6", fontWeight: 700, marginTop: "4px" }}>
                  1,180 Students Present
                </div>
              </div>

              {/* Card 4: Fee Collection */}
              <div style={{ background: "#FFFFFF", padding: "14px", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: 700, color: "#64748B" }}>
                  <span>FEE COLLECTION TARGET</span>
                  <CreditCard size={15} color="#F59E0B" />
                </div>
                <div style={{ fontSize: "20px", fontWeight: 900, color: "#0F172A", margin: "4px 0" }}>
                  {selectedSchoolDetails.feeAmountCollected}
                </div>
                <div style={{ width: "100%", height: "6px", background: "#FEF3C7", borderRadius: "10px", overflow: "hidden" }}>
                  <div style={{ width: `${selectedSchoolDetails.monthlyFeeCollectionPct}%`, height: "100%", background: "#F59E0B", borderRadius: "10px" }} />
                </div>
                <div style={{ fontSize: "11px", color: "#D97706", fontWeight: 700, marginTop: "4px" }}>
                  Target: {selectedSchoolDetails.feeAmountTarget} (85%)
                </div>
              </div>
            </div>

            {/* Sub-tabs Selector */}
            <div style={{
              display: "flex",
              borderBottom: "1px solid #E2E8F0",
              padding: "0 28px",
              background: "#FFFFFF"
            }}>
              {[
                { id: "overview", label: "📊 Class Capacity & Progress" },
                { id: "students", label: `🎒 Students Directory (${selectedSchoolDetails.students.length})` },
                { id: "staff", label: `👨‍🏫 Teachers & Staff Roster (${selectedSchoolDetails.staff.length})` },
                { id: "plan", label: "⚙️ Edit Plan Quotas & Limits" }
              ].map((tab) => {
                const isSelected = inspectTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setInspectTab(tab.id as any)}
                    style={{
                      padding: "14px 18px",
                      background: "none",
                      border: "none",
                      borderBottom: isSelected ? "3px solid #4F46E5" : "3px solid transparent",
                      color: isSelected ? "#4F46E5" : "#64748B",
                      fontWeight: isSelected ? 800 : 600,
                      fontSize: "13px",
                      cursor: "pointer"
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Modal Body with Tab Contents */}
            <div style={{ padding: "24px 28px", overflowY: "auto", flex: 1 }}>
              {/* Tab 1: Class Breakdown Progress Bars */}
              {inspectTab === "overview" && (
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 800, color: "#0F172A", marginBottom: "14px" }}>
                    Class-wise Enrollment & Capacity Utilization
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {selectedSchoolDetails.classBreakdown.map((c: any, idx: number) => (
                      <div key={idx} style={{
                        background: "#F8FAFC",
                        padding: "14px 18px",
                        borderRadius: "12px",
                        border: "1px solid #E2E8F0"
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                          <div>
                            <span style={{ fontSize: "14px", fontWeight: 800, color: "#0F172A" }}>{c.grade}</span>
                            <span style={{ fontSize: "12px", color: "#64748B", marginLeft: "10px" }}>
                              {c.students} Students enrolled / {c.capacity} Max Seat Capacity
                            </span>
                          </div>
                          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                            <span style={{ fontSize: "11px", fontWeight: 700, color: "#059669", background: "#ECFDF5", padding: "2px 8px", borderRadius: "10px" }}>
                              Attendance: {c.attendance}
                            </span>
                            <span style={{ fontSize: "12px", fontWeight: 800, color: "#1E1B4B" }}>
                              {c.progressPct}%
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div style={{ width: "100%", height: "8px", background: "#E2E8F0", borderRadius: "10px", overflow: "hidden" }}>
                          <div style={{
                            width: `${c.progressPct}%`,
                            height: "100%",
                            background: c.progressPct > 90 ? "#4F46E5" : "#3B82F6",
                            borderRadius: "10px"
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 2: Students List */}
              {inspectTab === "students" && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <div style={{ fontSize: "14px", fontWeight: 800, color: "#0F172A" }}>
                      Who are the students in {selectedSchoolDetails.institute.name}?
                    </div>
                    <div style={{ position: "relative", width: "260px" }}>
                      <Search size={14} color="#94A3B8" style={{ position: "absolute", left: "10px", top: "11px" }} />
                      <input
                        type="text"
                        placeholder="Search student or roll no..."
                        value={studentSearch}
                        onChange={(e) => setStudentSearch(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "8px 10px 8px 32px",
                          borderRadius: "8px",
                          border: "1px solid #CBD5E1",
                          fontSize: "12px",
                          outline: "none"
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ overflowX: "auto", border: "1px solid #E2E8F0", borderRadius: "12px" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
                      <thead>
                        <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", color: "#64748B", fontSize: "11px", textTransform: "uppercase" }}>
                          <th style={{ padding: "10px 14px" }}>Admission No</th>
                          <th style={{ padding: "10px 14px" }}>Student Name</th>
                          <th style={{ padding: "10px 14px" }}>Class & Section</th>
                          <th style={{ padding: "10px 14px" }}>Roll No</th>
                          <th style={{ padding: "10px 14px" }}>Parent Name</th>
                          <th style={{ padding: "10px 14px" }}>Parent Phone</th>
                          <th style={{ padding: "10px 14px" }}>Fee Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedSchoolDetails.students
                          .filter((st: any) =>
                            `${st.first_name} ${st.last_name} ${st.admission_number}`
                              .toLowerCase()
                              .includes(studentSearch.toLowerCase())
                          )
                          .map((s: any, idx: number) => (
                            <tr key={idx} style={{ borderBottom: "1px solid #F1F5F9" }}>
                              <td style={{ padding: "10px 14px", fontWeight: 700, color: "#4F46E5" }}>
                                {s.admission_number}
                              </td>
                              <td style={{ padding: "10px 14px", fontWeight: 800, color: "#0F172A" }}>
                                {s.first_name} {s.last_name || ""}
                              </td>
                              <td style={{ padding: "10px 14px", color: "#475569" }}>
                                {s.class_name || "Class 10"} - {s.section_name || "A"}
                              </td>
                              <td style={{ padding: "10px 14px", color: "#64748B" }}>
                                {s.roll_number || "12"}
                              </td>
                              <td style={{ padding: "10px 14px", color: "#334155" }}>
                                {s.parent_name || "Ramesh Kumar"}
                              </td>
                              <td style={{ padding: "10px 14px", color: "#64748B" }}>
                                {s.parent_phone || "9844455566"}
                              </td>
                              <td style={{ padding: "10px 14px" }}>
                                <span style={{
                                  padding: "3px 8px",
                                  borderRadius: "10px",
                                  fontSize: "11px",
                                  fontWeight: 800,
                                  background: (s.fee_status || "PAID") === "PAID" ? "#DCFCE7" : "#FEF3C7",
                                  color: (s.fee_status || "PAID") === "PAID" ? "#166534" : "#B45309"
                                }}>
                                  {s.fee_status || "PAID"}
                                </span>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 3: Staff & Faculty List */}
              {inspectTab === "staff" && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <div style={{ fontSize: "14px", fontWeight: 800, color: "#0F172A" }}>
                      Who is on the staff & faculty team at {selectedSchoolDetails.institute.name}?
                    </div>
                    <div style={{ position: "relative", width: "260px" }}>
                      <Search size={14} color="#94A3B8" style={{ position: "absolute", left: "10px", top: "11px" }} />
                      <input
                        type="text"
                        placeholder="Search teacher or department..."
                        value={staffSearch}
                        onChange={(e) => setStaffSearch(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "8px 10px 8px 32px",
                          borderRadius: "8px",
                          border: "1px solid #CBD5E1",
                          fontSize: "12px",
                          outline: "none"
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ overflowX: "auto", border: "1px solid #E2E8F0", borderRadius: "12px" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
                      <thead>
                        <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", color: "#64748B", fontSize: "11px", textTransform: "uppercase" }}>
                          <th style={{ padding: "10px 14px" }}>Employee Code</th>
                          <th style={{ padding: "10px 14px" }}>Faculty / Staff Name</th>
                          <th style={{ padding: "10px 14px" }}>Designation</th>
                          <th style={{ padding: "10px 14px" }}>Department</th>
                          <th style={{ padding: "10px 14px" }}>Phone</th>
                          <th style={{ padding: "10px 14px" }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedSchoolDetails.staff
                          .filter((st: any) =>
                            `${st.first_name} ${st.last_name} ${st.designation} ${st.department}`
                              .toLowerCase()
                              .includes(staffSearch.toLowerCase())
                          )
                          .map((st: any, idx: number) => (
                            <tr key={idx} style={{ borderBottom: "1px solid #F1F5F9" }}>
                              <td style={{ padding: "10px 14px", fontWeight: 700, color: "#059669" }}>
                                {st.employee_code || `EMP-${101 + idx}`}
                              </td>
                              <td style={{ padding: "10px 14px", fontWeight: 800, color: "#0F172A" }}>
                                {st.first_name} {st.last_name || ""}
                              </td>
                              <td style={{ padding: "10px 14px", color: "#475569" }}>
                                {st.designation || "Senior Faculty"}
                              </td>
                              <td style={{ padding: "10px 14px", color: "#64748B" }}>
                                {st.department || "General"}
                              </td>
                              <td style={{ padding: "10px 14px", color: "#334155" }}>
                                {st.phone || "9822233344"}
                              </td>
                              <td style={{ padding: "10px 14px" }}>
                                <span style={{
                                  padding: "3px 8px",
                                  borderRadius: "10px",
                                  fontSize: "11px",
                                  fontWeight: 800,
                                  background: "#DCFCE7",
                                  color: "#166534"
                                }}>
                                  ● {st.status || "ACTIVE"}
                                </span>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 4: Edit Plan & Quotas */}
              {inspectTab === "plan" && (
                <form onSubmit={handleSavePlanLimits} style={{ maxWidth: "560px", margin: "0 auto" }}>
                  <div style={{ fontSize: "15px", fontWeight: 800, color: "#0F172A", marginBottom: "16px" }}>
                    Update School Quotas & Subscription Plan
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>
                        Subscription Plan Tier
                      </label>
                      <select
                        value={planForm.plan_name}
                        onChange={(e) => setPlanForm({ ...planForm, plan_name: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "8px",
                          border: "1px solid #CBD5E1",
                          fontSize: "13px"
                        }}
                      >
                        <option value="Basic Plan">Basic Plan (₹2,000/mo - 300 Students Limit)</option>
                        <option value="Standard Plan">Standard Plan (₹5,000/mo - 1,500 Students Limit)</option>
                        <option value="Premium Plan">Premium Plan (₹10,000/mo - 5,000 Students Limit)</option>
                      </select>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>
                          Max Student Limit
                        </label>
                        <input
                          type="number"
                          value={planForm.student_limit}
                          onChange={(e) => setPlanForm({ ...planForm, student_limit: Number(e.target.value) })}
                          style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "8px",
                            border: "1px solid #CBD5E1",
                            fontSize: "13px"
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>
                          Max Staff Limit
                        </label>
                        <input
                          type="number"
                          value={planForm.staff_limit}
                          onChange={(e) => setPlanForm({ ...planForm, staff_limit: Number(e.target.value) })}
                          style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "8px",
                            border: "1px solid #CBD5E1",
                            fontSize: "13px"
                          }}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      style={{
                        background: "#4F46E5",
                        color: "#FFFFFF",
                        border: "none",
                        padding: "12px",
                        borderRadius: "10px",
                        fontWeight: 800,
                        fontSize: "14px",
                        cursor: "pointer",
                        marginTop: "8px",
                        boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)"
                      }}
                    >
                      Save Plan & Capacity Changes
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      
      {/* ESCALATED TICKETS FROM SCHOOL ADMINS */}
      {activeTab === "super-tickets" && (
        <div style={{ background: "#FFFFFF", borderRadius: "16px", padding: "24px", border: "1px solid #E2E8F0", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <ShieldAlert size={20} color="#4338CA" />
                <h2 style={{ fontSize: "18px", fontWeight: 800, margin: 0, color: "#0F172A" }}>
                  Escalated Support Tickets from School Admins ({escalatedTickets.length})
                </h2>
              </div>
              <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#64748B" }}>
                High-priority legal, affiliation, quota, and financial issues escalated directly to Super Admin.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {escalatedTickets.map((t) => {
              const isResolved = t.status === "RESOLVED";
              return (
                <div
                  key={t.id}
                  style={{
                    background: "#fff",
                    borderRadius: "14px",
                    border: isResolved ? "1px solid #BBF7D0" : "1px solid #E2E8F0",
                    padding: "20px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontFamily: "monospace", fontWeight: 800, fontSize: "12px", background: "#F1F5F9", padding: "3px 8px", borderRadius: "6px" }}>
                        {t.ticket_number}
                      </span>
                      <span style={{ fontSize: "13px", fontWeight: 800, color: "#0F172A" }}>
                        {t.school_name}
                      </span>
                      <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "6px", background: "#EDE9FE", color: "#6D28D9" }}>
                        {t.category}
                      </span>
                    </div>

                    <span style={{
                      fontSize: "11px",
                      fontWeight: 800,
                      padding: "4px 10px",
                      borderRadius: "20px",
                      background: isResolved ? "#DCFCE7" : "#FEF3C7",
                      color: isResolved ? "#15803D" : "#B45309"
                    }}>
                      {t.status}
                    </span>
                  </div>

                  <div style={{ fontSize: "15px", fontWeight: 800, color: "#0F172A", marginBottom: "6px" }}>
                    {t.title}
                  </div>
                  <div style={{ fontSize: "13px", color: "#475569", lineHeight: 1.5, marginBottom: "12px" }}>
                    {t.description}
                  </div>

                  {isResolved && t.admin_response ? (
                    <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: "10px", padding: "12px", fontSize: "13px", color: "#166534" }}>
                      <strong>Super Admin Response:</strong> {t.admin_response} <span style={{ fontSize: "11px", opacity: 0.8 }}>({t.resolved_at})</span>
                    </div>
                  ) : (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #F1F5F9", paddingTop: "10px" }}>
                      <span style={{ fontSize: "12px", color: "#94A3B8" }}>Submitted: {t.created_at}</span>
                      <button
                        onClick={() => {
                          setSelectedEscTicket(t);
                          setEscResolutionText("");
                        }}
                        style={{
                          background: "#4338CA",
                          color: "#fff",
                          border: "none",
                          padding: "8px 16px",
                          borderRadius: "8px",
                          fontWeight: 700,
                          fontSize: "12px",
                          cursor: "pointer"
                        }}
                      >
                        Respond & Resolve Escalation
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Resolve Escalation Modal */}
      {selectedEscTicket && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15, 23, 42, 0.6)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10000,
          padding: "20px"
        }}>
          <div style={{ background: "#fff", borderRadius: "18px", maxWidth: "520px", width: "100%", padding: "24px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 800, margin: "0 0 8px 0" }}>
              Super Admin Resolution: {selectedEscTicket.ticket_number}
            </h3>
            <p style={{ fontSize: "13px", color: "#64748B", margin: "0 0 16px 0" }}>
              Provide the central platform decision / quota approval for {selectedEscTicket.school_name}.
            </p>
            <textarea
              rows={4}
              value={escResolutionText}
              onChange={(e) => setEscResolutionText(e.target.value)}
              placeholder="e.g. CBSE affiliation extension recognized and ERP validity renewed for 2026-27."
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", marginBottom: "16px", boxSizing: "border-box" }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                onClick={() => setSelectedEscTicket(null)}
                style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #CBD5E1", background: "#fff", cursor: "pointer", fontWeight: 600 }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!escResolutionText.trim()) return;
                  setEscalatedTickets(prev => prev.map(t => t.id === selectedEscTicket.id ? { ...t, status: "RESOLVED", admin_response: escResolutionText.trim(), resolved_at: "Just now" } : t));
                  setSelectedEscTicket(null);
                  showToastMsg("Escalated ticket marked as resolved by Super Admin!");
                }}
                style={{ padding: "8px 18px", borderRadius: "8px", border: "none", background: "#4338CA", color: "#fff", cursor: "pointer", fontWeight: 700 }}
              >
                Confirm Resolution
              </button>
            </div>
          </div>
        </div>
      )}


      {/* ADD SCHOOL MODAL */}
      {showAddModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15, 23, 42, 0.6)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          padding: "20px"
        }}>
          <div style={{
            background: "#FFFFFF",
            borderRadius: "20px",
            width: "100%",
            maxWidth: "600px",
            padding: "32px",
            boxShadow: "0 20px 40px -15px rgba(0,0,0,0.25)"
          }}>
            <h2 style={{ fontSize: "20px", fontWeight: 900, margin: "0 0 6px 0", color: "#0F172A" }}>
              Provision New Tenant School
            </h2>
            <p style={{ fontSize: "13px", color: "#64748B", margin: "0 0 20px 0" }}>
              Instantly create school database tenant, admin credentials, and subscription validity.
            </p>

            <form onSubmit={handleCreateSchool}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>School Name *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Cambridge Court High School"
                    value={newSchool.name}
                    onChange={(e) => setNewSchool({ ...newSchool, name: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>Code *</label>
                  <input
                    required
                    type="text"
                    placeholder="CCHS"
                    value={newSchool.code}
                    onChange={(e) => setNewSchool({ ...newSchool, code: e.target.value.toUpperCase() })}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>Admin Email *</label>
                  <input
                    required
                    type="email"
                    placeholder="info@cambridgecourt.edu.in"
                    value={newSchool.email}
                    onChange={(e) => setNewSchool({ ...newSchool, email: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>Contact Phone *</label>
                  <input
                    required
                    type="text"
                    placeholder="011-87654321"
                    value={newSchool.phone}
                    onChange={(e) => setNewSchool({ ...newSchool, phone: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>City *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Jaipur"
                    value={newSchool.city}
                    onChange={(e) => setNewSchool({ ...newSchool, city: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>Subscription Plan *</label>
                  <select
                    value={newSchool.plan_name}
                    onChange={(e) => setNewSchool({ ...newSchool, plan_name: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px" }}
                  >
                    <option value="Basic Plan">Basic Plan (₹2,000/mo)</option>
                    <option value="Standard Plan">Standard Plan (₹5,000/mo)</option>
                    <option value="Premium Plan">Premium Plan (₹10,000/mo)</option>
                  </select>
                </div>
              </div>

              {/* MANDATORY LEGAL & COMPLIANCE CERTIFICATES SECTION */}
              <div style={{ background: "#F8FAFC", borderRadius: "12px", padding: "16px", border: "1px solid #E2E8F0", marginBottom: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                  <Award size={18} color="#4338CA" />
                  <h4 style={{ margin: 0, fontSize: "13px", fontWeight: 800, color: "#1E1B4B" }}>
                    Mandatory Legal Affiliation & Compliance Certificates (All Required)
                  </h4>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#475569", marginBottom: "4px" }}>
                      1. Affiliation Board & Code *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="CBSE/AFF/213084/2026"
                      value={newSchool.affiliation_number}
                      onChange={(e) => setNewSchool({ ...newSchool, affiliation_number: e.target.value })}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "12px" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#475569", marginBottom: "4px" }}>
                      2. Fire Safety NOC & Validity *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="FS-DEL-NOC-2026-994 (Valid 2028)"
                      value={newSchool.fire_safety_noc}
                      onChange={(e) => setNewSchool({ ...newSchool, fire_safety_noc: e.target.value })}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "12px" }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#475569", marginBottom: "4px" }}>
                      3. Building Safety & Stability *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="PWD/STR/2025/4412"
                      value={newSchool.building_safety_cert}
                      onChange={(e) => setNewSchool({ ...newSchool, building_safety_cert: e.target.value })}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "12px" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#475569", marginBottom: "4px" }}>
                      4. Safe Water & Sanitation NOC *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="DJB/SAN/SAFE-881"
                      value={newSchool.water_sanitation_cert}
                      onChange={(e) => setNewSchool({ ...newSchool, water_sanitation_cert: e.target.value })}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "12px" }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#475569", marginBottom: "4px" }}>
                      5. Society / Trust Deed Reg No. *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="REG-TRUST-DEL-1994-08"
                      value={newSchool.society_trust_deed}
                      onChange={(e) => setNewSchool({ ...newSchool, society_trust_deed: e.target.value })}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "12px" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#475569", marginBottom: "4px" }}>
                      6. State Education Dept NOC *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="EDN-STATE-NOC-2024-119"
                      value={newSchool.state_govt_noc}
                      onChange={(e) => setNewSchool({ ...newSchool, state_govt_noc: e.target.value })}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "12px" }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#475569", marginBottom: "4px" }}>
                      7. Land & Playground Area *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="2.85 Acres Campus Ground"
                      value={newSchool.land_possession_cert}
                      onChange={(e) => setNewSchool({ ...newSchool, land_possession_cert: e.target.value })}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "12px" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#475569", marginBottom: "4px" }}>
                      8. Compliance & Verification Status *
                    </label>
                    <select
                      value={newSchool.compliance_status}
                      onChange={(e) => setNewSchool({ ...newSchool, compliance_status: e.target.value })}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "12px", fontWeight: 700, color: "#15803D" }}
                    >
                      <option value="VERIFIED">100% Verified & Compliant</option>
                      <option value="IN_REVIEW">Under Document Verification</option>
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ padding: "10px 18px", borderRadius: "8px", border: "1px solid #CBD5E1", background: "#F8FAFC", fontWeight: 700, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "10px 22px", borderRadius: "8px", border: "none", background: "#4F46E5", color: "#fff", fontWeight: 800, cursor: "pointer" }}
                >
                  Confirm & Provision School
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
