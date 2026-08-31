package com.hireflow.candidateservice.service;

import com.hireflow.candidateservice.entity.Candidate;
import com.hireflow.candidateservice.repository.CandidateRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CandidateService {

    private final CandidateRepository candidateRepository;

    public CandidateService(CandidateRepository candidateRepository) {
        this.candidateRepository = candidateRepository;
    }

    public List<Candidate> getAllCandidates() {
        return candidateRepository.findAll();
    }

    public Candidate getCandidateById(String id) {
        return candidateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Candidate not found with id: " + id));
    }

    public Candidate createCandidate(Candidate candidate) {
        return candidateRepository.save(candidate);
    }

    public Candidate updateCandidate(String id, Candidate candidate) {
        if (!candidateRepository.existsById(id)) {
            throw new RuntimeException("Candidate not found with id: " + id);
        }
        candidate.setId(id);
        return candidateRepository.save(candidate);
    }

    public void deleteCandidate(String id) {
        if (!candidateRepository.existsById(id)) {
            throw new RuntimeException("Candidate not found with id: " + id);
        }
        candidateRepository.deleteById(id);
    }
}
