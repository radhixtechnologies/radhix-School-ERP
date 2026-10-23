import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  ShieldCheck,
  CheckCircle2,
  Users,
  GraduationCap,
  Briefcase,
  UserCheck,
  Award,
  Sparkles,
  TrendingUp,
  Building,
  Check,
  Calendar,
  Clock,
  ArrowRightLeft,
  AlertCircle,
  FileText,
  UserPlus
} from "lucide-react";

interface Props {
  institute: any;
  token: string;
}

export const StaffView = ({ institute, token }: Props) => {
  const isSchool = (institute?.type || institute?.institute_type) === "SCHOOL";
  const [activeSubTab, setActiveSubTab] = useState<"directory" | "leaves">("directory");

  const [staff, setStaff] = useState<any[]>([]);
  const [leaves, setLeaves] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showProxyModal, setShowProxyModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<any>(null);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [leaveStatusFilter, setLeaveStatusFilter] = useState("ALL");

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    designation: isSchool ? "Senior Teacher" : "Assistant Professor",
    department: "Academics",
    role: "TEACHER",
  });

  // Leave Form (Admin logging leave for a teacher)
  const [newLeaveForm, setNewLeaveForm] = useState({
    staff_id: "",
    leave_type: "CASUAL",
    start_date: new Date().toISOString().split("T")[0],
    end_date: new Date().toISOString().split("T")[0],
    reason: "",
    substitute_staff_id: "",
    substitute_name: "",
    substitution_notes: "",
  });

  // Proxy Assignment Form
  const [proxyForm, setProxyForm] = useState({
    substitute_staff_id: "",
    substitute_name: "",
    substitution_notes: "Covering Mathematics & Physics periods 2 and 4",
    admin_remarks: "Approved by Principal. Proxy duty assigned.",
    status: "APPROVED",
  });

  useEffect(() => {
    loadStaff();
    loadLeaves();
  }, [token]);

  const loadStaff = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/v1/staff", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const j = await res.json();
      if (j.success) {
        setStaff(j.data);
        if (j.data.length > 0) {
          setNewLeaveForm(prev => ({
            ...prev,
            staff_id: j.data[0].id,
            substitute_staff_id: j.data[1]?.id || j.data[0].id,
            substitute_name: `${j.data[1]?.first_name || j.data[0].first_name} ${j.data[1]?.last_name || j.data[0].last_name || ""}`.trim()
          }));
        }
      }
    } catch {}
  };

  const loadLeaves = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/v1/school-features/teacher-leaves", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const j = await res.json();
      if (j.success) setLeaves(j.data);
    } catch {}
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/v1/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      const j = await res.json();
      if (j.success) {
        setShowModal(false);
        loadStaff();
        alert(`Staff added! Username: ${j.data.credentials.username}, Password: ${j.data.credentials.temporaryPassword}`);
      } else {
        alert(j.message || "Failed to add staff");
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  // Submit Leave on behalf of Teacher
  const handleCreateLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/v1/school-features/teacher-leaves", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(newLeaveForm),
      });
      const j = await res.json();
      if (j.success) {
        alert("Teacher leave and substitute recorded successfully!");
        setShowLeaveModal(false);
        loadLeaves();
      } else {
        alert(j.message || "Failed to apply leave");
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  // Assign Substitute Teacher
  const handleSaveProxy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeave) return;
    try {
      const res = await fetch(`http://localhost:5000/api/v1/school-features/teacher-leaves/${selectedLeave.id}/assign-substitute`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(proxyForm),
      });
      const j = await res.json();
      if (j.success) {
        alert(j.message);
        setShowProxyModal(false);
        loadLeaves();
      } else {
        alert(j.message || "Failed to assign substitute teacher");
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  // Quick Approve / Reject
  const handleQuickStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/v1/school-features/teacher-leaves/${id}/assign-substitute`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      const j = await res.json();
      if (j.success) loadLeaves();
    } catch {}
  };

  const filteredStaff = staff.filter((s) => {
    const matchRole = roleFilter === "ALL" || (s.role && s.role.toUpperCase() === roleFilter);
    const matchDept = deptFilter === "ALL" || (s.department && s.department.toLowerCase().includes(deptFilter.toLowerCase()));
    const matchSearch = search.trim() === "" ||
      (s.first_name + " " + (s.last_name || "")).toLowerCase().includes(search.toLowerCase()) ||
      (s.email && s.email.toLowerCase().includes(search.toLowerCase())) ||
      (s.employee_code && s.employee_code.toLowerCase().includes(search.toLowerCase()));
    return matchRole && matchDept && matchSearch;
  });

  const filteredLeaves = leaves.filter((l) => {
    const matchStatus = leaveStatusFilter === "ALL" || l.status === leaveStatusFilter;
    const matchSearch = search.trim() === "" ||
      (l.first_name + " " + (l.last_name || "")).toLowerCase().includes(search.toLowerCase()) ||
      (l.reason || "").toLowerCase().includes(search.toLowerCase()) ||
      (l.substitute_name || "").toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  // KPI Overview Calculations
  const totalStaffCount = staff.length;
  const teachersCount = staff.filter((s) => (s.role || "").toUpperCase() === "TEACHER").length;
  const pendingLeavesCount = leaves.filter((l) => l.status === "PENDING").length;
  const proxyAssignedCount = leaves.filter((l) => !!l.substitute_name).length;

  return (
    <div style={{ padding: "32px", background: "#F8FAFC", minHeight: "100vh" }}>
      {/* Top Banner with Preskool Modern Gradient */}
      <div style={{
        background: "linear-gradient(135deg, #3D5EE1 0%, #1E3A8A 100%)",
        borderRadius: "20px",
        padding: "28px 32px",
        color: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "24px",
        boxShadow: "0 10px 25px -5px rgba(61, 94, 225, 0.3)",
        flexWrap: "wrap",
        gap: "16px"
      }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.2)", padding: "4px 12px", borderRadius: "12px", fontSize: "12px", fontWeight: 800, marginBottom: "8px" }}>
            <Users size={14} color="#93C5FD" /> Faculty HR & Substitution Management
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: 900, margin: "0 0 6px 0", letterSpacing: "-0.02em" }}>
            {isSchool ? "Teachers, Staff & Proxy Substitution Hub" : "Faculty & Department Directory"}
          </h1>
          <p style={{ margin: 0, opacity: 0.9, fontSize: "13px", maxWidth: "680px" }}>
            Manage staff profiles, teacher leave applications, and assign substitute proxy teachers to ensure zero class disruption.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            onClick={() => setShowLeaveModal(true)}
            style={{
              background: "rgba(255,255,255,0.15)",
              color: "#FFFFFF",
              border: "1px solid rgba(255,255,255,0.4)",
              padding: "11px 18px",
              borderRadius: "12px",
              fontWeight: 800,
              fontSize: "13px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <Calendar size={15} />
            <span>Apply Teacher Leave</span>
          </button>

          <button
            onClick={() => setShowModal(true)}
            style={{
              background: "#FFFFFF",
              color: "#3D5EE1",
              border: "none",
              padding: "11px 20px",
              borderRadius: "12px",
              fontWeight: 900,
              fontSize: "13px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 6px 20px rgba(0,0,0,0.15)"
            }}
          >
            <Plus size={16} />
            <span>+ Add Staff Member</span>
          </button>
        </div>
      </div>

      {/* Subtab Navigation Pills */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "2px solid #E2E8F0",
        marginBottom: "24px",
        paddingBottom: "12px",
        flexWrap: "wrap",
        gap: "12px"
      }}>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => setActiveSubTab("directory")}
            style={{
              padding: "10px 20px",
              borderRadius: "10px",
              fontWeight: 800,
              fontSize: "13px",
              cursor: "pointer",
              border: "none",
              background: activeSubTab === "directory" ? "#3D5EE1" : "#FFFFFF",
              color: activeSubTab === "directory" ? "#FFFFFF" : "#64748B",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: activeSubTab === "directory" ? "0 4px 12px rgba(61, 94, 225, 0.25)" : "none"
            }}
          >
            <Users size={16} />
            <span>Teachers & Staff Directory ({staff.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab("leaves")}
            style={{
              padding: "10px 20px",
              borderRadius: "10px",
              fontWeight: 800,
              fontSize: "13px",
              cursor: "pointer",
              border: "none",
              background: activeSubTab === "leaves" ? "#3D5EE1" : "#FFFFFF",
              color: activeSubTab === "leaves" ? "#FFFFFF" : "#64748B",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: activeSubTab === "leaves" ? "0 4px 12px rgba(61, 94, 225, 0.25)" : "none"
            }}
          >
            <ArrowRightLeft size={16} />
            <span>Teacher Leaves & Proxy Substitution ({leaves.length})</span>
            {pendingLeavesCount > 0 && (
              <span style={{
                background: "#EF4444",
                color: "#FFF",
                borderRadius: "50%",
                padding: "2px 6px",
                fontSize: "10px",
                fontWeight: 900
              }}>
                {pendingLeavesCount}
              </span>
            )}
          </button>
        </div>

        {/* Search Input */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "#FFFFFF",
          border: "1px solid #CBD5E1",
          borderRadius: "10px",
          padding: "8px 14px",
          width: "260px"
        }}>
          <Search size={15} color="#94A3B8" />
          <input
            type="text"
            placeholder={activeSubTab === "directory" ? "Search name, email, code..." : "Search teacher, reason, proxy..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: "none", outline: "none", fontSize: "13px", width: "100%", background: "transparent" }}
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUBTAB 1: STAFF DIRECTORY */}
      {/* ========================================================================= */}
      {activeSubTab === "directory" && (
        <>
          {/* KPI Summary Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "24px" }}>
            <div style={{ background: "#FFFFFF", padding: "18px 20px", borderRadius: "14px", border: "1px solid #E2E8F0" }}>
              <div style={{ fontSize: "12px", color: "#64748B", fontWeight: 700, marginBottom: "4px" }}>TOTAL FACULTY & STAFF</div>
              <div style={{ fontSize: "26px", fontWeight: 900, color: "#0F172A" }}>{totalStaffCount}</div>
              <div style={{ fontSize: "11px", color: "#10B981", fontWeight: 700, marginTop: "2px" }}>Active on duty</div>
            </div>

            <div style={{ background: "#FFFFFF", padding: "18px 20px", borderRadius: "14px", border: "1px solid #E2E8F0" }}>
              <div style={{ fontSize: "12px", color: "#64748B", fontWeight: 700, marginBottom: "4px" }}>CLASSROOM TEACHERS</div>
              <div style={{ fontSize: "26px", fontWeight: 900, color: "#3D5EE1" }}>{teachersCount}</div>
              <div style={{ fontSize: "11px", color: "#64748B", marginTop: "2px" }}>Teaching Periods 1-6</div>
            </div>

            <div style={{ background: "#FFFFFF", padding: "18px 20px", borderRadius: "14px", border: "1px solid #E2E8F0" }}>
              <div style={{ fontSize: "12px", color: "#64748B", fontWeight: 700, marginBottom: "4px" }}>PENDING LEAVE REQUESTS</div>
              <div style={{ fontSize: "26px", fontWeight: 900, color: pendingLeavesCount > 0 ? "#DC2626" : "#0F172A" }}>{pendingLeavesCount}</div>
              <div style={{ fontSize: "11px", color: "#64748B", marginTop: "2px" }}>Awaiting proxy assignment</div>
            </div>

            <div style={{ background: "#FFFFFF", padding: "18px 20px", borderRadius: "14px", border: "1px solid #E2E8F0" }}>
              <div style={{ fontSize: "12px", color: "#64748B", fontWeight: 700, marginBottom: "4px" }}>PROXY TEACHERS ACTIVE</div>
              <div style={{ fontSize: "26px", fontWeight: 900, color: "#10B981" }}>{proxyAssignedCount}</div>
              <div style={{ fontSize: "11px", color: "#10B981", fontWeight: 700, marginTop: "2px" }}>Covering leave classes</div>
            </div>
          </div>

          {/* Staff Roster Table */}
          <div style={{ background: "#FFFFFF", borderRadius: "16px", border: "1px solid #E2E8F0", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
              <thead>
                <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", color: "#64748B", fontWeight: 700 }}>
                  <th style={{ padding: "14px 20px" }}>Staff Member</th>
                  <th style={{ padding: "14px 20px" }}>Employee Code</th>
                  <th style={{ padding: "14px 20px" }}>Designation</th>
                  <th style={{ padding: "14px 20px" }}>Department</th>
                  <th style={{ padding: "14px 20px" }}>Contact</th>
                  <th style={{ padding: "14px 20px" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.map((s) => (
                  <tr key={s.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                    <td style={{ padding: "14px 20px" }}>
                      <div style={{ fontWeight: 800, color: "#0F172A" }}>{s.first_name} {s.last_name || ""}</div>
                      <div style={{ fontSize: "11px", color: "#64748B" }}>{s.email}</div>
                    </td>
                    <td style={{ padding: "14px 20px", fontFamily: "monospace", fontWeight: 700 }}>{s.employee_code}</td>
                    <td style={{ padding: "14px 20px", fontWeight: 700 }}>{s.designation}</td>
                    <td style={{ padding: "14px 20px", color: "#64748B" }}>{s.department || "General"}</td>
                    <td style={{ padding: "14px 20px", color: "#64748B" }}>{s.phone || "—"}</td>
                    <td style={{ padding: "14px 20px" }}>
                      <span style={{
                        padding: "3px 8px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: 800,
                        background: "#DCFCE7",
                        color: "#16A34A"
                      }}>
                        ● ACTIVE
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 2: TEACHER LEAVES & SUBSTITUTE PROXY ASSIGNMENT */}
      {/* ========================================================================= */}
      {activeSubTab === "leaves" && (
        <div style={{ background: "#FFFFFF", borderRadius: "16px", border: "1px solid #E2E8F0", overflow: "hidden" }}>
          <div style={{ padding: "18px 24px", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: "#0F172A" }}>
                Teacher Leave Applications & Class Coverage
              </h3>
              <span style={{ fontSize: "12px", color: "#64748B" }}>
                When a teacher applies for leave, Admin assigns a substitute teacher to conduct their teaching periods
              </span>
            </div>

            <select
              value={leaveStatusFilter}
              onChange={(e) => setLeaveStatusFilter(e.target.value)}
              style={{ padding: "7px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "12px", fontWeight: 700 }}
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending Approval</option>
              <option value="APPROVED">Approved & Assigned</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
            <thead>
              <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", color: "#64748B", fontWeight: 700 }}>
                <th style={{ padding: "14px 20px" }}>Teacher On Leave</th>
                <th style={{ padding: "14px 20px" }}>Leave Details</th>
                <th style={{ padding: "14px 20px" }}>Reason</th>
                <th style={{ padding: "14px 20px" }}>Assigned Proxy / Substitute</th>
                <th style={{ padding: "14px 20px" }}>Leave Status</th>
                <th style={{ padding: "14px 20px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaves.length > 0 ? (
                filteredLeaves.map((l) => {
                  const isApproved = l.status === "APPROVED";
                  const isPending = l.status === "PENDING";
                  const hasProxy = !!l.substitute_name;

                  return (
                    <tr key={l.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                      {/* Teacher */}
                      <td style={{ padding: "14px 20px" }}>
                        <div style={{ fontWeight: 800, color: "#0F172A" }}>{l.first_name} {l.last_name || ""}</div>
                        <div style={{ fontSize: "11px", color: "#64748B" }}>{l.designation} • {l.employee_code}</div>
                      </td>

                      {/* Leave Type & Dates */}
                      <td style={{ padding: "14px 20px" }}>
                        <span style={{
                          background: l.leave_type === "MEDICAL" ? "#FEE2E2" : "#FEF3C7",
                          color: l.leave_type === "MEDICAL" ? "#DC2626" : "#B45309",
                          padding: "3px 8px",
                          borderRadius: "6px",
                          fontSize: "11px",
                          fontWeight: 800
                        }}>
                          {l.leave_type} LEAVE
                        </span>
                        <div style={{ fontSize: "12px", color: "#334155", fontWeight: 700, marginTop: "4px" }}>
                          {l.start_date} to {l.end_date}
                        </div>
                      </td>

                      {/* Reason */}
                      <td style={{ padding: "14px 20px", maxWidth: "250px" }}>
                        <div style={{ color: "#334155", fontSize: "12px", lineHeight: 1.4 }}>{l.reason}</div>
                        {l.admin_remarks && (
                          <div style={{ fontSize: "11px", color: "#2563EB", marginTop: "3px" }}>
                            Admin: {l.admin_remarks}
                          </div>
                        )}
                      </td>

                      {/* Proxy Substitute Teacher */}
                      <td style={{ padding: "14px 20px" }}>
                        {hasProxy ? (
                          <div style={{ background: "#F0FDF4", padding: "8px 12px", borderRadius: "10px", border: "1px solid #BBF7D0" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 800, color: "#166534", fontSize: "12px" }}>
                              <UserCheck size={14} color="#16A34A" />
                              <span>{l.substitute_name}</span>
                            </div>
                            {l.substitution_notes && (
                              <div style={{ fontSize: "11px", color: "#15803D", marginTop: "2px" }}>
                                {l.substitution_notes}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#D97706", fontSize: "12px", fontWeight: 700 }}>
                            <AlertCircle size={14} />
                            <span>No Substitute Assigned</span>
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td style={{ padding: "14px 20px" }}>
                        <span style={{
                          padding: "4px 10px",
                          borderRadius: "20px",
                          fontSize: "11px",
                          fontWeight: 900,
                          background: isApproved ? "#DCFCE7" : isPending ? "#FEF3C7" : "#FEE2E2",
                          color: isApproved ? "#15803D" : isPending ? "#D97706" : "#DC2626"
                        }}>
                          {l.status}
                        </span>
                      </td>

                      {/* Action: Assign Proxy Button */}
                      <td style={{ padding: "14px 20px", textAlign: "right" }}>
                        <button
                          onClick={() => {
                            setSelectedLeave(l);
                            const availableTeachers = staff.filter(s => s.id !== l.staff_id);
                            const firstSub = availableTeachers[0] || staff[0];
                            setProxyForm({
                              substitute_staff_id: l.substitute_staff_id || firstSub?.id || "",
                              substitute_name: l.substitute_name || `${firstSub?.first_name || ""} ${firstSub?.last_name || ""}`.trim(),
                              substitution_notes: l.substitution_notes || "Assigned to cover daily teaching periods and monitor class attendance.",
                              admin_remarks: l.admin_remarks || "Leave approved by Principal. Proxy duty assigned.",
                              status: "APPROVED",
                            });
                            setShowProxyModal(true);
                          }}
                          style={{
                            background: "#3D5EE1",
                            color: "#FFFFFF",
                            border: "none",
                            padding: "8px 14px",
                            borderRadius: "8px",
                            fontSize: "12px",
                            fontWeight: 800,
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px"
                          }}
                        >
                          <ArrowRightLeft size={13} />
                          <span>{hasProxy ? "Change Proxy" : "Assign Substitute"}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} style={{ padding: "30px", textAlign: "center", color: "#94A3B8" }}>
                    No teacher leave applications recorded.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: ASSIGN SUBSTITUTE (PROXY) TEACHER */}
      {/* ========================================================================= */}
      {showProxyModal && selectedLeave && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(15, 23, 42, 0.6)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 50,
          padding: "20px"
        }}>
          <div style={{
            background: "#FFFFFF",
            borderRadius: "20px",
            width: "100%",
            maxWidth: "520px",
            padding: "28px",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)"
          }}>
            <h2 style={{ fontSize: "18px", fontWeight: 800, margin: "0 0 14px 0", color: "#0F172A" }}>
              Assign Substitute (Proxy) Teacher
            </h2>

            {/* Leave Details Box */}
            <div style={{ background: "#F1F5F9", borderRadius: "12px", padding: "14px 18px", marginBottom: "18px" }}>
              <div style={{ fontSize: "11px", color: "#64748B", fontWeight: 700 }}>TEACHER ON LEAVE</div>
              <div style={{ fontSize: "15px", fontWeight: 800, color: "#0F172A" }}>
                {selectedLeave.first_name} {selectedLeave.last_name || ""} ({selectedLeave.designation})
              </div>
              <div style={{ fontSize: "12px", color: "#475569", marginTop: "4px" }}>
                Duration: <strong>{selectedLeave.start_date} to {selectedLeave.end_date}</strong> • Reason: {selectedLeave.reason}
              </div>
            </div>

            <form onSubmit={handleSaveProxy}>
              {/* Substitute Teacher Dropdown */}
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>
                  Select Substitute / Proxy Faculty:
                </label>
                <select
                  value={proxyForm.substitute_staff_id}
                  onChange={(e) => {
                    const chosen = staff.find(s => s.id === e.target.value);
                    setProxyForm({
                      ...proxyForm,
                      substitute_staff_id: e.target.value,
                      substitute_name: chosen ? `${chosen.first_name} ${chosen.last_name || ""}`.trim() : ""
                    });
                  }}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "1px solid #CBD5E1",
                    fontSize: "13px",
                    fontWeight: 700
                  }}
                >
                  {staff
                    .filter(s => s.id !== selectedLeave.staff_id)
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.first_name} {s.last_name || ""} — {s.designation} ({s.department || "Academics"})
                      </option>
                    ))}
                </select>
              </div>

              {/* Covered Classes / Periods Notes */}
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>
                  Classes & Periods to Cover:
                </label>
                <input
                  type="text"
                  required
                  value={proxyForm.substitution_notes}
                  onChange={(e) => setProxyForm({ ...proxyForm, substitution_notes: e.target.value })}
                  placeholder="e.g. Class 10-A Math Period 2 & 4, Class 9-B Geometry"
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "10px",
                    border: "1px solid #CBD5E1",
                    fontSize: "13px"
                  }}
                />
              </div>

              {/* Admin Remarks */}
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>
                  Admin Approval Remarks:
                </label>
                <input
                  type="text"
                  value={proxyForm.admin_remarks}
                  onChange={(e) => setProxyForm({ ...proxyForm, admin_remarks: e.target.value })}
                  placeholder="e.g. Approved. Duty assigned."
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "10px",
                    border: "1px solid #CBD5E1",
                    fontSize: "13px"
                  }}
                />
              </div>

              {/* Approval Status Select */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>
                  Leave Approval Decision:
                </label>
                <select
                  value={proxyForm.status}
                  onChange={(e) => setProxyForm({ ...proxyForm, status: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "10px",
                    border: "1px solid #CBD5E1",
                    fontSize: "13px",
                    fontWeight: 700
                  }}
                >
                  <option value="APPROVED">APPROVE LEAVE & ASSIGN PROXY</option>
                  <option value="PENDING">KEEP PENDING</option>
                  <option value="REJECTED">REJECT LEAVE APPLICATION</option>
                </select>
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setShowProxyModal(false)}
                  style={{
                    padding: "10px 18px",
                    borderRadius: "10px",
                    background: "#F1F5F9",
                    color: "#64748B",
                    border: "none",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  style={{
                    padding: "10px 22px",
                    borderRadius: "10px",
                    background: "#3D5EE1",
                    color: "#FFFFFF",
                    border: "none",
                    fontWeight: 800,
                    cursor: "pointer"
                  }}
                >
                  Confirm & Assign Proxy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: APPLY / LOG TEACHER LEAVE DIRECTLY */}
      {/* ========================================================================= */}
      {showLeaveModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(15, 23, 42, 0.6)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 50,
          padding: "20px"
        }}>
          <div style={{
            background: "#FFFFFF",
            borderRadius: "20px",
            width: "100%",
            maxWidth: "520px",
            padding: "28px",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)"
          }}>
            <h2 style={{ fontSize: "18px", fontWeight: 800, margin: "0 0 16px 0", color: "#0F172A" }}>
              Apply Teacher Leave & Assign Proxy
            </h2>

            <form onSubmit={handleCreateLeave}>
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>
                  Select Teacher:
                </label>
                <select
                  value={newLeaveForm.staff_id}
                  onChange={(e) => setNewLeaveForm({ ...newLeaveForm, staff_id: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "13px", fontWeight: 700 }}
                >
                  {staff.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.first_name} {s.last_name || ""} — {s.designation}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: "10px", marginBottom: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>
                    Leave Type:
                  </label>
                  <select
                    value={newLeaveForm.leave_type}
                    onChange={(e) => setNewLeaveForm({ ...newLeaveForm, leave_type: e.target.value })}
                    style={{ width: "100%", padding: "9px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "13px" }}
                  >
                    <option value="CASUAL">Casual Leave</option>
                    <option value="MEDICAL">Medical Leave</option>
                    <option value="DUTY">Duty Leave</option>
                    <option value="MATERNITY">Maternity</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>
                    Start Date:
                  </label>
                  <input
                    type="date"
                    required
                    value={newLeaveForm.start_date}
                    onChange={(e) => setNewLeaveForm({ ...newLeaveForm, start_date: e.target.value })}
                    style={{ width: "100%", padding: "9px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "13px" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>
                    End Date:
                  </label>
                  <input
                    type="date"
                    required
                    value={newLeaveForm.end_date}
                    onChange={(e) => setNewLeaveForm({ ...newLeaveForm, end_date: e.target.value })}
                    style={{ width: "100%", padding: "9px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "13px" }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>
                  Reason for Leave:
                </label>
                <input
                  type="text"
                  required
                  value={newLeaveForm.reason}
                  onChange={(e) => setNewLeaveForm({ ...newLeaveForm, reason: e.target.value })}
                  placeholder="e.g. Viral fever / family emergency"
                  style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "13px" }}
                />
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>
                  Assign Substitute / Proxy Teacher:
                </label>
                <select
                  value={newLeaveForm.substitute_staff_id}
                  onChange={(e) => {
                    const chosen = staff.find(s => s.id === e.target.value);
                    setNewLeaveForm({
                      ...newLeaveForm,
                      substitute_staff_id: e.target.value,
                      substitute_name: chosen ? `${chosen.first_name} ${chosen.last_name || ""}`.trim() : ""
                    });
                  }}
                  style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "13px", fontWeight: 700 }}
                >
                  {staff.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.first_name} {s.last_name || ""} — {s.designation}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>
                  Periods / Classes to Cover:
                </label>
                <input
                  type="text"
                  value={newLeaveForm.substitution_notes}
                  onChange={(e) => setNewLeaveForm({ ...newLeaveForm, substitution_notes: e.target.value })}
                  placeholder="e.g. Class 10-A Mathematics Period 2 & 4"
                  style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "13px" }}
                />
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setShowLeaveModal(false)}
                  style={{ padding: "10px 18px", borderRadius: "10px", background: "#F1F5F9", color: "#64748B", border: "none", fontWeight: 700, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "10px 22px", borderRadius: "10px", background: "#3D5EE1", color: "#FFFFFF", border: "none", fontWeight: 800, cursor: "pointer" }}
                >
                  Record Leave & Proxy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: ADD NEW STAFF MEMBER */}
      {/* ========================================================================= */}
      {showModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(15, 23, 42, 0.6)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 50,
          padding: "20px"
        }}>
          <div style={{ background: "#FFFFFF", borderRadius: "20px", width: "100%", maxWidth: "480px", padding: "28px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 800, margin: "0 0 16px 0", color: "#0F172A" }}>
              Add New Faculty / Staff Member
            </h2>

            <form onSubmit={handleCreate}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "4px" }}>First Name*</label>
                  <input
                    type="text"
                    required
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "13px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "4px" }}>Last Name</label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "13px" }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "4px" }}>Email Address*</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "13px" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "4px" }}>Designation*</label>
                  <input
                    type="text"
                    required
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "13px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "4px" }}>Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "13px" }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "20px" }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ padding: "10px 18px", borderRadius: "10px", background: "#F1F5F9", color: "#64748B", border: "none", fontWeight: 700, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "10px 22px", borderRadius: "10px", background: "#3D5EE1", color: "#FFFFFF", border: "none", fontWeight: 800, cursor: "pointer" }}
                >
                  Create Staff Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
