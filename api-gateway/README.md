# HireFlow AI – API Gateway Service

## Overview

The **API Gateway Service** serves as the single entry point for all incoming client and frontend requests in the HireFlow AI microservices ecosystem. It routes HTTP traffic to downstream business microservices dynamically using Eureka service discovery and Spring Cloud LoadBalancer.

---

## Key Features

- **Centralized Routing**: Routes all `/api/**` calls through port `8080`.
- **Dynamic Service Discovery**: Integrates with Eureka Server (`lb://<service-name>`) to locate microservice instances without hardcoded ports.
- **Client-Side Load Balancing**: Distributes load across available service replicas using Spring Cloud LoadBalancer.
- **CORS Management**: Global CORS configuration enabled for seamless frontend integration.

---

## Route Mappings

| Client Request Path | Target Microservice | Eureka Service ID | Target Port |
|---------------------|---------------------|-------------------|-------------|
| `/api/users/**` | User Service | `user-service` | 8081 |
| `/api/companies/**` | Company & Job Service | `company-job-service` | 8082 |
| `/api/jobs/**` | Company & Job Service | `company-job-service` | 8082 |
| `/api/candidates/**` | Candidate Service | `candidate-service` | 8083 |
| `/api/applications/**` | Application Service | `application-service` | 8084 |
| `/api/interviews/**` | Interview Service | `interview-service` | 8085 |
| `/api/notifications/**` | Notification Service | `notification-service` | 8086 |

---

## Configuration

- **Port**: `8080`
- **Eureka Server URL**: `http://localhost:8761/eureka/` (configurable via `EUREKA_CLIENT_SERVICEURL_DEFAULTZONE`)
