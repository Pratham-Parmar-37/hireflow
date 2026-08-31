package com.hireflow.interviewservice.repository;

import com.hireflow.interviewservice.entity.Interview;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface InterviewRepository extends MongoRepository<Interview, String> {
}
