export interface ProjectListDto {
  id: number;
  name?: string;
  status?: string;    // "ACTIVE" | "INACTIVE" | etc
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

export interface ScheduleDto {
  id: number;
  projectId?: number;
  title?: string;
  dueDate?: string;   // ISO (YYYY-MM-DD)
  assignee?: string;
}

export interface EventDto {
  id: number;
  projectId?: number;
  title?: string;
  startAt?: string; // ISO
  endAt?: string;   // ISO
  type?: string;
}

export interface FeedbackDto {
  id: number;
  projectId?: number;
  author?: string;
  content?: string;
  rating?: number;
  createdAt?: string; // ISO
}

export interface DashboardSummary {
  progressRate?: number;
  tasksTotal?: number;
  tasksDone?: number;
}

export interface DashboardStatus {
  health?: string;
  riskCount?: number;
}

export interface DeadlineItem {
  title?: string;
  dueDate?: string; // ISO
  assignee?: string;
}


