// EventController.java (베이스 경로에 /api 붙이지 않기)
package com.miniproject2_4.CapstoneProjectManagementPlatform.controller;

import com.miniproject2_4.CapstoneProjectManagementPlatform.controller.dto.EventDto;
import com.miniproject2_4.CapstoneProjectManagementPlatform.entity.EventType;
import com.miniproject2_4.CapstoneProjectManagementPlatform.service.EventService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/projects/{projectId}")
public class EventController {

    private final EventService eventService;

    /* ===== 요청 바디용 내부 레코드 ===== */
    public record CreateReq(String title, String startAtIso, String endAtIso, EventType type, String location) {}
    public record UpdateReq(String title, String startAtIso, String endAtIso, EventType type, String location) {}

    /* ===== 조회 ===== */

    // 목록
    @GetMapping("/events")
    public ResponseEntity<?> list(@PathVariable Long projectId) {
        return ResponseEntity.ok(eventService.listByProject(projectId));
    }

    // 기간 조회: /projects/{pid}/events/range?from=...&to=...
    @GetMapping("/events/range")
    public ResponseEntity<?> findInRange(
            @PathVariable Long projectId,
            @RequestParam("from") String fromStr,
            @RequestParam("to") String toStr
    ) {
        try {
            Instant from = parseToInstant(fromStr);
            Instant to = parseToInstant(toStr);
            if (to.isBefore(from)) return ResponseEntity.badRequest().build();
            return ResponseEntity.ok(eventService.findInRange(projectId, from, to));
        } catch (DateTimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /* ===== 쓰기 ===== */

    @PostMapping("/events")
    public ResponseEntity<EventDto> create(@PathVariable Long projectId,
                                           @RequestBody CreateReq req) {
        var e = eventService.create(projectId, req.title(), req.startAtIso(), req.endAtIso(), req.type(), req.location());
        return ResponseEntity.ok(EventDto.from(e));
    }

    @PatchMapping("/events/{id}")
    public ResponseEntity<EventDto> update(@PathVariable Long projectId,
                                           @PathVariable Long id,
                                           @RequestBody UpdateReq req) {
        var e = eventService.update(projectId, id, req.title(), req.startAtIso(), req.endAtIso(), req.type(), req.location());
        return ResponseEntity.ok(EventDto.from(e));
    }

    @DeleteMapping("/events/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long projectId, @PathVariable Long id) {
        eventService.delete(projectId, id);
        return ResponseEntity.noContent().build();
    }

    /* ===== 유틸 ===== */

    private static Instant parseToInstant(String v) {
        try { return Instant.parse(v); } catch (DateTimeException ignore) {}
        try { return OffsetDateTime.parse(v).toInstant(); } catch (DateTimeException ignore) {}
        var ldt = LocalDateTime.parse(v);
        return ldt.atZone(ZoneId.systemDefault()).toInstant();
    }
}
