import React, { useState, useEffect } from "react";
import { RefreshCw, School, Sparkles } from "lucide-react";

interface Props {
  // Optional manual override
  isLoading?: boolean;
}

export const GlobalLoader: React.FC<Props> = ({ isLoading: propLoading }) => {
  const [activeRequests, setActiveRequests] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    const handleLoadingEvent = (e: any) => {
      const { isLoading, count } = e.detail || {};
      setActiveRequests(count || (isLoading ? 1 : 0));
    };

    window.addEventListener("radhix_erp_loading", handleLoadingEvent);
    return () => window.removeEventListener("radhix_erp_loading", handleLoadingEvent);
  }, []);

  const isLoading = propLoading !== undefined ? propLoading : activeRequests > 0;

  useEffect(() => {
    if (isLoading) {
      setVisible(true);
    } else {
      // Smooth fade out after a brief moment
      const timer = setTimeout(() => {
        setVisible(false);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (!visible) return null;

  return (
    <>
      {/* 1. Top Slim Progress Bar across entire screen */}
      <div className="top-loader-bar">
        <div className="top-loader-bar-inner" />
      </div>

      {/* 2. Sleek Floating Glassmorphic Pill (Bottom-Right) */}
      <div
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 999999,
          background: "rgba(15, 23, 42, 0.85)",
          color: "#FFFFFF",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 0 15px rgba(61, 94, 225, 0.3)",
          borderRadius: "30px",
          padding: "8px 16px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          fontSize: "12px",
          fontWeight: 700,
          letterSpacing: "0.3px",
          pointerEvents: "none",
          transition: "all 0.25s ease",
          animation: "fadeInUp 0.2s ease-out"
        }}
      >
        <div style={{
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#60A5FA"
        }}>
          <RefreshCw size={14} className="animate-spin" />
        </div>
        <span>Loading School Data...</span>
        {activeRequests > 1 && (
          <span style={{
            background: "rgba(255, 255, 255, 0.2)",
            padding: "2px 6px",
            borderRadius: "10px",
            fontSize: "10px",
            fontWeight: 800
          }}>
            {activeRequests}
          </span>
        )}
      </div>
    </>
  );
};

// Reusable Center Tab / Section Loader Component for any view
export const ContentLoadingSkeleton: React.FC<{
  title?: string;
  subtitle?: string;
  count?: number;
}> = ({
  title = "Loading data from server...",
  subtitle = "Please wait while we fetch the latest records",
  count = 3
}) => {
  return (
    <div style={{ padding: "30px 20px" }}>
      {/* Animated Center Header */}
      <div style={{
        textAlign: "center",
        marginBottom: "28px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        <div style={{
          width: "56px",
          height: "56px",
          borderRadius: "16px",
          background: "linear-gradient(135deg, rgba(61, 94, 225, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)",
          border: "1px solid rgba(61, 94, 225, 0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--primary-color, #3D5EE1)",
          marginBottom: "12px",
          boxShadow: "0 8px 20px -4px rgba(61, 94, 225, 0.15)"
        }}>
          <RefreshCw size={26} className="animate-spin" />
        </div>
        <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-primary, #0F172A)", margin: 0 }}>
          {title}
        </h3>
        <p style={{ fontSize: "12px", color: "var(--text-secondary, #64748B)", margin: "4px 0 0 0" }}>
          {subtitle}
        </p>
      </div>

      {/* Skeleton Cards Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
        gap: "18px"
      }}>
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            style={{
              background: "var(--bg-surface, #FFFFFF)",
              borderRadius: "16px",
              border: "1px solid var(--border-subtle, #E2E8F0)",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "12px"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div className="skeleton-shimmer" style={{ width: "90px", height: "20px" }} />
              <div className="skeleton-shimmer" style={{ width: "60px", height: "16px" }} />
            </div>
            <div className="skeleton-shimmer" style={{ width: "70%", height: "22px", marginTop: "4px" }} />
            <div className="skeleton-shimmer" style={{ width: "100%", height: "14px" }} />
            <div className="skeleton-shimmer" style={{ width: "85%", height: "14px" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px", paddingTop: "12px", borderTop: "1px solid var(--border-subtle, #F1F5F9)" }}>
              <div className="skeleton-shimmer" style={{ width: "100px", height: "16px" }} />
              <div className="skeleton-shimmer" style={{ width: "24px", height: "24px", borderRadius: "50%" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default GlobalLoader;
