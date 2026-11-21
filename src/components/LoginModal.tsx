import React, { useState } from "react";
import { Lock, Shield, X, AlertCircle, Loader2 } from "lucide-react";
import { SecOpsService, AuthUser } from "../services/apiClient";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AuthUser) => void;
  initialError?: string | null;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialError
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError || null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError("Please enter both username and password.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await SecOpsService.login(username, password);
    setIsLoading(false);

    if (result.success && result.user) {
      setPassword("");
      setError(null);
      onLoginSuccess(result.user);
      onClose();
    } else {
      setError(result.error || "Authentication failed. Please verify credentials.");
    }
  };

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
        zIndex: 100,
        padding: "16px"
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) onClose();
      }}
    >
      <div
        style={{
          backgroundColor: "#0d1424",
          border: "1px solid #1e293b",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "420px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)",
          overflow: "hidden"
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 24px",
            borderBottom: "1px solid #1e293b"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                backgroundColor: "rgba(0, 245, 255, 0.1)",
                border: "1px solid rgba(0, 245, 255, 0.3)",
                borderRadius: "8px",
                padding: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Shield size={20} color="#00f5ff" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 600, color: "#f8fafc" }}>
                Sentinel API Login
              </h3>
              <p style={{ margin: "2px 0 0 0", fontSize: "0.75rem", color: "#94a3b8" }}>
                Authenticate to access live triage intelligence
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            style={{
              background: "transparent",
              border: "none",
              color: "#64748b",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              alignItems: "center"
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: "24px" }}>
          {error && (
            <div
              style={{
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.4)",
                borderRadius: "8px",
                padding: "12px",
                marginBottom: "20px",
                display: "flex",
                alignItems: "flex-start",
                gap: "10px"
              }}
            >
              <AlertCircle size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: "2px" }} />
              <span style={{ fontSize: "0.82rem", color: "#fca5a5", lineHeight: "1.4" }}>
                {error}
              </span>
            </div>
          )}

          <div style={{ marginBottom: "18px" }}>
            <label
              htmlFor="login-username"
              style={{
                display: "block",
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "#94a3b8",
                marginBottom: "6px"
              }}
            >
              Username
            </label>
            <input
              id="login-username"
              name="username"
              type="text"
              autoFocus
              disabled={isLoading}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. analyst"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "10px 14px",
                backgroundColor: "#090d16",
                border: "1px solid #1e293b",
                borderRadius: "8px",
                color: "#f8fafc",
                fontSize: "0.9rem",
                outline: "none"
              }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label
              htmlFor="login-password"
              style={{
                display: "block",
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "#94a3b8",
                marginBottom: "6px"
              }}
            >
              Password
            </label>
            <input
              id="login-password"
              name="password"
              type="password"
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "10px 14px",
                backgroundColor: "#090d16",
                border: "1px solid #1e293b",
                borderRadius: "8px",
                color: "#f8fafc",
                fontSize: "0.9rem",
                outline: "none"
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              style={{
                padding: "9px 16px",
                backgroundColor: "transparent",
                border: "1px solid #1e293b",
                borderRadius: "8px",
                color: "#94a3b8",
                fontSize: "0.85rem",
                fontWeight: 500,
                cursor: "pointer"
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "9px 20px",
                backgroundColor: "#00f5ff",
                color: "#030712",
                border: "none",
                borderRadius: "8px",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.7 : 1
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <Lock size={15} />
                  <span>Authenticate & Connect</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
