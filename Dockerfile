# ==============================================================================
# Multi-stage Dockerfile for HireFlow AI Microservices Platform
# Java 17 | Spring Boot 3.2.5 | Spring Cloud 2023.0.1
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Build all microservice JARs using Maven
# ------------------------------------------------------------------------------
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /workspace

# 1. Eureka Server
COPY src/eureka-server/pom.xml src/eureka-server/
COPY src/eureka-server/src src/eureka-server/src
RUN mvn -f src/eureka-server/pom.xml clean package -DskipTests

# 2. User Service
COPY src/user-service/pom.xml src/user-service/
COPY src/user-service/src src/user-service/src
RUN mvn -f src/user-service/pom.xml clean package -DskipTests

# 3. Company & Job Service
COPY src/company-job-service/pom.xml src/company-job-service/
COPY src/company-job-service/src src/company-job-service/src
RUN mvn -f src/company-job-service/pom.xml clean package -DskipTests

# 4. Candidate Service
COPY src/candidate-service/pom.xml src/candidate-service/
COPY src/candidate-service/src src/candidate-service/src
RUN mvn -f src/candidate-service/pom.xml clean package -DskipTests

# 5. Application Service
COPY src/application-service/pom.xml src/application-service/
COPY src/application-service/src src/application-service/src
RUN mvn -f src/application-service/pom.xml clean package -DskipTests

# 6. Interview Service
COPY src/interview-service/pom.xml src/interview-service/
COPY src/interview-service/src src/interview-service/src
RUN mvn -f src/interview-service/pom.xml clean package -DskipTests

# 7. Notification Service
COPY src/notification-service/pom.xml src/notification-service/
COPY src/notification-service/src src/notification-service/src
RUN mvn -f src/notification-service/pom.xml clean package -DskipTests

# 8. API Gateway
COPY src/api-gateway/pom.xml src/api-gateway/
COPY src/api-gateway/src src/api-gateway/src
RUN mvn -f src/api-gateway/pom.xml clean package -DskipTests

# ------------------------------------------------------------------------------
# Stage 2: Minimal runtime image
# ------------------------------------------------------------------------------
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Install bash and curl for discovery health checks and orchestration
RUN apk add --no-cache bash curl

# Copy packaged JAR artifacts from builder stage
COPY --from=builder /workspace/src/eureka-server/target/eureka-server-*.jar /app/eureka-server.jar
COPY --from=builder /workspace/src/api-gateway/target/api-gateway-*.jar /app/api-gateway.jar
COPY --from=builder /workspace/src/user-service/target/user-service-*.jar /app/user-service.jar
COPY --from=builder /workspace/src/company-job-service/target/company-job-service-*.jar /app/company-job-service.jar
COPY --from=builder /workspace/src/candidate-service/target/candidate-service-*.jar /app/candidate-service.jar
COPY --from=builder /workspace/src/application-service/target/application-service-*.jar /app/application-service.jar
COPY --from=builder /workspace/src/interview-service/target/interview-service-*.jar /app/interview-service.jar
COPY --from=builder /workspace/src/notification-service/target/notification-service-*.jar /app/notification-service.jar

# Copy and configure entrypoint script (normalize Windows CRLF line endings)
COPY entrypoint.sh /app/entrypoint.sh
RUN sed -i 's/\r$//' /app/entrypoint.sh && chmod +x /app/entrypoint.sh

# Expose ports for all microservices
# 8080: API Gateway (Central Entry Point)
# 8761: Eureka Server
# 8081: User Service
# 8082: Company & Job Service
# 8083: Candidate Service
# 8084: Application Service
# 8085: Interview Service
# 8086: Notification Service
EXPOSE 8080 8761 8081 8082 8083 8084 8085 8086

# Default service to execute: 'all' runs Eureka + API Gateway + all microservices
# Override via docker run -e SERVICE_NAME=<service> or passing arguments
ENV SERVICE_NAME=all
ENV JAVA_OPTS="-Xmx256m"

ENTRYPOINT ["/app/entrypoint.sh"]

