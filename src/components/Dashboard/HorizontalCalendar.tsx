import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Plus,
  AlertCircle,
  Video,
  Users,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface HorizontalCalendarProps {
  className?: string;
}

interface ScheduleEvent {
  id: number;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  type: "deadline" | "presentation" | "meeting" | "task";
  priority: "high" | "medium" | "low";
  description?: string;
}

const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

function toYMD(d: Date) {
  return d.toISOString().split("T")[0];
}

function monthLabel(d: Date) {
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월`;
}

function weekLabel(start: Date) {
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const sameMonth = start.getMonth() === end.getMonth();
  const startPart = `${start.getFullYear()}년 ${start.getMonth() + 1}월 ${
    start.getDate()
  }일`;
  const endPart = `${sameMonth ? "" : `${end.getMonth() + 1}월 `}${
    end.getDate()
  }일`;
  return `${startPart} - ${endPart}`;
}

export function HorizontalCalendar({ className }: HorizontalCalendarProps) {
  const [currentOffset, setCurrentOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState(false); // false: 주간, true: 월간

  // 예시 일정 데이터 (오늘 기준)
  const today = new Date();
  const scheduleEvents: ScheduleEvent[] = [
    {
      id: 1,
      title: "중간 보고서 제출",
      date: toYMD(new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000)),
      time: "23:59",
      type: "deadline",
      priority: "high",
      description: "AI 기반 스마트 캠퍼스 플랫폼 중간 보고서 제출",
    },
    {
      id: 2,
      title: "팀 Alpha 발표",
      date: toYMD(new Date(today.getTime() + 8 * 24 * 60 * 60 * 1000)),
      time: "14:00",
      type: "presentation",
      priority: "high",
      description: "중간 발표 리허설",
    },
    {
      id: 3,
      title: "팀 미팅",
      date: toYMD(new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000)),
      time: "19:00",
      type: "meeting",
      priority: "medium",
      description: "진행 상황 공유",
    },
    {
      id: 4,
      title: "멘토링 미팅",
      date: toYMD(new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000)),
      time: "15:30",
      type: "meeting",
      priority: "medium",
      description: "멘토와 진행 점검",
    },
    {
      id: 5,
      title: "발표 슬라이드 완성",
      date: toYMD(new Date(today.getTime() + 12 * 24 * 60 * 60 * 1000)),
      time: "18:00",
      type: "task",
      priority: "high",
      description: "최종 발표용 슬라이드 완성",
    },
    {
      id: 6,
      title: "개발 계획 정리",
      date: toYMD(today),
      time: "16:00",
      type: "meeting",
      priority: "medium",
      description: "개발 일정/역할 정리",
    },
    {
      id: 7,
      title: "다음 주 작업 계획",
      date: toYMD(new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000)),
      time: "10:00",
      type: "task",
      priority: "high",
      description: "다음 주 주요 작업 계획 수립",
    },
  ];

  // 주 시작(일요일) 계산
  const getStartOfWeek = (date: Date, weekOffset: number = 0) => {
    const start = new Date(date);
    const day = start.getDay(); // 0:일 ~ 6:토
    start.setDate(start.getDate() - day + weekOffset * 7);
    start.setHours(0, 0, 0, 0);
    return start;
  };

  // 해당 주 7일
  const getCurrentWeekDays = () => {
    const startOfWeek = getStartOfWeek(today, currentOffset);
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      days.push(date);
    }
    return days;
  };

  // 월 시작(1일) 계산
  const getStartOfMonth = (date: Date, monthOffset: number = 0) => {
    const start = new Date(date.getFullYear(), date.getMonth() + monthOffset, 1);
    start.setHours(0, 0, 0, 0);
    return start;
  };

  // 월 달력(6행 x 7열 = 42칸) 생성
  const getCurrentMonthDays = () => {
    const startOfMonth = getStartOfMonth(today, currentOffset);
    const endOfMonth = new Date(
      startOfMonth.getFullYear(),
      startOfMonth.getMonth() + 1,
      0
    );

    const startDay = startOfMonth.getDay(); // 0:일
    const days: Date[] = [];

    // 이전 달 말일 채우기
    for (let i = startDay - 1; i >= 0; i--) {
      const prev = new Date(startOfMonth);
      prev.setDate(prev.getDate() - (i + 1));
      days.push(prev);
    }

    // 이번 달
    for (let d = 1; d <= endOfMonth.getDate(); d++) {
      days.push(new Date(startOfMonth.getFullYear(), startOfMonth.getMonth(), d));
    }

    // 다음 달 앞부분 채우기 (총 42칸)
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const next = new Date(endOfMonth);
      next.setDate(endOfMonth.getDate() + i);
      days.push(next);
    }

    return days;
  };

  const weekDays = getCurrentWeekDays();
  const monthDays = getCurrentMonthDays();
  const displayDays = isExpanded ? monthDays : weekDays;
  const currentReferenceDate = isExpanded
    ? getStartOfMonth(today, currentOffset)
    : getStartOfWeek(today, currentOffset);

  const getEventsForDate = (date: Date) => {
    const ymd = toYMD(date);
    return scheduleEvents.filter((e) => e.date === ymd);
  };

  const selectedDateEvents = selectedDate
    ? getEventsForDate(new Date(selectedDate))
    : [];

  const getTypeIcon = (type: ScheduleEvent["type"], className = "h-3 w-3") => {
    switch (type) {
      case "deadline":
        return <AlertCircle className={`${className} text-red-500`} />;
      case "presentation":
        return <Video className={`${className} text-blue-500`} />;
      case "meeting":
        return <Users className={`${className} text-green-500`} />;
      case "task":
        return <FileText className={`${className} text-purple-500`} />;
      default:
        return <CalendarIcon className={`${className} text-gray-500`} />;
    }
  };

  const getTypeBadge = (type: ScheduleEvent["type"]) => {
    switch (type) {
      case "deadline":
        return (
          <Badge variant="destructive" className="text-xs">
            마감
          </Badge>
        );
      case "presentation":
        return (
          <Badge variant="default" className="text-xs">
            발표
          </Badge>
        );
      case "meeting":
        return (
          <Badge variant="secondary" className="text-xs">
            회의
          </Badge>
        );
      case "task":
        return (
          <Badge variant="outline" className="text-xs">
            작업
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs">
            {type}
          </Badge>
        );
    }
  };

  const getPriorityColor = (priority: ScheduleEvent["priority"]) => {
    switch (priority) {
      case "high":
        return "border-l-red-500";
      case "medium":
        return "border-l-yellow-500";
      case "low":
        return "border-l-green-500";
      default:
        return "border-l-gray-300";
    }
  };

  const isToday = (d: Date) =>
    d.toDateString() === new Date().toDateString();

  const isSelected = (d: Date) => selectedDate === toYMD(d);

  const formatDateHeader = () => {
    return isExpanded
      ? monthLabel(currentReferenceDate)
      : weekLabel(currentReferenceDate);
  };

  const isCurrentMonth = (date: Date) => {
    if (!isExpanded) return true; // 주간 모드에서는 전부 현재로 취급
    const ref = getStartOfMonth(today, currentOffset);
    return (
      date.getMonth() === ref.getMonth() && date.getFullYear() === ref.getFullYear()
    );
  };

  const unitLabel = isExpanded ? "달" : "주";

  return (
    <div className={`space-y-6 ${className ?? ""}`}>
      {/* 캘린더 카드 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                {isExpanded ? "월간 일정" : "주간 일정"}
              </CardTitle>
              <CardDescription>{formatDateHeader()}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentOffset((v) => v - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
                {`이전 ${unitLabel}`}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentOffset(0)}
              >
                {`이번 ${unitLabel}`}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentOffset((v) => v + 1)}
              >
                {`다음 ${unitLabel}`}
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                일정 추가
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {DAY_LABELS.map((day, idx) => (
              <div
                key={day}
                className={`text-center py-2 text-sm font-medium ${
                  idx === 0 ? "text-red-500" : idx === 6 ? "text-blue-500" : ""
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* 날짜 그리드 */}
          <div
            className={`grid grid-cols-7 gap-2 ${
              isExpanded ? "grid-rows-6" : "grid-rows-1"
            }`}
          >
            {displayDays.map((date) => {
              const events = getEventsForDate(date);
              const key = toYMD(date);
              const inCurrentMonth = isCurrentMonth(date);
              const maxEvents = isExpanded ? 4 : 2;
              const minHeight = isExpanded ? "min-h-[150px]" : "min-h-[120px]";

              return (
                <div
                  key={key}
                  className={`
                    ${minHeight} p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md
                    ${isToday(date) ? "bg-primary/5 border-primary" : "border-border hover:border-primary/50"}
                    ${isSelected(date) ? "ring-2 ring-primary ring-offset-2" : ""}
                    ${!inCurrentMonth ? "opacity-50 bg-muted/20" : ""}
                  `}
                  onClick={() => setSelectedDate(key)}
                >
                  <div
                    className={`text-center mb-3 ${
                      isToday(date)
                        ? "font-bold text-primary"
                        : inCurrentMonth
                        ? ""
                        : "text-muted-foreground"
                    }`}
                  >
                    <span className="text-lg">{date.getDate()}</span>
                  </div>

                  <div className="space-y-1">
                    {events.slice(0, maxEvents).map((event) => (
                      <div
                        key={event.id}
                        className="text-xs p-1.5 rounded bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center gap-1 mb-1">
                          {getTypeIcon(event.type, "h-2 w-2")}
                          <span className="truncate font-medium">
                            {event.title}
                          </span>
                        </div>
                        {isExpanded && (
                          <div className="text-muted-foreground flex items-center gap-1">
                            <Clock className="h-2 w-2" />
                            <span>{event.time}</span>
                          </div>
                        )}
                      </div>
                    ))}

                    {events.length > maxEvents && (
                      <div className="text-xs text-muted-foreground text-center py-1 font-medium">
                        +{events.length - maxEvents}개 더 보기
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 접기/펼치기 */}
          <div className="flex justify-center mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded((v) => !v)}
              className="flex items-center gap-2"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  주간 보기로 접기
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  월간 보기로 펼치기
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 선택한 날짜의 상세 일정 */}
      {selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle>
              {new Date(selectedDate).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                weekday: "long",
              })}
            </CardTitle>
            <CardDescription>
              {selectedDateEvents.length > 0
                ? `${selectedDateEvents.length}개의 일정`
                : "일정이 없습니다"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedDateEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedDateEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`p-6 border-l-4 bg-muted/30 rounded-r-md ${getPriorityColor(
                      event.priority
                    )}`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(event.type, "h-4 w-4")}
                        <span className="font-medium">{event.title}</span>
                      </div>
                      {getTypeBadge(event.type)}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <Clock className="h-4 w-4" />
                      <span>{event.time}</span>
                    </div>

                    {event.description && (
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                        {event.description}
                      </p>
                    )}

                    <div className="flex justify-end">
                      <Button size="sm" variant="outline">
                        상세보기
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-4">
                  선택한 날짜에 등록된 일정이 없습니다.
                </p>
                <Button size="sm" variant="outline">
                  <Plus className="h-3 w-3 mr-2" />
                  일정 추가
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
