package com.miniproject2_4.CapstoneProjectManagementPlatform.service;

import com.miniproject2_4.CapstoneProjectManagementPlatform.controller.dto.EventDto;
import com.miniproject2_4.CapstoneProjectManagementPlatform.repository.EventRepository;
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

    /**
     * DB/애플리케이션에서 사용할 기준 타임존.
     * - 서버 타임존을 그대로 쓰려면 systemDefault()
     * - 고정이 필요하면 ZoneId.of("Asia/Seoul") 등으로 변경
     */
    private static final ZoneId ZONE = ZoneId.systemDefault();
    // private static final ZoneId ZONE = ZoneId.of("Asia/Seoul");

    /**
     * 컨트롤러에서 호출하는 표준 메서드 (Instant 기반).
     * 컨트롤러가 파라미터 유효성을 1차 검증하지만,
     * 여기서도 방어적으로 from/to를 보정한다.
     */
    @Transactional(readOnly = true)
    public List<EventDto> findInRange(Long projectId, Instant from, Instant to) {
        if (projectId == null || from == null || to == null) {
            throw new IllegalArgumentException("projectId, from, to는 null일 수 없습니다.");
        }
        // 잘못된 순서가 들어오면 보정
        if (to.isBefore(from)) {
            Instant tmp = from;
            from = to;
            to = tmp;
        }

        LocalDateTime fromLdt = LocalDateTime.ofInstant(from, ZONE);
        LocalDateTime toLdt   = LocalDateTime.ofInstant(to, ZONE);

        return eventRepository.findInRange(projectId, fromLdt, toLdt)
                .stream()
                .map(EventDto::from)
                .toList();
    }

    /**
     * 기존 시그니처 호환용 (다른 서비스/컴포넌트에서 사용할 수 있어 유지)
     */
    @Transactional(readOnly = true)
    public List<EventDto> getEventsInRange(Long projectId, LocalDateTime from, LocalDateTime to) {
        if (projectId == null || from == null || to == null) {
            throw new IllegalArgumentException("projectId, from, to는 null일 수 없습니다.");
        }
        // 순서 보정
        if (to.isBefore(from)) {
            LocalDateTime tmp = from;
            from = to;
            to = tmp;
        }

        return eventRepository.findInRange(projectId, from, to)
                .stream()
                .map(EventDto::from)
                .toList();
    }
}
