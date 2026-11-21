import { Finding, FindingStats, FindingStatus } from "../types";
import { SAMPLE_FINDINGS } from "./mockData";

const API_BASE_URL = "http://localhost:3001/api/v1";

export interface DashboardData {
  findings: Finding[];
  isLiveApi: boolean;
  error?: string;
}

export class SecOpsService {
  private static localCache: Finding[] = [...SAMPLE_FINDINGS];

  public static async loadFindings(): Promise<DashboardData> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      // Attempt login with default analyst credentials
      const loginRes = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "analyst",
          password: "REDACTED_HISTORICAL_STRING"
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (loginRes.ok) {
        const { token } = await loginRes.json();
        const findingsRes = await fetch(`${API_BASE_URL}/findings`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (findingsRes.ok) {
          const data = await findingsRes.json();
          this.localCache = data.items;
          return { findings: data.items, isLiveApi: true };
        }
      }
    } catch (e) {
      // Backend is offline or unreachable - gracefully fall back to sample dataset
    }

    return { findings: [...this.localCache], isLiveApi: false };
  }

  public static async updateFindingStatus(id: string, newStatus: FindingStatus): Promise<Finding[]> {
    this.localCache = this.localCache.map((f) =>
      f.id === id ? { ...f, status: newStatus, updatedAt: new Date().toISOString() } : f
    );
    return [...this.localCache];
  }

  public static calculateStats(findings: Finding[]): FindingStats {
    const bySeverity = {
      CRITICAL: 0,
      HIGH: 0,
      MEDIUM: 0,
      LOW: 0,
      INFO: 0
    };
    const byStatus = {
      OPEN: 0,
      IN_PROGRESS: 0,
      RESOLVED: 0,
      FALSE_POSITIVE: 0
    };

    let cvssSum = 0;
    let cvssCount = 0;

    for (const f of findings) {
      bySeverity[f.severity]++;
      byStatus[f.status]++;
      if (f.cvssScore) {
        cvssSum += f.cvssScore;
        cvssCount++;
      }
    }

    return {
      total: findings.length,
      bySeverity,
      byStatus,
      meanCvssScore: cvssCount > 0 ? Number((cvssSum / cvssCount).toFixed(1)) : 0
    };
  }
}
