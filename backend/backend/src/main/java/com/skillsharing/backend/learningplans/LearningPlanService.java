package com.skillsharing.backend.learningplans;

import org.springframework.stereotype.Service;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

@Service
public class LearningPlanService {

    private final LearningPlanRepository repository;

    public LearningPlanService(LearningPlanRepository repository) {
        this.repository = repository;
    }

    // Get all learning plans
    public List<LearningPlan> getAllPlans() {
        return repository.findAll();
    }

    // Create a new learning plan
    public LearningPlan createPlan(LearningPlan plan) {
        return repository.save(plan);
    }

    // Get a learning plan by ID
    public ResponseEntity<LearningPlan> getPlanById(Long id) {
        Optional<LearningPlan> plan = repository.findById(id);
        if (plan.isPresent()) {
            return ResponseEntity.ok(plan.get());
        }
        return ResponseEntity.notFound().build();  // Return 404 if not found
    }

    // Update an existing learning plan by ID
    public ResponseEntity<LearningPlan> updatePlan(Long id, LearningPlan updatedPlan) {
        Optional<LearningPlan> existingPlan = repository.findById(id);
        if (existingPlan.isPresent()) {
            LearningPlan plan = existingPlan.get();
            plan.setTitle(updatedPlan.getTitle());
            plan.setDescription(updatedPlan.getDescription());
            plan.setStartDate(updatedPlan.getStartDate());
            plan.setEndDate(updatedPlan.getEndDate());
            plan.setAssignedTo(updatedPlan.getAssignedTo());
            return ResponseEntity.ok(repository.save(plan));  // Return updated plan with 200 OK
        }
        return ResponseEntity.notFound().build();  // Return 404 if not found
    }

    // Delete a learning plan by ID
    public void deletePlan(Long id) {
        repository.deleteById(id);
    }
}
