import React, { useState, useEffect } from "react";
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
  Users,
  BookOpen,
  Database,
  Activity,
  TrendingUp,
  AlertCircle,
  Settings,
  Download,
} from "lucide-react";
import { listProjects } from "@/api/projects";
import { getProjectDashboardStatus } from "@/api/dashboard";
import type { ProjectListDto, DashboardStatus } from "@/types/domain";

interface AdminDashboardProps {
  // API는 프로젝트 단위로 제공되어 있어 당장은 하나의 projectId만 사용합니다.
  projectId: number;
}

export function AdminDashboard({ projectId }: AdminDashboardProps) {
  const [projects, setProjects] = useState<ProjectListDto[]>([]);
  const [status, setStatus] = useState<DashboardStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // NOTE: 관리자 대시보드는 전역 API가 더 어울리지만,
        // 지금은 프로젝트 목록과 특정 프로젝트의 상태를 예시로 사용합니다.
        const [projectData, statusData] = await Promise.all([
          listProjects(),
          getProjectDashboardStatus(projectId),
        ]);
        setProjects(projectData);
        setStatus(statusData);
      } catch (error) {
        console.error("Failed to fetch admin dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  const systemStats = {
    totalUsers: "N/A", // TODO: 사용자 수 API 필요
    activeCourses: "N/A", // TODO: 과목 수 API 필요
    totalProjects: projects.length,
    systemUptime: 99.9, // 예시 값
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "user_registration":
        return <Users className="h-4 w-4 text-blue-500" />;
      case "course_creation":
        return <BookOpen className="h-4 w-4 text-green-500" />;
      case "system_backup":
        return <Database className="h-4 w-4 text-purple-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (val: string) => {
    const s = (val || "").toLowerCase();
    switch (s) {
      case "healthy":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            정상
          </Badge>
        );
      case "warning":
        return (
          <Badge variant="destructive" className="bg-yellow-100 text-yellow-800">
            경고
          </Badge>
        );
      case "error":
        return <Badge variant="destructive">오류</Badge>;
      default:
        return <Badge variant="outline">{val || "unknown"}</Badge>;
    }
  };

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
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{systemStats.totalUsers}</p>
                <p className="text-sm text-muted-foreground">전체 사용자</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-chart-2/10 rounded-lg">
                <BookOpen className="h-5 w-5 text-chart-2" />
              </div>
              <div>
                <p className="text-2xl font-semibold">
                  {systemStats.activeCourses}
                </p>
                <p className="text-sm text-muted-foreground">활성 과목</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-chart-3/10 rounded-lg">
                <Database className="h-5 w-5 text-chart-3" />
              </div>
              <div>
                <p className="text-2xl font-semibold">
                  {systemStats.totalProjects}
                </p>
                <p className="text-sm text-muted-foreground">진행 프로젝트</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-chart-4/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-chart-4" />
              </div>
              <div>
                <p className="text-2xl font-semibold">
                  {systemStats.systemUptime}%
                </p>
                <p className="text-sm text-muted-foreground">시스템 가동률</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 프로젝트(과목) 현황 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>프로젝트 현황</CardTitle>
                <CardDescription>
                  진행 중인 모든 프로젝트의 간략 현황
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                설정
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">
                      {project.name ?? "이름 없음"}
                    </h3>
                    <Badge variant="secondary">{project.status ?? "N/A"}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    담당: 정보 없음
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span>팀: {project.teamId ?? "N/A"}</span>
                    {/* TODO: 진행률 데이터 API 연동 필요 */}
                    <Progress value={50} className="w-24 h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 최근 시스템 활동 (예시) */}
        <Card>
          <CardHeader>
            <CardTitle>최근 시스템 활동</CardTitle>
            <CardDescription>
              시스템 활동 로그를 표시하려면 별도 API가 필요합니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="h-8 w-8 mx-auto mb-2" />
              <p>활동 로그를 표시하려면 API 연동이 필요합니다.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 캘린더 위젯 */}
      <CalendarWidget />

      {/* 시스템 상태 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>시스템 상태</CardTitle>
              <CardDescription>
                현재 플랫폼/프로젝트의 상태 요약
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              보고서 다운로드
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">서비스 헬스</p>
                <p className="text-sm text-muted-foreground">
                  현재 상태: {status?.health ?? "unknown"}
                </p>
              </div>
              <div className="text-right">
                {getStatusBadge(status?.health ?? "unknown")}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">에러/경고</p>
                <p className="text-sm text-muted-foreground">API 필요</p>
              </div>
              <div className="text-right">{getStatusBadge("unknown")}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
