import { Finding, FindingStats, FindingStatus } from "../types";
import { SAMPLE_FINDINGS } from "./mockData";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://sentinel.salehsec.dev/api/v1";

export interface AuthUser {
  id: string;
  username: string;
  role: string;
}

export interface DashboardData {
  findings: Finding[];
  isLiveApi: boolean;
  error?: string;
}

export class SecOpsService {
  private static localCache: Finding[] = [...SAMPLE_FINDINGS];
  // Secure In-Memory Token & User Storage (never stored in localStorage, sessionStorage, or cookies)
  private static authToken: string | null = null;
  private static currentUser: AuthUser | null = null;

  public static getAuthToken(): string | null {
    return this.authToken;
  }

  public static getCurrentUser(): AuthUser | null {
    return this.currentUser;
  }

  public static isAuthenticated(): boolean {
    return !!this.authToken;
  }

  /**
   * Authenticate against the live Sentinel API.
   * Credentials are sent directly via POST and are never stored or embedded in frontend code.
   */
  public static async login(
    username: string,
    password: string
  ): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    try {
      this.logout();

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errorMsg =
          data.message || data.error || `Authentication failed with status ${response.status}.`;
        return { success: false, error: errorMsg };
      }

      if (!data.token) {
        return { success: false, error: "Server response did not include a valid authorization token." };
      }

      const user: AuthUser = data.user || {
        id: "analyst-session",
        username: username.trim(),
        role: "analyst"
      };

      this.authToken = data.token;
      this.currentUser = user;

      return { success: true, user };
    } catch (err: any) {
      if (err.name === "AbortError") {
        return { success: false, error: "Connection to Sentinel API timed out." };
      }
      return { success: false, error: err.message || "Failed to reach Sentinel API." };
    }
  }

  public static logout(): void {
    this.authToken = null;
    this.currentUser = null;
  }

  /**
   * Loads live findings from Sentinel API using the in-memory bearer token.
   * Does NOT silently fall back to sample data if authentication fails.
   */
  public static async loadFindings(): Promise<DashboardData> {
    if (!this.authToken) {
      return {
        findings: [],
        isLiveApi: false,
        error: "Authentication required to access live Sentinel intelligence."
      };
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(`${API_BASE_URL}/findings`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.authToken}`
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.status === 401 || response.status === 403) {
        this.logout();
        return {
          findings: [],
          isLiveApi: false,
          error: "Session expired or credentials revoked. Please sign in again."
        };
      }

      if (!response.ok) {
        return {
          findings: [],
          isLiveApi: false,
          error: `API error (${response.status}): Failed to retrieve findings.`
        };
      }

      const data = await response.json();
      const items = Array.isArray(data.items) ? data.items : [];
      this.localCache = items;
      return { findings: items, isLiveApi: true };
    } catch (err: any) {
      if (err.name === "AbortError") {
        return { findings: [], isLiveApi: false, error: "Sentinel API request timed out." };
      }
      return { findings: [], isLiveApi: false, error: err.message || "Network error." };
    }
  }

  /**
   * Explicitly load offline sample dataset for demo/evaluation mode.
   */
  public static loadSampleData(): DashboardData {
    return { findings: [...SAMPLE_FINDINGS], isLiveApi: false };
  }

  public static async updateFindingStatus(id: string, newStatus: FindingStatus): Promise<Finding[]> {
    if (this.authToken) {
      try {
        await fetch(`${API_BASE_URL}/findings/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.authToken}`
          },
          body: JSON.stringify({ status: newStatus })
        });
      } catch (e) {
        // Continue with local update for responsiveness
      }
    }

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
