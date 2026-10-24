package com.hireflow.companyjobservice.config;

import com.hireflow.companyjobservice.entity.Company;
import com.hireflow.companyjobservice.entity.Job;
import com.hireflow.companyjobservice.repository.CompanyRepository;
import com.hireflow.companyjobservice.repository.JobRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initCompanyAndJobs(CompanyRepository companyRepository, JobRepository jobRepository) {
        return args -> {
            if (companyRepository.count() == 0) {
                Company company = new Company(
                    "Starlight Technologies",
                    "Distributed Cloud Systems",
                    "San Francisco, CA & Remote",
                    "https://starlight.tech",
                    "Enterprise cloud infrastructure and distributed platform engineering."
                );
                company.setId("cmp_starlight_01");
                companyRepository.save(company);

                if (jobRepository.count() == 0) {
                    Job j1 = new Job(
                        "Senior Java & Spring Cloud Architect",
                        "Architect and scale fault-tolerant microservices using Spring Boot 3, Spring Cloud Gateway, Eureka discovery, and Docker Compose.",
                        "18-28 LPA ($140,000)",
                        "4-7 years",
                        "REMOTE",
                        "OPEN",
                        "cmp_starlight_01",
                        "admin"
                    );
                    j1.setId("job_arch_01");
                    jobRepository.save(j1);

                    Job j2 = new Job(
                        "Full Stack Distributed Systems Engineer",
                        "Develop reactive Netty endpoints, high-throughput MongoDB data models, and modern user-centric interfaces.",
                        "14-22 LPA ($110,000)",
                        "2-5 years",
                        "FULL_TIME",
                        "OPEN",
                        "cmp_starlight_01",
                        "admin"
                    );
                    j2.setId("job_fullstack_02");
                    jobRepository.save(j2);
                }
            }
        };
    }
}
