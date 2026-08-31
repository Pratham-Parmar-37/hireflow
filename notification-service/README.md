# Notification Service

## Purpose

Stores and manages **notification records** for the HireFlow AI recruitment platform. Notifications can be related to applications, interviews, or general updates.

> **Note:** This service does NOT actually send emails, SMS, or push notifications. It only stores notification records in the database for future implementation.

## Technology

- Spring Boot 3.2.5
- Spring Data MongoDB
- MongoDB

## Port

`8086`

## Database

`notification_db`

## Entity

### Notification

| Field | Type | Description |
|-------|------|-------------|
| id | String | Auto-generated MongoDB ID |
| userId | String | Logical reference to User Service |
| message | String | Notification message content |
| type | String | APPLICATION, INTERVIEW, GENERAL |
| status | String | READ or UNREAD |
| createdAt | String | Timestamp of creation |

## API Endpoints

| Operation | Method | Endpoint | Request Body |
|-----------|--------|----------|--------------|
| Get all notifications | GET | `/api/notifications` | - |
| Get notification by ID | GET | `/api/notifications/{id}` | - |
| Create notification | POST | `/api/notifications` | JSON (see below) |
| Update notification | PUT | `/api/notifications/{id}` | JSON (see below) |
| Delete notification | DELETE | `/api/notifications/{id}` | - |

## Example Request

### Create Notification (POST /api/notifications)

```json
{
    "userId": "<user-id>",
    "message": "Your application has been shortlisted!",
    "type": "APPLICATION",
    "status": "UNREAD",
    "createdAt": "2026-08-31T10:00:00"
}
```

## How to Run

1. Make sure MongoDB is running on `localhost:27017`
2. Navigate to the `notification-service` directory
3. Run: `mvn spring-boot:run`
4. The service will start on `http://localhost:8086`
