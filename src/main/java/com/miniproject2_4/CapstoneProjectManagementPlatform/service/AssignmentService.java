// src/main/java/com/miniproject2_4/CapstoneProjectManagementPlatform/service/AssignmentService.java
package com.miniproject2_4.CapstoneProjectManagementPlatform.service;

import com.miniproject2_4.CapstoneProjectManagementPlatform.entity.Assignment;
import com.miniproject2_4.CapstoneProjectManagementPlatform.entity.AssignmentStatus;
import com.miniproject2_4.CapstoneProjectManagementPlatform.repository.AssignmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;

    /** 프로젝트의 과제를 마감일 오름차순으로 모두 가져오기 */
    public List<Assignment> listByProjectOrdered(Long projectId) {
        return assignmentRepository.findByProject_IdOrderByDueDateAsc(projectId);
    }

    /** 프로젝트의 다가오는 과제 일부만 (limit) */
    public List<Assignment> listUpcoming(Long projectId, int limit) {
        return assignmentRepository.findByProject_IdOrderByDueDateAsc(projectId)
                .stream()
                .limit(limit)
                .toList();
    }

    /** 상태별 개수 */
    public long countCompleted(Long projectId) {
        return assignmentRepository.countByProject_IdAndStatus(projectId, AssignmentStatus.COMPLETED);
    }

    public long countOngoing(Long projectId) {
        return assignmentRepository.countByProject_IdAndStatus(projectId, AssignmentStatus.ONGOING);
    }

    public long countPending(Long projectId) {
        return assignmentRepository.countByProject_IdAndStatus(projectId, AssignmentStatus.PENDING);
    }
}
