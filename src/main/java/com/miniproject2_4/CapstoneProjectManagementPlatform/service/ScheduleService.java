package com.miniproject2_4.CapstoneProjectManagementPlatform.service;

import com.miniproject2_4.CapstoneProjectManagementPlatform.controller.dto.ScheduleDto;
import com.miniproject2_4.CapstoneProjectManagementPlatform.entity.Assignment;
import com.miniproject2_4.CapstoneProjectManagementPlatform.entity.AssignmentStatus;
import com.miniproject2_4.CapstoneProjectManagementPlatform.entity.Event;
import com.miniproject2_4.CapstoneProjectManagementPlatform.entity.EventType;
import com.miniproject2_4.CapstoneProjectManagementPlatform.repository.AssignmentRepository;
import com.miniproject2_4.CapstoneProjectManagementPlatform.repository.EventRepository;
import com.miniproject2_4.CapstoneProjectManagementPlatform.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ScheduleService {

    private final AssignmentRepository assignmentRepository;
    private final EventRepository eventRepository;
    private final ProjectRepository projectRepository;

    private static final DateTimeFormatter D = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter T = DateTimeFormatter.ofPattern("HH:mm");

    /** 기존: 데모용 전체(첫 프로젝트) */
    public List<ScheduleDto> listSchedules() {
        List<ScheduleDto> out = new ArrayList<>();

        var proj = projectRepository.findAll().stream().findFirst().orElse(null);
        Long projectId = proj != null ? proj.getId() : null;

        var assigns = (projectId == null)
                ? List.<Assignment>of()
                : assignmentRepository.findByProject_IdOrderByDueDateAsc(projectId);

        for (var a : assigns) {
            String status = switch (a.getStatus() == null ? AssignmentStatus.ONGOING : a.getStatus()) {
                case COMPLETED -> "completed";
                case ONGOING -> "in-progress";
                case PENDING -> "pending";
            };
            out.add(new ScheduleDto(
                    "A-" + a.getId(),
                    a.getTitle(),
                    "",
                    "deadline",
                    status,
                    "medium",
                    a.getDueDate() != null ? a.getDueDate().toLocalDate().format(D) : null,
                    a.getDueDate() != null ? a.getDueDate().toLocalTime().format(T) : null,
                    null,
                    "온라인",
                    proj != null ? proj.getTitle() : null
            ));
        }

        var events = (projectId == null)
                ? List.<Event>of()
                : eventRepository.findByProject_IdOrderByStartAtAsc(projectId);

        for (var e : events) {
            String type = switch (e.getType() == null ? EventType.ETC : e.getType()) {
                case MEETING -> "meeting";
                case DEADLINE -> "deadline";
                case ETC -> "task";
            };
            out.add(new ScheduleDto(
                    "E-" + e.getId(),
                    e.getTitle(),
                    "",
                    type,
                    "scheduled",
                    "low",
                    e.getStartAt() != null ? e.getStartAt().toLocalDate().format(D) : null,
                    e.getStartAt() != null ? e.getStartAt().toLocalTime().format(T) : null,
                    null,
                    e.getLocation(),
                    proj != null ? proj.getTitle() : null
            ));
        }

        out.sort(Comparator.comparing((ScheduleDto s) -> s.date() == null ? "" : s.date())
                .thenComparing(s -> s.time() == null ? "" : s.time()));

        return out;
    }

    /** 신규: 기간 기반(월/주 이동 시 쓰기) */
    public List<ScheduleDto> listSchedulesInRange(Long projectId, LocalDate from, LocalDate to) {
        var out = new ArrayList<ScheduleDto>();

        var proj = (projectId != null)
                ? projectRepository.findById(projectId).orElse(null)
                : projectRepository.findAll().stream().findFirst().orElse(null);
        Long pid = proj != null ? proj.getId() : null;

        // Assignments (dueDate가 범위 안)
        var assigns = (pid == null)
                ? List.<Assignment>of()
                : assignmentRepository.findByProject_IdOrderByDueDateAsc(pid)
                .stream()
                .filter(a -> a.getDueDate() != null)
                .filter(a -> {
                    var d = a.getDueDate().toLocalDate();
                    return !d.isBefore(from) && !d.isAfter(to);
                })
                .toList();

        for (var a : assigns) {
            String status = switch (a.getStatus() == null ? AssignmentStatus.ONGOING : a.getStatus()) {
                case COMPLETED -> "completed";
                case ONGOING -> "in-progress";
                case PENDING -> "pending";
            };
            out.add(new ScheduleDto(
                    "A-" + a.getId(),
                    a.getTitle(),
                    "",
                    "deadline",
                    status,
                    "medium",
                    a.getDueDate().toLocalDate().format(D),
                    a.getDueDate().toLocalTime().format(T),
                    null,
                    "온라인",
                    proj != null ? proj.getTitle() : null
            ));
        }

        // Events (startAt이 범위에 걸치는 것)
        var evs = (pid == null)
                ? List.<Event>of()
                : eventRepository.findInRange(pid, from.atStartOfDay(), to.atTime(LocalTime.MAX));

        for (var e : evs) {
            String type = switch (e.getType() == null ? EventType.ETC : e.getType()) {
                case MEETING -> "meeting";
                case DEADLINE -> "deadline";
                case ETC -> "task";
            };
            out.add(new ScheduleDto(
                    "E-" + e.getId(),
                    e.getTitle(),
                    "",
                    type,
                    "scheduled",
                    "low",
                    e.getStartAt() != null ? e.getStartAt().toLocalDate().format(D) : null,
                    e.getStartAt() != null ? e.getStartAt().toLocalTime().format(T) : null,
                    null,
                    e.getLocation(),
                    proj != null ? proj.getTitle() : null
            ));
        }

        out.sort(Comparator.comparing((ScheduleDto s) -> s.date() == null ? "" : s.date())
                .thenComparing(s -> s.time() == null ? "" : s.time()));

        return out;
    }
}
