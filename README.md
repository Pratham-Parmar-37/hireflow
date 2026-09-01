# HireFlow AI – Intelligent Recruitment & Talent Acquisition Platform

## Phase 2 – Development of Microservices

### Project Description

HireFlow AI is a recruitment/hiring platform designed using **Microservices Architecture**. This project is developed as part of MCA Semester 3 coursework for the subject **"Microservices and Architecture"**.

### Phase 2 Objective

Build **6 Spring Boot microservices** with:
- Basic CRUD operations for each service
- MongoDB database-per-service architecture
- Inter-service communication using OpenFeign
- **Eureka Server** for service registration and discovery
- **Swagger/OpenAPI** interactive API documentation
- Proper REST API documentation

This phase focuses on demonstrating core microservice concepts: independently deployable services, each owning its own database, communicating through lightweight HTTP mechanisms, discovering each other via a central service registry, and providing interactive API documentation.

---

## Microservices

| # | Service | Port | Database | Description |
|---|---------|------|----------|-------------|
| - | eureka-server | 8761 | - | Central service registry (Eureka Server) |
| 1 | user-service | 8081 | user_db | Manages basic user information (candidates and recruiters) |
| 2 | company-job-service | 8082 | company_job_db | Manages companies and job postings |
| 3 | candidate-service | 8083 | candidate_db | Manages candidate profile information |
| 4 | application-service | 8084 | application_db | Manages job applications submitted by candidates |
| 5 | interview-service | 8085 | interview_db | Manages interview scheduling information |
| 6 | notification-service | 8086 | notification_db | Stores notification records |

---

## Architecture Overview

```
                         ┌──────────────────────┐
                         │    Eureka Server      │
                         │       :8761           │
                         └──────────┬────────────┘
                                    │
             ┌──────────────────────┼──────────────────────┐
             │          │           │          │            │
             ↓          ↓           ↓          ↓            ↓
          User      Company &   Candidate  Application   Interview
         Service    Job Service  Service    Service      Service
          :8081       :8082       :8083       :8084        :8085
             │          │           │          │            │
             ↓          ↓           ↓          ↓            ↓
          MongoDB    MongoDB     MongoDB    MongoDB      MongoDB
          user_db    company_    candidate_ application_ interview_
                     job_db      db         db           db

                              Notification
                                Service
                                  :8086
                                    │
                                    ↓
                                 MongoDB
                              notification_db
```

**Key Architecture Principles:**
- Each microservice is a **separate Spring Boot application** running on its own port
- Each service has its **own MongoDB database** (database-per-service pattern)
- Services are **loosely coupled** and **independently deployable**
- No service directly accesses another service's database
- Inter-service communication happens through **HTTP REST calls** using **OpenFeign**
- All services register with **Eureka Server** for service discovery
- Each service provides **Swagger UI** for interactive API documentation

---

## Eureka Server – Service Registry

Eureka Server acts as a **central service registry**. The microservices register themselves as Eureka Clients. When one service needs to communicate with another service, the target service can be discovered using its registered service name instead of relying on a hardcoded host and port.

### How It Works

1. **Eureka Server** starts on port `8761` and waits for service registrations
2. Each microservice starts and **registers itself** with the Eureka Server (as an Eureka Client)
3. The Eureka Server maintains a **registry** of all registered services and their network locations
4. When a service needs to call another service, it queries Eureka to **discover** the target service by name
5. Services send periodic **heartbeats** to the Eureka Server to indicate they are still running

### Eureka Dashboard

Once all services are running, the Eureka Dashboard is accessible at:

**http://localhost:8761**

The dashboard shows all registered service instances.

---

## Eureka Client Registration

All six microservices are configured as Eureka Clients:

| Service | Eureka Name | Port |
|---------|-------------|------|
| User Service | `user-service` | 8081 |
| Company & Job Service | `company-job-service` | 8082 |
| Candidate Service | `candidate-service` | 8083 |
| Application Service | `application-service` | 8084 |
| Interview Service | `interview-service` | 8085 |
| Notification Service | `notification-service` | 8086 |

Each service registers with:
```properties
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
eureka.instance.prefer-ip-address=true
```

---

## Service Discovery with OpenFeign

The project demonstrates **service discovery** using **Eureka** combined with **OpenFeign** for inter-service communication.

### Implementation: Application Service → Company & Job Service

When retrieving an application with job details (`GET /api/applications/{id}/with-job`), the Application Service uses OpenFeign to call the Company & Job Service. The target service is discovered via Eureka using its registered service name.

```
Application Service (port 8084)
        │
        │ OpenFeign
        ↓
Eureka Server (port 8761)
        │
        │ discovers company-job-service
        ↓
Company & Job Service (port 8082)
    GET /api/jobs/{id}
```

This is implemented using a Feign client interface:

```java
@FeignClient(name = "company-job-service")
public interface JobClient {
    @GetMapping("/api/jobs/{id}")
    Map<String, Object> getJobById(@PathVariable("id") String id);
}
```

> **Note:** The `@FeignClient` annotation uses only the Eureka service name (`company-job-service`). There is no hardcoded URL. Eureka discovers the service location automatically.

---

## Swagger API Documentation

Each microservice provides **interactive API documentation** using **Swagger (OpenAPI)**. The Swagger UI allows you to:

- See all available endpoints
- See GET/POST/PUT/DELETE operations
- See request bodies and path parameters
- Try API requests directly from the browser

### Swagger UI URLs

| Service | Swagger UI URL |
|---------|---------------|
| User Service | http://localhost:8081/swagger-ui/index.html |
| Company & Job Service | http://localhost:8082/swagger-ui/index.html |
| Candidate Service | http://localhost:8083/swagger-ui/index.html |
| Application Service | http://localhost:8084/swagger-ui/index.html |
| Interview Service | http://localhost:8085/swagger-ui/index.html |
| Notification Service | http://localhost:8086/swagger-ui/index.html |

---

## Technology Stack

| Technology | Purpose |
|------------|---------|
| Java 17 | Programming language |
| Spring Boot 3.2.5 | Microservice framework |
| Spring Cloud 2023.0.1 | Cloud-native support (Eureka, OpenFeign) |
| Spring Cloud Netflix Eureka | Service registration and discovery |
| Spring Data MongoDB | Database access layer |
| MongoDB | NoSQL database (local) |
| OpenFeign | Inter-service HTTP communication |
| SpringDoc OpenAPI (Swagger) | Interactive API documentation |
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

## How to Run

### Prerequisites

1. **Java 17** or later installed
2. **Maven 3.9+** installed (or use Maven Wrapper if provided)
3. **MongoDB** running locally on `localhost:27017`

### Startup Order

> **Important:** The Eureka Server should be running before the microservices start so that the services can register with the registry.

**Step 1: Start MongoDB**

Make sure MongoDB is running on the default port (27017):

```bash
# If MongoDB is installed as a service (Windows)
net start MongoDB

# Or start manually
mongod --dbpath <your-data-directory>
```

**Step 2: Start Eureka Server**

```bash
cd eureka-server
mvn spring-boot:run
```

Wait for the Eureka Server to start. Verify by opening http://localhost:8761 in a browser.

**Step 3: Start All Microservices**

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

**Step 4: Verify Eureka Registration**

Open http://localhost:8761 — all six services should appear as registered instances.

**Step 5: Access Swagger UI**

Open any service's Swagger UI (e.g., http://localhost:8081/swagger-ui/index.html) to view and test the APIs interactively.

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

### Get Application with Job Details (OpenFeign + Eureka Demo)

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
├── eureka-server/
│   ├── README.md
│   ├── pom.xml
│   └── src/main/java/com/hireflow/eurekaserver/
│       └── EurekaServerApplication.java
│
├── user-service/
│   ├── README.md
│   ├── pom.xml
│   └── src/main/java/com/hireflow/userservice/
│       ├── UserServiceApplication.java
│       ├── config/OpenApiConfig.java
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
│       ├── config/OpenApiConfig.java
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
│       ├── config/OpenApiConfig.java
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
│       ├── config/OpenApiConfig.java
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
│       ├── config/OpenApiConfig.java
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
│       ├── config/OpenApiConfig.java
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
- ❌ API Gateway
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
| Microservices Architecture | 7 independent Spring Boot services (6 business + 1 Eureka) |
| Spring Boot | @SpringBootApplication in each service |
| Dependency Injection | Constructor injection in all Controllers and Services |
| REST APIs | @RestController, @GetMapping, @PostMapping, etc. |
| CRUD Operations | Full create/read/update/delete in every service |
| Spring Data MongoDB | MongoRepository for database access |
| Database-per-Service | 6 separate MongoDB databases |
| Eureka Server | Central service registry on port 8761 |
| Eureka Client | All 6 services register as Eureka Clients |
| Service Discovery | OpenFeign discovers services via Eureka name |
| Inter-service Communication | OpenFeign (Application Service → Job Service via Eureka) |
| Swagger/OpenAPI | Interactive API documentation for all services |
| Loosely Coupled Services | No cross-database access, only HTTP communication |
