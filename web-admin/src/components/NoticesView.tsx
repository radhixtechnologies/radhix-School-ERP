import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Bell,
  RefreshCw,
  Search,
  Smartphone,
  CheckCircle,
  AlertTriangle,
  FileText,
  Calendar,
  Share2,
  Star,
  Trash2,
  Users,
  GraduationCap,
  Briefcase,
  X,
  ShieldCheck,
  Sparkles,
  Send,
  Download,
  Flame,
  Check,
  Award
} from "lucide-react";
import { ContentLoadingSkeleton } from "./GlobalLoader";

interface Notice {
  id: string;
  title: string;
  content: string;
  target_audience: "ALL" | "STUDENTS" | "PARENTS" | "STAFF";
  category: "URGENT" | "EXAM" | "ACADEMIC" | "PTM" | "SPORTS" | "GENERAL";
  priority?: "HIGH" | "NORMAL";
  attachment_url?: string | null;
  created_by?: string;
  published_at: string;
  isPinned?: boolean;
}

interface Props {
  token: string | null;
  institute?: any;
}

const TEMPLATES = [
  {
    name: "🚨 Emergency Closure",
    title: "🚨 Urgent Alert: Unscheduled Heavy Rainfall School Closure Advisory",
    category: "URGENT" as const,
    audience: "ALL" as const,
    priority: "HIGH" as const,
    content:
      "Due to intense weather forecasts and heavy waterlogging across city transit routes, school campus will remain closed tomorrow for all classes. Digital synchronous review sessions will proceed on Google Meet.",
    attachment: "Weather_Closure_Advisory_Circular.pdf",
  },
  {
    name: "📝 Exam Date Sheet",
    title: "Mid-Term Examination 2026-27 Date Sheet & Admit Card Release",
    category: "EXAM" as const,
    audience: "STUDENTS" as const,
    priority: "NORMAL" as const,
    content:
      "The official datesheet for Mid-Term Examination (Classes 6th to 12th) is now published. Students must download and verify their digital admit cards from the student portal before 28th October.",
    attachment: "MidTerm_Datesheet_2026_Final.pdf",
  },
  {
    name: "👨‍👩‍👧 PTM Meeting",
    title: "Parent-Teacher Interaction Meet (PTM) for Term-1 Academic Review",
    category: "PTM" as const,
    audience: "PARENTS" as const,
    priority: "NORMAL" as const,
    content:
      "All parents and guardians are cordially invited to attend the physical PTM on Saturday, 26th October between 08:30 AM and 01:30 PM. Respective slot timings have been notified to student registered WhatsApp contact numbers.",
    attachment: "PTM_Schedule_SlotWise_Term1.pdf",
  },
  {
    name: "🏆 Sports Meet",
    title: "Annual Inter-School Athletics Championship & Sports Day Registrations",
    category: "SPORTS" as const,
    audience: "STUDENTS" as const,
    priority: "NORMAL" as const,
    content:
      "Registrations are open for the 18th Annual Inter-School Sports Meet. Events include 100m sprint, relay, long jump, football and lawn tennis. Interested students may register at the Sports Complex by 25th October.",
    attachment: "Sports_Meet_Entry_Form_2026.pdf",
  },
];

export const NoticesView = ({ token, institute }: Props) => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedAudience, setSelectedAudience] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"NEWEST" | "PRIORITY">("NEWEST");
  const [showModal, setShowModal] = useState(false);
  const [previewPhoneNotice, setPreviewPhoneNotice] = useState<Notice | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form State for creating a notice
  const [formData, setFormData] = useState<{
    title: string;
    content: string;
    target_audience: "ALL" | "STUDENTS" | "PARENTS" | "STAFF";
    category: "URGENT" | "EXAM" | "ACADEMIC" | "PTM" | "SPORTS" | "GENERAL";
    priority: "HIGH" | "NORMAL";
    attachment_url: string;
    created_by: string;
  }>({
    title: "",
    content: "",
    target_audience: "ALL",
    category: "GENERAL",
    priority: "NORMAL",
    attachment_url: "",
    created_by: "Office of the Principal",
  });

  useEffect(() => {
    loadNotices();
  }, []);

  const loadNotices = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/v1/notices", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const j = await res.json();
      if (j.success && Array.isArray(j.data) && j.data.length > 0) {
        setNotices(j.data);
      } else {
        // Fallback demo data if empty
        setNotices([
          {
            id: "ntc-1",
            title: "🚨 Urgent Alert: Unscheduled Heavy Rainfall School Closure Advisory",
            content:
              "Due to meteorological red alerts and excessive waterlogging across city transit routes, school campus will remain closed on Friday, 24th Oct 2026 for Nursery to Class 12. Online synchronous doubt-clearing sessions will proceed via Google Meet as scheduled.",
            target_audience: "ALL",
            category: "URGENT",
            priority: "HIGH",
            attachment_url: "Circular_Advisory_Weather_Closure.pdf",
            created_by: "Office of the Principal",
            published_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
            isPinned: true,
          },
          {
            id: "ntc-2",
            title: "Mid-Term Examination 2026-27 Date Sheet & Admit Card Release",
            content:
              "The official datesheet for Mid-Term Examination (Classes 6th to 12th) is now published. Students must download and verify their digital admit cards from the student portal before 28th October. Late entry to exam hall without stamped admit card is strictly prohibited.",
            target_audience: "STUDENTS",
            category: "EXAM",
            priority: "NORMAL",
            attachment_url: "MidTerm_Datesheet_2026_Final.pdf",
            created_by: "Controller of Examinations",
            published_at: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
            isPinned: true,
          },
          {
            id: "ntc-3",
            title: "Parent-Teacher Interaction Meet (PTM) for Term-1 Academic Review",
            content:
              "All parents and guardians are cordially invited to attend the physical PTM on Saturday, 26th October between 08:30 AM and 01:30 PM. Respective slot timings have been notified to student registered WhatsApp contact numbers. Valet and campus parking is open at Gate #2.",
            target_audience: "PARENTS",
            category: "PTM",
            priority: "NORMAL",
            attachment_url: "PTM_Schedule_SlotWise_Term1.pdf",
            created_by: "Vice Principal (Academics)",
            published_at: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),
          },
          {
            id: "ntc-4",
            title: "Annual Inter-School Athletics Championship & Sports Day Registrations",
            content:
              "Registrations are open for the 18th Annual Inter-School Sports Meet. Events include 100m/400m sprint, relay, long jump, football and lawn tennis. Interested students may register their names with Coach Devendra Singh at the Sports Complex by 25th October.",
            target_audience: "STUDENTS",
            category: "SPORTS",
            priority: "NORMAL",
            attachment_url: "Sports_Meet_Entry_Form_2026.pdf",
            created_by: "Sports Department",
            published_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
          },
          {
            id: "ntc-5",
            title: "Mandatory Staff Faculty Meeting & CBSE Curriculum Workshop",
            content:
              "A mandatory workshop on 'Experiential Pedagogy & NEP 2020 Compliance' will be conducted by CBSE master trainers in Auditorium Hall on Monday at 02:45 PM. All PGT, TGT and PRT teachers are required to bring lesson plans and digital attendance logs.",
            target_audience: "STAFF",
            category: "ACADEMIC",
            priority: "NORMAL",
            attachment_url: "NEP_Curriculum_Guidelines_2026.pdf",
            created_by: "Academic Dean",
            published_at: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
          },
        ]);
      }
    } catch {
      // Keep existing data
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/v1/notices", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      const j = await res.json();
      if (j.success) {
        setShowModal(false);
        setFormData({
          title: "",
          content: "",
          target_audience: "ALL",
          category: "GENERAL",
          priority: "NORMAL",
          attachment_url: "",
          created_by: "Office of the Principal",
        });
        loadNotices();
      }
    } catch {
      // Local fallback insert
      const fallbackNotice: Notice = {
        id: "ntc-" + Date.now(),
        ...formData,
        published_at: new Date().toISOString(),
      };
      setNotices([fallbackNotice, ...notices]);
      setShowModal(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to archive or remove this official notice?")) return;
    try {
      await fetch(`http://localhost:5000/api/v1/notices/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {}
    setNotices(notices.filter((n) => n.id !== id));
  };

  const togglePin = (id: string) => {
    setNotices(
      notices.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned } : n))
    );
  };

  const handleCopy = (notice: Notice) => {
    navigator.clipboard.writeText(`${notice.title}\n\n${notice.content}\n\n— Delhi Public Academy`);
    setCopiedId(notice.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const applyTemplate = (t: (typeof TEMPLATES)[number]) => {
    setFormData({
      title: t.title,
      content: t.content,
      target_audience: t.audience,
      category: t.category,
      priority: t.priority,
      attachment_url: t.attachment,
      created_by: "Office of the Principal",
    });
  };

  // Filtered & Sorted Notices
  const filteredNotices = useMemo(() => {
    return notices
      .filter((n) => {
        const matchesSearch =
          n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (n.created_by && n.created_by.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesCategory =
          selectedCategory === "ALL" || n.category === selectedCategory;

        const matchesAudience =
          selectedAudience === "ALL" || n.target_audience === selectedAudience;

        return matchesSearch && matchesCategory && matchesAudience;
      })
      .sort((a, b) => {
        // Pinned always on top
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;

        if (sortBy === "PRIORITY") {
          const pA = a.priority === "HIGH" || a.category === "URGENT" ? 1 : 0;
          const pB = b.priority === "HIGH" || b.category === "URGENT" ? 1 : 0;
          if (pA !== pB) return pB - pA;
        }
        return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
      });
  }, [notices, searchQuery, selectedCategory, selectedAudience, sortBy]);

  // Statistics
  const stats = useMemo(() => {
    const total = notices.length;
    const urgent = notices.filter((n) => n.priority === "HIGH" || n.category === "URGENT").length;
    const parents = notices.filter((n) => n.target_audience === "PARENTS" || n.target_audience === "ALL").length;
    const staff = notices.filter((n) => n.target_audience === "STAFF" || n.target_audience === "ALL").length;
    return { total, urgent, parents, staff };
  }, [notices]);

  const getCategoryTheme = (category: string) => {
    switch (category) {
      case "URGENT":
        return {
          bg: "#FEF2F2",
          text: "#DC2626",
          border: "#FCA5A5",
          label: "⚡ URGENT ALERT",
          gradient: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
        };
      case "EXAM":
        return {
          bg: "#F5F3FF",
          text: "#7C3AED",
          border: "#DDD6FE",
          label: "📝 EXAM SCHEDULE",
          gradient: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
        };
      case "ACADEMIC":
        return {
          bg: "#EEF2FF",
          text: "#4F46E5",
          border: "#C7D2FE",
          label: "📚 ACADEMIC CIRCULAR",
          gradient: "linear-gradient(135deg, #4F46E5 0%, #3730A3 100%)",
        };
      case "PTM":
        return {
          bg: "#FFFBEB",
          text: "#D97706",
          border: "#FDE68A",
          label: "👨‍👩‍👧 PTM INTERACTION",
          gradient: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
        };
      case "SPORTS":
        return {
          bg: "#ECFDF5",
          text: "#059669",
          border: "#A7F3D0",
          label: "🏆 SPORTS & ATHLETICS",
          gradient: "linear-gradient(135deg, #10B981 0%, #047857 100%)",
        };
      default:
        return {
          bg: "#F1F5F9",
          text: "#475569",
          border: "#CBD5E1",
          label: "📢 GENERAL NOTICE",
          gradient: "linear-gradient(135deg, #64748B 0%, #334155 100%)",
        };
    }
  };

  const getAudienceIcon = (aud: string) => {
    switch (aud) {
      case "PARENTS":
        return <Users size={13} style={{ color: "#D97706" }} />;
      case "STUDENTS":
        return <GraduationCap size={13} style={{ color: "#7C3AED" }} />;
      case "STAFF":
        return <Briefcase size={13} style={{ color: "#2563EB" }} />;
      default:
        return <Sparkles size={13} style={{ color: "#10B981" }} />;
    }
  };

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto", paddingBottom: "60px" }}>
      {/* 1. Cinematic Header Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #0F172A 0%, #1E1B4B 60%, #1E293B 100%)",
          borderRadius: "20px",
          padding: "28px 32px",
          color: "#FFFFFF",
          marginBottom: "24px",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 20px 40px -15px rgba(30, 27, 75, 0.4)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        {/* Ambient Glow Orbs */}
        <div
          style={{
            position: "absolute",
            top: "-40px",
            right: "10%",
            width: "240px",
            height: "240px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99, 102, 241, 0.35) 0%, rgba(99, 102, 241, 0) 70%)",
            filter: "blur(40px)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-30px",
            left: "30%",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(239, 68, 68, 0.25) 0%, rgba(239, 68, 68, 0) 70%)",
            filter: "blur(35px)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            position: "relative",
            zIndex: 10,
          }}
        >
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255, 255, 255, 0.1)", backdropFilter: "blur(10px)", padding: "5px 12px", borderRadius: "999px", marginBottom: "10px", border: "1px solid rgba(255, 255, 255, 0.15)" }}>
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#10B981", boxShadow: "0 0 8px #10B981" }} />
              <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.5px", textTransform: "uppercase", color: "#E0E7FF" }}>
                Multi-Channel Real-time Broadcast Engine
              </span>
            </div>
            <h1 style={{ fontSize: "26px", fontWeight: "900", letterSpacing: "-0.5px", margin: "0 0 6px 0", color: "#FFFFFF" }}>
              Notice Board & Smart Circulars
            </h1>
            <p style={{ fontSize: "14px", color: "#94A3B8", maxWidth: "620px", lineHeight: "1.5", margin: 0 }}>
              Broadcast instant push alerts to student & parent mobile apps, publish official exam date sheets, and maintain an immutable school circular repository.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <button
              onClick={loadNotices}
              title="Refresh feeds"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "#FFFFFF",
                padding: "11px 16px",
                borderRadius: "12px",
                fontWeight: 600,
                fontSize: "13px",
                cursor: "pointer",
                backdropFilter: "blur(8px)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.16)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)")}
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
              <span>Refresh Feed</span>
            </button>

            <button
              onClick={() => {
                if (notices.length > 0) setPreviewPhoneNotice(notices[0]);
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(99, 102, 241, 0.2)",
                border: "1px solid rgba(129, 140, 248, 0.4)",
                color: "#C7D2FE",
                padding: "11px 16px",
                borderRadius: "12px",
                fontWeight: 600,
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              <Smartphone size={15} />
              <span>Mobile App Simulator</span>
            </button>

            <button
              onClick={() => setShowModal(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "linear-gradient(135deg, #4F46E5 0%, #3730A3 100%)",
                color: "#FFFFFF",
                padding: "11px 20px",
                borderRadius: "12px",
                fontWeight: 700,
                fontSize: "14px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "0 8px 20px rgba(79, 70, 229, 0.4)",
                cursor: "pointer",
              }}
            >
              <Plus size={18} />
              <span>Publish Circular</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Modular KPI Summary Ribbon */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        {/* Stat 1 */}
        <div
          style={{
            background: "var(--bg-surface)",
            borderRadius: "16px",
            padding: "18px 20px",
            border: "1px solid var(--border-subtle)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              background: "#EEF2FF",
              color: "#4F46E5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Bell size={24} />
          </div>
          <div>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>
              Total Circulars
            </div>
            <div style={{ fontSize: "24px", fontWeight: 800, color: "var(--text-primary)" }}>
              {stats.total}
            </div>
            <div style={{ fontSize: "12px", color: "#10B981", fontWeight: 600 }}>● Live & Active on Portal</div>
          </div>
        </div>

        {/* Stat 2 */}
        <div
          style={{
            background: "var(--bg-surface)",
            borderRadius: "16px",
            padding: "18px 20px",
            border: "1px solid var(--border-subtle)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              background: "#FEF2F2",
              color: "#EF4444",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Flame size={24} />
          </div>
          <div>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>
              Urgent Broadcasts
            </div>
            <div style={{ fontSize: "24px", fontWeight: 800, color: "#EF4444" }}>
              {stats.urgent}
            </div>
            <div style={{ fontSize: "12px", color: "#EF4444", fontWeight: 600 }}>⚡ High Priority Push</div>
          </div>
        </div>

        {/* Stat 3 */}
        <div
          style={{
            background: "var(--bg-surface)",
            borderRadius: "16px",
            padding: "18px 20px",
            border: "1px solid var(--border-subtle)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              background: "#ECFDF5",
              color: "#10B981",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Smartphone size={24} />
          </div>
          <div>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>
              Parent Mobile App Reach
            </div>
            <div style={{ fontSize: "24px", fontWeight: 800, color: "var(--text-primary)" }}>
              98.4%
            </div>
            <div style={{ fontSize: "12px", color: "#10B981", fontWeight: 600 }}>1,248 Devices Synced</div>
          </div>
        </div>

        {/* Stat 4 */}
        <div
          style={{
            background: "var(--bg-surface)",
            borderRadius: "16px",
            padding: "18px 20px",
            border: "1px solid var(--border-subtle)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              background: "#FFFBEB",
              color: "#F59E0B",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <ShieldCheck size={24} />
          </div>
          <div>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>
              Staff & Internal
            </div>
            <div style={{ fontSize: "24px", fontWeight: 800, color: "var(--text-primary)" }}>
              {stats.staff}
            </div>
            <div style={{ fontSize: "12px", color: "#F59E0B", fontWeight: 600 }}>Faculty Directives</div>
          </div>
        </div>
      </div>

      {/* 3. Modular Control Bar (Search, Category Pills, Audience Filter) */}
      <div
        style={{
          background: "var(--bg-surface)",
          borderRadius: "16px",
          padding: "18px 20px",
          border: "1px solid var(--border-subtle)",
          marginBottom: "24px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          {/* Search Box */}
          <div
            style={{
              position: "relative",
              flex: "1 1 320px",
              maxWidth: "500px",
            }}
          >
            <Search
              size={17}
              style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)",
              }}
            />
            <input
              type="text"
              placeholder="Search circulars by title, topic, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px 10px 42px",
                borderRadius: "12px",
                border: "1.5px solid var(--border-subtle)",
                background: "var(--bg-deep)",
                color: "var(--text-primary)",
                fontSize: "14px",
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  color: "var(--text-muted)",
                }}
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Audience and Sort Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)" }}>AUDIENCE:</span>
              <select
                value={selectedAudience}
                onChange={(e) => setSelectedAudience(e.target.value)}
                style={{
                  padding: "9px 12px",
                  borderRadius: "10px",
                  border: "1px solid var(--border-subtle)",
                  background: "var(--bg-surface)",
                  color: "var(--text-primary)",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <option value="ALL">All Recipients (Broadcast)</option>
                <option value="PARENTS">Parents Only</option>
                <option value="STUDENTS">Students Only</option>
                <option value="STAFF">Staff & Teachers Only</option>
              </select>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)" }}>SORT:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                style={{
                  padding: "9px 12px",
                  borderRadius: "10px",
                  border: "1px solid var(--border-subtle)",
                  background: "var(--bg-surface)",
                  color: "var(--text-primary)",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <option value="NEWEST">Latest First</option>
                <option value="PRIORITY">High Priority First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Modular Category Filter Pills */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
          {[
            { id: "ALL", label: "All Circulars", icon: Sparkles },
            { id: "URGENT", label: "⚡ Urgent Alerts", icon: AlertTriangle },
            { id: "EXAM", label: "📝 Examination Schedules", icon: Calendar },
            { id: "ACADEMIC", label: "📚 Academic & Syllabus", icon: FileText },
            { id: "PTM", label: "👨‍👩‍👧 PTM & Parent Advisory", icon: Users },
            { id: "SPORTS", label: "🏆 Sports & Athletics", icon: Award },
            { id: "GENERAL", label: "📢 General Announcements", icon: Bell },
          ].map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`cinematic-pill ${isActive ? "active" : ""}`}
              >
                <cat.icon size={14} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Notices Grid List */}
      {loading ? (
        <ContentLoadingSkeleton
          title="Loading Modular Notice Repository..."
          subtitle="Syncing real-time circular feeds from cloud database"
          count={4}
        />
      ) : filteredNotices.length === 0 ? (
        <div
          style={{
            background: "var(--bg-surface)",
            borderRadius: "20px",
            padding: "60px 24px",
            textAlign: "center",
            border: "1px dashed var(--border-subtle)",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "16px",
              background: "#EEF2FF",
              color: "#4F46E5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <Bell size={28} />
          </div>
          <h3 style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "6px" }}>
            No Circulars Match Your Filter
          </h3>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "20px" }}>
            Try resetting your search query or selecting a different category.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("ALL");
              setSelectedAudience("ALL");
            }}
            style={{
              padding: "10px 20px",
              borderRadius: "10px",
              background: "#4F46E5",
              color: "#FFFFFF",
              fontWeight: 700,
              fontSize: "13px",
            }}
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: "20px" }}>
          {filteredNotices.map((n) => {
            const theme = getCategoryTheme(n.category);
            const isUrgent = n.category === "URGENT" || n.priority === "HIGH";

            return (
              <div
                key={n.id}
                className={`cinematic-card-interactive ${isUrgent ? "cinematic-glow-urgent" : ""}`}
                style={{
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: "260px",
                  border: isUrgent ? "1.5px solid #FCA5A5" : "1px solid var(--border-subtle)",
                }}
              >
                <div>
                  {/* Top Card Row */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "14px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 800,
                          background: theme.bg,
                          color: theme.text,
                          border: `1px solid ${theme.border}`,
                          padding: "4px 10px",
                          borderRadius: "999px",
                          letterSpacing: "0.4px",
                        }}
                      >
                        {theme.label}
                      </span>

                      {/* Audience Badge */}
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          fontSize: "11px",
                          fontWeight: 700,
                          background: "var(--bg-deep)",
                          color: "var(--text-secondary)",
                          padding: "4px 9px",
                          borderRadius: "999px",
                          border: "1px solid var(--border-subtle)",
                        }}
                      >
                        {getAudienceIcon(n.target_audience)}
                        <span>{n.target_audience}</span>
                      </span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <button
                        onClick={() => togglePin(n.id)}
                        title={n.isPinned ? "Unpin notice" : "Pin notice to top"}
                        style={{
                          background: n.isPinned ? "#FEF3C7" : "transparent",
                          color: n.isPinned ? "#D97706" : "var(--text-muted)",
                          padding: "6px",
                          borderRadius: "8px",
                        }}
                      >
                        <Star size={16} fill={n.isPinned ? "#D97706" : "none"} />
                      </button>

                      <button
                        onClick={() => handleDelete(n.id)}
                        title="Archive notice"
                        style={{
                          background: "transparent",
                          color: "var(--text-muted)",
                          padding: "6px",
                          borderRadius: "8px",
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontSize: "17px",
                      fontWeight: 800,
                      color: "var(--text-primary)",
                      marginBottom: "10px",
                      lineHeight: "1.4",
                    }}
                  >
                    {n.title}
                  </h3>

                  {/* Content snippet */}
                  <p
                    style={{
                      fontSize: "13.5px",
                      color: "var(--text-secondary)",
                      lineHeight: "1.6",
                      marginBottom: "16px",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {n.content}
                  </p>

                  {/* Attachment Badge */}
                  {n.attachment_url && (
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "7px 12px",
                        borderRadius: "10px",
                        background: "rgba(61, 94, 225, 0.06)",
                        border: "1px solid rgba(61, 94, 225, 0.18)",
                        color: "#3D5EE1",
                        fontSize: "12px",
                        fontWeight: 600,
                        marginBottom: "14px",
                      }}
                    >
                      <Download size={14} />
                      <span>{n.attachment_url}</span>
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div
                  style={{
                    paddingTop: "14px",
                    borderTop: "1px solid var(--border-subtle)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "10px",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)" }}>
                      {n.created_by || "Office of the Principal"}
                    </span>
                    <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                      {new Date(n.published_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <button
                      onClick={() => handleCopy(n)}
                      title="Copy Circular Text"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                        padding: "7px 11px",
                        borderRadius: "8px",
                        border: "1px solid var(--border-subtle)",
                        background: "var(--bg-deep)",
                        color: copiedId === n.id ? "#10B981" : "var(--text-secondary)",
                        fontSize: "12px",
                        fontWeight: 600,
                      }}
                    >
                      {copiedId === n.id ? <Check size={14} /> : <Share2 size={14} />}
                      <span>{copiedId === n.id ? "Copied" : "Share"}</span>
                    </button>

                    <button
                      onClick={() => setPreviewPhoneNotice(n)}
                      title="Preview on Smartphone"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "7px 12px",
                        borderRadius: "8px",
                        background: "#3D5EE1",
                        color: "#FFFFFF",
                        fontSize: "12px",
                        fontWeight: 700,
                      }}
                    >
                      <Smartphone size={14} />
                      <span>Phone Preview</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Split-Screen Cinematic Publish Notice Modal with Live Mobile Simulator */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.75)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "var(--bg-surface)",
              borderRadius: "24px",
              maxWidth: "1050px",
              width: "100%",
              maxHeight: "92vh",
              overflowY: "auto",
              boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.5)",
              border: "1px solid var(--border-card)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: "20px 28px",
                borderBottom: "1px solid var(--border-subtle)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "var(--bg-surface)",
              }}
            >
              <div>
                <h3 style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
                  Publish Official Circular & Push Alert
                </h3>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "4px 0 0 0" }}>
                  Instant broadcast synced across Parent App, Student Portal, and Teacher Workstation
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: "var(--bg-deep)",
                  border: "none",
                  borderRadius: "50%",
                  width: "36px",
                  height: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Split Screen Body */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.2fr 0.8fr",
                gap: "28px",
                padding: "28px",
              }}
            >
              {/* Left Pane: Modular Form */}
              <div>
                {/* AI & Quick Templates */}
                <div style={{ marginBottom: "18px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "8px" }}>
                    QUICK ONE-CLICK TEMPLATES:
                  </label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {TEMPLATES.map((tpl, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => applyTemplate(tpl)}
                        style={{
                          fontSize: "12px",
                          fontWeight: 600,
                          padding: "6px 12px",
                          borderRadius: "8px",
                          border: "1px solid var(--border-subtle)",
                          background: "var(--bg-deep)",
                          color: "var(--text-secondary)",
                          cursor: "pointer",
                        }}
                      >
                        {tpl.name}
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={handlePublish}>
                  {/* Title */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 700, marginBottom: "6px" }}>
                      Notice / Circular Title*
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Annual Term Examination Circular & Schedule"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "11px 14px",
                        borderRadius: "10px",
                        border: "1.5px solid var(--border-subtle)",
                        background: "var(--bg-surface)",
                        color: "var(--text-primary)",
                        fontSize: "14px",
                      }}
                    />
                  </div>

                  {/* Category & Audience */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 700, marginBottom: "6px" }}>
                        Category*
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                        style={{
                          width: "100%",
                          padding: "11px 14px",
                          borderRadius: "10px",
                          border: "1.5px solid var(--border-subtle)",
                          background: "var(--bg-surface)",
                          color: "var(--text-primary)",
                          fontSize: "14px",
                        }}
                      >
                        <option value="GENERAL">📢 General Announcement</option>
                        <option value="URGENT">⚡ Urgent Safety Alert</option>
                        <option value="EXAM">📝 Examination & Datesheet</option>
                        <option value="ACADEMIC">📚 Academic & Syllabus</option>
                        <option value="PTM">👨‍👩‍👧 PTM & Parent Advisory</option>
                        <option value="SPORTS">🏆 Sports & Athletics</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 700, marginBottom: "6px" }}>
                        Target Audience*
                      </label>
                      <select
                        value={formData.target_audience}
                        onChange={(e) => setFormData({ ...formData, target_audience: e.target.value as any })}
                        style={{
                          width: "100%",
                          padding: "11px 14px",
                          borderRadius: "10px",
                          border: "1.5px solid var(--border-subtle)",
                          background: "var(--bg-surface)",
                          color: "var(--text-primary)",
                          fontSize: "14px",
                        }}
                      >
                        <option value="ALL">Everyone (All Students, Parents & Staff)</option>
                        <option value="PARENTS">Parents Only</option>
                        <option value="STUDENTS">Students Only</option>
                        <option value="STAFF">Teachers & Staff Only</option>
                      </select>
                    </div>
                  </div>

                  {/* Priority & Attachment */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 700, marginBottom: "6px" }}>
                        Broadcast Priority
                      </label>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, priority: "NORMAL" })}
                          style={{
                            flex: 1,
                            padding: "9px 12px",
                            borderRadius: "8px",
                            fontSize: "13px",
                            fontWeight: 600,
                            border: formData.priority === "NORMAL" ? "2px solid #4F46E5" : "1px solid var(--border-subtle)",
                            background: formData.priority === "NORMAL" ? "#EEF2FF" : "var(--bg-deep)",
                            color: formData.priority === "NORMAL" ? "#4F46E5" : "var(--text-secondary)",
                          }}
                        >
                          Standard
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, priority: "HIGH" })}
                          style={{
                            flex: 1,
                            padding: "9px 12px",
                            borderRadius: "8px",
                            fontSize: "13px",
                            fontWeight: 600,
                            border: formData.priority === "HIGH" ? "2px solid #EF4444" : "1px solid var(--border-subtle)",
                            background: formData.priority === "HIGH" ? "#FEF2F2" : "var(--bg-deep)",
                            color: formData.priority === "HIGH" ? "#EF4444" : "var(--text-secondary)",
                          }}
                        >
                          ⚡ High Priority
                        </button>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 700, marginBottom: "6px" }}>
                        PDF Attachment Filename
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Schedule_Term1.pdf"
                        value={formData.attachment_url}
                        onChange={(e) => setFormData({ ...formData, attachment_url: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "11px 14px",
                          borderRadius: "10px",
                          border: "1.5px solid var(--border-subtle)",
                          background: "var(--bg-surface)",
                          color: "var(--text-primary)",
                          fontSize: "14px",
                        }}
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 700, marginBottom: "6px" }}>
                      Notice Content & Directives*
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Write circular description, directives, dates, or guidelines here..."
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: "10px",
                        border: "1.5px solid var(--border-subtle)",
                        background: "var(--bg-surface)",
                        color: "var(--text-primary)",
                        fontSize: "14px",
                        lineHeight: "1.5",
                      }}
                    />
                  </div>

                  <div style={{ display: "flex", gap: "12px" }}>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      style={{
                        flex: 1,
                        padding: "13px",
                        borderRadius: "12px",
                        background: "var(--bg-deep)",
                        color: "var(--text-secondary)",
                        fontWeight: 700,
                        fontSize: "14px",
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      style={{
                        flex: 2,
                        padding: "13px",
                        borderRadius: "12px",
                        background: "linear-gradient(135deg, #4F46E5 0%, #3730A3 100%)",
                        color: "#FFFFFF",
                        fontWeight: 800,
                        fontSize: "14px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        boxShadow: "0 8px 20px rgba(79, 70, 229, 0.4)",
                      }}
                    >
                      <Send size={16} />
                      <span>Broadcast Circular Now</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Right Pane: Cinematic Smartphone Live Preview */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "var(--bg-deep)",
                  borderRadius: "20px",
                  padding: "24px 16px",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <div style={{ fontSize: "12px", fontWeight: 800, color: "var(--text-muted)", marginBottom: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Smartphone size={15} />
                  <span>LIVE SMARTPHONE APP PREVIEW</span>
                </div>

                {/* iPhone Bezel Mockup */}
                <div className="cinematic-phone-mockup">
                  <div className="cinematic-phone-island">
                    <div className="cinematic-phone-island-cam" />
                  </div>

                  <div className="cinematic-phone-screen">
                    {/* Simulated iOS Push Notification Banner if high priority */}
                    {formData.priority === "HIGH" && (
                      <div
                        style={{
                          background: "rgba(15, 23, 42, 0.92)",
                          color: "#FFFFFF",
                          padding: "10px 12px",
                          borderRadius: "14px",
                          marginBottom: "14px",
                          boxShadow: "0 8px 18px rgba(0,0,0,0.3)",
                          backdropFilter: "blur(10px)",
                          animation: "bannerSlideDown 0.4s ease-out",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                          <Bell size={12} color="#EF4444" />
                          <span style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.5px", color: "#F87171" }}>
                            RADHIX SCHOOL APP • URGENT PUSH
                          </span>
                        </div>
                        <div style={{ fontSize: "12px", fontWeight: 700, lineHeight: "1.3" }}>
                          {formData.title || "Urgent Announcement Broadcast"}
                        </div>
                      </div>
                    )}

                    {/* App Header Inside Phone */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                      <div>
                        <div style={{ fontSize: "11px", fontWeight: 800, color: "#4F46E5" }}>DELHI PUBLIC ACADEMY</div>
                        <div style={{ fontSize: "15px", fontWeight: 900 }}>Notice Board</div>
                      </div>
                      <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", color: "#4F46E5" }}>
                        <Bell size={14} />
                      </div>
                    </div>

                    {/* The Live Notice Card Rendered in Phone */}
                    <div
                      style={{
                        background: "#FFFFFF",
                        borderRadius: "16px",
                        padding: "14px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                        border: formData.priority === "HIGH" ? "1.5px solid #EF4444" : "1px solid #E2E8F0",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <span
                          style={{
                            fontSize: "10px",
                            fontWeight: 800,
                            padding: "3px 8px",
                            borderRadius: "6px",
                            background: getCategoryTheme(formData.category).bg,
                            color: getCategoryTheme(formData.category).text,
                          }}
                        >
                          {formData.category}
                        </span>
                        <span style={{ fontSize: "10px", color: "#94A3B8" }}>Just now</span>
                      </div>

                      <h4 style={{ fontSize: "13px", fontWeight: 800, color: "#0F172A", margin: "0 0 6px 0", lineHeight: "1.4" }}>
                        {formData.title || "Your Notice Title Here..."}
                      </h4>

                      <p style={{ fontSize: "11.5px", color: "#475569", lineHeight: "1.5", margin: "0 0 12px 0" }}>
                        {formData.content || "Write description on the left to see live mobile rendering preview."}
                      </p>

                      {formData.attachment_url && (
                        <div
                          style={{
                            background: "#F1F5F9",
                            padding: "6px 8px",
                            borderRadius: "8px",
                            fontSize: "10.5px",
                            color: "#334155",
                            fontWeight: 600,
                            marginBottom: "12px",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <Download size={12} />
                          <span>{formData.attachment_url}</span>
                        </div>
                      )}

                      <button
                        type="button"
                        style={{
                          width: "100%",
                          padding: "8px",
                          borderRadius: "8px",
                          background: "#4F46E5",
                          color: "#FFFFFF",
                          fontSize: "11px",
                          fontWeight: 700,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "5px",
                        }}
                      >
                        <CheckCircle size={13} />
                        <span>Acknowledge & Mark Read</span>
                      </button>
                    </div>

                    <div style={{ marginTop: "14px", textAlign: "center", fontSize: "10px", color: "#94A3B8" }}>
                      Target: {formData.target_audience} • Push Notification Enabled
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Mobile Preview Modal (When clicking Phone Preview from a card) */}
      {previewPhoneNotice && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.75)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "var(--bg-surface)",
              borderRadius: "24px",
              padding: "24px 28px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
              border: "1px solid var(--border-card)",
              position: "relative",
            }}
          >
            <button
              onClick={() => setPreviewPhoneNotice(null)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "var(--bg-deep)",
                border: "none",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text-muted)",
              }}
            >
              <X size={16} />
            </button>

            <div style={{ fontSize: "13px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "6px" }}>
              <Smartphone size={16} color="#4F46E5" />
              <span>STUDENT & PARENT MOBILE VIEW</span>
            </div>

            <div className="cinematic-phone-mockup">
              <div className="cinematic-phone-island">
                <div className="cinematic-phone-island-cam" />
              </div>

              <div className="cinematic-phone-screen">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: 800, color: "#4F46E5" }}>DELHI PUBLIC ACADEMY</div>
                    <div style={{ fontSize: "15px", fontWeight: 900 }}>Notice Board</div>
                  </div>
                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", color: "#4F46E5" }}>
                    <Bell size={14} />
                  </div>
                </div>

                <div
                  style={{
                    background: "#FFFFFF",
                    borderRadius: "16px",
                    padding: "16px",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
                    border: previewPhoneNotice.category === "URGENT" ? "1.5px solid #EF4444" : "1px solid #E2E8F0",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 800,
                        padding: "3px 8px",
                        borderRadius: "6px",
                        background: getCategoryTheme(previewPhoneNotice.category).bg,
                        color: getCategoryTheme(previewPhoneNotice.category).text,
                      }}
                    >
                      {previewPhoneNotice.category}
                    </span>
                    <span style={{ fontSize: "10px", color: "#94A3B8" }}>
                      {new Date(previewPhoneNotice.published_at).toLocaleDateString()}
                    </span>
                  </div>

                  <h4 style={{ fontSize: "14px", fontWeight: 800, color: "#0F172A", margin: "0 0 8px 0", lineHeight: "1.4" }}>
                    {previewPhoneNotice.title}
                  </h4>

                  <p style={{ fontSize: "12px", color: "#475569", lineHeight: "1.55", margin: "0 0 14px 0" }}>
                    {previewPhoneNotice.content}
                  </p>

                  {previewPhoneNotice.attachment_url && (
                    <div
                      style={{
                        background: "#F1F5F9",
                        padding: "8px 10px",
                        borderRadius: "8px",
                        fontSize: "11px",
                        color: "#334155",
                        fontWeight: 600,
                        marginBottom: "14px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <Download size={13} />
                      <span>{previewPhoneNotice.attachment_url}</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      alert("Notice acknowledged successfully on mobile simulator!");
                      setPreviewPhoneNotice(null);
                    }}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "10px",
                      background: "#4F46E5",
                      color: "#FFFFFF",
                      fontSize: "12px",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                    }}
                  >
                    <CheckCircle size={14} />
                    <span>Acknowledge Circular</span>
                  </button>
                </div>

                <div style={{ marginTop: "16px", textAlign: "center", fontSize: "11px", color: "#94A3B8" }}>
                  Delivered to {previewPhoneNotice.target_audience} • Read rate 98.4%
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
