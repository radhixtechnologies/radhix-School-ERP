import React, { useState, useEffect } from "react";
import {
  Video,
  Radio,
  Plus,
  Search,
  Filter,
  ExternalLink,
  Calendar,
  Clock,
  Users,
  BookOpen,
  CheckCircle2,
  Copy,
  Trash2,
  Play,
  Check,
  Sparkles,
  School,
  Share2
} from "lucide-react";

interface Props {
  token: string;
  institute: any;
}

export const OnlineClassesView: React.FC<Props> = ({ token, institute }) => {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [classFilter, setClassFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    class_name: "Class 10",
    section_name: "Section A",
    subject_name: "Mathematics",
    teacher_name: "Sunita Sharma",
    topic: "",
    class_date: new Date().toISOString().split("T")[0],
    start_time: "10:30 AM",
    end_time: "11:30 AM",
    platform: "GOOGLE_MEET",
    meeting_link: "https://meet.google.com/dpa-math-live",
    passcode: "",
    instructions: "Students must join with NCERT textbook, notebooks, and webcam enabled.",
  });

  useEffect(() => {
    loadClasses();
  }, [token]);

  const loadClasses = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/v1/school-features/online-classes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) setClasses(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/v1/school-features/online-classes", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (json.success) {
        alert(json.message);
        setShowModal(false);
        setFormData({ ...formData, topic: "" });
        loadClasses();
      } else {
        alert(json.message || "Failed to schedule class");
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/v1/school-features/online-classes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        loadClasses();
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this online class?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/v1/school-features/online-classes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) {
        loadClasses();
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleCopyLink = (id: string, link: string) => {
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filtered = classes.filter((c) => {
    const matchStatus = statusFilter === "ALL" || c.status === statusFilter;
    const matchClass = classFilter === "ALL" || c.class_name.toLowerCase().includes(classFilter.toLowerCase());
    const matchSearch = search.trim() === "" ||
      c.topic.toLowerCase().includes(search.toLowerCase()) ||
      c.subject_name.toLowerCase().includes(search.toLowerCase()) ||
      c.teacher_name.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchClass && matchSearch;
  });

  const liveClassesCount = classes.filter((c) => c.status === "LIVE").length;
  const scheduledCount = classes.filter((c) => c.status === "SCHEDULED").length;
  const completedCount = classes.filter((c) => c.status === "COMPLETED").length;

  return (
    <div style={{ padding: "32px", background: "#F8FAFC", minHeight: "100vh" }}>
      {/* Top Banner */}
      <div style={{
        background: "linear-gradient(135deg, #09090b 0%, #1e1b4b 50%, #312e81 100%)",
        borderRadius: "20px",
        padding: "32px",
        color: "#FFFFFF",
        marginBottom: "28px",
        boxShadow: "0 10px 25px -5px rgba(30, 27, 75, 0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "20px"
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <span style={{
              background: liveClassesCount > 0 ? "#EF4444" : "rgba(255,255,255,0.2)",
              padding: "4px 10px",
              borderRadius: "20px",
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "0.5px",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px"
            }}>
              {liveClassesCount > 0 ? (
                <>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#FFF", animation: "pulse 1s infinite" }} />
                  <span>{liveClassesCount} CLASS LIVE RIGHT NOW</span>
                </>
              ) : (
                <span>VIRTUAL CLASSROOM SUITE</span>
              )}
            </span>
            <span style={{ fontSize: "12px", opacity: 0.8 }}>Google Meet • Zoom • Jitsi Video</span>
          </div>

          <h1 style={{ fontSize: "26px", fontWeight: 900, margin: "0 0 8px 0" }}>
            Live Online Classes & Remote Lectures
          </h1>
          <p style={{ margin: 0, fontSize: "14px", opacity: 0.9, maxWidth: "650px", lineHeight: 1.5 }}>
            Schedule and conduct real-time interactive online video classes for school students. 
            Students and teachers can join with a single click directly from web portal and mobile application.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          style={{
            background: "#4F46E5",
            color: "#FFFFFF",
            border: "none",
            padding: "12px 22px",
            borderRadius: "12px",
            fontWeight: 800,
            fontSize: "13px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 4px 14px rgba(79, 70, 229, 0.4)"
          }}
        >
          <Plus size={16} />
          <span>Schedule Online Class</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "18px",
        marginBottom: "28px"
      }}>
        <div style={{ background: "#FFFFFF", borderRadius: "16px", padding: "20px", border: "1px solid #E2E8F0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "12px", fontWeight: 800, color: "#64748B" }}>LIVE SESSIONS NOW</span>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#FEE2E2", color: "#DC2626", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Radio size={16} />
            </div>
          </div>
          <div style={{ fontSize: "26px", fontWeight: 900, color: "#DC2626" }}>{liveClassesCount}</div>
          <div style={{ fontSize: "12px", color: "#64748B", fontWeight: 700 }}>Ongoing live broadcast</div>
        </div>

        <div style={{ background: "#FFFFFF", borderRadius: "16px", padding: "20px", border: "1px solid #E2E8F0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "12px", fontWeight: 800, color: "#64748B" }}>UPCOMING SCHEDULED</span>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#EDE9FE", color: "#6D28D9", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Calendar size={16} />
            </div>
          </div>
          <div style={{ fontSize: "26px", fontWeight: 900, color: "#0F172A" }}>{scheduledCount}</div>
          <div style={{ fontSize: "12px", color: "#64748B", fontWeight: 700 }}>Lectures in calendar</div>
        </div>

        <div style={{ background: "#FFFFFF", borderRadius: "16px", padding: "20px", border: "1px solid #E2E8F0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "12px", fontWeight: 800, color: "#64748B" }}>COMPLETED LECTURES</span>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#DCFCE7", color: "#16A34A", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div style={{ fontSize: "26px", fontWeight: 900, color: "#15803D" }}>{completedCount}</div>
          <div style={{ fontSize: "12px", color: "#64748B", fontWeight: 700 }}>Classrooms archived</div>
        </div>

        <div style={{ background: "#FFFFFF", borderRadius: "16px", padding: "20px", border: "1px solid #E2E8F0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "12px", fontWeight: 800, color: "#64748B" }}>CONNECTED PLATFORMS</span>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#EFF6FF", color: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Video size={16} />
            </div>
          </div>
          <div style={{ fontSize: "26px", fontWeight: 900, color: "#0F172A" }}>Google Meet</div>
          <div style={{ fontSize: "12px", color: "#64748B", fontWeight: 700 }}>Direct encrypted join</div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div style={{
        background: "#FFFFFF",
        borderRadius: "16px",
        padding: "16px 20px",
        border: "1px solid #E2E8F0",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "24px",
        flexWrap: "wrap",
        gap: "12px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "#F8FAFC",
            border: "1px solid #CBD5E1",
            borderRadius: "10px",
            padding: "8px 14px",
            width: "260px"
          }}>
            <Search size={15} color="#94A3B8" />
            <input
              type="text"
              placeholder="Search topic, subject, teacher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ border: "none", outline: "none", fontSize: "13px", width: "100%", background: "transparent" }}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: "8px 12px", borderRadius: "10px", border: "1px solid #CBD5E1", background: "#FFF", fontSize: "13px", fontWeight: 700 }}
          >
            <option value="ALL">All Status</option>
            <option value="LIVE">Live Now Only</option>
            <option value="SCHEDULED">Scheduled Only</option>
            <option value="COMPLETED">Completed Only</option>
          </select>

          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            style={{ padding: "8px 12px", borderRadius: "10px", border: "1px solid #CBD5E1", background: "#FFF", fontSize: "13px", fontWeight: 700 }}
          >
            <option value="ALL">All Classes</option>
            <option value="Class 10">Class 10</option>
            <option value="Class 9">Class 9</option>
            <option value="Class 8">Class 8</option>
          </select>
        </div>

        <div style={{ fontSize: "13px", fontWeight: 800, color: "#64748B" }}>
          Showing <strong>{filtered.length}</strong> online sessions
        </div>
      </div>

      {/* Classes Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "20px" }}>
        {filtered.length > 0 ? (
          filtered.map((cls) => {
            const isLive = cls.status === "LIVE";
            const isCompleted = cls.status === "COMPLETED";

            return (
              <div
                key={cls.id}
                style={{
                  background: "#FFFFFF",
                  borderRadius: "18px",
                  border: isLive ? "2px solid #EF4444" : "1px solid #E2E8F0",
                  padding: "22px",
                  boxShadow: isLive ? "0 8px 24px -4px rgba(239, 68, 68, 0.2)" : "0 4px 12px rgba(0,0,0,0.03)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  position: "relative"
                }}
              >
                <div>
                  {/* Top Status & Class Pill */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                    <span style={{
                      background: "#EDE9FE",
                      color: "#6D28D9",
                      padding: "4px 10px",
                      borderRadius: "16px",
                      fontSize: "12px",
                      fontWeight: 800
                    }}>
                      {cls.class_name} • {cls.section_name}
                    </span>

                    <span style={{
                      padding: "4px 10px",
                      borderRadius: "20px",
                      fontSize: "11px",
                      fontWeight: 900,
                      background: isLive ? "#FEE2E2" : isCompleted ? "#DCFCE7" : "#EFF6FF",
                      color: isLive ? "#DC2626" : isCompleted ? "#15803D" : "#2563EB",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px"
                    }}>
                      {isLive && <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#DC2626" }} />}
                      <span>{isLive ? "LIVE NOW" : cls.status}</span>
                    </span>
                  </div>

                  {/* Subject & Topic */}
                  <div style={{ fontSize: "13px", fontWeight: 800, color: "#3B82F6", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>
                    {cls.subject_name}
                  </div>
                  <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#0F172A", margin: "0 0 10px 0", lineHeight: 1.4 }}>
                    {cls.topic}
                  </h3>

                  {/* Teacher & Time Details */}
                  <div style={{ background: "#F8FAFC", borderRadius: "12px", padding: "12px", border: "1px solid #E2E8F0", marginBottom: "14px", fontSize: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#334155", fontWeight: 700, marginBottom: "6px" }}>
                      <Users size={14} color="#64748B" />
                      <span>Teacher: <strong>{cls.teacher_name}</strong></span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#334155" }}>
                      <Clock size={14} color="#64748B" />
                      <span>{cls.class_date} • <strong>{cls.start_time} - {cls.end_time}</strong></span>
                    </div>

                    {cls.instructions && (
                      <div style={{ marginTop: "8px", fontSize: "11px", color: "#64748B", borderTop: "1px dashed #CBD5E1", paddingTop: "6px" }}>
                        📌 {cls.instructions}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                    {/* Primary Join Button */}
                    <a
                      href={cls.meeting_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        flex: 1,
                        background: isLive ? "#DC2626" : "#4F46E5",
                        color: "#FFFFFF",
                        textDecoration: "none",
                        padding: "10px",
                        borderRadius: "10px",
                        fontSize: "13px",
                        fontWeight: 800,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        boxShadow: isLive ? "0 4px 12px rgba(220, 38, 38, 0.3)" : "none"
                      }}
                    >
                      <Video size={15} />
                      <span>{isLive ? "Join Live Classroom" : "Open Class Room"}</span>
                      <ExternalLink size={13} />
                    </a>

                    {/* Copy Link Button */}
                    <button
                      onClick={() => handleCopyLink(cls.id, cls.meeting_link)}
                      title="Copy student invite link"
                      style={{
                        padding: "10px 14px",
                        background: copiedId === cls.id ? "#DCFCE7" : "#F1F5F9",
                        color: copiedId === cls.id ? "#16A34A" : "#475569",
                        border: "none",
                        borderRadius: "10px",
                        cursor: "pointer",
                        fontWeight: 700,
                        fontSize: "12px",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px"
                      }}
                    >
                      {copiedId === cls.id ? <Check size={14} /> : <Copy size={14} />}
                      <span>{copiedId === cls.id ? "Copied" : "Copy"}</span>
                    </button>
                  </div>

                  {/* Secondary Management Toggles for Admin */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #F1F5F9", paddingTop: "10px" }}>
                    <div style={{ display: "flex", gap: "6px" }}>
                      {!isLive && !isCompleted && (
                        <button
                          onClick={() => handleUpdateStatus(cls.id, "LIVE")}
                          style={{
                            background: "#FEE2E2",
                            color: "#DC2626",
                            border: "none",
                            padding: "4px 8px",
                            borderRadius: "6px",
                            fontSize: "11px",
                            fontWeight: 800,
                            cursor: "pointer"
                          }}
                        >
                          ● Go Live
                        </button>
                      )}

                      {!isCompleted && (
                        <button
                          onClick={() => handleUpdateStatus(cls.id, "COMPLETED")}
                          style={{
                            background: "#DCFCE7",
                            color: "#16A34A",
                            border: "none",
                            padding: "4px 8px",
                            borderRadius: "6px",
                            fontSize: "11px",
                            fontWeight: 800,
                            cursor: "pointer"
                          }}
                        >
                          ✓ Finish
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() => handleDelete(cls.id)}
                      title="Remove class"
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#94A3B8",
                        cursor: "pointer",
                        padding: "4px"
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ gridColumn: "1 / -1", background: "#FFFFFF", borderRadius: "16px", padding: "40px", textAlign: "center", border: "1px solid #E2E8F0" }}>
            <Video size={36} color="#CBD5E1" style={{ marginBottom: "12px" }} />
            <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#0F172A", margin: "0 0 6px 0" }}>
              No Online Classes Found
            </h3>
            <p style={{ fontSize: "13px", color: "#64748B", margin: "0 0 16px 0" }}>
              Click the button below to schedule an online video lecture for students.
            </p>
            <button
              onClick={() => setShowModal(true)}
              style={{
                background: "#4F46E5",
                color: "#FFFFFF",
                border: "none",
                padding: "10px 18px",
                borderRadius: "10px",
                fontWeight: 800,
                fontSize: "13px",
                cursor: "pointer"
              }}
            >
              + Schedule First Class
            </button>
          </div>
        )}
      </div>

      {/* Modal: Schedule Class */}
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
          <div style={{
            background: "#FFFFFF",
            borderRadius: "20px",
            width: "100%",
            maxWidth: "540px",
            padding: "28px",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
            maxHeight: "90vh",
            overflowY: "auto"
          }}>
            <h2 style={{ fontSize: "18px", fontWeight: 800, margin: "0 0 16px 0", color: "#0F172A" }}>
              Schedule Online Live Lecture
            </h2>

            <form onSubmit={handleCreate}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>
                    Class:
                  </label>
                  <select
                    value={formData.class_name}
                    onChange={(e) => setFormData({ ...formData, class_name: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "13px" }}
                  >
                    <option value="Class 10">Class 10</option>
                    <option value="Class 9">Class 9</option>
                    <option value="Class 8">Class 8</option>
                    <option value="Class 7">Class 7</option>
                    <option value="Class 6">Class 6</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>
                    Section:
                  </label>
                  <select
                    value={formData.section_name}
                    onChange={(e) => setFormData({ ...formData, section_name: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "13px" }}
                  >
                    <option value="Section A">Section A</option>
                    <option value="Section B">Section B</option>
                    <option value="All Sections">All Sections Combined</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>
                    Subject:
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject_name}
                    onChange={(e) => setFormData({ ...formData, subject_name: e.target.value })}
                    placeholder="e.g. Mathematics"
                    style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "13px" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>
                    Assigned Teacher:
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.teacher_name}
                    onChange={(e) => setFormData({ ...formData, teacher_name: e.target.value })}
                    placeholder="e.g. Sunita Sharma"
                    style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "13px" }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>
                  Topic / Lesson Title:
                </label>
                <input
                  type="text"
                  required
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  placeholder="e.g. Quadratic Equations: Finding Roots & Graphs"
                  style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "13px" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: "10px", marginBottom: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>
                    Date:
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.class_date}
                    onChange={(e) => setFormData({ ...formData, class_date: e.target.value })}
                    style={{ width: "100%", padding: "9px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "13px" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>
                    Start Time:
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    placeholder="10:30 AM"
                    style={{ width: "100%", padding: "9px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "13px" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>
                    End Time:
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    placeholder="11:30 AM"
                    style={{ width: "100%", padding: "9px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "13px" }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>
                  Meeting Platform & Link:
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <select
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                    style={{ width: "140px", padding: "10px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "13px" }}
                  >
                    <option value="GOOGLE_MEET">Google Meet</option>
                    <option value="ZOOM">Zoom</option>
                    <option value="JITSI">Jitsi Meet</option>
                    <option value="TEAMS">MS Teams</option>
                  </select>

                  <input
                    type="url"
                    required
                    value={formData.meeting_link}
                    onChange={(e) => setFormData({ ...formData, meeting_link: e.target.value })}
                    placeholder="https://meet.google.com/..."
                    style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "13px" }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>
                  Instructions for Students:
                </label>
                <input
                  type="text"
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "13px" }}
                />
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ padding: "10px 18px", borderRadius: "10px", background: "#F1F5F9", color: "#64748B", border: "none", fontWeight: 700, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "10px 22px", borderRadius: "10px", background: "#4F46E5", color: "#FFFFFF", border: "none", fontWeight: 800, cursor: "pointer" }}
                >
                  Schedule Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
