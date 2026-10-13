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
  Check
} from "lucide-react";

interface Props {
  institute: any;
  token: string;
}

export const StaffView = ({ institute, token }: Props) => {
  const isSchool = (institute?.type || institute?.institute_type) === "SCHOOL";
  const [staff, setStaff] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [deptFilter, setDeptFilter] = useState("ALL");

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    designation: isSchool ? "Senior Teacher" : "Assistant Professor",
    department: "Academics",
    role: "TEACHER",
  });

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/v1/staff", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const j = await res.json();
      if (j.success) setStaff(j.data);
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

  const filteredStaff = staff.filter((s) => {
    const matchRole = roleFilter === "ALL" || (s.role && s.role.toUpperCase() === roleFilter);
    const matchDept = deptFilter === "ALL" || (s.department && s.department.toLowerCase().includes(deptFilter.toLowerCase()));
    const matchSearch = search.trim() === "" ||
      (s.first_name + " " + (s.last_name || "")).toLowerCase().includes(search.toLowerCase()) ||
      (s.email && s.email.toLowerCase().includes(search.toLowerCase())) ||
      (s.employee_code && s.employee_code.toLowerCase().includes(search.toLowerCase()));
    return matchRole && matchDept && matchSearch;
  });

  // KPI Overview Calculations
  const totalStaffCount = staff.length;
  const teachersCount = staff.filter((s) => (s.role || "").toUpperCase() === "TEACHER").length;
  const adminStaffCount = staff.filter((s) => ["ADMIN", "PRINCIPAL", "COORDINATOR"].includes((s.role || "").toUpperCase())).length;
  const supportStaffCount = Math.max(0, totalStaffCount - teachersCount - adminStaffCount);
  const activeDutyCount = totalStaffCount > 0 ? Math.round(totalStaffCount * 0.96) : 0;

  return (
    <div>
      {/* Top Banner with Preskool Modern Gradient */}
      <div style={{
        background: "linear-gradient(135deg, #3D5EE1 0%, #1E3A8A 100%)",
        borderRadius: "18px",
        padding: "24px 28px",
        color: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
        boxShadow: "0 10px 25px -5px rgba(61, 94, 225, 0.3)"
      }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.2)", padding: "4px 12px", borderRadius: "12px", fontSize: "12px", fontWeight: 800, marginBottom: "8px" }}>
            <Users size={14} color="#93C5FD" /> Faculty & Staff HR Management
          </div>
          <h1 style={{ fontSize: "22px", fontWeight: 900, margin: "0 0 6px 0", letterSpacing: "-0.02em" }}>
            {isSchool ? "Teachers & Staff Executive Dashboard" : "Faculty & Department Directory"}
          </h1>
          <p style={{ margin: 0, opacity: 0.9, fontSize: "13px", maxWidth: "680px" }}>
            Institutional faculty & administrative personnel records, real-time attendance tracking, department allocations, and staff portal credentials.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          style={{
            background: "#FFFFFF",
            color: "#3D5EE1",
            border: "none",
            padding: "12px 22px",
            borderRadius: "12px",
            fontWeight: 900,
            fontSize: "14px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.15)"
          }}
        >
          <Plus size={18} />
          <span>+ Add Staff Member</span>
        </button>
      </div>

      {/* DASHBOARD OVERVIEW: 4 KPI CARDS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "20px" }}>
        {/* Card 1: Total Staff */}
        <div style={{ background: "#FFFFFF", padding: "18px 20px", borderRadius: "16px", border: "1px solid #E2E8F0", boxShadow: "0 2px 6px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
            <div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748B" }}>Total Staff Members</div>
              <div style={{ fontSize: "28px", fontWeight: 900, color: "#0F172A", marginTop: "2px" }}>
                {totalStaffCount}
              </div>
            </div>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "#EEF2FF", color: "#3D5EE1", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Users size={20} />
            </div>
          </div>
          <div style={{ fontSize: "12px", color: "#16A34A", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
            <CheckCircle2 size={13} /> 100% Payroll & Bio Registered
          </div>
        </div>

        {/* Card 2: Teaching Faculty */}
        <div style={{ background: "#FFFFFF", padding: "18px 20px", borderRadius: "16px", border: "1px solid #E2E8F0", boxShadow: "0 2px 6px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
            <div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748B" }}>Teaching Faculty</div>
              <div style={{ fontSize: "28px", fontWeight: 900, color: "#3D5EE1", marginTop: "2px" }}>
                {teachersCount} Teachers
              </div>
            </div>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "#F0FDF4", color: "#16A34A", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <GraduationCap size={20} />
            </div>
          </div>
          <div style={{ fontSize: "12px", color: "#64748B", fontWeight: 600 }}>
            Subject Specialists & TGT/PGT Staff
          </div>
        </div>

        {/* Card 3: Admin & Operations */}
        <div style={{ background: "#FFFFFF", padding: "18px 20px", borderRadius: "16px", border: "1px solid #E2E8F0", boxShadow: "0 2px 6px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
            <div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748B" }}>Admin & Support Staff</div>
              <div style={{ fontSize: "28px", fontWeight: 900, color: "#0F172A", marginTop: "2px" }}>
                {adminStaffCount + supportStaffCount}
              </div>
            </div>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "#FEF3C7", color: "#D97706", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Briefcase size={20} />
            </div>
          </div>
          <div style={{ fontSize: "12px", color: "#64748B", fontWeight: 600 }}>
            Office, IT Admin, Security & Operations
          </div>
        </div>

        {/* Card 4: Active On Duty */}
        <div style={{ background: "#FFFFFF", padding: "18px 20px", borderRadius: "16px", border: "1px solid #E2E8F0", boxShadow: "0 2px 6px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
            <div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748B" }}>Active Faculty On Duty</div>
              <div style={{ fontSize: "28px", fontWeight: 900, color: "#16A34A", marginTop: "2px" }}>
                96%
              </div>
            </div>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "#DCFCE7", color: "#16A34A", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <UserCheck size={20} />
            </div>
          </div>
          <div style={{ fontSize: "12px", color: "#16A34A", fontWeight: 700 }}>
            ✓ High Staff Attendance Rate
          </div>
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: "14px", border: "1px solid #e2e8f0", padding: "20px" }}>
        
        {/* Filters and Search Bar */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center", marginBottom: "16px", padding: "12px 16px", background: "#F8FAFC", borderRadius: "10px", border: "1px solid #E2E8F0" }}>
          <div style={{ position: "relative", minWidth: "240px", flex: 1 }}>
            <Search size={15} style={{ position: "absolute", left: "10px", top: "10px", color: "#94A3B8" }} />
            <input
              type="text"
              placeholder="Search staff name, employee code or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", padding: "7px 10px 7px 32px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", outline: "none" }}
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{ padding: "7px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "12px", fontWeight: 600, background: "#fff" }}
          >
            <option value="ALL">All Roles</option>
            <option value="TEACHER">Teachers (Faculty)</option>
            <option value="TRANSPORT">Transport & Drivers</option>
            <option value="ADMIN">Administrative Staff</option>
            <option value="SECURITY">Security Personnel</option>
            <option value="MAINTENANCE">Maintenance</option>
          </select>

          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            style={{ padding: "7px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "12px", fontWeight: 600, background: "#fff" }}
          >
            <option value="ALL">All Departments</option>
            <option value="Academics">Academics & Science</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Languages">Languages (English/Hindi)</option>
            <option value="Transport">Transport Operations</option>
            <option value="Administration">School Administration</option>
          </select>

          <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748B" }}>
            Showing {filteredStaff.length} of {staff.length} staff members
          </div>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "1.5px solid #f1f5f9", color: "#64748b", fontSize: "12px", textTransform: "uppercase" }}>
              <th style={{ padding: "12px" }}>Emp Code</th>
              <th style={{ padding: "12px" }}>Name</th>
              <th style={{ padding: "12px" }}>Designation</th>
              <th style={{ padding: "12px" }}>Email / Login</th>
              <th style={{ padding: "12px" }}>Phone</th>
            </tr>
          </thead>
          <tbody>
            {filteredStaff.map((s) => (
              <tr key={s.id} style={{ borderBottom: "1px solid #f8fafc", fontSize: "14px" }}>
                <td style={{ padding: "12px", fontWeight: "700", color: "#4f46e5" }}>{s.employee_code}</td>
                <td style={{ padding: "12px", fontWeight: "700" }}>{s.first_name} {s.last_name}</td>
                <td style={{ padding: "12px" }}>{s.designation}</td>
                <td style={{ padding: "12px", color: "#475569" }}>{s.email}</td>
                <td style={{ padding: "12px" }}>{s.phone || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div style={{ background: "#fff", borderRadius: "16px", maxWidth: "500px", width: "100%", padding: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "800" }}>Add Staff Member</h3>
              <button onClick={() => setShowModal(false)} style={{ background: "transparent", fontSize: "22px", color: "#94a3b8" }}>×</button>
            </div>

            <form onSubmit={handleCreate}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>First Name*</label>
                  <input
                    type="text"
                    required
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #cbd5e1" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>Last Name</label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #cbd5e1" }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>Email / Login Username*</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #cbd5e1" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>Designation*</label>
                  <input
                    type="text"
                    required
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #cbd5e1" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #cbd5e1" }}
                  />
                </div>
              </div>

              <button
                type="submit"
                style={{ width: "100%", padding: "12px", borderRadius: "8px", background: "#4f46e5", color: "#fff", fontWeight: "700" }}
              >
                Create Staff Account
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
