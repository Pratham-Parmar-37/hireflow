# HireFlow AI – Intelligent Recruitment & Talent Acquisition Platform

### Project Overview

HireFlow AI is a comprehensive, enterprise-grade talent acquisition and hiring pipeline platform built on a distributed **Microservices Architecture**. Developed as part of MCA Semester 3 coursework for the subject **"Microservices and Architecture"**, this platform provides end-to-end recruitment lifecycle orchestration with independent, loosely coupled services, centralized routing, automated CI/CD, and a modern web dashboard.

### Core Architecture & Capabilities

- **Unified API Gateway & UI Host**: Single reactive entry point on port `8088` (mapping internally to `8080`) providing dynamic reverse proxy routing (`lb://`), global CORS handling, and hosting the enterprise web dashboard.
- **Enterprise Web Dashboard**: Responsive interface supporting dual themes with recruitment KPIs, Kanban pipeline, job requisitions, and candidate management. Operational status is isolated in Platform > Service Health.
- **Monitoring**: All eight Spring services expose `/health` and `/prometheus`, with Prometheus collection, HTTP health probes, alert rules, and a provisioned Grafana dashboard. See [monitoring setup and verification](#service-health-and-monitoring).
- **Microservices Domain Stack**: 6 domain services (`user-service`, `company-job-service`, `candidate-service`, `application-service`, `interview-service`, `notification-service`) with full CRUD operations.
- **Service Discovery & Registry**: Netflix Eureka Server (`:8761`) maintaining real-time heartbeat health checks and dynamic client registration.
- **Database-per-Service Pattern**: 6 completely isolated MongoDB databases ensuring strict data encapsulation and domain boundary autonomy.
- **Declarative Inter-Service Communication**: Spring Cloud OpenFeign client enabling `application-service` to dynamically fetch job details from `company-job-service` via Eureka load balancing (`/api/applications/{id}/with-job`).
- **Swagger / OpenAPI Documentation**: Interactive API documentation available on every service.
- **Automated CI/CD Pipeline**: Automated Jenkins pipeline with Git SCM polling, parallel Maven build, single-root Docker containerization, image registry publishing, and Docker Compose orchestration.

---

## Microservices

| # | Service | Port | Database | Description |
|---|---------|------|----------|-------------|
| - | eureka-server | 8761 | - | Central service registry (Eureka Server) |
| 0 | api-gateway | 8080 | - | Central API Gateway (Reverse proxy, routing, load balancing) |
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
                         │   Client / Postman   │
                         └──────────┬───────────┘
                                    │
                              HTTP REST APIs
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │     API Gateway      │
                         │        :8080         │
                         └──────────┬───────────┘
                                    │ (Dynamic Routing via Eureka)
                         ┌──────────┴───────────┐
                         │    Eureka Server     │
                         │        :8761         │
                         └──────────┬───────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │          │          │          │          │
              ↓          ↓          ↓          ↓          ↓
           User      Company &  Candidate  Application Interview
          Service   Job Service  Service    Service     Service
           :8081       :8082      :8083      :8084       :8085
              │          │          │          │          │
              ↓          ↓          ↓          ↓          ↓
           MongoDB    MongoDB    MongoDB    MongoDB    MongoDB
           user_db   company_   candidate_ application interview_
                     job_db        db         db         db

                              Notification
                                Service
                                 :8086
                                   │
                                   ↓
                                MongoDB
                             notification_db
```

**Key Architecture Principles:**
- **Single Entry Point**: All external client requests route through the **API Gateway** on port `8080`
- Each microservice is a **separate Spring Boot application** running on its own port
- Each service has its **own MongoDB database** (database-per-service pattern)
- Services are **loosely coupled** and **independently deployable**
- No service directly accesses another service's database
- Inter-service communication happens through **HTTP REST calls** using **OpenFeign**
- All services register with **Eureka Server** for service discovery
- Each service provides **Swagger UI** for interactive API documentation

### Data Flow Example

1. A **User** registers via User Service (`:8081`)
2. A **Recruiter** creates a **Company** and posts a **Job** via Company & Job Service (`:8082`)
3. A **Candidate** creates their profile via Candidate Service (`:8083`)
4. The Candidate submits an **Application** for the job via Application Service (`:8084`)
5. When viewing the application, Application Service fetches **Job details** from Company & Job Service via declarative OpenFeign (`/api/applications/{id}/with-job`)
6. An **Interview** is scheduled via Interview Service (`:8085`)
7. A **Notification** is created via Notification Service (`:8086`)

---

## API Gateway – Centralized Entry Point & Routing

HireFlow AI features a dedicated **API Gateway** built with **Spring Cloud Gateway** running on port `8080`. Instead of frontends or API consumers calling individual service ports (8081, 8082, etc.) directly, all requests pass through the gateway:

### Features & Capabilities:
- **Centralized Reverse Proxy**: Single entry point on port `8080` for all `/api/**` traffic.
- **Dynamic Service Discovery (`lb://`)**: Routes requests by querying Eureka Server dynamically, eliminating hardcoded hostnames and ports.
- **Client-Side Load Balancing**: Distributes load across available replicas using Spring Cloud LoadBalancer.
- **Global CORS Configuration**: Permits cross-origin requests (`*`) from modern web frontends (React, Angular, Vue).

### API Gateway Route Directory:

| Client Request Path | Target Microservice | Route URI (Eureka) | Internal Port |
|---------------------|---------------------|--------------------|---------------|
| `/api/users/**` | User Service | `lb://user-service` | 8081 |
| `/api/companies/**` | Company & Job Service | `lb://company-job-service` | 8082 |
| `/api/jobs/**` | Company & Job Service | `lb://company-job-service` | 8082 |
| `/api/candidates/**` | Candidate Service | `lb://candidate-service` | 8083 |
| `/api/applications/**` | Application Service | `lb://application-service` | 8084 |
| `/api/interviews/**` | Interview Service | `lb://interview-service` | 8085 |
| `/api/notifications/**` | Notification Service | `lb://notification-service` | 8086 |

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
| API Gateway | `api-gateway` | 8080 |
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
| Spring Cloud Gateway | Reactive API gateway, reverse proxy & load balancer |
| Spring Boot 3.2.5 | Microservice framework |
| Spring Cloud 2023.0.1 | Cloud-native support (Eureka, OpenFeign) |
| Spring Cloud Netflix Eureka | Service registration and discovery |
| Spring Data MongoDB | Database access layer |
| MongoDB | NoSQL database |
| OpenFeign | Inter-service HTTP communication |
| SpringDoc OpenAPI (Swagger) | Interactive API documentation |
| Maven | Dependency management & build tool |
| Docker | Multi-stage containerization (all services) |
| Docker Compose | Multi-container microservices orchestration |
| Jenkins | Automated End-to-End CI/CD Pipeline & GitHub Sync |


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

You can run HireFlow AI using **Docker & Docker Compose** (recommended, zero local Java/Maven/MongoDB installation needed) or **locally via Maven** (traditional manual setup).

---

### Method 1: Docker (Recommended)

Docker packages all 7 microservices into container images, eliminating the need to install Java, Maven, or MongoDB on your host machine.

#### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (v20+ with Docker Compose v2+) installed and running.

---

#### Step 1: Build the Unified Docker Image

The root `Dockerfile` uses a high-performance **multi-stage build**:
1. **Builder Stage (`maven:3.9.6-eclipse-temurin-17`)**: Compiles and packages all 7 microservices (`eureka-server` + 6 business services) into executable JARs with Maven.
2. **Runtime Stage (`eclipse-temurin:17-jre-alpine`)**: Copies the JARs into a lightweight Alpine Linux JRE image (~430 MB total) with the orchestration entrypoint script (`entrypoint.sh`).

To build the image, run the following command from the project root:

```bash
docker build -t hireflow:latest .
```

Verify that the image was created successfully:

```bash
docker images hireflow:latest
```

---

#### Step 2: Create and Run Docker Containers

You have three options to run containers from the image:

##### Option A: Run Full Stack with Docker Compose (Easiest & Most Complete)

The included `docker-compose.yml` launches **MongoDB**, **Eureka Server**, and **all 6 microservices** with health checks, proper startup dependencies, and isolated bridge networking (`hireflow-network`):

```bash
# Start all services in the background (detached mode)
docker compose up -d
```

Check the status of all running containers:
```bash
docker compose ps
```

Follow real-time container logs:
```bash
# View logs from all services
docker compose logs -f

# Or follow logs from a specific service (e.g., eureka-server or user-service)
docker compose logs -f eureka-server
docker compose logs -f user-service
```

Stop and remove all containers and networks:
```bash
docker compose down

# To also remove MongoDB database volume (clean reset):
docker compose down -v
```

##### Option B: Run All Microservices in a Single Docker Container

If you already have MongoDB running on your host machine (or on port 27017) and want to run the entire HireFlow Spring Boot application suite inside a single container:

```bash
# Run all services inside a single container
docker run -d \
  --name hireflow-app \
  -p 8080:8080 \
  -p 8761:8761 \
  -p 8081:8081 \
  -p 8082:8082 \
  -p 8083:8083 \
  -p 8084:8084 \
  -p 8085:8085 \
  -p 8086:8086 \
  -e SPRING_DATA_MONGODB_URI=mongodb://host.docker.internal:27017/ \
  hireflow:latest
```

View logs:
```bash
docker logs -f hireflow-app
```

Stop and remove the container:
```bash
docker stop hireflow-app
docker rm hireflow-app
```

##### Option C: Run Individual Microservice Containers

You can create a container for any specific microservice from the `hireflow:latest` image by passing the service name as an argument or via the `SERVICE_NAME` environment variable:

```bash
# 1. Create a shared Docker network
docker network create hireflow-net

# 2. Start MongoDB
docker run -d --name mongodb --network hireflow-net -p 27017:27017 mongo:7.0

# 3. Start Eureka Server
docker run -d --name eureka-server --network hireflow-net -p 8761:8761 hireflow:latest eureka-server

# 4. Start API Gateway
docker run -d --name api-gateway --network hireflow-net -p 8080:8080 \
  -e EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka/ \
  hireflow:latest api-gateway

# 5. Start User Service
docker run -d --name user-service --network hireflow-net -p 8081:8081 \
  -e SPRING_DATA_MONGODB_URI=mongodb://mongodb:27017/user_db \
  -e EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka/ \
  hireflow:latest user-service

# 5. Start Company & Job Service
docker run -d --name company-job-service --network hireflow-net -p 8082:8082 \
  -e SPRING_DATA_MONGODB_URI=mongodb://mongodb:27017/company_job_db \
  -e EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka/ \
  hireflow:latest company-job-service

# 6. Start Candidate Service
docker run -d --name candidate-service --network hireflow-net -p 8083:8083 \
  -e SPRING_DATA_MONGODB_URI=mongodb://mongodb:27017/candidate_db \
  -e EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka/ \
  hireflow:latest candidate-service

# 7. Start Application Service
docker run -d --name application-service --network hireflow-net -p 8084:8084 \
  -e SPRING_DATA_MONGODB_URI=mongodb://mongodb:27017/application_db \
  -e EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka/ \
  hireflow:latest application-service

# 8. Start Interview Service
docker run -d --name interview-service --network hireflow-net -p 8085:8085 \
  -e SPRING_DATA_MONGODB_URI=mongodb://mongodb:27017/interview_db \
  -e EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka/ \
  hireflow:latest interview-service

# 9. Start Notification Service
docker run -d --name notification-service --network hireflow-net -p 8086:8086 \
  -e SPRING_DATA_MONGODB_URI=mongodb://mongodb:27017/notification_db \
  -e EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka/ \
  hireflow:latest notification-service
```

---

#### Step 3: Verify the Running Containers

Once the containers are running:

1. **Eureka Server Dashboard**: Open [http://localhost:8761](http://localhost:8761). You will see all 6 microservices (`USER-SERVICE`, `COMPANY-JOB-SERVICE`, `CANDIDATE-SERVICE`, `APPLICATION-SERVICE`, `INTERVIEW-SERVICE`, `NOTIFICATION-SERVICE`) registered and marked as `UP`.
2. **Swagger UI (Interactive API Documentation)**:
   - User Service: [http://localhost:8081/swagger-ui/index.html](http://localhost:8081/swagger-ui/index.html)
   - Company & Job Service: [http://localhost:8082/swagger-ui/index.html](http://localhost:8082/swagger-ui/index.html)
   - Candidate Service: [http://localhost:8083/swagger-ui/index.html](http://localhost:8083/swagger-ui/index.html)
   - Application Service: [http://localhost:8084/swagger-ui/index.html](http://localhost:8084/swagger-ui/index.html)
   - Interview Service: [http://localhost:8085/swagger-ui/index.html](http://localhost:8085/swagger-ui/index.html)
   - Notification Service: [http://localhost:8086/swagger-ui/index.html](http://localhost:8086/swagger-ui/index.html)

---

### Method 2: Running Locally (Manual / Without Docker)

If you prefer to run services directly on your host machine:

#### Prerequisites

1. **Java 17** or later installed
2. **Maven 3.9+** installed
3. **MongoDB** running locally on `localhost:27017`

#### Startup Order

> **Important:** The Eureka Server must be running before the microservices start so that the services can register with the registry.

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

Wait for the Eureka Server to start. Verify by opening [http://localhost:8761](http://localhost:8761) in a browser.

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

Open [http://localhost:8761](http://localhost:8761) — all six services should appear as registered instances.

**Step 5: Access Swagger UI**

Open any service's Swagger UI (e.g., [http://localhost:8081/swagger-ui/index.html](http://localhost:8081/swagger-ui/index.html)) to view and test the APIs interactively.


---

---

## Automated CI/CD Pipeline (Jenkins)

HireFlow AI includes a complete declarative **End-to-End CI/CD Pipeline** defined in [`Jenkinsfile`](./Jenkinsfile).

### Pipeline Workflow:

```
  [Source Code Change]
          │
          ▼ (Webhook / SCM Poll every 5m)
┌───────────────────┐
│ 1. SCM Checkout   │  Pulls latest code from GitHub repository
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ 2. Test & Compile │  Builds & verifies all services via clean Maven Docker container
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ 3. Docker Build   │  Packages all 7 microservices + API Gateway into hireflow:latest & hireflow:${BUILD_NUMBER}
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ 4. Deploy Fresh   │  Tears down old instances and spins up fresh container stack via docker compose
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ 5. Push to GitHub │  Automatically pushes changes/tags to GitHub once all tests & deployment pass
└───────────────────┘
```

### Port Allocation:
- **Jenkins Dashboard**: `http://localhost:8080/` (Running as host Windows Service)
- **API Gateway & Web Dashboard**: `http://localhost:8088/` (Interactive Web UI & Reverse Proxy, mapped to host port 8088 in Compose to avoid clash with Jenkins)
- **Eureka Server**: `http://localhost:8761/`
- **Microservices**: `8081` – `8086`

### Setting Up the Pipeline in Jenkins:
1. Open the Jenkins Web Dashboard: **[http://localhost:8080](http://localhost:8080)**
2. Click **New Item** → Enter item name: `HireFlow-CI-CD` → Select **Pipeline** → Click **OK**.
3. Under **Build Triggers**:
   - Check **GitHub hook trigger for GITScm polling** (for instant push triggers via webhook).
   - Check **Poll SCM** with schedule: `H/5 * * * *` (checks every 5 minutes).
4. Under **Pipeline**:
   - Definition: **Pipeline script from SCM**
   - SCM: **Git**
   - Repository URL: `https://github.com/Pratham-Parmar-37/hireflow.git`
   - Credentials: Select your GitHub credentials (or add via *Add → Jenkins* with ID `github-credentials`)
   - Branch Specifier: `*/main`
   - Script Path: `Jenkinsfile`
5. Click **Save** and click **Build Now** to execute the pipeline!

---

## Service Health and Monitoring

The recruitment Overview contains recruitment KPIs and active hiring positions. Platform > Service Health checks all eight Spring applications on demand and every 30 seconds while visible. It does not fetch business records to infer health. Eureka Topology remains available for the architecture and registry.

The previous telemetry initialized every service as healthy, used opaque `no-cors` requests, and marked exceptions healthy too. Its fixed "All 8 Online" label was not evidence of availability. Operational status belongs in the dedicated view; historical metrics belong in Grafana.

### Run

```sh
docker compose up -d --build
```

- **Application**: http://localhost:8088
- **Grafana**: http://localhost:3000/d/hireflow-services
- **Prometheus targets**: http://localhost:9090/targets
- **Prometheus alert rules**: http://localhost:9090/alerts

Grafana's local defaults are `admin` / `hireflow-local-admin`. Set `GRAFANA_ADMIN_USER` and `GRAFANA_ADMIN_PASSWORD` in your environment before the first start to override them. Grafana stores credentials in its persistent volume; changing the variable after initialization does not reset an existing password. Grafana and Prometheus bind to loopback. Remote operators should use an authenticated reverse proxy or SSH forwarding and their deployment's monitoring URLs.

Prometheus, Grafana, and MongoDB use separate named volumes. Do not use `docker compose down -v` when preserving existing data. Monitoring is independent of application startup; no business service depends on a monitoring container.

### Signals

Every Spring application exposes status-only `GET /health` and Micrometer metrics at `GET /prometheus`. Only these Actuator endpoints are exposed. MongoDB contributes to health for the six domain services. Discovery and other standard Actuator health contributors remain enabled. No business endpoints, entities, database names, or OpenFeign calls have been changed.

The browser checks gateway health directly and checks the other seven services via explicit GET-only `/api/platform/health/<service>` gateway routes. Domain routes use Eureka load balancing; the registry route uses `MONITORING_EUREKA_URL` (default `http://localhost:8761`, overridden by Compose). Each proxy route has a 2-second connect timeout and 5-second response timeout; the browser aborts after 7 seconds. Only HTTP success with JSON `status: UP` is healthy. `DOWN` and `OUT_OF_SERVICE` are unhealthy; failed, timed-out, malformed, and other responses are unverified. The displayed response time includes gateway routing. A gateway/discovery failure can prevent verification of an otherwise healthy service.

Prometheus scrapes each container directly every 15 seconds, using internal ports (gateway 8080, not host port 8088). The Blackbox exporter checks `/health`, requiring HTTP 200 and the status-only `{"status":"UP"}` response. `probe_success` measures application health; `up` measures whether metric collection succeeded. They are separate panels so a live JVM with a failed database is not shown as healthy. Missing samples display as no data, not as success.

Grafana is provisioned with health and scrape status, health history and latency, business HTTP request/5xx rates, JVM heap, and CPU. Business rate panels exclude health and metrics traffic. Prometheus retains 15 days of metrics. Rules flag unhealthy services, failed metric scrapes, or unavailable probes after 2 minutes. Rules appear in Prometheus; external notifications require an Alertmanager setup, which is not configured here.

These targets describe the existing single-instance-per-service Compose topology. For replicated or non-Compose deployments, configure service discovery/targets for each instance. With JVMs running directly on the host, use host-reachable addresses instead of Docker service names. Existing service ports and the discovery locator are retained for compatibility; restrict access to those ports and metrics at your deployment boundary if serving outside a trusted development environment.

### Verification

```sh
node --test tests/service-health.test.cjs
docker compose config --quiet
```

Against an **isolated test deployment**, run:

```sh
python tests/smoke-monitoring.py --gateway http://localhost:18088
```

The smoke test checks all eight health endpoints, creates/reads/updates/deletes test records through all seven resource APIs, and checks the application-to-job OpenFeign lookup. Its records are removed in a finally block. Do not point this write test at production. Also verify a stopped service makes both its metric scrape and health probe fail, then recover after restarting it.

Configuration references: [Spring Boot 3.2 Actuator](https://docs.spring.io/spring-boot/docs/3.2.x/reference/html/actuator.html), [Blackbox exporter](https://github.com/prometheus/blackbox_exporter/blob/master/CONFIGURATION.md), and [Grafana provisioning](https://grafana.com/docs/grafana/latest/administration/provisioning/).

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

```text
HireFlow/
├── Jenkinsfile                     (Declarative CI/CD pipeline script)
├── Dockerfile                      (Multi-stage build for all microservices)
├── docker-compose.yml              (Full-stack compose orchestration with MongoDB)
├── entrypoint.sh                   (Container startup script & process manager)
├── pom.xml                         (Root parent aggregator Maven POM)
├── .dockerignore                   (Docker build exclusions)
├── .gitignore
├── README.md
├── notes/                          (PDF reference notes - gitignored)
├── monitoring/                     (Prometheus, Alertmanager & Grafana configs)
├── tests/                          (Automated test suites & smoke verification)
│
├── database/
│   └── mongodb/
│       ├── create_database.js      (Database initialization & connection script)
│       ├── create_collections.js   (Collection & index creation script)
│       └── insert_data.js          (Pre-built idempotent seed data script)
│
└── src/
    ├── eureka-server/
    │   ├── README.md
    │   ├── pom.xml
    │   └── src/main/java/com/hireflow/eurekaserver/
    │       └── EurekaServerApplication.java
    │
    ├── api-gateway/
    │   ├── README.md
    │   ├── pom.xml
    │   └── src/main/java/com/hireflow/apigateway/
    │       └── ApiGatewayApplication.java
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
    └── notification-service/
        ├── README.md
        ├── pom.xml
        └── src/main/java/com/hireflow/notificationservice/
            ├── NotificationServiceApplication.java
            ├── config/OpenApiConfig.java
            ├── controller/NotificationController.java
            ├── service/NotificationService.java
            ├── repository/NotificationRepository.java
            └── entity/Notification.java
```
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
| Docker Containerization | Multi-stage Dockerfile packaging all services into an Alpine JRE runtime |
| API Gateway & Routing | Spring Cloud Gateway with reactive routing (lb://) via Eureka on port 8080 |
| CI/CD Pipeline | End-to-End automated build, test, Docker deploy, and Git push via Jenkins |
| Docker Compose Orchestration | Multi-container compose stack with MongoDB, Eureka, and health-checked dependencies |

