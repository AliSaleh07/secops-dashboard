import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { MetricsCards } from "./components/MetricsCards";
import { SeverityChart } from "./components/SeverityChart";
import { FindingsTable } from "./components/FindingsTable";
import { FindingDetailModal } from "./components/FindingDetailModal";
import { SecOpsService } from "./services/apiClient";
import { Finding, FindingStatus } from "./types";

export function App() {
  const [findings, setFindings] = useState<Finding[]>([]);
  const [isLiveApi, setIsLiveApi] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    const data = await SecOpsService.loadFindings();
    setFindings(data.findings);
    setIsLiveApi(data.isLiveApi);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      <Header isLiveApi={isLiveApi} onRefresh={fetchData} isLoading={isLoading} />

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
    </div>
  );
}

export default App;
