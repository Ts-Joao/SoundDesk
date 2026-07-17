"use client";

const ACCESS_KEY  = "sd_access_token";
const REFRESH_KEY = "sd_refresh_token";

function isBrowser() {
  return typeof window !== "undefined";
}

export const tokenManager = {
  getAccess: (): string | null => {
    if (!isBrowser()) return null;
    // Tenta cookie primeiro, depois localStorage como fallback
    const match = document.cookie.match(new RegExp(`${ACCESS_KEY}=([^;]+)`));
    return match ? decodeURIComponent(match[1]) : null;
  },

  getRefresh: (): string | null => {
    if (!isBrowser()) return null;
    const match = document.cookie.match(new RegExp(`${REFRESH_KEY}=([^;]+)`));
    return match ? decodeURIComponent(match[1]) : null;
  },

  setTokens: (access: string, refresh: string): void => {
    if (!isBrowser()) return;
    const secure = window.location.protocol === "https:";
    const opts = `; path=/; SameSite=Lax${secure ? "; Secure" : ""}`;
    // access: 15 min
    document.cookie = `${ACCESS_KEY}=${encodeURIComponent(access)}; Max-Age=900${opts}`;
    // refresh: 7 dias
    document.cookie = `${REFRESH_KEY}=${encodeURIComponent(refresh)}; Max-Age=604800${opts}`;
  },

  clearTokens: (): void => {
    if (!isBrowser()) return;
    document.cookie = `${ACCESS_KEY}=; Max-Age=0; path=/`;
    document.cookie = `${REFRESH_KEY}=; Max-Age=0; path=/`;
  },

  hasValidSession: (): boolean => {
    return !!tokenManager.getAccess();
  },
};
