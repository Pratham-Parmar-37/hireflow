# Interview Service

## Purpose

Manages basic **interview information** for candidates in the HireFlow AI recruitment platform. Tracks interview scheduling, type, status, and feedback.

> **Note:** This service does NOT implement calendar integration, video conferencing, or actual meeting links. It only stores and manages interview records.

## Technology

- Spring Boot 3.2.5
- Spring Data MongoDB
- MongoDB

## Port

`8085`

## Database

`interview_db`

## Entity

### Interview

| Field | Type | Description |
|-------|------|-------------|
| id | String | Auto-generated MongoDB ID |
| applicationId | String | Logical reference to Application Service |
| candidateId | String | Logical reference to Candidate Service |
| interviewDate | String | Date of the interview |
| interviewType | String | ONLINE or OFFLINE |
| status | String | SCHEDULED, COMPLETED, CANCELLED |
| feedback | String | Interview feedback |

## API Endpoints

| Operation | Method | Endpoint | Request Body |
|-----------|--------|----------|--------------|
| Get all interviews | GET | `/api/interviews` | - |
| Get interview by ID | GET | `/api/interviews/{id}` | - |
| Create interview | POST | `/api/interviews` | JSON (see below) |
| Update interview | PUT | `/api/interviews/{id}` | JSON (see below) |
| Delete interview | DELETE | `/api/interviews/{id}` | - |

## Example Request

### Create Interview (POST /api/interviews)

```json
{
    "applicationId": "<application-id>",
    "candidateId": "<candidate-id>",
    "interviewDate": "2026-09-15",
    "interviewType": "ONLINE",
    "status": "SCHEDULED",
    "feedback": ""
}
```

## How to Run

1. Make sure MongoDB is running on `localhost:27017`
2. Navigate to the `interview-service` directory
3. Run: `mvn spring-boot:run`
4. The service will start on `http://localhost:8085`
