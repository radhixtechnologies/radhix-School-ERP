import React, { useState } from "react";
import { Award, FileText, CheckCircle2, Search, Filter, Download, Plus, BookOpen, Printer, X, Edit3 } from "lucide-react";

export const ExamsView: React.FC = () => {
  const [selectedTerm, setSelectedTerm] = useState("Term 1 Mid-Term Examination");
  const [selectedClass, setSelectedClass] = useState("Class 10 - Section A");
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedStudentForCard, setSelectedStudentForCard] = useState<any | null>(null);
  const [editingStudent, setEditingStudent] = useState<any | null>(null);

  const [newExamTitle, setNewExamTitle] = useState("");
  const [newExamYear, setNewExamYear] = useState("2026-27");
  const [newExamStart, setNewExamStart] = useState("");
  const [newExamEnd, setNewExamEnd] = useState("");

  const [studentMarks, setStudentMarks] = useState([
    { roll: "12", name: "Aarav Kumar", eng: 88, math: 94, sci: 91, sst: 85, comp: 96, total: 454, pct: "90.8%", grade: "A+" },
    { roll: "01", name: "Aanya Verma", eng: 92, math: 89, sci: 94, sst: 90, comp: 95, total: 460, pct: "92.0%", grade: "A+" },
    { roll: "02", name: "Anik Sen", eng: 81, math: 85, sci: 78, sst: 82, comp: 88, total: 414, pct: "82.8%", grade: "A" },
    { roll: "03", name: "Dev Malhotra", eng: 76, math: 92, sci: 85, sst: 79, comp: 90, total: 422, pct: "84.4%", grade: "A" },
    { roll: "04", name: "Diya Singh", eng: 95, math: 91, sci: 96, sst: 94, comp: 98, total: 474, pct: "94.8%", grade: "A+" },
    { roll: "05", name: "Ishaan Gupta", eng: 72, math: 75, sci: 70, sst: 74, comp: 80, total: 371, pct: "74.2%", grade: "B+" },
    { roll: "06", name: "Kavya Joshi", eng: 89, math: 88, sci: 90, sst: 87, comp: 92, total: 446, pct: "89.2%", grade: "A" },
  ]);

  const handleSaveMarks = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    const eng = Number(editingStudent.eng) || 0;
    const math = Number(editingStudent.math) || 0;
    const sci = Number(editingStudent.sci) || 0;
    const sst = Number(editingStudent.sst) || 0;
    const comp = Number(editingStudent.comp) || 0;
    const total = eng + math + sci + sst + comp;
    const pct = (total / 5).toFixed(1) + "%";
    const grade = total >= 450 ? "A+" : total >= 400 ? "A" : total >= 350 ? "B+" : "B";

    setStudentMarks((prev) =>
      prev.map((s) => (s.roll === editingStudent.roll ? { ...editingStudent, total, pct, grade } : s))
    );
    setEditingStudent(null);
  };

  const handleScheduleExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExamTitle.trim()) return;
    alert(`Exam "${newExamTitle}" scheduled successfully for Academic Year ${newExamYear}!`);
    setShowScheduleModal(false);
    setNewExamTitle("");
  };

  const handleExportCSV = () => {
    const csvHeader = "Roll,Student Name,English,Maths,Science,SST,Computer,Total,Percentage,Grade\n";
    const rows = studentMarks
      .map((s) => `${s.roll},"${s.name}",${s.eng},${s.math},${s.sci},${s.sst},${s.comp},${s.total},${s.pct},${s.grade}`)
      .join("\n");
    const blob = new Blob([csvHeader + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Marksheet_${selectedTerm.replace(/\s+/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ padding: "28px", maxWidth: "1300px", margin: "0 auto" }}>
      {/* Top Banner */}
      <div style={{
        background: "linear-gradient(135deg, #312E81 0%, #4338CA 100%)",
        borderRadius: "16px",
        padding: "24px 28px",
        color: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "24px"
      }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.15)", padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: 700, marginBottom: "8px" }}>
            <Award size={14} color="#FDE047" /> Academic Assessment & Report Cards
          </div>
          <h1 style={{ fontSize: "22px", fontWeight: 800, margin: "0 0 4px 0" }}>Exams, Marks Entry & Report Cards</h1>
          <p style={{ margin: 0, opacity: 0.85, fontSize: "13px" }}>Evaluate term examinations, compute cumulative percentage, and issue official CBSE report cards.</p>
        </div>

        <button
          onClick={() => setShowScheduleModal(true)}
          style={{
            background: "#10B981",
            color: "#fff",
            border: "none",
            padding: "10px 18px",
            borderRadius: "10px",
            fontWeight: 700,
            fontSize: "13px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          <Plus size={16} /> Schedule New Exam
        </button>
      </div>

      {/* Filter Bar */}
      <div style={{
        background: "#FFFFFF",
        padding: "16px 20px",
        borderRadius: "14px",
        border: "1px solid #E2E8F0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px"
      }}>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <div>
            <label style={{ fontSize: "11px", fontWeight: 700, color: "#64748B", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Selected Exam</label>
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", fontWeight: 600, outline: "none" }}
            >
              <option value="Term 1 Mid-Term Examination">Term 1 Mid-Term Examination (Sep 2026)</option>
              <option value="Unit Test 1">Unit Test 1 (July 2026)</option>
              <option value="Term 2 Final Examination">Term 2 Final Examination (Feb 2027)</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: "11px", fontWeight: 700, color: "#64748B", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Class & Section</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", fontWeight: 600, outline: "none" }}
            >
              <option value="Class 10 - Section A">Class 10 - Section A (42 Students)</option>
              <option value="Class 10 - Section B">Class 10 - Section B (38 Students)</option>
              <option value="Class 9 - Section A">Class 9 - Section A (40 Students)</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          style={{
            background: "#F1F5F9",
            border: "1px solid #CBD5E1",
            padding: "8px 16px",
            borderRadius: "8px",
            fontWeight: 700,
            fontSize: "13px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            color: "#334155"
          }}
        >
          <Download size={15} /> Export Class Marksheet (CSV)
        </button>
      </div>

      {/* Marksheet Table */}
      <div style={{ background: "#FFFFFF", borderRadius: "16px", padding: "20px", border: "1px solid #E2E8F0", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #E2E8F0", color: "#64748B", textTransform: "uppercase", fontSize: "11px" }}>
              <th style={{ padding: "10px" }}>Roll</th>
              <th style={{ padding: "10px" }}>Student Name</th>
              <th style={{ padding: "10px", textAlign: "center" }}>English (100)</th>
              <th style={{ padding: "10px", textAlign: "center" }}>Maths (100)</th>
              <th style={{ padding: "10px", textAlign: "center" }}>Science (100)</th>
              <th style={{ padding: "10px", textAlign: "center" }}>S.St. (100)</th>
              <th style={{ padding: "10px", textAlign: "center" }}>Computer (100)</th>
              <th style={{ padding: "10px", textAlign: "center" }}>Total (500)</th>
              <th style={{ padding: "10px", textAlign: "center" }}>Percentage</th>
              <th style={{ padding: "10px", textAlign: "center" }}>Grade</th>
              <th style={{ padding: "10px", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {studentMarks.map((s) => (
              <tr key={s.roll} style={{ borderBottom: "1px solid #F1F5F9" }}>
                <td style={{ padding: "12px 10px", fontWeight: 700, color: "#475569" }}>#{s.roll}</td>
                <td style={{ padding: "12px 10px", fontWeight: 800, color: "#0F172A" }}>{s.name}</td>
                <td style={{ padding: "12px 10px", textAlign: "center" }}>{s.eng}</td>
                <td style={{ padding: "12px 10px", textAlign: "center" }}>{s.math}</td>
                <td style={{ padding: "12px 10px", textAlign: "center" }}>{s.sci}</td>
                <td style={{ padding: "12px 10px", textAlign: "center" }}>{s.sst}</td>
                <td style={{ padding: "12px 10px", textAlign: "center" }}>{s.comp}</td>
                <td style={{ padding: "12px 10px", textAlign: "center", fontWeight: 800, color: "#1E293B" }}>{s.total}</td>
                <td style={{ padding: "12px 10px", textAlign: "center", fontWeight: 800, color: "#2563EB" }}>{s.pct}</td>
                <td style={{ padding: "12px 10px", textAlign: "center" }}>
                  <span style={{
                    padding: "3px 8px",
                    borderRadius: "8px",
                    fontWeight: 800,
                    fontSize: "11px",
                    background: s.grade === "A+" ? "#DCFCE7" : "#EFF6FF",
                    color: s.grade === "A+" ? "#15803D" : "#1D4ED8"
                  }}>
                    {s.grade}
                  </span>
                </td>
                <td style={{ padding: "12px 10px", textAlign: "right", whiteSpace: "nowrap" }}>
                  <button
                    onClick={() => setEditingStudent({ ...s })}
                    style={{
                      background: "#F1F5F9",
                      border: "1px solid #CBD5E1",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: 700,
                      cursor: "pointer",
                      color: "#334155",
                      marginRight: "6px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "3px"
                    }}
                  >
                    <Edit3 size={12} /> Edit
                  </button>
                  <button
                    onClick={() => setSelectedStudentForCard(s)}
                    style={{
                      background: "#F8FAFC",
                      border: "1px solid #CBD5E1",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: 700,
                      cursor: "pointer",
                      color: "#474A74",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px"
                    }}
                  >
                    <FileText size={13} /> View Card
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Schedule Exam Modal */}
      {showScheduleModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div style={{ background: "#fff", borderRadius: "16px", maxWidth: "460px", width: "100%", padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#0F172A" }}>Schedule New Examination</h3>
              <button onClick={() => setShowScheduleModal(false)} style={{ background: "transparent", border: "none", fontSize: "20px", cursor: "pointer" }}>×</button>
            </div>
            <form onSubmit={handleScheduleExam}>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155" }}>Exam Title*</label>
                  <input
                    type="text"
                    required
                    value={newExamTitle}
                    onChange={(e) => setNewExamTitle(e.target.value)}
                    placeholder="e.g. Unit Test 2 / Pre-Board Examination"
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155" }}>Academic Year</label>
                  <input
                    type="text"
                    value={newExamYear}
                    onChange={(e) => setNewExamYear(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px" }}
                  />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155" }}>Start Date</label>
                    <input
                      type="date"
                      value={newExamStart}
                      onChange={(e) => setNewExamStart(e.target.value)}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155" }}>End Date</label>
                    <input
                      type="date"
                      value={newExamEnd}
                      onChange={(e) => setNewExamEnd(e.target.value)}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", marginTop: "4px" }}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  style={{
                    background: "#4338CA",
                    color: "#fff",
                    border: "none",
                    padding: "10px",
                    borderRadius: "10px",
                    fontWeight: 700,
                    marginTop: "8px",
                    cursor: "pointer"
                  }}
                >
                  Confirm & Publish Exam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Marks Modal */}
      {editingStudent && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div style={{ background: "#fff", borderRadius: "16px", maxWidth: "440px", width: "100%", padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#0F172A" }}>Edit Marks - {editingStudent.name}</h3>
              <button onClick={() => setEditingStudent(null)} style={{ background: "transparent", border: "none", fontSize: "20px", cursor: "pointer" }}>×</button>
            </div>
            <form onSubmit={handleSaveMarks}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "700" }}>English (100)</label>
                  <input
                    type="number"
                    max={100}
                    value={editingStudent.eng}
                    onChange={(e) => setEditingStudent({ ...editingStudent, eng: e.target.value })}
                    style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #CBD5E1" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "700" }}>Mathematics (100)</label>
                  <input
                    type="number"
                    max={100}
                    value={editingStudent.math}
                    onChange={(e) => setEditingStudent({ ...editingStudent, math: e.target.value })}
                    style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #CBD5E1" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "700" }}>Science (100)</label>
                  <input
                    type="number"
                    max={100}
                    value={editingStudent.sci}
                    onChange={(e) => setEditingStudent({ ...editingStudent, sci: e.target.value })}
                    style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #CBD5E1" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "700" }}>Social Science (100)</label>
                  <input
                    type="number"
                    max={100}
                    value={editingStudent.sst}
                    onChange={(e) => setEditingStudent({ ...editingStudent, sst: e.target.value })}
                    style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #CBD5E1" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "700" }}>Computer (100)</label>
                  <input
                    type="number"
                    max={100}
                    value={editingStudent.comp}
                    onChange={(e) => setEditingStudent({ ...editingStudent, comp: e.target.value })}
                    style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #CBD5E1" }}
                  />
                </div>
              </div>
              <button
                type="submit"
                style={{ width: "100%", background: "#10B981", color: "#fff", border: "none", padding: "10px", borderRadius: "10px", fontWeight: 700, cursor: "pointer" }}
              >
                Save & Update Marks
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Official Report Card Modal */}
      {selectedStudentForCard && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div style={{ background: "#fff", borderRadius: "16px", maxWidth: "560px", width: "100%", padding: "28px", border: "2px solid #CBD5E1", boxShadow: "0 10px 25px rgba(0,0,0,0.15)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div>
                <div style={{ fontSize: "11px", fontWeight: "800", color: "#4338CA", textTransform: "uppercase" }}>DELHI PUBLIC ACADEMY (CBSE AFFIL. 2130045)</div>
                <h2 style={{ fontSize: "18px", fontWeight: "900", margin: "2px 0", color: "#0F172A" }}>Official Student Report Card</h2>
                <div style={{ fontSize: "12px", color: "#64748B" }}>Academic Year 2026-27 • {selectedTerm}</div>
              </div>
              <button onClick={() => setSelectedStudentForCard(null)} style={{ background: "transparent", border: "none", fontSize: "20px", cursor: "pointer" }}>×</button>
            </div>

            <div style={{ background: "#F8FAFC", padding: "12px 16px", borderRadius: "10px", marginBottom: "16px", fontSize: "13px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              <div>Student Name: <strong style={{ color: "#0F172A" }}>{selectedStudentForCard.name}</strong></div>
              <div>Roll No: <strong style={{ color: "#0F172A" }}>#{selectedStudentForCard.roll}</strong></div>
              <div>Class: <strong style={{ color: "#0F172A" }}>Class 10 - Section A</strong></div>
              <div>Admission No: <strong style={{ color: "#0F172A" }}>DPS-2026-0{selectedStudentForCard.roll}</strong></div>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", marginBottom: "16px" }}>
              <thead>
                <tr style={{ borderBottom: "1.5px solid #CBD5E1", color: "#64748B", textTransform: "uppercase", fontSize: "11px" }}>
                  <th style={{ padding: "8px 4px", textAlign: "left" }}>Subject</th>
                  <th style={{ padding: "8px 4px", textAlign: "center" }}>Max</th>
                  <th style={{ padding: "8px 4px", textAlign: "center" }}>Marks</th>
                  <th style={{ padding: "8px 4px", textAlign: "right" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid #F1F5F9" }}><td style={{ padding: "8px 4px" }}>English Literature</td><td style={{ textAlign: "center" }}>100</td><td style={{ textAlign: "center", fontWeight: "bold" }}>{selectedStudentForCard.eng}</td><td style={{ textAlign: "right", color: "#16A34A", fontWeight: "bold" }}>PASSED</td></tr>
                <tr style={{ borderBottom: "1px solid #F1F5F9" }}><td style={{ padding: "8px 4px" }}>Mathematics</td><td style={{ textAlign: "center" }}>100</td><td style={{ textAlign: "center", fontWeight: "bold" }}>{selectedStudentForCard.math}</td><td style={{ textAlign: "right", color: "#16A34A", fontWeight: "bold" }}>PASSED</td></tr>
                <tr style={{ borderBottom: "1px solid #F1F5F9" }}><td style={{ padding: "8px 4px" }}>Science (Physics/Chem)</td><td style={{ textAlign: "center" }}>100</td><td style={{ textAlign: "center", fontWeight: "bold" }}>{selectedStudentForCard.sci}</td><td style={{ textAlign: "right", color: "#16A34A", fontWeight: "bold" }}>PASSED</td></tr>
                <tr style={{ borderBottom: "1px solid #F1F5F9" }}><td style={{ padding: "8px 4px" }}>Social Science</td><td style={{ textAlign: "center" }}>100</td><td style={{ textAlign: "center", fontWeight: "bold" }}>{selectedStudentForCard.sst}</td><td style={{ textAlign: "right", color: "#16A34A", fontWeight: "bold" }}>PASSED</td></tr>
                <tr style={{ borderBottom: "1.5px solid #CBD5E1" }}><td style={{ padding: "8px 4px" }}>Computer Applications</td><td style={{ textAlign: "center" }}>100</td><td style={{ textAlign: "center", fontWeight: "bold" }}>{selectedStudentForCard.comp}</td><td style={{ textAlign: "right", color: "#16A34A", fontWeight: "bold" }}>PASSED</td></tr>
              </tbody>
            </table>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#ECFDF5", padding: "12px", borderRadius: "10px", marginBottom: "16px" }}>
              <div>Grand Total: <strong>{selectedStudentForCard.total} / 500</strong></div>
              <div>Percentage: <strong style={{ color: "#059669", fontSize: "16px" }}>{selectedStudentForCard.pct}</strong></div>
              <div>Grade: <strong style={{ color: "#15803D", fontSize: "16px" }}>{selectedStudentForCard.grade}</strong></div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                onClick={() => window.print()}
                style={{ display: "flex", alignItems: "center", gap: "6px", background: "#4338CA", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}
              >
                <Printer size={16} /> Print Official Marksheet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
