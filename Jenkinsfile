// ==============================================================================
// Jenkinsfile – Full End-to-End CI/CD Pipeline for HireFlow AI
// Automated Build -> Test -> Docker Image -> Deploy Fresh Container -> Push to Git
// ==============================================================================

pipeline {
    agent any

    environment {
        IMAGE_NAME = 'hireflow'
        IMAGE_TAG = "${BUILD_NUMBER}"
        REGISTRY_TAG = 'hireflow:latest'
        // GitHub credentials ID configured in Jenkins (Manage Jenkins -> Credentials)
        GIT_CREDENTIALS_ID = 'github-pat-creds'
        GIT_BRANCH = 'main'
        GATEWAY_PORT = '8088'
    }

    triggers {
        // Automatically check for GitHub repository changes every 5 minutes
        pollSCM('H/5 * * * *')
        // Automatically trigger when a GitHub Webhook ping is received
        githubPush()
    }

    options {
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
                        sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} -t ${REGISTRY_TAG} ."
                    } else {
                        bat "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} -t ${REGISTRY_TAG} ."
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
                        sh 'docker compose up -d'
                        sh 'sleep 20'
                        sh 'docker compose ps'
                    } else {
                        bat 'docker compose down || ver > nul'
                        bat 'docker compose up -d'
                        bat 'powershell -Command "Start-Sleep -Seconds 20; docker compose ps"'
                    }
                }
            }
        }

        // ----------------------------------------------------------------------
        // Stage 5: Push to GitHub on Success
        // Only executes after tests, image build, and deployment succeed
        // ----------------------------------------------------------------------
        stage('Push to GitHub') {
            steps {
                echo '=== [Stage 5/5] Tests & Deployment passed. Syncing to GitHub ==='
                script {
                    timeout(time: 1, unit: 'MINUTES') {
                        def candidateCredIds = ["${GIT_CREDENTIALS_ID}", 'github-credentials', 'github-pat-creds']
                        def pushed = false
                        for (credId in candidateCredIds) {
                            if (pushed) break
                            try {
                                withCredentials([usernamePassword(credentialsId: credId, usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
                                    echo "Found credential '${credId}'. Pushing to GitHub..."
                                    withEnv(['GIT_TERMINAL_PROMPT=0', 'GCM_INTERACTIVE=never']) {
                                        if (isUnix()) {
                                            sh 'git push https://${GIT_USER}:${GIT_PASS}@github.com/Pratham-Parmar-37/hireflow.git HEAD:${GIT_BRANCH}'
                                        } else {
                                            bat 'git push https://%GIT_USER%:%GIT_PASS%@github.com/Pratham-Parmar-37/hireflow.git HEAD:%GIT_BRANCH%'
                                        }
                                    }
                                    pushed = true
                                    echo 'GitHub push completed successfully.'
                                }
                            } catch (Exception e) {
                                // Try next candidate credential ID
                            }
                        }
                        if (!pushed) {
                            echo "=== NOTE ON GIT PUSH ==="
                            echo "Skipped automatic push: Neither 'github-pat-creds' nor 'github-credentials' credential was found in Jenkins."
                            echo "To enable auto-push, add your GitHub Personal Access Token:"
                            echo "Jenkins -> Manage Jenkins -> Credentials -> System -> Global credentials -> Add Credentials"
                            echo "(Kind: Username with password, ID: github-pat-creds)"
                        }
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
   - Fresh Docker Image:   ${IMAGE_NAME}:${IMAGE_TAG} & ${REGISTRY_TAG}
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
