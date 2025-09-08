// src/main/java/com/miniproject2_4/CapstoneProjectManagementPlatform/repository/ProjectRepository.java
package com.miniproject2_4.CapstoneProjectManagementPlatform.repository;

import com.miniproject2_4.CapstoneProjectManagementPlatform.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    @org.springframework.data.jpa.repository.Query("""
        select p from Project p
        join fetch p.team t
    """)
    java.util.List<Project> findAllWithTeam();

    java.util.Optional<Project> findFirstByTeam_Id(Long teamId);
    java.util.Optional<Project> findByTeam_Id(Long teamId);
}