import { beforeEach, describe, expect, it } from "vitest";
import { authSession } from "./auth-session";

describe("authSession", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("stores an access token only for the current browser session", () => {
    authSession.setToken("admin-access-token");

    expect(authSession.getToken()).toBe("admin-access-token");
    expect(authSession.isAuthenticated()).toBe(true);
    expect(localStorage.length).toBe(0);
  });

  it("reports an unauthenticated session when no token exists", () => {
    expect(authSession.getToken()).toBeNull();
    expect(authSession.isAuthenticated()).toBe(false);
  });

  it("clears the current session", () => {
    authSession.setToken("admin-access-token");

    authSession.clear();

    expect(authSession.getToken()).toBeNull();
    expect(authSession.isAuthenticated()).toBe(false);
  });
});
