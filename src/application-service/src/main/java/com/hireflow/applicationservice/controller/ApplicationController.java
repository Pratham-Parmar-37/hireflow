package com.hireflow.applicationservice.controller;

import com.hireflow.applicationservice.entity.Application;
import com.hireflow.applicationservice.service.ApplicationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @GetMapping
    public List<Application> getAllApplications() {
        return applicationService.getAllApplications();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Application> getApplicationById(@PathVariable String id) {
        Application application = applicationService.getApplicationById(id);
        return ResponseEntity.ok(application);
    }

    /**
     * GET /api/applications/{id}/with-job
     * Demonstrates inter-service communication using OpenFeign.
     * Returns application details along with job information from Company & Job Service.
     */
    @GetMapping("/{id}/with-job")
    public ResponseEntity<Map<String, Object>> getApplicationWithJobDetails(@PathVariable String id) {
        Map<String, Object> response = applicationService.getApplicationWithJobDetails(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<Application> createApplication(@RequestBody Application application) {
        Application created = applicationService.createApplication(application);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Application> updateApplication(@PathVariable String id, @RequestBody Application application) {
        Application updated = applicationService.updateApplication(id, application);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplication(@PathVariable String id) {
        applicationService.deleteApplication(id);
        return ResponseEntity.noContent().build();
    }
}
