package com.skillsharing.backend;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class LearningPlanService {

    private final LearningPlanRepository repository;

    public LearningPlanService(LearningPlanRepository repository) {
        this.repository = repository;
    }

    public List<LearningPlan> getAllPlans() {
        return repository.findAll();
    }

    public LearningPlan createPlan(LearningPlan plan) {
        return repository.save(plan);
    }

    public void deletePlan(Long id) {
        repository.deleteById(id);
    }
}