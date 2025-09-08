/** 프로젝트/팀 (기존 페이지 호환용) */
export interface ProjectListDto {
  id: number;
  name?: string;
  status?: string;
  teamId?: number;
  createdAt?: string; // ISO
  updatedAt?: string; // ISO
}

export interface TeamListDto {
  id: number;
  name?: string;
  projectId?: number;
  memberCount?: number;
}

/** 피드백 (기존 페이지 호환) */
export interface FeedbackDto {
  id: number;
  projectId?: number;
  author?: string;
  content?: string;
  rating?: number;
  createdAt?: string; // ISO
}

/** ----- Dashboard DTO (백엔드와 1:1) ----- */
export interface DashboardSummary {
  progressPct: number;
  memberCount: number;
  commitsThisWeek: number;
  assignments: {
    open: number;
    inProgress: number;
    closed: number;
  };
  milestone: { title: string; date: string } | null;
}

export interface DashboardStatus {
  progressPct: number;
  lastUpdate: string; // ISO
  actions: string[];  // 추천 액션 문자열
}

export interface DeadlineItem {
  title: string;
  dueDate: string; // ISO
}

/** ----- Schedule DTO (백엔드 ScheduleDto) ----- */
export type ScheduleType = "deadline" | "meeting" | "task" | "presentation";
export type ScheduleStatus = "completed" | "in-progress" | "pending" | "scheduled";
export type SchedulePriority = "high" | "medium" | "low";

export interface ScheduleDto {
  id: string;                  // "A-1" | "E-2"
  title: string;
  description?: string | null;
  type: ScheduleType;
  status: ScheduleStatus;
  priority: SchedulePriority;
  date?: string | null;        // "yyyy-MM-dd"
  time?: string | null;        // "HH:mm"
  assignee?: string | null;
  location?: string | null;
  /** 백엔드 필드는 projectTitle 이고, 기존 일부 코드가 projectName을 쓸 수 있어 둘 다 허용 */
  projectTitle?: string | null;
  projectName?: string | null;
}

/** ----- Assignment DTO (assignments API) ----- */
export interface Assignment {
  id: number;
  projectId: number;
  title: string;
  dueDate: string;                         // ISO
  status: "COMPLETED" | "ONGOING" | "PENDING";
}

/** ----- Event DTO (events API) ----- */
export type EventType = "MEETING" | "DEADLINE" | "ETC";

export interface EventDto {
  id: number;
  projectId: number;
  title: string;
  startAt?: string; // ISO
  endAt?: string;   // ISO
  type?: EventType;
  location?: string | null;
}
