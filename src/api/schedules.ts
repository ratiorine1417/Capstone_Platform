﻿import { http } from "@/api/http";
import type { ScheduleDto } from "@/types/domain";

/** (옵션) 전체 목록 – 필요시만 사용 */
export async function listSchedules() {
  const { data } = await http.get<ScheduleDto[]>("/schedules");
  return data;
}

/** 기간 기반 조회 (주/월 이동 시 사용) */
export async function listSchedulesInRange(params: {
  from: string; // YYYY-MM-DD
  to: string;   // YYYY-MM-DD
  projectId?: number;
  teamId?: number;
  /** true면 Event만 반환(Assignment 제외) */
  onlyEvents?: boolean;
}) {
  const { data } = await http.get<ScheduleDto[]>("/schedules/range", {
    params,
  });
  return data;
}