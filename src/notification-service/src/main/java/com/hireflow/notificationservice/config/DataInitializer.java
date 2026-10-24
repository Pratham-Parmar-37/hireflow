package com.hireflow.notificationservice.config;

import com.hireflow.notificationservice.entity.Notification;
import com.hireflow.notificationservice.repository.NotificationRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initNotifications(NotificationRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                Notification notif = new Notification(
                    "usr_admin_01",
                    "Application for Senior Java Architect moved to SHORTLISTED",
                    "APPLICATION",
                    "UNREAD",
                    "10:00 AM"
                );
                notif.setId("notif_pratham_01");
                repository.save(notif);
            }
        };
    }
}
