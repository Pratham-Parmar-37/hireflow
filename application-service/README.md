# Application Service

## Purpose

Manages **job applications** submitted by candidates for the HireFlow AI recruitment platform. This service also demonstrates **inter-service communication** using **OpenFeign** by fetching job details from the Company & Job Service.

## Technology

- Spring Boot 3.2.5
- Spring Data MongoDB
- Spring Cloud OpenFeign
- MongoDB

## Port

`8084`

## Database

`application_db`

## Entity

### Application

| Field | Type | Description |
|-------|------|-------------|
| id | String | Auto-generated MongoDB ID |
| candidateId | String | Logical reference to Candidate Service |
| jobId | String | Logical reference to Company & Job Service |
| applicationDate | String | Date of application |
| status | String | APPLIED, SHORTLISTED, REJECTED, SELECTED |

## Inter-Service Communication

This service uses **OpenFeign** to communicate with the **Company & Job Service** (port 8082).

The `GET /api/applications/{id}/with-job` endpoint fetches the application data and then calls the Company & Job Service to retrieve the associated job details.

```java
@FeignClient(name = "company-job-service", url = "http://localhost:8082")
public interface JobClient {
    @GetMapping("/api/jobs/{id}")
    Map<String, Object> getJobById(@PathVariable("id") String id);
}
```

## API Endpoints

| Operation | Method | Endpoint | Request Body |
|-----------|--------|----------|--------------|
| Get all applications | GET | `/api/applications` | - |
| Get application by ID | GET | `/api/applications/{id}` | - |
| Get application with job details | GET | `/api/applications/{id}/with-job` | - |
| Create application | POST | `/api/applications` | JSON (see below) |
| Update application | PUT | `/api/applications/{id}` | JSON (see below) |
| Delete application | DELETE | `/api/applications/{id}` | - |

## Example Request

### Create Application (POST /api/applications)

```json
{
    "candidateId": "<candidate-id>",
    "jobId": "<job-id>",
    "applicationDate": "2026-08-31",
    "status": "APPLIED"
}
```

### Get Application with Job Details (GET /api/applications/{id}/with-job)

**Response:**

```json
{
    "application": {
        "id": "64f1a2b3...",
        "candidateId": "...",
        "jobId": "...",
        "applicationDate": "2026-08-31",
        "status": "APPLIED"
    },
    "jobDetails": {
        "id": "...",
        "title": "Java Developer",
        "description": "Looking for an experienced Java developer",
        "salary": "8-12 LPA",
        "status": "OPEN"
    }
}
```

## How to Run

1. Make sure MongoDB is running on `localhost:27017`
2. Start the **Company & Job Service** first (port 8082)
3. Navigate to the `application-service` directory
4. Run: `mvn spring-boot:run`
5. The service will start on `http://localhost:8084`
