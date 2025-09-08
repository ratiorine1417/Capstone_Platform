import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
  Search, 
  Plus, 
  Users, 
  Mail, 
  Crown,
  UserPlus,
  Settings,
  MessageSquare,
  Calendar
} from 'lucide-react';
import { UserRole } from '../../App';

interface TeamManagementProps {
  userRole: UserRole;
}

export function TeamManagement({ userRole }: TeamManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const teams = [
    {
      id: 1,
      name: '팀 Alpha',
      project: 'AI 기반 스마트 캠퍼스 플랫폼',
      description: '인공지능을 활용한 캠퍼스 생활 지원 플랫폼 개발',
      leader: {
        name: '김영희',
        email: 'younghee@university.ac.kr',
        avatar: null
      },
      members: [
        { name: '김영희', email: 'younghee@university.ac.kr', role: 'leader', status: 'active', avatar: null },
        { name: '이철수', email: 'cheolsu@university.ac.kr', role: 'developer', status: 'active', avatar: null },
        { name: '박민정', email: 'minjung@university.ac.kr', role: 'designer', status: 'active', avatar: null },
        { name: '최우진', email: 'woojin@university.ac.kr', role: 'developer', status: 'pending', avatar: null },
      ],
      createdAt: '2024-02-15',
      lastActivity: '2024-03-10',
      stats: {
        commits: 127,
        meetings: 8,
        tasks: { completed: 15, total: 23 }
      }
    },
    {
      id: 2,
      name: '팀 Beta',
      project: '블록체인 기반 투표 시스템',
      description: '투명하고 안전한 온라인 투표 시스템 개발',
      leader: {
        name: '정수민',
        email: 'sumin@university.ac.kr',
        avatar: null
      },
      members: [
        { name: '정수민', email: 'sumin@university.ac.kr', role: 'leader', status: 'active', avatar: null },
        { name: '강다영', email: 'dayoung@university.ac.kr', role: 'developer', status: 'active', avatar: null },
        { name: '윤재혁', email: 'jaehyuk@university.ac.kr', role: 'developer', status: 'active', avatar: null },
      ],
      createdAt: '2024-02-20',
      lastActivity: '2024-03-09',
      stats: {
        commits: 89,
        meetings: 6,
        tasks: { completed: 18, total: 22 }
      }
    }
  ];

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.project.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'leader': return <Badge variant="default">팀장</Badge>;
      case 'developer': return <Badge variant="secondary">개발자</Badge>;
      case 'designer': return <Badge variant="outline">디자이너</Badge>;
      default: return <Badge variant="outline">{role}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge variant="default" className="bg-green-100 text-green-800">활성</Badge>;
      case 'pending': return <Badge variant="outline">대기중</Badge>;
      case 'inactive': return <Badge variant="destructive">비활성</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const renderTeamActions = () => {
    if (userRole === 'student') {
      return (
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <UserPlus className="h-4 w-4 mr-2" />
            멤버 초대
          </Button>
          <Button size="sm" variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            팀 설정
          </Button>
        </div>
      );
    } else if (userRole === 'professor') {
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
      return (
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            관리
          </Button>
        </div>
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">팀 관리</h1>
          <p className="text-muted-foreground">
            {userRole === 'student' ? '팀을 구성하고 협업하세요' : 
             userRole === 'professor' ? '담당 팀들을 관리하고 지도하세요' :
             '전체 팀 현황을 확인하고 관리하세요'}
          </p>
        </div>
        {userRole === 'student' && (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            새 팀 생성
          </Button>
        )}
      </div>

      {/* 검색 */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="팀명 또는 프로젝트명으로 검색..."
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
                    <CardTitle className="text-lg">{team.name}</CardTitle>
                    <Badge variant="outline">{team.members.length}명</Badge>
                  </div>
                  <CardDescription className="text-base font-medium">{team.project}</CardDescription>
                  <p className="text-sm text-muted-foreground mt-1">{team.description}</p>
                </div>
                {renderTeamActions()}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* 팀 리더 */}
                <div>
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Crown className="h-4 w-4 text-yellow-500" />
                    팀장
                  </h3>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Avatar>
                      <AvatarFallback>{team.leader.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{team.leader.name}</p>
                      <p className="text-sm text-muted-foreground">{team.leader.email}</p>
                    </div>
                    <div className="ml-auto">
                      {getRoleBadge('leader')}
                    </div>
                  </div>
                </div>

                {/* 팀원 목록 */}
                <div>
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    팀원 ({team.members.length}명)
                  </h3>
                  <div className="grid gap-3">
                    {team.members.map((member, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                        <Avatar>
                          <AvatarFallback>{member.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getRoleBadge(member.role)}
                          {getStatusBadge(member.status)}
                        </div>
                        {userRole === 'student' && (
                          <Button size="sm" variant="ghost">
                            <Mail className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 팀 활동 통계 */}
                <div>
                  <h3 className="font-medium mb-3">활동 통계</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 border rounded-lg text-center">
                      <p className="text-2xl font-semibold text-chart-1">{team.stats.commits}</p>
                      <p className="text-sm text-muted-foreground">총 커밋</p>
                    </div>
                    <div className="p-3 border rounded-lg text-center">
                      <p className="text-2xl font-semibold text-chart-2">{team.stats.meetings}</p>
                      <p className="text-sm text-muted-foreground">회의 횟수</p>
                    </div>
                    <div className="p-3 border rounded-lg text-center">
                      <p className="text-2xl font-semibold text-chart-3">
                        {team.stats.tasks.completed}/{team.stats.tasks.total}
                      </p>
                      <p className="text-sm text-muted-foreground">완료 작업</p>
                    </div>
                  </div>
                </div>

                {/* 팀 정보 */}
                <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t">
                  <span>생성일: {team.createdAt}</span>
                  <span>최근 활동: {team.lastActivity}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTeams.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">검색 조건에 맞는 팀이 없습니다.</p>
        </div>
      )}
    </div>
  );
}