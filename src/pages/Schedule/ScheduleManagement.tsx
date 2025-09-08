// src/pages/Schedule/ScheduleManagement.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Plus, Search, FileText, Users } from "lucide-react";
import { UserRole } from "@/App";
import { listSchedules } from "@/api/schedules";
import type { ScheduleDto } from "@/types/domain";
import { useEffect, useMemo, useState } from "react";

interface ScheduleManagementProps {
  userRole: UserRole;
}

export function ScheduleManagement({ userRole }: ScheduleManagementProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState<"upcoming" | "all" | "past">(
    "upcoming"
  );
  const [schedules, setSchedules] = useState<ScheduleDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await listSchedules();
        setSchedules(data);
      } catch (error) {
        console.error("Failed to fetch schedules:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 아이콘은 단일 타입으로 표시(백엔드에 type 필드가 없기 때문)
  const getTypeIcon = () => <FileText className="h-4 w-4 text-purple-500" />;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "날짜 없음";
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date();
    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return "오늘";
    if (date.toDateString() === tomorrow.toDateString()) return "내일";
    return date.toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "short" });
  };

  const filteredSorted = useMemo(() => {
    const q = searchQuery.toLowerCase();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const filtered = schedules.filter((s) => {
      const matches =
        (s.title?.toLowerCase().includes(q) ?? false) ||
        (s.assignee?.toLowerCase().includes(q) ?? false);
      if (!matches) return false;

      const d = s.dueDate ? new Date(s.dueDate) : undefined;
      if (selectedTab === "all") return true;
      if (!d) return selectedTab === "past"; // 날짜가 없으면 과거로 분류
      return selectedTab === "upcoming" ? d >= today : d < today;
    });

    return filtered.sort((a, b) => {
      const aT = a.dueDate ? new Date(a.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
      const bT = b.dueDate ? new Date(b.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
      return aT - bT;
    });
  }, [schedules, searchQuery, selectedTab]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">일정 관리</h1>
          <p className="text-muted-foreground">
            {userRole === "student"
              ? "내 프로젝트 일정을 확인하고 관리하세요."
              : userRole === "professor"
              ? "담당 과목/프로젝트의 일정을 관리하세요."
              : "전체 일정 현황을 확인하고 관리하세요."}
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          새 일정 추가
        </Button>
      </div>

      {/* 검색 */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="일정 제목 또는 담당자로 검색…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* 탭 & 목록 */}
      <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as any)}>
        <TabsList>
          <TabsTrigger value="upcoming">다가오는 일정</TabsTrigger>
          <TabsTrigger value="all">전체</TabsTrigger>
          <TabsTrigger value="past">지난 일정</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="mt-6">
          <div className="space-y-4">
            {filteredSorted.map((s) => (
              <Card key={s.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">{getTypeIcon()}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{s.title ?? "제목 없음"}</h3>
                            <Badge variant="outline">상태 API 필요</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            담당자: {s.assignee ?? "정보 없음"}
                          </p>
                        </div>
                        <div className="text-right text-sm">
                          <div className="flex items-center gap-1 text-muted-foreground mb-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(s.dueDate)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          상세 정보(상태, 메모 등) 연동 필요
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            편집
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredSorted.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {selectedTab === "upcoming"
                  ? "다가오는 일정이 없습니다."
                  : selectedTab === "past"
                  ? "지난 일정이 없습니다."
                  : "검색 조건에 맞는 일정이 없습니다."}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
