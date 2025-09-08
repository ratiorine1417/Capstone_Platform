import { http } from "@/api/http";
import type { ScheduleDto } from "@/types/domain";

/** 데모 전체 목록 (백엔드 첫 프로젝트 기준) */
export async function listSchedules() {
  const { data } = await http.get<ScheduleDto[]>("/schedules");
  return data;
}

/** 기간 기반 조회 (캘린더 주/월 이동 시 사용) */
export async function listSchedulesInRange(params: {
  from: string; // YYYY-MM-DD
  to: string;   // YYYY-MM-DD
  projectId?: number;
}) {
  const { from, to, projectId } = params;
  const { data } = await http.get<ScheduleDto[]>("/schedules/range", {
    params: { from, to, projectId },
  });
  return data;
}
