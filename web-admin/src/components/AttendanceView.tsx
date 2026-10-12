import { useState, useEffect } from "react";
import { Check, X, Clock, CheckCircle2 } from "lucide-react";

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

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: "800" }}>Daily Attendance Register</h2>
          <p style={{ fontSize: "13px", color: "#64748b" }}>Take fast attendance for entire class/batch</p>
        </div>

        {saved && (
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#059669", background: "#ecfdf5", padding: "8px 14px", borderRadius: "8px", fontWeight: "700", fontSize: "13px" }}>
            <CheckCircle2 size={18} />
            <span>Attendance Saved!</span>
          </div>
        )}
      </div>

      <div style={{ background: "#fff", borderRadius: "14px", border: "1px solid #e2e8f0", padding: "20px", marginBottom: "20px", display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
        <div>
          <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>Attendance Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #cbd5e1" }}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>
            {isSchool ? "Select Class" : "Select Course"}
          </label>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            style={{ padding: "8px 14px", borderRadius: "8px", border: "1.5px solid #cbd5e1", background: "#fff" }}
          >
            {isSchool
              ? classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)
              : courses.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
          </select>
        </div>

        <div style={{ marginLeft: "auto", display: "flex", gap: "10px" }}>
          <button
            onClick={() => setAllStatus("PRESENT")}
            style={{ background: "#ecfdf5", color: "#059669", padding: "8px 14px", borderRadius: "8px", fontWeight: "700", fontSize: "13px" }}
          >
            ✓ Mark All Present
          </button>
          <button
            onClick={handleSave}
            style={{ background: "#4f46e5", color: "#fff", padding: "8px 20px", borderRadius: "8px", fontWeight: "700", fontSize: "13px" }}
          >
            Save Attendance
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
