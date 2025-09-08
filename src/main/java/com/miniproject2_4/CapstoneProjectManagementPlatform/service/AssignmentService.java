package com.miniproject2_4.CapstoneProjectManagementPlatform.service;

import com.miniproject2_4.CapstoneProjectManagementPlatform.entity.Assignment;
import com.miniproject2_4.CapstoneProjectManagementPlatform.entity.AssignmentStatus;
import com.miniproject2_4.CapstoneProjectManagementPlatform.entity.Project;
import com.miniproject2_4.CapstoneProjectManagementPlatform.repository.AssignmentRepository;
import com.miniproject2_4.CapstoneProjectManagementPlatform.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final ProjectRepository projectRepository;

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

    /** 생성 */
    @org.springframework.transaction.annotation.Transactional
    public Assignment create(Long projectId, String title, String dueDateIso, AssignmentStatus status) {
        Project p = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found: " + projectId));
        Assignment a = new Assignment();
        a.setProject(p);
        a.setTitle(title);
        a.setStatus(status != null ? status : AssignmentStatus.PENDING);
        a.setDueDate(parseDueDate(dueDateIso));
        return assignmentRepository.save(a);
    }

    /** 수정 */
    @org.springframework.transaction.annotation.Transactional
    public Assignment update(Long assignmentId, String title, String dueDateIso, AssignmentStatus status) {
        Assignment a = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new IllegalArgumentException("Assignment not found: " + assignmentId));
        if (title != null) a.setTitle(title);
        if (dueDateIso != null) a.setDueDate(parseDueDate(dueDateIso));
        if (status != null) a.setStatus(status);
        return assignmentRepository.save(a);
    }

    /** 상태 변경 (기존 changeStatus를 유지하면서 내부적으로 update 호출) */
    @org.springframework.transaction.annotation.Transactional
    public Assignment changeStatus(Long assignmentId, AssignmentStatus status) {
        return update(assignmentId, null, null, status);
    }

    /** 삭제 */
    @org.springframework.transaction.annotation.Transactional
    public void delete(Long assignmentId) {
        assignmentRepository.deleteById(assignmentId);
    }

    private LocalDateTime parseDueDate(String iso) {
        if (iso == null || iso.isBlank()) return null;
        // "yyyy-MM-dd" 로 들어오면 23:59 로 보정
        if (iso.length() == 10) {
            return LocalDate.parse(iso).atTime(LocalTime.of(23, 59));
        }
        return LocalDateTime.parse(iso);
    }
}
