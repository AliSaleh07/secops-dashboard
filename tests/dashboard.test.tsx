import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Header } from "../src/components/Header";
import { MetricsCards } from "../src/components/MetricsCards";
import { FindingsTable } from "../src/components/FindingsTable";
import { SecOpsService } from "../src/services/apiClient";
import { SAMPLE_FINDINGS } from "../src/services/mockData";

describe("SecOps Dashboard Component & Service Tests", () => {
  it("renders Header with application title and connectivity indicator", () => {
    render(<Header isLiveApi={false} onRefresh={vi.fn()} isLoading={false} />);
    expect(screen.getByText("SecOps Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Sample Dataset Mode")).toBeInTheDocument();
  });

  it("calculates and displays metrics correctly in MetricsCards", () => {
    const stats = SecOpsService.calculateStats(SAMPLE_FINDINGS);
    render(<MetricsCards stats={stats} />);

    expect(screen.getByText("Total Findings")).toBeInTheDocument();
    expect(screen.getByText(SAMPLE_FINDINGS.length.toString())).toBeInTheDocument();
    expect(screen.getByText("Critical Severity")).toBeInTheDocument();
  });

  it("filters findings table by search query", () => {
    const handleSelect = vi.fn();
    render(<FindingsTable findings={SAMPLE_FINDINGS} onSelectFinding={handleSelect} />);

    const searchInput = screen.getByPlaceholderText(/Search vulnerability/i);
    fireEvent.change(searchInput, { target: { value: "Redis" } });

    // Should find the Redis RCE item
    expect(screen.getByText(/Unauthenticated Remote Code Execution in Exposed Redis/i)).toBeInTheDocument();
  });

  it("SecOpsService calculates summary statistics accurately", () => {
    const stats = SecOpsService.calculateStats(SAMPLE_FINDINGS);
    expect(stats.total).toBe(SAMPLE_FINDINGS.length);
    expect(stats.bySeverity.CRITICAL).toBeGreaterThan(0);
    expect(stats.meanCvssScore).toBeGreaterThan(0);
  });
});
