import { useState, useEffect } from "react";
import { Plus, Bell } from "lucide-react";

interface Props {
  token: string | null;
}

export const NoticesView = ({ token }: Props) => {
  const [notices, setNotices] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    target_audience: "ALL",
    category: "GENERAL",
  });

  useEffect(() => {
    loadNotices();
  }, []);

  const loadNotices = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/v1/notices", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const j = await res.json();
      if (j.success) setNotices(j.data);
    } catch {}
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
        setFormData({ title: "", content: "", target_audience: "ALL", category: "GENERAL" });
        loadNotices();
      }
    } catch {}
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: "800" }}>Notice Board & Announcements</h2>
          <p style={{ fontSize: "13px", color: "#64748b" }}>Broadcast notifications to students, parents, and teachers</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{ display: "flex", alignItems: "center", gap: "8px", background: "#4f46e5", color: "#fff", padding: "10px 16px", borderRadius: "8px", fontWeight: "700" }}
        >
          <Plus size={18} />
          <span>Publish Notice</span>
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "18px" }}>
        {notices.map((n) => (
          <div key={n.id} style={{ background: "#fff", borderRadius: "14px", border: "1px solid #e2e8f0", padding: "22px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontSize: "11px", fontWeight: "800", background: "#e0e7ff", color: "#4338ca", padding: "3px 8px", borderRadius: "12px" }}>
                  {n.category}
                </span>
                <span style={{ fontSize: "12px", color: "#94a3b8" }}>{new Date(n.published_at).toLocaleDateString()}</span>
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a", marginBottom: "8px" }}>{n.title}</h3>
              <p style={{ fontSize: "13px", color: "#475569", lineHeight: "1.5" }}>{n.content}</p>
            </div>
            <div style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#64748b" }}>
              <span>Audience: <strong>{n.target_audience}</strong></span>
              <Bell size={16} color="#94a3b8" />
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div style={{ background: "#fff", borderRadius: "16px", maxWidth: "520px", width: "100%", padding: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "800" }}>Publish New Notice</h3>
              <button onClick={() => setShowModal(false)} style={{ background: "transparent", fontSize: "22px", color: "#94a3b8" }}>×</button>
            </div>

            <form onSubmit={handlePublish}>
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>Circular / Notice Title*</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Annual Term Examination Circular & Schedule"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #cbd5e1" }}
                />
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>Target Audience</label>
                <select
                  value={formData.target_audience}
                  onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #cbd5e1", background: "#fff" }}
                >
                  <option value="ALL">All (Students, Parents, Staff)</option>
                  <option value="STUDENTS">Students Only</option>
                  <option value="PARENTS">Parents Only</option>
                  <option value="STAFF">Staff & Teachers Only</option>
                </select>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>Notice Details*</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Write notice content here..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #cbd5e1" }}
                />
              </div>

              <button
                type="submit"
                style={{ width: "100%", padding: "12px", borderRadius: "8px", background: "#4f46e5", color: "#fff", fontWeight: "700" }}
              >
                Broadcast Notice
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
