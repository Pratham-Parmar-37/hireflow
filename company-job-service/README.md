# Company & Job Service

## Purpose

Manages **companies** and **job postings** for the HireFlow AI recruitment platform. Recruiters can create company profiles and post job openings under those companies.

## Technology

- Spring Boot 3.2.5
- Spring Data MongoDB
- MongoDB

## Port

`8082`

## Database

`company_job_db`

## Entities

### Company

| Field | Type | Description |
|-------|------|-------------|
| id | String | Auto-generated MongoDB ID |
| companyName | String | Name of the company |
| industry | String | Industry sector |
| location | String | Company location |
| website | String | Company website URL |
| description | String | Brief company description |

### Job

| Field | Type | Description |
|-------|------|-------------|
| id | String | Auto-generated MongoDB ID |
| title | String | Job title |
| description | String | Job description |
| salary | String | Salary range |
| experienceRequired | String | Required experience |
| employmentType | String | FULL_TIME, PART_TIME, CONTRACT |
| status | String | OPEN, CLOSED |
| companyId | String | Reference to Company ID |
| postedByUserId | String | Logical reference to User Service |

## API Endpoints

### Company Endpoints

| Operation | Method | Endpoint | Request Body |
|-----------|--------|----------|--------------|
| Get all companies | GET | `/api/companies` | - |
| Get company by ID | GET | `/api/companies/{id}` | - |
| Create company | POST | `/api/companies` | JSON (see below) |
| Update company | PUT | `/api/companies/{id}` | JSON (see below) |
| Delete company | DELETE | `/api/companies/{id}` | - |

### Job Endpoints

| Operation | Method | Endpoint | Request Body |
|-----------|--------|----------|--------------|
| Get all jobs | GET | `/api/jobs` | - |
| Get job by ID | GET | `/api/jobs/{id}` | - |
| Create job | POST | `/api/jobs` | JSON (see below) |
| Update job | PUT | `/api/jobs/{id}` | JSON (see below) |
| Delete job | DELETE | `/api/jobs/{id}` | - |

## Example Requests

### Create Company (POST /api/companies)

```json
{
    "companyName": "TechCorp",
    "industry": "Information Technology",
    "location": "Mumbai",
    "website": "https://techcorp.com",
    "description": "A leading IT company"
}
```

### Create Job (POST /api/jobs)

```json
{
    "title": "Java Developer",
    "description": "Looking for an experienced Java developer",
    "salary": "8-12 LPA",
    "experienceRequired": "2-4 years",
    "employmentType": "FULL_TIME",
    "status": "OPEN",
    "companyId": "<company-id>",
    "postedByUserId": "<user-id>"
}
```

## How to Run

1. Make sure MongoDB is running on `localhost:27017`
2. Navigate to the `company-job-service` directory
3. Run: `mvn spring-boot:run`
4. The service will start on `http://localhost:8082`
