import React from "react";
import { Shield, RefreshCw, Terminal, Activity, CheckCircle2 } from "lucide-react";

interface HeaderProps {
  isLiveApi: boolean;
  onRefresh: () => void;
  isLoading: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isLiveApi, onRefresh, isLoading }) => {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 28px",
        borderBottom: "1px solid #1e293b",
        backgroundColor: "#0d1424",
        position: "sticky",
        top: 0,
        zIndex: 40
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div
          style={{
            backgroundColor: "rgba(0, 245, 255, 0.1)",
            border: "1px solid rgba(0, 245, 255, 0.3)",
            borderRadius: "8px",
            padding: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Shield size={24} color="#00f5ff" />
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h1 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700, letterSpacing: "0.5px" }}>
              SecOps Dashboard
            </h1>
            <span
              style={{
                fontSize: "0.7rem",
                padding: "2px 8px",
                borderRadius: "12px",
                backgroundColor: "#1e293b",
                color: "#94a3b8",
                fontWeight: 600,
                letterSpacing: "0.5px"
              }}
            >
              v1.0.0
            </span>
          </div>
          <p style={{ margin: "2px 0 0 0", fontSize: "0.8rem", color: "#94a3b8" }}>
            Autonomous Vulnerability Triage & Defensive Intelligence
          </p>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {/* Backend Connectivity Status Pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 12px",
            borderRadius: "20px",
            backgroundColor: isLiveApi ? "rgba(16, 185, 129, 0.1)" : "rgba(56, 189, 248, 0.1)",
            border: `1px solid ${isLiveApi ? "rgba(16, 185, 129, 0.3)" : "rgba(56, 189, 248, 0.3)"}`
          }}
        >
          {isLiveApi ? (
            <>
              <CheckCircle2 size={14} color="#10b981" />
              <span style={{ fontSize: "0.75rem", color: "#10b981", fontWeight: 600 }}>
                Live Sentinel API Connected
              </span>
            </>
          ) : (
            <>
              <Terminal size={14} color="#38bdf8" />
              <span style={{ fontSize: "0.75rem", color: "#38bdf8", fontWeight: 600 }}>
                Sample Dataset Mode
              </span>
            </>
          )}
        </div>

        {/* Refresh button */}
        <button
          onClick={onRefresh}
          disabled={isLoading}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            backgroundColor: "#17233d",
            border: "1px solid #283a5e",
            color: "#f8fafc",
            padding: "7px 14px",
            borderRadius: "6px",
            fontSize: "0.82rem",
            fontWeight: 500
          }}
        >
          <RefreshCw
            size={14}
            style={{
              animation: isLoading ? "spin 1s linear infinite" : "none"
            }}
          />
          <span>Sync</span>
        </button>
      </div>
    </header>
  );
};
