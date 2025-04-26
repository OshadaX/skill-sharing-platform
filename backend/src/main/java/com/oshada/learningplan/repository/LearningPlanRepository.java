package com.oshada.learningplan.repository;

import com.oshada.learningplan.model.LearningPlan;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LearningPlanRepository extends JpaRepository<LearningPlan, Long> {
}

//This is an interface that talks to the database using Spring Data JPA.