package com.hireflow.applicationservice.repository;

import com.hireflow.applicationservice.entity.Application;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ApplicationRepository extends MongoRepository<Application, String> {
}
