package com.hireflow.applicationservice.config;

import com.hireflow.applicationservice.entity.Application;
import com.hireflow.applicationservice.repository.ApplicationRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initApplications(ApplicationRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                Application app1 = new Application(
                    "cnd_pratham_01",
                    "job_arch_01",
                    "2026-10-19",
                    "SHORTLISTED"
                );
                app1.setId("app_pratham_01");
                repository.save(app1);

                Application app2 = new Application(
                    "cnd_alina_02",
                    "job_fullstack_02",
                    "2026-10-19",
                    "UNDER_REVIEW"
                );
                app2.setId("app_alina_02");
                repository.save(app2);
            }
        };
    }
}
