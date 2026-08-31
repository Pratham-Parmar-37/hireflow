package com.hireflow.candidateservice.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "candidates")
public class Candidate {

    @Id
    private String id;
    private String userId;
    private String fullName;
    private String email;
    private String resumeUrl;
    private List<String> skills;
    private String experience;
    private String education;

    public Candidate() {
    }

    public Candidate(String userId, String fullName, String email, String resumeUrl,
                     List<String> skills, String experience, String education) {
        this.userId = userId;
        this.fullName = fullName;
        this.email = email;
        this.resumeUrl = resumeUrl;
        this.skills = skills;
        this.experience = experience;
        this.education = education;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getResumeUrl() {
        return resumeUrl;
    }

    public void setResumeUrl(String resumeUrl) {
        this.resumeUrl = resumeUrl;
    }

    public List<String> getSkills() {
        return skills;
    }

    public void setSkills(List<String> skills) {
        this.skills = skills;
    }

    public String getExperience() {
        return experience;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }

    public String getEducation() {
        return education;
    }

    public void setEducation(String education) {
        this.education = education;
    }
}
