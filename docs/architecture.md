# HireFlow AI – Architecture Document

## Phase 2 – Microservices Architecture

### System Architecture

HireFlow AI follows a **microservices architecture** where the application is divided into 6 small, independently deployable services. Each service is responsible for a specific business capability and owns its own database.

### Architecture Diagram

```
                            ┌─────────────────────┐
                            │   Client / Postman   │
                            └──────────┬──────────┘
                                       │
                                 HTTP REST APIs
                                       │
        ┌──────────────────────────────┼──────────────────────────────┐
        │              │               │              │               │
        ▼              ▼               ▼              ▼               ▼
  ┌──────────┐  ┌────────────┐  ┌───────────┐  ┌──────────┐  ┌────────────┐
  │   User   │  │ Company &  │  │ Candidate │  │Interview │  │Notification│
  │ Service  │  │Job Service │  │  Service  │  │ Service  │  │  Service   │
  │  :8081   │  │   :8082    │  │   :8083   │  │  :8085   │  │   :8086    │
  └────┬─────┘  └─────┬──────┘  └─────┬─────┘  └────┬─────┘  └─────┬──────┘
       │              │               │              │               │
       ▼              ▼               ▼              ▼               ▼
   ┌────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
   │user_db │   │company_  │   │candidate_│   │interview_│   │notifica- │
   │        │   │job_db    │   │db        │   │db        │   │tion_db   │
   └────────┘   └──────────┘   └──────────┘   └──────────┘   └──────────┘

                              ┌─────────────┐
                              │ Application │
                              │   Service   │
                              │    :8084    │
                              └──────┬──────┘
                                     │
                              ┌──────▼──────┐
                              │application_ │
                              │db           │
                              └─────────────┘
```

### Inter-Service Communication

```
  ┌─────────────────┐         OpenFeign          ┌──────────────────┐
  │   Application   │  ─────────────────────▶   │  Company & Job   │
  │    Service      │   GET /api/jobs/{id}       │    Service       │
  │   (port 8084)   │                            │   (port 8082)    │
  └─────────────────┘                            └──────────────────┘
```

The Application Service uses **OpenFeign** (a declarative HTTP client) to call the Company & Job Service when retrieving an application with job details.

### Design Principles

1. **Single Responsibility**: Each service handles one business domain
2. **Database per Service**: No shared databases between services
3. **Loose Coupling**: Services communicate only through HTTP APIs
4. **Independent Deployment**: Each service can be started/stopped independently
5. **Lightweight Communication**: Simple REST/HTTP calls using OpenFeign

### Service Responsibilities

| Service | Responsibility |
|---------|---------------|
| User Service | User registration and profile management |
| Company & Job Service | Company profiles and job posting management |
| Candidate Service | Candidate profiles with skills and experience |
| Application Service | Job application tracking and management |
| Interview Service | Interview scheduling and feedback |
| Notification Service | Notification record storage |

### Data Flow Example

1. A **User** registers via User Service
2. A **Recruiter** creates a **Company** and posts a **Job** via Company & Job Service
3. A **Candidate** creates their profile via Candidate Service
4. The Candidate submits an **Application** for the job via Application Service
5. When viewing the application, Application Service fetches **Job details** from Company & Job Service (OpenFeign)
6. An **Interview** is scheduled via Interview Service
7. A **Notification** is created via Notification Service
