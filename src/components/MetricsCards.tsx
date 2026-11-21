import React from "react";
import { FindingStats } from "../types";
import { AlertCircle, AlertTriangle, CheckCircle, BarChart3 } from "lucide-react";

interface MetricsCardsProps {
  stats: FindingStats;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({ stats }) => {
  const resolvedCount = stats.byStatus.RESOLVED;
  const resolutionRate =
    stats.total > 0 ? Math.round((resolvedCount / stats.total) * 100) : 0;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "16px",
        marginBottom: "24px"
      }}
    >
      {/* Total Card */}
      <div
        style={{
          backgroundColor: "#111a2e",
          border: "1px solid #1e293b",
          borderRadius: "10px",
          padding: "18px 20px"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase" }}>
            Total Findings
          </span>
          <BarChart3 size={18} color="#38bdf8" />
        </div>
        <div style={{ fontSize: "2rem", fontWeight: 700, margin: "10px 0 4px 0", color: "#f8fafc" }}>
          {stats.total}
        </div>
        <span style={{ fontSize: "0.75rem", color: "#64748b" }}>Across all inspected assets</span>
      </div>

      {/* Critical Card */}
      <div
        style={{
          backgroundColor: "#1a131b",
          border: "1px solid rgba(239, 68, 68, 0.3)",
          borderRadius: "10px",
          padding: "18px 20px"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "0.8rem", color: "#f87171", fontWeight: 600, textTransform: "uppercase" }}>
            Critical Severity
          </span>
          <AlertCircle size={18} color="#ef4444" />
        </div>
        <div style={{ fontSize: "2rem", fontWeight: 700, margin: "10px 0 4px 0", color: "#ef4444" }}>
          {stats.bySeverity.CRITICAL}
        </div>
        <span style={{ fontSize: "0.75rem", color: "#f87171" }}>Requires immediate containment</span>
      </div>

      {/* High Card */}
      <div
        style={{
          backgroundColor: "#1a1816",
          border: "1px solid rgba(249, 115, 22, 0.3)",
          borderRadius: "10px",
          padding: "18px 20px"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "0.8rem", color: "#fb923c", fontWeight: 600, textTransform: "uppercase" }}>
            High Severity
          </span>
          <AlertTriangle size={18} color="#f97316" />
        </div>
        <div style={{ fontSize: "2rem", fontWeight: 700, margin: "10px 0 4px 0", color: "#f97316" }}>
          {stats.bySeverity.HIGH}
        </div>
        <span style={{ fontSize: "0.75rem", color: "#fb923c" }}>High exploitability potential</span>
      </div>

      {/* Resolution Rate Card */}
      <div
        style={{
          backgroundColor: "#111f1e",
          border: "1px solid rgba(16, 185, 129, 0.3)",
          borderRadius: "10px",
          padding: "18px 20px"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "0.8rem", color: "#34d399", fontWeight: 600, textTransform: "uppercase" }}>
            Remediation Rate
          </span>
          <CheckCircle size={18} color="#10b981" />
        </div>
        <div style={{ fontSize: "2rem", fontWeight: 700, margin: "10px 0 4px 0", color: "#10b981" }}>
          {resolutionRate}%
        </div>
        <span style={{ fontSize: "0.75rem", color: "#6ee7b7" }}>
          Mean CVSS: {stats.meanCvssScore} / 10.0
        </span>
      </div>
    </div>
  );
};
