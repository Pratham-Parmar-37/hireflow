package com.hireflow.interviewservice.service;

import com.hireflow.interviewservice.entity.Interview;
import com.hireflow.interviewservice.repository.InterviewRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InterviewService {

    private final InterviewRepository interviewRepository;

    public InterviewService(InterviewRepository interviewRepository) {
        this.interviewRepository = interviewRepository;
    }

    public List<Interview> getAllInterviews() {
        return interviewRepository.findAll();
    }

    public Interview getInterviewById(String id) {
        return interviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Interview not found with id: " + id));
    }

    public Interview createInterview(Interview interview) {
        if (interview.getStatus() == null || interview.getStatus().isBlank()) {
            interview.setStatus("SCHEDULED");
        }
        return interviewRepository.save(interview);
    }

    public Interview updateInterview(String id, Interview updated) {
        Interview existing = getInterviewById(id);
        if (updated.getApplicationId() != null) {
            existing.setApplicationId(updated.getApplicationId());
        }
        if (updated.getCandidateId() != null) {
            existing.setCandidateId(updated.getCandidateId());
        }
        if (updated.getInterviewDate() != null) {
            existing.setInterviewDate(updated.getInterviewDate());
        }
        if (updated.getInterviewType() != null) {
            existing.setInterviewType(updated.getInterviewType());
        }
        if (updated.getStatus() != null && !updated.getStatus().isBlank()) {
            existing.setStatus(updated.getStatus());
        }
        if (updated.getFeedback() != null) {
            existing.setFeedback(updated.getFeedback());
        }
        return interviewRepository.save(existing);
    }

    public Interview completeInterview(String id, String feedback) {
        Interview existing = getInterviewById(id);
        existing.setStatus("COMPLETED");
        if (feedback != null && !feedback.trim().isEmpty()) {
            existing.setFeedback(feedback.trim());
        }
        return interviewRepository.save(existing);
    }

    public Interview cancelInterview(String id, String reason) {
        Interview existing = getInterviewById(id);
        existing.setStatus("CANCELLED");
        if (reason != null && !reason.trim().isEmpty()) {
            String trimmed = reason.trim();
            String currentFeedback = existing.getFeedback();
            if (currentFeedback != null && !currentFeedback.isBlank()) {
                existing.setFeedback(currentFeedback + " [Cancelled: " + trimmed + "]");
            } else {
                existing.setFeedback("Cancelled: " + trimmed);
            }
        }
        return interviewRepository.save(existing);
    }

    public void deleteInterview(String id) {
        if (!interviewRepository.existsById(id)) {
            throw new RuntimeException("Interview not found with id: " + id);
        }
        interviewRepository.deleteById(id);
    }
}
