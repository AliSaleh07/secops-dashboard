import React, { useState } from "react";
import { Finding, FindingStatus, Severity } from "../types";
import { Search, ExternalLink } from "lucide-react";

interface FindingsTableProps {
  findings: Finding[];
  onSelectFinding: (finding: Finding) => void;
}

export const FindingsTable: React.FC<FindingsTableProps> = ({ findings, onSelectFinding }) => {
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filtered = findings.filter((f) => {
    const matchesSearch =
      search.trim() === "" ||
      f.title.toLowerCase().includes(search.toLowerCase()) ||
      f.target.toLowerCase().includes(search.toLowerCase()) ||
      (f.cve && f.cve.toLowerCase().includes(search.toLowerCase()));

    const matchesSeverity = severityFilter === "ALL" || f.severity === severityFilter;
    const matchesStatus = statusFilter === "ALL" || f.status === statusFilter;

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const getSeverityBadge = (sev: Severity) => {
    switch (sev) {
      case "CRITICAL":
        return { bg: "rgba(239, 68, 68, 0.15)", text: "#ef4444", border: "rgba(239, 68, 68, 0.4)" };
      case "HIGH":
        return { bg: "rgba(249, 115, 22, 0.15)", text: "#f97316", border: "rgba(249, 115, 22, 0.4)" };
      case "MEDIUM":
        return { bg: "rgba(234, 179, 8, 0.15)", text: "#eab308", border: "rgba(234, 179, 8, 0.4)" };
      case "LOW":
        return { bg: "rgba(56, 189, 248, 0.15)", text: "#38bdf8", border: "rgba(56, 189, 248, 0.4)" };
      default:
        return { bg: "rgba(148, 163, 184, 0.15)", text: "#94a3b8", border: "rgba(148, 163, 184, 0.4)" };
    }
  };

  const getStatusBadge = (status: FindingStatus) => {
    switch (status) {
      case "RESOLVED":
        return { bg: "rgba(16, 185, 129, 0.12)", text: "#10b981", border: "rgba(16, 185, 129, 0.3)" };
      case "IN_PROGRESS":
        return { bg: "rgba(56, 189, 248, 0.12)", text: "#38bdf8", border: "rgba(56, 189, 248, 0.3)" };
      case "FALSE_POSITIVE":
        return { bg: "rgba(148, 163, 184, 0.12)", text: "#94a3b8", border: "rgba(148, 163, 184, 0.3)" };
      default:
        return { bg: "rgba(239, 68, 68, 0.12)", text: "#f87171", border: "rgba(239, 68, 68, 0.3)" };
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#111a2e",
        border: "1px solid #1e293b",
        borderRadius: "10px",
        padding: "20px 24px"
      }}
    >
      {/* Search and Filter Controls */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "20px"
        }}
      >
        {/* Search input */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "#0d1424",
            border: "1px solid #1e293b",
            borderRadius: "6px",
            padding: "8px 12px",
            flex: "1 1 260px"
          }}
        >
          <Search size={16} color="#64748b" />
          <input
            type="text"
            placeholder="Search vulnerability title, CVE, target..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#f8fafc",
              fontSize: "0.85rem",
              width: "100%"
            }}
          />
        </div>

        {/* Severity filter buttons */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((sev) => {
            const isSelected = severityFilter === sev;
            return (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  backgroundColor: isSelected ? "#00f5ff" : "#17233d",
                  color: isSelected ? "#090d16" : "#94a3b8",
                  border: isSelected ? "1px solid #00f5ff" : "1px solid #283a5e"
                }}
              >
                {sev}
              </button>
            );
          })}
        </div>

        {/* Status dropdown */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            backgroundColor: "#17233d",
            border: "1px solid #283a5e",
            color: "#f8fafc",
            padding: "6px 12px",
            borderRadius: "6px",
            fontSize: "0.75rem",
            outline: "none"
          }}
        >
          <option value="ALL">All Statuses</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
        </select>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #1e293b", color: "#64748b", fontSize: "0.75rem", textTransform: "uppercase" }}>
              <th style={{ padding: "12px 14px" }}>Vulnerability</th>
              <th style={{ padding: "12px 14px" }}>Severity</th>
              <th style={{ padding: "12px 14px" }}>CVSS</th>
              <th style={{ padding: "12px 14px" }}>Target Asset</th>
              <th style={{ padding: "12px 14px" }}>Source Tool</th>
              <th style={{ padding: "12px 14px" }}>Status</th>
              <th style={{ padding: "12px 14px", textAlign: "right" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: "36px 0", textAlign: "center", color: "#64748b" }}>
                  No security findings matched the search criteria.
                </td>
              </tr>
            ) : (
              filtered.map((item) => {
                const sevBadge = getSeverityBadge(item.severity);
                const statBadge = getStatusBadge(item.status);
                return (
                  <tr
                    key={item.id}
                    style={{
                      borderBottom: "1px solid #17233d",
                      fontSize: "0.83rem",
                      transition: "background 0.15s ease"
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#15203a")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    <td style={{ padding: "14px", fontWeight: 500, color: "#f8fafc" }}>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span>{item.title}</span>
                        {item.cve && (
                          <span style={{ fontSize: "0.7rem", color: "#64748b", fontFamily: "monospace" }}>
                            {item.cve}
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: "14px" }}>
                      <span
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          padding: "3px 8px",
                          borderRadius: "4px",
                          backgroundColor: sevBadge.bg,
                          color: sevBadge.text,
                          border: `1px solid ${sevBadge.border}`
                        }}
                      >
                        {item.severity}
                      </span>
                    </td>
                    <td style={{ padding: "14px", fontFamily: "monospace", fontWeight: 600, color: "#cbd5e1" }}>
                      {item.cvssScore !== undefined ? item.cvssScore.toFixed(1) : "-"}
                    </td>
                    <td style={{ padding: "14px", fontFamily: "monospace", fontSize: "0.78rem", color: "#94a3b8" }}>
                      {item.target}
                    </td>
                    <td style={{ padding: "14px", color: "#cbd5e1" }}>
                      <span
                        style={{
                          fontSize: "0.72rem",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          backgroundColor: "#1e293b",
                          fontFamily: "monospace"
                        }}
                      >
                        {item.sourceTool}
                      </span>
                    </td>
                    <td style={{ padding: "14px" }}>
                      <span
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          padding: "3px 8px",
                          borderRadius: "4px",
                          backgroundColor: statBadge.bg,
                          color: statBadge.text,
                          border: `1px solid ${statBadge.border}`
                        }}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td style={{ padding: "14px", textAlign: "right" }}>
                      <button
                        onClick={() => onSelectFinding(item)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          backgroundColor: "transparent",
                          border: "1px solid #283a5e",
                          color: "#38bdf8",
                          padding: "5px 10px",
                          borderRadius: "5px",
                          fontSize: "0.75rem",
                          fontWeight: 500
                        }}
                      >
                        <span>Inspect</span>
                        <ExternalLink size={12} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
