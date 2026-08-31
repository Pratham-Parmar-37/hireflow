# Candidate Service

## Purpose

Manages **candidate profile information** for the HireFlow AI recruitment platform. Stores details such as skills, experience, education, and resume URL.

## Technology

- Spring Boot 3.2.5
- Spring Data MongoDB
- MongoDB

## Port

`8083`

## Database

`candidate_db`

## Entity

### Candidate

| Field | Type | Description |
|-------|------|-------------|
| id | String | Auto-generated MongoDB ID |
| userId | String | Logical reference to User Service |
| fullName | String | Full name of the candidate |
| email | String | Email address |
| resumeUrl | String | URL/path to resume (placeholder for future file storage) |
| skills | List\<String\> | List of skills |
| experience | String | Work experience description |
| education | String | Educational qualification |

## API Endpoints

| Operation | Method | Endpoint | Request Body |
|-----------|--------|----------|--------------|
| Get all candidates | GET | `/api/candidates` | - |
| Get candidate by ID | GET | `/api/candidates/{id}` | - |
| Create candidate | POST | `/api/candidates` | JSON (see below) |
| Update candidate | PUT | `/api/candidates/{id}` | JSON (see below) |
| Delete candidate | DELETE | `/api/candidates/{id}` | - |

## Example Request

### Create Candidate (POST /api/candidates)

```json
{
    "userId": "<user-id>",
    "fullName": "John Doe",
    "email": "john@example.com",
    "resumeUrl": "https://resumes.hireflow.ai/john-doe-resume.pdf",
    "skills": ["Java", "Spring Boot", "MongoDB"],
    "experience": "3 years in software development",
    "education": "MCA from Mumbai University"
}
```

## How to Run

1. Make sure MongoDB is running on `localhost:27017`
2. Navigate to the `candidate-service` directory
3. Run: `mvn spring-boot:run`
4. The service will start on `http://localhost:8083`
