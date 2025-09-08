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
import {
  Search,
  Plus,
  Users,
  UserPlus,
  Settings,
  MessageSquare,
  Calendar,
} from "lucide-react";
import { UserRole } from "@/App";
import { listTeams } from "@/api/teams";
import { listProjects } from "@/api/projects";
import type { TeamListDto, ProjectListDto } from "@/types/domain";

interface TeamManagementProps {
  userRole: UserRole;
}

export function TeamManagement({ userRole }: TeamManagementProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [teams, setTeams] = useState<TeamListDto[]>([]);
  const [projects, setProjects] = useState<ProjectListDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [teamData, projectData] = await Promise.all([
          listTeams(),
          listProjects(),
        ]);
        setTeams(teamData);
        setProjects(projectData);
      } catch (error) {
        console.error("Failed to fetch team data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getProjectName = (projectId?: number) => {
    return projects.find((p) => p.id === projectId)?.name ?? "프로젝트 정보 없음";
  };

  const filteredTeams = teams.filter((team) => {
    const projectName = getProjectName(team.projectId).toLowerCase();
    const teamName = team.name?.toLowerCase() ?? "";
    const query = searchQuery.toLowerCase();
    return teamName.includes(query) || projectName.includes(query);
  });

  const renderTeamActions = () => {
    if (userRole === "student") {
      return (
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <UserPlus className="h-4 w-4 mr-2" />
            팀원 초대
          </Button>
          <Button size="sm" variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            팀 설정
          </Button>
        </div>
      );
    } else if (userRole === "professor") {
      return (
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <MessageSquare className="h-4 w-4 mr-2" />
            피드백
          </Button>
          <Button size="sm" variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            일정 관리
          </Button>
        </div>
      );
    } else {
      // admin
      return (
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            설정
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
          <h1 className="text-2xl font-semibold">팀 관리</h1>
          <p className="text-muted-foreground">
            {userRole === "student"
              ? "팀을 구성하고 협업을 진행하세요."
              : userRole === "professor"
              ? "담당 팀들을 관리하고 지도하세요."
              : "전체 팀 현황을 확인하고 관리하세요."}
          </p>
        </div>
        {userRole === "student" && (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            새 팀 생성
          </Button>
        )}
      </div>

      {/* 검색 */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="팀명 또는 프로젝트명으로 검색…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* 팀 목록 */}
      <div className="grid gap-6">
        {filteredTeams.map((team) => (
          <Card key={team.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-lg">
                      {team.name ?? "이름 없음"}
                    </CardTitle>
                    <Badge variant="outline">
                      {team.memberCount ?? 0}명
                    </Badge>
                  </div>
                  <CardDescription className="text-base font-medium">
                    {getProjectName(team.projectId)}
                  </CardDescription>
                </div>
                {renderTeamActions()}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-8 w-8 mx-auto mb-2" />
                <p>
                  팀 상세 정보(팀원, 역할, 활동 등)를 표시하려면
                  <br />
                  추가 API 연동이 필요합니다.
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTeams.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            검색 조건에 맞는 팀이 없습니다.
          </p>
        </div>
      )}
    </div>
  );
}
