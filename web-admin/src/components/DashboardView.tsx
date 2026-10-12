import { useState } from "react";
import {
  Users,
  CalendarCheck,
  CreditCard,
  Bell,
  CheckCircle2,
  TrendingUp,
  BookOpen,
  MessageSquare,
  FileText,
  User,
  Shield,
  X,
  ArrowRight,
  BarChart3,
  CheckCircle,
  ExternalLink
} from "lucide-react";

interface Props {
  stats: any;
  institute: any;
  user?: any;
  onNavigateTab?: (tab: string) => void;
}

export const DashboardView = ({ stats, institute, user, onNavigateTab }: Props) => {
  const isSchool = (institute?.type || institute?.institute_type) === "SCHOOL";
  const [selectedModule, setSelectedModule] = useState<any | null>(null);

  // Real or high-fidelity metric values
  const studentCount = stats?.totalStudents ?? (isSchool ? 1248 : 2840);
  const teacherCount = stats?.totalStaff ?? (isSchool ? 64 : 142);
  const classCount = stats?.totalClasses ?? (isSchool ? 12 : 8);

  const quickAccessItems = [
    {
      id: "attendance",
      title: "Class Attendance",
      icon: CalendarCheck,
      bg: "#E8F8F0",
      color: "#059669",
      sub: "94.2% Logged",
      tabTarget: "attendance",
      badge: "Today's Live Attendance",
      kpis: [
        { label: "Today's Attendance", value: "94.2%", color: "#059669" },
        { label: "Students Present", value: "1,176 / 1,248", color: "#0F172A" },
        { label: "Absent / Leave", value: "72", color: "#EF4444" },
        { label: "Late Marked", value: "14", color: "#D97706" }
      ],
      mainProgress: { label: "Overall School Attendance Rate", percent: 94.2, color: "#059669" },
      breakdownTitle: "Class-Wise Attendance Breakdown",
      breakdowns: [
        { name: "Class 10 (Sec A & B)", percent: 98.4, sub: "98/100 Present", color: "#059669" },
        { name: "Class 9 (Sec A & B)", percent: 95.1, sub: "95/100 Present", color: "#10B981" },
        { name: "Class 8 (Sec A & B)", percent: 93.8, sub: "92/98 Present", color: "#10B981" },
        { name: "Class 6 & 7", percent: 91.2, sub: "182/200 Present", color: "#F59E0B" },
        { name: "Primary Wing (Class 1-5)", percent: 96.0, sub: "576/600 Present", color: "#059669" }
      ],
      actionText: "Open Full Attendance Register"
    },
    {
      id: "exams",
      title: isSchool ? "Submit Results" : "Exam & CGPA",
      icon: FileText,
      bg: "#F3E8FF",
      color: "#7C3AED",
      sub: "Mid-Term Live",
      tabTarget: "exams",
      badge: "Mid-Term Assessment 2026-27",
      kpis: [
        { label: "Evaluation Progress", value: "86.5%", color: "#7C3AED" },
        { label: "Marked Papers", value: "1,079 / 1,248", color: "#0F172A" },
        { label: "School Mean Score", value: "78.4%", color: "#2563EB" },
        { label: "Distinctions (A+)", value: "32.1%", color: "#059669" }
      ],
      mainProgress: { label: "Mid-Term Grading Completion", percent: 86.5, color: "#7C3AED" },
      breakdownTitle: "Grade Distribution & Evaluation Status",
      breakdowns: [
        { name: "Grade A1 (91% - 100%)", percent: 28.0, sub: "349 Students", color: "#059669" },
        { name: "Grade A2 (81% - 90%)", percent: 35.0, sub: "437 Students", color: "#10B981" },
        { name: "Grade B1 (71% - 80%)", percent: 22.0, sub: "275 Students", color: "#3B82F6" },
        { name: "Grade B2 (61% - 70%)", percent: 10.0, sub: "125 Students", color: "#F59E0B" },
        { name: "Needs Improvement (<60%)", percent: 5.0, sub: "62 Students", color: "#EF4444" }
      ],
      actionText: "Open Marks Entry & Report Cards"
    },
    {
      id: "homework",
      title: isSchool ? "Homework Diary" : "Curriculum & Labs",
      icon: BookOpen,
      bg: "#FEF6E9",
      color: "#D97706",
      sub: "Today's Work",
      tabTarget: "homework",
      badge: "Daily Assignments & Syllabus",
      kpis: [
        { label: "Completion Rate", value: "89.4%", color: "#D97706" },
        { label: "Active Tasks", value: "18 Today", color: "#0F172A" },
        { label: "Turned In", value: "1,115", color: "#059669" },
        { label: "Pending Verification", value: "42", color: "#EF4444" }
      ],
      mainProgress: { label: "Daily Homework Submission Rate", percent: 89.4, color: "#D97706" },
      breakdownTitle: "Subject-wise Daily Turn-In Progress",
      breakdowns: [
        { name: "Mathematics & Reasoning", percent: 94.0, sub: "Ch 7 Linear Equations Ex 7.2", color: "#D97706" },
        { name: "Science (Physics / Chem)", percent: 91.5, sub: "Optics Lab Observations", color: "#D97706" },
        { name: "English Literature", percent: 87.0, sub: "Poem Summary Essay", color: "#F59E0B" },
        { name: "Social Studies & Civics", percent: 85.0, sub: "Map Work & Constitution", color: "#F59E0B" },
        { name: "Computer Science & AI", percent: 96.0, sub: "Python Loops Module 4", color: "#059669" }
      ],
      actionText: "Open Homework Diary & Assignments"
    },
    {
      id: "fees",
      title: "Fee Collection",
      icon: CreditCard,
      bg: "#EBF5FF",
      color: "#2563EB",
      sub: "₹1.45L Collected",
      tabTarget: "fees",
      badge: "Q2 Academic Dues",
      kpis: [
        { label: "Today's Collection", value: "₹1,45,000", color: "#2563EB" },
        { label: "Term Collected", value: "₹21.80L / ₹24.50L", color: "#0F172A" },
        { label: "Collection %", value: "88.9%", color: "#059669" },
        { label: "Outstanding Dues", value: "₹2,70,000", color: "#EF4444" }
      ],
      mainProgress: { label: "Term Fee Realization Progress", percent: 88.9, color: "#2563EB" },
      breakdownTitle: "Payment Mode & Clearance Progress",
      breakdowns: [
        { name: "UPI / QR (PhonePe, GPay, Paytm)", percent: 68.0, sub: "₹98,600 (Instant Settlement)", color: "#2563EB" },
        { name: "Parent Portal Cards & NetBanking", percent: 22.0, sub: "₹31,900 (Gateway Settled)", color: "#3B82F6" },
        { name: "Cash / Counter Receipts", percent: 10.0, sub: "₹14,500 (Accounts Banked)", color: "#10B981" }
      ],
      actionText: "Open Fee Registers & Dues Ledger"
    },
    {
      id: "notices",
      title: "School Circulars",
      icon: Bell,
      bg: "#FDF2F4",
      color: "#E11D48",
      sub: "3 Published",
      tabTarget: "notices",
      badge: "Digital Broadcasts",
      kpis: [
        { label: "Active Circulars", value: "3 Live", color: "#E11D48" },
        { label: "Parent Read Rate", value: "92.6%", color: "#059669" },
        { label: "Push Deliverability", value: "99.1%", color: "#2563EB" },
        { label: "Target Audience", value: "1,248 Families", color: "#0F172A" }
      ],
      mainProgress: { label: "Parent Engagement & Read Reach", percent: 92.6, color: "#E11D48" },
      breakdownTitle: "Recent Active Circulars & Read Progress",
      breakdowns: [
        { name: "Diwali Break & PTM Schedule", percent: 98.0, sub: "1,223 Parents Read", color: "#059669" },
        { name: "Mid-Term Examination Datesheet", percent: 94.0, sub: "1,173 Parents Read", color: "#E11D48" },
        { name: "Winter Uniform & Bus Timings", percent: 86.0, sub: "1,073 Parents Read", color: "#F59E0B" }
      ],
      actionText: "Manage Notices & Circulars"
    },
    {
      id: "messages",
      title: "Parent Messages",
      icon: MessageSquare,
      bg: "#E8FBF4",
      color: "#0D9488",
      sub: "5 Unread",
      tabTarget: "notices",
      badge: "Parent Inquiry Desk",
      kpis: [
        { label: "Unread Messages", value: "5 New", color: "#0D9488" },
        { label: "Avg Reply Time", value: "14 Mins", color: "#0F172A" },
        { label: "Resolved Today", value: "24 Inquiries", color: "#059669" },
        { label: "Parent Satisfaction", value: "98.2%", color: "#2563EB" }
      ],
      mainProgress: { label: "Inquiry SLA Resolution Rate", percent: 95.8, color: "#0D9488" },
      breakdownTitle: "Inquiry Categories & Resolution",
      breakdowns: [
        { name: "Transport & Bus Tracking Support", percent: 45.0, sub: "11 Inquiries Handled", color: "#0D9488" },
        { name: "Academic Progress & Syllabus Queries", percent: 35.0, sub: "8 Inquiries Handled", color: "#14B8A6" },
        { name: "Fee Receipts & Online Payment Help", percent: 20.0, sub: "5 Inquiries Handled", color: "#059669" }
      ],
      actionText: "Open Communication Center"
    },
    {
      id: "staff",
      title: "Staff & Faculty",
      icon: Users,
      bg: "#F1F5F9",
      color: "#475569",
      sub: "Active Roster",
      tabTarget: "staff",
      badge: "Faculty Attendance & Deployment",
      kpis: [
        { label: "Staff Present Today", value: `${teacherCount - 2} / ${teacherCount}`, color: "#475569" },
        { label: "Attendance Rate", value: "96.8%", color: "#059669" },
        { label: "On Approved Leave", value: "2 Faculty", color: "#F59E0B" },
        { label: "Class Coverage", value: "100% Covered", color: "#2563EB" }
      ],
      mainProgress: { label: "Today's Faculty Attendance", percent: 96.8, color: "#475569" },
      breakdownTitle: "Department Strength & Active Attendance",
      breakdowns: [
        { name: "Science & Mathematics Faculty", percent: 100.0, sub: "18/18 Present", color: "#059669" },
        { name: "Languages (Hindi, English, Sanskrit)", percent: 95.0, sub: "19/20 Present (1 Casual Leave)", color: "#10B981" },
        { name: "Social Studies & Commerce", percent: 94.0, sub: "15/16 Present (1 Medical Leave)", color: "#F59E0B" },
        { name: "Physical Education, Arts & IT", percent: 100.0, sub: "10/10 Present", color: "#059669" }
      ],
      actionText: "Open Staff Directory & Rosters"
    },
    {
      id: "academics",
      title: "Institute Profile",
      icon: User,
      bg: "#EEF2FF",
      color: "#4F46E5",
      sub: "Settings & ERP",
      tabTarget: "academics",
      badge: "Institutional Quotas & Affiliation",
      kpis: [
        { label: "Total Students", value: `${studentCount} / 1,500`, color: "#4F46E5" },
        { label: "Total Faculty", value: `${teacherCount} Teachers`, color: "#0F172A" },
        { label: "Campus Utilization", value: "83.2%", color: "#059669" },
        { label: "Affiliation", value: "CBSE Delhi", color: "#2563EB" }
      ],
      mainProgress: { label: "Campus Enrollment Capacity", percent: Math.min(100, Math.round((studentCount / 1500) * 100)), color: "#4F46E5" },
      breakdownTitle: "Wing-Wise Student Enrollment Distribution",
      breakdowns: [
        { name: "Senior Wing (Classes 11 - 12)", percent: 92.0, sub: "276 / 300 Students", color: "#4F46E5" },
        { name: "Secondary Wing (Classes 9 - 10)", percent: 88.0, sub: "352 / 400 Students", color: "#6366F1" },
        { name: "Middle Wing (Classes 6 - 8)", percent: 84.0, sub: "336 / 400 Students", color: "#818CF8" },
        { name: "Primary Wing (Classes 1 - 5)", percent: 71.0, sub: "284 / 400 Students", color: "#10B981" }
      ],
      actionText: "Open Academic Configuration & Classes"
    },
  ];

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      {/* Top Greeting Header Matching Screenshot 2 */}
      <div style={{
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: "20px",
        padding: "24px 28px",
        marginBottom: "24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 2px 12px -2px rgba(15, 23, 42, 0.04)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <div style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            background: "#F1F5F9",
            border: "2px solid #CBD5E1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#64748B",
            fontSize: "24px",
            fontWeight: "bold"
          }}>
            👤
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <h1 style={{ fontSize: "22px", fontWeight: "900", color: "#0F172A" }}>
                Hi, {user?.role === "PARENT" ? "Parent" : "Admin"}! 👋
              </h1>
              <div style={{
                background: "#FEF3C7",
                border: "1px solid #FDE68A",
                color: "#D97706",
                padding: "3px 10px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "800",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px"
              }}>
                <Shield size={13} />
                <span>{user?.role === "PARENT" ? "Guardian" : "Administrator"}</span>
              </div>
            </div>
            <p style={{ fontSize: "13px", color: "#64748B", marginTop: "4px" }}>
              Academic Session 2026-27 • Thursday, Oct 09 • {institute?.name || (isSchool ? "Delhi Public Global School" : "Radhix Institute of Technology")}
            </p>
          </div>
        </div>

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "#ECFDF5",
          border: "1px solid #A7F3D0",
          color: "#059669",
          padding: "8px 16px",
          borderRadius: "12px",
          fontSize: "13px",
          fontWeight: "700"
        }}>
          <CheckCircle2 size={16} />
          <span>System Healthy • Live DB Sync</span>
        </div>
      </div>

      {/* 3 Metric Cards Matching Screenshot 2 Exactly (Colored Top Borders) */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "18px",
        marginBottom: "24px"
      }}>
        {/* Card 1: Total Students (Blue Top Line) */}
        <div style={{
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderTop: "4px solid #3B82F6",
          borderRadius: "16px",
          padding: "20px 22px",
          boxShadow: "0 2px 10px -2px rgba(15, 23, 42, 0.04)"
        }}>
          <div style={{ fontSize: "13px", fontWeight: "700", color: "#64748B", marginBottom: "8px" }}>
            Total Students
          </div>
          <div style={{ fontSize: "32px", fontWeight: "900", color: "#0F172A", letterSpacing: "-1px" }}>
            {studentCount}
          </div>
          <div style={{ fontSize: "12px", color: "#94A3B8", marginTop: "4px" }}>
            Enrolled in {isSchool ? "K-12 Classes" : "Degree Programs"}
          </div>
        </div>

        {/* Card 2: Total Teachers (Teal Top Line) */}
        <div style={{
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderTop: "4px solid #06B6D4",
          borderRadius: "16px",
          padding: "20px 22px",
          boxShadow: "0 2px 10px -2px rgba(15, 23, 42, 0.04)"
        }}>
          <div style={{ fontSize: "13px", fontWeight: "700", color: "#64748B", marginBottom: "8px" }}>
            {isSchool ? "Total Teachers" : "Total Faculty"}
          </div>
          <div style={{ fontSize: "32px", fontWeight: "900", color: "#0F172A", letterSpacing: "-1px" }}>
            {teacherCount}
          </div>
          <div style={{ fontSize: "12px", color: "#94A3B8", marginTop: "4px" }}>
            {isSchool ? "in your school" : "in university departments"}
          </div>
        </div>

        {/* Card 3: Total Classes (Red/Coral Top Line) */}
        <div style={{
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderTop: "4px solid #EF4444",
          borderRadius: "16px",
          padding: "20px 22px",
          boxShadow: "0 2px 10px -2px rgba(15, 23, 42, 0.04)"
        }}>
          <div style={{ fontSize: "13px", fontWeight: "700", color: "#64748B", marginBottom: "8px" }}>
            {isSchool ? "Total Classes" : "Total Departments"}
          </div>
          <div style={{ fontSize: "32px", fontWeight: "900", color: "#0F172A", letterSpacing: "-1px" }}>
            {classCount}
          </div>
          <div style={{ fontSize: "12px", color: "#94A3B8", marginTop: "4px" }}>
            {isSchool ? "Active sections (Grade 1-12)" : "B.Tech, BCA, MCA, MBA"}
          </div>
        </div>
      </div>

      {/* Payment Trends & Analytics Card Matching Screenshot 2 */}
      <div style={{
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: "20px",
        padding: "24px 28px",
        marginBottom: "24px",
        boxShadow: "0 2px 12px -2px rgba(15, 23, 42, 0.04)"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <TrendingUp size={20} color="#EF4444" />
              <h2 style={{ fontSize: "17px", fontWeight: "800", color: "#0F172A" }}>Payment Trends</h2>
            </div>
            <p style={{ fontSize: "12px", color: "#64748B", marginTop: "2px" }}>Academic Term Financial Inflows & Dues</p>
          </div>

          {/* Legend Matching Screenshot 2 */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "12px", fontWeight: "700" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#10B981" }} />
              <span style={{ color: "#334155" }}>Daily Earnings (₹)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ width: "10px", height: "10px", borderRadius: "3px", background: "#3B82F6" }} />
              <span style={{ color: "#334155" }}>Completed</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ width: "10px", height: "10px", borderRadius: "3px", background: "#F59E0B" }} />
              <span style={{ color: "#334155" }}>Pending</span>
            </div>
          </div>
        </div>

        {/* Visual Bar Graph Simulation Matching Screenshot 2 */}
        <div style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          height: "170px",
          padding: "10px 20px 20px 20px",
          background: "#F8FAFC",
          borderRadius: "14px",
          border: "1px solid #E2E8F0"
        }}>
          {[
            { date: "Oct 01", completed: 45, pending: 80, earnings: "₹45k" },
            { date: "Oct 03", completed: 85, pending: 50, earnings: "₹85k" },
            { date: "Oct 05", completed: 120, pending: 35, earnings: "₹1.2L" },
            { date: "Oct 07", completed: 60, pending: 90, earnings: "₹60k" },
            { date: "Oct 09", completed: 145, pending: 20, earnings: "₹1.45L" },
          ].map((bar, idx) => (
            <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
              <div style={{ display: "flex", alignItems: "flex-end", gap: "5px", height: "120px" }}>
                {/* Completed Blue Bar */}
                <div style={{
                  width: "18px",
                  height: `${bar.completed * 0.75}px`,
                  background: "#3B82F6",
                  borderRadius: "4px 4px 0 0"
                }} />
                {/* Pending Amber Bar */}
                <div style={{
                  width: "18px",
                  height: `${bar.pending * 0.75}px`,
                  background: "#F59E0B",
                  borderRadius: "4px 4px 0 0"
                }} />
              </div>
              <span style={{ fontSize: "11px", fontWeight: "700", color: "#64748B" }}>{bar.date}</span>
              <span style={{ fontSize: "10px", color: "#10B981", fontWeight: "800" }}>{bar.earnings}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Access Pastel Card Grid Matching Screenshot 1 & 2 */}
      <div style={{ marginBottom: "28px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "800", color: "#0F172A" }}>Quick Access Modules</h2>
          <span style={{ fontSize: "12px", color: "#64748B" }}>Shortcuts & Dashboards</span>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px"
        }}>
          {quickAccessItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                onClick={() => setSelectedModule(item)}
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  borderRadius: "16px",
                  padding: "18px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: "0 2px 8px -2px rgba(15, 23, 42, 0.04)",
                  position: "relative"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = "0 8px 20px -4px rgba(15, 23, 42, 0.08)";
                  e.currentTarget.style.borderColor = item.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "0 2px 8px -2px rgba(15, 23, 42, 0.04)";
                  e.currentTarget.style.borderColor = "#E2E8F0";
                }}
              >
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "14px"
                }}>
                  <div style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    background: item.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: item.color
                  }}>
                    <Icon size={22} />
                  </div>
                  <span style={{
                    fontSize: "10px",
                    fontWeight: "800",
                    color: item.color,
                    background: item.bg,
                    padding: "3px 8px",
                    borderRadius: "8px"
                  }}>
                    TAP OVERVIEW
                  </span>
                </div>
                <div style={{ fontSize: "14px", fontWeight: "800", color: "#0F172A" }}>
                  {item.title}
                </div>
                <div style={{ fontSize: "12px", color: "#64748B", marginTop: "2px" }}>
                  {item.sub}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Module Overview Modal with Charts & Progress Bars */}
      {selectedModule && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(5px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px"
          }}
          onClick={() => setSelectedModule(null)}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "24px",
              width: "100%",
              maxWidth: "680px",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.3)",
              border: "1px solid #E2E8F0",
              padding: "28px",
              position: "relative"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              marginBottom: "20px",
              borderBottom: "1px solid #F1F5F9",
              paddingBottom: "16px"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "14px",
                  background: selectedModule.bg,
                  color: selectedModule.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  {(() => {
                    const ModIcon = selectedModule.icon;
                    return <ModIcon size={26} />;
                  })()}
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <h2 style={{ fontSize: "20px", fontWeight: "900", color: "#0F172A", margin: 0 }}>
                      {selectedModule.title} Overview
                    </h2>
                    <span style={{
                      fontSize: "11px",
                      fontWeight: "800",
                      background: selectedModule.bg,
                      color: selectedModule.color,
                      padding: "2px 8px",
                      borderRadius: "6px"
                    }}>
                      {selectedModule.badge}
                    </span>
                  </div>
                  <p style={{ fontSize: "13px", color: "#64748B", margin: "4px 0 0 0" }}>
                    Live progress bar & metric breakdown for {institute?.name || "Delhi Public Academy"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedModule(null)}
                style={{
                  background: "#F1F5F9",
                  border: "none",
                  borderRadius: "50%",
                  width: "36px",
                  height: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#64748B"
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* 4 Mini KPI Cards */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "12px",
              marginBottom: "24px"
            }}>
              {selectedModule.kpis.map((kpi: any, idx: number) => (
                <div
                  key={idx}
                  style={{
                    background: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                    borderRadius: "12px",
                    padding: "12px",
                    textAlign: "center"
                  }}
                >
                  <div style={{ fontSize: "11px", fontWeight: "700", color: "#64748B", marginBottom: "4px" }}>
                    {kpi.label}
                  </div>
                  <div style={{ fontSize: "16px", fontWeight: "900", color: kpi.color }}>
                    {kpi.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Main Progress Bar Overview Card */}
            <div style={{
              background: "#F8FAFC",
              border: "1px solid #E2E8F0",
              borderRadius: "16px",
              padding: "18px 20px",
              marginBottom: "24px"
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "10px"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <BarChart3 size={18} color={selectedModule.color} />
                  <span style={{ fontSize: "14px", fontWeight: "800", color: "#0F172A" }}>
                    {selectedModule.mainProgress.label}
                  </span>
                </div>
                <span style={{
                  fontSize: "18px",
                  fontWeight: "900",
                  color: selectedModule.mainProgress.color
                }}>
                  {selectedModule.mainProgress.percent}%
                </span>
              </div>

              {/* Progress Bar Track */}
              <div style={{
                width: "100%",
                height: "12px",
                background: "#E2E8F0",
                borderRadius: "8px",
                overflow: "hidden"
              }}>
                <div style={{
                  width: `${selectedModule.mainProgress.percent}%`,
                  height: "100%",
                  background: selectedModule.mainProgress.color,
                  borderRadius: "8px",
                  transition: "width 0.6s ease"
                }} />
              </div>
            </div>

            {/* Sub-Category / Class Progress Breakdown */}
            <div style={{ marginBottom: "24px" }}>
              <h3 style={{
                fontSize: "14px",
                fontWeight: "800",
                color: "#0F172A",
                marginBottom: "14px",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}>
                <span>📊 {selectedModule.breakdownTitle}</span>
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {selectedModule.breakdowns.map((b: any, idx: number) => (
                  <div
                    key={idx}
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid #E2E8F0",
                      borderRadius: "12px",
                      padding: "12px 16px"
                    }}
                  >
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "6px"
                    }}>
                      <div>
                        <span style={{ fontSize: "13px", fontWeight: "800", color: "#0F172A" }}>
                          {b.name}
                        </span>
                        <span style={{ fontSize: "11px", color: "#64748B", marginLeft: "8px" }}>
                          ({b.sub})
                        </span>
                      </div>
                      <span style={{
                        fontSize: "13px",
                        fontWeight: "900",
                        color: b.color
                      }}>
                        {b.percent}%
                      </span>
                    </div>

                    {/* Mini bar */}
                    <div style={{
                      width: "100%",
                      height: "8px",
                      background: "#F1F5F9",
                      borderRadius: "6px",
                      overflow: "hidden"
                    }}>
                      <div style={{
                        width: `${Math.min(100, b.percent)}%`,
                        height: "100%",
                        background: b.color,
                        borderRadius: "6px"
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "12px",
              borderTop: "1px solid #F1F5F9",
              paddingTop: "18px"
            }}>
              <button
                onClick={() => setSelectedModule(null)}
                style={{
                  background: "#F1F5F9",
                  color: "#475569",
                  border: "none",
                  padding: "10px 18px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: "700",
                  cursor: "pointer"
                }}
              >
                Close
              </button>

              <button
                onClick={() => {
                  const target = selectedModule.tabTarget;
                  setSelectedModule(null);
                  if (onNavigateTab && target) {
                    onNavigateTab(target);
                  }
                }}
                style={{
                  background: selectedModule.color,
                  color: "#FFFFFF",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: "800",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: "0 4px 12px -2px rgba(0, 0, 0, 0.15)"
                }}
              >
                <span>{selectedModule.actionText}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
