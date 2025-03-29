package com.skillsharing.backend;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class LearningPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private String assignedTo;

    public LearningPlan(String title, String description, LocalDate startDate, LocalDate endDate, String assignedTo) {
        this.title = title;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.assignedTo = assignedTo;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public String getAssignedTo() {
        return assignedTo;
    }

    public Long getId() {
        return id;
    }
}
