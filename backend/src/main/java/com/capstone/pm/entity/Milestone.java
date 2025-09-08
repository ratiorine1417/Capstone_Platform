package com.capstone.pm.entity;

import com.capstone.pm.common.BaseTimeEntity;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "milestones")
public class Milestone extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(nullable = false)
    private String name;

    @Column(name = "due_at")
    private LocalDate dueAt;

    public Milestone() {}

    public Milestone(Project project, String name, LocalDate dueAt) {
        this.project = project;
        this.name = name;
        this.dueAt = dueAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDate getDueAt() {
        return dueAt;
    }

    public void setDueAt(LocalDate dueAt) {
        this.dueAt = dueAt;
    }
}