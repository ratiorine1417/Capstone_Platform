package com.miniproject2_4.CapstoneProjectManagementPlatform.repository;

import com.miniproject2_4.CapstoneProjectManagementPlatform.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    @org.springframework.data.jpa.repository.Query("""
        select f from Feedback f
        join fetch f.author a
        where f.project.id = :pid
        order by f.createdAt desc
    """)
    java.util.List<Feedback> findRecentWithAuthor(@org.springframework.data.repository.query.Param("pid") Long projectId);
}