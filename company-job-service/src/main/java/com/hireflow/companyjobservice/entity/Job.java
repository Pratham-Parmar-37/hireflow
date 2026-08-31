package com.hireflow.companyjobservice.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "jobs")
public class Job {

    @Id
    private String id;
    private String title;
    private String description;
    private String salary;
    private String experienceRequired;
    private String employmentType;
    private String status;
    private String companyId;
    private String postedByUserId;

    public Job() {
    }

    public Job(String title, String description, String salary, String experienceRequired,
               String employmentType, String status, String companyId, String postedByUserId) {
        this.title = title;
        this.description = description;
        this.salary = salary;
        this.experienceRequired = experienceRequired;
        this.employmentType = employmentType;
        this.status = status;
        this.companyId = companyId;
        this.postedByUserId = postedByUserId;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSalary() {
        return salary;
    }

    public void setSalary(String salary) {
        this.salary = salary;
    }

    public String getExperienceRequired() {
        return experienceRequired;
    }

    public void setExperienceRequired(String experienceRequired) {
        this.experienceRequired = experienceRequired;
    }

    public String getEmploymentType() {
        return employmentType;
    }

    public void setEmploymentType(String employmentType) {
        this.employmentType = employmentType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCompanyId() {
        return companyId;
    }

    public void setCompanyId(String companyId) {
        this.companyId = companyId;
    }

    public String getPostedByUserId() {
        return postedByUserId;
    }

    public void setPostedByUserId(String postedByUserId) {
        this.postedByUserId = postedByUserId;
    }
}
