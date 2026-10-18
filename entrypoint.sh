#!/bin/bash
set -e

SERVICE="${1:-${SERVICE_NAME:-all}}"

cleanup() {
    echo "[HireFlow] Received shutdown signal. Terminating all services..."
    kill $(jobs -p) 2>/dev/null || true
    exit 0
}

trap cleanup SIGTERM SIGINT

case "$SERVICE" in
    eureka-server)
        echo "[HireFlow] Starting Eureka Server on port 8761..."
        exec java ${JAVA_OPTS:-"-Xmx256m"} -jar /app/eureka-server.jar
        ;;
    user-service)
        echo "[HireFlow] Starting User Service on port 8081..."
        exec java ${JAVA_OPTS:-"-Xmx256m"} -jar /app/user-service.jar
        ;;
    company-job-service)
        echo "[HireFlow] Starting Company & Job Service on port 8082..."
        exec java ${JAVA_OPTS:-"-Xmx256m"} -jar /app/company-job-service.jar
        ;;
    candidate-service)
        echo "[HireFlow] Starting Candidate Service on port 8083..."
        exec java ${JAVA_OPTS:-"-Xmx256m"} -jar /app/candidate-service.jar
        ;;
    application-service)
        echo "[HireFlow] Starting Application Service on port 8084..."
        exec java ${JAVA_OPTS:-"-Xmx256m"} -jar /app/application-service.jar
        ;;
    interview-service)
        echo "[HireFlow] Starting Interview Service on port 8085..."
        exec java ${JAVA_OPTS:-"-Xmx256m"} -jar /app/interview-service.jar
        ;;
    notification-service)
        echo "[HireFlow] Starting Notification Service on port 8086..."
        exec java ${JAVA_OPTS:-"-Xmx256m"} -jar /app/notification-service.jar
        ;;
    api-gateway)
        echo "[HireFlow] Starting API Gateway on port 8080..."
        exec java ${JAVA_OPTS:-"-Xmx256m"} -jar /app/api-gateway.jar
        ;;
    all)
        echo "=========================================================="
        echo "   Starting HireFlow AI Microservices Ecosystem (All)    "
        echo "=========================================================="

        echo "[HireFlow] Starting Eureka Server (port 8761)..."
        java ${JAVA_OPTS:-"-Xmx256m"} -jar /app/eureka-server.jar &

        echo "[HireFlow] Waiting for Eureka Server to initialize..."
        for i in $(seq 1 30); do
            if curl -s http://localhost:8761/ > /dev/null 2>&1; then
                echo "[HireFlow] Eureka Server is up and ready!"
                break
            fi
            sleep 2
        done

        echo "[HireFlow] Launching API Gateway & microservices..."
        java ${JAVA_OPTS:-"-Xmx256m"} -jar /app/api-gateway.jar &
        java ${JAVA_OPTS:-"-Xmx256m"} -jar /app/user-service.jar &
        java ${JAVA_OPTS:-"-Xmx256m"} -jar /app/company-job-service.jar &
        java ${JAVA_OPTS:-"-Xmx256m"} -jar /app/candidate-service.jar &
        java ${JAVA_OPTS:-"-Xmx256m"} -jar /app/application-service.jar &
        java ${JAVA_OPTS:-"-Xmx256m"} -jar /app/interview-service.jar &
        java ${JAVA_OPTS:-"-Xmx256m"} -jar /app/notification-service.jar &

        echo "=========================================================="
        echo "   All HireFlow AI Microservices launched!                "
        echo "   - Eureka Server:        http://localhost:8761         "
        echo "   - API Gateway:          http://localhost:8080         "
        echo "   - User Service:         http://localhost:8081         "
        echo "   - Company & Job:        http://localhost:8082         "
        echo "   - Candidate Service:    http://localhost:8083         "
        echo "   - Application Service:  http://localhost:8084         "
        echo "   - Interview Service:    http://localhost:8085         "
        echo "   - Notification Service: http://localhost:8086         "
        echo "=========================================================="

        wait
        ;;

    *)
        exec "$@"
        ;;
esac
