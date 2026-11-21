import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { MetricsCards } from "./components/MetricsCards";
import { SeverityChart } from "./components/SeverityChart";
import { FindingsTable } from "./components/FindingsTable";
import { FindingDetailModal } from "./components/FindingDetailModal";
import { LoginModal } from "./components/LoginModal";
import { SecOpsService, AuthUser } from "./services/apiClient";
import { Finding, FindingStatus } from "./types";
import { Lock, Info, AlertTriangle } from "lucide-react";

export function App() {
  const [findings, setFindings] = useState<Finding[]>([]);
  const [isLiveApi, setIsLiveApi] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [authNotification, setAuthNotification] = useState<string | null>(null);

  // Initial load: start with sample dataset in demo mode until authenticated
  useEffect(() => {
    const sample = SecOpsService.loadSampleData();
    setFindings(sample.findings);
    setIsLiveApi(false);
  }, []);

  const fetchLiveData = async () => {
    if (!SecOpsService.isAuthenticated()) {
      setIsLoginModalOpen(true);
      return;
    }

    setIsLoading(true);
    const data = await SecOpsService.loadFindings();
    setIsLoading(false);

    if (data.isLiveApi) {
      setFindings(data.findings);
      setIsLiveApi(true);
      setAuthNotification(null);
    } else {
      // Auth expired or API error
      if (data.error) {
        setAuthNotification(data.error);
        if (data.error.includes("expired") || data.error.includes("revoked")) {
          setCurrentUser(null);
          setIsLiveApi(false);
          const sample = SecOpsService.loadSampleData();
          setFindings(sample.findings);
        }
      }
    }
  };

  const handleLoginSuccess = async (user: AuthUser) => {
    setCurrentUser(user);
    setAuthNotification(null);
    setIsLoading(true);
    const data = await SecOpsService.loadFindings();
    setIsLoading(false);

    if (data.isLiveApi) {
      setFindings(data.findings);
      setIsLiveApi(true);
    } else if (data.error) {
      setAuthNotification(data.error);
    }
  };

  const handleLogout = () => {
    SecOpsService.logout();
    setCurrentUser(null);
    setIsLiveApi(false);
    setAuthNotification(null);
    const sample = SecOpsService.loadSampleData();
    setFindings(sample.findings);
  };

  const handleStatusChange = async (id: string, newStatus: FindingStatus) => {
    const updatedList = await SecOpsService.updateFindingStatus(id, newStatus);
    setFindings(updatedList);
    if (selectedFinding && selectedFinding.id === id) {
      setSelectedFinding({
        ...selectedFinding,
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
    }
  };

  const stats = SecOpsService.calculateStats(findings);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#090d16", color: "#f8fafc" }}>
      <Header
        isLiveApi={isLiveApi}
        onRefresh={fetchLiveData}
        isLoading={isLoading}
        currentUser={currentUser}
        onLoginClick={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Unauthenticated / Demo Mode Banner */}
      {!currentUser && (
        <div
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.9)",
            borderBottom: "1px solid #1e293b",
            padding: "10px 24px"
          }}
        >
          <div
            style={{
              maxWidth: "1280px",
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "12px"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Info size={16} color="#38bdf8" />
              <span style={{ fontSize: "0.82rem", color: "#94a3b8" }}>
                You are currently viewing offline demonstration data. Sign in with analyst credentials to access live triage intelligence.
              </span>
            </div>
            <button
              onClick={() => setIsLoginModalOpen(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                backgroundColor: "#00f5ff",
                color: "#030712",
                border: "none",
                borderRadius: "6px",
                padding: "5px 12px",
                fontSize: "0.78rem",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              <Lock size={13} />
              <span>Sign In to Sentinel API</span>
            </button>
          </div>
        </div>
      )}

      {/* Notification Banner (Session Expired / Errors) */}
      {authNotification && (
        <div
          style={{
            backgroundColor: "rgba(239, 68, 68, 0.15)",
            borderBottom: "1px solid rgba(239, 68, 68, 0.4)",
            padding: "10px 24px"
          }}
        >
          <div
            style={{
              maxWidth: "1280px",
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}
          >
            <AlertTriangle size={16} color="#ef4444" />
            <span style={{ fontSize: "0.82rem", color: "#fca5a5" }}>{authNotification}</span>
          </div>
        </div>
      )}

      <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "28px 24px" }}>
        {/* KPI Summary Cards */}
        <MetricsCards stats={stats} />

        {/* Severity Visual Distribution Chart */}
        <SeverityChart stats={stats} />

        {/* Vulnerability Data Table Explorer */}
        <FindingsTable
          findings={findings}
          onSelectFinding={(item) => setSelectedFinding(item)}
        />
      </main>

      {/* Deep Inspection Modal */}
      <FindingDetailModal
        finding={selectedFinding}
        onClose={() => setSelectedFinding(null)}
        onStatusChange={handleStatusChange}
      />

      {/* Sentinel Analyst Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        initialError={authNotification}
      />
    </div>
  );
}

export default App;
