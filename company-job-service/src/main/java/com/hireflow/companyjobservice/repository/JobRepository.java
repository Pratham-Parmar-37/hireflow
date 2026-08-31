package com.hireflow.companyjobservice.repository;

import com.hireflow.companyjobservice.entity.Job;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface JobRepository extends MongoRepository<Job, String> {
}
