import { http } from "@/api/http";
import type { EventDto } from "@/types/domain";

export async function listProjectEvents(
  projectId: number,
  params: { from?: string; to?: string } = {}
) {
  const { data } = await http.get<EventDto[]>(
    `/projects/${projectId}/events`,
    { params }
  );
  return data;
}


