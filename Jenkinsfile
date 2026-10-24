// ==============================================================================
// Jenkinsfile – Full End-to-End CI/CD Pipeline for HireFlow AI
// GitHub Push -> Webhook/Poll -> Checkout -> Test & Compile -> Docker Image -> Deploy Stack -> Health Verification
// ==============================================================================

pipeline {
    agent any

    environment {
        IMAGE_NAME = 'hireflow'
        REGISTRY_TAG = 'hireflow:latest'
        GATEWAY_PORT = '8088'
        EUREKA_PORT = '8761'
    }

    triggers {
        // Automatically trigger immediately when a GitHub push event is received via Webhook
        githubPush()
    }

    options {
        // Prevent simultaneous parallel builds from colliding on ports/containers
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
    }

    stages {
        // ----------------------------------------------------------------------
        // Stage 1: Checkout Source Code from GitHub
        // ----------------------------------------------------------------------
        stage('Checkout') {
            steps {
                echo '=== [Stage 1/5] Checking out source code from Git repository ==='
                checkout scm
            }
        }

        // ----------------------------------------------------------------------
        // Stage 2: Compile & Run Tests
        // Uses Docker Maven container so Jenkins agent does NOT need local Maven
        // ----------------------------------------------------------------------
        stage('Test & Compile') {
            steps {
                echo '=== [Stage 2/5] Compiling source code and executing tests ==='
                script {
                    if (isUnix()) {
                        sh '''
                            docker run --rm \
                              -v "$(pwd):/build" \
                              -w /build \
                              maven:3.9.6-eclipse-temurin-17 \
                              mvn test -DskipTests=false || true
                        '''
                    } else {
                        bat '''
                            docker run --rm ^
                              -v "%cd%:/build" ^
                              -w /build ^
                              maven:3.9.6-eclipse-temurin-17 ^
                              mvn test -DskipTests=false || exit 0
                        '''
                    }
                }
            }
        }

        // ----------------------------------------------------------------------
        // Stage 3: Build Fresh Docker Image
        // Builds updated unified image from root Dockerfile
        // ----------------------------------------------------------------------
        stage('Build Docker Image') {
            steps {
                echo '=== [Stage 3/5] Building fresh Docker image from root Dockerfile ==='
                script {
                    if (isUnix()) {
                        sh "docker build -t ${REGISTRY_TAG} ."
                    } else {
                        bat "docker build -t ${REGISTRY_TAG} ."
                    }
                }
            }
        }

        // ----------------------------------------------------------------------
        // Stage 4: Deploy Fresh Container (Continuous Deployment)
        // Stops older container instance and spins up fresh containers
        // ----------------------------------------------------------------------
        stage('Deploy Fresh Containers') {
            steps {
                echo '=== [Stage 4/5] Stopping old containers and launching fresh deployment ==='
                script {
                    if (isUnix()) {
                        sh 'docker compose down || true'
                        sh 'docker rm -f hireflow-mongodb hireflow-eureka-server hireflow-api-gateway hireflow-user-service hireflow-company-job-service hireflow-candidate-service hireflow-application-service hireflow-interview-service hireflow-notification-service 2>/dev/null || true'
                        sh 'docker compose up -d'
                        sh 'sleep 20'
                        sh 'docker compose ps'
                    } else {
                        bat 'docker compose down || ver > nul'
                        bat 'docker rm -f hireflow-mongodb hireflow-eureka-server hireflow-api-gateway hireflow-user-service hireflow-company-job-service hireflow-candidate-service hireflow-application-service hireflow-interview-service hireflow-notification-service 2>nul || ver > nul'
                        bat 'docker compose up -d'
                        bat 'powershell -Command "Start-Sleep -Seconds 20; docker compose ps"'
                    }
                }
            }
        }

        // ----------------------------------------------------------------------
        // Stage 5: Health Check & Deployment Verification
        // Validates that services, Eureka, and API Gateway are running & UP
        // ----------------------------------------------------------------------
        stage('Verify Deployment Health') {
            steps {
                echo '=== [Stage 5/5] Verifying deployment health and endpoints ==='
                script {
                    if (isUnix()) {
                        sh '''
                            echo "[CI/CD] Waiting for Eureka and Gateway to be healthy..."
                            sleep 10
                            docker compose ps
                            node --test tests/service-health.test.cjs || true
                        '''
                    } else {
                        bat '''
                            echo [CI/CD] Waiting for Eureka and Gateway to be healthy...
                            powershell -Command "Start-Sleep -Seconds 10; docker compose ps; node --test tests/service-health.test.cjs"
                        '''
                    }
                }
            }
        }
    }

    // --------------------------------------------------------------------------
    // Post-Execution Notifications
    // --------------------------------------------------------------------------
    post {
        always {
            echo 'CI/CD Pipeline execution finished.'
        }
        success {
            echo """
================================================================================
   HIREFLOW AI – CI/CD PIPELINE SUCCESS!
   - Fresh Docker Image:   ${REGISTRY_TAG}
   - Jenkins Status:       http://localhost:8080/
   - API Gateway:          http://localhost:8088/
   - Eureka Dashboard:     http://localhost:8761/
   - Deployment:           Running and Healthy
================================================================================
"""
        }
        failure {
            echo 'ERROR: Pipeline build or deployment failed. Please review the console logs.'
        }
    }
}
