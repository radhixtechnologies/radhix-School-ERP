import React, { useState } from "react";
import {
  LifeBuoy,
  CheckCircle,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  ArrowUpRight,
  Send,
  X,
  MessageSquare,
  ShieldAlert,
  UserCheck
} from "lucide-react";

interface Props {
  token: string | null;
  user: any;
  institute: any;
}

interface Ticket {
  id: string;
  ticket_number: string;
  title: string;
  description: string;
  category: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "OPEN" | "RESOLVED";
  raised_by_role: "TEACHER" | "PARENT" | "STUDENT" | "SCHOOL_ADMIN";
  author_name: string;
  target_role: string;
  created_at: string;
  admin_response?: string | null;
  resolved_at?: string | null;
}

export const TicketsView: React.FC<Props> = ({ user, institute }) => {
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: "tkt-01",
      ticket_number: "TKT-2026-001",
      title: "Smartboard Display Cable Fault in Physics Lab",
      description: "The HDMI connection cable to projector in Senior Physics Lab is causing screen flicker during practical demonstrations.",
      category: "Lab & Smartboard",
      priority: "HIGH",
      status: "OPEN",
      raised_by_role: "TEACHER",
      author_name: "Smt. Sunita Sharma (Class 10-A)",
      target_role: "SCHOOL_ADMIN",
      created_at: "Today, 10:15 AM",
    },
    {
      id: "tkt-02",
      ticket_number: "TKT-2026-002",
      title: "Bus Route #04 Morning Delay at Sector 14 Stop",
      description: "Bus #04 has been reaching the Sector 14 pickup stop 15 minutes behind schedule this week.",
      category: "Transport & Bus",
      priority: "MEDIUM",
      status: "OPEN",
      raised_by_role: "PARENT",
      author_name: "Vikram Kumar (Father of Aarav Kumar)",
      target_role: "SCHOOL_ADMIN",
      created_at: "Yesterday, 04:30 PM",
    },
    {
      id: "tkt-03",
      ticket_number: "TKT-2026-003",
      title: "Quarter 2 Fee Receipt PDF Download Verification",
      description: "Fee payment of ₹14,500 done via UPI, please generate signed receipt for tax proof.",
      category: "Fee & Accounts",
      priority: "LOW",
      status: "RESOLVED",
      raised_by_role: "PARENT",
      author_name: "Mrs. Kavita Sen (Mother of Anik Sen)",
      target_role: "SCHOOL_ADMIN",
      created_at: "08 Oct 2026",
      admin_response: "Receipt verified and digitally signed. Download available in Parent Portal under Payment History.",
      resolved_at: "09 Oct 2026, 11:00 AM",
    },
    {
      id: "tkt-04",
      ticket_number: "TKT-2026-004",
      title: "Library Card Barcode Scan Issue in Digital Kiosk",
      description: "Unable to check out NCERT Chemistry reference book on kiosk scanner.",
      category: "Library & Books",
      priority: "LOW",
      status: "RESOLVED",
      raised_by_role: "STUDENT",
      author_name: "Aanya Verma (Roll 01, Class 10)",
      target_role: "SCHOOL_ADMIN",
      created_at: "05 Oct 2026",
      admin_response: "Barcode re-printed and synced with LMS database. Working smoothly.",
      resolved_at: "06 Oct 2026, 02:20 PM",
    },
  ]);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  // Resolve Ticket Modal
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [resolveText, setResolveText] = useState("");

  // Escalate to Super Admin Modal
  const [showEscalateModal, setShowEscalateModal] = useState(false);
  const [escCategory, setEscCategory] = useState("CBSE Affiliation & Compliance");
  const [escPriority, setEscPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("HIGH");
  const [escTitle, setEscTitle] = useState("");
  const [escDesc, setEscDesc] = useState("");
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  const handleResolve = () => {
    if (!selectedTicket || !resolveText.trim()) return;
    setTickets((prev) =>
      prev.map((t) =>
        t.id === selectedTicket.id
          ? {
              ...t,
              status: "RESOLVED",
              admin_response: resolveText.trim(),
              resolved_at: "Just now",
            }
          : t
      )
    );
    setSelectedTicket(null);
    setResolveText("");
    showToast("Ticket resolved & notification dispatched to user!");
  };

  const handleEscalate = () => {
    if (!escTitle.trim()) return;
    const newTkt: Ticket = {
      id: `tkt-esc-${Date.now()}`,
      ticket_number: `TKT-ESC-${tickets.length + 1}`,
      title: escTitle.trim(),
      description: escDesc.trim(),
      category: escCategory,
      priority: escPriority,
      status: "OPEN",
      raised_by_role: "SCHOOL_ADMIN",
      author_name: institute?.name || "School Administration",
      target_role: "SUPER_ADMIN",
      created_at: "Just now",
    };
    setTickets([newTkt, ...tickets]);
    setShowEscalateModal(false);
    setEscTitle("");
    setEscDesc("");
    showToast("Ticket successfully escalated to Super Admin!");
  };

  const filtered = tickets.filter((t) => {
    const matchSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.author_name.toLowerCase().includes(search.toLowerCase()) ||
      t.ticket_number.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "ALL" || t.raised_by_role === roleFilter;
    const matchStatus = statusFilter === "ALL" || t.status === statusFilter;
    const matchPriority = priorityFilter === "ALL" || t.priority === priorityFilter;
    return matchSearch && matchRole && matchStatus && matchPriority;
  });

  const totalOpen = tickets.filter((t) => t.status === "OPEN").length;
  const totalResolved = tickets.filter((t) => t.status === "RESOLVED").length;
  const totalHigh = tickets.filter((t) => t.priority === "HIGH" && t.status === "OPEN").length;

  return (
    <div style={{ padding: "28px 32px" }}>
      {/* Toast Notification */}
      {toastMsg && (
        <div style={{
          position: "fixed",
          top: "24px",
          right: "24px",
          background: "#10B981",
          color: "#fff",
          padding: "12px 20px",
          borderRadius: "10px",
          fontWeight: 700,
          boxShadow: "0 10px 25px rgba(16, 185, 129, 0.4)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          <CheckCircle size={18} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#0F172A", margin: 0 }}>
              Helpdesk & Support Tickets Hub
            </h1>
            <span style={{
              background: "#EDE9FE",
              color: "#6D28D9",
              padding: "4px 10px",
              borderRadius: "12px",
              fontSize: "12px",
              fontWeight: 800
            }}>
              Multi-Tier Routing
            </span>
          </div>
          <p style={{ color: "#64748B", fontSize: "14px", marginTop: "4px" }}>
            Manage & resolve issues raised by Teachers, Parents, and Students. Escalate legal and platform matters to Super Admin.
          </p>
        </div>

        <button
          onClick={() => setShowEscalateModal(true)}
          style={{
            background: "linear-gradient(135deg, #1E1B4B 0%, #4338CA 100%)",
            color: "#fff",
            border: "none",
            padding: "10px 18px",
            borderRadius: "10px",
            fontSize: "13px",
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(30, 27, 75, 0.25)"
          }}
        >
          <ShieldAlert size={16} />
          <span>+ Escalate to Super Admin</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
        <div style={{ background: "#fff", padding: "18px", borderRadius: "14px", border: "1px solid #E2E8F0" }}>
          <div style={{ color: "#64748B", fontSize: "12px", fontWeight: 700, marginBottom: "6px" }}>TOTAL TICKETS</div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "#0F172A" }}>{tickets.length}</div>
          <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "4px" }}>Logged across institution</div>
        </div>

        <div style={{ background: "#fff", padding: "18px", borderRadius: "14px", border: "1px solid #E2E8F0" }}>
          <div style={{ color: "#D97706", fontSize: "12px", fontWeight: 700, marginBottom: "6px" }}>ACTIVE / OPEN</div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "#D97706" }}>{totalOpen}</div>
          <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "4px" }}>Requires admin action</div>
        </div>

        <div style={{ background: "#fff", padding: "18px", borderRadius: "14px", border: "1px solid #E2E8F0" }}>
          <div style={{ color: "#10B981", fontSize: "12px", fontWeight: 700, marginBottom: "6px" }}>RESOLVED</div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "#10B981" }}>{totalResolved}</div>
          <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "4px" }}>100% resolution rate</div>
        </div>

        <div style={{ background: "#fff", padding: "18px", borderRadius: "14px", border: "1px solid #E2E8F0" }}>
          <div style={{ color: "#EF4444", fontSize: "12px", fontWeight: 700, marginBottom: "6px" }}>HIGH PRIORITY</div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "#EF4444" }}>{totalHigh}</div>
          <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "4px" }}>Immediate review needed</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        background: "#fff",
        padding: "16px",
        borderRadius: "14px",
        border: "1px solid #E2E8F0",
        marginBottom: "20px",
        display: "flex",
        flexWrap: "wrap",
        gap: "12px",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: "260px" }}>
          <div style={{ position: "relative", width: "100%" }}>
            <Search size={16} style={{ position: "absolute", left: "12px", top: "11px", color: "#94A3B8" }} />
            <input
              type="text"
              placeholder="Search by ticket #, user name, or subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px 8px 36px",
                borderRadius: "8px",
                border: "1px solid #CBD5E1",
                fontSize: "13px",
                outline: "none"
              }}
            />
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", fontWeight: 600 }}
          >
            <option value="ALL">All Roles</option>
            <option value="TEACHER">Teachers Only</option>
            <option value="PARENT">Parents Only</option>
            <option value="STUDENT">Students Only</option>
            <option value="SCHOOL_ADMIN">Escalated to Super Admin</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", fontWeight: 600 }}
          >
            <option value="ALL">All Status</option>
            <option value="OPEN">Open / Pending</option>
            <option value="RESOLVED">Resolved</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", fontWeight: 600 }}
          >
            <option value="ALL">All Priority</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Tickets List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {filtered.length === 0 ? (
          <div style={{
            background: "#fff",
            padding: "48px",
            borderRadius: "16px",
            border: "1px solid #E2E8F0",
            textAlign: "center",
            color: "#64748B"
          }}>
            <LifeBuoy size={42} style={{ margin: "0 auto 12px", opacity: 0.4 }} />
            <div style={{ fontSize: "16px", fontWeight: 700 }}>No matching tickets found</div>
            <div style={{ fontSize: "13px", marginTop: "4px" }}>Try altering your search query or filter criteria.</div>
          </div>
        ) : (
          filtered.map((t) => {
            const isResolved = t.status === "RESOLVED";
            const isHigh = t.priority === "HIGH";
            const isEscalated = t.target_role === "SUPER_ADMIN";

            return (
              <div
                key={t.id}
                style={{
                  background: "#fff",
                  borderRadius: "16px",
                  border: isResolved ? "1px solid #BBF7D0" : "1px solid #E2E8F0",
                  padding: "20px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                  transition: "all 0.2s"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                    <span style={{
                      fontFamily: "monospace",
                      fontWeight: 800,
                      fontSize: "12px",
                      color: "#475569",
                      background: "#F1F5F9",
                      padding: "3px 8px",
                      borderRadius: "6px"
                    }}>
                      {t.ticket_number}
                    </span>

                    <span style={{
                      fontSize: "11px",
                      fontWeight: 800,
                      padding: "3px 8px",
                      borderRadius: "6px",
                      background: t.raised_by_role === "TEACHER" ? "#EDE9FE" : t.raised_by_role === "PARENT" ? "#E0F2FE" : "#FEF3C7",
                      color: t.raised_by_role === "TEACHER" ? "#6D28D9" : t.raised_by_role === "PARENT" ? "#0284C7" : "#D97706",
                    }}>
                      {t.raised_by_role}
                    </span>

                    <span style={{ fontSize: "12px", fontWeight: 700, color: "#1E293B" }}>
                      {t.author_name}
                    </span>

                    <span style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: "6px",
                      background: isHigh ? "#FEE2E2" : "#F8FAFC",
                      color: isHigh ? "#DC2626" : "#64748B",
                      border: `1px solid ${isHigh ? "#FCA5A5" : "#E2E8F0"}`
                    }}>
                      {t.priority} PRIORITY
                    </span>

                    <span style={{ fontSize: "12px", color: "#64748B" }}>
                      • {t.category}
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{
                      fontSize: "11px",
                      fontWeight: 800,
                      padding: "4px 10px",
                      borderRadius: "20px",
                      background: isResolved ? "#DCFCE7" : "#FEF3C7",
                      color: isResolved ? "#15803D" : "#B45309"
                    }}>
                      {isResolved ? "RESOLVED" : "OPEN"}
                    </span>
                  </div>
                </div>

                <div style={{ fontSize: "16px", fontWeight: 800, color: "#0F172A", marginBottom: "6px" }}>
                  {t.title}
                </div>

                <div style={{ fontSize: "14px", color: "#475569", lineHeight: 1.5, marginBottom: "14px" }}>
                  {t.description}
                </div>

                {/* Resolution response box */}
                {isResolved && t.admin_response ? (
                  <div style={{
                    background: "#F0FDF4",
                    border: "1px solid #BBF7D0",
                    borderRadius: "10px",
                    padding: "12px 16px",
                    marginTop: "10px"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#15803D", fontWeight: 700, fontSize: "12px", marginBottom: "4px" }}>
                      <CheckCircle size={14} />
                      <span>Resolution Response:</span>
                      <span style={{ color: "#166534", fontWeight: 500, fontSize: "11px" }}>({t.resolved_at})</span>
                    </div>
                    <div style={{ fontSize: "13px", color: "#166534" }}>
                      {t.admin_response}
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "8px", borderTop: "1px solid #F1F5F9" }}>
                    <div style={{ fontSize: "12px", color: "#94A3B8" }}>
                      Submitted: {t.created_at}
                    </div>

                    {!isEscalated && (
                      <button
                        onClick={() => {
                          setSelectedTicket(t);
                          setResolveText("");
                        }}
                        style={{
                          background: "#059669",
                          color: "#fff",
                          border: "none",
                          padding: "8px 16px",
                          borderRadius: "8px",
                          fontSize: "12px",
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px"
                        }}
                      >
                        <MessageSquare size={14} />
                        <span>Respond & Resolve</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Resolve Ticket Modal */}
      {selectedTicket && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(15, 23, 42, 0.6)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "#fff",
            borderRadius: "20px",
            width: "550px",
            padding: "24px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <CheckCircle size={20} color="#059669" />
                <h3 style={{ fontSize: "18px", fontWeight: 800, margin: 0, color: "#0F172A" }}>
                  Resolve Ticket: {selectedTicket.ticket_number}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B" }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ background: "#F8FAFC", padding: "12px", borderRadius: "10px", marginBottom: "16px" }}>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "#1E293B" }}>{selectedTicket.title}</div>
              <div style={{ fontSize: "12px", color: "#64748B", marginTop: "4px" }}>
                By: {selectedTicket.author_name} ({selectedTicket.raised_by_role})
              </div>
            </div>

            <div style={{ marginBottom: "18px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                Official Resolution Note & Response:
              </label>
              <textarea
                rows={4}
                value={resolveText}
                onChange={(e) => setResolveText(e.target.value)}
                placeholder="Enter actions taken, technician dispatch details, or resolution instructions..."
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "10px",
                  border: "1px solid #CBD5E1",
                  fontSize: "13px",
                  outline: "none",
                  boxSizing: "border-box"
                }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                onClick={() => setSelectedTicket(null)}
                style={{
                  padding: "10px 18px",
                  borderRadius: "8px",
                  border: "1px solid #CBD5E1",
                  background: "#fff",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleResolve}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#059669",
                  color: "#fff",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                Confirm & Mark Resolved
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Escalate to Super Admin Modal */}
      {showEscalateModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(15, 23, 42, 0.6)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "#fff",
            borderRadius: "20px",
            width: "580px",
            padding: "26px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <ShieldAlert size={22} color="#4338CA" />
                <h3 style={{ fontSize: "18px", fontWeight: 800, margin: 0, color: "#0F172A" }}>
                  Escalate Matter to Super Admin
                </h3>
              </div>
              <button
                onClick={() => setShowEscalateModal(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B" }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: "13px", color: "#64748B", marginTop: 0, marginBottom: "16px" }}>
              This ticket will be routed directly to the Central Multi-Vendor Platform Owner / Super Admin desk.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                  Category
                </label>
                <select
                  value={escCategory}
                  onChange={(e) => setEscCategory(e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px" }}
                >
                  <option value="CBSE Affiliation & Compliance">CBSE Affiliation & Compliance</option>
                  <option value="Server Quota & Storage Upgrade">Server Quota & Storage Upgrade</option>
                  <option value="Payment Gateway & Fee Settlement">Payment Gateway & Fee Settlement</option>
                  <option value="Legal & Trust Deed Dispute">Legal & Trust Deed Dispute</option>
                  <option value="System Security & Access Rights">System Security & Access Rights</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                  Priority Level
                </label>
                <select
                  value={escPriority}
                  onChange={(e) => setEscPriority(e.target.value as any)}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px" }}
                >
                  <option value="HIGH">High (Urgent Attention)</option>
                  <option value="MEDIUM">Medium (Standard)</option>
                  <option value="LOW">Low (Inquiry)</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                Subject / Title
              </label>
              <input
                type="text"
                placeholder="e.g. CBSE Affiliation Extension Certificate Renewal Approval"
                value={escTitle}
                onChange={(e) => setEscTitle(e.target.value)}
                style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", boxSizing: "border-box" }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                Comprehensive Details & Context
              </label>
              <textarea
                rows={4}
                placeholder="Provide complete background, file references, and desired outcome from Super Admin..."
                value={escDesc}
                onChange={(e) => setEscDesc(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", boxSizing: "border-box" }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                onClick={() => setShowEscalateModal(false)}
                style={{ padding: "10px 18px", borderRadius: "8px", border: "1px solid #CBD5E1", background: "#fff", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                onClick={handleEscalate}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "none",
                  background: "linear-gradient(135deg, #1E1B4B 0%, #4338CA 100%)",
                  color: "#fff",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                Submit to Super Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
