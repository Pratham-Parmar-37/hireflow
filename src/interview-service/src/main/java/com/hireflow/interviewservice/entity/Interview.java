package com.hireflow.interviewservice.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "interviews")
public class Interview {

    @Id
    private String id;
    private String applicationId;
    private String candidateId;
    private String interviewDate;
    private String interviewType;
    private String status;
    private String feedback;

    public Interview() {
    }

    public Interview(String applicationId, String candidateId, String interviewDate,
                     String interviewType, String status, String feedback) {
        this.applicationId = applicationId;
        this.candidateId = candidateId;
        this.interviewDate = interviewDate;
        this.interviewType = interviewType;
        this.status = status;
        this.feedback = feedback;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getApplicationId() {
        return applicationId;
    }

    public void setApplicationId(String applicationId) {
        this.applicationId = applicationId;
    }

    public String getCandidateId() {
        return candidateId;
    }

    public void setCandidateId(String candidateId) {
        this.candidateId = candidateId;
    }

    public String getInterviewDate() {
        return interviewDate;
    }

    public void setInterviewDate(String interviewDate) {
        this.interviewDate = interviewDate;
    }

    public String getInterviewType() {
        return interviewType;
    }

    public void setInterviewType(String interviewType) {
        this.interviewType = interviewType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }
}
