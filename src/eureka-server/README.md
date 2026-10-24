# Eureka Server

## Purpose

The Eureka Server acts as the **central service registry** for the HireFlow AI microservices architecture. All microservices register themselves with this server as Eureka Clients. When one service needs to communicate with another service, the target service can be discovered using its registered service name instead of relying on a hardcoded host and port.

## Port

`8761`

## What It Does

- Receives service registrations from all six HireFlow AI microservices
- Maintains a registry of all registered services and their locations
- Allows services to discover other services dynamically by name
- Provides a web dashboard to view all registered services

## Configuration

```properties
spring.application.name=eureka-server
server.port=8761
eureka.client.register-with-eureka=false
eureka.client.fetch-registry=false
```

- `register-with-eureka=false` — The Eureka Server does not register with itself
- `fetch-registry=false` — The Eureka Server does not need to fetch the registry from itself

## How to Run

1. Navigate to the `eureka-server` directory
2. Run: `mvn spring-boot:run`
3. The Eureka Server will start on `http://localhost:8761`
4. Open `http://localhost:8761` in a browser to see the Eureka Dashboard

> **Important:** Start the Eureka Server **before** starting any of the microservices so that they can register with the registry when they start up.

## Registered Services

Once all microservices are running, the following services will appear on the Eureka Dashboard:

| Service Name | Port |
|-------------|------|
| user-service | 8081 |
| company-job-service | 8082 |
| candidate-service | 8083 |
| application-service | 8084 |
| interview-service | 8085 |
| notification-service | 8086 |

## Technology

- Spring Boot 3.2.5
- Spring Cloud Netflix Eureka Server
- Spring Cloud 2023.0.1
