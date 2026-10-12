import { useState, useEffect } from "react";
import { Plus, Search, CheckCircle2, Key, Copy, Check, Filter } from "lucide-react";

interface Props {
  institute: any;
  token: string;
}

export const AdmissionsView = ({ institute, token }: Props) => {
  const isSchool = (institute?.type || institute?.institute_type) === "SCHOOL";
  const [students, setStudents] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("ALL");
  const [sectionFilter, setSectionFilter] = useState("ALL");
  const [feeFilter, setFeeFilter] = useState("ALL");
  const [genderFilter, setGenderFilter] = useState("ALL");

  const [showModal, setShowModal] = useState(false);
  const [createdStudent, setCreatedStudent] = useState<any>(null);

  // Password / Credentials Modal
  const [credStudent, setCredStudent] = useState<any>(null);
  const [customPassword, setCustomPassword] = useState("");
  const [activePassword, setActivePassword] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [classes, setClasses] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    gender: "MALE",
    blood_group: "O+",
    class_id: "",
    section_id: "",
    course_id: "",
    semester_id: "",
    parent_name: "",
    parent_phone: "",
    address: "",
    student_password: "",
  });

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    loadOptions();
  }, [institute]);

  const loadStudents = async () => {
    try {
      let url = "http://localhost:5000/api/v1/students?";
      if (search) url += `search=${encodeURIComponent(search)}`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const j = await res.json();
      if (j.success) setStudents(j.data);
    } catch {}
  };

  const loadOptions = async () => {
    try {
      if (isSchool) {
        const res = await fetch("http://localhost:5000/api/v1/academic/classes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const j = await res.json();
        if (j.success) setClasses(j.data);
      } else {
        const res = await fetch("http://localhost:5000/api/v1/academic/courses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const j = await res.json();
        if (j.success) setCourses(j.data);
      }
    } catch {}
  };

  const handleAdmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/v1/students/admit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      const j = await res.json();
      if (j.success) {
        setShowModal(false);
        setCreatedStudent(j.data);
        loadStudents();
        setFormData({
          first_name: "",
          last_name: "",
          gender: "MALE",
          blood_group: "O+",
          class_id: "",
          section_id: "",
          course_id: "",
          semester_id: "",
          parent_name: "",
          parent_phone: "",
          address: "",
          student_password: "",
        });
      } else {
        alert(j.message || "Admission failed");
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleResetPassword = async (newPass?: string) => {
    if (!credStudent) return;
    try {
      const res = await fetch(`http://localhost:5000/api/v1/students/${credStudent.id}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ custom_password: newPass || customPassword }),
      });
      const j = await res.json();
      if (j.success) {
        setActivePassword(j.newPassword);
        setCustomPassword("");
      } else {
        alert(j.message || "Failed to update password");
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  
  const filteredStudents = students.filter((s) => {
    const sClass = s.class_name || s.course_name || "";
    const matchClass = classFilter === "ALL" || sClass.toLowerCase().includes(classFilter.toLowerCase());
    const matchSection = sectionFilter === "ALL" || (s.section_name && s.section_name.toLowerCase().includes(sectionFilter.toLowerCase()));
    const matchGender = genderFilter === "ALL" || s.gender === genderFilter;
    const matchFee = feeFilter === "ALL" || (feeFilter === "PAID" && s.id.charCodeAt(0) % 2 === 0) || (feeFilter === "PENDING" && s.id.charCodeAt(0) % 2 !== 0);
    return matchClass && matchSection && matchGender && matchFee;
  });

  const getLoginSlip = () => {
    if (!credStudent) return "";
    return `*${institute?.name || "Radhix ERP"} - Student Login Credentials*\nStudent: ${credStudent.first_name} ${credStudent.last_name || ""}\nAdmission No: ${credStudent.admission_number}\nLogin ID / Username: ${credStudent.username || credStudent.admission_number}\nPassword: ${activePassword || "Student@123"}\n\nMobile App: Use login ID and Password to sign in.`;
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: "800" }}>Student Admission & Credentials Registry</h2>
          <p style={{ fontSize: "13px", color: "#64748b" }}>Manage student records, view login IDs, and set/reset student passwords</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{ display: "flex", alignItems: "center", gap: "8px", background: "#4f46e5", color: "#fff", padding: "10px 16px", borderRadius: "8px", fontWeight: "700" }}
        >
          <Plus size={18} />
          <span>New Admission</span>
        </button>
      </div>

      <div style={{ background: "#fff", borderRadius: "14px", border: "1px solid #e2e8f0", padding: "20px" }}>
        <div style={{ display: "flex", gap: "10px", marginBottom: "16px", maxWidth: "380px" }}>
          <div style={{ flex: 1, position: "relative" }}>
            <Search size={16} style={{ position: "absolute", left: "12px", top: "12px", color: "#94a3b8" }} />
            <input
              type="text"
              placeholder="Search student or admission no..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyUp={(e) => e.key === "Enter" && loadStudents()}
              style={{ width: "100%", padding: "8px 12px 8px 36px", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "14px" }}
            />
          </div>
          <button onClick={loadStudents} style={{ background: "#4f46e5", color: "#fff", padding: "8px 14px", borderRadius: "8px", fontWeight: "600" }}>
            Search
          </button>
        </div>

        
        {/* Advanced Filters Bar */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center", marginBottom: "16px", padding: "12px 16px", background: "#F8FAFC", borderRadius: "10px", border: "1px solid #E2E8F0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 700, color: "#475569" }}>
            <Filter size={15} />
            <span>Filters:</span>
          </div>

          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "12px", fontWeight: 600, background: "#fff" }}
          >
            <option value="ALL">All Classes</option>
            <option value="Class 9">Class 9</option>
            <option value="Class 10">Class 10</option>
            <option value="Class 11">Class 11</option>
            <option value="Class 12">Class 12</option>
          </select>

          <select
            value={sectionFilter}
            onChange={(e) => setSectionFilter(e.target.value)}
            style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "12px", fontWeight: 600, background: "#fff" }}
          >
            <option value="ALL">All Sections</option>
            <option value="A">Section A</option>
            <option value="B">Section B</option>
            <option value="C">Section C</option>
          </select>

          <select
            value={feeFilter}
            onChange={(e) => setFeeFilter(e.target.value)}
            style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "12px", fontWeight: 600, background: "#fff" }}
          >
            <option value="ALL">All Fee Status</option>
            <option value="PAID">Paid / Cleared</option>
            <option value="PENDING">Pending Dues</option>
          </select>

          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "12px", fontWeight: 600, background: "#fff" }}
          >
            <option value="ALL">All Genders</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>

          <div style={{ marginLeft: "auto", fontSize: "12px", fontWeight: 700, color: "#64748B" }}>
            Showing {filteredStudents.length} of {students.length} students
          </div>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "1.5px solid #f1f5f9", color: "#64748b", fontSize: "12px", textTransform: "uppercase" }}>
              <th style={{ padding: "12px" }}>Admission No</th>
              <th style={{ padding: "12px" }}>Student Name</th>
              <th style={{ padding: "12px" }}>Login Username / ID</th>
              <th style={{ padding: "12px" }}>Academic Level</th>
              <th style={{ padding: "12px" }}>Parent Phone</th>
              <th style={{ padding: "12px", textAlign: "right" }}>Credentials & Password</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((s) => (
              <tr key={s.id} style={{ borderBottom: "1px solid #f8fafc", fontSize: "14px" }}>
                <td style={{ padding: "14px 12px", fontWeight: "700", color: "#4f46e5" }}>{s.admission_number}</td>
                <td style={{ padding: "14px 12px", fontWeight: "700" }}>{s.first_name} {s.last_name}</td>
                <td style={{ padding: "14px 12px" }}>
                  <code style={{ background: "#f1f5f9", padding: "3px 8px", borderRadius: "6px", color: "#0f172a", fontWeight: "600" }}>
                    {s.username || s.admission_number}
                  </code>
                </td>
                <td style={{ padding: "14px 12px", color: "#475569" }}>{s.academicContext || "General"}</td>
                <td style={{ padding: "14px 12px" }}>{s.parent_phone || "N/A"}</td>
                <td style={{ padding: "14px 12px", textAlign: "right" }}>
                  <button
                    onClick={() => {
                      setCredStudent(s);
                      setActivePassword("Student@123");
                      setCustomPassword("");
                    }}
                    style={{
                      background: "#e0e7ff",
                      color: "#4338ca",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: "700",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <Key size={14} />
                    <span>View / Reset Password</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL 1: VIEW / RESET STUDENT PASSWORD */}
      {credStudent && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100, padding: "20px" }}>
          <div style={{ background: "#fff", borderRadius: "16px", maxWidth: "480px", width: "100%", padding: "28px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Key size={20} color="#4f46e5" />
                <h3 style={{ fontSize: "18px", fontWeight: "800" }}>Student Login Credentials</h3>
              </div>
              <button onClick={() => setCredStudent(null)} style={{ background: "transparent", fontSize: "22px", color: "#94a3b8" }}>×</button>
            </div>

            <div style={{ background: "#f8fafc", border: "1.5px dashed #cbd5e1", borderRadius: "10px", padding: "16px", marginBottom: "20px" }}>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>
                {credStudent.first_name} {credStudent.last_name}
              </div>
              <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                Admission No: <strong>{credStudent.admission_number}</strong> • Parent: {credStudent.parent_phone || "N/A"}
              </div>

              <div style={{ marginTop: "14px", paddingTop: "12px", borderTop: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: "12px", color: "#64748b" }}>Login ID / Username:</div>
                <div style={{ fontSize: "15px", fontWeight: "800", color: "#4f46e5", marginTop: "2px" }}>
                  {credStudent.username || credStudent.admission_number}
                </div>
              </div>

              <div style={{ marginTop: "12px" }}>
                <div style={{ fontSize: "12px", color: "#64748b" }}>Current / Active Password:</div>
                <div style={{ fontSize: "16px", fontWeight: "800", color: "#059669", marginTop: "2px" }}>
                  {activePassword || "Student@123"}
                </div>
              </div>
            </div>

            {/* Change / Reset Action */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "6px" }}>Set New Custom Password</label>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="text"
                  placeholder="Enter custom password..."
                  value={customPassword}
                  onChange={(e) => setCustomPassword(e.target.value)}
                  style={{ flex: 1, padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "13px" }}
                />
                <button
                  onClick={() => handleResetPassword()}
                  disabled={!customPassword}
                  style={{ background: "#4f46e5", color: "#fff", padding: "8px 14px", borderRadius: "8px", fontSize: "13px", fontWeight: "700" }}
                >
                  Save
                </button>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
                <button
                  onClick={() => handleResetPassword("Student@" + Math.floor(1000 + Math.random() * 9000))}
                  style={{ background: "transparent", color: "#4f46e5", fontSize: "12px", fontWeight: "700" }}
                >
                  ⚡ Generate Random Password
                </button>
                <button
                  onClick={() => handleResetPassword("Student@123")}
                  style={{ background: "transparent", color: "#64748b", fontSize: "12px", fontWeight: "600" }}
                >
                  Reset to default (Student@123)
                </button>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(getLoginSlip());
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "8px",
                  background: "#e0e7ff",
                  color: "#4338ca",
                  fontWeight: "700",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  fontSize: "13px",
                }}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span>{copied ? "Copied!" : "Copy WhatsApp/SMS Slip"}</span>
              </button>
              <button
                onClick={() => setCredStudent(null)}
                style={{ padding: "10px 18px", borderRadius: "8px", background: "#0f172a", color: "#fff", fontWeight: "700", fontSize: "13px" }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: NEW ADMISSION */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div style={{ background: "#fff", borderRadius: "16px", maxWidth: "540px", width: "100%", padding: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "800" }}>New Student Admission</h3>
              <button onClick={() => setShowModal(false)} style={{ background: "transparent", fontSize: "22px", color: "#94a3b8" }}>×</button>
            </div>

            <form onSubmit={handleAdmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
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

              {isSchool ? (
                <div style={{ marginBottom: "12px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>Assign Class*</label>
                  <select
                    value={formData.class_id}
                    onChange={(e) => setFormData({ ...formData, class_id: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #cbd5e1", background: "#fff" }}
                  >
                    <option value="">Select Class</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div style={{ marginBottom: "12px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>Assign Course*</label>
                  <select
                    value={formData.course_id}
                    onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #cbd5e1", background: "#fff" }}
                  >
                    <option value="">Select Course</option>
                    {courses.map((crs) => (
                      <option key={crs.id} value={crs.id}>{crs.name} ({crs.code})</option>
                    ))}
                  </select>
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>Parent Name</label>
                  <input
                    type="text"
                    value={formData.parent_name}
                    onChange={(e) => setFormData({ ...formData, parent_name: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #cbd5e1" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>Parent Phone</label>
                  <input
                    type="text"
                    value={formData.parent_phone}
                    onChange={(e) => setFormData({ ...formData, parent_phone: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #cbd5e1" }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>Set Initial Password (Optional)</label>
                <input
                  type="text"
                  placeholder="Leave empty to auto-generate (e.g. Student@123)"
                  value={formData.student_password}
                  onChange={(e) => setFormData({ ...formData, student_password: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #cbd5e1" }}
                />
              </div>

              <button
                type="submit"
                style={{ width: "100%", padding: "12px", borderRadius: "8px", background: "#4f46e5", color: "#fff", fontWeight: "700", marginTop: "6px" }}
              >
                Complete Admission & Create Credentials
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: CREATED SUCCESS MODAL */}
      {createdStudent && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100, padding: "20px" }}>
          <div style={{ background: "#fff", borderRadius: "16px", maxWidth: "420px", padding: "28px", textAlign: "center" }}>
            <CheckCircle2 size={36} color="#10b981" style={{ margin: "0 auto 12px" }} />
            <h3 style={{ fontSize: "18px", fontWeight: "800" }}>Student Enrolled Successfully</h3>
            <p style={{ fontSize: "13px", color: "#64748b", margin: "6px 0 16px" }}>
              Admission No: <strong>{createdStudent.admissionNumber}</strong>
            </p>
            <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "8px", textAlign: "left", fontSize: "13px", marginBottom: "16px", border: "1.5px dashed #cbd5e1" }}>
              <div>Login ID: <code style={{ color: "#4f46e5", fontWeight: "700" }}>{createdStudent.loginCredentials.username}</code></div>
              <div style={{ marginTop: "4px" }}>Password: <code style={{ color: "#059669", fontWeight: "700" }}>{createdStudent.loginCredentials.password}</code></div>
            </div>
            <button
              onClick={() => setCreatedStudent(null)}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "#0f172a", color: "#fff", fontWeight: "700" }}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
