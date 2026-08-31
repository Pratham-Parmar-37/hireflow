package com.hireflow.candidateservice.repository;

import com.hireflow.candidateservice.entity.Candidate;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CandidateRepository extends MongoRepository<Candidate, String> {
}
