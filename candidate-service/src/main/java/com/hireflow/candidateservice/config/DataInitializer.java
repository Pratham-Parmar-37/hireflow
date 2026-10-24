package com.hireflow.candidateservice.config;

import com.hireflow.candidateservice.entity.Candidate;
import com.hireflow.candidateservice.repository.CandidateRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initCandidates(CandidateRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                Candidate c1 = new Candidate(
                    "usr_admin_01",
                    "Pratham Parmar",
                    "pratham@hireflow.ai",
                    "https://github.com/Pratham-Parmar-37/hireflow",
                    List.of("Java 17", "Spring Boot 3", "Spring Cloud Gateway", "Docker", "MongoDB", "Jenkins CI/CD"),
                    "4 years backend microservices engineering",
                    "B.Tech in Computer Science"
                );
                c1.setId("cnd_pratham_01");
                repository.save(c1);

                Candidate c2 = new Candidate(
                    "usr_cand_01",
                    "Alina Vance",
                    "alina.v@starlight.tech",
                    "https://starlight.tech/resumes/alina.pdf",
                    List.of("Spring Cloud", "Kubernetes", "Reactive WebFlux", "MongoDB", "Kafka"),
                    "5 years cloud-native engineering",
                    "M.S. Software Systems"
                );
                c2.setId("cnd_alina_02");
                repository.save(c2);
            }
        };
    }
}
