package com.miniproject2_4.CapstoneProjectManagementPlatform.controller.dto;

import com.miniproject2_4.CapstoneProjectManagementPlatform.entity.Assignment;
import com.miniproject2_4.CapstoneProjectManagementPlatform.entity.AssignmentStatus;

import java.time.format.DateTimeFormatter;

/**
 * 과제 DTO (ISO 문자열 반환)
 */
public record AssignmentDto(
        Long id,
        Long projectId,
        String title,
        String dueDate,              // ISO_LOCAL_DATE_TIME
        AssignmentStatus status,
        String createdAt,            // ISO_LOCAL_DATE_TIME
        String updatedAt             // ISO_LOCAL_DATE_TIME
) {
    private static final DateTimeFormatter ISO = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    public static AssignmentDto of(Assignment a) {
        return new AssignmentDto(
                a.getId(),
                a.getProject() != null ? a.getProject().getId() : null,
                a.getTitle(),
                a.getDueDate() != null ? a.getDueDate().format(ISO) : null,
                a.getStatus(),
                a.getCreatedAt() != null ? a.getCreatedAt().format(ISO) : null,
                a.getUpdatedAt() != null ? a.getUpdatedAt().format(ISO) : null
        );
    }
}
