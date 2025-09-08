import React, { useState } from 'react';
import { 
  Home, 
  FolderOpen, 
  Users, 
  ClipboardCheck, 
  Settings, 
  UserCog,
  BookOpen,
  Calendar,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { UserRole, ActivePage } from '../../App';

interface SidebarProps {
  userRole: UserRole;
  activePage: ActivePage;
  onPageChange: (page: ActivePage) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ userRole, activePage, onPageChange, collapsed, onToggleCollapse }: SidebarProps) {
  const [showScheduleDropdown, setShowScheduleDropdown] = useState(false);
  const getMenuItems = () => {
    const commonItems = [
      { id: 'dashboard' as ActivePage, label: '대시보드', icon: Home },
      { id: 'projects' as ActivePage, label: '프로젝트', icon: FolderOpen },
    ];

    const studentItems = [
      ...commonItems,
      { id: 'teams' as ActivePage, label: '팀 관리', icon: Users },
    ];

    const professorItems = [
      ...commonItems,
      { id: 'evaluation' as ActivePage, label: '평가 관리', icon: ClipboardCheck },
      { id: 'teams' as ActivePage, label: '팀 관리', icon: Users },
    ];

    const adminItems = [
      ...commonItems,
      { id: 'users' as ActivePage, label: '사용자 관리', icon: UserCog },
      { id: 'evaluation' as ActivePage, label: '평가 시스템', icon: ClipboardCheck },
    ];

    switch (userRole) {
      case 'student': return studentItems;
      case 'professor': return professorItems;
      case 'admin': return adminItems;
      default: return commonItems;
    }
  };

  const menuItems = getMenuItems();

  // 현재 사용자의 일정 데이터 (실제 구현에서는 props나 context로 받아올 데이터)
  const upcomingSchedules = [
    {
      id: 1,
      title: '중간 보고서 제출',
      date: '2024-03-15',
      time: '23:59',
      type: 'deadline',
      priority: 'high'
    },
    {
      id: 2,
      title: '팀 Alpha 발표',
      date: '2024-03-18',
      time: '14:00',
      type: 'presentation',
      priority: 'high'
    },
    {
      id: 3,
      title: '교수님 면담',
      date: '2024-03-22',
      time: '15:30',
      type: 'meeting',
      priority: 'medium'
    }
  ];

  const formatScheduleDate = (dateString: string) => {
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
        month: 'numeric', 
        day: 'numeric'
      });
    }
  };

  return (
    <div className={`${collapsed ? 'w-16' : 'w-64'} bg-sidebar border-r border-sidebar-border transition-all duration-300 relative`}>
      {/* 접기/펼치기 버튼 */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleCollapse}
        className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full border bg-sidebar shadow-md hover:bg-sidebar-accent"
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>

      <div className={`${collapsed ? 'p-2' : 'p-6'} transition-all duration-300`}>
        <div className={`flex items-center gap-2 mb-8 ${collapsed ? 'justify-center' : ''}`}>
          <BookOpen className="h-8 w-8 text-primary flex-shrink-0" />
          {!collapsed && (
            <div>
              <h1 className="text-xl font-semibold">캡스톤 플랫폼</h1>
              <p className="text-sm text-muted-foreground">프로젝트 관리</p>
            </div>
          )}
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activePage === item.id ? "secondary" : "ghost"}
                className={`w-full ${collapsed ? 'justify-center px-2' : 'justify-start gap-3'}`}
                onClick={() => onPageChange(item.id)}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {!collapsed && item.label}
              </Button>
            );
          })}
        </nav>

        <div className="mt-8 pt-8 border-t border-sidebar-border">
          <div className="space-y-2">
            <div>
              <Button
                variant={activePage === 'schedule' ? "secondary" : "ghost"}
                className={`w-full ${collapsed ? 'justify-center px-2' : 'justify-start gap-3'}`}
                onClick={() => {
                  onPageChange('schedule');
                  if (!collapsed) {
                    setShowScheduleDropdown(!showScheduleDropdown);
                  }
                }}
                title={collapsed ? '일정 관리' : undefined}
              >
                <Calendar className="h-4 w-4 flex-shrink-0" />
                {!collapsed && '일정 관리'}
              </Button>
              
              {/* 일정 드롭다운 */}
              {!collapsed && showScheduleDropdown && (
                <div className="mt-2 ml-4 space-y-1 border-l border-sidebar-border pl-4">
                  <div className="text-xs font-medium text-muted-foreground mb-2">다가오는 일정</div>
                  {upcomingSchedules.slice(0, 3).map((schedule) => (
                    <div key={schedule.id} className="p-2 rounded-md hover:bg-sidebar-accent cursor-pointer">
                      <div className="flex items-center gap-2 mb-1">
                        {schedule.type === 'deadline' && <AlertCircle className="h-3 w-3 text-red-500" />}
                        {schedule.type === 'presentation' && <Calendar className="h-3 w-3 text-blue-500" />}
                        {schedule.type === 'meeting' && <Users className="h-3 w-3 text-green-500" />}
                        <span className="text-xs font-medium truncate">{schedule.title}</span>
                        {schedule.priority === 'high' && (
                          <Badge variant="destructive" className="text-xs h-4 px-1">!</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{formatScheduleDate(schedule.date)} {schedule.time}</span>
                      </div>
                    </div>
                  ))}
                  {upcomingSchedules.length > 3 && (
                    <div className="text-xs text-muted-foreground text-center pt-1">
                      +{upcomingSchedules.length - 3}개 더
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <Button
              variant="ghost"
              className={`w-full ${collapsed ? 'justify-center px-2' : 'justify-start gap-3'}`}
              title={collapsed ? '공지사항' : undefined}
            >
              <MessageSquare className="h-4 w-4 flex-shrink-0" />
              {!collapsed && '공지사항'}
            </Button>
            <Button
              variant="ghost"
              className={`w-full ${collapsed ? 'justify-center px-2' : 'justify-start gap-3'}`}
              title={collapsed ? '설정' : undefined}
            >
              <Settings className="h-4 w-4 flex-shrink-0" />
              {!collapsed && '설정'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}