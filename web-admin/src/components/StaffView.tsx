import { useState, useEffect } from "react";
import { Plus, Search, Filter, ShieldCheck, CheckCircle2 } from "lucide-react";

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

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: "800" }}>
            {isSchool ? "Teachers & Staff Directory" : "Faculty & Department Directory"}
          </h2>
          <p style={{ fontSize: "13px", color: "#64748b" }}>Manage teaching staff and allocate roles</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{ display: "flex", alignItems: "center", gap: "8px", background: "#4f46e5", color: "#fff", padding: "10px 16px", borderRadius: "8px", fontWeight: "700" }}
        >
          <Plus size={18} />
          <span>Add Staff Member</span>
        </button>
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
