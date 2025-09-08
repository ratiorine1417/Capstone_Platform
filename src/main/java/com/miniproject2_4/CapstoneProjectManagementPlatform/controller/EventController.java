// EventController.java  (중요: 베이스 경로에 /api 붙이지 않기)
package com.miniproject2_4.CapstoneProjectManagementPlatform.controller;

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

    @GetMapping("/events")
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

    private static Instant parseToInstant(String v) {
        try { return Instant.parse(v); } catch (DateTimeException ignore) {}
        try { return OffsetDateTime.parse(v).toInstant(); } catch (DateTimeException ignore) {}
        LocalDateTime ldt = LocalDateTime.parse(v);
        return ldt.atZone(ZoneId.systemDefault()).toInstant();
    }
}
