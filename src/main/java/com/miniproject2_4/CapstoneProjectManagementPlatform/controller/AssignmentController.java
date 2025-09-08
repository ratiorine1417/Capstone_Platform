package com.miniproject2_4.CapstoneProjectManagementPlatform.controller;

import com.miniproject2_4.CapstoneProjectManagementPlatform.entity.Assignment;
import com.miniproject2_4.CapstoneProjectManagementPlatform.entity.AssignmentStatus;
import com.miniproject2_4.CapstoneProjectManagementPlatform.service.AssignmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/projects/{projectId}/assignments")
public class AssignmentController {

    private final AssignmentService assignmentService;

    // GET /api/projects/{projectId}/assignments
    @GetMapping
    public List<Assignment> list(@PathVariable Long projectId) {
        return assignmentService.listByProjectOrdered(projectId);
    }

    // PATCH /api/projects/{projectId}/assignments/{id}/status?value=COMPLETED
    @PatchMapping("/{id}/status")
    public Assignment changeStatus(@PathVariable Long projectId,
                                   @PathVariable Long id,
                                   @RequestParam("value") AssignmentStatus value) {
        // projectId는 권한/소유성 체크 목적으로 path에 두고, 변경은 id 기준으로 처리
        return assignmentService.changeStatus(id, value);
    }
}
