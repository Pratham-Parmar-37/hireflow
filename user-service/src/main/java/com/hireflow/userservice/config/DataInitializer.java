package com.hireflow.userservice.config;

import com.hireflow.userservice.entity.User;
import com.hireflow.userservice.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initUsers(UserRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                User u1 = new User("Pratham Parmar", "pratham@hireflow.ai", "ADMIN");
                u1.setId("usr_admin_01");
                repository.save(u1);

                User u2 = new User("Sarah Jenkins", "sarah.j@hireflow.ai", "RECRUITER");
                u2.setId("usr_recruiter_01");
                repository.save(u2);

                User u3 = new User("Alina Vance", "alina.v@starlight.tech", "CANDIDATE");
                u3.setId("usr_cand_01");
                repository.save(u3);
            }
        };
    }
}
