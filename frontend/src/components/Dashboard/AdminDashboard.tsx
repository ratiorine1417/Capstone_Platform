import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { CalendarWidget } from './CalendarWidget';
import { 
  Users, 
  BookOpen, 
  Database, 
  Activity, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Settings,
  Download
} from 'lucide-react';

export function AdminDashboard() {
  const systemStats = {
    totalUsers: 324,
    activeCourses: 8,
    totalProjects: 48,
    systemUptime: 99.9
  };

  const courseOverview = [
    { id: 1, name: '컴퓨터공학과 캡스톤디자인', professor: '김교수', teams: 12, students: 48, progress: 75 },
    { id: 2, name: '소프트웨어학과 졸업프로젝트', professor: '이교수', teams: 10, students: 40, progress: 82 },
    { id: 3, name: '정보통신학과 캡스톤', professor: '박교수', teams: 8, students: 32, progress: 68 },
  ];

  const recentActivities = [
    { id: 1, type: 'user_registration', user: '홍길동 (학생)', action: '신규 계정 생성', time: '10분 전', status: 'success' },
    { id: 2, type: 'course_creation', user: '김교수', action: '새 강좌 개설', time: '1시간 전', status: 'success' },
    { id: 3, type: 'system_backup', user: '시스템', action: '데이터 백업 완료', time: '2시간 전', status: 'success' },
    { id: 4, type: 'error', user: '시스템', action: '로그인 오류 발생', time: '3시간 전', status: 'error' },
  ];

  const systemHealth = [
    { component: '데이터베이스', status: 'healthy', uptime: 99.9 },
    { component: '웹 서버', status: 'healthy', uptime: 99.8 },
    { component: '파일 스토리지', status: 'warning', uptime: 98.5 },
    { component: 'GitHub 연동', status: 'healthy', uptime: 99.7 },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_registration': return <Users className="h-4 w-4 text-blue-500" />;
      case 'course_creation': return <BookOpen className="h-4 w-4 text-green-500" />;
      case 'system_backup': return <Database className="h-4 w-4 text-purple-500" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy': return <Badge variant="default" className="bg-green-100 text-green-800">정상</Badge>;
      case 'warning': return <Badge variant="destructive" className="bg-yellow-100 text-yellow-800">주의</Badge>;
      case 'error': return <Badge variant="destructive">오류</Badge>;
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
                <p className="text-2xl font-semibold">{systemStats.activeCourses}</p>
                <p className="text-sm text-muted-foreground">활성 강좌</p>
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
                <p className="text-2xl font-semibold">{systemStats.totalProjects}</p>
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
                <p className="text-2xl font-semibold">{systemStats.systemUptime}%</p>
                <p className="text-sm text-muted-foreground">시스템 가용성</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 강좌 현황 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>강좌 현황</CardTitle>
                <CardDescription>진행중인 모든 강좌의 현황</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                관리
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {courseOverview.map((course) => (
                <div key={course.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{course.name}</h3>
                    <Badge variant="secondary">{course.progress}%</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">담당: {course.professor}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span>{course.teams}개 팀 • {course.students}명 학생</span>
                    <Progress value={course.progress} className="w-24 h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 최근 활동 */}
        <Card>
          <CardHeader>
            <CardTitle>최근 시스템 활동</CardTitle>
            <CardDescription>최근 시스템에서 발생한 활동들</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  {getActivityIcon(activity.type)}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.user} • {activity.time}</p>
                  </div>
                  {activity.status === 'success' ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
              ))}
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
              <CardDescription>각 시스템 컴포넌트의 현재 상태</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              보고서 다운로드
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {systemHealth.map((component, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{component.component}</p>
                  <p className="text-sm text-muted-foreground">가동률: {component.uptime}%</p>
                </div>
                <div className="text-right">
                  {getStatusBadge(component.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}