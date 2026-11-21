import React from "react";
import { FindingStats } from "../types";

interface SeverityChartProps {
  stats: FindingStats;
}

export const SeverityChart: React.FC<SeverityChartProps> = ({ stats }) => {
  const total = stats.total || 1;
  const items = [
    { label: "Critical", count: stats.bySeverity.CRITICAL, color: "#ef4444" },
    { label: "High", count: stats.bySeverity.HIGH, color: "#f97316" },
    { label: "Medium", count: stats.bySeverity.MEDIUM, color: "#eab308" },
    { label: "Low", count: stats.bySeverity.LOW, color: "#38bdf8" },
    { label: "Info", count: stats.bySeverity.INFO, color: "#64748b" }
  ];

  return (
    <div
      style={{
        backgroundColor: "#111a2e",
        border: "1px solid #1e293b",
        borderRadius: "10px",
        padding: "20px 24px",
        marginBottom: "24px"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h3 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 600, color: "#f8fafc" }}>
          Severity Distribution
        </h3>
        <span style={{ fontSize: "0.75rem", color: "#64748b" }}>Weighted by CVSS Impact</span>
      </div>

      {/* Multi-segment Progress Bar */}
      <div
        style={{
          display: "flex",
          height: "14px",
          borderRadius: "7px",
          overflow: "hidden",
          backgroundColor: "#1e293b",
          marginBottom: "16px"
        }}
      >
        {items.map((item) => {
          const widthPct = (item.count / total) * 100;
          if (widthPct === 0) return null;
          return (
            <div
              key={item.label}
              style={{
                width: `${widthPct}%`,
                backgroundColor: item.color,
                transition: "width 0.4s ease"
              }}
              title={`${item.label}: ${item.count} (${widthPct.toFixed(1)}%)`}
            />
          );
        })}
      </div>

      {/* Legend & Counts */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          justifyContent: "space-between"
        }}
      >
        {items.map((item) => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: item.color
              }}
            />
            <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>{item.label}:</span>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#f8fafc" }}>
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
