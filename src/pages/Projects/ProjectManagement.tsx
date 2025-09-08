import React, { useState, useEffect, useMemo } from "react";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Search, Plus, FileText, CalendarDays, Users, GitBranch,
  Eye, Edit, MessageSquare,
} from "lucide-react";
import { UserRole } from "@/App";
import { listProjects } from "@/api/projects";
import type { ProjectListDto, ProjectStatus } from "@/types/domain";

interface ProjectManagementProps {
  userRole: UserRole;
}

const STATUS_LABEL: Record<ProjectStatus, string> = {
  "in-progress": "진행중",
  review: "검토중",
  completed: "완료",
  planning: "기획",
};

function formatK(date?: string | null) {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("ko-KR", { year: "numeric", month: "short", day: "numeric" });
}

export function ProjectManagement({ userRole }: ProjectManagementProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [tab, setTab] = useState<ProjectStatus | "all">("all");
  const [projects, setProjects] = useState<ProjectListDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await listProjects();
        setProjects(data ?? []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return projects
      .filter((p) => (tab === "all" ? true : p.status === tab))
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.team.toLowerCase().includes(q) ||
          p.members.some((m) => m.name.toLowerCase().includes(q))
      );
  }, [projects, searchQuery, tab]);

  const renderActions = (p: ProjectListDto) => {
    if (userRole === "student") {
      return (
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <FileText className="h-4 w-4 mr-1" /> 보고서 작성
          </Button>
          <Button size="sm" variant="outline">
            <GitBranch className="h-4 w-4 mr-1" /> GitHub
          </Button>
        </div>
      );
    }
    if (userRole === "professor") {
      return (
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <Eye className="h-4 w-4 mr-1" /> 열람
          </Button>
          <Button size="sm" variant="outline">
            <MessageSquare className="h-4 w-4 mr-1" /> 피드백
          </Button>
        </div>
      );
    }
    return (
      <div className="flex gap-2">
        <Button size="sm" variant="outline">
          <Edit className="h-4 w-4 mr-1" /> 편집
        </Button>
      </div>
    );
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">프로젝트 관리</h1>
          <p className="text-muted-foreground">참여 중인 프로젝트를 관리하세요</p>
        </div>
        {userRole === "student" && (
          <Button>
            <Plus className="h-4 w-4 mr-2" /> 새 프로젝트
          </Button>
        )}
      </div>

      {/* 검색 / 필터 */}
      <div className="flex items-center gap-3">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="프로젝트명 또는 팀명으로 검색…"
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
        <TabsList>
          <TabsTrigger value="all">전체</TabsTrigger>
          <TabsTrigger value="in-progress">진행중</TabsTrigger>
          <TabsTrigger value="review">검토중</TabsTrigger>
          <TabsTrigger value="completed">완료</TabsTrigger>
          {/* 필요하면 <TabsTrigger value="planning">기획</TabsTrigger> 추가 */}
        </TabsList>

        <TabsContent value={tab} className="mt-6">
          <div className="space-y-4">
            {filtered.map((p) => (
              <Card key={p.id}>
                <CardHeader className="flex-row items-start justify-between space-y-0">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      {p.name}
                      <Badge variant="outline">{STATUS_LABEL[p.status]}</Badge>
                    </CardTitle>
                    <CardDescription>
                      소속 팀: <span className="font-medium">{p.team}</span> · 최근 업데이트: {formatK(p.lastUpdate)}
                    </CardDescription>
                  </div>
                  {renderActions(p)}
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="text-xs text-muted-foreground">프로젝트 진행률</div>
                  <Progress value={Math.max(0, Math.min(100, p.progress))} className="h-2" />

                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <Badge variant="secondary">
                      마일스톤 {p.milestones.completed}/{p.milestones.total}
                    </Badge>

                    {p.nextDeadline ? (
                      <span className="inline-flex items-center gap-1 text-muted-foreground">
                        <CalendarDays className="h-4 w-4" />
                        다음 마감: {p.nextDeadline.task} · {formatK(p.nextDeadline.date)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">다음 마감 없음</span>
                    )}

                    <span className="text-muted-foreground">
                      팀원: {p.members.map((m) => m.name).join(", ") || "-"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}

            {!loading && filtered.length === 0 && (
              <div className="text-center text-muted-foreground py-12">표시할 프로젝트가 없습니다.</div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
