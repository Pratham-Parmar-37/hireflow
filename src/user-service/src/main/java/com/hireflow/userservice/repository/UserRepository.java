package com.hireflow.userservice.repository;

import com.hireflow.userservice.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {
}
