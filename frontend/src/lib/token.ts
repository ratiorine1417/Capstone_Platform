const ACCESS = import.meta.env.VITE_ACCESS_TOKEN_KEY || "access_token";
const REFRESH = import.meta.env.VITE_REFRESH_TOKEN_KEY || "refresh_token";

export const tokenStore = {
  get access() { return localStorage.getItem(ACCESS) || ""; },
  set access(v: string) { localStorage.setItem(ACCESS, v); },
  get refresh() { return localStorage.getItem(REFRESH) || ""; },
  set refresh(v: string) { localStorage.setItem(REFRESH, v); },
  clear() { localStorage.removeItem(ACCESS); localStorage.removeItem(REFRESH); }
};