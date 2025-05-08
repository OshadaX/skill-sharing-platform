package com.skillsharing.backend.learningplans;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/api/learning-plans")
public class LearningPlanController {

    private final LearningPlanService service;

    public LearningPlanController(LearningPlanService service) {
        this.service = service;
    }

    // Get all learning plans
    @GetMapping
    public List<LearningPlan> getAllPlans() {
        return service.getAllPlans();
    }

    // Create a new learning plan
    @PostMapping
    public LearningPlan createPlan(@RequestBody LearningPlan plan,
                                   @RequestParam String targetSkill,
                                   @RequestParam String status) {
        LearningPlan newPlan = new LearningPlan(plan.getTitle(), plan.getDescription(), targetSkill, status, plan.getStartDate(), plan.getEndDate(), plan.getAssignedTo());
        return service.createPlan(newPlan);
    }

    // Get a single learning plan by ID
    @GetMapping("/{id}")
    public ResponseEntity<LearningPlan> getPlanById(@PathVariable Long id) {
        return service.getPlanById(id);
    }

    // Update a learning plan by ID
    @PutMapping("/{id}")
    public ResponseEntity<LearningPlan> updatePlan(@PathVariable Long id,
                                                   @RequestBody LearningPlan updatedPlan,
                                                   @RequestParam String targetSkill,
                                                   @RequestParam String status) {
        updatedPlan.setTargetSkill(targetSkill);
        updatedPlan.setStatus(status);
        return service.updatePlan(id, updatedPlan);
    }

    // Delete a learning plan by ID
    @DeleteMapping("/{id}")
    public void deletePlan(@PathVariable Long id) {
        service.deletePlan(id);
    }
}
