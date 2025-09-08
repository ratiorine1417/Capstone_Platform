import http from "@/lib/http";

export async function health() {
  try {
    const { data } = await http.get("/api/health");
    return data;
  } catch {
    return { status: "DOWN" };
  }
}