package com.miniproject2_4.CapstoneProjectManagementPlatform.controller;

import com.miniproject2_4.CapstoneProjectManagementPlatform.controller.dto.ScheduleDto;
import com.miniproject2_4.CapstoneProjectManagementPlatform.service.ScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping // context-path=/api 이므로 여기선 비움 => /api/schedules
public class ScheduleController {

    private final ScheduleService scheduleService;

    @GetMapping("/schedules")
    public List<ScheduleDto> list() {
        return scheduleService.listSchedules();
    }

    // 기간 기반 조회: /api/schedules/range?from=YYYY-MM-DD&to=YYYY-MM-DD&projectId=1
    @GetMapping("/schedules/range")
    public List<ScheduleDto> listInRange(@RequestParam String from,
                                         @RequestParam String to,
                                         @RequestParam(required = false) Long projectId) {
        return scheduleService.listSchedulesInRange(
                projectId,
                LocalDate.parse(from),
                LocalDate.parse(to)
        );
    }
}
