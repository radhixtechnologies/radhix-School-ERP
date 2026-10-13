import { useState, useEffect } from "react";
import {
  Plus,
  Printer,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  Wallet,
  Receipt,
  IndianRupee,
  ShieldCheck,
  Check
} from "lucide-react";

interface Props {
  institute: any;
  token: string;
}

export const FeesView = ({ institute, token }: Props) => {
  // const isSchool = institute?.type === "SCHOOL";
  const [activeSubTab, setActiveSubTab] = useState<"counter" | "structures" | "reports">("counter");
  const [allocations, setAllocations] = useState<any[]>([]);
  const [structures, setStructures] = useState<any[]>([]);
  const [defaultersReport, setDefaultersReport] = useState<any>(null);

  // Collect Modal
  const [collectTarget, setCollectTarget] = useState<any>(null);
  const [collectAmount, setCollectAmount] = useState<number>(0);
  const [collectMode, setCollectMode] = useState<string>("CASH");
  const [collectRemarks, setCollectRemarks] = useState<string>("");

  // Receipt Modal (3-Copy)
  const [receiptData, setReceiptData] = useState<any>(null);

  // New Structure Form
  const [newHead, setNewHead] = useState("");
  const [newAmount, setNewAmount] = useState(5000);
  const [newFreq, setNewFreq] = useState("QUARTERLY");

  useEffect(() => {
    loadAllocations();
    loadStructures();
    loadDefaulters();
  }, []);

  const loadAllocations = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/v1/fees/allocations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const j = await res.json();
      if (j.success) setAllocations(j.data);
    } catch {}
  };

  const loadStructures = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/v1/fees/structures", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const j = await res.json();
      if (j.success) setStructures(j.data);
    } catch {}
  };

  const loadDefaulters = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/v1/fees/defaulters-summary", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const j = await res.json();
      if (j.success) setDefaultersReport(j);
    } catch {}
  };

  const handleCollect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!collectTarget) return;

    try {
      const res = await fetch("http://localhost:5000/api/v1/fees/collect-offline", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          allocation_id: collectTarget.id,
          amount_paid: collectAmount,
          payment_mode: collectMode,
          remarks: collectRemarks,
        }),
      });
      const j = await res.json();
      if (j.success) {
        setCollectTarget(null);
        loadAllocations();
        loadDefaulters();
        // Load generated receipt
        fetchReceipt(j.receiptNumber);
      } else {
        alert(j.message || "Failed to record payment");
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const fetchReceipt = async (receiptNum: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/v1/fees/receipt/${receiptNum}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const j = await res.json();
      if (j.success) {
        setReceiptData(j.data);
      }
    } catch {}
  };

  const handleCreateStructure = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/v1/fees/structures", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          fee_head: newHead,
          amount: newAmount,
          frequency: newFreq,
        }),
      });
      const j = await res.json();
      if (j.success) {
        setNewHead("");
        loadStructures();
      }
    } catch {}
  };

  // Financial KPI Calculations
  const totalBilled = allocations.reduce((sum, a) => sum + Number(a.net_amount || 0), 0);
  const totalCollected = allocations.reduce((sum, a) => sum + Number(a.paid_amount || 0), 0);
  const totalPending = Math.max(0, totalBilled - totalCollected);
  const collectionRate = totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0;
  const defaultersCount = allocations.filter((a) => Number(a.paid_amount || 0) < Number(a.net_amount || 0)).length;
  const clearedCount = allocations.filter((a) => Number(a.paid_amount || 0) >= Number(a.net_amount || 0) && Number(a.net_amount || 0) > 0).length;

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
            <Wallet size={14} color="#93C5FD" /> Fee Counter & Accounts Registry
          </div>
          <h1 style={{ fontSize: "22px", fontWeight: 900, margin: "0 0 6px 0", letterSpacing: "-0.02em" }}>
            Fee Management & Financial Accounts Overview
          </h1>
          <p style={{ margin: 0, opacity: 0.9, fontSize: "13px", maxWidth: "680px" }}>
            Institutional fee collection, accounts ledger, 3-ply formal receipts generation, and real-time dues tracking.
          </p>
        </div>

        <button
          onClick={() => setActiveSubTab("counter")}
          style={{
            background: "#FFFFFF",
            color: "#3D5EE1",
            border: "none",
            padding: "12px 22px",
            borderRadius: "12px",
            fontWeight: 900,
            fontSize: "14px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.15)"
          }}
        >
          <Receipt size={18} />
          <span>Fee Collection Counter</span>
        </button>
      </div>

      {/* DASHBOARD OVERVIEW: 4 FINANCIAL KPI CARDS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "20px" }}>
        {/* Card 1: Total Assessed Revenue */}
        <div style={{ background: "#FFFFFF", padding: "18px 20px", borderRadius: "16px", border: "1px solid #E2E8F0", boxShadow: "0 2px 6px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
            <div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748B" }}>Total Fee Assessed</div>
              <div style={{ fontSize: "26px", fontWeight: 900, color: "#0F172A", marginTop: "2px" }}>
                ₹{totalBilled.toLocaleString("en-IN")}
              </div>
            </div>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "#EEF2FF", color: "#3D5EE1", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CreditCard size={20} />
            </div>
          </div>
          <div style={{ fontSize: "12px", color: "#64748B", fontWeight: 600 }}>
            {allocations.length} Active Student Fee Assessments
          </div>
        </div>

        {/* Card 2: Total Collected */}
        <div style={{ background: "#FFFFFF", padding: "18px 20px", borderRadius: "16px", border: "1px solid #E2E8F0", boxShadow: "0 2px 6px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
            <div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748B" }}>Total Collected Revenue</div>
              <div style={{ fontSize: "26px", fontWeight: 900, color: "#16A34A", marginTop: "2px" }}>
                ₹{totalCollected.toLocaleString("en-IN")}
              </div>
            </div>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "#DCFCE7", color: "#16A34A", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CheckCircle2 size={20} />
            </div>
          </div>
          {/* Collection Bar */}
          <div style={{ width: "100%", height: "6px", background: "#F1F5F9", borderRadius: "10px", overflow: "hidden", marginBottom: "6px" }}>
            <div style={{ width: `${collectionRate}%`, height: "100%", background: "linear-gradient(90deg, #10B981, #059669)", borderRadius: "10px" }} />
          </div>
          <div style={{ fontSize: "11px", color: "#16A34A", fontWeight: 700 }}>
            ✓ {collectionRate}% Fee Recovery Rate ({clearedCount} Paid in Full)
          </div>
        </div>

        {/* Card 3: Pending Balance */}
        <div style={{ background: "#FFFFFF", padding: "18px 20px", borderRadius: "16px", border: "1px solid #E2E8F0", boxShadow: "0 2px 6px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
            <div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748B" }}>Total Outstanding Dues</div>
              <div style={{ fontSize: "26px", fontWeight: 900, color: totalPending > 0 ? "#DC2626" : "#16A34A", marginTop: "2px" }}>
                ₹{totalPending.toLocaleString("en-IN")}
              </div>
            </div>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "#FEF2F2", color: "#DC2626", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <AlertTriangle size={20} />
            </div>
          </div>
          <div style={{ fontSize: "12px", color: totalPending > 0 ? "#DC2626" : "#16A34A", fontWeight: 700 }}>
            {defaultersCount > 0 ? `⚠️ ${defaultersCount} Students with Overdue Balance` : "✓ Zero Outstanding Dues"}
          </div>
        </div>

        {/* Card 4: Fee Structures Master */}
        <div style={{ background: "#FFFFFF", padding: "18px 20px", borderRadius: "16px", border: "1px solid #E2E8F0", boxShadow: "0 2px 6px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
            <div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748B" }}>Active Fee Heads</div>
              <div style={{ fontSize: "26px", fontWeight: 900, color: "#3D5EE1", marginTop: "2px" }}>
                {structures.length} Structures
              </div>
            </div>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "#EEF2FF", color: "#3D5EE1", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Wallet size={20} />
            </div>
          </div>
          <div style={{ fontSize: "12px", color: "#64748B", fontWeight: 600 }}>
            Tuition, Transport, Exam & Lab Heads
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: "800", margin: 0 }}>Fee Operations & Counter</h2>
          <p style={{ fontSize: "12px", color: "#64748b", margin: "2px 0 0 0" }}>Fee heads, offline counter collection, 3-copy receipts & dues</p>
        </div>

        {/* Sub-tab navigation */}
        <div style={{ display: "flex", background: "#F1F5F9", padding: "4px", borderRadius: "10px", gap: "4px", border: "1px solid #E2E8F0" }}>
          {[
            { id: "counter", label: "Fee Collection Counter" },
            { id: "structures", label: "Fee Structures Master" },
            { id: "reports", label: "Outstanding Dues Register" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveSubTab(t.id as any)}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: "700",
                background: activeSubTab === t.id ? "#3D5EE1" : "transparent",
                color: activeSubTab === t.id ? "#FFFFFF" : "#64748b",
                border: "none",
                cursor: "pointer",
                boxShadow: activeSubTab === t.id ? "0 2px 8px rgba(61,94,225,0.3)" : "none",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* SUB-TAB 1: COUNTER COLLECTION */}
      {activeSubTab === "counter" && (
        <div style={{ background: "#fff", borderRadius: "14px", border: "1px solid #e2e8f0", padding: "20px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "800", marginBottom: "16px" }}>Student Fee Dues & Assessment</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1.5px solid #f1f5f9", color: "#64748b", fontSize: "12px", textTransform: "uppercase" }}>
                <th style={{ padding: "12px" }}>Student</th>
                <th style={{ padding: "12px" }}>Fee Head</th>
                <th style={{ padding: "12px" }}>Total Amount</th>
                <th style={{ padding: "12px" }}>Paid</th>
                <th style={{ padding: "12px" }}>Balance Due</th>
                <th style={{ padding: "12px" }}>Status</th>
                <th style={{ padding: "12px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allocations.map((a) => {
                const due = Math.max(0, Number(a.net_amount) - Number(a.paid_amount));
                const isPaid = a.status === "PAID";
                return (
                  <tr key={a.id} style={{ borderBottom: "1px solid #f8fafc", fontSize: "14px" }}>
                    <td style={{ padding: "14px 12px" }}>
                      <div style={{ fontWeight: "700" }}>{a.first_name} {a.last_name}</div>
                      <div style={{ fontSize: "12px", color: "#64748b" }}>Adm No: {a.admission_number}</div>
                    </td>
                    <td style={{ padding: "14px 12px" }}>
                      <strong>{a.fee_head}</strong>
                      <div style={{ fontSize: "11px", color: "#64748b" }}>{a.frequency}</div>
                    </td>
                    <td style={{ padding: "14px 12px", fontWeight: "600" }}>₹{Number(a.net_amount).toLocaleString("en-IN")}</td>
                    <td style={{ padding: "14px 12px", color: "#059669", fontWeight: "600" }}>₹{Number(a.paid_amount).toLocaleString("en-IN")}</td>
                    <td style={{ padding: "14px 12px", color: due > 0 ? "#dc2626" : "#64748b", fontWeight: "700" }}>
                      ₹{due.toLocaleString("en-IN")}
                    </td>
                    <td style={{ padding: "14px 12px" }}>
                      <span style={{
                        padding: "3px 8px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: "800",
                        background: isPaid ? "#ecfdf5" : a.status === "PARTIAL" ? "#fffbeb" : "#fef2f2",
                        color: isPaid ? "#059669" : a.status === "PARTIAL" ? "#d97706" : "#dc2626",
                      }}>
                        {a.status}
                      </span>
                    </td>
                    <td style={{ padding: "14px 12px", textAlign: "right" }}>
                      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                        {!isPaid && (
                          <button
                            onClick={() => {
                              setCollectTarget(a);
                              setCollectAmount(due);
                            }}
                            style={{ background: "#4f46e5", color: "#fff", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "700" }}
                          >
                            Collect Fee
                          </button>
                        )}
                        {Number(a.paid_amount) > 0 && (
                          <button
                            onClick={() => fetchReceipt(`REC-2026-${institute?.code || "DPS"}-1001`)}
                            style={{ background: "#f1f5f9", color: "#334155", padding: "6px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}
                          >
                            <Printer size={14} />
                            <span>Receipt</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* SUB-TAB 2: FEE STRUCTURES */}
      {activeSubTab === "structures" && (
        <div>
          <form onSubmit={handleCreateStructure} style={{ background: "#fff", padding: "20px", borderRadius: "14px", border: "1px solid #e2e8f0", marginBottom: "20px", display: "flex", gap: "12px", alignItems: "flex-end", flexWrap: "wrap" }}>
            <div style={{ flex: 2, minWidth: "220px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>Fee Head Name*</label>
              <input
                type="text"
                required
                placeholder="e.g. Tuition Fee, Exam Fee, Sports Fee"
                value={newHead}
                onChange={(e) => setNewHead(e.target.value)}
                style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #cbd5e1" }}
              />
            </div>
            <div style={{ flex: 1, minWidth: "120px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>Amount (₹)*</label>
              <input
                type="number"
                required
                value={newAmount}
                onChange={(e) => setNewAmount(Number(e.target.value))}
                style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #cbd5e1" }}
              />
            </div>
            <div style={{ flex: 1, minWidth: "140px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>Frequency</label>
              <select
                value={newFreq}
                onChange={(e) => setNewFreq(e.target.value)}
                style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #cbd5e1", background: "#fff" }}
              >
                <option value="ANNUAL">Annual</option>
                <option value="QUARTERLY">Quarterly</option>
                <option value="SEMESTER">Semester</option>
                <option value="MONTHLY">Monthly</option>
              </select>
            </div>
            <button
              type="submit"
              style={{ background: "#4f46e5", color: "#fff", padding: "10px 18px", borderRadius: "8px", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px" }}
            >
              <Plus size={16} />
              <span>Create Fee Head</span>
            </button>
          </form>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
            {structures.map((s) => (
              <div key={s.id} style={{ background: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                <span style={{ fontSize: "11px", fontWeight: "800", background: "#e0e7ff", color: "#4338ca", padding: "3px 8px", borderRadius: "10px" }}>
                  {s.frequency}
                </span>
                <h3 style={{ fontSize: "16px", fontWeight: "800", margin: "10px 0 6px" }}>{s.fee_head}</h3>
                <div style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a" }}>
                  ₹{Number(s.amount).toLocaleString("en-IN")}
                </div>
                <div style={{ fontSize: "12px", color: "#64748b", marginTop: "6px" }}>
                  Late fine: ₹{s.late_fine_per_day}/day
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: DEFAULTERS & COLLECTIONS REPORT */}
      {activeSubTab === "reports" && defaultersReport && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
            <div style={{ background: "#fff", padding: "24px", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
              <div style={{ color: "#dc2626", fontSize: "13px", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px" }}>
                <AlertCircle size={18} />
                <span>Total Outstanding Fee Dues</span>
              </div>
              <div style={{ fontSize: "32px", fontWeight: "800", color: "#0f172a", marginTop: "8px" }}>
                ₹{Number(defaultersReport.totalOutstanding || 0).toLocaleString("en-IN")}
              </div>
              <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
                {defaultersReport.defaulterCount || 0} Students with pending balances
              </div>
            </div>

            <div style={{ background: "#fff", padding: "24px", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
              <div style={{ color: "#059669", fontSize: "13px", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px" }}>
                <CheckCircle2 size={18} />
                <span>Instant Collection Capabilities</span>
              </div>
              <div style={{ fontSize: "14px", color: "#334155", marginTop: "10px", lineHeight: "1.6" }}>
                • Razorpay & Cashfree UPI Online Integration<br />
                • Fast Counter Cash & Cheque entry<br />
                • Automated 3-Copy printable receipts
              </div>
            </div>
          </div>

          <div style={{ background: "#fff", borderRadius: "14px", border: "1px solid #e2e8f0", padding: "20px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "800", marginBottom: "14px" }}>Defaulters Contact Sheet</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1.5px solid #f1f5f9", color: "#64748b", fontSize: "12px", textTransform: "uppercase" }}>
                  <th style={{ padding: "10px" }}>Student</th>
                  <th style={{ padding: "10px" }}>Parent Phone</th>
                  <th style={{ padding: "10px" }}>Pending Head</th>
                  <th style={{ padding: "10px" }}>Outstanding Due</th>
                </tr>
              </thead>
              <tbody>
                {defaultersReport.defaulters?.map((d: any) => (
                  <tr key={d.id} style={{ borderBottom: "1px solid #f8fafc", fontSize: "13px" }}>
                    <td style={{ padding: "12px 10px", fontWeight: "700" }}>{d.first_name} {d.last_name} ({d.admission_number})</td>
                    <td style={{ padding: "12px 10px", color: "#4f46e5" }}>{d.parent_phone || "N/A"}</td>
                    <td style={{ padding: "12px 10px" }}>{d.fee_head}</td>
                    <td style={{ padding: "12px 10px", fontWeight: "700", color: "#dc2626" }}>
                      ₹{(Number(d.net_amount) - Number(d.paid_amount)).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* COLLECT FEE MODAL */}
      {collectTarget && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div style={{ background: "#fff", borderRadius: "16px", maxWidth: "460px", width: "100%", padding: "28px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "800" }}>Fee Collection Counter</h3>
            <p style={{ fontSize: "13px", color: "#64748b", margin: "4px 0 16px" }}>
              Student: <strong>{collectTarget.first_name} {collectTarget.last_name}</strong> ({collectTarget.admission_number})
            </p>

            <form onSubmit={handleCollect}>
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>Amount to Collect (₹)*</label>
                <input
                  type="number"
                  required
                  value={collectAmount}
                  onChange={(e) => setCollectAmount(Number(e.target.value))}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #cbd5e1" }}
                />
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>Payment Mode</label>
                <select
                  value={collectMode}
                  onChange={(e) => setCollectMode(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #cbd5e1", background: "#fff" }}
                >
                  <option value="CASH">Cash Counter</option>
                  <option value="UPI">Counter UPI QR Code</option>
                  <option value="CHEQUE">Bank Cheque</option>
                  <option value="ONLINE_RAZORPAY">Razorpay Gateway Simulation</option>
                </select>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>Remarks</label>
                <input
                  type="text"
                  placeholder="Optional note"
                  value={collectRemarks}
                  onChange={(e) => setCollectRemarks(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #cbd5e1" }}
                />
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setCollectTarget(null)}
                  style={{ flex: 1, padding: "10px", borderRadius: "8px", background: "#f1f5f9", fontWeight: "700" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ flex: 2, padding: "10px", borderRadius: "8px", background: "#10b981", color: "#fff", fontWeight: "700" }}
                >
                  Confirm & Issue Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3-COPY PRINTABLE RECEIPT MODAL */}
      {receiptData && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1200, padding: "20px" }}>
          <div style={{ background: "#fff", borderRadius: "16px", width: "100%", maxWidth: "860px", maxHeight: "92vh", overflowY: "auto", padding: "32px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.3)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <h2 style={{ fontSize: "20px", fontWeight: "800" }}>Official Fee Receipt (3-Copy Printable)</h2>
                <p style={{ fontSize: "13px", color: "#64748b" }}>Receipt No: {receiptData.receiptNumber}</p>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => window.print()}
                  style={{ background: "#4f46e5", color: "#fff", padding: "8px 16px", borderRadius: "8px", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <Printer size={16} />
                  <span>Print 3-Copies</span>
                </button>
                <button onClick={() => setReceiptData(null)} style={{ background: "#f1f5f9", padding: "8px 14px", borderRadius: "8px", fontWeight: "700" }}>
                  Close
                </button>
              </div>
            </div>

            {/* 3 Columns / 3 Copies Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px" }}>
              {receiptData.copies.map((copyName: string, idx: number) => (
                <div key={idx} style={{ border: "1.5px dashed #cbd5e1", borderRadius: "10px", padding: "16px", fontSize: "12px", background: "#fcfdfe" }}>
                  <div style={{ textAlign: "center", borderBottom: "1px solid #e2e8f0", paddingBottom: "10px", marginBottom: "10px" }}>
                    <div style={{ fontSize: "10px", fontWeight: "800", color: "#4f46e5", textTransform: "uppercase" }}>{copyName}</div>
                    <div style={{ fontWeight: "800", fontSize: "14px", marginTop: "4px" }}>{receiptData.institute.name}</div>
                    <div style={{ fontSize: "10px", color: "#64748b" }}>{receiptData.institute.city}, {receiptData.institute.state}</div>
                  </div>

                  <div style={{ marginBottom: "10px" }}>
                    <div><strong>Receipt No:</strong> {receiptData.receiptNumber}</div>
                    <div><strong>Date:</strong> {new Date(receiptData.paymentDate).toLocaleDateString()}</div>
                    <div><strong>Student:</strong> {receiptData.student.name}</div>
                    <div><strong>Adm No:</strong> {receiptData.student.admissionNumber}</div>
                  </div>

                  <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "12px", fontSize: "11px" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid #cbd5e1" }}>
                        <th style={{ textAlign: "left", padding: "4px 0" }}>Head</th>
                        <th style={{ textAlign: "right", padding: "4px 0" }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ padding: "4px 0" }}>{receiptData.feeDetails.feeHead}</td>
                        <td style={{ textAlign: "right", padding: "4px 0", fontWeight: "700" }}>₹{Number(receiptData.amountPaid).toLocaleString("en-IN")}</td>
                      </tr>
                    </tbody>
                  </table>

                  <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "8px", display: "flex", justifyContent: "space-between", fontWeight: "800", fontSize: "12px" }}>
                    <span>Paid Total:</span>
                    <span style={{ color: "#059669" }}>₹{Number(receiptData.amountPaid).toLocaleString("en-IN")}</span>
                  </div>
                  <div style={{ fontSize: "10px", color: "#64748b", marginTop: "4px" }}>
                    Mode: {receiptData.paymentMode} • Balance: ₹{Number(receiptData.feeDetails.remainingBalance).toLocaleString("en-IN")}
                  </div>

                  <div style={{ marginTop: "20px", textAlign: "center", borderTop: "1px dashed #cbd5e1", paddingTop: "14px" }}>
                    <div style={{ fontSize: "9px", color: "#94a3b8" }}>Authorized Signatory</div>
                    <div style={{ fontSize: "10px", fontWeight: "700", color: "#334155" }}>Radhix ERP Verified ✓</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

