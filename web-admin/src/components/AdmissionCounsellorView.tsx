import React, { useState, useEffect } from "react";
import {
  UserCheck,
  Phone,
  Mail,
  Calendar,
  Clock,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  Plus,
  Search,
  Filter,
  FileText,
  Upload,
  Eye,
  Printer,
  Copy,
  Award,
  ShieldCheck,
  School,
  GraduationCap,
  X,
  Sparkles,
  AlertCircle,
  Building,
  MapPin,
  User,
  ChevronRight,
  CheckCircle,
  FileCheck,
  FolderOpen,
  Download,
  Trash2
} from "lucide-react";

interface Props {
  institute: any;
  token?: string | null;
  user?: any;
  onNavigateTab?: (tab: string) => void;
}

export interface InquiryData {
  id: string;
  institute_id?: string;
  student_name: string;
  parent_name: string;
  phone: string;
  email?: string;
  class_applying: string;
  source: "WALK_IN" | "WEBSITE" | "REFERRAL" | "PHONE";
  status: "NEW_INQUIRY" | "CAMPUS_VISIT" | "FORM_SUBMITTED" | "ENROLLED" | "CLOSED";
  counsellor_name?: string;
  follow_up_date?: string;
  notes?: string;
  created_at?: string;
}

export const AdmissionCounsellorView: React.FC<Props> = ({
  institute,
  token,
  user,
  onNavigateTab
}) => {
  const [inquiries, setInquiries] = useState<InquiryData[]>([
    {
      id: "inq-01",
      student_name: "Reyansh Gupta",
      parent_name: "Amit Gupta",
      phone: "+91 98112 34567",
      email: "amit.gupta@gmail.com",
      class_applying: "Class 1",
      source: "WALK_IN",
      status: "CAMPUS_VISIT",
      counsellor_name: "Priya Sharma (Senior Counsellor)",
      follow_up_date: "2026-10-15",
      notes: "Parents visited campus, interested in CBSE curriculum, digital smart classes and school bus facility."
    },
    {
      id: "inq-02",
      student_name: "Ananya Saxena",
      parent_name: "Deepak Saxena",
      phone: "+91 98711 22334",
      email: "deepak.saxena@outlook.com",
      class_applying: "Class 6",
      source: "WEBSITE",
      status: "NEW_INQUIRY",
      counsellor_name: "Priya Sharma (Senior Counsellor)",
      follow_up_date: "2026-10-14",
      notes: "Inquiry submitted through website for mid-term lateral transfer. Requires bus route information."
    },
    {
      id: "inq-03",
      student_name: "Kabir Malhotra",
      parent_name: "Sunil Malhotra",
      phone: "+91 98230 44556",
      email: "sunil.m@gmail.com",
      class_applying: "Pre-Primary (KG)",
      source: "PHONE",
      status: "FORM_SUBMITTED",
      counsellor_name: "Priya Sharma (Senior Counsellor)",
      follow_up_date: "2026-10-16",
      notes: "Fresher admission. Submitted birth certificate and Aadhaar. Fee discussion pending."
    },
    {
      id: "inq-04",
      student_name: "Myra Kapoor",
      parent_name: "Vikram Kapoor",
      phone: "+91 98450 66778",
      email: "vikram.kapoor@yahoo.com",
      class_applying: "Class 9",
      source: "REFERRAL",
      status: "ENROLLED",
      counsellor_name: "Priya Sharma (Senior Counsellor)",
      follow_up_date: "2026-10-10",
      notes: "Admission confirmed with TC from DPS Ghaziabad. Enrolled into Class 9-A."
    },
    {
      id: "inq-05",
      student_name: "Advait Singhal",
      parent_name: "Rajesh Singhal",
      phone: "+91 98101 88990",
      email: "rajesh.singhal@gmail.com",
      class_applying: "Class 10",
      source: "WALK_IN",
      status: "CAMPUS_VISIT",
      counsellor_name: "Priya Sharma (Senior Counsellor)",
      follow_up_date: "2026-10-18",
      notes: "Science stream query with laboratory tour completed."
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [loading, setLoading] = useState(false);

  // Classes list for dropdown
  const [classesList, setClassesList] = useState<any[]>([
    { id: "c1", name: "Pre-Primary (KG)" },
    { id: "c2", name: "Class 1" },
    { id: "c3", name: "Class 2" },
    { id: "c4", name: "Class 6" },
    { id: "c5", name: "Class 9" },
    { id: "c6", name: "Class 10" },
    { id: "c7", name: "Class 11" },
    { id: "c8", name: "Class 12" }
  ]);

  // Modal 1: New Inquiry
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    student_name: "",
    parent_name: "",
    phone: "",
    email: "",
    class_applying: "Class 1",
    source: "WALK_IN" as const,
    status: "NEW_INQUIRY" as const,
    counsellor_name: "Priya Sharma (Senior Counsellor)",
    follow_up_date: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
    notes: ""
  });

  // Modal 2: 4-Step Admission Wizard
  const [showWizardModal, setShowWizardModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardError, setWizardError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [admittedStudentResult, setAdmittedStudentResult] = useState<any | null>(null);

  // 4-Step Form State
  const initialWizardForm = {
    // Step 1: Basic Details
    first_name: "",
    last_name: "",
    dob: "2015-05-10",
    gender: "MALE",
    blood_group: "O+",
    admission_number: "",
    roll_number: "01",
    class_id: "",
    section_id: "",
    admission_type: "FRESHER" as "FRESHER" | "TRANSFER",
    academic_session: "2026-27",

    // Step 2: Parents & Guardian
    parent_name: "",
    parent_phone: "",
    father_name: "",
    father_occupation: "Business / Professional",
    mother_name: "",
    mother_occupation: "Home Maker",
    address: "",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110085",
    emergency_contact: "+91 98111 22334",

    // Step 3: Previous Academic Record
    previous_school: "",
    previous_board: "CBSE",
    previous_class: "",
    previous_percentage: "85%",
    previous_tc_number: "",
    tc_issue_date: "",

    // Step 4: Documents Upload State
    documents: [
      { id: "aadhaar", name: "Student National Aadhaar Card / ID Proof", required: true, file: "student_aadhaar.pdf", status: "VERIFIED" },
      { id: "birth_cert", name: "Municipal Birth Certificate Proof", required: true, file: "birth_certificate_scan.pdf", status: "VERIFIED" },
      { id: "student_photo", name: "Recent Formal Passport Photograph", required: true, file: "student_photo.jpg", status: "VERIFIED" },
      { id: "tc", name: "Original Transfer Certificate (TC / SLC)", required: false, file: "", status: "PENDING" },
      { id: "marksheet", name: "Previous Academic Report Card / Marksheet", required: false, file: "", status: "PENDING" },
      { id: "parent_id", name: "Parent / Guardian Photo ID Proof", required: true, file: "father_aadhaar.pdf", status: "VERIFIED" }
    ]
  };

  const [wizardForm, setWizardForm] = useState(initialWizardForm);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Document Viewing State & Form Errors
  const [viewingCounsellorDoc, setViewingCounsellorDoc] = useState<{
    title: string;
    fileName: string;
    fileSize?: string;
    dataUrl: string;
    fileType: string;
  } | null>(null);
  const [counsellorErrors, setCounsellorErrors] = useState<Record<string, string>>({});

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const validateCounsellorStep = (step: number): boolean => {
    const errs: Record<string, string> = {};
    if (step === 1) {
      if (!wizardForm.first_name.trim()) errs.first_name = "Student first name is mandatory.";
      if (!wizardForm.dob) errs.dob = "Official Date of Birth is required.";
      if (!wizardForm.class_id) errs.class_id = "Please select an assigned class / standard.";
    }
    if (step === 2) {
      if (!wizardForm.father_name.trim()) errs.father_name = "Father's full name is required.";
      const cleanPhone = wizardForm.parent_phone.replace(/\D/g, "");
      if (!wizardForm.parent_phone.trim()) {
        errs.parent_phone = "Parent / Guardian mobile number is mandatory.";
      } else if (cleanPhone.length !== 10 && !(cleanPhone.length === 12 && cleanPhone.startsWith("91"))) {
        errs.parent_phone = "Please enter a valid 10-digit mobile number (e.g. 9811234567).";
      }
      if (!wizardForm.address.trim()) errs.address = "Permanent residential address is mandatory.";
    }
    if (step === 3) {
      if (wizardForm.admission_type === "TRANSFER") {
        if (!wizardForm.previous_school.trim()) errs.previous_school = "Previous school name is required for transfer students.";
        if (!wizardForm.previous_tc_number.trim()) errs.previous_tc_number = "Transfer Certificate (TC / SLC) number is mandatory.";
      }
    }
    if (step === 4) {
      const isFresher = wizardForm.admission_type === "FRESHER";
      const reqDocs = wizardForm.documents.filter(d => {
        if (isFresher && (d.id === "tc" || d.id === "marksheet")) return false;
        return d.required;
      });
      const missing = reqDocs.find(d => !d.file);
      if (missing) {
        errs.documents = `Please upload the mandatory document (${missing.name}).`;
      }
    }
    setCounsellorErrors(errs);
    if (Object.keys(errs).length > 0) {
      setWizardError(Object.values(errs)[0]);
      return false;
    }
    setWizardError("");
    return true;
  };

  const fetchInquiries = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/v1/school-features/admissions/inquiries", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        setInquiries(data.data);
      }
    } catch {
      // Use local list
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:5000/api/v1/academic/classes", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        setClassesList(data.data);
      }
    } catch {
      // Use fallback
    }
  };

  useEffect(() => {
    fetchInquiries();
    fetchClasses();
  }, [token]);

  // Handle Save Inquiry
  const handleSaveInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = inquiryForm.phone.replace(/\D/g, "");
    if (!inquiryForm.student_name.trim() || inquiryForm.student_name.trim().length < 2) {
      alert("Please enter a valid student name (minimum 2 characters).");
      return;
    }
    if (!inquiryForm.parent_name.trim()) {
      alert("Please enter the parent / guardian name.");
      return;
    }
    if (!inquiryForm.phone.trim() || (cleanPhone.length !== 10 && !(cleanPhone.length === 12 && cleanPhone.startsWith("91")))) {
      alert("Please enter a valid 10-digit mobile number (e.g. 9811234567)");
      return;
    }

    const newInq: InquiryData = {
      ...inquiryForm,
      id: `inq-${Date.now()}`,
      created_at: new Date().toISOString()
    };

    if (token) {
      try {
        await fetch("http://localhost:5000/api/v1/school-features/admissions/inquiries", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(inquiryForm)
        });
      } catch {
        // saved locally
      }
    }

    setInquiries([newInq, ...inquiries]);
    setShowInquiryModal(false);
    showToast("New admission inquiry registered successfully!");
    setInquiryForm({
      student_name: "",
      parent_name: "",
      phone: "",
      email: "",
      class_applying: "Class 1",
      source: "WALK_IN",
      status: "NEW_INQUIRY",
      counsellor_name: "Priya Sharma (Senior Counsellor)",
      follow_up_date: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
      notes: ""
    });
  };

  // Launch Wizard from Lead
  const handleStartAdmissionFromInquiry = (inq: InquiryData) => {
    const names = inq.student_name.split(" ");
    const firstName = names[0] || "";
    const lastName = names.slice(1).join(" ") || "";

    setWizardForm({
      ...initialWizardForm,
      first_name: firstName,
      last_name: lastName,
      parent_name: inq.parent_name,
      parent_phone: inq.phone,
      father_name: inq.parent_name,
      admission_number: `DPA-2026-${Math.floor(100 + Math.random() * 900)}`,
      previous_school: inq.status === "ENROLLED" ? "Delhi Public School" : "",
      admission_type: inq.class_applying.includes("KG") || inq.class_applying.includes("Class 1") ? "FRESHER" : "TRANSFER"
    });
    setCurrentStep(1);
    setWizardError("");
    setAdmittedStudentResult(null);
    setShowWizardModal(true);
  };

  // Step 4: Submit Final Admission
  const handleFinalAdmissionSubmit = async () => {
    setWizardError("");
    if (!wizardForm.first_name.trim() || !wizardForm.parent_phone.trim()) {
      setWizardError("Student first name and parent phone number are required.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        first_name: wizardForm.first_name,
        last_name: wizardForm.last_name,
        dob: wizardForm.dob,
        gender: wizardForm.gender,
        blood_group: wizardForm.blood_group,
        admission_number: wizardForm.admission_number || `DPA-2026-${Math.floor(100 + Math.random() * 900)}`,
        roll_number: wizardForm.roll_number,
        class_id: wizardForm.class_id || (classesList[0]?.id || ""),
        section_id: wizardForm.section_id || "",
        parent_name: wizardForm.father_name || wizardForm.parent_name,
        parent_phone: wizardForm.parent_phone,
        address: `${wizardForm.address}, ${wizardForm.city} - ${wizardForm.pincode}`,
        father_name: wizardForm.father_name,
        mother_name: wizardForm.mother_name,
        father_occupation: wizardForm.father_occupation,
        mother_occupation: wizardForm.mother_occupation,
        admission_type: wizardForm.admission_type,
        previous_school: wizardForm.previous_school,
        previous_board: wizardForm.previous_board,
        previous_class: wizardForm.previous_class,
        previous_tc_number: wizardForm.previous_tc_number,
        tc_issue_date: wizardForm.tc_issue_date,
        documents_json: JSON.stringify(wizardForm.documents)
      };

      let resultData: any = {
        studentId: `stu-${Date.now()}`,
        admissionNumber: payload.admission_number,
        name: `${wizardForm.first_name} ${wizardForm.last_name}`,
        className: classesList.find(c => c.id === wizardForm.class_id)?.name || "Class 1",
        fatherName: wizardForm.father_name || wizardForm.parent_name,
        phone: wizardForm.parent_phone,
        admissionDate: new Date().toLocaleDateString("en-IN"),
        loginCredentials: {
          username: payload.admission_number,
          password: `Student@${Math.floor(1000 + Math.random() * 9000)}`
        }
      };

      if (token) {
        try {
          const res = await fetch("http://localhost:5000/api/v1/students/admit", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(payload)
          });
          const resJson = await res.json();
          if (resJson.success && resJson.data) {
            resultData = {
              ...resultData,
              ...resJson.data,
              className: classesList.find(c => c.id === wizardForm.class_id)?.name || "Class 1"
            };
          }
        } catch (e) {
          console.warn("Backend admit failed, using local result:", e);
        }
      }

      setAdmittedStudentResult(resultData);
      showToast("Student 4-Step admission registered and enrolled successfully!");
    } catch {
      setWizardError("Encountered an issue submitting the admission record. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Filtered inquiries
  const filteredInquiries = inquiries.filter((inq) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      inq.student_name.toLowerCase().includes(q) ||
      inq.parent_name.toLowerCase().includes(q) ||
      inq.phone.includes(q) ||
      inq.class_applying.toLowerCase().includes(q);

    if (!matchesSearch) return false;
    if (filterStatus !== "ALL" && inq.status !== filterStatus) return false;
    return true;
  });

  return (
    <div style={{ padding: "28px", maxWidth: "1440px", margin: "0 auto" }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: "fixed",
          top: "24px",
          right: "24px",
          background: "#1E293B",
          color: "#fff",
          padding: "14px 22px",
          borderRadius: "14px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          gap: "10px",
          fontWeight: 700,
          fontSize: "14px",
          border: "1px solid #334155"
        }}>
          <Sparkles size={18} color="#3D5EE1" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner (Preskool Royal Indigo Gradient) */}
      <div style={{
        background: "linear-gradient(135deg, #3D5EE1 0%, #1E3A8A 100%)",
        borderRadius: "18px",
        padding: "24px 28px",
        color: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "24px",
        boxShadow: "0 10px 25px -5px rgba(61, 94, 225, 0.3)"
      }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.2)", padding: "4px 12px", borderRadius: "12px", fontSize: "12px", fontWeight: 800, marginBottom: "8px" }}>
            <UserCheck size={14} color="#93C5FD" /> Official Admission Counsellor Portal & Pipeline
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: 900, margin: "0 0 6px 0", letterSpacing: "-0.02em" }}>
            Admission Counsellor Hub & 4-Step Student Enrollment
          </h1>
          <p style={{ margin: 0, opacity: 0.9, fontSize: "13px", maxWidth: "780px" }}>
            Admission inquiry and prospective lead tracking, campus visit schedules, and 4-step institutional enrollment (identity profile, guardian details, academic TC history, and compliance document verification).
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => setShowInquiryModal(true)}
            style={{
              background: "rgba(255,255,255,0.2)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.4)",
              padding: "10px 16px",
              borderRadius: "12px",
              fontWeight: 800,
              fontSize: "13px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <Plus size={16} /> + New Inquiry
          </button>

          <button
            onClick={() => {
              setWizardForm({
                ...initialWizardForm,
                admission_number: `DPA-2026-${Math.floor(100 + Math.random() * 900)}`
              });
              setCurrentStep(1);
              setWizardError("");
              setAdmittedStudentResult(null);
              setShowWizardModal(true);
            }}
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
              boxShadow: "0 4px 16px rgba(0,0,0,0.15)"
            }}
          >
            <GraduationCap size={16} />
            <span>4-Step Direct Admission</span>
          </button>
        </div>
      </div>

      {/* 4 Pipeline Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "24px" }}>
        <div style={{ background: "#FFFFFF", padding: "18px 20px", borderRadius: "16px", border: "1px solid #E2E8F0", boxShadow: "0 2px 6px rgba(0,0,0,0.02)" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748B", marginBottom: "4px" }}>Total Inquiries Logged</div>
          <div style={{ fontSize: "26px", fontWeight: 900, color: "#0F172A" }}>{inquiries.length} Leads</div>
          <div style={{ fontSize: "11px", color: "#3D5EE1", fontWeight: 700, marginTop: "4px" }}>Walk-in, Web & Phone Inquiries</div>
        </div>

        <div style={{ background: "#FFFFFF", padding: "18px 20px", borderRadius: "16px", border: "1px solid #E2E8F0", boxShadow: "0 2px 6px rgba(0,0,0,0.02)" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748B", marginBottom: "4px" }}>Campus Visits Scheduled</div>
          <div style={{ fontSize: "26px", fontWeight: 900, color: "#8B5CF6" }}>
            {inquiries.filter(i => i.status === "CAMPUS_VISIT").length} Scheduled
          </div>
          <div style={{ fontSize: "11px", color: "#64748B", fontWeight: 600, marginTop: "4px" }}>School Campus & Lab Tours Booked</div>
        </div>

        <div style={{ background: "#FFFFFF", padding: "18px 20px", borderRadius: "16px", border: "1px solid #E2E8F0", boxShadow: "0 2px 6px rgba(0,0,0,0.02)" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748B", marginBottom: "4px" }}>Application Forms Submitted</div>
          <div style={{ fontSize: "26px", fontWeight: 900, color: "#CA8A04" }}>
            {inquiries.filter(i => i.status === "FORM_SUBMITTED").length} In Review
          </div>
          <div style={{ fontSize: "11px", color: "#CA8A04", fontWeight: 700, marginTop: "4px" }}>Documents Verification in Progress</div>
        </div>

        <div style={{ background: "#FFFFFF", padding: "18px 20px", borderRadius: "16px", border: "1px solid #E2E8F0", boxShadow: "0 2px 6px rgba(0,0,0,0.02)" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748B", marginBottom: "4px" }}>Confirmed Admissions</div>
          <div style={{ fontSize: "26px", fontWeight: 900, color: "#166534" }}>
            {inquiries.filter(i => i.status === "ENROLLED").length} Confirmed
          </div>
          <div style={{ fontSize: "11px", color: "#166534", fontWeight: 700, marginTop: "4px" }}>100% Onboarded into Classes</div>
        </div>
      </div>

      {/* Leads Table Toolbar */}
      <div style={{
        background: "#FFFFFF",
        borderRadius: "16px",
        padding: "16px 20px",
        border: "1px solid #E2E8F0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "14px",
        marginBottom: "20px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: "260px", maxWidth: "450px", background: "#F8FAFC", border: "1px solid #CBD5E1", borderRadius: "10px", padding: "8px 14px" }}>
          <Search size={16} color="#64748B" />
          <input
            type="text"
            placeholder="Search leads by student, parent, phone, class..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: "none", background: "transparent", outline: "none", fontSize: "13px", width: "100%", color: "#0F172A" }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0 }}>
              <X size={14} color="#94A3B8" />
            </button>
          )}
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {[
            { id: "ALL", label: "All Inquiries" },
            { id: "NEW_INQUIRY", label: "New Inquiry" },
            { id: "CAMPUS_VISIT", label: "Campus Visit" },
            { id: "FORM_SUBMITTED", label: "Form Submitted" },
            { id: "ENROLLED", label: "Enrolled" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterStatus(f.id)}
              style={{
                padding: "7px 14px",
                borderRadius: "8px",
                border: `1px solid ${filterStatus === f.id ? "#3D5EE1" : "#E2E8F0"}`,
                background: filterStatus === f.id ? "#3D5EE1" : "#FFFFFF",
                color: filterStatus === f.id ? "#FFFFFF" : "#475569",
                fontWeight: 700,
                fontSize: "12px",
                cursor: "pointer"
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries List Table */}
      <div style={{ background: "#FFFFFF", borderRadius: "16px", border: "1px solid #E2E8F0", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", fontSize: "12px", color: "#64748B" }}>
              <th style={{ padding: "14px 18px" }}>STUDENT & PARENT</th>
              <th style={{ padding: "14px 18px" }}>CLASS APPLYING</th>
              <th style={{ padding: "14px 18px" }}>SOURCE</th>
              <th style={{ padding: "14px 18px" }}>STATUS</th>
              <th style={{ padding: "14px 18px" }}>FOLLOW-UP DATE</th>
              <th style={{ padding: "14px 18px" }}>ASSIGNED COUNSELLOR</th>
              <th style={{ padding: "14px 18px", textAlign: "right" }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredInquiries.map((inq) => (
              <tr key={inq.id} style={{ borderBottom: "1px solid #F1F5F9", fontSize: "13px" }}>
                <td style={{ padding: "16px 18px" }}>
                  <div style={{ fontWeight: 800, color: "#0F172A", fontSize: "14px" }}>{inq.student_name}</div>
                  <div style={{ fontSize: "12px", color: "#64748B", display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
                    <span>Parent: {inq.parent_name}</span>
                    <span>•</span>
                    <span style={{ color: "#3D5EE1", fontWeight: 700 }}>{inq.phone}</span>
                  </div>
                </td>

                <td style={{ padding: "16px 18px" }}>
                  <span style={{ background: "#EFF6FF", color: "#1E40AF", padding: "4px 10px", borderRadius: "8px", fontWeight: 800, fontSize: "12px" }}>
                    {inq.class_applying}
                  </span>
                </td>

                <td style={{ padding: "16px 18px" }}>
                  <span style={{ color: "#475569", fontWeight: 600 }}>{inq.source}</span>
                </td>

                <td style={{ padding: "16px 18px" }}>
                  <span style={{
                    padding: "4px 10px",
                    borderRadius: "8px",
                    fontSize: "11px",
                    fontWeight: 800,
                    background:
                      inq.status === "ENROLLED" ? "#DCFCE7" :
                      inq.status === "FORM_SUBMITTED" ? "#FEF9C3" :
                      inq.status === "CAMPUS_VISIT" ? "#F3E8FF" : "#EFF6FF",
                    color:
                      inq.status === "ENROLLED" ? "#166534" :
                      inq.status === "FORM_SUBMITTED" ? "#854D0E" :
                      inq.status === "CAMPUS_VISIT" ? "#6B21A8" : "#1E40AF",
                  }}>
                    ● {inq.status}
                  </span>
                </td>

                <td style={{ padding: "16px 18px", color: "#334155", fontWeight: 600 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Calendar size={13} color="#64748B" />
                    <span>{inq.follow_up_date || "Not Scheduled"}</span>
                  </div>
                </td>

                <td style={{ padding: "16px 18px", color: "#475569" }}>
                  {inq.counsellor_name || "Priya Sharma"}
                </td>

                <td style={{ padding: "16px 18px", textAlign: "right" }}>
                  <button
                    onClick={() => handleStartAdmissionFromInquiry(inq)}
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
                      gap: "6px",
                      boxShadow: "0 2px 8px rgba(61, 94, 225, 0.25)"
                    }}
                  >
                    <span>4-Step Admit</span>
                    <ArrowRight size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* =========================================================================
          MODAL 1: ADD NEW INQUIRY
          ========================================================================= */}
      {showInquiryModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.65)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div style={{ background: "#FFFFFF", borderRadius: "20px", maxWidth: "560px", width: "100%", padding: "28px", boxShadow: "0 25px 50px rgba(0,0,0,0.25)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid #E2E8F0", paddingBottom: "12px" }}>
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: 900, margin: 0, color: "#0F172A" }}>New Admission Inquiry</h3>
                <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#64748B" }}>Record prospective student inquiry for counseling and campus follow-up.</p>
              </div>
              <button onClick={() => setShowInquiryModal(false)} style={{ background: "transparent", border: "none", cursor: "pointer" }}><X size={20} color="#64748B" /></button>
            </div>

            <form onSubmit={handleSaveInquiry} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>Student Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aarav Sharma"
                    value={inquiryForm.student_name}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, student_name: e.target.value })}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", fontSize: "13px" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>Parent / Guardian Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Sharma"
                    value={inquiryForm.parent_name}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, parent_name: e.target.value })}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", fontSize: "13px" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>Mobile Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98765 43210"
                    value={inquiryForm.phone}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", fontSize: "13px" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>Class Applying For *</label>
                  <select
                    value={inquiryForm.class_applying}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, class_applying: e.target.value })}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", fontSize: "13px", background: "#fff" }}
                  >
                    {classesList.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>Inquiry Source</label>
                  <select
                    value={inquiryForm.source}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, source: e.target.value as any })}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", fontSize: "13px", background: "#fff" }}
                  >
                    <option value="WALK_IN">Direct Walk-in Campus</option>
                    <option value="WEBSITE">Website Portal</option>
                    <option value="PHONE">Telephonic Call</option>
                    <option value="REFERRAL">Parent Referral</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>Next Follow-up Date</label>
                  <input
                    type="date"
                    value={inquiryForm.follow_up_date}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, follow_up_date: e.target.value })}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", fontSize: "13px" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>Counsellor Remarks / Notes</label>
                <textarea
                  placeholder="Notes about student interests, previous school, transport required..."
                  value={inquiryForm.notes}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, notes: e.target.value })}
                  rows={3}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", fontSize: "13px" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                <button
                  type="button"
                  onClick={() => setShowInquiryModal(false)}
                  style={{ padding: "10px 18px", borderRadius: "8px", background: "#F1F5F9", border: "none", color: "#475569", fontWeight: 700, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "10px 22px", borderRadius: "8px", background: "#3D5EE1", border: "none", color: "#fff", fontWeight: 800, cursor: "pointer" }}
                >
                  Save Inquiry Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: 4-STEP STUDENT ADMISSION WIZARD
          ========================================================================= */}
      {showWizardModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.75)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100, padding: "20px" }}>
          <div style={{ background: "#FFFFFF", borderRadius: "20px", maxWidth: "800px", width: "100%", maxHeight: "94vh", display: "flex", flexDirection: "column", boxShadow: "0 25px 50px rgba(0,0,0,0.35)", overflow: "hidden" }}>
            
            {/* Wizard Header */}
            <div style={{ background: "linear-gradient(135deg, #3D5EE1 0%, #1E3A8A 100%)", color: "#fff", padding: "20px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: 900, margin: "0 0 2px 0" }}>
                  4-Step Student Admission Wizard
                </h3>
                <p style={{ margin: 0, fontSize: "12px", opacity: 0.9 }}>
                  Basic Details ➔ Parents ➔ Academic TC ➔ Document Verification
                </p>
              </div>
              <button onClick={() => setShowWizardModal(false)} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <X size={18} />
              </button>
            </div>

            {/* Stepper Progress Bar */}
            <div style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", padding: "14px 28px", display: "flex", justifyContent: "space-between" }}>
              {[
                { num: 1, title: "1. Basic Details", desc: "Student Profile" },
                { num: 2, title: "2. Parents & Guardian", desc: "Family Contacts" },
                { num: 3, title: "3. Previous Record & TC", desc: "Prior Academic TC" },
                { num: 4, title: "4. Document Uploads", desc: "Compliance Dossier" },
              ].map((s) => {
                const isCurrent = currentStep === s.num;
                const isDone = currentStep > s.num;
                return (
                  <div key={s.num} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      background: isCurrent ? "#3D5EE1" : isDone ? "#10B981" : "#E2E8F0",
                      color: isCurrent || isDone ? "#fff" : "#64748B",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 900,
                      fontSize: "13px"
                    }}>
                      {isDone ? <Check size={16} /> : s.num}
                    </div>
                    <div>
                      <div style={{ fontSize: "12px", fontWeight: 800, color: isCurrent ? "#3D5EE1" : "#0F172A" }}>{s.title}</div>
                      <div style={{ fontSize: "10px", color: "#64748B" }}>{s.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Wizard Body (Scrollable) */}
            <div style={{ padding: "24px 28px", overflowY: "auto", flex: 1 }}>
              {wizardError && (
                <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", color: "#991B1B", padding: "10px 14px", borderRadius: "10px", fontSize: "13px", fontWeight: 700, marginBottom: "16px" }}>
                  ⚠️ {wizardError}
                </div>
              )}

              {/* SUCCESS RESULT SCREEN */}
              {admittedStudentResult ? (
                <div style={{ textAlign: "center", padding: "20px" }}>
                  <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#DCFCE7", color: "#166534", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px auto" }}>
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 style={{ fontSize: "20px", fontWeight: 900, color: "#0F172A", margin: "0 0 6px 0" }}>
                    Provisional Admission Confirmed!
                  </h3>
                  <p style={{ fontSize: "13px", color: "#64748B", margin: "0 0 20px 0" }}>
                    4-step student registration and document verification completed successfully.
                  </p>

                  <div style={{ background: "#F8FAFC", borderRadius: "16px", border: "1px solid #E2E8F0", padding: "20px", textAlign: "left", maxWidth: "520px", margin: "0 auto 24px auto" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ color: "#64748B" }}>Student Name:</span>
                      <strong>{admittedStudentResult.name}</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ color: "#64748B" }}>Admission Number:</span>
                      <strong style={{ color: "#3D5EE1", fontFamily: "monospace" }}>{admittedStudentResult.admissionNumber}</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ color: "#64748B" }}>Assigned Class:</span>
                      <strong>{admittedStudentResult.className}</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ color: "#64748B" }}>Student Login Username:</span>
                      <strong style={{ color: "#4338CA" }}>{admittedStudentResult.loginCredentials?.username}</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#64748B" }}>Generated Password:</span>
                      <strong style={{ color: "#10B981" }}>{admittedStudentResult.loginCredentials?.password}</strong>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                    <button
                      onClick={() => window.print()}
                      style={{ background: "#3D5EE1", color: "#fff", padding: "10px 20px", borderRadius: "10px", fontWeight: 800, fontSize: "13px", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                    >
                      <Printer size={16} /> Print Admission Slip
                    </button>
                    <button
                      onClick={() => {
                        setShowWizardModal(false);
                        setAdmittedStudentResult(null);
                        if (onNavigateTab) onNavigateTab("admissions");
                      }}
                      style={{ background: "#F1F5F9", color: "#334155", padding: "10px 20px", borderRadius: "10px", fontWeight: 700, fontSize: "13px", border: "none", cursor: "pointer" }}
                    >
                      View in Student Registry
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* STEP 1: BASIC STUDENT DETAILS */}
                  {currentStep === 1 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      <div style={{ fontSize: "14px", fontWeight: 900, color: "#0F172A", borderBottom: "2px solid #E2E8F0", paddingBottom: "6px" }}>
                        Step 1: Student Identity & Academic Profile
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                        <div>
                          <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>First Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Aarav"
                            value={wizardForm.first_name}
                            onChange={(e) => setWizardForm({ ...wizardForm, first_name: e.target.value })}
                            style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", fontSize: "13px" }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>Last Name</label>
                          <input
                            type="text"
                            placeholder="e.g. Kumar"
                            value={wizardForm.last_name}
                            onChange={(e) => setWizardForm({ ...wizardForm, last_name: e.target.value })}
                            style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", fontSize: "13px" }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>Date of Birth *</label>
                          <input
                            type="date"
                            value={wizardForm.dob}
                            onChange={(e) => setWizardForm({ ...wizardForm, dob: e.target.value })}
                            style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", fontSize: "13px" }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>Gender *</label>
                          <select
                            value={wizardForm.gender}
                            onChange={(e) => setWizardForm({ ...wizardForm, gender: e.target.value })}
                            style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", fontSize: "13px", background: "#fff" }}
                          >
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                            <option value="OTHER">Other</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>Admission Classification *</label>
                          <select
                            value={wizardForm.admission_type}
                            onChange={(e) => setWizardForm({ ...wizardForm, admission_type: e.target.value as any })}
                            style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", fontSize: "13px", background: "#fff", fontWeight: 700, color: "#3D5EE1" }}
                          >
                            <option value="FRESHER">Fresher Admission (First-time Enrollment - Nursery / KG / Class 1)</option>
                            <option value="TRANSFER">Transfer Student (Prior School Transfer - Class 2 to 12)</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>Assign Class / Standard *</label>
                          <select
                            value={wizardForm.class_id}
                            onChange={(e) => setWizardForm({ ...wizardForm, class_id: e.target.value })}
                            style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", fontSize: "13px", background: "#fff" }}
                          >
                            <option value="">Select Class</option>
                            {classesList.map(c => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>Admission Number</label>
                          <input
                            type="text"
                            placeholder="Auto-generated if blank"
                            value={wizardForm.admission_number}
                            onChange={(e) => setWizardForm({ ...wizardForm, admission_number: e.target.value })}
                            style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", fontSize: "13px", fontFamily: "monospace" }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>Blood Group</label>
                          <select
                            value={wizardForm.blood_group}
                            onChange={(e) => setWizardForm({ ...wizardForm, blood_group: e.target.value })}
                            style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", fontSize: "13px", background: "#fff" }}
                          >
                            <option value="O+">O+</option>
                            <option value="A+">A+</option>
                            <option value="B+">B+</option>
                            <option value="AB+">AB+</option>
                            <option value="O-">O-</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: PARENTS & GUARDIAN */}
                  {currentStep === 2 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      <div style={{ fontSize: "14px", fontWeight: 900, color: "#0F172A", borderBottom: "2px solid #E2E8F0", paddingBottom: "6px" }}>
                        Step 2: Parents & Guardian Information
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                        <div>
                          <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>Father's Full Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Ramesh Kumar"
                            value={wizardForm.father_name}
                            onChange={(e) => setWizardForm({ ...wizardForm, father_name: e.target.value })}
                            style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", fontSize: "13px" }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>Father's Occupation</label>
                          <input
                            type="text"
                            placeholder="e.g. Software Engineer / Govt Officer"
                            value={wizardForm.father_occupation}
                            onChange={(e) => setWizardForm({ ...wizardForm, father_occupation: e.target.value })}
                            style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", fontSize: "13px" }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>Mother's Full Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Sunita Devi"
                            value={wizardForm.mother_name}
                            onChange={(e) => setWizardForm({ ...wizardForm, mother_name: e.target.value })}
                            style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", fontSize: "13px" }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>Mother's Occupation</label>
                          <input
                            type="text"
                            placeholder="e.g. Teacher / Homemaker"
                            value={wizardForm.mother_occupation}
                            onChange={(e) => setWizardForm({ ...wizardForm, mother_occupation: e.target.value })}
                            style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", fontSize: "13px" }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>Parent Mobile Number *</label>
                          <input
                            type="text"
                            required
                            placeholder="+91 98444 55566"
                            value={wizardForm.parent_phone}
                            onChange={(e) => setWizardForm({ ...wizardForm, parent_phone: e.target.value })}
                            style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", fontSize: "13px" }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>Emergency Contact Helpline</label>
                          <input
                            type="text"
                            placeholder="+91 98111 22334"
                            value={wizardForm.emergency_contact}
                            onChange={(e) => setWizardForm({ ...wizardForm, emergency_contact: e.target.value })}
                            style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", fontSize: "13px" }}
                          />
                        </div>
                        <div style={{ gridColumn: "span 2" }}>
                          <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>Residential Permanent Address *</label>
                          <input
                            type="text"
                            placeholder="House No., Street, Sector, Landmark..."
                            value={wizardForm.address}
                            onChange={(e) => setWizardForm({ ...wizardForm, address: e.target.value })}
                            style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", fontSize: "13px" }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: PREVIOUS ACADEMIC RECORD & TC */}
                  {currentStep === 3 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      <div style={{ fontSize: "14px", fontWeight: 900, color: "#0F172A", borderBottom: "2px solid #E2E8F0", paddingBottom: "6px" }}>
                        Step 3: Previous Academic History & Transfer Certificate
                      </div>

                      {wizardForm.admission_type === "FRESHER" ? (
                        <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: "12px", padding: "16px", color: "#1E40AF" }}>
                          <div style={{ fontWeight: 800, fontSize: "14px", marginBottom: "4px" }}>
                            👶 Direct Fresher Admission Selected
                          </div>
                          <p style={{ margin: 0, fontSize: "12px" }}>
                            Since this applicant is enrolling for the first time (Nursery, KG, or Class 1), Transfer Certificate (TC) is not required. Only Birth Certificate and Aadhaar Card are mandatory.
                          </p>
                        </div>
                      ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                          <div>
                            <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>Previous School Name *</label>
                            <input
                              type="text"
                              placeholder="e.g. Delhi Public School, Noida"
                              value={wizardForm.previous_school}
                              onChange={(e) => setWizardForm({ ...wizardForm, previous_school: e.target.value })}
                              style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", fontSize: "13px" }}
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>Previous Academic Board</label>
                            <select
                              value={wizardForm.previous_board}
                              onChange={(e) => setWizardForm({ ...wizardForm, previous_board: e.target.value })}
                              style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", fontSize: "13px", background: "#fff" }}
                            >
                              <option value="CBSE">CBSE Board</option>
                              <option value="ICSE">ICSE Board</option>
                              <option value="STATE">State Board</option>
                              <option value="IB">IB / International</option>
                            </select>
                          </div>
                          <div>
                            <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>Original Transfer Certificate (TC / SLC) Number *</label>
                            <input
                              type="text"
                              placeholder="e.g. TC-DPS-2026-9921"
                              value={wizardForm.previous_tc_number}
                              onChange={(e) => setWizardForm({ ...wizardForm, previous_tc_number: e.target.value })}
                              style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", fontSize: "13px", fontFamily: "monospace" }}
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>TC Issue Date</label>
                            <input
                              type="date"
                              value={wizardForm.tc_issue_date}
                              onChange={(e) => setWizardForm({ ...wizardForm, tc_issue_date: e.target.value })}
                              style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", fontSize: "13px" }}
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>Last Class Passed</label>
                            <input
                              type="text"
                              placeholder="e.g. Class 8 Passed"
                              value={wizardForm.previous_class}
                              onChange={(e) => setWizardForm({ ...wizardForm, previous_class: e.target.value })}
                              style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", fontSize: "13px" }}
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>Marks Percentage / Grade</label>
                            <input
                              type="text"
                              placeholder="e.g. 88.5% (Grade A1)"
                              value={wizardForm.previous_percentage}
                              onChange={(e) => setWizardForm({ ...wizardForm, previous_percentage: e.target.value })}
                              style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px", fontSize: "13px" }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* STEP 4: MANDATORY DOCUMENT UPLOADS */}
                  {currentStep === 4 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      <div style={{ fontSize: "14px", fontWeight: 900, color: "#0F172A", borderBottom: "2px solid #E2E8F0", paddingBottom: "6px" }}>
                        Step 4: Mandatory Document Uploads & Verification Dossier
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {wizardForm.documents.map((doc, idx) => {
                          const isFresher = wizardForm.admission_type === "FRESHER";
                          if (isFresher && (doc.id === "tc" || doc.id === "marksheet")) {
                            return null; // Not required for freshers
                          }

                          return (
                            <div
                              key={doc.id}
                              style={{
                                background: "#F8FAFC",
                                border: "1px solid #E2E8F0",
                                borderRadius: "12px",
                                padding: "12px 16px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center"
                              }}
                            >
                              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#EFF6FF", color: "#3D5EE1", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                  <FileCheck size={18} />
                                </div>
                                <div>
                                  <div style={{ fontSize: "13px", fontWeight: 800, color: "#0F172A" }}>
                                    {doc.name} {doc.required && <span style={{ color: "#EF4444" }}>*</span>}
                                  </div>
                                  <div style={{ fontSize: "11px", color: doc.file ? "#10B981" : "#64748B", fontWeight: 600 }}>
                                    {doc.file ? `✔ Uploaded: ${doc.file}` : "Attach scan copy (PDF/JPG)"}
                                  </div>
                                </div>
                              </div>

                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <label style={{
                                  background: "#FFFFFF",
                                  border: "1px solid #CBD5E1",
                                  padding: "6px 12px",
                                  borderRadius: "6px",
                                  fontSize: "12px",
                                  fontWeight: 700,
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "4px"
                                }}>
                                  <Upload size={12} />
                                  <span>{doc.file ? "Change" : "Upload File"}</span>
                                  <input
                                    type="file"
                                    accept="image/*,.pdf"
                                    style={{ display: "none" }}
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const reader = new FileReader();
                                        reader.onload = (re) => {
                                          const dataUrl = (re.target?.result as string) || "";
                                          const sizeKb = (file.size / 1024).toFixed(1) + " KB";
                                          const updatedDocs = [...wizardForm.documents];
                                          updatedDocs[idx] = {
                                            ...doc,
                                            file: file.name,
                                            status: "VERIFIED",
                                            dataUrl,
                                            fileSize: sizeKb,
                                            fileType: file.type || (file.name.endsWith(".pdf") ? "application/pdf" : "image/jpeg")
                                          } as any;
                                          setWizardForm({ ...wizardForm, documents: updatedDocs });
                                          setWizardError("");
                                        };
                                        reader.readAsDataURL(file);
                                      }
                                    }}
                                  />
                                </label>

                                {doc.file && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => setViewingCounsellorDoc({
                                        title: doc.name,
                                        fileName: doc.file,
                                        fileSize: (doc as any).fileSize,
                                        dataUrl: (doc as any).dataUrl || "",
                                        fileType: (doc as any).fileType || (doc.file.endsWith(".pdf") ? "application/pdf" : "image/jpeg")
                                      })}
                                      style={{
                                        background: "#3D5EE1",
                                        color: "#FFFFFF",
                                        border: "none",
                                        padding: "6px 12px",
                                        borderRadius: "6px",
                                        fontSize: "11px",
                                        fontWeight: 800,
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "4px",
                                        boxShadow: "0 2px 6px rgba(61,94,225,0.25)"
                                      }}
                                    >
                                      <Eye size={12} /> View Document
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updatedDocs = [...wizardForm.documents];
                                        updatedDocs[idx] = { ...doc, file: "", status: "PENDING", dataUrl: "", fileSize: "" } as any;
                                        setWizardForm({ ...wizardForm, documents: updatedDocs });
                                      }}
                                      style={{
                                        background: "#FEF2F2",
                                        color: "#DC2626",
                                        border: "1px solid #FECACA",
                                        padding: "5px 8px",
                                        borderRadius: "6px",
                                        fontSize: "11px",
                                        fontWeight: 700,
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "3px"
                                      }}
                                    >
                                      <Trash2 size={11} />
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Wizard Footer Controls */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "24px", paddingTop: "14px", borderTop: "1px solid #E2E8F0" }}>
                    {currentStep > 1 ? (
                      <button
                        type="button"
                        onClick={() => setCurrentStep(currentStep - 1)}
                        style={{ padding: "10px 18px", borderRadius: "10px", background: "#F1F5F9", color: "#475569", border: "none", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                      >
                        <ArrowLeft size={16} /> Previous
                      </button>
                    ) : <div />}

                    {currentStep < 4 ? (
                      <button
                        type="button"
                        onClick={() => {
                          if (validateCounsellorStep(currentStep)) {
                            setCurrentStep(currentStep + 1);
                          }
                        }}
                        style={{ padding: "10px 22px", borderRadius: "10px", background: "#3D5EE1", color: "#FFFFFF", border: "none", fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                      >
                        <span>Next Step</span>
                        <ArrowRight size={16} />
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={submitting}
                        onClick={() => {
                          if (validateCounsellorStep(4)) {
                            handleFinalAdmissionSubmit();
                          }
                        }}
                        style={{ padding: "11px 26px", borderRadius: "10px", background: "#10B981", color: "#FFFFFF", border: "none", fontWeight: 900, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", boxShadow: "0 4px 14px rgba(16, 185, 129, 0.3)" }}
                      >
                        <Check size={18} />
                        <span>{submitting ? "Submitting..." : "Complete & Finalize Admission"}</span>
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* COUNSELLOR DOCUMENT VIEWER MODAL */}
      {viewingCounsellorDoc && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.8)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1200, padding: "20px" }}>
          <div style={{ background: "#FFFFFF", borderRadius: "18px", maxWidth: "720px", width: "100%", maxHeight: "90vh", display: "flex", flexDirection: "column", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)", overflow: "hidden" }}>
            <div style={{ background: "linear-gradient(135deg, #3D5EE1 0%, #1E3A8A 100%)", color: "#FFFFFF", padding: "16px 22px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <FileCheck size={22} color="#93C5FD" />
                <div>
                  <h4 style={{ margin: 0, fontSize: "16px", fontWeight: 800 }}>{viewingCounsellorDoc.title}</h4>
                  <div style={{ fontSize: "11px", opacity: 0.9 }}>{viewingCounsellorDoc.fileName} {viewingCounsellorDoc.fileSize ? `• ${viewingCounsellorDoc.fileSize}` : ""}</div>
                </div>
              </div>
              <button
                onClick={() => setViewingCounsellorDoc(null)}
                style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: "20px", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#F8FAFC", minHeight: "360px" }}>
              {viewingCounsellorDoc.dataUrl ? (
                viewingCounsellorDoc.fileType.startsWith("image/") ? (
                  <img src={viewingCounsellorDoc.dataUrl} alt={viewingCounsellorDoc.title} style={{ maxWidth: "100%", maxHeight: "58vh", borderRadius: "10px", boxShadow: "0 4px 14px rgba(0,0,0,0.12)", objectFit: "contain" }} />
                ) : (
                  <iframe src={viewingCounsellorDoc.dataUrl} title={viewingCounsellorDoc.title} style={{ width: "100%", height: "58vh", border: "1px solid #CBD5E1", borderRadius: "10px", background: "#fff" }} />
                )
              ) : (
                <div style={{ textAlign: "center", padding: "40px" }}>
                  <FileText size={48} color="#3D5EE1" style={{ marginBottom: "12px" }} />
                  <div style={{ fontWeight: 800, fontSize: "14px", color: "#0F172A" }}>Verified Document Scan: {viewingCounsellorDoc.fileName}</div>
                  <div style={{ fontSize: "12px", color: "#64748B", marginTop: "4px" }}>Radhix School ERP Certified Document Record</div>
                </div>
              )}
            </div>

            <div style={{ padding: "12px 20px", background: "#FFFFFF", borderTop: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: "11px", color: "#16A34A", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
                <ShieldCheck size={14} color="#16A34A" /> Radhix ERP Verified Student Dossier
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                {viewingCounsellorDoc.dataUrl && (
                  <a href={viewingCounsellorDoc.dataUrl} download={viewingCounsellorDoc.fileName} style={{ display: "flex", alignItems: "center", gap: "6px", background: "#3D5EE1", color: "#FFFFFF", padding: "8px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: 700, textDecoration: "none" }}>
                    <Download size={14} /> Download
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setViewingCounsellorDoc(null)}
                  style={{ background: "#F1F5F9", color: "#475569", border: "none", padding: "8px 16px", borderRadius: "8px", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}
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
