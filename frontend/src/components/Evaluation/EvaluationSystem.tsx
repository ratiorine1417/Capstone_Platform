import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { Slider } from '../ui/slider';
import { 
  Star, 
  FileText, 
  Clock, 
  CheckCircle,
  MessageSquare,
  Download,
  Plus,
  Eye
} from 'lucide-react';
import { UserRole } from '../../App';

interface EvaluationSystemProps {
  userRole: UserRole;
}

export function EvaluationSystem({ userRole }: EvaluationSystemProps) {
  const [selectedTab, setSelectedTab] = useState('pending');
  const [feedbackText, setFeedbackText] = useState('');

  const evaluations = [
    {
      id: 1,
      team: '팀 Alpha',
      project: 'AI 기반 스마트 캠퍼스 플랫폼',
      type: '중간발표',
      submittedAt: '2024-03-10 14:30',
      dueDate: '2024-03-15',
      status: 'pending',
      rubric: {
        technical: { score: 0, max: 25, description: '기술적 구현도' },
        innovation: { score: 0, max: 25, description: '창의성 및 혁신성' },
        presentation: { score: 0, max: 25, description: '발표 및 의사소통' },
        teamwork: { score: 0, max: 25, description: '팀워크 및 협업' }
      }
    },
    {
      id: 2,
      team: '팀 Beta',
      project: '블록체인 기반 투표 시스템',
      type: '프로토타입',
      submittedAt: '2024-03-09 16:20',
      dueDate: '2024-03-14',
      status: 'in-review',
      rubric: {
        technical: { score: 22, max: 25, description: '기술적 구현도' },
        innovation: { score: 20, max: 25, description: '창의성 및 혁신성' },
        presentation: { score: 0, max: 25, description: '발표 및 의사소통' },
        teamwork: { score: 0, max: 25, description: '팀워크 및 협업' }
      }
    },
    {
      id: 3,
      team: '팀 Gamma',
      project: 'IoT 환경 모니터링 시스템',
      type: '최종 보고서',
      submittedAt: '2024-03-08 11:45',
      dueDate: '2024-03-12',
      status: 'completed',
      rubric: {
        technical: { score: 23, max: 25, description: '기술적 구현도' },
        innovation: { score: 21, max: 25, description: '창의성 및 혁신성' },
        presentation: { score: 24, max: 25, description: '발표 및 의사소통' },
        teamwork: { score: 22, max: 25, description: '팀워크 및 협업' }
      },
      feedback: '전반적으로 우수한 프로젝트입니다. 기술적 구현이 탄탄하고 발표도 명확했습니다.',
      finalScore: 90
    }
  ];

  const rubricTemplates = [
    {
      id: 1,
      name: '캡스톤 디자인 기본 루브릭',
      description: '표준 캡스톤 프로젝트 평가 기준',
      categories: [
        { name: '기술적 구현도', weight: 30, description: '프로젝트의 기술적 완성도' },
        { name: '창의성 및 혁신성', weight: 25, description: '아이디어의 참신함과 독창성' },
        { name: '발표 및 의사소통', weight: 25, description: '발표 능력과 의사소통 능력' },
        { name: '팀워크 및 협업', weight: 20, description: '팀 협업 능력과 기여도' }
      ]
    },
    {
      id: 2,
      name: '중간 평가 루브릭',
      description: '중간 발표 및 진행 상황 평가용',
      categories: [
        { name: '진행 상황', weight: 40, description: '프로젝트 진행 정도' },
        { name: '계획 충실도', weight: 30, description: '초기 계획 대비 진행 상황' },
        { name: '발표 능력', weight: 30, description: '중간 발표 능력' }
      ]
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="outline">평가 대기</Badge>;
      case 'in-review': return <Badge variant="secondary">평가 중</Badge>;
      case 'completed': return <Badge variant="default" className="bg-green-100 text-green-800">평가 완료</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredEvaluations = evaluations.filter(evaluation => {
    if (selectedTab === 'all') return true;
    return evaluation.status === selectedTab;
  });

  const getTotalScore = (rubric: any) => {
    return Object.values(rubric).reduce((total: number, item: any) => total + item.score, 0);
  };

  const getMaxScore = (rubric: any) => {
    return Object.values(rubric).reduce((total: number, item: any) => total + item.max, 0);
  };

  if (userRole === 'student') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">평가 현황</h1>
          <p className="text-muted-foreground">프로젝트 평가 결과를 확인하세요</p>
        </div>

        <div className="grid gap-6">
          {evaluations.map((evaluation) => (
            <Card key={evaluation.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-3">
                      {evaluation.project}
                      {getStatusBadge(evaluation.status)}
                    </CardTitle>
                    <CardDescription>
                      {evaluation.type} • 제출일: {evaluation.submittedAt}
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    상세보기
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {evaluation.status === 'completed' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">최종 점수</p>
                        <p className="text-sm text-muted-foreground">100점 만점</p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-primary">{evaluation.finalScore}</p>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < Math.floor(evaluation.finalScore / 20) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">세부 평가</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(evaluation.rubric).map(([key, item]: [string, any]) => (
                          <div key={key} className="p-3 border rounded">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium">{item.description}</span>
                              <span className="text-sm text-muted-foreground">{item.score}/{item.max}</span>
                            </div>
                            <Progress value={(item.score / item.max) * 100} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {evaluation.feedback && (
                      <div>
                        <h3 className="font-medium mb-2">교수님 피드백</h3>
                        <div className="p-4 bg-muted rounded-lg">
                          <p className="text-sm">{evaluation.feedback}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {evaluation.status !== 'completed' && (
                  <div className="text-center py-8">
                    <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">평가가 진행중입니다</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">평가 관리</h1>
          <p className="text-muted-foreground">
            {userRole === 'professor' ? '학생 프로젝트를 평가하고 피드백을 제공하세요' : '평가 시스템을 관리하세요'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            평가 내보내기
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            새 루브릭
          </Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="pending">평가 대기</TabsTrigger>
          <TabsTrigger value="in-review">평가 중</TabsTrigger>
          <TabsTrigger value="completed">평가 완료</TabsTrigger>
          <TabsTrigger value="rubrics">루브릭 관리</TabsTrigger>
        </TabsList>

        <TabsContent value="rubrics" className="mt-6">
          <div className="grid gap-4">
            {rubricTemplates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">편집</Button>
                      <Button variant="outline" size="sm">복사</Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {template.categories.map((category, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">{category.name}</p>
                          <p className="text-sm text-muted-foreground">{category.description}</p>
                        </div>
                        <Badge variant="outline">{category.weight}%</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value={selectedTab} className="mt-6">
          <div className="grid gap-6">
            {filteredEvaluations.map((evaluation) => (
              <Card key={evaluation.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-3">
                        {evaluation.team} - {evaluation.project}
                        {getStatusBadge(evaluation.status)}
                      </CardTitle>
                      <CardDescription>
                        {evaluation.type} • 제출: {evaluation.submittedAt} • 마감: {evaluation.dueDate}
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      제출물 보기
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* 루브릭 평가 */}
                    <div>
                      <h3 className="font-medium mb-4">평가 기준</h3>
                      <div className="grid gap-4">
                        {Object.entries(evaluation.rubric).map(([key, item]: [string, any]) => (
                          <div key={key} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{item.description}</span>
                              <span className="text-sm text-muted-foreground">{item.score}/{item.max}점</span>
                            </div>
                            {evaluation.status !== 'completed' && (
                              <Slider
                                value={[item.score]}
                                max={item.max}
                                step={1}
                                className="w-full"
                              />
                            )}
                            {evaluation.status === 'completed' && (
                              <Progress value={(item.score / item.max) * 100} className="h-2" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 총점 */}
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">총점</span>
                        <span className="text-xl font-bold">
                          {getTotalScore(evaluation.rubric)}/{getMaxScore(evaluation.rubric)}점
                        </span>
                      </div>
                    </div>

                    {/* 피드백 */}
                    <div>
                      <h3 className="font-medium mb-2">피드백</h3>
                      {evaluation.status === 'completed' ? (
                        <div className="p-4 border rounded-lg">
                          <p className="text-sm">{evaluation.feedback || '피드백이 없습니다.'}</p>
                        </div>
                      ) : (
                        <Textarea
                          placeholder="학생들에게 전달할 피드백을 작성하세요..."
                          value={feedbackText}
                          onChange={(e) => setFeedbackText(e.target.value)}
                          rows={4}
                        />
                      )}
                    </div>

                    {/* 평가 완료 버튼 */}
                    {evaluation.status !== 'completed' && (
                      <div className="flex gap-2">
                        <Button>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          평가 완료
                        </Button>
                        <Button variant="outline">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          임시 저장
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredEvaluations.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">해당 상태의 평가가 없습니다.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}