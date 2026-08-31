package com.hireflow.companyjobservice.repository;

import com.hireflow.companyjobservice.entity.Company;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CompanyRepository extends MongoRepository<Company, String> {
}
