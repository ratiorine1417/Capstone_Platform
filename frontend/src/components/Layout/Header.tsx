import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string | null;
}

interface HeaderProps {
  user: User;
}

export function Header({ user }: HeaderProps) {
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'professor': return 'default';
      case 'student': return 'secondary';
      default: return 'outline';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return '관리자';
      case 'professor': return '교수';
      case 'student': return '학생';
      default: return role;
    }
  };

  return (
    <header className="h-16 border-b bg-background px-6 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="프로젝트, 팀, 과제 검색..."
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full text-xs flex items-center justify-center text-destructive-foreground">
            3
          </span>
        </Button>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">{user.name}</p>
              <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs">
                {getRoleLabel(user.role)}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
          <Avatar>
            <AvatarImage src={user.avatar || undefined} />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}