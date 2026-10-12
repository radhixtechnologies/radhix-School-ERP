import { useState, useEffect } from "react";
import { Plus, School, BookOpen, Trash2, CheckCircle2, Sparkles, DoorOpen } from "lucide-react";

interface Props {
  institute: any;
  token: string | null;
}

export const AcademicsView = ({ institute, token }: Props) => {
  const isSchool = (institute?.type || institute?.institute_type) === "SCHOOL";

  // School State
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<"classes" | "subjects">("classes");
  const [newClassName, setNewClassName] = useState("");
  
  // Section modal/form
  const [selectedClassForSection, setSelectedClassForSection] = useState<string | null>(null);
  const [newSectionName, setNewSectionName] = useState("");
  const [newSectionRoom, setNewSectionRoom] = useState("");

  // Subject Form
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newSubjectCode, setNewSubjectCode] = useState("");
  const [newSubjectClassId, setNewSubjectClassId] = useState("");
  const [newSubjectType, setNewSubjectType] = useState("THEORY");

  // College State
  const [courses, setCourses] = useState<any[]>([]);
  const [newCourseName, setNewCourseName] = useState("");
  const [newCourseCode, setNewCourseCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [quickSetupLoading, setQuickSetupLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    loadAcademics();
  }, [institute]);

  const showNotification = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(""), 4000);
  };

  const loadAcademics = async () => {
    setLoading(true);
    try {
      if (isSchool) {
        const [cRes, sRes] = await Promise.all([
          fetch("http://localhost:5000/api/v1/academic/classes", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:5000/api/v1/academic/subjects", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        const cJson = await cRes.json();
        const sJson = await sRes.json();
        if (cJson.success) setClasses(cJson.data || []);
        if (sJson.success) setSubjects(sJson.data || []);
      } else {
        const res = await fetch("http://localhost:5000/api/v1/academic/courses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const j = await res.json();
        if (j.success) setCourses(j.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Add Single Class
  const handleAddClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;
    try {
      const res = await fetch("http://localhost:5000/api/v1/academic/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: newClassName.trim(), numeric_order: classes.length + 1 }),
      });
      const data = await res.json();
      if (data.success) {
        setNewClassName("");
        showNotification(`Class "${newClassName}" added successfully with Section A`);
        loadAcademics();
      }
    } catch {}
  };

  // Add Section to Class
  const handleAddSection = async (classId: string) => {
    if (!newSectionName.trim()) return;
    try {
      const res = await fetch(`http://localhost:5000/api/v1/academic/classes/${classId}/sections`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: newSectionName.trim().toUpperCase(), room_number: newSectionRoom.trim() || null }),
      });
      const data = await res.json();
      if (data.success) {
        setNewSectionName("");
        setNewSectionRoom("");
        setSelectedClassForSection(null);
        showNotification("New section added to class");
        loadAcademics();
      }
    } catch {}
  };

  // Delete Class
  const handleDeleteClass = async (classId: string, className: string) => {
    if (!confirm(`Are you sure you want to remove ${className} and its sections?`)) return;
    try {
      const res = await fetch(`http://localhost:5000/api/v1/academic/classes/${classId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`Class ${className} deleted`);
        loadAcademics();
      }
    } catch {}
  };

  // Delete Section
  const handleDeleteSection = async (sectionId: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/v1/academic/sections/${sectionId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        showNotification("Section removed");
        loadAcademics();
      }
    } catch {}
  };

  // Add Subject
  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;
    try {
      const res = await fetch("http://localhost:5000/api/v1/academic/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: newSubjectName.trim(),
          code: newSubjectCode.trim() || null,
          class_id: newSubjectClassId || null,
          type: newSubjectType,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNewSubjectName("");
        setNewSubjectCode("");
        showNotification(`Subject "${newSubjectName}" added successfully`);
        loadAcademics();
      }
    } catch {}
  };

  // Delete Subject
  const handleDeleteSubject = async (subjectId: string, name: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/v1/academic/subjects/${subjectId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`Subject "${name}" deleted`);
        loadAcademics();
      }
    } catch {}
  };

  // 1-Click Quick Setup for K-12 Standard Classes
  const handleQuickSetupK12 = async () => {
    if (!confirm("Quick Setup will create standard school classes (Nursery, KG, Class 1 to Class 10) with Section A. Proceed?")) return;
    setQuickSetupLoading(true);
    const standardClasses = [
      "Nursery", "LKG", "UKG",
      "Class 1", "Class 2", "Class 3", "Class 4", "Class 5",
      "Class 6", "Class 7", "Class 8", "Class 9", "Class 10"
    ];

    try {
      for (let i = 0; i < standardClasses.length; i++) {
        const clsName = standardClasses[i];
        const alreadyExists = classes.some((c) => c.name.toLowerCase() === clsName.toLowerCase());
        if (!alreadyExists) {
          await fetch("http://localhost:5000/api/v1/academic/classes", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ name: clsName, numeric_order: i + 1 }),
          });
        }
      }
      showNotification("âœ¨ Standard K-12 Classes created successfully!");
      await loadAcademics();
    } catch {} finally {
      setQuickSetupLoading(false);
    }
  };

  // College Add Course
  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseName || !newCourseCode) return;
    try {
      const res = await fetch("http://localhost:5000/api/v1/academic/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: newCourseName,
          code: newCourseCode,
          departments: [{ name: newCourseName, code: newCourseCode }],
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNewCourseName("");
        setNewCourseCode("");
        showNotification(`Course ${newCourseName} added`);
        loadAcademics();
      }
    } catch {}
  };

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
      {/* Header Banner */}
      <div style={{
        background: "linear-gradient(135deg, rgba(30, 27, 75, 0.75) 0%, rgba(15, 23, 42, 0.85) 100%)",
        border: "1px solid rgba(139, 92, 246, 0.25)",
        borderRadius: "20px",
        padding: "28px 32px",
        marginBottom: "28px",
        backdropFilter: "blur(20px)",
        boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.6)",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "20px"
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <div style={{
              background: isSchool ? "rgba(139, 92, 246, 0.2)" : "rgba(6, 182, 212, 0.2)",
              color: isSchool ? "#c084fc" : "#38bdf8",
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: "800",
              letterSpacing: "0.5px",
              border: `1px solid ${isSchool ? "rgba(139, 92, 246, 0.3)" : "rgba(6, 182, 212, 0.3)"}`
            }}>
              {isSchool ? "ðŸ« SCHOOL ERP ACADEMICS" : "ðŸŽ“ COLLEGE ERP CURRICULUM"}
            </div>
            <span style={{ fontSize: "12px", color: "#94a3b8" }}>Session 2026-2027</span>
          </div>
          <h1 style={{ fontSize: "26px", fontWeight: "900", letterSpacing: "-0.5px", color: "#f8fafc" }}>
            {isSchool ? "Classes, Sections & Subjects Master" : "Degrees, Departments & Semesters Master"}
          </h1>
          <p style={{ fontSize: "14px", color: "#94a3b8", marginTop: "4px" }}>
            {isSchool
              ? "Configure your school standard classes (Nursery to 12th), manage section allocations, and register subject curriculum."
              : "Manage undergraduate and postgraduate degree programs, branch departments, and semester schemes."}
          </p>
        </div>

        {isSchool && (
          <button
            onClick={handleQuickSetupK12}
            disabled={quickSetupLoading}
            style={{
              background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
              color: "#fff",
              padding: "12px 20px",
              borderRadius: "12px",
              fontWeight: "700",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.5)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              cursor: "pointer"
            }}
          >
            <Sparkles size={16} />
            <span>{quickSetupLoading ? "Setting up..." : "âš¡ 1-Click Setup K-12 Classes"}</span>
          </button>
        )}
      </div>

      {actionMessage && (
        <div style={{
          background: "rgba(16, 185, 129, 0.15)",
          border: "1px solid rgba(16, 185, 129, 0.3)",
          color: "#34d399",
          padding: "12px 20px",
          borderRadius: "12px",
          fontSize: "14px",
          fontWeight: "600",
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>
          <CheckCircle2 size={18} />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* School ERP Multi-tab Structure */}
      {isSchool && (
        <>
          <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
            <button
              onClick={() => setActiveSubTab("classes")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 24px",
                borderRadius: "12px",
                fontWeight: "700",
                fontSize: "14px",
                background: activeSubTab === "classes" ? "rgba(139, 92, 246, 0.25)" : "rgba(15, 23, 42, 0.6)",
                color: activeSubTab === "classes" ? "#c084fc" : "#94a3b8",
                border: activeSubTab === "classes" ? "1.5px solid #8b5cf6" : "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: activeSubTab === "classes" ? "0 0 20px rgba(139, 92, 246, 0.25)" : "none"
              }}
            >
              <School size={18} />
              <span>Classes & Sections ({classes.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab("subjects")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 24px",
                borderRadius: "12px",
                fontWeight: "700",
                fontSize: "14px",
                background: activeSubTab === "subjects" ? "rgba(139, 92, 246, 0.25)" : "rgba(15, 23, 42, 0.6)",
                color: activeSubTab === "subjects" ? "#c084fc" : "#94a3b8",
                border: activeSubTab === "subjects" ? "1.5px solid #8b5cf6" : "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: activeSubTab === "subjects" ? "0 0 20px rgba(139, 92, 246, 0.25)" : "none"
              }}
            >
              <BookOpen size={18} />
              <span>Curriculum & Subjects ({subjects.length})</span>
            </button>
          </div>

          {/* TAB 1: Classes & Sections */}
          {activeSubTab === "classes" && (
            <div>
              {/* Add Class Form */}
              <div style={{
                background: "rgba(15, 23, 42, 0.7)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "16px",
                padding: "20px 24px",
                marginBottom: "28px",
                backdropFilter: "blur(16px)"
              }}>
                <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#f8fafc", marginBottom: "12px" }}>
                  Add New School Class
                </h3>
                <form onSubmit={handleAddClass} style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <input
                    type="text"
                    placeholder="Enter Class Name (e.g. Class 1, Class 10, Nursery, UKG)"
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    className="cinematic-input"
                    style={{ flex: "1 1 300px" }}
                  />
                  <button
                    type="submit"
                    style={{
                      background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
                      color: "#fff",
                      padding: "10px 22px",
                      borderRadius: "10px",
                      fontWeight: "700",
                      fontSize: "14px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      boxShadow: "0 8px 20px -4px rgba(139, 92, 246, 0.5)"
                    }}
                  >
                    <Plus size={16} />
                    <span>Create Class</span>
                  </button>
                </form>
              </div>

              {/* Class Cards Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
                {classes.map((c) => (
                  <div
                    key={c.id}
                    style={{
                      background: "rgba(15, 23, 42, 0.7)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: "16px",
                      padding: "22px",
                      backdropFilter: "blur(16px)",
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between"
                    }}
                  >
                    <div>
                      {/* Class Title & Student Badge */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                        <div>
                          <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#f8fafc" }}>{c.name}</h3>
                          <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>
                            Standard Level #{c.numeric_order || 1}
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{
                            fontSize: "12px",
                            fontWeight: "800",
                            color: "#c084fc",
                            background: "rgba(139, 92, 246, 0.15)",
                            border: "1px solid rgba(139, 92, 246, 0.3)",
                            padding: "4px 10px",
                            borderRadius: "20px"
                          }}>
                            {c.student_count || 0} Students
                          </span>
                          <button
                            onClick={() => handleDeleteClass(c.id, c.name)}
                            title="Delete Class"
                            style={{
                              background: "rgba(239, 68, 68, 0.1)",
                              color: "#f87171",
                              padding: "6px",
                              borderRadius: "8px",
                              border: "1px solid rgba(239, 68, 68, 0.2)"
                            }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>

                      {/* Sections List */}
                      <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.06)", paddingTop: "14px", marginBottom: "16px" }}>
                        <div style={{ fontSize: "12px", fontWeight: "700", color: "#94a3b8", marginBottom: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
                          <DoorOpen size={14} color="#8b5cf6" />
                          <span>SECTIONS ALLOCATED:</span>
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                          {c.sections && c.sections.length > 0 ? (
                            c.sections.map((s: any) => (
                              <div
                                key={s.id}
                                style={{
                                  background: "rgba(30, 41, 59, 0.8)",
                                  border: "1px solid rgba(255, 255, 255, 0.08)",
                                  padding: "6px 12px",
                                  borderRadius: "8px",
                                  fontSize: "12px",
                                  fontWeight: "700",
                                  color: "#e2e8f0",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px"
                                }}
                              >
                                <span>Sec {s.name}</span>
                                {s.room_number && (
                                  <span style={{ fontSize: "10px", color: "#94a3b8" }}>Rm {s.room_number}</span>
                                )}
                                {c.sections.length > 1 && (
                                  <button
                                    onClick={() => handleDeleteSection(s.id)}
                                    title="Delete section"
                                    style={{ background: "transparent", color: "#94a3b8", padding: "0" }}
                                  >
                                    Ã—
                                  </button>
                                )}
                              </div>
                            ))
                          ) : (
                            <span style={{ fontSize: "12px", color: "#64748b" }}>Section A (Default)</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Add Section Action on Card */}
                    <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.06)", paddingTop: "12px" }}>
                      {selectedClassForSection === c.id ? (
                        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                          <input
                            type="text"
                            placeholder="Section (B, C, Red)"
                            value={newSectionName}
                            onChange={(e) => setNewSectionName(e.target.value)}
                            className="cinematic-input"
                            style={{ flex: 1, padding: "6px 10px", fontSize: "12px" }}
                          />
                          <input
                            type="text"
                            placeholder="Room#"
                            value={newSectionRoom}
                            onChange={(e) => setNewSectionRoom(e.target.value)}
                            className="cinematic-input"
                            style={{ width: "70px", padding: "6px 10px", fontSize: "12px" }}
                          />
                          <button
                            onClick={() => handleAddSection(c.id)}
                            style={{
                              background: "#8b5cf6",
                              color: "#fff",
                              padding: "6px 12px",
                              borderRadius: "8px",
                              fontSize: "12px",
                              fontWeight: "700"
                            }}
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setSelectedClassForSection(null)}
                            style={{
                              background: "rgba(255, 255, 255, 0.08)",
                              color: "#94a3b8",
                              padding: "6px 10px",
                              borderRadius: "8px",
                              fontSize: "12px"
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedClassForSection(c.id);
                            setNewSectionName("");
                            setNewSectionRoom("");
                          }}
                          style={{
                            background: "rgba(139, 92, 246, 0.1)",
                            color: "#c084fc",
                            border: "1px dashed rgba(139, 92, 246, 0.3)",
                            width: "100%",
                            padding: "8px",
                            borderRadius: "8px",
                            fontSize: "12px",
                            fontWeight: "700",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px"
                          }}
                        >
                          <Plus size={14} />
                          <span>+ Add Section (e.g. B, C)</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {classes.length === 0 && !loading && (
                <div style={{
                  background: "rgba(15, 23, 42, 0.5)",
                  border: "1px dashed rgba(255, 255, 255, 0.15)",
                  borderRadius: "16px",
                  padding: "48px 24px",
                  textAlign: "center"
                }}>
                  <School size={48} color="#8b5cf6" style={{ margin: "0 auto 16px" }} />
                  <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#f8fafc" }}>No Classes Created Yet</h3>
                  <p style={{ fontSize: "14px", color: "#94a3b8", maxWidth: "460px", margin: "8px auto 20px" }}>
                    Get started by adding your school classes manually or click the Quick Setup button above to generate standard K-12 classes instantly!
                  </p>
                  <button
                    onClick={handleQuickSetupK12}
                    style={{
                      background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
                      color: "#fff",
                      padding: "12px 24px",
                      borderRadius: "12px",
                      fontWeight: "700",
                      fontSize: "14px"
                    }}
                  >
                    âš¡ Auto-Generate Nursery to Class 10
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Subjects & Curriculum */}
          {activeSubTab === "subjects" && (
            <div>
              {/* Add Subject Form */}
              <div style={{
                background: "rgba(15, 23, 42, 0.7)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "16px",
                padding: "22px 26px",
                marginBottom: "28px",
                backdropFilter: "blur(16px)"
              }}>
                <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#f8fafc", marginBottom: "14px" }}>
                  Add Subject to Curriculum
                </h3>
                <form onSubmit={handleAddSubject} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
                  <input
                    type="text"
                    required
                    placeholder="Subject Name (e.g. Mathematics, Science)"
                    value={newSubjectName}
                    onChange={(e) => setNewSubjectName(e.target.value)}
                    className="cinematic-input"
                  />
                  <input
                    type="text"
                    placeholder="Subject Code (e.g. MATH101)"
                    value={newSubjectCode}
                    onChange={(e) => setNewSubjectCode(e.target.value.toUpperCase())}
                    className="cinematic-input"
                  />
                  <select
                    value={newSubjectClassId}
                    onChange={(e) => setNewSubjectClassId(e.target.value)}
                    className="cinematic-input"
                  >
                    <option value="">Applicable to: All Classes</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <select
                    value={newSubjectType}
                    onChange={(e) => setNewSubjectType(e.target.value)}
                    className="cinematic-input"
                  >
                    <option value="THEORY">Theory Subject</option>
                    <option value="PRACTICAL">Practical / Lab</option>
                    <option value="CO_CURRICULAR">Co-Curricular / Activity</option>
                  </select>
                  <button
                    type="submit"
                    style={{
                      background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
                      color: "#fff",
                      padding: "10px 20px",
                      borderRadius: "10px",
                      fontWeight: "700",
                      fontSize: "14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px"
                    }}
                  >
                    <Plus size={16} />
                    <span>Add Subject</span>
                  </button>
                </form>
              </div>

              {/* Subjects List */}
              <div style={{
                background: "rgba(15, 23, 42, 0.7)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "16px",
                overflow: "hidden",
                backdropFilter: "blur(16px)"
              }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
                  <thead>
                    <tr style={{ background: "rgba(30, 41, 59, 0.5)", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", color: "#94a3b8" }}>
                      <th style={{ padding: "16px 20px", fontWeight: "700" }}>Subject Name</th>
                      <th style={{ padding: "16px 20px", fontWeight: "700" }}>Code</th>
                      <th style={{ padding: "16px 20px", fontWeight: "700" }}>Type</th>
                      <th style={{ padding: "16px 20px", fontWeight: "700" }}>Assigned Class</th>
                      <th style={{ padding: "16px 20px", fontWeight: "700", textAlign: "right" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjects.map((sub) => {
                      const assignedClass = classes.find((c) => c.id === sub.class_id);
                      return (
                        <tr key={sub.id} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.04)", color: "#f8fafc" }}>
                          <td style={{ padding: "14px 20px", fontWeight: "700" }}>{sub.name}</td>
                          <td style={{ padding: "14px 20px", color: "#94a3b8" }}>{sub.code || "â€”"}</td>
                          <td style={{ padding: "14px 20px" }}>
                            <span style={{
                              background: sub.type === "PRACTICAL" ? "rgba(6, 182, 212, 0.15)" : "rgba(139, 92, 246, 0.15)",
                              color: sub.type === "PRACTICAL" ? "#38bdf8" : "#c084fc",
                              padding: "3px 8px",
                              borderRadius: "6px",
                              fontSize: "11px",
                              fontWeight: "700"
                            }}>
                              {sub.type}
                            </span>
                          </td>
                          <td style={{ padding: "14px 20px", color: "#cbd5e1" }}>
                            {assignedClass ? assignedClass.name : "Universal (All Classes)"}
                          </td>
                          <td style={{ padding: "14px 20px", textAlign: "right" }}>
                            <button
                              onClick={() => handleDeleteSubject(sub.id, sub.name)}
                              style={{
                                background: "rgba(239, 68, 68, 0.1)",
                                color: "#f87171",
                                padding: "6px 10px",
                                borderRadius: "8px",
                                border: "1px solid rgba(239, 68, 68, 0.2)",
                                fontSize: "12px",
                                fontWeight: "600"
                              }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {subjects.length === 0 && (
                  <div style={{ padding: "36px", textAlign: "center", color: "#64748b" }}>
                    No subjects registered yet. Add common subjects like Mathematics, English, Science above.
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* College ERP View */}
      {!isSchool && (
        <div>
          <div style={{
            background: "rgba(15, 23, 42, 0.7)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "16px",
            padding: "20px 24px",
            marginBottom: "28px"
          }}>
            <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#f8fafc", marginBottom: "12px" }}>
              Add Degree / Program
            </h3>
            <form onSubmit={handleAddCourse} style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <input
                type="text"
                placeholder="Course Name (e.g. Master of Business Administration)"
                value={newCourseName}
                onChange={(e) => setNewCourseName(e.target.value)}
                className="cinematic-input"
                style={{ flex: "2 1 300px" }}
              />
              <input
                type="text"
                placeholder="Code (e.g. MBA, BTECH)"
                value={newCourseCode}
                onChange={(e) => setNewCourseCode(e.target.value.toUpperCase())}
                className="cinematic-input"
                style={{ flex: "1 1 140px" }}
              />
              <button
                type="submit"
                style={{
                  background: "linear-gradient(135deg, #0284c7, #06b6d4)",
                  color: "#fff",
                  padding: "10px 22px",
                  borderRadius: "10px",
                  fontWeight: "700",
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <Plus size={16} />
                <span>Add Course</span>
              </button>
            </form>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "20px" }}>
            {courses.map((crs) => (
              <div
                key={crs.id}
                style={{
                  background: "rgba(15, 23, 42, 0.7)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "16px",
                  padding: "22px",
                  backdropFilter: "blur(16px)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <div>
                    <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#f8fafc" }}>{crs.name}</h3>
                    <div style={{ fontSize: "12px", color: "#94a3b8" }}>{crs.duration_years} Years Duration</div>
                  </div>
                  <span style={{
                    fontSize: "12px",
                    fontWeight: "800",
                    color: "#38bdf8",
                    background: "rgba(6, 182, 212, 0.15)",
                    padding: "4px 10px",
                    borderRadius: "20px"
                  }}>
                    {crs.code}
                  </span>
                </div>
                <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.06)", paddingTop: "12px" }}>
                  <div style={{ fontSize: "12px", fontWeight: "700", color: "#94a3b8", marginBottom: "8px" }}>
                    DEPARTMENTS & SEMESTERS:
                  </div>
                  {crs.departments?.map((d: any) => (
                    <div key={d.id} style={{ fontSize: "13px", color: "#cbd5e1", marginBottom: "4px" }}>
                      â€¢ <strong>{d.name} ({d.code})</strong> â€” {d.semesters?.length || 8} Semesters
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
