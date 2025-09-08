import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
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
  MessageSquare
} from 'lucide-react';
import { UserRole } from '../../App';

interface ProjectManagementProps {
  userRole: UserRole;
}

export function ProjectManagement({ userRole }: ProjectManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');

  const projects = [
    {
      id: 1,
      name: 'AI 기반 스마트 캠퍼스 플랫폼',
      team: '팀 Alpha',
      description: '인공지능을 활용한 캠퍼스 생활 지원 플랫폼',
      status: 'in-progress',
      progress: 65,
      lastUpdate: '2024-03-10',
      members: ['김영희', '이철수', '박민정', '최우진'],
      milestones: {
        completed: 3,
        total: 5
      },
      nextDeadline: {
        task: '중간 보고서',
        date: '2024-03-15'
      }
    },
    {
      id: 2,
      name: '블록체인 기반 투표 시스템',
      team: '팀 Beta',
      description: '투명하고 안전한 온라인 투표 시스템',
      status: 'review',
      progress: 80,
      lastUpdate: '2024-03-09',
      members: ['정수민', '강다영', '윤재혁'],
      milestones: {
        completed: 4,
        total: 5
      },
      nextDeadline: {
        task: '최종 발표',
        date: '2024-03-25'
      }
    },
    {
      id: 3,
      name: 'IoT 환경 모니터링 시스템',
      team: '팀 Gamma',
      description: '실시간 환경 데이터 수집 및 분석 시스템',
      status: 'completed',
      progress: 100,
      lastUpdate: '2024-03-08',
      members: ['송지현', '임태준', '조예린', '한승우'],
      milestones: {
        completed: 5,
        total: 5
      },
      nextDeadline: null
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge variant="default" className="bg-green-100 text-green-800">완료</Badge>;
      case 'in-progress': return <Badge variant="secondary">진행중</Badge>;
      case 'review': return <Badge variant="outline">검토중</Badge>;
      case 'planning': return <Badge variant="destructive">계획중</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.team.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedTab === 'all') return matchesSearch;
    return matchesSearch && project.status === selectedTab;
  });

  const renderProjectActions = (project: any) => {
    if (userRole === 'student') {
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
    } else if (userRole === 'professor') {
      return (
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            검토
          </Button>
          <Button size="sm" variant="outline">
            <MessageSquare className="h-4 w-4 mr-2" />
            피드백
          </Button>
        </div>
      );
    } else {
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

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">프로젝트 관리</h1>
          <p className="text-muted-foreground">
            {userRole === 'student' ? '참여중인 프로젝트를 관리하세요' : 
             userRole === 'professor' ? '담당 프로젝트들을 관리하고 평가하세요' :
             '전체 프로젝트 현황을 확인하고 관리하세요'}
          </p>
        </div>
        {userRole === 'student' && (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            새 프로젝트
          </Button>
        )}
      </div>

      {/* 검색 및 필터 */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="프로젝트명 또는 팀명으로 검색..."
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

      {/* 탭 및 프로젝트 목록 */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="all">전체</TabsTrigger>
          <TabsTrigger value="in-progress">진행중</TabsTrigger>
          <TabsTrigger value="review">검토중</TabsTrigger>
          <TabsTrigger value="completed">완료</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="mt-6">
          <div className="grid gap-6">
            {filteredProjects.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        {getStatusBadge(project.status)}
                      </div>
                      <CardDescription className="text-base">{project.description}</CardDescription>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{project.team}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>최근 업데이트: {project.lastUpdate}</span>
                        </div>
                      </div>
                    </div>
                    {renderProjectActions(project)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* 진행률 */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">프로젝트 진행률</span>
                        <span className="text-sm text-muted-foreground">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>

                    {/* 팀원 및 마일스톤 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium mb-2">팀원</p>
                        <div className="flex flex-wrap gap-1">
                          {project.members.map((member, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {member}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-2">마일스톤</p>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{project.milestones.completed}/{project.milestones.total} 완료</span>
                          {project.nextDeadline && (
                            <Badge variant="outline" className="text-xs">
                              다음: {project.nextDeadline.task} ({project.nextDeadline.date})
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">검색 조건에 맞는 프로젝트가 없습니다.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}