package com.miniproject2_4.CapstoneProjectManagementPlatform.repository;

import com.miniproject2_4.CapstoneProjectManagementPlatform.entity.Assignment;
import com.miniproject2_4.CapstoneProjectManagementPlatform.entity.AssignmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    List<Assignment> findByProject_Id(Long projectId);
    List<Assignment> findByProject_IdOrderByDueDateAsc(Long projectId);

    long countByProject_Id(Long projectId);
    long countByProject_IdAndStatus(Long projectId, AssignmentStatus status);
}
