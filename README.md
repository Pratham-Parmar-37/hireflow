# HireFlow AI – Intelligent Recruitment & Talent Acquisition Platform

## Phase 2 – Development of Microservices

### Project Description

HireFlow AI is a recruitment/hiring platform designed using **Microservices Architecture**. This project is developed as part of MCA Semester 3 coursework for the subject **"Microservices and Architecture"**.

### Phase 2 Objective

Build **6 Spring Boot microservices** with:
- Basic CRUD operations for each service
- MongoDB database-per-service architecture
- Inter-service communication using OpenFeign
- Proper REST API documentation

This phase focuses on demonstrating core microservice concepts: independently deployable services, each owning its own database, communicating through lightweight HTTP mechanisms.

---

## Microservices

| # | Service | Port | Database | Description |
|---|---------|------|----------|-------------|
| 1 | user-service | 8081 | user_db | Manages basic user information (candidates and recruiters) |
| 2 | company-job-service | 8082 | company_job_db | Manages companies and job postings |
| 3 | candidate-service | 8083 | candidate_db | Manages candidate profile information |
| 4 | application-service | 8084 | application_db | Manages job applications submitted by candidates |
| 5 | interview-service | 8085 | interview_db | Manages interview scheduling information |
| 6 | notification-service | 8086 | notification_db | Stores notification records |

---

## Architecture Overview

```
                        Client / Postman
                              |
                              | HTTP REST
                              |
    ---------------------------------------------------------------
    |           |            |            |           |            |
  User      Company &    Candidate   Application  Interview  Notification
  Service   Job Service  Service     Service      Service    Service
  :8081     :8082        :8083       :8084        :8085      :8086
    |           |            |            |           |            |
  MongoDB    MongoDB      MongoDB     MongoDB     MongoDB     MongoDB
  user_db    company_     candidate_  application_ interview_  notification_
             job_db       db          db           db          db
```

**Key Architecture Principles:**
- Each microservice is a **separate Spring Boot application** running on its own port
- Each service has its **own MongoDB database** (database-per-service pattern)
- Services are **loosely coupled** and **independently deployable**
- No service directly accesses another service's database
- Inter-service communication happens through **HTTP REST calls** using **OpenFeign**

---

## Technology Stack

| Technology | Purpose |
|------------|---------|
| Java 17 | Programming language |
| Spring Boot 3.2.5 | Microservice framework |
| Spring Data MongoDB | Database access layer |
| MongoDB | NoSQL database (local) |
| OpenFeign | Inter-service HTTP communication |
| Maven | Build tool |

---

## Database Architecture

This project follows the **database-per-service** pattern. Each microservice connects to its own dedicated MongoDB database:

| Service | Database |
|---------|----------|
| user-service | user_db |
| company-job-service | company_job_db |
| candidate-service | candidate_db |
| application-service | application_db |
| interview-service | interview_db |
| notification-service | notification_db |

MongoDB auto-creates databases and collections on first write, so **no manual database setup is required** beyond having MongoDB running.

---

## Inter-Service Communication

The project demonstrates **synchronous HTTP communication** between microservices using **OpenFeign**.

### Implementation

**Application Service → Company & Job Service**

When retrieving an application with job details (`GET /api/applications/{id}/with-job`), the Application Service uses OpenFeign to call the Company & Job Service and fetch the associated job information.

```
Application Service (port 8084)
        |
        | OpenFeign HTTP GET
        |
        ▼
Company & Job Service (port 8082)
    GET /api/jobs/{id}
```

This is implemented using a Feign client interface:

```java
@FeignClient(name = "company-job-service", url = "http://localhost:8082")
public interface JobClient {
    @GetMapping("/api/jobs/{id}")
    Map<String, Object> getJobById(@PathVariable("id") String id);
}
```

> **Note:** Eureka Server is optional for Phase 2. The current implementation uses simple service URLs for OpenFeign communication to keep the project focused on the core microservice, CRUD, MongoDB, and communication concepts.

---

## How to Run

### Prerequisites

1. **Java 17** or later installed
2. **Maven 3.9+** installed (or use Maven Wrapper if provided)
3. **MongoDB** running locally on `localhost:27017`

### Step 1: Start MongoDB

Make sure MongoDB is running on the default port (27017):

```bash
# If MongoDB is installed as a service (Windows)
net start MongoDB

# Or start manually
mongod --dbpath <your-data-directory>
```

### Step 2: Build Each Service

Open a terminal in each service directory and run:

```bash
mvn clean compile
```

### Step 3: Run Each Service

Start each service in a **separate terminal window**:

```bash
# Terminal 1 - User Service
cd user-service
mvn spring-boot:run

# Terminal 2 - Company & Job Service
cd company-job-service
mvn spring-boot:run

# Terminal 3 - Candidate Service
cd candidate-service
mvn spring-boot:run

# Terminal 4 - Application Service
cd application-service
mvn spring-boot:run

# Terminal 5 - Interview Service
cd interview-service
mvn spring-boot:run

# Terminal 6 - Notification Service
cd notification-service
mvn spring-boot:run
```

> **Important:** For the OpenFeign communication to work, start **company-job-service** (port 8082) before **application-service** (port 8084).

---

## API Summary

### User Service (Port 8081)

| Operation | Method | Endpoint |
|-----------|--------|----------|
| Get all users | GET | `/api/users` |
| Get user by ID | GET | `/api/users/{id}` |
| Create user | POST | `/api/users` |
| Update user | PUT | `/api/users/{id}` |
| Delete user | DELETE | `/api/users/{id}` |

### Company & Job Service (Port 8082)

| Operation | Method | Endpoint |
|-----------|--------|----------|
| Get all companies | GET | `/api/companies` |
| Get company by ID | GET | `/api/companies/{id}` |
| Create company | POST | `/api/companies` |
| Update company | PUT | `/api/companies/{id}` |
| Delete company | DELETE | `/api/companies/{id}` |
| Get all jobs | GET | `/api/jobs` |
| Get job by ID | GET | `/api/jobs/{id}` |
| Create job | POST | `/api/jobs` |
| Update job | PUT | `/api/jobs/{id}` |
| Delete job | DELETE | `/api/jobs/{id}` |

### Candidate Service (Port 8083)

| Operation | Method | Endpoint |
|-----------|--------|----------|
| Get all candidates | GET | `/api/candidates` |
| Get candidate by ID | GET | `/api/candidates/{id}` |
| Create candidate | POST | `/api/candidates` |
| Update candidate | PUT | `/api/candidates/{id}` |
| Delete candidate | DELETE | `/api/candidates/{id}` |

### Application Service (Port 8084)

| Operation | Method | Endpoint |
|-----------|--------|----------|
| Get all applications | GET | `/api/applications` |
| Get application by ID | GET | `/api/applications/{id}` |
| Get application with job details | GET | `/api/applications/{id}/with-job` |
| Create application | POST | `/api/applications` |
| Update application | PUT | `/api/applications/{id}` |
| Delete application | DELETE | `/api/applications/{id}` |

### Interview Service (Port 8085)

| Operation | Method | Endpoint |
|-----------|--------|----------|
| Get all interviews | GET | `/api/interviews` |
| Get interview by ID | GET | `/api/interviews/{id}` |
| Create interview | POST | `/api/interviews` |
| Update interview | PUT | `/api/interviews/{id}` |
| Delete interview | DELETE | `/api/interviews/{id}` |

### Notification Service (Port 8086)

| Operation | Method | Endpoint |
|-----------|--------|----------|
| Get all notifications | GET | `/api/notifications` |
| Get notification by ID | GET | `/api/notifications/{id}` |
| Create notification | POST | `/api/notifications` |
| Update notification | PUT | `/api/notifications/{id}` |
| Delete notification | DELETE | `/api/notifications/{id}` |

---

## Example API Requests

### Create a User (POST)

```bash
curl -X POST http://localhost:8081/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "CANDIDATE"
  }'
```

### Create a Company (POST)

```bash
curl -X POST http://localhost:8082/api/companies \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "TechCorp",
    "industry": "Information Technology",
    "location": "Mumbai",
    "website": "https://techcorp.com",
    "description": "A leading IT company"
  }'
```

### Create a Job (POST)

```bash
curl -X POST http://localhost:8082/api/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Java Developer",
    "description": "Looking for an experienced Java developer",
    "salary": "8-12 LPA",
    "experienceRequired": "2-4 years",
    "employmentType": "FULL_TIME",
    "status": "OPEN",
    "companyId": "<company-id>",
    "postedByUserId": "<user-id>"
  }'
```

### Create a Candidate (POST)

```bash
curl -X POST http://localhost:8083/api/candidates \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "<user-id>",
    "fullName": "John Doe",
    "email": "john@example.com",
    "resumeUrl": "https://resumes.hireflow.ai/john-doe-resume.pdf",
    "skills": ["Java", "Spring Boot", "MongoDB"],
    "experience": "3 years in software development",
    "education": "MCA from Mumbai University"
  }'
```

### Create an Application (POST)

```bash
curl -X POST http://localhost:8084/api/applications \
  -H "Content-Type: application/json" \
  -d '{
    "candidateId": "<candidate-id>",
    "jobId": "<job-id>",
    "applicationDate": "2026-08-31",
    "status": "APPLIED"
  }'
```

### Get Application with Job Details (OpenFeign Demo)

```bash
curl http://localhost:8084/api/applications/<application-id>/with-job
```

### Create an Interview (POST)

```bash
curl -X POST http://localhost:8085/api/interviews \
  -H "Content-Type: application/json" \
  -d '{
    "applicationId": "<application-id>",
    "candidateId": "<candidate-id>",
    "interviewDate": "2026-09-15",
    "interviewType": "ONLINE",
    "status": "SCHEDULED",
    "feedback": ""
  }'
```

### Create a Notification (POST)

```bash
curl -X POST http://localhost:8086/api/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "<user-id>",
    "message": "Your application has been shortlisted!",
    "type": "APPLICATION",
    "status": "UNREAD",
    "createdAt": "2026-08-31T10:00:00"
  }'
```

---

## Project Structure

```
HireFlow/
├── .gitignore
├── README.md
├── notes/                          (PDF reference notes - gitignored)
│
├── user-service/
│   ├── README.md
│   ├── pom.xml
│   └── src/main/java/com/hireflow/userservice/
│       ├── UserServiceApplication.java
│       ├── controller/UserController.java
│       ├── service/UserService.java
│       ├── repository/UserRepository.java
│       └── entity/User.java
│
├── company-job-service/
│   ├── README.md
│   ├── pom.xml
│   └── src/main/java/com/hireflow/companyjobservice/
│       ├── CompanyJobServiceApplication.java
│       ├── controller/CompanyController.java
│       ├── controller/JobController.java
│       ├── service/CompanyService.java
│       ├── service/JobService.java
│       ├── repository/CompanyRepository.java
│       ├── repository/JobRepository.java
│       ├── entity/Company.java
│       └── entity/Job.java
│
├── candidate-service/
│   ├── README.md
│   ├── pom.xml
│   └── src/main/java/com/hireflow/candidateservice/
│       ├── CandidateServiceApplication.java
│       ├── controller/CandidateController.java
│       ├── service/CandidateService.java
│       ├── repository/CandidateRepository.java
│       └── entity/Candidate.java
│
├── application-service/
│   ├── README.md
│   ├── pom.xml
│   └── src/main/java/com/hireflow/applicationservice/
│       ├── ApplicationServiceApplication.java
│       ├── controller/ApplicationController.java
│       ├── service/ApplicationService.java
│       ├── repository/ApplicationRepository.java
│       ├── entity/Application.java
│       └── client/JobClient.java
│
├── interview-service/
│   ├── README.md
│   ├── pom.xml
│   └── src/main/java/com/hireflow/interviewservice/
│       ├── InterviewServiceApplication.java
│       ├── controller/InterviewController.java
│       ├── service/InterviewService.java
│       ├── repository/InterviewRepository.java
│       └── entity/Interview.java
│
├── notification-service/
│   ├── README.md
│   ├── pom.xml
│   └── src/main/java/com/hireflow/notificationservice/
│       ├── NotificationServiceApplication.java
│       ├── controller/NotificationController.java
│       ├── service/NotificationService.java
│       ├── repository/NotificationRepository.java
│       └── entity/Notification.java
│
└── docs/
    └── architecture.md
```

---

## Scope Limitations (Phase 2)

The following features are **intentionally NOT implemented** in Phase 2:

- ❌ JWT authentication / Spring Security / login
- ❌ Password encryption
- ❌ AI/ML resume processing
- ❌ File upload/storage
- ❌ Email/SMS notifications (service only stores records)
- ❌ Eureka Service Discovery
- ❌ API Gateway
- ❌ Swagger documentation
- ❌ Docker / Kubernetes
- ❌ Kafka / RabbitMQ (async messaging)
- ❌ Redis caching
- ❌ Frontend / React
- ❌ Cloud deployment

These features may be implemented in future phases.

---

## Course Concepts Demonstrated

| Concept | Where Demonstrated |
|---------|-------------------|
| Microservices Architecture | 6 independent Spring Boot services |
| Spring Boot | @SpringBootApplication in each service |
| Dependency Injection | Constructor injection in all Controllers and Services |
| REST APIs | @RestController, @GetMapping, @PostMapping, etc. |
| CRUD Operations | Full create/read/update/delete in every service |
| Spring Data MongoDB | MongoRepository for database access |
| Database-per-Service | 6 separate MongoDB databases |
| Inter-service Communication | OpenFeign (Application Service → Job Service) |
| Loosely Coupled Services | No cross-database access, only HTTP communication |
