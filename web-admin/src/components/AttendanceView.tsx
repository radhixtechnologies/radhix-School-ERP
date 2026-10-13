import { useState, useEffect } from "react";
import {
  Check,
  X,
  Clock,
  CheckCircle2,
  CalendarCheck,
  Users,
  AlertCircle,
  TrendingUp,
  Percent,
  Calendar,
  Send,
  Sparkles,
  School
} from "lucide-react";

interface Props {
  institute: any;
  token: string;
}

export const AttendanceView = ({ institute, token }: Props) => {
  const isSchool = (institute?.type || institute?.institute_type) === "SCHOOL";
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [classes, setClasses] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [students, setStudents] = useState<any[]>([]);
  const [attendanceMap, setAttendanceMap] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadOptions();
  }, [institute]);

  const loadOptions = async () => {
    try {
      if (isSchool) {
        const res = await fetch("http://localhost:5000/api/v1/academic/classes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const j = await res.json();
        if (j.success && j.data.length > 0) {
          setClasses(j.data);
          setSelectedClassId(j.data[0].id);
        }
      } else {
        const res = await fetch("http://localhost:5000/api/v1/academic/courses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const j = await res.json();
        if (j.success && j.data.length > 0) {
          setCourses(j.data);
          setSelectedClassId(j.data[0].id);
        }
      }
    } catch {}
  };

  useEffect(() => {
    if (selectedClassId) {
      loadStudents();
    }
  }, [selectedClassId, date]);

  const loadStudents = async () => {
    try {
      const param = isSchool ? `class_id=${selectedClassId}` : `course_id=${selectedClassId}`;
      const res = await fetch(`http://localhost:5000/api/v1/attendance/by-cohort?date=${date}&${param}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const j = await res.json();
      if (j.success) {
        setStudents(j.data);
        const map: Record<string, string> = {};
        j.data.forEach((s: any) => {
          map[s.student_id] = s.status === "UNMARKED" ? "PRESENT" : s.status;
        });
        setAttendanceMap(map);
      }
    } catch {}
  };

  const setAllStatus = (st: string) => {
    const updated = { ...attendanceMap };
    students.forEach((s) => {
      updated[s.student_id] = st;
    });
    setAttendanceMap(updated);
  };

  const handleSave = async () => {
    const records = students.map((s) => ({
      student_id: s.student_id,
      status: attendanceMap[s.student_id] || "PRESENT",
    }));

    try {
      const res = await fetch("http://localhost:5000/api/v1/attendance/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ date, records }),
      });
      const j = await res.json();
      if (j.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } catch {}
  };

  // Real-time Overview Analytics
  const totalStudents = students.length;
  const presentCount = students.filter((s) => (attendanceMap[s.student_id] || "PRESENT") === "PRESENT").length;
  const absentCount = students.filter((s) => attendanceMap[s.student_id] === "ABSENT").length;
  const lateCount = students.filter((s) => attendanceMap[s.student_id] === "LATE").length;
  const halfDayCount = students.filter((s) => attendanceMap[s.student_id] === "HALF_DAY").length;
  const attendanceRate = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;
  const currentCohortName = isSchool
    ? (classes.find((c) => c.id === selectedClassId)?.name || "Selected Class")
    : (courses.find((c) => c.id === selectedClassId)?.name || "Selected Course");

  return (
    <div>
      {/* Top Banner (Preskool Indigo/Blue theme) */}
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
            <CalendarCheck size={14} color="#93C5FD" /> Real-time Class Attendance Hub
          </div>
          <h1 style={{ fontSize: "22px", fontWeight: 900, margin: "0 0 6px 0", letterSpacing: "-0.02em" }}>
            Daily Attendance & Cohort Analytics Overview
          </h1>
          <p style={{ margin: 0, opacity: 0.9, fontSize: "13px", maxWidth: "680px" }}>
            Classroom roll register, absentee trend analysis, and automated parent absence notifications.
          </p>
        </div>

        {saved && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#166534", background: "#DCFCE7", padding: "10px 18px", borderRadius: "12px", fontWeight: "800", fontSize: "13px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
            <CheckCircle2 size={18} />
            <span>Attendance Saved Successfully!</span>
          </div>
        )}
      </div>

      {/* DASHBOARD OVERVIEW: 4 ATTENDANCE METRICS CARDS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "20px" }}>
        {/* Card 1: Attendance Percentage */}
        <div style={{ background: "#FFFFFF", padding: "18px 20px", borderRadius: "16px", border: "1px solid #E2E8F0", boxShadow: "0 2px 6px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
            <div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748B" }}>Overall Attendance Rate</div>
              <div style={{ fontSize: "28px", fontWeight: 900, color: attendanceRate >= 80 ? "#16A34A" : attendanceRate >= 60 ? "#D97706" : "#DC2626", marginTop: "2px" }}>
                {attendanceRate}%
              </div>
            </div>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "#DCFCE7", color: "#16A34A", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Percent size={20} />
            </div>
          </div>
          {/* Visual Progress Bar */}
          <div style={{ width: "100%", height: "6px", background: "#F1F5F9", borderRadius: "10px", overflow: "hidden", marginBottom: "6px" }}>
            <div style={{ width: `${attendanceRate}%`, height: "100%", background: "linear-gradient(90deg, #10B981, #059669)", borderRadius: "10px" }} />
          </div>
          <div style={{ fontSize: "11px", color: "#64748B", fontWeight: 600 }}>
            {currentCohortName} • {date}
          </div>
        </div>

        {/* Card 2: Present Count */}
        <div style={{ background: "#FFFFFF", padding: "18px 20px", borderRadius: "16px", border: "1px solid #E2E8F0", boxShadow: "0 2px 6px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
            <div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748B" }}>Present Students in Class</div>
              <div style={{ fontSize: "28px", fontWeight: 900, color: "#16A34A", marginTop: "2px" }}>
                {presentCount} <span style={{ fontSize: "14px", color: "#64748B", fontWeight: 600 }}>/ {totalStudents}</span>
              </div>
            </div>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "#F0FDF4", color: "#16A34A", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Check size={20} />
            </div>
          </div>
          <div style={{ fontSize: "12px", color: "#16A34A", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
            <CheckCircle2 size={13} /> Active in Classroom Learning
          </div>
        </div>

        {/* Card 3: Absent Count */}
        <div style={{ background: "#FFFFFF", padding: "18px 20px", borderRadius: "16px", border: "1px solid #E2E8F0", boxShadow: "0 2px 6px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
            <div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748B" }}>Absent Students Today</div>
              <div style={{ fontSize: "28px", fontWeight: 900, color: absentCount > 0 ? "#DC2626" : "#64748B", marginTop: "2px" }}>
                {absentCount}
              </div>
            </div>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "#FEF2F2", color: "#DC2626", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <X size={20} />
            </div>
          </div>
          <div style={{ fontSize: "12px", color: absentCount > 0 ? "#DC2626" : "#64748B", fontWeight: 700 }}>
            {absentCount > 0 ? `⚠️ ${absentCount} Parents Pending Alert` : "✓ Zero Absentees Today"}
          </div>
        </div>

        {/* Card 4: Late / Half Day */}
        <div style={{ background: "#FFFFFF", padding: "18px 20px", borderRadius: "16px", border: "1px solid #E2E8F0", boxShadow: "0 2px 6px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
            <div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748B" }}>Late Arrivals / Half-Day</div>
              <div style={{ fontSize: "28px", fontWeight: 900, color: "#D97706", marginTop: "2px" }}>
                {lateCount + halfDayCount}
              </div>
            </div>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "#FEF3C7", color: "#D97706", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Clock size={20} />
            </div>
          </div>
          <div style={{ fontSize: "12px", color: "#64748B", fontWeight: 600 }}>
            {lateCount} Late • {halfDayCount} Half-Day
          </div>
        </div>
      </div>

      {/* Cohort & Date Filter Control Bar */}
      <div style={{ background: "#fff", borderRadius: "14px", border: "1px solid #e2e8f0", padding: "20px", marginBottom: "20px", display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
        <div>
          <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "4px", color: "#334155" }}>📅 Attendance Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "13px" }}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "4px", color: "#334155" }}>
            {isSchool ? "🏫 Select Class & Section" : "🎓 Select Course & Cohort"}
          </label>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            style={{ padding: "8px 14px", borderRadius: "8px", border: "1.5px solid #cbd5e1", background: "#fff", fontSize: "13px", fontWeight: 600 }}
          >
            {isSchool
              ? classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)
              : courses.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
          </select>
        </div>

        <div style={{ marginLeft: "auto", display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            onClick={() => setAllStatus("PRESENT")}
            style={{ background: "#ecfdf5", color: "#059669", padding: "8px 14px", borderRadius: "8px", fontWeight: "700", fontSize: "13px", border: "1px solid #A7F3D0", cursor: "pointer" }}
          >
            ✓ Mark All Present
          </button>
          <button
            onClick={() => setAllStatus("ABSENT")}
            style={{ background: "#FEF2F2", color: "#DC2626", padding: "8px 14px", borderRadius: "8px", fontWeight: "700", fontSize: "13px", border: "1px solid #FECACA", cursor: "pointer" }}
          >
            ✗ Mark All Absent
          </button>
          <button
            onClick={handleSave}
            style={{ background: "#3D5EE1", color: "#fff", padding: "8px 22px", borderRadius: "8px", fontWeight: "800", fontSize: "13px", border: "none", cursor: "pointer", boxShadow: "0 4px 12px rgba(61,94,225,0.25)" }}
          >
            💾 Save Attendance
          </button>
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: "14px", border: "1px solid #e2e8f0", padding: "20px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "1.5px solid #f1f5f9", color: "#64748b", fontSize: "12px", textTransform: "uppercase" }}>
              <th style={{ padding: "12px" }}>Roll / Adm No</th>
              <th style={{ padding: "12px" }}>Student Name</th>
              <th style={{ padding: "12px", textAlign: "center" }}>Attendance Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((stu) => {
              const currentStatus = attendanceMap[stu.student_id] || "PRESENT";
              return (
                <tr key={stu.student_id} style={{ borderBottom: "1px solid #f8fafc", fontSize: "14px" }}>
                  <td style={{ padding: "14px 12px", fontWeight: "700", color: "#4f46e5" }}>
                    {stu.roll_number || stu.admission_number}
                  </td>
                  <td style={{ padding: "14px 12px", fontWeight: "700" }}>
                    {stu.first_name} {stu.last_name}
                  </td>
                  <td style={{ padding: "14px 12px", textAlign: "center" }}>
                    <div style={{ display: "inline-flex", gap: "6px" }}>
                      <button
                        onClick={() => setAttendanceMap({ ...attendanceMap, [stu.student_id]: "PRESENT" })}
                        style={{
                          background: currentStatus === "PRESENT" ? "#10b981" : "#f1f5f9",
                          color: currentStatus === "PRESENT" ? "#fff" : "#64748b",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          fontWeight: "700",
                          fontSize: "12px",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px"
                        }}
                      >
                        <Check size={14} />
                        <span>Present</span>
                      </button>

                      <button
                        onClick={() => setAttendanceMap({ ...attendanceMap, [stu.student_id]: "ABSENT" })}
                        style={{
                          background: currentStatus === "ABSENT" ? "#ef4444" : "#f1f5f9",
                          color: currentStatus === "ABSENT" ? "#fff" : "#64748b",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          fontWeight: "700",
                          fontSize: "12px",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px"
                        }}
                      >
                        <X size={14} />
                        <span>Absent</span>
                      </button>

                      <button
                        onClick={() => setAttendanceMap({ ...attendanceMap, [stu.student_id]: "LATE" })}
                        style={{
                          background: currentStatus === "LATE" ? "#f59e0b" : "#f1f5f9",
                          color: currentStatus === "LATE" ? "#fff" : "#64748b",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          fontWeight: "700",
                          fontSize: "12px",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px"
                        }}
                      >
                        <Clock size={14} />
                        <span>Late</span>
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
  );
};
