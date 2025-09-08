import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { CalendarWidget } from './CalendarWidget';
import { 
  Calendar, 
  Users, 
  FileText, 
  GitBranch, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Plus
} from 'lucide-react';

export function StudentDashboard() {
  const upcomingTasks = [
    { id: 1, title: '중간 보고서 제출', deadline: '2024-03-15', status: 'pending' },
    { id: 2, title: '프로토타입 데모', deadline: '2024-03-20', status: 'in-progress' },
    { id: 3, title: '최종 발표 준비', deadline: '2024-04-05', status: 'pending' },
  ];

  const teamProject = {
    name: 'AI 기반 스마트 캠퍼스 플랫폼',
    progress: 65,
    teamMembers: 4,
    lastUpdate: '2024-03-10',
    milestones: {
      completed: 3,
      total: 5
    }
  };

  const recentFeedback = [
    { id: 1, professor: '김교수', content: '제안서의 기술적 접근 방법이 우수합니다. 다만 일정 계획을 더 구체적으로 수정해주세요.', date: '2024-03-08' },
    { id: 2, professor: '이교수', content: '프로토타입 진행 상황이 양호합니다. 사용자 테스트 결과를 추가로 분석해보세요.', date: '2024-03-05' },
  ];

  return (
    <div className="space-y-6">
      {/* 상단 요약 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-semibold">3</p>
                <p className="text-sm text-muted-foreground">진행중인 과제</p>
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
                <p className="text-2xl font-semibold">4</p>
                <p className="text-sm text-muted-foreground">팀원</p>
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
                <p className="text-2xl font-semibold">23</p>
                <p className="text-sm text-muted-foreground">이번 주 커밋</p>
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
                <p className="text-2xl font-semibold">{teamProject.milestones.completed}/{teamProject.milestones.total}</p>
                <p className="text-sm text-muted-foreground">마일스톤</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 팀 프로젝트 현황 */}
        <Card>
          <CardHeader>
            <CardTitle>팀 프로젝트 현황</CardTitle>
            <CardDescription>현재 진행중인 캡스톤 프로젝트</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{teamProject.name}</h3>
                <Badge variant="secondary">{teamProject.progress}% 완료</Badge>
              </div>
              <Progress value={teamProject.progress} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{teamProject.teamMembers}명 팀원</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>최근 업데이트: {teamProject.lastUpdate}</span>
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
              {upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {task.status === 'completed' ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : task.status === 'in-progress' ? (
                      <Clock className="h-4 w-4 text-yellow-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                    <div>
                      <p className="font-medium text-sm">{task.title}</p>
                      <p className="text-xs text-muted-foreground">마감: {task.deadline}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    시작
                  </Button>
                </div>
              ))}
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
              <CardDescription>교수님들의 최신 피드백</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              피드백 요청
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentFeedback.map((feedback) => (
              <div key={feedback.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">{feedback.professor}</Badge>
                  <span className="text-xs text-muted-foreground">{feedback.date}</span>
                </div>
                <p className="text-sm">{feedback.content}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}