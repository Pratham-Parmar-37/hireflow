# User Service

## Purpose

Manages basic user information for the HireFlow AI recruitment platform. Users can be either **CANDIDATE** or **RECRUITER**.

> **Note:** This service does NOT implement real authentication or security in Phase 2. It only manages user data using CRUD operations.

## Technology

- Spring Boot 3.2.5
- Spring Data MongoDB
- MongoDB

## Port

`8081`

## Database

`user_db`

## Entity

### User

| Field | Type | Description |
|-------|------|-------------|
| id | String | Auto-generated MongoDB ID |
| fullName | String | Full name of the user |
| email | String | Email address |
| role | String | Role: CANDIDATE or RECRUITER |

## API Endpoints

| Operation | Method | Endpoint | Request Body |
|-----------|--------|----------|--------------|
| Get all users | GET | `/api/users` | - |
| Get user by ID | GET | `/api/users/{id}` | - |
| Create user | POST | `/api/users` | JSON (see below) |
| Update user | PUT | `/api/users/{id}` | JSON (see below) |
| Delete user | DELETE | `/api/users/{id}` | - |

## Example Request

### Create User (POST /api/users)

```json
{
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "CANDIDATE"
}
```

### Example Response

```json
{
    "id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "CANDIDATE"
}
```

## How to Run

1. Make sure MongoDB is running on `localhost:27017`
2. Make sure the **Eureka Server** is running on `localhost:8761`
3. Navigate to the `user-service` directory
4. Run: `mvn spring-boot:run`
5. The service will start on `http://localhost:8081`

---

### Eureka

This service is registered as an **Eureka Client** with the central Eureka Server.

- **Eureka Server address:** `http://localhost:8761/eureka/`
- **Service name registered with Eureka:** `user-service`
- **Registration:** Automatic on startup — the service registers itself with the Eureka Server and sends periodic heartbeats

Once running, this service will appear on the Eureka Dashboard at `http://localhost:8761`.

### Swagger

This service provides **interactive API documentation** using Swagger (OpenAPI).

- **Swagger UI URL:** [http://localhost:8081/swagger-ui/index.html](http://localhost:8081/swagger-ui/index.html)
- **OpenAPI JSON:** [http://localhost:8081/v3/api-docs](http://localhost:8081/v3/api-docs)

**Available CRUD APIs on Swagger UI:**

| Method | Endpoint |
|--------|----------|
| GET | `/api/users` |
| GET | `/api/users/{id}` |
| POST | `/api/users` |
| PUT | `/api/users/{id}` |
| DELETE | `/api/users/{id}` |
