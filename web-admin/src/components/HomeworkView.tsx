import React, { useState, useEffect } from "react";
import {
  BookOpen,
  FileText,
  CheckCircle2,
  Clock,
  Plus,
  Calendar,
  User,
  Search,
  Eye,
  Award,
  ExternalLink,
  X,
  AlertCircle,
  Paperclip,
  Check,
  Send,
  Filter
} from "lucide-react";

interface Props {
  token: string | null;
  institute?: any;
}

export const HomeworkView: React.FC<Props> = ({ token, institute }) => {
  const [homeworkList, setHomeworkList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterSubject, setFilterSubject] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Assign Homework Modal
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [isSubmittingNew, setIsSubmittingNew] = useState<boolean>(false);
  const [newSubject, setNewSubject] = useState<string>("Mathematics");
  const [newClass, setNewClass] = useState<string>("Class 10");
  const [newSection, setNewSection] = useState<string>("Section A");
  const [newTitle, setNewTitle] = useState<string>("");
  const [newDescription, setNewDescription] = useState<string>("");
  const [newDueDate, setNewDueDate] = useState<string>("");
  const [newAttachmentUrl, setNewAttachmentUrl] = useState<string>("");

  // View Submissions Modal
  const [selectedHomework, setSelectedHomework] = useState<any | null>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState<boolean>(false);

  // Grade Modal / State
  const [gradingSubmission, setGradingSubmission] = useState<any | null>(null);
  const [marksInput, setMarksInput] = useState<string>("10 / 10");
  const [remarksInput, setRemarksInput] = useState<string>("Excellent work! Verified & checked.");
  const [isGrading, setIsGrading] = useState<boolean>(false);

  // Success Notification
  const [bannerMsg, setBannerMsg] = useState<string | null>(null);

  useEffect(() => {
    loadHomework();
  }, [token, institute]);

  const showNotification = (msg: string) => {
    setBannerMsg(msg);
    setTimeout(() => setBannerMsg(null), 4000);
  };

  const loadHomework = async () => {
    setLoading(true);
    try {
      const instParam = institute?.id ? `?institute_id=${encodeURIComponent(institute.id)}` : "";
      const res = await fetch(`http://localhost:5000/api/v1/homework/all${instParam}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        setHomeworkList(data.data);
      } else {
        // Fallback demo data if tenant has 0 homework
        setHomeworkList([
          {
            id: "hw-phys-01",
            subject: "Physics",
            title: "Ray Optics & Mirror Formula Numerical",
            description: "Solve NCERT Chapter 10 Questions 1 to 15 in homework notebook. Draw ray diagrams neatly with pencil.",
            class_name: "Class 10",
            section_name: "Section A",
            teacher_name: "Sunita Sharma",
            assigned_date: "2026-10-09",
            due_date: "2026-10-14",
            total_submissions: 38,
            evaluated_count: 32,
            pending_evaluation: 6,
          },
          {
            id: "hw-math-02",
            subject: "Mathematics",
            title: "Quadratic Equations Exercise 4.3",
            description: "Complete all word problems based on speed, distance and time.",
            class_name: "Class 10",
            section_name: "Section A",
            teacher_name: "R. K. Verma",
            assigned_date: "2026-10-08",
            due_date: "2026-10-15",
            total_submissions: 40,
            evaluated_count: 28,
            pending_evaluation: 12,
          },
          {
            id: "hw-eng-03",
            subject: "English Literature",
            title: "First Flight: Letter to God Character Sketch",
            description: "Write character sketch of Lencho and answer long answer questions in 120 words.",
            class_name: "Class 10",
            section_name: "Section A",
            teacher_name: "Anjali Sen",
            assigned_date: "2026-10-06",
            due_date: "2026-10-16",
            total_submissions: 36,
            evaluated_count: 36,
            pending_evaluation: 0,
          },
        ]);
      }
    } catch (err) {
      console.error("Failed to load homework:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHomework = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim() || !newDueDate) {
      alert("Please fill in all required fields (Title, Description, Due Date).");
      return;
    }

    setIsSubmittingNew(true);
    try {
      const res = await fetch("http://localhost:5000/api/v1/homework/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          institute_id: institute?.id,
          class_name: newClass,
          section_name: newSection,
          subject: newSubject,
          title: newTitle,
          description: newDescription,
          due_date: newDueDate,
          attachment_url: newAttachmentUrl.trim() || null,
        }),
      });
      const result = await res.json();
      if (result.success) {
        showNotification("Curriculum Assignment published and dispatched to student class portal!");
        setShowCreateModal(false);
        setNewTitle("");
        setNewDescription("");
        setNewDueDate("");
        setNewAttachmentUrl("");
        loadHomework();
      } else {
        alert(result.message || "Failed to create homework");
      }
    } catch {
      alert("Error connecting to server");
    } finally {
      setIsSubmittingNew(false);
    }
  };

  const openSubmissionsModal = async (hw: any) => {
    setSelectedHomework(hw);
    setLoadingSubmissions(true);
    try {
      const res = await fetch(`http://localhost:5000/api/v1/homework/${hw.id}/submissions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        setSubmissions(data.data);
      } else {
        // High fidelity demo submissions for review
        setSubmissions([
          {
            id: "sub-01",
            student_name: "Aarav Kumar (DPS-2026-001)",
            submission_text: "Completed all textbook numerical questions in fair physics notebook with ray diagrams.",
            file_name: "aarav_kumar_physics_exercise.pdf",
            file_url: "#",
            submitted_at: "2026-10-09 17:30",
            status: "SUBMITTED",
            marks_obtained: null,
            teacher_remarks: null,
          },
          {
            id: "sub-02",
            student_name: "Aanya Verma (DPS-2026-002)",
            submission_text: "Checked solutions verified with formulas.",
            file_name: "aanya_verma_homework.jpg",
            file_url: "#",
            submitted_at: "2026-10-09 16:45",
            status: "CHECKED",
            marks_obtained: "10 / 10",
            teacher_remarks: "Excellent work! Neat diagrams.",
          },
          {
            id: "sub-03",
            student_name: "Dev Malhotra (DPS-2026-004)",
            submission_text: "Submitted assignment on time.",
            file_name: "dev_malhotra_notes.pdf",
            file_url: "#",
            submitted_at: "2026-10-09 18:10",
            status: "SUBMITTED",
            marks_obtained: null,
            teacher_remarks: null,
          },
        ]);
      }
    } catch {
      console.error("Failed to load submissions");
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const handleGradeSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSubmission) return;

    setIsGrading(true);
    try {
      const res = await fetch("http://localhost:5000/api/v1/homework/grade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          submission_id: gradingSubmission.id,
          marks_obtained: marksInput,
          teacher_remarks: remarksInput,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`Graded for ${gradingSubmission.student_name}! Marks: ${marksInput}`);
        setSubmissions((prev) =>
          prev.map((sub) =>
            sub.id === gradingSubmission.id
              ? { ...sub, status: "CHECKED", marks_obtained: marksInput, teacher_remarks: remarksInput }
              : sub
          )
        );
        setGradingSubmission(null);
        loadHomework();
      }
    } catch {
      alert("Error grading homework");
    } finally {
      setIsGrading(false);
    }
  };

  // Metrics
  const totalHomework = homeworkList.length;
  const totalSubmissions = homeworkList.reduce((acc, hw) => acc + (hw.total_submissions || 0), 0);
  const totalEvaluated = homeworkList.reduce((acc, hw) => acc + (hw.evaluated_count || 0), 0);
  const pendingReview = totalSubmissions - totalEvaluated;

  // Filtering
  const subjectsList = ["ALL", "Mathematics", "Physics", "Science", "English", "Social Science", "Hindi"];
  const filteredList = homeworkList.filter((hw) => {
    const matchSubject = filterSubject === "ALL" || (hw.subject || "").toLowerCase().includes(filterSubject.toLowerCase());
    const matchSearch =
      !searchQuery.trim() ||
      (hw.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (hw.subject || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (hw.class_name || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchSubject && matchSearch;
  });

  return (
    <div style={{ padding: "28px", maxWidth: "1350px", margin: "0 auto" }}>
      {/* Toast Notification */}
      {bannerMsg && (
        <div style={{
          padding: "14px 20px",
          background: "#ECFDF5",
          border: "1px solid #A7F3D0",
          color: "#065F46",
          borderRadius: "14px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "20px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          fontWeight: 700,
          fontSize: "14px"
        }}>
          <CheckCircle2 size={18} color="#059669" />
          <span>{bannerMsg}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div style={{
        background: "#FFFFFF",
        borderRadius: "16px",
        padding: "24px 28px",
        border: "1px solid #E2E8F0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "24px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.03)"
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <h1 style={{ fontSize: "22px", fontWeight: 900, color: "#0F172A", margin: 0 }}>
              Homework & Assignments
            </h1>
            <span style={{
              fontSize: "11px",
              fontWeight: 800,
              padding: "4px 10px",
              background: "#EEF2FF",
              color: "#4338CA",
              borderRadius: "12px",
              border: "1px solid #E0E7FF"
            }}>
              Homework & Curriculum Registry
            </span>
          </div>
          <p style={{ margin: 0, color: "#64748B", fontSize: "13px" }}>
            Assign class homework, review student uploaded solution notebooks, and award grades in real time.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            background: "linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)",
            color: "#fff",
            border: "none",
            padding: "12px 20px",
            borderRadius: "12px",
            fontWeight: 800,
            fontSize: "13px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)"
          }}
        >
          <Plus size={18} />
          <span>+ Assign New Homework</span>
        </button>
      </div>

      {/* 4 Metric Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "16px",
        marginBottom: "24px"
      }}>
        {/* Metric 1 */}
        <div style={{
          background: "#FFFFFF",
          borderRadius: "14px",
          padding: "18px 20px",
          border: "1px solid #E2E8F0",
          borderTop: "4px solid #3B82F6",
          boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "11px", fontWeight: 800, color: "#64748B", textTransform: "uppercase" }}>Total Homework</span>
            <div style={{ padding: "6px", background: "#EFF6FF", borderRadius: "8px", color: "#2563EB" }}>
              <BookOpen size={16} />
            </div>
          </div>
          <div style={{ fontSize: "26px", fontWeight: 900, color: "#0F172A" }}>{totalHomework}</div>
          <div style={{ fontSize: "12px", color: "#64748B", marginTop: "4px" }}>Assigned across all classes</div>
        </div>

        {/* Metric 2 */}
        <div style={{
          background: "#FFFFFF",
          borderRadius: "14px",
          padding: "18px 20px",
          border: "1px solid #E2E8F0",
          borderTop: "4px solid #06B6D4",
          boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "11px", fontWeight: 800, color: "#64748B", textTransform: "uppercase" }}>Submissions Received</span>
            <div style={{ padding: "6px", background: "#ECFEFF", borderRadius: "8px", color: "#0891B2" }}>
              <FileText size={16} />
            </div>
          </div>
          <div style={{ fontSize: "26px", fontWeight: 900, color: "#0F172A" }}>{totalSubmissions}</div>
          <div style={{ fontSize: "12px", color: "#64748B", marginTop: "4px" }}>Uploaded by students</div>
        </div>

        {/* Metric 3 */}
        <div style={{
          background: "#FFFFFF",
          borderRadius: "14px",
          padding: "18px 20px",
          border: "1px solid #E2E8F0",
          borderTop: "4px solid #10B981",
          boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "11px", fontWeight: 800, color: "#64748B", textTransform: "uppercase" }}>Graded & Checked</span>
            <div style={{ padding: "6px", background: "#ECFDF5", borderRadius: "8px", color: "#059669" }}>
              <Award size={16} />
            </div>
          </div>
          <div style={{ fontSize: "26px", fontWeight: 900, color: "#059669" }}>{totalEvaluated}</div>
          <div style={{ fontSize: "12px", color: "#64748B", marginTop: "4px" }}>Marks & remarks awarded</div>
        </div>

        {/* Metric 4 */}
        <div style={{
          background: "#FFFFFF",
          borderRadius: "14px",
          padding: "18px 20px",
          border: "1px solid #E2E8F0",
          borderTop: "4px solid #F59E0B",
          boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "11px", fontWeight: 800, color: "#64748B", textTransform: "uppercase" }}>Pending Evaluation</span>
            <div style={{ padding: "6px", background: "#FFFBEB", borderRadius: "8px", color: "#D97706" }}>
              <Clock size={16} />
            </div>
          </div>
          <div style={{ fontSize: "26px", fontWeight: 900, color: "#D97706" }}>{pendingReview}</div>
          <div style={{ fontSize: "12px", color: "#64748B", marginTop: "4px" }}>Awaiting teacher review</div>
        </div>
      </div>

      {/* Filter Chips Bar & Search */}
      <div style={{
        background: "#FFFFFF",
        borderRadius: "14px",
        padding: "14px 20px",
        border: "1px solid #E2E8F0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
        flexWrap: "wrap",
        gap: "14px"
      }}>
        {/* Subject Filter Chips */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "12px", fontWeight: 800, color: "#64748B", marginRight: "4px" }}>
            <Filter size={14} style={{ display: "inline", marginRight: "4px" }} /> Subjects:
          </span>
          {subjectsList.map((sub) => {
            const isSel = filterSubject === sub;
            return (
              <button
                key={sub}
                onClick={() => setFilterSubject(sub)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: 700,
                  border: `1.5px solid ${isSel ? "#4F46E5" : "#E2E8F0"}`,
                  background: isSel ? "#EEF2FF" : "#F8FAFC",
                  color: isSel ? "#4338CA" : "#475569",
                  cursor: "pointer",
                  transition: "all 0.15s"
                }}
              >
                {sub}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div style={{ position: "relative", minWidth: "260px" }}>
          <Search size={16} color="#94A3B8" style={{ position: "absolute", left: "12px", top: "10px" }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search title, chapter, or class..."
            style={{
              width: "100%",
              padding: "8px 14px 8px 36px",
              borderRadius: "10px",
              border: "1px solid #CBD5E1",
              fontSize: "13px",
              outline: "none"
            }}
          />
        </div>
      </div>

      {/* Homework List */}
      {filteredList.length === 0 ? (
        <div style={{
          background: "#FFFFFF",
          borderRadius: "16px",
          padding: "48px 24px",
          textAlign: "center",
          border: "1px solid #E2E8F0"
        }}>
          <div style={{ width: "54px", height: "54px", borderRadius: "50%", background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px auto", color: "#64748B" }}>
            <BookOpen size={24} />
          </div>
          <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#0F172A", margin: "0 0 6px 0" }}>No Homework Found</h3>
          <p style={{ fontSize: "13px", color: "#64748B", margin: "0 0 16px 0" }}>No assignments match your search filter or this class.</p>
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              background: "#4F46E5",
              color: "#fff",
              border: "none",
              padding: "10px 18px",
              borderRadius: "10px",
              fontWeight: 700,
              fontSize: "13px",
              cursor: "pointer"
            }}
          >
            + Create First Assignment
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: "18px" }}>
          {filteredList.map((hw) => {
            const isDone = (hw.evaluated_count || 0) >= (hw.total_submissions || 0) && (hw.total_submissions || 0) > 0;
            return (
              <div
                key={hw.id}
                style={{
                  background: "#FFFFFF",
                  borderRadius: "16px",
                  padding: "22px",
                  border: "1px solid #E2E8F0",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                  transition: "transform 0.15s, box-shadow 0.15s"
                }}
              >
                <div>
                  {/* Top Badges */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <span style={{
                        padding: "4px 10px",
                        background: "#EEF2FF",
                        color: "#4338CA",
                        borderRadius: "8px",
                        fontWeight: 800,
                        fontSize: "11px"
                      }}>
                        {hw.subject}
                      </span>
                      <span style={{ fontSize: "12px", color: "#64748B", fontWeight: 700 }}>
                        {hw.class_name} • {hw.section_name}
                      </span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#EF4444", fontWeight: 700 }}>
                      <Calendar size={13} />
                      <span>Due: {hw.due_date}</span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#0F172A", margin: "0 0 8px 0" }}>
                    {hw.title}
                  </h3>
                  <p style={{ fontSize: "13px", color: "#475569", lineHeight: "1.5", margin: "0 0 16px 0" }}>
                    {hw.description}
                  </p>
                </div>

                {/* Bottom Stats & Action Button */}
                <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: "14px", marginTop: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <div style={{ fontSize: "12px", color: "#64748B" }}>
                      Teacher: <strong style={{ color: "#334155" }}>{hw.teacher_name || "Faculty"}</strong>
                    </div>
                    <div style={{
                      fontSize: "11px",
                      fontWeight: 800,
                      padding: "3px 8px",
                      borderRadius: "6px",
                      background: isDone ? "#DCFCE7" : "#FEF3C7",
                      color: isDone ? "#16A34A" : "#B45309"
                    }}>
                      {hw.total_submissions || 0} Submissions ({hw.evaluated_count || 0} Evaluated)
                    </div>
                  </div>

                  <button
                    onClick={() => openSubmissionsModal(hw)}
                    style={{
                      width: "100%",
                      background: "#F8FAFC",
                      border: "1.5px solid #CBD5E1",
                      padding: "10px",
                      borderRadius: "10px",
                      fontWeight: 800,
                      fontSize: "13px",
                      color: "#334155",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px"
                    }}
                  >
                    <Eye size={16} color="#4F46E5" />
                    <span>Review Student Submissions & Assessment</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 1. Modal: Assign New Homework */}
      {showCreateModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15, 23, 42, 0.6)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "20px"
        }}>
          <div style={{
            background: "#FFFFFF",
            borderRadius: "16px",
            maxWidth: "520px",
            width: "100%",
            padding: "28px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <BookOpen size={20} color="#4F46E5" />
                <h3 style={{ fontSize: "18px", fontWeight: 900, color: "#0F172A", margin: 0 }}>Assign New Homework</h3>
              </div>
              <button onClick={() => setShowCreateModal(false)} style={{ background: "transparent", border: "none", fontSize: "22px", cursor: "pointer", color: "#64748B" }}>×</button>
            </div>

            <form onSubmit={handleCreateHomework} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155", display: "block", marginBottom: "4px" }}>Subject*</label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", fontWeight: 600 }}
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="English Literature">English Literature</option>
                    <option value="Social Science">Social Science</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Computer Science">Computer Science</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155", display: "block", marginBottom: "4px" }}>Class & Section</label>
                  <select
                    value={`${newClass}-${newSection}`}
                    onChange={(e) => {
                      const [c, s] = e.target.value.split("-");
                      setNewClass(c);
                      setNewSection(s);
                    }}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", fontWeight: 600 }}
                  >
                    <option value="Class 10-Section A">Class 10 - Section A</option>
                    <option value="Class 10-Section B">Class 10 - Section B</option>
                    <option value="Class 9-Section A">Class 9 - Section A</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155", display: "block", marginBottom: "4px" }}>Homework Title*</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Chapter 4 Quadratic Equations Numerical 1-15"
                  style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155", display: "block", marginBottom: "4px" }}>Instructions & Questions*</label>
                <textarea
                  required
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Mention questions, submission format, and instructions for students..."
                  style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", resize: "vertical" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155", display: "block", marginBottom: "4px" }}>Submission Due Date*</label>
                <input
                  type="date"
                  required
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{ background: "#F1F5F9", border: "none", padding: "10px 18px", borderRadius: "8px", fontWeight: 700, color: "#475569", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingNew}
                  style={{ background: "#2563EB", border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: 700, color: "#fff", cursor: "pointer" }}
                >
                  {isSubmittingNew ? "Saving..." : "Publish Homework"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Modal: View Student Submissions */}
      {selectedHomework && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15, 23, 42, 0.6)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "20px"
        }}>
          <div style={{
            background: "#FFFFFF",
            borderRadius: "16px",
            maxWidth: "680px",
            width: "100%",
            maxHeight: "85vh",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)"
          }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ fontSize: "17px", fontWeight: 900, color: "#0F172A", margin: 0 }}>
                  Student Submissions • {selectedHomework.title}
                </h3>
                <div style={{ fontSize: "12px", color: "#64748B", marginTop: "2px" }}>
                  {selectedHomework.subject} • Due Date: {selectedHomework.due_date}
                </div>
              </div>
              <button onClick={() => setSelectedHomework(null)} style={{ background: "transparent", border: "none", fontSize: "22px", cursor: "pointer", color: "#64748B" }}>×</button>
            </div>

            <div style={{ padding: "20px 24px", overflowY: "auto", flex: 1 }}>
              {loadingSubmissions ? (
                <div style={{ textAlign: "center", padding: "30px", color: "#64748B" }}>Loading submissions...</div>
              ) : submissions.length === 0 ? (
                <div style={{ textAlign: "center", padding: "30px", color: "#64748B" }}>No students have submitted yet.</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {submissions.map((sub) => {
                    const isChecked = sub.status === "CHECKED";
                    return (
                      <div
                        key={sub.id}
                        style={{
                          background: "#F8FAFC",
                          borderRadius: "12px",
                          padding: "16px",
                          border: "1px solid #E2E8F0"
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", color: "#4F46E5", fontWeight: 800, fontSize: "12px" }}>
                              <User size={16} />
                            </div>
                            <strong style={{ fontSize: "14px", color: "#0F172A" }}>{sub.student_name}</strong>
                          </div>

                          <span style={{
                            padding: "3px 8px",
                            borderRadius: "6px",
                            fontSize: "11px",
                            fontWeight: 800,
                            background: isChecked ? "#DCFCE7" : "#FEF3C7",
                            color: isChecked ? "#15803D" : "#B45309"
                          }}>
                            {isChecked ? "● CHECKED" : "● AWAITING EVALUATION"}
                          </span>
                        </div>

                        <p style={{ fontSize: "13px", color: "#475569", margin: "0 0 10px 0" }}>
                          {sub.submission_text}
                        </p>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #E2E8F0", paddingTop: "10px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#4F46E5", fontWeight: 700 }}>
                            <Paperclip size={14} />
                            <span>{sub.file_name || "homework_solution_file.pdf"}</span>
                          </div>

                          {isChecked ? (
                            <div style={{ fontSize: "12px", color: "#16A34A", fontWeight: 800 }}>
                              Score: {sub.marks_obtained} • "{sub.teacher_remarks}"
                            </div>
                          ) : (
                            <button
                              onClick={() => setGradingSubmission(sub)}
                              style={{
                                background: "#10B981",
                                color: "#fff",
                                border: "none",
                                padding: "6px 14px",
                                borderRadius: "8px",
                                fontWeight: 800,
                                fontSize: "12px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px"
                              }}
                            >
                              <Award size={14} /> Grade & Remarks
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. Modal: Grade Submission */}
      {gradingSubmission && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15, 23, 42, 0.7)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1100,
          padding: "20px"
        }}>
          <div style={{
            background: "#FFFFFF",
            borderRadius: "16px",
            maxWidth: "440px",
            width: "100%",
            padding: "24px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.25)"
          }}>
            <h3 style={{ fontSize: "17px", fontWeight: 900, color: "#0F172A", margin: "0 0 4px 0" }}>
              Award Marks & Evaluation
            </h3>
            <p style={{ fontSize: "13px", color: "#64748B", margin: "0 0 16px 0" }}>
              Student: <strong>{gradingSubmission.student_name}</strong>
            </p>

            <form onSubmit={handleGradeSubmission} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155", display: "block", marginBottom: "4px" }}>Marks Obtained (e.g. 10 / 10)</label>
                <input
                  type="text"
                  required
                  value={marksInput}
                  onChange={(e) => setMarksInput(e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155", display: "block", marginBottom: "4px" }}>Teacher Remarks / Feedback</label>
                <input
                  type="text"
                  required
                  value={remarksInput}
                  onChange={(e) => setRemarksInput(e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                <button
                  type="button"
                  onClick={() => setGradingSubmission(null)}
                  style={{ background: "#F1F5F9", border: "none", padding: "8px 14px", borderRadius: "8px", fontWeight: 700, color: "#475569", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGrading}
                  style={{ background: "#10B981", border: "none", padding: "8px 18px", borderRadius: "8px", fontWeight: 700, color: "#fff", cursor: "pointer" }}
                >
                  {isGrading ? "Saving..." : "Submit Grade"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
