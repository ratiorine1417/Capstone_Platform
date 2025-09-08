import { http } from "@/api/http";
import type { ScheduleDto } from "@/types/domain";

export async function listSchedules() {
  const { data } = await http.get<ScheduleDto[]>("/schedules");
  return data;
}
