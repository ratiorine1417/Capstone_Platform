package com.miniproject2_4.CapstoneProjectManagementPlatform.controller.dto;

import java.time.LocalDateTime;

public class AssignmentDto {
    public Long id;
    public Long projectId;
    public String title;
    public LocalDateTime dueDate;
    public String status; // AssignmentStatus
}
