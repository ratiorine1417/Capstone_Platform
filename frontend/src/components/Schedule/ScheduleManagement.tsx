import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Search,
  FileText,
  Users,
  AlertCircle,
  CheckCircle,
  Video,
  MapPin
} from 'lucide-react';
import { UserRole } from '../../App';

interface ScheduleManagementProps {
  userRole: UserRole;
}

export function ScheduleManagement({ userRole }: ScheduleManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('upcoming');

  const schedules = [
    {
      id: 1,
      title: '중간 보고서 제출 마감',
      type: 'deadline',
      date: '2024-03-15',
      time: '23:59',
      description: 'AI 기반 스마트 캠퍼스 플랫폼 중간 보고서',
      status: 'pending',
      priority: 'high',
      relatedProject: '팀 Alpha',
      location: '온라인 제출'
    },
    {
      id: 2,
      title: '팀 Alpha 중간 발표',
      type: 'presentation',
      date: '2024-03-18',
      time: '14:00',
      description: '프로젝트 진행 상황 발표 및 데모',
      status: 'scheduled',
      priority: 'high',
      relatedProject: '팀 Alpha',
      location: '공학관 201호',
      duration: '30분'
    },
    {
      id: 3,
      title: '팀 회의',
      type: 'meeting',
      date: '2024-03-12',
      time: '19:00',
      description: '주간 진행 상황 점검 및 다음 주 계획',
      status: 'completed',
      priority: 'medium',
      relatedProject: '팀 Alpha',
      location: '학생회관 스터디룸 3',
      duration: '2시간'
    },
    {
      id: 4,
      title: '프로토타입 데모 준비',
      type: 'task',
      date: '2024-03-20',
      time: '10:00',
      description: '최종 발표를 위한 프로토타입 완성',
      status: 'in-progress',
      priority: 'high',
      relatedProject: '팀 Alpha',
      location: '개발실'
    },
    {
      id: 5,
      title: '교수님 면담',
      type: 'meeting',
      date: '2024-03-22',
      time: '15:30',
      description: '프로젝트 진행 상황 점검 및 피드백',
      status: 'scheduled',
      priority: 'medium',
      relatedProject: '팀 Alpha',
      location: '김교수 연구실',
      duration: '30분'
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deadline': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'presentation': return <Video className="h-4 w-4 text-blue-500" />;
      case 'meeting': return <Users className="h-4 w-4 text-green-500" />;
      case 'task': return <FileText className="h-4 w-4 text-purple-500" />;
      default: return <Calendar className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'deadline': return <Badge variant="destructive">마감</Badge>;
      case 'presentation': return <Badge variant="default">발표</Badge>;
      case 'meeting': return <Badge variant="secondary">회의</Badge>;
      case 'task': return <Badge variant="outline">과제</Badge>;
      default: return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge variant="default" className="bg-green-100 text-green-800">완료</Badge>;
      case 'in-progress': return <Badge variant="secondary">진행중</Badge>;
      case 'scheduled': return <Badge variant="outline">예정됨</Badge>;
      case 'pending': return <Badge variant="destructive">대기중</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return <Badge variant="destructive">높음</Badge>;
      case 'medium': return <Badge variant="default">보통</Badge>;
      case 'low': return <Badge variant="secondary">낮음</Badge>;
      default: return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch = schedule.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         schedule.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const today = new Date();
    const scheduleDate = new Date(schedule.date);
    
    if (selectedTab === 'all') return matchesSearch;
    if (selectedTab === 'upcoming') return matchesSearch && scheduleDate >= today;
    if (selectedTab === 'past') return matchesSearch && scheduleDate < today;
    return matchesSearch && schedule.status === selectedTab;
  });

  // 시간순으로 정렬 (가장 빠른 것부터)
  const sortedSchedules = filteredSchedules.sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`);
    const dateB = new Date(`${b.date} ${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return '오늘';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return '내일';
    } else {
      return date.toLocaleDateString('ko-KR', { 
        month: 'long', 
        day: 'numeric',
        weekday: 'short'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">일정 관리</h1>
          <p className="text-muted-foreground">
            {userRole === 'student' ? '내 프로젝트 일정을 확인하고 관리하세요' : 
             userRole === 'professor' ? '수업 및 프로젝트 관련 일정을 관리하세요' :
             '전체 캠퍼스 일정을 관리하세요'}
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          새 일정 추가
        </Button>
      </div>

      {/* 검색 */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="일정 제목이나 내용으로 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* 탭 및 일정 목록 */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="upcoming">다가오는 일정</TabsTrigger>
          <TabsTrigger value="all">전체</TabsTrigger>
          <TabsTrigger value="past">지난 일정</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="mt-6">
          <div className="space-y-4">
            {sortedSchedules.map((schedule) => (
              <Card key={schedule.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getTypeIcon(schedule.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{schedule.title}</h3>
                            {getTypeBadge(schedule.type)}
                            {getStatusBadge(schedule.status)}
                            {getPriorityBadge(schedule.priority)}
                          </div>
                          <p className="text-sm text-muted-foreground">{schedule.description}</p>
                          {schedule.relatedProject && (
                            <p className="text-sm text-muted-foreground">
                              관련 프로젝트: {schedule.relatedProject}
                            </p>
                          )}
                        </div>
                        
                        <div className="text-right text-sm">
                          <div className="flex items-center gap-1 text-muted-foreground mb-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(schedule.date)}</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{schedule.time}</span>
                            {schedule.duration && <span>({schedule.duration})</span>}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{schedule.location}</span>
                        </div>
                        
                        <div className="flex gap-2">
                          {schedule.status === 'scheduled' && (
                            <Button size="sm" variant="outline">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              완료 표시
                            </Button>
                          )}
                          <Button size="sm" variant="outline">편집</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {sortedSchedules.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {selectedTab === 'upcoming' ? '다가오는 일정이 없습니다.' :
                 selectedTab === 'past' ? '지난 일정이 없습니다.' :
                 '검색 조건에 맞는 일정이 없습니다.'}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}