import http from "@/lib/http";
import { tokenStore } from "@/lib/token";

export async function login(email: string, password: string) {
  const { data } = await http.post("/auth/login", { email, password });
  tokenStore.access = data.accessToken;
  tokenStore.refresh = data.refreshToken;
  return data.user;
}

export async function logout() {
  try { await http.post("/auth/logout"); } catch {}
  tokenStore.clear();
}

export async function refresh() {
  const { data } = await http.post("/auth/refresh", { refreshToken: tokenStore.refresh });
  tokenStore.access = data.accessToken;
  if (data.refreshToken) tokenStore.refresh = data.refreshToken;
}

export async function me() {
  const { data } = await http.get("/api/me");
  return data;
}