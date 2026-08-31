package com.hireflow.interviewservice.controller;

import com.hireflow.interviewservice.entity.Interview;
import com.hireflow.interviewservice.service.InterviewService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interviews")
public class InterviewController {

    private final InterviewService interviewService;

    public InterviewController(InterviewService interviewService) {
        this.interviewService = interviewService;
    }

    @GetMapping
    public List<Interview> getAllInterviews() {
        return interviewService.getAllInterviews();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Interview> getInterviewById(@PathVariable String id) {
        Interview interview = interviewService.getInterviewById(id);
        return ResponseEntity.ok(interview);
    }

    @PostMapping
    public ResponseEntity<Interview> createInterview(@RequestBody Interview interview) {
        Interview created = interviewService.createInterview(interview);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Interview> updateInterview(@PathVariable String id, @RequestBody Interview interview) {
        Interview updated = interviewService.updateInterview(id, interview);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInterview(@PathVariable String id) {
        interviewService.deleteInterview(id);
        return ResponseEntity.noContent().build();
    }
}
