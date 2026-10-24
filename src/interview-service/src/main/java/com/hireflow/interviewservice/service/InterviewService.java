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
        return interviewRepository.save(interview);
    }

    public Interview updateInterview(String id, Interview interview) {
        if (!interviewRepository.existsById(id)) {
            throw new RuntimeException("Interview not found with id: " + id);
        }
        interview.setId(id);
        return interviewRepository.save(interview);
    }

    public void deleteInterview(String id) {
        if (!interviewRepository.existsById(id)) {
            throw new RuntimeException("Interview not found with id: " + id);
        }
        interviewRepository.deleteById(id);
    }
}
