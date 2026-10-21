const ACCESS_TOKEN_KEY = "protravel-admin-access-token";

export const authSession = {
  getToken(): string | null {
    return sessionStorage.getItem(ACCESS_TOKEN_KEY);
  },

  setToken(token: string): void {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
  },

  clear(): void {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  },

  isAuthenticated(): boolean {
    return Boolean(this.getToken());
  },
};
