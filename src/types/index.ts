export type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";

export type FindingStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "FALSE_POSITIVE";

export interface Finding {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  status: FindingStatus;
  target: string;
  sourceTool: string;
  cve?: string;
  cvssScore?: number;
  remediation?: string;
  rawEvidence?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface FindingStats {
  total: number;
  bySeverity: Record<Severity, number>;
  byStatus: Record<FindingStatus, number>;
  meanCvssScore: number;
}
