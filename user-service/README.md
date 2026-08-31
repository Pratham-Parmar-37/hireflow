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
2. Navigate to the `user-service` directory
3. Run: `mvn spring-boot:run`
4. The service will start on `http://localhost:8081`
