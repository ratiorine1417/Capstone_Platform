import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CalendarWidget } from "@/components/Dashboard/CalendarWidget";
import {
  Calendar,
  Users,
  FileText,
  GitBranch,
  CheckCircle,
  AlertCircle,
  Plus,
} from "lucide-react";
import {
  getProjectDashboardSummary,
  getProjectDashboardDeadlines,
} from "@/api/dashboard";
import { listProjectFeedback } from "@/api/feedback";
import { listProjects } from "@/api/projects";
import { listTeams } from "@/api/teams";
import type {
  DashboardSummary,
  DeadlineItem,
  FeedbackDto,
  ProjectListDto,
  TeamListDto,
} from "@/types/domain";

interface StudentDashboardProps {
  projectId: number;
}

export function StudentDashboard({ projectId }: StudentDashboardProps) {
  const [project, setProject] = useState<ProjectListDto | null>(null);
  const [team, setTeam] = useState<TeamListDto | null>(null);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [deadlines, setDeadlines] = useState<DeadlineItem[]>([]);
  const [feedback, setFeedback] = useState<FeedbackDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [projects, teams, summaryData, deadlinesData, feedbackData] =
          await Promise.all([
            listProjects(),
            listTeams(),
            getProjectDashboardSummary(projectId),
            getProjectDashboardDeadlines(projectId),
            listProjectFeedback(projectId),
          ]);

        const currentProject =
          projects.find((p) => p.id === projectId) ?? null;
        setProject(currentProject);

        if (currentProject?.teamId) {
          const currentTeam =
            teams.find((t) => t.id === currentProject.teamId) ?? null;
          setTeam(currentTeam);
        }

        setSummary(summaryData);
        setDeadlines(deadlinesData);
        setFeedback(feedbackData);
      } catch (error) {
        console.error("Failed to fetch student dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  const tasksTotal = useMemo(() => {
    if (!summary) return 0;
    const a = summary.assignments;
    return (a?.open ?? 0) + (a?.inProgress ?? 0) + (a?.closed ?? 0);
  }, [summary]);

  const tasksDone = summary?.assignments.closed ?? 0;
  const tasksInProgress = summary?.assignments.inProgress ?? 0;
  const progressRate = summary?.progressPct ?? 0;
  const memberCount = team?.memberCount ?? summary?.memberCount ?? undefined;

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* 상단 요약 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-semibold">
                  {tasksInProgress}
                </p>
                <p className="text-sm text-muted-foreground">진행 중인 과제</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-chart-2/10 rounded-lg">
                <Users className="h-5 w-5 text-chart-2" />
              </div>
              <div>
                <p className="text-2xl font-semibold">
                  {memberCount ?? "N/A"}
                </p>
                <p className="text-sm text-muted-foreground">팀원 수</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-chart-3/10 rounded-lg">
                <GitBranch className="h-5 w-5 text-chart-3" />
              </div>
              <div>
                <p className="text-2xl font-semibold">N/A</p>
                <p className="text-sm text-muted-foreground">레포 상태</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-chart-4/10 rounded-lg">
                <CheckCircle className="h-5 w-5 text-chart-4" />
              </div>
              <div>
                <p className="text-2xl font-semibold">
                  {tasksDone}/{tasksTotal}
                </p>
                <p className="text-sm text-muted-foreground">완료 현황</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 내 프로젝트 현황 */}
        <Card>
          <CardHeader>
            <CardTitle>내 프로젝트 현황</CardTitle>
            <CardDescription>현재 진행 중인 캡스톤 프로젝트</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">
                  {project?.name ?? "프로젝트명을 불러오는 중…"}
                </h3>
                <Badge variant="secondary">{progressRate}% 진행</Badge>
              </div>
              <Progress value={progressRate} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{memberCount ?? "N/A"}명 팀원</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  최종 업데이트:{" "}
                  {project?.updatedAt
                    ? new Date(project.updatedAt).toLocaleDateString("ko-KR")
                    : "N/A"}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button size="sm" className="flex-1">
                <FileText className="h-4 w-4 mr-2" />
                보고서 작성
              </Button>
              <Button size="sm" variant="outline" className="flex-1">
                <GitBranch className="h-4 w-4 mr-2" />
                GitHub 연동
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 다가오는 일정 */}
        <Card>
          <CardHeader>
            <CardTitle>다가오는 일정</CardTitle>
            <CardDescription>마감일이 임박한 과제들</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {deadlines.map((task, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <div>
                      <p className="font-medium text-sm">{task.title}</p>
                      <p className="text-xs text-muted-foreground">
                        마감:{" "}
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString("ko-KR")
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    시작
                  </Button>
                </div>
              ))}
              {deadlines.length === 0 && (
                <div className="text-sm text-muted-foreground text-center py-4">
                  예정된 마감이 없습니다.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 캘린더 위젯 */}
      <CalendarWidget />

      {/* 최근 피드백 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>최근 피드백</CardTitle>
              <CardDescription>교수/멘토로부터의 최신 피드백</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              피드백 등록
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {feedback.map((fb) => (
              <div key={fb.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">{fb.author ?? "작성자"}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {fb.createdAt
                      ? new Date(fb.createdAt).toLocaleDateString("ko-KR")
                      : "N/A"}
                  </span>
                </div>
                <p className="text-sm">{fb.content}</p>
              </div>
            ))}
            {feedback.length === 0 && (
              <div className="text-sm text-muted-foreground text-center py-4">
                등록된 피드백이 없습니다.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
