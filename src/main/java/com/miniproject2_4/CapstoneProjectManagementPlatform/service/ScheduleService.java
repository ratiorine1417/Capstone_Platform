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

    public List<ScheduleDto> listSchedules() {
        List<ScheduleDto> out = new ArrayList<>();

        // 1) 과제 -> deadline로 노출
        var proj = projectRepository.findAll().stream().findFirst().orElse(null); // 데모: 첫 프로젝트
        Long projectId = proj != null ? proj.getId() : null;

        var assigns = (projectId == null) ? List.<Assignment>of()
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
                    "",                     // description
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

        // 2) 이벤트
        var events = (projectId == null) ? List.<Event>of()
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

        // 시간순 정렬
        out.sort(Comparator.comparing((ScheduleDto s) -> s.date() == null ? "" : s.date())
                .thenComparing(s -> s.time() == null ? "" : s.time()));

        return out;
    }
}
