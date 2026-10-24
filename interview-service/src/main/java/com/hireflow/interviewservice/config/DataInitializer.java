package com.hireflow.interviewservice.config;

import com.hireflow.interviewservice.entity.Interview;
import com.hireflow.interviewservice.repository.InterviewRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initInterviews(InterviewRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                Interview int1 = new Interview(
                    "app_pratham_01",
                    "cnd_pratham_01",
                    "2026-10-28",
                    "TECHNICAL",
                    "SCHEDULED",
                    "Candidate demonstrated strong mastery of Eureka registry, Feign composition, and Docker CI/CD."
                );
                int1.setId("int_pratham_01");
                repository.save(int1);
            }
        };
    }
}
