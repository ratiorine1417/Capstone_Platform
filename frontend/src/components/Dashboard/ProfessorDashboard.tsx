import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { CalendarWidget } from './CalendarWidget';
import { 
  Users, 
  FileText, 
  Star, 
  Calendar, 
  MessageSquare,
  ClipboardCheck,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

export function ProfessorDashboard() {
  const courseStats = {
    totalTeams: 12,
    totalStudents: 48,
    pendingReviews: 8,
    avgProgress: 72
  };

  const pendingReviews = [
    { id: 1, team: '팀 Alpha', project: 'AI 챗봇 시스템', type: '중간발표', dueDate: '2024-03-15', priority: 'high' },
    { id: 2, team: '팀 Beta', project: '모바일 학습 앱', type: '프로토타입', dueDate: '2024-03-18', priority: 'medium' },
    { id: 3, team: '팀 Gamma', project: '스마트 도서관', type: '제안서', dueDate: '2024-03-20', priority: 'low' },
  ];

  const recentSubmissions = [
    { id: 1, team: '팀 Delta', project: '웹 기반 협업툴', type: '중간 보고서', submittedAt: '2024-03-10 14:30', status: 'pending' },
    { id: 2, team: '팀 Echo', project: 'IoT 환경 모니터링', type: '프로토타입', submittedAt: '2024-03-10 09:15', status: 'reviewed' },
    { id: 3, team: '팀 Foxtrot', project: '블록체인 투표 시스템', type: '최종 보고서', submittedAt: '2024-03-09 16:45', status: 'graded' },
  ];

  const topPerformingTeams = [
    { team: '팀 Alpha', project: 'AI 챗봇 시스템', score: 92, progress: 85 },
    { team: '팀 Echo', project: 'IoT 환경 모니터링', score: 89, progress: 90 },
    { team: '팜 Delta', project: '웹 기반 협업툴', score: 87, progress: 78 },
  ];

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return <Badge variant="destructive">긴급</Badge>;
      case 'medium': return <Badge variant="default">보통</Badge>;
      case 'low': return <Badge variant="secondary">낮음</Badge>;
      default: return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="outline">검토 대기</Badge>;
      case 'reviewed': return <Badge variant="secondary">검토 완료</Badge>;
      case 'graded': return <Badge variant="default">채점 완료</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* 상단 요약 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{courseStats.totalTeams}</p>
                <p className="text-sm text-muted-foreground">진행 팀</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-chart-2/10 rounded-lg">
                <FileText className="h-5 w-5 text-chart-2" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{courseStats.pendingReviews}</p>
                <p className="text-sm text-muted-foreground">검토 대기</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-chart-3/10 rounded-lg">
                <Star className="h-5 w-5 text-chart-3" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{courseStats.totalStudents}</p>
                <p className="text-sm text-muted-foreground">수강 학생</p>
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
                <p className="text-2xl font-semibold">{courseStats.avgProgress}%</p>
                <p className="text-sm text-muted-foreground">평균 진도</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 검토 대기 항목 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>검토 대기 항목</CardTitle>
                <CardDescription>평가가 필요한 제출물들</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <ClipboardCheck className="h-4 w-4 mr-2" />
                일괄 검토
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingReviews.map((review) => (
                <div key={review.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm">{review.team}</p>
                        {getPriorityBadge(review.priority)}
                      </div>
                      <p className="text-xs text-muted-foreground">{review.type} • 마감: {review.dueDate}</p>
                    </div>
                  </div>
                  <Button size="sm">검토</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 최근 제출물 */}
        <Card>
          <CardHeader>
            <CardTitle>최근 제출물</CardTitle>
            <CardDescription>최근 3일간의 제출 현황</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentSubmissions.map((submission) => (
                <div key={submission.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm">{submission.team}</p>
                      {getStatusBadge(submission.status)}
                    </div>
                    <p className="text-xs text-muted-foreground">{submission.type} • {submission.submittedAt}</p>
                  </div>
                  <Button size="sm" variant="outline">보기</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 캘린더 위젯 */}
      <CalendarWidget />

      {/* 상위 성과 팀 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>상위 성과 팀</CardTitle>
              <CardDescription>현재 높은 성과를 보이는 팀들</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <MessageSquare className="h-4 w-4 mr-2" />
              피드백 전송
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPerformingTeams.map((team, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-chart-1/10 rounded-full">
                    <span className="text-sm font-semibold">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium">{team.team}</p>
                    <p className="text-sm text-muted-foreground">{team.project}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-semibold">{team.score}점</span>
                  </div>
                  <div className="w-24">
                    <Progress value={team.progress} className="h-1" />
                    <p className="text-xs text-muted-foreground mt-1">{team.progress}% 진행</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}