package com.miniproject2_4.CapstoneProjectManagementPlatform.controller.dto;

public record ScheduleDto(
        String id,        // ← String (ex: "A-1", "E-2")
        String title,
        String description,
        String type,       // 'deadline' | 'presentation' | 'meeting' | 'task'
        String status,     // 'completed' | 'in-progress' | 'scheduled' | 'pending'
        String priority,   // 'high' | 'medium' | 'low'
        String date,       // YYYY-MM-DD
        String time,       // HH:mm
        String duration,   // e.g. "30m" or null
        String location,
        String relatedProject
) {}
