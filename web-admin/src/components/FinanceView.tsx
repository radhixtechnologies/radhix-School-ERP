import React, { useState, useEffect } from "react";
import { SchoolPrintHeader } from "./SchoolPrintHeader";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Building,
  TrendingUp,
  DollarSign,
  Bus,
  Users,
  CheckCircle2,
  Clock,
  Printer,
  Plus,
  Search,
  Filter,
  Check,
  Calendar,
  AlertCircle,
  FileText,
  ChevronRight,
  Download,
  ShieldCheck
} from "lucide-react";

interface Props {
  token: string;
  institute: any;
}

export const FinanceView: React.FC<Props> = ({ token, institute }) => {
  const [activeSubTab, setActiveSubTab] = useState<"overview" | "salaries" | "transport">("overview");

  // Overview Data
  const [overview, setOverview] = useState<any>({
    totalInflow: 288000,
    totalOutflow: 197600,
    netCashflow: 90400,
    feesToday: 0,
    totalSalariesPaid: 99300,
    totalSalariesPending: 40200,
    totalTransportPaid: 98300,
    totalTransportPending: 28000,
    pendingPayables: 68200,
    recentTransactions: [],
  });

  // Salaries & Transport Lists
  const [salaries, setSalaries] = useState<any[]>([]);
  const [transportExpenses, setTransportExpenses] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);

  // Modals
  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [showTransportModal, setShowTransportModal] = useState(false);
  const [selectedSlip, setSelectedSlip] = useState<any>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("October 2026");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Salary Form Data
  const [salaryForm, setSalaryForm] = useState({
    salary_id: "",
    staff_name: "",
    designation: "",
    net_salary: 0,
    payment_mode: "BANK_TRANSFER",
    transaction_ref: "",
    remarks: "Monthly salary disbursed via School Net Banking.",
  });

  // Transport Form Data
  const [transportForm, setTransportForm] = useState({
    vehicle_number: "Bus #12 (DL 01 AB 4321)",
    expense_type: "MONTHLY_CONTRACT",
    month_year: "October 2026",
    vendor_or_payee: "Rathore Travels Agency (Contractor)",
    amount: "35000",
    payment_mode: "BANK_TRANSFER",
    payment_status: "PAID",
    transaction_ref: "",
    notes: "Monthly contract hiring payment for school transport bus.",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAllFinanceData();
  }, [token]);

  const loadAllFinanceData = async () => {
    setLoading(true);
    try {
      // 1. Overview
      const ovRes = await fetch("http://localhost:5000/api/v1/school-features/finance/overview", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const ovJson = await ovRes.json();
      if (ovJson.success) setOverview(ovJson.data);

      // 2. Salaries
      const salRes = await fetch("http://localhost:5000/api/v1/school-features/finance/salaries", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const salJson = await salRes.json();
      if (salJson.success) setSalaries(salJson.data);

      // 3. Transport
      const trpRes = await fetch("http://localhost:5000/api/v1/school-features/finance/transport-expenses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const trpJson = await trpRes.json();
      if (trpJson.success) setTransportExpenses(trpJson.data);

      // 4. Vehicles
      const vRes = await fetch("http://localhost:5000/api/v1/school-features/transport/vehicles", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const vJson = await vRes.json();
      if (vJson.success) setVehicles(vJson.data);

      // 5. Staff
      const stRes = await fetch("http://localhost:5000/api/v1/staff", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const stJson = await stRes.json();
      if (stJson.success) setStaffList(stJson.data);
    } catch (err) {
      console.error("Finance load error", err);
    } finally {
      setLoading(false);
    }
  };

  // Disburse individual salary
  const handleDisburseSalary = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/v1/school-features/finance/salaries/disburse", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(salaryForm),
      });
      const json = await res.json();
      if (json.success) {
        alert(json.message);
        setShowSalaryModal(false);
        loadAllFinanceData();
      } else {
        alert(json.message || "Failed to disburse salary");
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  // Bulk pay salaries
  const handleBulkPaySalaries = async () => {
    if (!confirm(`Are you sure you want to disburse all pending staff salaries for ${selectedMonth}?`)) return;
    try {
      const res = await fetch("http://localhost:5000/api/v1/school-features/finance/salaries/bulk-disburse", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ month_year: selectedMonth, payment_mode: "BANK_TRANSFER" }),
      });
      const json = await res.json();
      if (json.success) {
        alert(json.message);
        loadAllFinanceData();
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  // Create transport payout
  const handleCreateTransportPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/v1/school-features/finance/transport-expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(transportForm),
      });
      const json = await res.json();
      if (json.success) {
        alert(json.message);
        setShowTransportModal(false);
        loadAllFinanceData();
      } else {
        alert(json.message || "Failed to record transport payout");
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  // Pay pending transport bill
  const handlePayPendingTransport = async (id: string, amount: number) => {
    const txn = prompt(`Enter Payment Reference / UTR for ₹${amount}:`, `NEFT-${Date.now().toString().slice(-6)}`);
    if (!txn) return;

    try {
      const res = await fetch(`http://localhost:5000/api/v1/school-features/finance/transport-expenses/${id}/pay`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ payment_mode: "BANK_TRANSFER", transaction_ref: txn }),
      });
      const json = await res.json();
      if (json.success) {
        alert(json.message);
        loadAllFinanceData();
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const filteredSalaries = salaries.filter((s) => {
    const matchSearch = (s.staff_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.designation || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "ALL" || s.payment_status === statusFilter;
    return matchSearch && matchStatus;
  });

  const filteredTransport = transportExpenses.filter((t) => {
    const matchSearch = (t.vehicle_number || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.vendor_or_payee || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "ALL" || t.payment_status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div style={{ padding: "32px", background: "#F8FAFC", minHeight: "100vh" }}>
      {/* Header Banner */}
      <div style={{
        background: "linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4338CA 100%)",
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
              background: "rgba(255,255,255,0.2)",
              padding: "4px 10px",
              borderRadius: "20px",
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "0.5px"
            }}>
              TREASURY & CASHFLOW ENGINE
            </span>
            <span style={{ fontSize: "12px", opacity: 0.8 }}>Session 2026-27</span>
          </div>
          <h1 style={{ fontSize: "26px", fontWeight: 900, margin: "0 0 8px 0" }}>
            School Finance & Disbursement Hub
          </h1>
          <p style={{ margin: 0, fontSize: "14px", opacity: 0.9, maxWidth: "650px", lineHeight: 1.5 }}>
            Complete administrative overview of school revenue (fees collected), operational expenditures, 
            monthly faculty/staff salary disbursements, and contracted vehicle fleet payouts.
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button
            onClick={() => {
              if (salaries.length > 0) {
                const pendingOne = salaries.find(s => s.payment_status === "PENDING") || salaries[0];
                setSalaryForm({
                  salary_id: pendingOne.id,
                  staff_name: pendingOne.staff_name,
                  designation: pendingOne.designation,
                  net_salary: pendingOne.net_salary,
                  payment_mode: "BANK_TRANSFER",
                  transaction_ref: `NEFT-${Date.now().toString().slice(-6)}`,
                  remarks: "Monthly salary credited via School corporate bank account.",
                });
              }
              setShowSalaryModal(true);
            }}
            style={{
              background: "#10B981",
              color: "#FFFFFF",
              border: "none",
              padding: "12px 20px",
              borderRadius: "12px",
              fontWeight: 800,
              fontSize: "13px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 4px 14px rgba(16, 185, 129, 0.4)"
            }}
          >
            <Users size={16} />
            <span>Disburse Staff Salary</span>
          </button>

          <button
            onClick={() => setShowTransportModal(true)}
            style={{
              background: "#F59E0B",
              color: "#FFFFFF",
              border: "none",
              padding: "12px 20px",
              borderRadius: "12px",
              fontWeight: 800,
              fontSize: "13px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 4px 14px rgba(245, 158, 11, 0.4)"
            }}
          >
            <Bus size={16} />
            <span>Pay Transport / Vehicle</span>
          </button>
        </div>
      </div>

      {/* KPI Cards: Inflow, Outflow, Net, Pending */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "20px",
        marginBottom: "28px"
      }}>
        {/* 1. Total Inflow (Fees) */}
        <div style={{
          background: "#FFFFFF",
          borderRadius: "16px",
          padding: "22px",
          border: "1px solid #E2E8F0",
          boxShadow: "0 4px 12px rgba(0,0,0,0.03)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <span style={{ fontSize: "12px", fontWeight: 800, color: "#64748B", textTransform: "uppercase" }}>
              Total Money In (Inflow)
            </span>
            <div style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              background: "#ECFDF5",
              color: "#10B981",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <ArrowDownRight size={20} />
            </div>
          </div>
          <div style={{ fontSize: "28px", fontWeight: 900, color: "#0F172A", marginBottom: "6px" }}>
            ₹{overview.totalInflow.toLocaleString("en-IN")}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#10B981", fontWeight: 700 }}>
            <span>● Student Fees Collected</span>
          </div>
        </div>

        {/* 2. Total Outflow (Expenses) */}
        <div style={{
          background: "#FFFFFF",
          borderRadius: "16px",
          padding: "22px",
          border: "1px solid #E2E8F0",
          boxShadow: "0 4px 12px rgba(0,0,0,0.03)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <span style={{ fontSize: "12px", fontWeight: 800, color: "#64748B", textTransform: "uppercase" }}>
              Total Disbursed (Outflow)
            </span>
            <div style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              background: "#FEE2E2",
              color: "#EF4444",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <ArrowUpRight size={20} />
            </div>
          </div>
          <div style={{ fontSize: "28px", fontWeight: 900, color: "#EF4444", marginBottom: "6px" }}>
            ₹{overview.totalOutflow.toLocaleString("en-IN")}
          </div>
          <div style={{ fontSize: "12px", color: "#64748B", fontWeight: 700 }}>
            Salaries: ₹{overview.totalSalariesPaid.toLocaleString("en-IN")} • Transport: ₹{overview.totalTransportPaid.toLocaleString("en-IN")}
          </div>
        </div>

        {/* 3. Net Cashflow Balance */}
        <div style={{
          background: "#FFFFFF",
          borderRadius: "16px",
          padding: "22px",
          border: `1px solid ${overview.netCashflow >= 0 ? "#A7F3D0" : "#FECACA"}`,
          boxShadow: "0 4px 12px rgba(0,0,0,0.03)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <span style={{ fontSize: "12px", fontWeight: 800, color: "#64748B", textTransform: "uppercase" }}>
              School Net Treasury Balance
            </span>
            <div style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              background: overview.netCashflow >= 0 ? "#DCFCE7" : "#FEE2E2",
              color: overview.netCashflow >= 0 ? "#15803D" : "#DC2626",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <Wallet size={20} />
            </div>
          </div>
          <div style={{
            fontSize: "28px",
            fontWeight: 900,
            color: overview.netCashflow >= 0 ? "#15803D" : "#DC2626",
            marginBottom: "6px"
          }}>
            {overview.netCashflow >= 0 ? "+" : ""}₹{overview.netCashflow.toLocaleString("en-IN")}
          </div>
          <div style={{ fontSize: "12px", color: "#64748B", fontWeight: 700 }}>
            {overview.netCashflow >= 0 ? "Surplus in School Reserve Account" : "Deficit (Fees collection required)"}
          </div>
        </div>

        {/* 4. Pending Payables */}
        <div style={{
          background: "#FFFFFF",
          borderRadius: "16px",
          padding: "22px",
          border: "1px solid #E2E8F0",
          boxShadow: "0 4px 12px rgba(0,0,0,0.03)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <span style={{ fontSize: "12px", fontWeight: 800, color: "#64748B", textTransform: "uppercase" }}>
              Pending Monthly Bills
            </span>
            <div style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              background: "#FEF3C7",
              color: "#D97706",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <Clock size={20} />
            </div>
          </div>
          <div style={{ fontSize: "28px", fontWeight: 900, color: "#D97706", marginBottom: "6px" }}>
            ₹{overview.pendingPayables.toLocaleString("en-IN")}
          </div>
          <div style={{ fontSize: "12px", color: "#64748B", fontWeight: 700 }}>
            Salaries: ₹{overview.totalSalariesPending.toLocaleString("en-IN")} • Transport: ₹{overview.totalTransportPending.toLocaleString("en-IN")}
          </div>
        </div>
      </div>

      {/* Subtab Navigation Pills */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "2px solid #E2E8F0",
        marginBottom: "24px",
        paddingBottom: "12px",
        flexWrap: "wrap",
        gap: "14px"
      }}>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => setActiveSubTab("overview")}
            style={{
              padding: "10px 20px",
              borderRadius: "10px",
              fontWeight: 800,
              fontSize: "13px",
              cursor: "pointer",
              border: "none",
              background: activeSubTab === "overview" ? "#312E81" : "#FFFFFF",
              color: activeSubTab === "overview" ? "#FFFFFF" : "#64748B",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: activeSubTab === "overview" ? "0 4px 12px rgba(49, 46, 129, 0.25)" : "none"
            }}
          >
            <TrendingUp size={16} />
            <span>Cash Flow & Timeline Ledger</span>
          </button>

          <button
            onClick={() => setActiveSubTab("salaries")}
            style={{
              padding: "10px 20px",
              borderRadius: "10px",
              fontWeight: 800,
              fontSize: "13px",
              cursor: "pointer",
              border: "none",
              background: activeSubTab === "salaries" ? "#312E81" : "#FFFFFF",
              color: activeSubTab === "salaries" ? "#FFFFFF" : "#64748B",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: activeSubTab === "salaries" ? "0 4px 12px rgba(49, 46, 129, 0.25)" : "none"
            }}
          >
            <Users size={16} />
            <span>Staff Salary & Payroll ({salaries.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab("transport")}
            style={{
              padding: "10px 20px",
              borderRadius: "10px",
              fontWeight: 800,
              fontSize: "13px",
              cursor: "pointer",
              border: "none",
              background: activeSubTab === "transport" ? "#312E81" : "#FFFFFF",
              color: activeSubTab === "transport" ? "#FFFFFF" : "#64748B",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: activeSubTab === "transport" ? "0 4px 12px rgba(49, 46, 129, 0.25)" : "none"
            }}
          >
            <Bus size={16} />
            <span>Vehicle Monthly Contracts ({transportExpenses.length})</span>
          </button>
        </div>

        {/* Global Controls & Search */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "#FFFFFF",
            border: "1px solid #CBD5E1",
            borderRadius: "10px",
            padding: "8px 14px",
            width: "240px"
          }}>
            <Search size={15} color="#94A3B8" />
            <input
              type="text"
              placeholder="Search payee, vehicle, staff..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: "none",
                outline: "none",
                fontSize: "13px",
                width: "100%",
                background: "transparent"
              }}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "10px",
              border: "1px solid #CBD5E1",
              background: "#FFFFFF",
              fontSize: "13px",
              fontWeight: 700,
              color: "#334155"
            }}
          >
            <option value="ALL">All Status</option>
            <option value="PAID">Paid Only</option>
            <option value="PENDING">Pending Only</option>
          </select>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUBTAB 1: CASH FLOW & TRANSACTION TIMELINE LEDGER */}
      {/* ========================================================================= */}
      {activeSubTab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Quick Info Box */}
          <div style={{
            background: "#EFF6FF",
            borderRadius: "14px",
            padding: "16px 24px",
            border: "1px solid #BFDBFE",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <AlertCircle size={20} color="#2563EB" />
              <div style={{ fontSize: "13px", color: "#1E40AF", lineHeight: 1.4 }}>
                <strong>Cash Flow Summary for October 2026:</strong> School has received <strong>₹{overview.totalInflow.toLocaleString("en-IN")}</strong> in fee collections, and paid out <strong>₹{overview.totalOutflow.toLocaleString("en-IN")}</strong> towards teaching faculty payroll and contracted bus fleet operations.
              </div>
            </div>
            <button
              onClick={handleBulkPaySalaries}
              style={{
                background: "#2563EB",
                color: "#FFFFFF",
                border: "none",
                padding: "8px 16px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 800,
                cursor: "pointer",
                whiteSpace: "nowrap"
              }}
            >
              Bulk Pay Pending ({overview.salariesCount} Staff)
            </button>
          </div>

          {/* Unified Ledger Table */}
          <div style={{
            background: "#FFFFFF",
            borderRadius: "16px",
            border: "1px solid #E2E8F0",
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0,0,0,0.02)"
          }}>
            <div style={{
              padding: "18px 24px",
              borderBottom: "1px solid #E2E8F0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: "#0F172A" }}>
                  Recent Financial Flow Timeline
                </h3>
                <span style={{ fontSize: "12px", color: "#64748B" }}>
                  Chronological entries of fee collections and expenditure disbursals
                </span>
              </div>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
              <thead>
                <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", color: "#64748B", fontWeight: 700 }}>
                  <th style={{ padding: "14px 20px" }}>Flow Type</th>
                  <th style={{ padding: "14px 20px" }}>Category & Description</th>
                  <th style={{ padding: "14px 20px" }}>Reference / Voucher</th>
                  <th style={{ padding: "14px 20px" }}>Payment Mode</th>
                  <th style={{ padding: "14px 20px" }}>Date</th>
                  <th style={{ padding: "14px 20px", textAlign: "right" }}>Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {overview.recentTransactions && overview.recentTransactions.length > 0 ? (
                  overview.recentTransactions.map((tx: any) => (
                    <tr key={tx.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                      <td style={{ padding: "14px 20px" }}>
                        <span style={{
                          padding: "4px 10px",
                          borderRadius: "20px",
                          fontSize: "11px",
                          fontWeight: 800,
                          background: tx.type === "INCOME" ? "#DCFCE7" : "#FEE2E2",
                          color: tx.type === "INCOME" ? "#16A34A" : "#DC2626",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px"
                        }}>
                          {tx.type === "INCOME" ? <ArrowDownRight size={13} /> : <ArrowUpRight size={13} />}
                          <span>{tx.type === "INCOME" ? "INFLOW" : "OUTFLOW"}</span>
                        </span>
                      </td>

                      <td style={{ padding: "14px 20px" }}>
                        <div style={{ fontWeight: 800, color: "#0F172A" }}>{tx.title}</div>
                        <div style={{ fontSize: "12px", color: "#64748B" }}>{tx.category}</div>
                      </td>

                      <td style={{ padding: "14px 20px", fontFamily: "monospace", fontWeight: 700, color: "#475569" }}>
                        {tx.reference}
                      </td>

                      <td style={{ padding: "14px 20px" }}>
                        <span style={{
                          background: "#F1F5F9",
                          padding: "3px 8px",
                          borderRadius: "6px",
                          fontSize: "11px",
                          fontWeight: 700,
                          color: "#334155"
                        }}>
                          {tx.payment_mode}
                        </span>
                      </td>

                      <td style={{ padding: "14px 20px", color: "#64748B" }}>
                        {new Date(tx.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>

                      <td style={{
                        padding: "14px 20px",
                        textAlign: "right",
                        fontWeight: 900,
                        fontSize: "14px",
                        color: tx.type === "INCOME" ? "#16A34A" : "#DC2626"
                      }}>
                        {tx.type === "INCOME" ? "+" : "-"}₹{tx.amount.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} style={{ padding: "30px", textAlign: "center", color: "#94A3B8" }}>
                      No recent transactions recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 2: STAFF SALARY & PAYROLL DISBURSAL */}
      {/* ========================================================================= */}
      {activeSubTab === "salaries" && (
        <div style={{
          background: "#FFFFFF",
          borderRadius: "16px",
          border: "1px solid #E2E8F0",
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0,0,0,0.02)"
        }}>
          <div style={{
            padding: "18px 24px",
            borderBottom: "1px solid #E2E8F0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px"
          }}>
            <div>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: "#0F172A" }}>
                Staff Monthly Payroll Register — {selectedMonth}
              </h3>
              <span style={{ fontSize: "12px", color: "#64748B" }}>
                Faculty teachers, counsellors, and school support staff salary accounts
              </span>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={handleBulkPaySalaries}
                style={{
                  background: "#4338CA",
                  color: "#FFFFFF",
                  border: "none",
                  padding: "9px 16px",
                  borderRadius: "10px",
                  fontSize: "12px",
                  fontWeight: 800,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <CheckCircle2 size={15} />
                <span>Bulk Disburse All Pending</span>
              </button>
            </div>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
            <thead>
              <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", color: "#64748B", fontWeight: 700 }}>
                <th style={{ padding: "14px 20px" }}>Staff Member</th>
                <th style={{ padding: "14px 20px" }}>Designation & Dept</th>
                <th style={{ padding: "14px 20px" }}>Basic + Allow.</th>
                <th style={{ padding: "14px 20px" }}>Deductions</th>
                <th style={{ padding: "14px 20px" }}>Net Payable</th>
                <th style={{ padding: "14px 20px" }}>Status</th>
                <th style={{ padding: "14px 20px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSalaries.length > 0 ? (
                filteredSalaries.map((sal) => {
                  const isPaid = sal.payment_status === "PAID";
                  return (
                    <tr key={sal.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                      <td style={{ padding: "14px 20px" }}>
                        <div style={{ fontWeight: 800, color: "#0F172A" }}>{sal.staff_name}</div>
                        <div style={{ fontSize: "11px", color: "#64748B" }}>{sal.month_year}</div>
                      </td>

                      <td style={{ padding: "14px 20px" }}>
                        <div style={{ fontWeight: 700, color: "#334155" }}>{sal.designation}</div>
                        <div style={{ fontSize: "11px", color: "#64748B" }}>{sal.department || "Academics"}</div>
                      </td>

                      <td style={{ padding: "14px 20px", color: "#0F172A" }}>
                        ₹{Number(sal.basic_salary).toLocaleString("en-IN")} + ₹{Number(sal.allowance).toLocaleString("en-IN")}
                      </td>

                      <td style={{ padding: "14px 20px", color: "#EF4444", fontWeight: 700 }}>
                        -₹{Number(sal.deduction).toLocaleString("en-IN")}
                      </td>

                      <td style={{ padding: "14px 20px", fontWeight: 900, fontSize: "14px", color: "#0F172A" }}>
                        ₹{Number(sal.net_salary).toLocaleString("en-IN")}
                      </td>

                      <td style={{ padding: "14px 20px" }}>
                        <span style={{
                          padding: "4px 10px",
                          borderRadius: "20px",
                          fontSize: "11px",
                          fontWeight: 800,
                          background: isPaid ? "#DCFCE7" : "#FEF3C7",
                          color: isPaid ? "#16A34A" : "#D97706",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px"
                        }}>
                          {isPaid ? <CheckCircle2 size={13} /> : <Clock size={13} />}
                          <span>{isPaid ? "PAID" : "PENDING"}</span>
                        </span>
                        {isPaid && sal.voucher_number && (
                          <div style={{ fontSize: "10px", fontFamily: "monospace", color: "#64748B", marginTop: "2px" }}>
                            {sal.voucher_number}
                          </div>
                        )}
                      </td>

                      <td style={{ padding: "14px 20px", textAlign: "right" }}>
                        {isPaid ? (
                          <button
                            onClick={() => setSelectedSlip(sal)}
                            style={{
                              background: "#F1F5F9",
                              color: "#334155",
                              border: "none",
                              padding: "6px 12px",
                              borderRadius: "8px",
                              fontSize: "12px",
                              fontWeight: 700,
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px"
                            }}
                          >
                            <Printer size={13} />
                            <span>View Pay Slip</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setSalaryForm({
                                salary_id: sal.id,
                                staff_name: sal.staff_name,
                                designation: sal.designation,
                                net_salary: sal.net_salary,
                                payment_mode: "BANK_TRANSFER",
                                transaction_ref: `NEFT-${Date.now().toString().slice(-6)}`,
                                remarks: `Monthly salary payment for ${sal.month_year}`,
                              });
                              setShowSalaryModal(true);
                            }}
                            style={{
                              background: "#10B981",
                              color: "#FFFFFF",
                              border: "none",
                              padding: "6px 14px",
                              borderRadius: "8px",
                              fontSize: "12px",
                              fontWeight: 800,
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px"
                            }}
                          >
                            <CreditCard size={13} />
                            <span>Disburse Pay</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} style={{ padding: "30px", textAlign: "center", color: "#94A3B8" }}>
                    No salary records match the filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 3: MONTHLY FLEET & VEHICLE TRANSPORT CONTRACTS */}
      {/* ========================================================================= */}
      {activeSubTab === "transport" && (
        <div style={{
          background: "#FFFFFF",
          borderRadius: "16px",
          border: "1px solid #E2E8F0",
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0,0,0,0.02)"
        }}>
          <div style={{
            padding: "18px 24px",
            borderBottom: "1px solid #E2E8F0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px"
          }}>
            <div>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: "#0F172A" }}>
                Monthly School Vehicle & Transportation Expenses
              </h3>
              <span style={{ fontSize: "12px", color: "#64748B" }}>
                Monthly contracts for buses running on hire, vendor agencies, fuel refills, and maintenance
              </span>
            </div>

            <button
              onClick={() => setShowTransportModal(true)}
              style={{
                background: "#F59E0B",
                color: "#FFFFFF",
                border: "none",
                padding: "9px 16px",
                borderRadius: "10px",
                fontSize: "12px",
                fontWeight: 800,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              <Plus size={15} />
              <span>Record Transport Payment</span>
            </button>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
            <thead>
              <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", color: "#64748B", fontWeight: 700 }}>
                <th style={{ padding: "14px 20px" }}>Vehicle & Reg No</th>
                <th style={{ padding: "14px 20px" }}>Expense Type</th>
                <th style={{ padding: "14px 20px" }}>Vendor / Contractor Payee</th>
                <th style={{ padding: "14px 20px" }}>Payment Details</th>
                <th style={{ padding: "14px 20px" }}>Amount (₹)</th>
                <th style={{ padding: "14px 20px" }}>Status</th>
                <th style={{ padding: "14px 20px", textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransport.length > 0 ? (
                filteredTransport.map((trp) => {
                  const isPaid = trp.payment_status === "PAID";
                  return (
                    <tr key={trp.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                      <td style={{ padding: "14px 20px" }}>
                        <div style={{ fontWeight: 800, color: "#0F172A", display: "flex", alignItems: "center", gap: "6px" }}>
                          <Bus size={15} color="#3B82F6" />
                          <span>{trp.vehicle_number}</span>
                        </div>
                        <div style={{ fontSize: "11px", color: "#64748B" }}>{trp.month_year}</div>
                      </td>

                      <td style={{ padding: "14px 20px" }}>
                        <span style={{
                          background: trp.expense_type === "MONTHLY_CONTRACT" ? "#EDE9FE" : trp.expense_type === "FUEL" ? "#FEF3C7" : "#F1F5F9",
                          color: trp.expense_type === "MONTHLY_CONTRACT" ? "#6D28D9" : trp.expense_type === "FUEL" ? "#B45309" : "#475569",
                          padding: "3px 8px",
                          borderRadius: "6px",
                          fontSize: "11px",
                          fontWeight: 800
                        }}>
                          {trp.expense_type === "MONTHLY_CONTRACT" ? "MONTHLY CONTRACT" : trp.expense_type}
                        </span>
                      </td>

                      <td style={{ padding: "14px 20px" }}>
                        <div style={{ fontWeight: 700, color: "#1E293B" }}>{trp.vendor_or_payee}</div>
                        {trp.notes && <div style={{ fontSize: "11px", color: "#64748B" }}>{trp.notes}</div>}
                      </td>

                      <td style={{ padding: "14px 20px" }}>
                        <div style={{ fontWeight: 700, color: "#334155" }}>{trp.payment_mode}</div>
                        <div style={{ fontSize: "11px", fontFamily: "monospace", color: "#64748B" }}>
                          {trp.receipt_number || trp.transaction_ref}
                        </div>
                      </td>

                      <td style={{ padding: "14px 20px", fontWeight: 900, fontSize: "14px", color: "#0F172A" }}>
                        ₹{Number(trp.amount).toLocaleString("en-IN")}
                      </td>

                      <td style={{ padding: "14px 20px" }}>
                        <span style={{
                          padding: "4px 10px",
                          borderRadius: "20px",
                          fontSize: "11px",
                          fontWeight: 800,
                          background: isPaid ? "#DCFCE7" : "#FEF3C7",
                          color: isPaid ? "#16A34A" : "#D97706",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px"
                        }}>
                          {isPaid ? <CheckCircle2 size={13} /> : <Clock size={13} />}
                          <span>{isPaid ? "PAID" : "PENDING"}</span>
                        </span>
                      </td>

                      <td style={{ padding: "14px 20px", textAlign: "right" }}>
                        {!isPaid ? (
                          <button
                            onClick={() => handlePayPendingTransport(trp.id, trp.amount)}
                            style={{
                              background: "#10B981",
                              color: "#FFFFFF",
                              border: "none",
                              padding: "6px 12px",
                              borderRadius: "8px",
                              fontSize: "12px",
                              fontWeight: 800,
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px"
                            }}
                          >
                            <CreditCard size={13} />
                            <span>Pay Bill</span>
                          </button>
                        ) : (
                          <span style={{ fontSize: "12px", color: "#16A34A", fontWeight: 700 }}>
                            Receipt Disbursed
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} style={{ padding: "30px", textAlign: "center", color: "#94A3B8" }}>
                    No transport payment records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: DISBURSE STAFF SALARY */}
      {/* ========================================================================= */}
      {showSalaryModal && (
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
            maxWidth: "520px",
            padding: "28px",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)"
          }}>
            <h2 style={{ fontSize: "18px", fontWeight: 800, margin: "0 0 16px 0", color: "#0F172A" }}>
              Disburse Staff Salary
            </h2>

            <form onSubmit={handleDisburseSalary}>
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>
                  Select Staff Member to Pay:
                </label>
                <select
                  value={salaryForm.salary_id}
                  onChange={(e) => {
                    const sel = salaries.find(s => s.id === e.target.value);
                    if (sel) {
                      setSalaryForm({
                        ...salaryForm,
                        salary_id: sel.id,
                        staff_name: sel.staff_name,
                        designation: sel.designation,
                        net_salary: sel.net_salary,
                      });
                    }
                  }}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "1px solid #CBD5E1",
                    fontSize: "13px",
                    fontWeight: 700
                  }}
                >
                  {salaries.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.staff_name} — {s.designation} (Net: ₹{Number(s.net_salary).toLocaleString("en-IN")}) [{s.payment_status}]
                    </option>
                  ))}
                </select>
              </div>

              <div style={{
                background: "#F1F5F9",
                borderRadius: "12px",
                padding: "14px 18px",
                marginBottom: "16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <div>
                  <div style={{ fontSize: "11px", color: "#64748B", fontWeight: 700 }}>NET SALARY AMOUNT</div>
                  <div style={{ fontSize: "22px", fontWeight: 900, color: "#0F172A" }}>
                    ₹{Number(salaryForm.net_salary).toLocaleString("en-IN")}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#1E293B" }}>{salaryForm.staff_name}</div>
                  <div style={{ fontSize: "11px", color: "#64748B" }}>{salaryForm.designation}</div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>
                    Payment Mode
                  </label>
                  <select
                    value={salaryForm.payment_mode}
                    onChange={(e) => setSalaryForm({ ...salaryForm, payment_mode: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "10px",
                      border: "1px solid #CBD5E1",
                      fontSize: "13px"
                    }}
                  >
                    <option value="BANK_TRANSFER">Bank Transfer (NEFT/RTGS)</option>
                    <option value="UPI">Instant UPI</option>
                    <option value="CHEQUE">Bank Cheque</option>
                    <option value="CASH">Cash Voucher</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>
                    Transaction Ref / Cheque No
                  </label>
                  <input
                    type="text"
                    value={salaryForm.transaction_ref}
                    onChange={(e) => setSalaryForm({ ...salaryForm, transaction_ref: e.target.value })}
                    placeholder="e.g. NEFT-882192"
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "10px",
                      border: "1px solid #CBD5E1",
                      fontSize: "13px"
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>
                  Remarks / Disbursal Note
                </label>
                <input
                  type="text"
                  value={salaryForm.remarks}
                  onChange={(e) => setSalaryForm({ ...salaryForm, remarks: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "10px",
                    border: "1px solid #CBD5E1",
                    fontSize: "13px"
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setShowSalaryModal(false)}
                  style={{
                    padding: "10px 18px",
                    borderRadius: "10px",
                    background: "#F1F5F9",
                    color: "#64748B",
                    border: "none",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "10px 22px",
                    borderRadius: "10px",
                    background: "#10B981",
                    color: "#FFFFFF",
                    border: "none",
                    fontWeight: 800,
                    cursor: "pointer"
                  }}
                >
                  Confirm & Disburse ₹{Number(salaryForm.net_salary).toLocaleString("en-IN")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: PAY MONTHLY TRANSPORT / VEHICLE EXPENSE */}
      {/* ========================================================================= */}
      {showTransportModal && (
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
            maxWidth: "520px",
            padding: "28px",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)"
          }}>
            <h2 style={{ fontSize: "18px", fontWeight: 800, margin: "0 0 16px 0", color: "#0F172A" }}>
              Record / Disburse Transport & Fleet Expense
            </h2>

            <form onSubmit={handleCreateTransportPayout}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>
                    Select Vehicle:
                  </label>
                  <select
                    value={transportForm.vehicle_number}
                    onChange={(e) => setTransportForm({ ...transportForm, vehicle_number: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "10px",
                      border: "1px solid #CBD5E1",
                      fontSize: "13px"
                    }}
                  >
                    <option value="Bus #12 (DL 01 AB 4321)">Bus #12 (DL 01 AB 4321)</option>
                    <option value="Bus #07 (DL 01 CD 8765)">Bus #07 (DL 01 CD 8765)</option>
                    <option value="Mini Bus #03 (DL 02 EF 1234)">Mini Bus #03 (DL 02 EF 1234)</option>
                    <option value="Van #05 (DL 03 GH 9988)">Van #05 (DL 03 GH 9988)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>
                    Expense Category:
                  </label>
                  <select
                    value={transportForm.expense_type}
                    onChange={(e) => setTransportForm({ ...transportForm, expense_type: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "10px",
                      border: "1px solid #CBD5E1",
                      fontSize: "13px"
                    }}
                  >
                    <option value="MONTHLY_CONTRACT">Monthly Contract Hire Fee</option>
                    <option value="FUEL">Fuel (Diesel / CNG)</option>
                    <option value="MAINTENANCE">Vehicle Maintenance & Servicing</option>
                    <option value="DRIVER_STIPEND">Driver Stipend & Allowance</option>
                    <option value="INSURANCE">Insurance / Fitness Certification</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>
                  Contractor / Vendor Agency Name:
                </label>
                <input
                  type="text"
                  required
                  value={transportForm.vendor_or_payee}
                  onChange={(e) => setTransportForm({ ...transportForm, vendor_or_payee: e.target.value })}
                  placeholder="e.g. Rathore Travels & Fleet Services"
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "10px",
                    border: "1px solid #CBD5E1",
                    fontSize: "13px"
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>
                    Payout Amount (₹):
                  </label>
                  <input
                    type="number"
                    required
                    value={transportForm.amount}
                    onChange={(e) => setTransportForm({ ...transportForm, amount: e.target.value })}
                    placeholder="35000"
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "10px",
                      border: "1px solid #CBD5E1",
                      fontSize: "14px",
                      fontWeight: 800
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>
                    Payment Mode:
                  </label>
                  <select
                    value={transportForm.payment_mode}
                    onChange={(e) => setTransportForm({ ...transportForm, payment_mode: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "10px",
                      border: "1px solid #CBD5E1",
                      fontSize: "13px"
                    }}
                  >
                    <option value="BANK_TRANSFER">Bank Transfer (NEFT)</option>
                    <option value="UPI">UPI Payout</option>
                    <option value="CHEQUE">Cheque</option>
                    <option value="CASH">Cash</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>
                  Contract / Route Notes:
                </label>
                <input
                  type="text"
                  value={transportForm.notes}
                  onChange={(e) => setTransportForm({ ...transportForm, notes: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "10px",
                    border: "1px solid #CBD5E1",
                    fontSize: "13px"
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setShowTransportModal(false)}
                  style={{
                    padding: "10px 18px",
                    borderRadius: "10px",
                    background: "#F1F5F9",
                    color: "#64748B",
                    border: "none",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "10px 22px",
                    borderRadius: "10px",
                    background: "#F59E0B",
                    color: "#FFFFFF",
                    border: "none",
                    fontWeight: 800,
                    cursor: "pointer"
                  }}
                >
                  Pay Vehicle Contract ₹{Number(transportForm.amount).toLocaleString("en-IN")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: VIEW & PRINT SALARY PAY SLIP */}
      {/* ========================================================================= */}
      {selectedSlip && (
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
            maxWidth: "600px",
            padding: "32px",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)"
          }}>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "8px" }} className="no-print">
              <button onClick={() => setSelectedSlip(null)} style={{ background: "transparent", border: "none", fontSize: "20px", cursor: "pointer", color: "#64748B" }}>×</button>
            </div>

            <SchoolPrintHeader
              institute={institute}
              documentTitle="SALARY DISBURSAL PAY SLIP"
              documentSubtitle={`Payroll Accounts • Month: ${selectedSlip.month_year}`}
              documentNumber={selectedSlip.voucher_number || "SLP-2026-1001"}
              documentDate={selectedSlip.payment_date || "2026-10-05"}
              badgeText="SALARY DISBURSED"
            />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px", fontSize: "13px" }}>
              <div>
                <div style={{ color: "#64748B", fontSize: "11px" }}>EMPLOYEE NAME</div>
                <div style={{ fontWeight: 800, color: "#0F172A" }}>{selectedSlip.staff_name}</div>
              </div>
              <div>
                <div style={{ color: "#64748B", fontSize: "11px" }}>DESIGNATION & DEPARTMENT</div>
                <div style={{ fontWeight: 800, color: "#0F172A" }}>{selectedSlip.designation} ({selectedSlip.department || "Academics"})</div>
              </div>
              <div>
                <div style={{ color: "#64748B", fontSize: "11px" }}>PAYMENT MODE & DATE</div>
                <div style={{ fontWeight: 800, color: "#0F172A" }}>{selectedSlip.payment_mode} • {selectedSlip.payment_date || "2026-10-05"}</div>
              </div>
              <div>
                <div style={{ color: "#64748B", fontSize: "11px" }}>TRANSACTION REF / UTR</div>
                <div style={{ fontWeight: 800, fontFamily: "monospace", color: "#0F172A" }}>{selectedSlip.transaction_ref || "NEFT-HDFC-99120"}</div>
              </div>
            </div>

            {/* Salary Breakdown Box */}
            <div style={{ background: "#F8FAFC", borderRadius: "12px", padding: "16px", border: "1px solid #E2E8F0", marginBottom: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "13px" }}>
                <span style={{ color: "#475569" }}>Basic Salary</span>
                <span style={{ fontWeight: 700 }}>₹{Number(selectedSlip.basic_salary).toLocaleString("en-IN")}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "13px" }}>
                <span style={{ color: "#475569" }}>Allowances (HRA + Conveyance + Incentive)</span>
                <span style={{ fontWeight: 700, color: "#16A34A" }}>+₹{Number(selectedSlip.allowance).toLocaleString("en-IN")}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", fontSize: "13px" }}>
                <span style={{ color: "#475569" }}>Deductions (PF + TDS)</span>
                <span style={{ fontWeight: 700, color: "#DC2626" }}>-₹{Number(selectedSlip.deduction).toLocaleString("en-IN")}</span>
              </div>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                paddingTop: "12px",
                borderTop: "1px dashed #CBD5E1",
                fontSize: "16px",
                fontWeight: 900
              }}>
                <span style={{ color: "#0F172A" }}>Net Disbursed Amount</span>
                <span style={{ color: "#1E1B4B" }}>₹{Number(selectedSlip.net_salary).toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "11px", color: "#64748B" }}>
                Authorized Signature: Principal / Finance Officer
              </span>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => window.print()}
                  style={{
                    background: "#312E81",
                    color: "#FFFFFF",
                    border: "none",
                    padding: "10px 18px",
                    borderRadius: "10px",
                    fontSize: "13px",
                    fontWeight: 800,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  <Printer size={15} />
                  <span>Print Pay Slip</span>
                </button>
                <button
                  onClick={() => setSelectedSlip(null)}
                  style={{
                    background: "#F1F5F9",
                    color: "#475569",
                    border: "none",
                    padding: "10px 18px",
                    borderRadius: "10px",
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
