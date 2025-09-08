import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Calendar } from '../ui/calendar';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Clock,
  Plus,
  AlertCircle,
  Video,
  Users,
  FileText
} from 'lucide-react';

interface CalendarWidgetProps {
  className?: string;
}

interface ScheduleEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  type: 'deadline' | 'presentation' | 'meeting' | 'task';
  priority: 'high' | 'medium' | 'low';
  description?: string;
}

export function CalendarWidget({ className }: CalendarWidgetProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');

  // 현재 날짜 기준으로 현실적인 일정 데이터 생성
  const today = new Date();
  const scheduleEvents: ScheduleEvent[] = [
    {
      id: 1,
      title: '중간 보고서 제출',
      date: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5일 후
      time: '23:59',
      type: 'deadline',
      priority: 'high',
      description: 'AI 기반 스마트 캠퍼스 플랫폼 중간 보고서 제출'
    },
    {
      id: 2,
      title: '팀 Alpha 발표',
      date: new Date(today.getTime() + 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 8일 후
      time: '14:00',
      type: 'presentation',
      priority: 'high',
      description: '중간 발표 및 데모'
    },
    {
      id: 3,
      title: '팀 회의',
      date: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2일 후
      time: '19:00',
      type: 'meeting',
      priority: 'medium',
      description: '주간 진행 상황 점검'
    },
    {
      id: 4,
      title: '교수님 면담',
      date: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 10일 후
      time: '15:30',
      type: 'meeting',
      priority: 'medium',
      description: '프로젝트 진행 상황 점검'
    },
    {
      id: 5,
      title: '프로토타입 완성',
      date: new Date(today.getTime() + 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 12일 후
      time: '18:00',
      type: 'task',
      priority: 'high',
      description: '최종 발표용 프로토타입 완성'
    },
    {
      id: 6,
      title: '오늘의 팀 미팅',
      date: today.toISOString().split('T')[0], // 오늘
      time: '16:00',
      type: 'meeting',
      priority: 'medium',
      description: '오늘 예정된 팀 미팅'
    },
    {
      id: 7,
      title: '내일 데모 준비',
      date: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 내일
      time: '10:00',
      type: 'task',
      priority: 'high',
      description: '내일 예정된 데모 준비'
    }
  ];

  // 선택된 날짜의 일정들
  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return scheduleEvents.filter(event => event.date === dateString);
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  // 일정이 있는 날짜들 표시
  const hasEventDates = scheduleEvents.map(event => new Date(event.date));

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deadline': return <AlertCircle className="h-3 w-3 text-red-500" />;
      case 'presentation': return <Video className="h-3 w-3 text-blue-500" />;
      case 'meeting': return <Users className="h-3 w-3 text-green-500" />;
      case 'task': return <FileText className="h-3 w-3 text-purple-500" />;
      default: return <CalendarIcon className="h-3 w-3 text-gray-500" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'deadline': return <Badge variant="destructive" className="text-xs">마감</Badge>;
      case 'presentation': return <Badge variant="default" className="text-xs">발표</Badge>;
      case 'meeting': return <Badge variant="secondary" className="text-xs">회의</Badge>;
      case 'task': return <Badge variant="outline" className="text-xs">과제</Badge>;
      default: return <Badge variant="outline" className="text-xs">{type}</Badge>;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-300';
    }
  };

  const formatSelectedDate = () => {
    if (!selectedDate) return '';
    return selectedDate.toLocaleDateString('ko-KR', { 
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 ${className}`}>
      {/* 캘린더 */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                일정 캘린더
              </CardTitle>
              <CardDescription>프로젝트 관련 일정을 확인하세요</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'month' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('month')}
              >
                월간
              </Button>
              <Button
                variant={viewMode === 'week' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('week')}
              >
                주간
              </Button>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                일정 추가
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border w-full"
            modifiers={{
              hasEvent: hasEventDates,
            }}
            modifiersStyles={{
              hasEvent: { 
                backgroundColor: 'var(--color-primary)', 
                color: 'white',
                fontWeight: 'bold'
              }
            }}
          />
        </CardContent>
      </Card>

      {/* 선택된 날짜의 일정 상세 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {selectedDate ? formatSelectedDate() : '날짜를 선택하세요'}
          </CardTitle>
          <CardDescription>
            {selectedDateEvents.length > 0 
              ? `${selectedDateEvents.length}개의 일정`
              : '일정이 없습니다'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {selectedDateEvents.length > 0 ? (
              selectedDateEvents.map((event) => (
                <div
                  key={event.id}
                  className={`p-3 border-l-4 bg-muted/30 rounded-r-md ${getPriorityColor(event.priority)}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(event.type)}
                      <span className="font-medium text-sm">{event.title}</span>
                    </div>
                    {getTypeBadge(event.type)}
                  </div>
                  
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                    <Clock className="h-3 w-3" />
                    <span>{event.time}</span>
                  </div>
                  
                  {event.description && (
                    <p className="text-xs text-muted-foreground">{event.description}</p>
                  )}
                  
                  <div className="flex justify-end mt-2">
                    <Button size="sm" variant="outline" className="text-xs h-6">
                      상세보기
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <CalendarIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  {selectedDate 
                    ? '이 날에는 일정이 없습니다.' 
                    : '날짜를 선택해 일정을 확인하세요.'
                  }
                </p>
                <Button size="sm" variant="outline" className="mt-2">
                  <Plus className="h-3 w-3 mr-1" />
                  일정 추가
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}