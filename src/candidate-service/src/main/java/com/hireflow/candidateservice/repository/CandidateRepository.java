package com.hireflow.candidateservice.repository;

import com.hireflow.candidateservice.entity.Candidate;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CandidateRepository extends MongoRepository<Candidate, String> {
    List<Candidate> findByUserId(String userId);
}
