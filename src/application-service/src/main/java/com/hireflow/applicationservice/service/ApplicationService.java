package com.hireflow.applicationservice.service;

import com.hireflow.applicationservice.client.JobClient;
import com.hireflow.applicationservice.entity.Application;
import com.hireflow.applicationservice.repository.ApplicationRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobClient jobClient;

    // Constructor injection for both repository and Feign client
    public ApplicationService(ApplicationRepository applicationRepository, JobClient jobClient) {
        this.applicationRepository = applicationRepository;
        this.jobClient = jobClient;
    }

    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }

    public Application getApplicationById(String id) {
        return applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found with id: " + id));
    }

    /**
     * Retrieves an application along with job details from the Company & Job Service.
     * This demonstrates inter-service communication using OpenFeign.
     */
    public Map<String, Object> getApplicationWithJobDetails(String id) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found with id: " + id));

        Map<String, Object> response = new HashMap<>();
        response.put("application", application);

        // Call Company & Job Service to get job details using OpenFeign
        try {
            Map<String, Object> jobDetails = jobClient.getJobById(application.getJobId());
            response.put("jobDetails", jobDetails);
        } catch (Exception e) {
            response.put("jobDetails", "Unable to fetch job details: " + e.getMessage());
        }

        return response;
    }

    public Application createApplication(Application application) {
        return applicationRepository.save(application);
    }

    public Application updateApplication(String id, Application application) {
        if (!applicationRepository.existsById(id)) {
            throw new RuntimeException("Application not found with id: " + id);
        }
        application.setId(id);
        return applicationRepository.save(application);
    }

    public void deleteApplication(String id) {
        if (!applicationRepository.existsById(id)) {
            throw new RuntimeException("Application not found with id: " + id);
        }
        applicationRepository.deleteById(id);
    }
}
