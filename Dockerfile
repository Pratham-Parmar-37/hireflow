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
COPY eureka-server/pom.xml eureka-server/
COPY eureka-server/src eureka-server/src
RUN mvn -f eureka-server/pom.xml clean package -DskipTests

# 2. User Service
COPY user-service/pom.xml user-service/
COPY user-service/src user-service/src
RUN mvn -f user-service/pom.xml clean package -DskipTests

# 3. Company & Job Service
COPY company-job-service/pom.xml company-job-service/
COPY company-job-service/src company-job-service/src
RUN mvn -f company-job-service/pom.xml clean package -DskipTests

# 4. Candidate Service
COPY candidate-service/pom.xml candidate-service/
COPY candidate-service/src candidate-service/src
RUN mvn -f candidate-service/pom.xml clean package -DskipTests

# 5. Application Service
COPY application-service/pom.xml application-service/
COPY application-service/src application-service/src
RUN mvn -f application-service/pom.xml clean package -DskipTests

# 6. Interview Service
COPY interview-service/pom.xml interview-service/
COPY interview-service/src interview-service/src
RUN mvn -f interview-service/pom.xml clean package -DskipTests

# 7. Notification Service
COPY notification-service/pom.xml notification-service/
COPY notification-service/src notification-service/src
RUN mvn -f notification-service/pom.xml clean package -DskipTests

# 8. API Gateway
COPY api-gateway/pom.xml api-gateway/
COPY api-gateway/src api-gateway/src
RUN mvn -f api-gateway/pom.xml clean package -DskipTests

# ------------------------------------------------------------------------------
# Stage 2: Minimal runtime image
# ------------------------------------------------------------------------------
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Install bash and curl for discovery health checks and orchestration
RUN apk add --no-cache bash curl

# Copy packaged JAR artifacts from builder stage
COPY --from=builder /workspace/eureka-server/target/eureka-server-*.jar /app/eureka-server.jar
COPY --from=builder /workspace/api-gateway/target/api-gateway-*.jar /app/api-gateway.jar
COPY --from=builder /workspace/user-service/target/user-service-*.jar /app/user-service.jar
COPY --from=builder /workspace/company-job-service/target/company-job-service-*.jar /app/company-job-service.jar
COPY --from=builder /workspace/candidate-service/target/candidate-service-*.jar /app/candidate-service.jar
COPY --from=builder /workspace/application-service/target/application-service-*.jar /app/application-service.jar
COPY --from=builder /workspace/interview-service/target/interview-service-*.jar /app/interview-service.jar
COPY --from=builder /workspace/notification-service/target/notification-service-*.jar /app/notification-service.jar

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

