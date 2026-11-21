import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SecOpsService } from "../src/services/apiClient";
import { LoginModal } from "../src/components/LoginModal";
import { SAMPLE_FINDINGS } from "../src/services/mockData";

describe("SecOps Authentication & Credential Security Tests", () => {
  beforeEach(() => {
    SecOpsService.logout();
    vi.restoreAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    SecOpsService.logout();
  });

  it("SecOpsService.loadFindings rejects unauthenticated requests and does not fake live data", async () => {
    expect(SecOpsService.isAuthenticated()).toBe(false);

    const result = await SecOpsService.loadFindings();
    expect(result.isLiveApi).toBe(false);
    expect(result.findings).toHaveLength(0);
    expect(result.error).toMatch(/Authentication required/i);
  });

  it("SecOpsService.login succeeds with valid credentials and stores token in memory only", async () => {
    const mockToken = "valid.jwt.token";
    const mockUser = { id: "u-1", username: "analyst", role: "analyst" };

    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ token: mockToken, user: mockUser })
    } as Response);

    const result = await SecOpsService.login("analyst", "StrongPass123!");
    expect(result.success).toBe(true);
    expect(result.user?.username).toBe("analyst");
    expect(SecOpsService.isAuthenticated()).toBe(true);
    expect(SecOpsService.getAuthToken()).toBe(mockToken);

    // Verify token is strictly in memory and NOT in persistent browser storage
    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("authToken")).toBeNull();
    expect(sessionStorage.getItem("token")).toBeNull();
    expect(sessionStorage.getItem("authToken")).toBeNull();

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining("/auth/login"),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ username: "analyst", password: "StrongPass123!" })
      })
    );
  });

  it("SecOpsService.login handles explicit authentication failures without falling back to sample data", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ error: "Unauthorized", message: "Invalid username or credentials." })
    } as Response);

    const result = await SecOpsService.login("analyst", "WrongPassword!");
    expect(result.success).toBe(false);
    expect(result.error).toBe("Invalid username or credentials.");
    expect(SecOpsService.isAuthenticated()).toBe(false);
    expect(SecOpsService.getAuthToken()).toBeNull();
  });

  it("SecOpsService.loadFindings handles token revocation (401) explicitly", async () => {
    // First simulate login
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ token: "old.token", user: { id: "u-1", username: "analyst", role: "analyst" } })
    } as Response);
    await SecOpsService.login("analyst", "password");
    expect(SecOpsService.isAuthenticated()).toBe(true);

    // Now simulate 401 on findings endpoint (token revoked due to credential rotation)
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ message: "Authentication token has been revoked due to credential rotation." })
    } as Response);

    const findingsResult = await SecOpsService.loadFindings();
    expect(findingsResult.isLiveApi).toBe(false);
    expect(findingsResult.findings).toHaveLength(0);
    expect(findingsResult.error).toMatch(/Session expired or credentials revoked/i);
    // User is automatically logged out
    expect(SecOpsService.isAuthenticated()).toBe(false);
  });

  it("LoginModal renders username and password fields and displays error on failure", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ message: "Invalid username or credentials." })
    } as Response);

    const handleSuccess = vi.fn();
    const handleClose = vi.fn();

    render(
      <LoginModal
        isOpen={true}
        onClose={handleClose}
        onLoginSuccess={handleSuccess}
      />
    );

    expect(screen.getByText("Sentinel API Login")).toBeInTheDocument();
    const usernameInput = screen.getByLabelText("Username");
    const passwordInput = screen.getByLabelText("Password");
    const submitBtn = screen.getByRole("button", { name: /Authenticate & Connect/i });

    fireEvent.change(usernameInput, { target: { value: "baduser" } });
    fireEvent.change(passwordInput, { target: { value: "badpass" } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Invalid username or credentials.")).toBeInTheDocument();
    });

    expect(handleSuccess).not.toHaveBeenCalled();
  });

  it("LoginModal invokes onLoginSuccess and closes on valid credentials", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        token: "tok.123",
        user: { id: "u-1", username: "analyst", role: "analyst" }
      })
    } as Response);

    const handleSuccess = vi.fn();
    const handleClose = vi.fn();

    render(
      <LoginModal
        isOpen={true}
        onClose={handleClose}
        onLoginSuccess={handleSuccess}
      />
    );

    const usernameInput = screen.getByLabelText("Username");
    const passwordInput = screen.getByLabelText("Password");
    const submitBtn = screen.getByRole("button", { name: /Authenticate & Connect/i });

    fireEvent.change(usernameInput, { target: { value: "analyst" } });
    fireEvent.change(passwordInput, { target: { value: "ValidPassword123!" } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(handleSuccess).toHaveBeenCalledWith(
        expect.objectContaining({ username: "analyst", role: "analyst" })
      );
      expect(handleClose).toHaveBeenCalled();
    });
  });
});
