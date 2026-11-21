import React from "react";
import { Finding, FindingStatus } from "../types";
import { X, ShieldAlert, CheckCircle, Terminal, FileCode, Wrench } from "lucide-react";

interface FindingDetailModalProps {
  finding: Finding | null;
  onClose: () => void;
  onStatusChange: (id: string, newStatus: FindingStatus) => void;
}

export const FindingDetailModal: React.FC<FindingDetailModalProps> = ({
  finding,
  onClose,
  onStatusChange
}) => {
  if (!finding) return null;

  const isResolved = finding.status === "RESOLVED";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(3, 7, 18, 0.75)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        padding: "20px"
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#0f172a",
          border: "1px solid #1e293b",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "680px",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "26px",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.6)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <ShieldAlert size={22} color={finding.severity === "CRITICAL" ? "#ef4444" : "#f97316"} />
            <div>
              <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#f8fafc" }}>
                {finding.title}
              </h2>
              {finding.cve && (
                <span style={{ fontSize: "0.75rem", color: "#64748b", fontFamily: "monospace" }}>
                  {finding.cve}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "#94a3b8",
              padding: "4px"
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Metadata Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "12px",
            backgroundColor: "#090d16",
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "20px",
            fontSize: "0.8rem"
          }}
        >
          <div>
            <span style={{ color: "#64748b", display: "block" }}>Severity</span>
            <span style={{ fontWeight: 700, color: finding.severity === "CRITICAL" ? "#ef4444" : "#f97316" }}>
              {finding.severity} {finding.cvssScore ? `(CVSS ${finding.cvssScore})` : ""}
            </span>
          </div>
          <div>
            <span style={{ color: "#64748b", display: "block" }}>Detection Tool</span>
            <span style={{ fontWeight: 600, color: "#cbd5e1", fontFamily: "monospace" }}>
              {finding.sourceTool}
            </span>
          </div>
          <div>
            <span style={{ color: "#64748b", display: "block" }}>Current Status</span>
            <span style={{ fontWeight: 600, color: isResolved ? "#10b981" : "#f87171" }}>
              {finding.status}
            </span>
          </div>
        </div>

        {/* Affected Target Asset */}
        <div style={{ marginBottom: "18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
            <FileCode size={15} color="#38bdf8" />
            <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase" }}>
              Affected Asset / Target
            </span>
          </div>
          <div
            style={{
              backgroundColor: "#111a2e",
              border: "1px solid #1e293b",
              borderRadius: "6px",
              padding: "8px 12px",
              fontFamily: "monospace",
              fontSize: "0.82rem",
              color: "#e2e8f0"
            }}
          >
            {finding.target}
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: "18px" }}>
          <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
            Technical Description
          </span>
          <p style={{ margin: 0, fontSize: "0.88rem", lineHeight: 1.5, color: "#cbd5e1" }}>
            {finding.description}
          </p>
        </div>

        {/* Remediation */}
        {finding.remediation && (
          <div style={{ marginBottom: "18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
              <Wrench size={15} color="#10b981" />
              <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#10b981", textTransform: "uppercase" }}>
                Remediation Guidance
              </span>
            </div>
            <div
              style={{
                backgroundColor: "rgba(16, 185, 129, 0.08)",
                border: "1px solid rgba(16, 185, 129, 0.25)",
                borderRadius: "6px",
                padding: "10px 14px",
                fontSize: "0.85rem",
                lineHeight: 1.5,
                color: "#d1fae5"
              }}
            >
              {finding.remediation}
            </div>
          </div>
        )}

        {/* Raw Evidence Block */}
        {finding.rawEvidence && (
          <div style={{ marginBottom: "22px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
              <Terminal size={15} color="#a855f7" />
              <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase" }}>
                Inspection Evidence / Trace
              </span>
            </div>
            <pre
              style={{
                backgroundColor: "#050811",
                border: "1px solid #1e293b",
                borderRadius: "6px",
                padding: "10px 14px",
                fontSize: "0.78rem",
                color: "#a78bfa",
                overflowX: "auto",
                margin: 0,
                fontFamily: "monospace"
              }}
            >
              {finding.rawEvidence}
            </pre>
          </div>
        )}

        {/* Actions Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #1e293b", paddingTop: "18px" }}>
          <button
            onClick={() => onStatusChange(finding.id, isResolved ? "OPEN" : "RESOLVED")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              borderRadius: "6px",
              fontSize: "0.82rem",
              fontWeight: 600,
              backgroundColor: isResolved ? "#1e293b" : "#10b981",
              color: isResolved ? "#94a3b8" : "#090d16",
              border: "none"
            }}
          >
            <CheckCircle size={15} />
            <span>{isResolved ? "Reopen Vulnerability" : "Mark as Resolved"}</span>
          </button>

          <button
            onClick={onClose}
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              fontSize: "0.82rem",
              fontWeight: 500,
              backgroundColor: "transparent",
              color: "#94a3b8",
              border: "1px solid #283a5e"
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
