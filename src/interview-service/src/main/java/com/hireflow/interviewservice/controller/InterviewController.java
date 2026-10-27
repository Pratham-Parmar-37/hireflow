package com.hireflow.interviewservice.controller;

import com.hireflow.interviewservice.entity.Interview;
import com.hireflow.interviewservice.service.InterviewService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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

    @PatchMapping("/{id}")
    public ResponseEntity<Interview> patchInterview(@PathVariable String id, @RequestBody Interview interview) {
        Interview updated = interviewService.updateInterview(id, interview);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<Interview> completeInterview(
            @PathVariable String id,
            @RequestBody(required = false) Map<String, String> body) {
        String feedback = body != null ? body.get("feedback") : null;
        Interview completed = interviewService.completeInterview(id, feedback);
        return ResponseEntity.ok(completed);
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<Interview> patchCompleteInterview(
            @PathVariable String id,
            @RequestBody(required = false) Map<String, String> body) {
        String feedback = body != null ? body.get("feedback") : null;
        Interview completed = interviewService.completeInterview(id, feedback);
        return ResponseEntity.ok(completed);
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Interview> cancelInterview(
            @PathVariable String id,
            @RequestBody(required = false) Map<String, String> body) {
        String reason = null;
        if (body != null) {
            reason = body.containsKey("reason") ? body.get("reason") : body.get("feedback");
        }
        Interview cancelled = interviewService.cancelInterview(id, reason);
        return ResponseEntity.ok(cancelled);
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<Interview> patchCancelInterview(
            @PathVariable String id,
            @RequestBody(required = false) Map<String, String> body) {
        String reason = null;
        if (body != null) {
            reason = body.containsKey("reason") ? body.get("reason") : body.get("feedback");
        }
        Interview cancelled = interviewService.cancelInterview(id, reason);
        return ResponseEntity.ok(cancelled);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInterview(@PathVariable String id) {
        interviewService.deleteInterview(id);
        return ResponseEntity.noContent().build();
    }
}
