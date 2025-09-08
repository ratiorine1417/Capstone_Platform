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
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Search,
  Plus,
  FileText,
  Calendar,
  Users,
  GitBranch,
  Download,
  Upload,
  Eye,
  Edit,
  MessageSquare,
} from "lucide-react";
import { UserRole } from "@/App";
import { listProjects } from "@/api/projects";
import { listTeams } from "@/api/teams";
import type { ProjectListDto, TeamListDto } from "@/types/domain";

interface ProjectManagementProps {
  userRole: UserRole;
}

export function ProjectManagement({ userRole }: ProjectManagementProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [projects, setProjects] = useState<ProjectListDto[]>([]);
  const [teams, setTeams] = useState<TeamListDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [projectData, teamData] = await Promise.all([
          listProjects(),
          listTeams(),
        ]);
        setProjects(projectData);
        setTeams(teamData);
      } catch (error) {
        console.error("Failed to fetch project data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getTeamName = (teamId?: number) => {
    return teams.find((t) => t.id === teamId)?.name ?? "팀 정보 없음";
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge variant="secondary">진행중</Badge>;
      case "COMPLETED":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            완료
          </Badge>
        );
      case "INACTIVE":
        return <Badge variant="outline">비활성</Badge>;
      default:
        return <Badge variant="outline">{status ?? "상태 없음"}</Badge>;
    }
  };

  const filteredProjects = projects.filter((project) => {
    const teamName = getTeamName(project.teamId).toLowerCase();
    const projectName = project.name?.toLowerCase() ?? "";
    const query = searchQuery.toLowerCase();

    const matchesSearch =
      projectName.includes(query) || teamName.includes(query);

    if (selectedTab === "all") return matchesSearch;
    // NOTE: API의 상태 값과 UI 탭의 매핑이 다를 수 있습니다.
    if (selectedTab === "in-progress")
      return matchesSearch && project.status === "ACTIVE";
    if (selectedTab === "completed")
      return matchesSearch && project.status === "COMPLETED";
    if (selectedTab === "review") return matchesSearch; // 별도 상태 필요 시 조정
    return matchesSearch;
  });

  const renderProjectActions = (project: ProjectListDto) => {
    if (userRole === "student") {
      return (
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            보고서 작성
          </Button>
          <Button size="sm" variant="outline">
            <GitBranch className="h-4 w-4 mr-2" />
            GitHub
          </Button>
        </div>
      );
    } else if (userRole === "professor") {
      return (
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            열람
          </Button>
          <Button size="sm" variant="outline">
            <MessageSquare className="h-4 w-4 mr-2" />
            피드백
          </Button>
        </div>
      );
    } else {
      // admin
      return (
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            편집
          </Button>
          <Button size="sm" variant="outline">
            <Download className="h-4 w-4 mr-2" />
            내보내기
          </Button>
        </div>
      );
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">프로젝트 관리</h1>
          <p className="text-muted-foreground">
            {userRole === "student"
              ? "참여 중인 프로젝트를 관리하세요"
              : userRole === "professor"
              ? "담당 프로젝트들을 관리하고 검토하세요"
              : "전체 프로젝트 현황을 확인하고 관리하세요"}
          </p>
        </div>
        {userRole === "student" && (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            새 프로젝트
          </Button>
        )}
      </div>

      {/* 검색 & 가져오기 */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="프로젝트명 또는 팀명으로 검색…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Upload className="h-4 w-4 mr-2" />
          가져오기
        </Button>
      </div>

      {/* 탭 & 프로젝트 목록 */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="all">전체</TabsTrigger>
          <TabsTrigger value="in-progress">진행중</TabsTrigger>
          <TabsTrigger value="review">검토 중 (API 필요)</TabsTrigger>
          <TabsTrigger value="completed">완료</TabsTrigger>
        </TabsList>

        {/* 하나의 콘텐츠에서 탭 상태에 따라 필터만 변경 */}
        <TabsContent value={selectedTab} className="mt-6">
          <div className="grid gap-6">
            {filteredProjects.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-lg">
                          {project.name ?? "이름 없음"}
                        </CardTitle>
                        {getStatusBadge(project.status)}
                      </div>
                      <CardDescription className="text-base">
                        상세 메타 정보(API 필요)
                      </CardDescription>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{getTeamName(project.teamId)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            최종 업데이트:{" "}
                            {project.updatedAt
                              ? new Date(
                                  project.updatedAt
                                ).toLocaleDateString("ko-KR")
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                    {renderProjectActions(project)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          프로젝트 진행률 (API 필요)
                        </span>
                        <span className="text-sm text-muted-foreground">
                          --%
                        </span>
                      </div>
                      <Progress value={0} className="h-2" />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      추가 정보(팀원/완료 현황 등)를 보려면 별도 API가 필요합니다.
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                검색 조건에 맞는 프로젝트가 없습니다.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
