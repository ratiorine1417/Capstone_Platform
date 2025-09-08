package com.miniproject2_4.CapstoneProjectManagementPlatform.service;

import com.miniproject2_4.CapstoneProjectManagementPlatform.controller.dto.EventDto;
import com.miniproject2_4.CapstoneProjectManagementPlatform.entity.Event;
import com.miniproject2_4.CapstoneProjectManagementPlatform.entity.EventType;
import com.miniproject2_4.CapstoneProjectManagementPlatform.entity.Project;
import com.miniproject2_4.CapstoneProjectManagementPlatform.repository.EventRepository;
import com.miniproject2_4.CapstoneProjectManagementPlatform.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final ProjectRepository projectRepository;

    /** DB/애플리케이션 기준 타임존 */
    private static final ZoneId ZONE = ZoneId.systemDefault();

    /* ================= 조회 ================= */

    @Transactional(readOnly = true)
    public List<EventDto> findInRange(Long projectId, Instant from, Instant to) {
        if (projectId == null || from == null || to == null) {
            throw new IllegalArgumentException("projectId, from, to는 null일 수 없습니다.");
        }
        if (to.isBefore(from)) {
            Instant tmp = from; from = to; to = tmp;
        }
        LocalDateTime fromLdt = LocalDateTime.ofInstant(from, ZONE);
        LocalDateTime toLdt   = LocalDateTime.ofInstant(to, ZONE);

        return eventRepository.findInRange(projectId, fromLdt, toLdt)
                .stream().map(EventDto::from).toList();
    }

    @Transactional(readOnly = true)
    public List<EventDto> listByProject(Long projectId) {
        return eventRepository.findByProject_IdOrderByStartAtAsc(projectId)
                .stream().map(EventDto::from).toList();
    }

    @Transactional(readOnly = true)
    public List<EventDto> getEventsInRange(Long projectId, LocalDateTime from, LocalDateTime to) {
        if (projectId == null || from == null || to == null) {
            throw new IllegalArgumentException("projectId, from, to는 null일 수 없습니다.");
        }
        if (to.isBefore(from)) {
            LocalDateTime tmp = from; from = to; to = tmp;
        }
        return eventRepository.findInRange(projectId, from, to)
                .stream().map(EventDto::from).toList();
    }

    /* ================= 쓰기 ================= */

    @Transactional
    public Event create(Long projectId, String title, String startIso, String endIso, EventType type, String location) {
        Project p = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found: " + projectId));
        Event e = new Event();
        e.setProject(p);
        e.setTitle(title);
        e.setStartAt(parse(startIso));
        e.setEndAt(parse(endIso));
        e.setType(type != null ? type : EventType.ETC);
        e.setLocation(location);
        return eventRepository.save(e);
    }

    @Transactional
    public Event update(Long id, String title, String startIso, String endIso, EventType type, String location) {
        Event e = eventRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Event not found: " + id));
        if (title != null) e.setTitle(title);
        if (startIso != null) e.setStartAt(parse(startIso));
        if (endIso != null) e.setEndAt(parse(endIso));
        if (type != null) e.setType(type);
        if (location != null) e.setLocation(location);
        return eventRepository.save(e);
    }

    @Transactional
    public void delete(Long id) {
        eventRepository.deleteById(id);
    }

    private LocalDateTime parse(String iso) {
        return (iso == null || iso.isBlank()) ? null : LocalDateTime.parse(iso);
    }
}
