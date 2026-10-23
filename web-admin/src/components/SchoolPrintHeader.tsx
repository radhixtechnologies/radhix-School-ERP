import React from "react";
import { School, ShieldCheck } from "lucide-react";

interface SchoolPrintHeaderProps {
  institute?: any;
  documentTitle: string;
  documentSubtitle?: string;
  documentNumber?: string;
  documentDate?: string;
  badgeText?: string;
  badgeColor?: string;
  copiesBadge?: string;
}

export const SchoolPrintHeader: React.FC<SchoolPrintHeaderProps> = ({
  institute,
  documentTitle,
  documentSubtitle,
  documentNumber,
  documentDate,
  badgeText = "OFFICIAL RECORD",
  badgeColor = "#15803D",
  copiesBadge,
}) => {
  const schoolName = institute?.name || "Delhi Public Academy";
  const schoolCode = institute?.code || "DPA101";
  const affiliation = institute?.affiliation_board || "CBSE Affiliated (Affil No: 213084/2026)";
  const address = institute?.address || "Campus Block A, Institutional Area";
  const city = institute?.city || "New Delhi";
  const state = institute?.state || "Delhi";
  const phone = institute?.phone || "+91 011-87654321";
  const email = institute?.email || `principal@${schoolCode.toLowerCase()}.edu.in`;
  const logoUrl = institute?.logo_url || institute?.logoUrl || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=128&q=80";

  return (
    <div
      className="school-print-header"
      style={{
        borderBottom: "2px solid #0F172A",
        paddingBottom: "16px",
        marginBottom: "20px",
        color: "#0F172A",
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      {/* Top Banner Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px",
          background: "#F8FAFC",
          padding: "6px 12px",
          borderRadius: "8px",
          border: "1px solid #E2E8F0",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11px", fontWeight: 800, color: "#475569" }}>
          <ShieldCheck size={14} color="#3D5EE1" />
          <span>RADHIX CLOUD SCHOOL ERP • VERIFIED TENANT DOSSIER</span>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {copiesBadge && (
            <span
              style={{
                background: "#FEF3C7",
                color: "#92400E",
                padding: "2px 8px",
                borderRadius: "6px",
                fontSize: "10px",
                fontWeight: 900,
                letterSpacing: "0.5px",
                border: "1px solid #FCD34D",
              }}
            >
              {copiesBadge}
            </span>
          )}
          <span
            style={{
              background: "#DCFCE7",
              color: badgeColor,
              padding: "2px 8px",
              borderRadius: "6px",
              fontSize: "10px",
              fontWeight: 800,
            }}
          >
            ● {badgeText}
          </span>
        </div>
      </div>

      {/* Main Header with Logo & Identity */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px" }}>
        {/* Left: School Crest Logo & Name */}
        <div style={{ display: "flex", alignItems: "center", gap: "18px", flex: 1 }}>
          <div
            style={{
              width: "72px",
              height: "72px",
              minWidth: "72px",
              borderRadius: "16px",
              border: "2px solid #E2E8F0",
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
              background: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={schoolName}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => {
                  // Fallback to School icon if image fails
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <School size={36} color="#3D5EE1" />
            )}
          </div>

          <div>
            <h1
              style={{
                fontSize: "22px",
                fontWeight: 900,
                margin: "0 0 2px 0",
                color: "#0F172A",
                letterSpacing: "-0.5px",
                textTransform: "uppercase",
              }}
            >
              {schoolName}
            </h1>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#3D5EE1", marginBottom: "3px" }}>
              {affiliation} • School Code: <span style={{ fontFamily: "monospace" }}>{schoolCode}</span>
            </div>
            <div style={{ fontSize: "11px", color: "#64748B", lineHeight: 1.4 }}>
              {address}, {city}, {state} • Ph: <strong>{phone}</strong> • Email: {email}
            </div>
          </div>
        </div>

        {/* Right: Document Identity Box */}
        <div
          style={{
            textAlign: "right",
            background: "#F1F5F9",
            padding: "10px 16px",
            borderRadius: "12px",
            border: "1px solid #CBD5E1",
            minWidth: "180px",
          }}
        >
          <div style={{ fontSize: "13px", fontWeight: 900, color: "#1E3A8A", textTransform: "uppercase" }}>
            {documentTitle}
          </div>
          {documentSubtitle && (
            <div style={{ fontSize: "11px", color: "#64748B", marginTop: "2px" }}>
              {documentSubtitle}
            </div>
          )}
          {documentNumber && (
            <div style={{ fontSize: "12px", fontWeight: 800, color: "#0F172A", marginTop: "4px", fontFamily: "monospace" }}>
              Ref: {documentNumber}
            </div>
          )}
          {documentDate && (
            <div style={{ fontSize: "11px", color: "#64748B", marginTop: "2px" }}>
              Date: <strong>{documentDate}</strong>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
