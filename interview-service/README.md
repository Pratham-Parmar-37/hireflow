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
2. Make sure the **Eureka Server** is running on `localhost:8761`
3. Navigate to the `interview-service` directory
4. Run: `mvn spring-boot:run`
5. The service will start on `http://localhost:8085`

---

### Eureka

This service is registered as an **Eureka Client** with the central Eureka Server.

- **Eureka Server address:** `http://localhost:8761/eureka/`
- **Service name registered with Eureka:** `interview-service`
- **Registration:** Automatic on startup — the service registers itself with the Eureka Server and sends periodic heartbeats

Once running, this service will appear on the Eureka Dashboard at `http://localhost:8761`.

### Swagger

This service provides **interactive API documentation** using Swagger (OpenAPI).

- **Swagger UI URL:** [http://localhost:8085/swagger-ui/index.html](http://localhost:8085/swagger-ui/index.html)
- **OpenAPI JSON:** [http://localhost:8085/v3/api-docs](http://localhost:8085/v3/api-docs)

**Available CRUD APIs on Swagger UI:**

| Method | Endpoint |
|--------|----------|
| GET | `/api/interviews` |
| GET | `/api/interviews/{id}` |
| POST | `/api/interviews` |
| PUT | `/api/interviews/{id}` |
| DELETE | `/api/interviews/{id}` |
