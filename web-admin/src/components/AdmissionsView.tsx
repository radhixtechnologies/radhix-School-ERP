import { useState, useEffect } from "react";
import { SchoolPrintHeader } from "./SchoolPrintHeader";
import {
  Plus,
  Search,
  CheckCircle2,
  Key,
  Copy,
  Check,
  Filter,
  UserCheck,
  FileText,
  Upload,
  ArrowRight,
  ArrowLeft,
  School,
  GraduationCap,
  X,
  ShieldCheck,
  FolderOpen,
  Eye,
  Trash2,
  Printer,
  Download,
  AlertCircle,
  FileCheck,
  User,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Building,
  Award,
  CheckCircle,
  Mail,
  Hash
} from "lucide-react";

interface Props {
  institute: any;
  token: string;
  onNavigateTab?: (tab: string) => void;
}

export interface UploadedDocItem {
  fileName: string;
  fileSize: string;
  dataUrl: string;
  fileType: string;
  uploadedAt: string;
}

export const AdmissionsView = ({ institute, token, onNavigateTab }: Props) => {
  const isSchool = (institute?.type || institute?.institute_type) === "SCHOOL";
  const [students, setStudents] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("ALL");
  const [sectionFilter, setSectionFilter] = useState("ALL");
  const [feeFilter, setFeeFilter] = useState("ALL");
  const [genderFilter, setGenderFilter] = useState("ALL");

  const [showModal, setShowModal] = useState(false);
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3 | 4>(1);
  const [createdStudent, setCreatedStudent] = useState<any>(null);
  const [selectedStudentDetails, setSelectedStudentDetails] = useState<any | null>(null);

  // Document Upload & Preview State
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, UploadedDocItem>>({});
  const [viewingDoc, setViewingDoc] = useState<{ title: string; doc: UploadedDocItem } | null>(null);

  // Validation Errors State
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Password / Credentials Modal
  const [credStudent, setCredStudent] = useState<any>(null);
  const [customPassword, setCustomPassword] = useState("");
  const [activePassword, setActivePassword] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [classes, setClasses] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);

  const initialFormData = {
    first_name: "",
    last_name: "",
    gender: "MALE",
    blood_group: "O+",
    dob: "2018-04-15",
    category: "GENERAL",
    class_id: "",
    section_id: "",
    course_id: "",
    semester_id: "",
    parent_name: "",
    parent_phone: "",
    address: "",
    student_password: "",
    father_name: "",
    mother_name: "",
    father_occupation: "",
    mother_occupation: "",
    student_aadhaar: "",
    admission_type: "FRESHER" as "FRESHER" | "TRANSFER",
    previous_school: "",
    previous_board: "CBSE",
    previous_class: "",
    previous_tc_number: "",
    tc_issue_date: "",
    documents_json: {
      aadhaar_card: false,
      birth_certificate: false,
      student_photo: false,
      previous_tc: false,
      previous_marksheet: false,
      parent_id_proof: false,
    }
  };

  const [formData, setFormData] = useState(initialFormData);

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

  const handleDocFileUpload = (docKey: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = (e.target?.result as string) || "";
      const sizeKb = (file.size / 1024).toFixed(1) + " KB";
      setUploadedDocs((prev) => ({
        ...prev,
        [docKey]: {
          fileName: file.name,
          fileSize: sizeKb,
          dataUrl,
          fileType: file.type || (file.name.endsWith(".pdf") ? "application/pdf" : "image/jpeg"),
          uploadedAt: new Date().toLocaleTimeString(),
        },
      }));
      setFormData((prev) => ({
        ...prev,
        documents_json: {
          ...prev.documents_json,
          [docKey]: true,
        },
      }));
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[docKey];
        delete next.documents;
        return next;
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveDoc = (docKey: string) => {
    setUploadedDocs((prev) => {
      const next = { ...prev };
      delete next[docKey];
      return next;
    });
    setFormData((prev) => ({
      ...prev,
      documents_json: {
        ...prev.documents_json,
        [docKey]: false,
      },
    }));
  };

  const validateStep = (step: number): boolean => {
    const errs: Record<string, string> = {};

    if (step === 1) {
      if (!formData.first_name.trim()) {
        errs.first_name = "Student first name is mandatory.";
      } else if (formData.first_name.trim().length < 2) {
        errs.first_name = "Student first name must contain at least 2 characters.";
      }

      if (!formData.dob) {
        errs.dob = "Official Date of Birth is required.";
      }

      const cleanAadhaar = formData.student_aadhaar.replace(/\D/g, "");
      if (!formData.student_aadhaar.trim()) {
        errs.student_aadhaar = "National Aadhaar number (12 digits) is required.";
      } else if (cleanAadhaar.length !== 12) {
        errs.student_aadhaar = "Aadhaar number must contain exactly 12 numeric digits (e.g. 4829-1920-5512).";
      }

      if (isSchool && !formData.class_id) {
        errs.class_id = "Please select an admission class / standard.";
      } else if (!isSchool && !formData.course_id) {
        errs.course_id = "Please select an academic course.";
      }
    }

    if (step === 2) {
      if (!formData.father_name.trim()) {
        errs.father_name = "Father's full name is required.";
      }
      if (!formData.mother_name.trim()) {
        errs.mother_name = "Mother's full name is required.";
      }

      const cleanPhone = formData.parent_phone.replace(/\D/g, "");
      if (!formData.parent_phone.trim()) {
        errs.parent_phone = "Primary parent / guardian contact number is mandatory.";
      } else if (cleanPhone.length !== 10 && !(cleanPhone.length === 12 && cleanPhone.startsWith("91"))) {
        errs.parent_phone = "Please enter a valid 10-digit mobile number (e.g. 9811234567).";
      }

      if (!formData.address.trim()) {
        errs.address = "Permanent residential address is mandatory.";
      } else if (formData.address.trim().length < 5) {
        errs.address = "Please enter a complete residential address (min 5 characters).";
      }
    }

    if (step === 3) {
      if (formData.admission_type === "TRANSFER") {
        if (!formData.previous_school.trim()) {
          errs.previous_school = "Previous institution name is mandatory for transfer students.";
        }
        if (!formData.previous_tc_number.trim()) {
          errs.previous_tc_number = "Transfer Certificate (TC / SLC) number is mandatory.";
        }
      }
    }

    if (step === 4) {
      if (formData.admission_type === "FRESHER") {
        if (!uploadedDocs["aadhaar_card"]) {
          errs.documents = "Please upload the Student Aadhaar Card copy.";
        } else if (!uploadedDocs["birth_certificate"]) {
          errs.documents = "Please upload the Municipal Birth Certificate proof.";
        }
      } else {
        if (!uploadedDocs["previous_tc"]) {
          errs.documents = "Original Transfer Certificate (TC / SLC) copy upload is mandatory.";
        } else if (!uploadedDocs["previous_marksheet"]) {
          errs.documents = "Please upload the previous class academic marksheet / report card.";
        }
      }
    }

    setValidationErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAdmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(1) || !validateStep(2) || !validateStep(3) || !validateStep(4)) {
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/v1/students/admit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      const j = await res.json();
      if (j.success) {
        setShowModal(false);
        setWizardStep(1);
        const admittedPayload = {
          ...j.data,
          fullDetails: {
            ...formData,
            id: j.data?.studentId,
            admission_number: j.data?.admissionNumber || formData.first_name,
            username: j.data?.loginCredentials?.username,
            password: j.data?.loginCredentials?.password,
            academicContext: isSchool 
              ? (classes.find(c => c.id === formData.class_id)?.name || "Class Enrolled")
              : (courses.find(c => c.id === formData.course_id)?.name || "Course Enrolled"),
            uploadedDocsSummary: { ...uploadedDocs }
          }
        };
        setCreatedStudent(admittedPayload);
        loadStudents();
        setFormData(initialFormData);
        setUploadedDocs({});
        setValidationErrors({});
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
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab("counsellor")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "#F0FDF4",
                color: "#166534",
                border: "1.5px solid #BBF7D0",
                padding: "10px 16px",
                borderRadius: "10px",
                fontWeight: "800",
                fontSize: "13px",
                cursor: "pointer"
              }}
            >
              <UserCheck size={16} color="#166534" />
              <span>Admission Counselling Hub</span>
            </button>
          )}

          <button
            onClick={() => {
              setWizardStep(1);
              setShowModal(true);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "#3D5EE1",
              color: "#fff",
              padding: "10px 18px",
              borderRadius: "10px",
              fontWeight: "800",
              fontSize: "13px",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(61, 94, 225, 0.25)"
            }}
          >
            <Plus size={18} />
            <span>+ 4-Step Student Admission</span>
          </button>
        </div>
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
              <th style={{ padding: "12px", textAlign: "right" }}>Actions & Dossier</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((s) => (
              <tr key={s.id} style={{ borderBottom: "1px solid #f8fafc", fontSize: "14px" }}>
                <td style={{ padding: "14px 12px", fontWeight: "700" }}>
                  <button
                    onClick={() => setSelectedStudentDetails(s)}
                    style={{ background: "none", border: "none", padding: 0, fontWeight: "800", color: "#3D5EE1", cursor: "pointer", fontFamily: "monospace", fontSize: "14px", textDecoration: "underline" }}
                    title="Click to view complete admission dossier"
                  >
                    {s.admission_number}
                  </button>
                </td>
                <td style={{ padding: "14px 12px", fontWeight: "700" }}>
                  <button
                    onClick={() => setSelectedStudentDetails(s)}
                    style={{ background: "none", border: "none", padding: 0, fontWeight: "800", color: "#0F172A", cursor: "pointer", fontSize: "14px", textAlign: "left" }}
                    title="Click to view complete admission dossier"
                  >
                    {s.first_name} {s.last_name}
                  </button>
                </td>
                <td style={{ padding: "14px 12px" }}>
                  <code style={{ background: "#f1f5f9", padding: "3px 8px", borderRadius: "6px", color: "#0f172a", fontWeight: "600" }}>
                    {s.username || s.admission_number}
                  </code>
                </td>
                <td style={{ padding: "14px 12px", color: "#475569" }}>{s.academicContext || "General"}</td>
                <td style={{ padding: "14px 12px" }}>{s.parent_phone || "N/A"}</td>
                <td style={{ padding: "14px 12px", textAlign: "right" }}>
                  <div style={{ display: "inline-flex", gap: "8px", alignItems: "center" }}>
                    <button
                      onClick={() => setSelectedStudentDetails(s)}
                      style={{
                        background: "#3D5EE1",
                        color: "#FFFFFF",
                        padding: "6px 12px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: "700",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                        border: "none",
                        cursor: "pointer",
                        boxShadow: "0 2px 6px rgba(61,94,225,0.25)"
                      }}
                      title="View complete student admission dossier"
                    >
                      <Eye size={13} />
                      <span>View Dossier</span>
                    </button>
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
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: "700",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                        border: "none",
                        cursor: "pointer"
                      }}
                    >
                      <Key size={13} />
                      <span>Password</span>
                    </button>
                  </div>
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

      {/* MODAL 2: 4-STEP STUDENT ADMISSION WIZARD */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.65)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div style={{ background: "#fff", borderRadius: "20px", maxWidth: "760px", width: "100%", maxHeight: "90vh", display: "flex", flexDirection: "column", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.35)", overflow: "hidden" }}>
            {/* Modal Header */}
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #E2E8F0", background: "linear-gradient(135deg, #3D5EE1 0%, #2A46C4 100%)", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: "900", margin: "0 0 4px 0" }}>
                  4-Step Student Admission Wizard
                </h3>
                <p style={{ margin: 0, fontSize: "12px", opacity: 0.9 }}>
                  Basic Info • Parents Details • Academic TC History • Document Verification
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Stepper Progress Indicator */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
              {[
                { s: 1, label: "1. Basic Details", desc: "Identity & Class" },
                { s: 2, label: "2. Parents & Family", desc: "Mother/Father Info" },
                { s: 3, label: "3. Academic & TC", desc: "Fresher / Transfer" },
                { s: 4, label: "4. Documents & Auth", desc: "Uploads & Password" }
              ].map(item => (
                <div
                  key={item.s}
                  onClick={() => {
                    if (item.s > wizardStep) {
                      if (!validateStep(wizardStep)) return;
                    }
                    setWizardStep(item.s as any);
                  }}
                  style={{
                    padding: "12px 14px",
                    borderBottom: `3px solid ${wizardStep === item.s ? "#3D5EE1" : wizardStep > item.s ? "#10B981" : "transparent"}`,
                    background: wizardStep === item.s ? "#FFFFFF" : "transparent",
                    cursor: "pointer",
                    textAlign: "center"
                  }}
                >
                  <div style={{ fontSize: "12px", fontWeight: 800, color: wizardStep === item.s ? "#3D5EE1" : wizardStep > item.s ? "#10B981" : "#64748B" }}>
                    {wizardStep > item.s ? "✓ " : ""}{item.label}
                  </div>
                  <div style={{ fontSize: "10px", color: "#94A3B8" }}>{item.desc}</div>
                </div>
              ))}
            </div>

            {/* Top Validation Alert Banner if errors exist */}
            {Object.keys(validationErrors).length > 0 && (
              <div style={{ margin: "16px 24px 0 24px", background: "#FEF2F2", border: "1.5px solid #FCA5A5", borderRadius: "10px", padding: "10px 14px", display: "flex", alignItems: "center", gap: "10px", color: "#991B1B", fontSize: "12px", fontWeight: 700 }}>
                <AlertCircle size={18} color="#DC2626" />
                <span>Please resolve all highlighted validation errors below before proceeding.</span>
              </div>
            )}

            {/* Wizard Form Body */}
            <form onSubmit={handleAdmit} style={{ padding: "24px", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* STEP 1: Basic Identity & Class */}
              {wizardStep === 1 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ fontSize: "13px", fontWeight: 800, color: "#334155", display: "flex", alignItems: "center", gap: "6px" }}>
                    <GraduationCap size={16} color="#3D5EE1" />
                    <span>Step 1: Student Identity & Academic Class Allocation</span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>First Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. Aarav"
                        value={formData.first_name}
                        onChange={(e) => {
                          setFormData({ ...formData, first_name: e.target.value });
                          if (validationErrors.first_name) {
                            setValidationErrors({ ...validationErrors, first_name: "" });
                          }
                        }}
                        style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: validationErrors.first_name ? "1.5px solid #EF4444" : "1px solid #CBD5E1", fontSize: "13px" }}
                      />
                      {validationErrors.first_name && (
                        <span style={{ color: "#EF4444", fontSize: "11px", fontWeight: 700, marginTop: "4px", display: "block" }}>
                          ⚠️ {validationErrors.first_name}
                        </span>
                      )}
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>Last Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Sharma"
                        value={formData.last_name}
                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                        style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px" }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>Date of Birth (DOB) *</label>
                      <input
                        type="date"
                        value={formData.dob}
                        onChange={(e) => {
                          setFormData({ ...formData, dob: e.target.value });
                          if (validationErrors.dob) setValidationErrors({ ...validationErrors, dob: "" });
                        }}
                        style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: validationErrors.dob ? "1.5px solid #EF4444" : "1px solid #CBD5E1", fontSize: "13px" }}
                      />
                      {validationErrors.dob && (
                        <span style={{ color: "#EF4444", fontSize: "11px", fontWeight: 700, marginTop: "4px", display: "block" }}>
                          ⚠️ {validationErrors.dob}
                        </span>
                      )}
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>Gender *</label>
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", background: "#fff" }}
                      >
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>Student National Aadhaar Number *</label>
                      <input
                        type="text"
                        maxLength={14}
                        placeholder="12-digit Aadhaar (e.g. 4829-1920-5512)"
                        value={formData.student_aadhaar}
                        onChange={(e) => {
                          setFormData({ ...formData, student_aadhaar: e.target.value });
                          if (validationErrors.student_aadhaar) setValidationErrors({ ...validationErrors, student_aadhaar: "" });
                        }}
                        style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: validationErrors.student_aadhaar ? "1.5px solid #EF4444" : "1px solid #CBD5E1", fontSize: "13px" }}
                      />
                      {validationErrors.student_aadhaar && (
                        <span style={{ color: "#EF4444", fontSize: "11px", fontWeight: 700, marginTop: "4px", display: "block" }}>
                          ⚠️ {validationErrors.student_aadhaar}
                        </span>
                      )}
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", background: "#fff" }}
                      >
                        <option value="GENERAL">General</option>
                        <option value="OBC">OBC</option>
                        <option value="SC">SC</option>
                        <option value="ST">ST</option>
                        <option value="EWS">EWS</option>
                      </select>
                    </div>

                    <div style={{ gridColumn: "1 / -1" }}>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>
                        Assign Class / Grade *
                      </label>
                      {isSchool ? (
                        <select
                          value={formData.class_id}
                          onChange={(e) => {
                            setFormData({ ...formData, class_id: e.target.value });
                            if (validationErrors.class_id) setValidationErrors({ ...validationErrors, class_id: "" });
                          }}
                          style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: validationErrors.class_id ? "1.5px solid #EF4444" : "1px solid #CBD5E1", fontSize: "13px", background: "#fff" }}
                        >
                          <option value="">-- Select Class / Grade --</option>
                          {classes.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      ) : (
                        <select
                          value={formData.course_id}
                          onChange={(e) => {
                            setFormData({ ...formData, course_id: e.target.value });
                            if (validationErrors.course_id) setValidationErrors({ ...validationErrors, course_id: "" });
                          }}
                          style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: validationErrors.course_id ? "1.5px solid #EF4444" : "1px solid #CBD5E1", fontSize: "13px", background: "#fff" }}
                        >
                          <option value="">-- Select Academic Course --</option>
                          {courses.map((crs) => (
                            <option key={crs.id} value={crs.id}>{crs.name} ({crs.code})</option>
                          ))}
                        </select>
                      )}
                      {(validationErrors.class_id || validationErrors.course_id) && (
                        <span style={{ color: "#EF4444", fontSize: "11px", fontWeight: 700, marginTop: "4px", display: "block" }}>
                          ⚠️ {validationErrors.class_id || validationErrors.course_id}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Parents & Guardian Details */}
              {wizardStep === 2 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ fontSize: "13px", fontWeight: 800, color: "#334155", display: "flex", alignItems: "center", gap: "6px" }}>
                    <ShieldCheck size={16} color="#3D5EE1" />
                    <span>Step 2: Parents & Guardian Information</span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>Father's Full Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. Rajesh Sharma"
                        value={formData.father_name}
                        onChange={(e) => {
                          setFormData({ ...formData, father_name: e.target.value, parent_name: e.target.value });
                          if (validationErrors.father_name) setValidationErrors({ ...validationErrors, father_name: "" });
                        }}
                        style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: validationErrors.father_name ? "1.5px solid #EF4444" : "1px solid #CBD5E1", fontSize: "13px" }}
                      />
                      {validationErrors.father_name && (
                        <span style={{ color: "#EF4444", fontSize: "11px", fontWeight: 700, marginTop: "4px", display: "block" }}>
                          ⚠️ {validationErrors.father_name}
                        </span>
                      )}
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>Father's Occupation</label>
                      <input
                        type="text"
                        placeholder="e.g. Business / Civil Engineer"
                        value={formData.father_occupation}
                        onChange={(e) => setFormData({ ...formData, father_occupation: e.target.value })}
                        style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px" }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>Mother's Full Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. Sunita Sharma"
                        value={formData.mother_name}
                        onChange={(e) => {
                          setFormData({ ...formData, mother_name: e.target.value });
                          if (validationErrors.mother_name) setValidationErrors({ ...validationErrors, mother_name: "" });
                        }}
                        style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: validationErrors.mother_name ? "1.5px solid #EF4444" : "1px solid #CBD5E1", fontSize: "13px" }}
                      />
                      {validationErrors.mother_name && (
                        <span style={{ color: "#EF4444", fontSize: "11px", fontWeight: 700, marginTop: "4px", display: "block" }}>
                          ⚠️ {validationErrors.mother_name}
                        </span>
                      )}
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>Mother's Occupation</label>
                      <input
                        type="text"
                        placeholder="e.g. Teacher / Homemaker"
                        value={formData.mother_occupation}
                        onChange={(e) => setFormData({ ...formData, mother_occupation: e.target.value })}
                        style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px" }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>Primary Contact Mobile Number *</label>
                      <input
                        type="text"
                        maxLength={13}
                        placeholder="e.g. 9811234567"
                        value={formData.parent_phone}
                        onChange={(e) => {
                          setFormData({ ...formData, parent_phone: e.target.value });
                          if (validationErrors.parent_phone) setValidationErrors({ ...validationErrors, parent_phone: "" });
                        }}
                        style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: validationErrors.parent_phone ? "1.5px solid #EF4444" : "1px solid #CBD5E1", fontSize: "13px" }}
                      />
                      {validationErrors.parent_phone && (
                        <span style={{ color: "#EF4444", fontSize: "11px", fontWeight: 700, marginTop: "4px", display: "block" }}>
                          ⚠️ {validationErrors.parent_phone}
                        </span>
                      )}
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>Blood Group</label>
                      <select
                        value={formData.blood_group}
                        onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })}
                        style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", background: "#fff" }}
                      >
                        <option value="A+">A+</option>
                        <option value="B+">B+</option>
                        <option value="O+">O+</option>
                        <option value="AB+">AB+</option>
                        <option value="A-">A-</option>
                        <option value="B-">B-</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>

                    <div style={{ gridColumn: "1 / -1" }}>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>Permanent Residential Address *</label>
                      <input
                        type="text"
                        placeholder="House / Flat No, Street, Colony, City & PIN Code"
                        value={formData.address}
                        onChange={(e) => {
                          setFormData({ ...formData, address: e.target.value });
                          if (validationErrors.address) setValidationErrors({ ...validationErrors, address: "" });
                        }}
                        style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: validationErrors.address ? "1.5px solid #EF4444" : "1px solid #CBD5E1", fontSize: "13px" }}
                      />
                      {validationErrors.address && (
                        <span style={{ color: "#EF4444", fontSize: "11px", fontWeight: 700, marginTop: "4px", display: "block" }}>
                          ⚠️ {validationErrors.address}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Previous Academic History & TC */}
              {wizardStep === 3 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ fontSize: "13px", fontWeight: 800, color: "#334155", display: "flex", alignItems: "center", gap: "6px" }}>
                    <FileText size={16} color="#3D5EE1" />
                    <span>Step 3: Previous Academic History & Transfer Certificate (TC)</span>
                  </div>

                  {/* Admission Type Selection */}
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "6px" }}>Admission Category / Type *</label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div
                        onClick={() => setFormData({ ...formData, admission_type: "FRESHER" })}
                        style={{
                          border: `2px solid ${formData.admission_type === "FRESHER" ? "#3D5EE1" : "#E2E8F0"}`,
                          background: formData.admission_type === "FRESHER" ? "#EFF6FF" : "#FFFFFF",
                          padding: "14px",
                          borderRadius: "12px",
                          cursor: "pointer"
                        }}
                      >
                        <div style={{ fontWeight: 800, fontSize: "13px", color: formData.admission_type === "FRESHER" ? "#3D5EE1" : "#0F172A" }}>
                          🌱 Fresh Admission
                        </div>
                        <div style={{ fontSize: "11px", color: "#64748B", marginTop: "4px" }}>
                          Pre-Nursery, Nursery, KG, or Class 1 first-time enrollment (No prior TC required)
                        </div>
                      </div>

                      <div
                        onClick={() => setFormData({ ...formData, admission_type: "TRANSFER" })}
                        style={{
                          border: `2px solid ${formData.admission_type === "TRANSFER" ? "#3D5EE1" : "#E2E8F0"}`,
                          background: formData.admission_type === "TRANSFER" ? "#EFF6FF" : "#FFFFFF",
                          padding: "14px",
                          borderRadius: "12px",
                          cursor: "pointer"
                        }}
                      >
                        <div style={{ fontWeight: 800, fontSize: "13px", color: formData.admission_type === "TRANSFER" ? "#3D5EE1" : "#0F172A" }}>
                          🔄 Transfer Student
                        </div>
                        <div style={{ fontSize: "11px", color: "#64748B", marginTop: "4px" }}>
                          Transfer from previous school; Transfer Certificate (TC) and previous report card required
                        </div>
                      </div>
                    </div>
                  </div>

                  {formData.admission_type === "FRESHER" ? (
                    <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: "12px", padding: "16px" }}>
                      <div style={{ fontWeight: 800, fontSize: "13px", color: "#166534", marginBottom: "4px" }}>
                        ✅ Fresher Admission Verified
                      </div>
                      <p style={{ margin: 0, fontSize: "12px", color: "#15803D" }}>
                        Transfer Certificate (TC) is exempt for first-time / fresher admissions. Please upload Birth Certificate and Aadhaar Card in the next step.
                      </p>
                    </div>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>Previous School Name *</label>
                        <input
                          type="text"
                          placeholder="e.g. St. Xavier Senior Secondary School"
                          value={formData.previous_school}
                          onChange={(e) => {
                            setFormData({ ...formData, previous_school: e.target.value });
                            if (validationErrors.previous_school) setValidationErrors({ ...validationErrors, previous_school: "" });
                          }}
                          style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: validationErrors.previous_school ? "1.5px solid #EF4444" : "1px solid #CBD5E1", fontSize: "13px" }}
                        />
                        {validationErrors.previous_school && (
                          <span style={{ color: "#EF4444", fontSize: "11px", fontWeight: 700, marginTop: "4px", display: "block" }}>
                            ⚠️ {validationErrors.previous_school}
                          </span>
                        )}
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>Previous Board</label>
                        <select
                          value={formData.previous_board}
                          onChange={(e) => setFormData({ ...formData, previous_board: e.target.value })}
                          style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", background: "#fff" }}
                        >
                          <option value="CBSE">CBSE (Central Board)</option>
                          <option value="ICSE">ICSE / CISCE</option>
                          <option value="STATE_BOARD">State Board</option>
                          <option value="IB">IB / Cambridge</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>Original Transfer Certificate (TC) Number *</label>
                        <input
                          type="text"
                          placeholder="e.g. TC/2026/8892"
                          value={formData.previous_tc_number}
                          onChange={(e) => {
                            setFormData({ ...formData, previous_tc_number: e.target.value });
                            if (validationErrors.previous_tc_number) setValidationErrors({ ...validationErrors, previous_tc_number: "" });
                          }}
                          style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: validationErrors.previous_tc_number ? "1.5px solid #EF4444" : "1px solid #CBD5E1", fontSize: "13px" }}
                        />
                        {validationErrors.previous_tc_number && (
                          <span style={{ color: "#EF4444", fontSize: "11px", fontWeight: 700, marginTop: "4px", display: "block" }}>
                            ⚠️ {validationErrors.previous_tc_number}
                          </span>
                        )}
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>TC Date of Issue</label>
                        <input
                          type="date"
                          value={formData.tc_issue_date}
                          onChange={(e) => setFormData({ ...formData, tc_issue_date: e.target.value })}
                          style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px" }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 4: Documents Upload & Login Password */}
              {wizardStep === 4 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ fontSize: "13px", fontWeight: 800, color: "#334155", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Upload size={16} color="#3D5EE1" />
                    <span>Step 4: Mandatory Document Upload & Verification Dossier</span>
                  </div>

                  {validationErrors.documents && (
                    <div style={{ background: "#FEF2F2", border: "1.5px solid #FCA5A5", borderRadius: "10px", padding: "10px 14px", color: "#DC2626", fontSize: "12px", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px" }}>
                      <AlertCircle size={16} />
                      <span>{validationErrors.documents}</span>
                    </div>
                  )}

                  <div style={{ background: "#F8FAFC", borderRadius: "12px", padding: "16px", border: "1px solid #E2E8F0" }}>
                    <div style={{ fontSize: "12px", fontWeight: 800, color: "#0F172A", marginBottom: "12px" }}>
                      {formData.admission_type === "FRESHER"
                        ? "🌱 Fresher Student Verification Documents (Upload Required Certificates):"
                        : "🔄 Transfer Student Verification Documents (Upload Transfer Certificate & Transcripts):"}
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      {(formData.admission_type === "FRESHER" ? [
                        { key: "aadhaar_card", label: "Student National Aadhaar Card / ID", required: true, icon: "🪪" },
                        { key: "birth_certificate", label: "Official Municipal Birth Certificate", required: true, icon: "👶" },
                        { key: "student_photo", label: "Recent Formal Passport Photograph", required: false, icon: "📸" },
                        { key: "parent_id_proof", label: "Parent / Guardian Photo ID Proof", required: false, icon: "🆔" },
                      ] : [
                        { key: "previous_tc", label: "Original Transfer Certificate (TC / SLC)", required: true, icon: "📜" },
                        { key: "previous_marksheet", label: "Prior Academic Year Report Card / Marksheet", required: true, icon: "📊" },
                        { key: "aadhaar_card", label: "Student National Aadhaar Card / ID", required: true, icon: "🪪" },
                        { key: "parent_id_proof", label: "Parent / Guardian Photo ID Proof", required: false, icon: "🆔" },
                      ]).map((doc) => {
                        const uploaded = uploadedDocs[doc.key];
                        return (
                          <div
                            key={doc.key}
                            style={{
                              background: uploaded ? "#F0FDF4" : "#FFFFFF",
                              border: `1.5px ${uploaded ? "solid #86EFAC" : "dashed #CBD5E1"}`,
                              borderRadius: "12px",
                              padding: "12px",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                              gap: "8px"
                            }}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                              <div>
                                <div style={{ fontSize: "12px", fontWeight: 800, color: "#0F172A", display: "flex", alignItems: "center", gap: "5px" }}>
                                  <span>{doc.icon}</span>
                                  <span>{doc.label}</span>
                                  {doc.required && <span style={{ color: "#EF4444" }}>*</span>}
                                </div>
                                <div style={{ fontSize: "11px", color: uploaded ? "#15803D" : "#64748B", marginTop: "2px", fontWeight: 600 }}>
                                  {uploaded ? `✔ ${uploaded.fileName} (${uploaded.fileSize})` : doc.required ? "Mandatory Upload (PDF / Image)" : "Optional"}
                                </div>
                              </div>
                              {uploaded && (
                                <span style={{ background: "#DCFCE7", color: "#166534", padding: "2px 8px", borderRadius: "6px", fontSize: "10px", fontWeight: 800 }}>
                                  UPLOADED
                                </span>
                              )}
                            </div>

                            <div style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "4px" }}>
                              {uploaded ? (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => setViewingDoc({ title: doc.label, doc: uploaded })}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "5px",
                                      background: "#3D5EE1",
                                      color: "#FFFFFF",
                                      border: "none",
                                      padding: "6px 12px",
                                      borderRadius: "6px",
                                      fontSize: "11px",
                                      fontWeight: 800,
                                      cursor: "pointer",
                                      boxShadow: "0 2px 6px rgba(61, 94, 225, 0.25)"
                                    }}
                                  >
                                    <Eye size={13} /> View Document
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveDoc(doc.key)}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "4px",
                                      background: "#FEF2F2",
                                      color: "#DC2626",
                                      border: "1px solid #FECACA",
                                      padding: "5px 10px",
                                      borderRadius: "6px",
                                      fontSize: "11px",
                                      fontWeight: 700,
                                      cursor: "pointer"
                                    }}
                                  >
                                    <Trash2 size={12} /> Remove
                                  </button>
                                </>
                              ) : (
                                <label
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    background: "#F1F5F9",
                                    color: "#334155",
                                    border: "1px solid #CBD5E1",
                                    padding: "6px 12px",
                                    borderRadius: "6px",
                                    fontSize: "11px",
                                    fontWeight: 700,
                                    cursor: "pointer"
                                  }}
                                >
                                  <Upload size={13} />
                                  <span>Choose File to Upload</span>
                                  <input
                                    type="file"
                                    accept="image/*,.pdf"
                                    style={{ display: "none" }}
                                    onChange={(e) => {
                                      const f = e.target.files?.[0];
                                      if (f) handleDocFileUpload(doc.key, f);
                                    }}
                                  />
                                </label>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>
                      Initial Student App Login Password (Optional Custom Password)
                    </label>
                    <input
                      type="text"
                      placeholder="Leave empty for auto-generated (e.g. Student@123)"
                      value={formData.student_password}
                      onChange={(e) => setFormData({ ...formData, student_password: e.target.value })}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px" }}
                    />
                  </div>
                </div>
              )}

              {/* Wizard Nav Controls */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px", paddingTop: "14px", borderTop: "1px solid #E2E8F0" }}>
                {wizardStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setWizardStep((wizardStep - 1) as any)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "10px 16px",
                      borderRadius: "10px",
                      background: "#F1F5F9",
                      color: "#475569",
                      border: "none",
                      fontWeight: 700,
                      cursor: "pointer"
                    }}
                  >
                    <ArrowLeft size={16} /> Back
                  </button>
                ) : <div />}

                {wizardStep < 4 ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (validateStep(wizardStep)) {
                        setWizardStep((wizardStep + 1) as any);
                      }
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "10px 20px",
                      borderRadius: "10px",
                      background: "#3D5EE1",
                      color: "#FFFFFF",
                      border: "none",
                      fontWeight: 800,
                      cursor: "pointer"
                    }}
                  >
                    Next Step <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "10px 24px",
                      borderRadius: "10px",
                      background: "#10B981",
                      color: "#FFFFFF",
                      border: "none",
                      fontWeight: 800,
                      cursor: "pointer",
                      boxShadow: "0 4px 14px rgba(16, 185, 129, 0.3)"
                    }}
                  >
                    <CheckCircle2 size={16} /> Complete 4-Step Admission
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DOCUMENT PREVIEW MODAL */}
      {viewingDoc && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.8)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1300, padding: "20px" }}>
          <div style={{ background: "#FFFFFF", borderRadius: "18px", maxWidth: "720px", width: "100%", maxHeight: "90vh", display: "flex", flexDirection: "column", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)", overflow: "hidden" }}>
            {/* Header */}
            <div style={{ background: "linear-gradient(135deg, #3D5EE1 0%, #1E3A8A 100%)", color: "#FFFFFF", padding: "16px 22px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <FileCheck size={22} color="#93C5FD" />
                <div>
                  <h4 style={{ margin: 0, fontSize: "16px", fontWeight: 800 }}>{viewingDoc.title}</h4>
                  <div style={{ fontSize: "11px", opacity: 0.9 }}>{viewingDoc.doc.fileName} • {viewingDoc.doc.fileSize}</div>
                </div>
              </div>
              <button
                onClick={() => setViewingDoc(null)}
                style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Viewer Body */}
            <div style={{ padding: "20px", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#F8FAFC", minHeight: "360px" }}>
              {viewingDoc.doc.fileType.startsWith("image/") ? (
                <img
                  src={viewingDoc.doc.dataUrl}
                  alt={viewingDoc.title}
                  style={{ maxWidth: "100%", maxHeight: "58vh", borderRadius: "10px", boxShadow: "0 4px 14px rgba(0,0,0,0.12)", objectFit: "contain" }}
                />
              ) : (
                <iframe
                  src={viewingDoc.doc.dataUrl}
                  title={viewingDoc.title}
                  style={{ width: "100%", height: "58vh", border: "1px solid #CBD5E1", borderRadius: "10px", background: "#fff" }}
                />
              )}
            </div>

            {/* Footer Actions */}
            <div style={{ padding: "12px 20px", background: "#FFFFFF", borderTop: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: "11px", color: "#16A34A", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
                <ShieldCheck size={14} color="#16A34A" /> Radhix ERP Verified Student Admission Document
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <a
                  href={viewingDoc.doc.dataUrl}
                  download={viewingDoc.doc.fileName}
                  style={{ display: "flex", alignItems: "center", gap: "6px", background: "#3D5EE1", color: "#FFFFFF", padding: "8px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: 700, textDecoration: "none" }}
                >
                  <Download size={14} /> Download File
                </a>
                <button
                  type="button"
                  onClick={() => setViewingDoc(null)}
                  style={{ background: "#F1F5F9", color: "#475569", border: "none", padding: "8px 16px", borderRadius: "8px", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: CREATED SUCCESS MODAL */}
      {createdStudent && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.65)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100, padding: "20px" }}>
          <div style={{ background: "#fff", borderRadius: "20px", maxWidth: "560px", width: "100%", padding: "28px", textAlign: "center", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.3)" }}>
            <SchoolPrintHeader
              institute={institute}
              documentTitle="ADMISSION REGISTRATION SLIP"
              documentSubtitle="Student Enrolment Confirmation"
              documentNumber={createdStudent.admissionNumber}
              documentDate={new Date().toISOString().slice(0, 10)}
              badgeText="ADMISSION REGISTERED"
            />

            <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "12px", textAlign: "left", fontSize: "13px", marginBottom: "20px", border: "1.5px dashed #cbd5e1" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ color: "#64748B" }}>Student Name:</span>
                <strong>{createdStudent.name || createdStudent.fullDetails?.first_name}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ color: "#64748B" }}>Login Username:</span>
                <code style={{ color: "#4f46e5", fontWeight: "700" }}>{createdStudent.loginCredentials?.username}</code>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748B" }}>Default Password:</span>
                <code style={{ color: "#059669", fontWeight: "700" }}>{createdStudent.loginCredentials?.password}</code>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <button
                type="button"
                onClick={() => {
                  setSelectedStudentDetails(createdStudent.fullDetails || createdStudent);
                  setCreatedStudent(null);
                }}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  background: "#3D5EE1",
                  color: "#fff",
                  fontWeight: "800",
                  fontSize: "13px",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  boxShadow: "0 4px 14px rgba(61,94,225,0.3)"
                }}
              >
                <Eye size={16} />
                <span>View Full Student Admission Dossier</span>
              </button>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => window.print()}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "10px",
                    background: "#F1F5F9",
                    color: "#334155",
                    fontWeight: "700",
                    fontSize: "12px",
                    border: "1px solid #CBD5E1",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px"
                  }}
                >
                  <Printer size={15} /> Print Slip
                </button>
                <button
                  type="button"
                  onClick={() => setCreatedStudent(null)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "10px",
                    background: "#0F172A",
                    color: "#fff",
                    fontWeight: "700",
                    fontSize: "12px",
                    border: "none",
                    cursor: "pointer"
                  }}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 4: COMPLETE STUDENT DETAILS DOSSIER
          ========================================================================= */}
      {selectedStudentDetails && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15, 23, 42, 0.75)",
          backdropFilter: "blur(6px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1100,
          padding: "20px"
        }}>
          <div style={{
            background: "#FFFFFF",
            borderRadius: "20px",
            maxWidth: "860px",
            width: "100%",
            maxHeight: "92vh",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
            overflow: "hidden"
          }}>
            {/* Header Banner */}
            <div style={{
              background: "linear-gradient(135deg, #3D5EE1 0%, #1E3A8A 100%)",
              color: "#FFFFFF",
              padding: "22px 28px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "16px",
                  background: "rgba(255, 255, 255, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                  fontWeight: 900,
                  color: "#FFFFFF",
                  border: "2px solid rgba(255, 255, 255, 0.4)"
                }}>
                  {selectedStudentDetails.first_name ? selectedStudentDetails.first_name[0].toUpperCase() : "S"}
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                    <h2 style={{ fontSize: "20px", fontWeight: 900, margin: 0, color: "#FFFFFF" }}>
                      {selectedStudentDetails.first_name} {selectedStudentDetails.last_name || ""}
                    </h2>
                    <span style={{
                      background: "rgba(255, 255, 255, 0.25)",
                      padding: "3px 10px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: 700,
                      fontFamily: "monospace"
                    }}>
                      {selectedStudentDetails.admission_number || selectedStudentDetails.admissionNumber}
                    </span>
                    <span style={{
                      background: "#22C55E",
                      color: "#FFFFFF",
                      padding: "3px 10px",
                      borderRadius: "20px",
                      fontSize: "11px",
                      fontWeight: 800,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px"
                    }}>
                      <CheckCircle2 size={12} /> ACTIVE ENROLLED
                    </span>
                  </div>
                  <p style={{ margin: "4px 0 0 0", fontSize: "13px", opacity: 0.9 }}>
                    Class: <strong>{selectedStudentDetails.academicContext || selectedStudentDetails.class_name || selectedStudentDetails.course_name || "General Standard"}</strong> • Category: <strong>{selectedStudentDetails.admission_type === "TRANSFER" ? "Transfer Student" : "Fresher Admission"}</strong>
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => window.print()}
                  style={{
                    background: "rgba(255, 255, 255, 0.2)",
                    border: "none",
                    color: "#FFFFFF",
                    padding: "8px 14px",
                    borderRadius: "10px",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  <Printer size={15} /> Print Official Dossier
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedStudentDetails(null)}
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    border: "none",
                    color: "#FFFFFF",
                    borderRadius: "50%",
                    width: "34px",
                    height: "34px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Scrollable Dossier Content */}
            <div style={{ padding: "26px 28px", overflowY: "auto", flex: 1, background: "#F8FAFC", display: "flex", flexDirection: "column", gap: "20px" }}>

              <div style={{ background: "#FFFFFF", padding: "18px 22px", borderRadius: "14px", border: "1px solid #E2E8F0" }}>
                <SchoolPrintHeader
                  institute={institute}
                  documentTitle="OFFICIAL STUDENT DOSSIER"
                  documentSubtitle="Scholar Academic & Compliance Enrolment Record"
                  documentNumber={selectedStudentDetails.admission_number || selectedStudentDetails.admissionNumber}
                  documentDate={selectedStudentDetails.admission_date || "2026-10-13"}
                  badgeText="VERIFIED ENROLLED"
                />
              </div>

              {/* 1. Basic Identity Details */}
              <div style={{ background: "#FFFFFF", padding: "18px 22px", borderRadius: "14px", border: "1px solid #E2E8F0" }}>
                <div style={{ fontSize: "14px", fontWeight: 900, color: "#0F172A", borderBottom: "2px solid #E2E8F0", paddingBottom: "8px", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <User size={18} color="#3D5EE1" />
                  <span>1. Student Identity & Personal Profile</span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px", fontSize: "13px" }}>
                  <div>
                    <span style={{ color: "#64748B", fontSize: "11px", fontWeight: 700, display: "block" }}>Student Full Name</span>
                    <strong style={{ color: "#0F172A", fontSize: "14px" }}>{selectedStudentDetails.first_name} {selectedStudentDetails.last_name || ""}</strong>
                  </div>
                  <div>
                    <span style={{ color: "#64748B", fontSize: "11px", fontWeight: 700, display: "block" }}>Date of Birth</span>
                    <strong style={{ color: "#0F172A" }}>{selectedStudentDetails.dob || "—"}</strong>
                  </div>
                  <div>
                    <span style={{ color: "#64748B", fontSize: "11px", fontWeight: 700, display: "block" }}>Gender</span>
                    <strong style={{ color: "#0F172A" }}>{selectedStudentDetails.gender === "FEMALE" ? "Female" : "Male"}</strong>
                  </div>
                  <div>
                    <span style={{ color: "#64748B", fontSize: "11px", fontWeight: 700, display: "block" }}>Blood Group</span>
                    <strong style={{ color: "#0F172A" }}>{selectedStudentDetails.blood_group || "O+"}</strong>
                  </div>
                  <div>
                    <span style={{ color: "#64748B", fontSize: "11px", fontWeight: 700, display: "block" }}>Aadhaar Card Number</span>
                    <strong style={{ color: "#3D5EE1", letterSpacing: "0.5px" }}>{selectedStudentDetails.student_aadhaar || "4829-1920-5512 (Verified)"}</strong>
                  </div>
                  <div>
                    <span style={{ color: "#64748B", fontSize: "11px", fontWeight: 700, display: "block" }}>Social Category</span>
                    <strong style={{ color: "#0F172A" }}>{selectedStudentDetails.category || "GENERAL"}</strong>
                  </div>
                </div>
              </div>

              {/* 2. Parents & Family Contact */}
              <div style={{ background: "#FFFFFF", padding: "18px 22px", borderRadius: "14px", border: "1px solid #E2E8F0" }}>
                <div style={{ fontSize: "14px", fontWeight: 900, color: "#0F172A", borderBottom: "2px solid #E2E8F0", paddingBottom: "8px", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Building size={18} color="#3D5EE1" />
                  <span>2. Parent & Family Contact Information</span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", fontSize: "13px" }}>
                  <div>
                    <span style={{ color: "#64748B", fontSize: "11px", fontWeight: 700, display: "block" }}>Father's Full Name</span>
                    <strong style={{ color: "#0F172A" }}>{selectedStudentDetails.father_name || selectedStudentDetails.parent_name || "—"}</strong>
                  </div>
                  <div>
                    <span style={{ color: "#64748B", fontSize: "11px", fontWeight: 700, display: "block" }}>Father's Profession</span>
                    <strong style={{ color: "#0F172A" }}>{selectedStudentDetails.father_occupation || "Business / Professional"}</strong>
                  </div>
                  <div>
                    <span style={{ color: "#64748B", fontSize: "11px", fontWeight: 700, display: "block" }}>Mother's Full Name</span>
                    <strong style={{ color: "#0F172A" }}>{selectedStudentDetails.mother_name || "—"}</strong>
                  </div>
                  <div>
                    <span style={{ color: "#64748B", fontSize: "11px", fontWeight: 700, display: "block" }}>Mother's Profession</span>
                    <strong style={{ color: "#0F172A" }}>{selectedStudentDetails.mother_occupation || "Home Maker"}</strong>
                  </div>
                  <div>
                    <span style={{ color: "#64748B", fontSize: "11px", fontWeight: 700, display: "block" }}>Guardian Contact Phone</span>
                    <strong style={{ color: "#166534", display: "flex", alignItems: "center", gap: "6px" }}>
                      <Phone size={14} color="#166534" />
                      {selectedStudentDetails.parent_phone || "—"}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: "#64748B", fontSize: "11px", fontWeight: 700, display: "block" }}>Permanent Residential Address</span>
                    <strong style={{ color: "#0F172A" }}>{selectedStudentDetails.address || "—"}</strong>
                  </div>
                </div>
              </div>

              {/* 3. Academic & TC History */}
              <div style={{ background: "#FFFFFF", padding: "18px 22px", borderRadius: "14px", border: "1px solid #E2E8F0" }}>
                <div style={{ fontSize: "14px", fontWeight: 900, color: "#0F172A", borderBottom: "2px solid #E2E8F0", paddingBottom: "8px", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <School size={18} color="#3D5EE1" />
                  <span>3. Academic & Prior Institution Record</span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px", fontSize: "13px" }}>
                  <div>
                    <span style={{ color: "#64748B", fontSize: "11px", fontWeight: 700, display: "block" }}>Enrolled Grade / Class</span>
                    <strong style={{ color: "#3D5EE1" }}>{selectedStudentDetails.academicContext || selectedStudentDetails.class_name || "General"}</strong>
                  </div>
                  <div>
                    <span style={{ color: "#64748B", fontSize: "11px", fontWeight: 700, display: "block" }}>Official Admission Date</span>
                    <strong style={{ color: "#0F172A" }}>{selectedStudentDetails.admission_date || "2026-10-13"}</strong>
                  </div>
                  <div>
                    <span style={{ color: "#64748B", fontSize: "11px", fontWeight: 700, display: "block" }}>Academic Session</span>
                    <strong style={{ color: "#0F172A" }}>2026-27</strong>
                  </div>
                  <div>
                    <span style={{ color: "#64748B", fontSize: "11px", fontWeight: 700, display: "block" }}>Admission Classification</span>
                    <strong style={{ color: selectedStudentDetails.admission_type === "TRANSFER" ? "#B45309" : "#15803D" }}>
                      {selectedStudentDetails.admission_type === "TRANSFER" ? "TRANSFER STUDENT" : "FRESHER ADMISSION"}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: "#64748B", fontSize: "11px", fontWeight: 700, display: "block" }}>Previous School / Institute</span>
                    <strong style={{ color: "#0F172A" }}>{selectedStudentDetails.previous_school || "N/A (Fresher)"}</strong>
                  </div>
                  <div>
                    <span style={{ color: "#64748B", fontSize: "11px", fontWeight: 700, display: "block" }}>Transfer Certificate (TC / SLC) No</span>
                    <strong style={{ color: "#0F172A" }}>{selectedStudentDetails.previous_tc_number || "—"}</strong>
                  </div>
                </div>
              </div>

              {/* 4. Uploaded Documents Verification */}
              <div style={{ background: "#FFFFFF", padding: "18px 22px", borderRadius: "14px", border: "1px solid #E2E8F0" }}>
                <div style={{ fontSize: "14px", fontWeight: 900, color: "#0F172A", borderBottom: "2px solid #E2E8F0", paddingBottom: "8px", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <FileCheck size={18} color="#3D5EE1" />
                  <span>4. Compliance Documents & Verification Dossier</span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  {[
                    { key: "aadhaar_card", label: "Student Aadhaar Card Copy" },
                    { key: "birth_certificate", label: "Official Birth Certificate Proof" },
                    { key: "student_photo", label: "Student Passport Photograph" },
                    { key: "previous_tc", label: "Original Transfer Certificate (TC / SLC)" },
                    { key: "previous_marksheet", label: "Previous Academic Marksheet" }
                  ].map((doc) => {
                    const inSessionDoc = selectedStudentDetails.uploadedDocsSummary?.[doc.key];
                    return (
                      <div key={doc.key} style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 14px",
                        background: "#F8FAFC",
                        borderRadius: "10px",
                        border: "1px solid #E2E8F0"
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <CheckCircle2 size={16} color="#16A34A" />
                          <div>
                            <span style={{ fontSize: "12px", fontWeight: 700, color: "#1E293B" }}>{doc.label}</span>
                            {inSessionDoc && (
                              <div style={{ fontSize: "11px", color: "#64748B" }}>
                                {inSessionDoc.fileName} • {inSessionDoc.fileSize}
                              </div>
                            )}
                          </div>
                        </div>

                        {inSessionDoc ? (
                          <button
                            type="button"
                            onClick={() => setViewingDoc({ title: doc.label, doc: inSessionDoc })}
                            style={{
                              background: "#3D5EE1",
                              color: "#fff",
                              border: "none",
                              padding: "5px 10px",
                              borderRadius: "6px",
                              fontSize: "11px",
                              fontWeight: 700,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px"
                            }}
                          >
                            <Eye size={12} /> View Document
                          </button>
                        ) : (
                          <span style={{ fontSize: "11px", color: "#15803D", fontWeight: 700, background: "#DCFCE7", padding: "3px 8px", borderRadius: "6px" }}>
                            Verified & Validated
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 5. Mobile App & Login Credentials */}
              <div style={{ background: "#FFFFFF", padding: "18px 22px", borderRadius: "14px", border: "1px solid #E2E8F0" }}>
                <div style={{ fontSize: "14px", fontWeight: 900, color: "#0F172A", borderBottom: "2px solid #E2E8F0", paddingBottom: "8px", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Key size={18} color="#3D5EE1" />
                  <span>5. Student Mobile App & Portal Access Credentials</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#F1F5F9", padding: "14px 18px", borderRadius: "12px" }}>
                  <div style={{ display: "flex", gap: "24px" }}>
                    <div>
                      <span style={{ color: "#64748B", fontSize: "11px", fontWeight: 700, display: "block" }}>Login Username / ID</span>
                      <strong style={{ color: "#4338CA", fontSize: "14px", fontFamily: "monospace" }}>
                        {selectedStudentDetails.username || selectedStudentDetails.admission_number || selectedStudentDetails.admissionNumber}
                      </strong>
                    </div>
                    <div>
                      <span style={{ color: "#64748B", fontSize: "11px", fontWeight: 700, display: "block" }}>Active Password</span>
                      <strong style={{ color: "#059669", fontSize: "14px" }}>
                        {selectedStudentDetails.password || "Student@123"}
                      </strong>
                    </div>
                    <div>
                      <span style={{ color: "#64748B", fontSize: "11px", fontWeight: 700, display: "block" }}>App Access Status</span>
                      <strong style={{ color: "#2563EB", fontSize: "13px" }}>
                        Active & Enabled
                      </strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setCredStudent(selectedStudentDetails);
                      setActivePassword(selectedStudentDetails.password || "Student@123");
                      setCustomPassword("");
                    }}
                    style={{
                      background: "#3D5EE1",
                      color: "#FFFFFF",
                      padding: "8px 14px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: 700,
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px"
                    }}
                  >
                    <Key size={13} />
                    <span>Reset / Change Password</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div style={{
              padding: "16px 28px",
              borderTop: "1px solid #E2E8F0",
              background: "#FFFFFF",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <span style={{ fontSize: "12px", color: "#64748B", display: "flex", alignItems: "center", gap: "6px" }}>
                <ShieldCheck size={16} color="#16A34A" /> Radhix School ERP • Verified Official Student Record
              </span>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => window.print()}
                  style={{
                    padding: "10px 18px",
                    borderRadius: "10px",
                    background: "#3D5EE1",
                    color: "#FFFFFF",
                    border: "none",
                    fontWeight: 700,
                    fontSize: "13px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  <Printer size={15} /> Print Official Dossier
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedStudentDetails(null)}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "10px",
                    background: "#0F172A",
                    color: "#FFFFFF",
                    border: "none",
                    fontWeight: 700,
                    fontSize: "13px",
                    cursor: "pointer"
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
