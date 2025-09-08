import React, { useState } from 'react';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { StudentDashboard } from './components/Dashboard/StudentDashboard';
import { ProfessorDashboard } from './components/Dashboard/ProfessorDashboard';
import { AdminDashboard } from './components/Dashboard/AdminDashboard';
import { ProjectManagement } from './components/Projects/ProjectManagement';
import { TeamManagement } from './components/Teams/TeamManagement';
import { EvaluationSystem } from './components/Evaluation/EvaluationSystem';
import { UserManagement } from './components/Admin/UserManagement';
import { ScheduleManagement } from './components/Schedule/ScheduleManagement';
import LoginDemo from './pages/LoginDemo';

export type UserRole = 'student' | 'professor' | 'admin';
export type ActivePage = 'dashboard' | 'projects' | 'teams' | 'evaluation' | 'users' | 'schedule' | 'settings' | 'login-demo';

export default function App() {
  const [currentUser] = useState({
    id: '1',
    name: '김영희',
    email: 'kim@university.ac.kr',
    role: 'student' as UserRole,
    avatar: null
  });

  const [activePage, setActivePage] = useState<ActivePage>('login-demo');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderMainContent = () => {
    switch (activePage) {
      case 'dashboard':
        if (currentUser.role === 'student') return <StudentDashboard />;
        if (currentUser.role === 'professor') return <ProfessorDashboard />;
        if (currentUser.role === 'admin') return <AdminDashboard />;
        break;
      case 'projects':
        return <ProjectManagement userRole={currentUser.role} />;
      case 'teams':
        return <TeamManagement userRole={currentUser.role} />;
      case 'evaluation':
        return <EvaluationSystem userRole={currentUser.role} />;
      case 'users':
        return currentUser.role === 'admin' ? <UserManagement /> : <div>권한이 없습니다.</div>;
      case 'schedule':
        return <ScheduleManagement userRole={currentUser.role} />;
      case 'login-demo':
        return <LoginDemo />;
      default:
        return <div>페이지를 찾을 수 없습니다.</div>;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        userRole={currentUser.role} 
        activePage={activePage} 
        onPageChange={setActivePage}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={currentUser} />
        <main className="flex-1 overflow-auto p-6">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
}