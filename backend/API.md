# AgroGuard-AI REST API Documentation

Base URL: `http://localhost:5000/api`

## Response Format Standard

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Description of the error",
  "error": "Error details (in development mode)"
}
```

---

## 1. Authentication Endpoints (`/api/auth`)

### POST `/api/auth/login`
- **Description**: Authenticates user credentials and generates a signed JWT token.
- **Authentication**: None (Public)
- **Request Body**:
  ```json
  {
    "email": "ruwan@farm.lk",
    "password": "password123"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Authentication successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
    "user": {
      "id": 1,
      "name": "Ruwan Perera",
      "email": "ruwan@farm.lk",
      "role": "farmer",
      "avatar": "RP",
      "phone": "+94 77 123 4567",
      "location": "Ampara, Eastern Province",
      "status": "active"
    }
  }
  ```
- **Error Responses**: `401 Unauthorized`, `422 Unprocessable Entity`

### POST `/api/auth/register`
- **Description**: Registers a new stakeholder account.
- **Authentication**: None (Public)
- **Request Body**:
  ```json
  {
    "name": "Kamal Gunaratne",
    "email": "kamal@farm.lk",
    "password": "password123",
    "role": "farmer",
    "location": "Polonnaruwa",
    "phone": "+94 77 999 8888"
  }
  ```
- **Success Response (201 Created)**: Returns `{ success: true, token, user }`

### GET `/api/auth/me`
- **Description**: Retrieves currently authenticated user session.
- **Headers**: `Authorization: Bearer <token>`
- **Success Response (200 OK)**: Returns `{ success: true, user }`

### POST `/api/auth/logout`
- **Description**: Logs out user session and records audit entry.
- **Headers**: `Authorization: Bearer <token>`
- **Success Response (200 OK)**: Returns `{ success: true, message: "Logged out successfully" }`

---

## 2. Crop Cases & AI Diagnosis (`/api/cases`)

### GET `/api/cases`
- **Description**: Retrieves cases. For farmers, filters to their cases. For officers/researchers/admins, lists regional or all cases.
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `status`: Filter by status (`all`, `pending`, `confirmed`, `escalated`, `treated`, `rejected`)
  - `search`: Case search keyword (crop, farmer, location, disease)
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "CASE-001",
        "cropType": "Paddy (Rice)",
        "variety": "Samba",
        "location": "Ampara, Eastern Province",
        "disease": "Blast Disease",
        "scientificName": "Magnaporthe oryzae",
        "confidence": 94,
        "severity": "high",
        "status": "confirmed",
        "spreadRisk": 78,
        "submittedAt": "2026-09-11T10:30:00Z",
        "treatmentSteps": ["..."]
      }
    ]
  }
  ```

### GET `/api/cases/:id`
- **Description**: Returns detailed case data including foliage pathology analysis, weather correlation, and treatment steps.
- **Headers**: `Authorization: Bearer <token>`
- **Success Response (200 OK)**: Returns `{ success: true, data: { ...caseDetails } }`
- **Error Response**: `404 Not Found`

### POST `/api/cases`
- **Description**: Submits a crop foliage case, triggering the Gemini Computer Vision and epidemiological risk pipeline.
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "cropType": "Paddy (Rice)",
    "variety": "Bg 352 / Samba",
    "location": "Ampara, Eastern Province",
    "fieldArea": "1.2 acres",
    "cropStage": "Tillering / Vegetative",
    "symptoms": "Spindle-shaped brown lesions with grayish centers appearing on upper leaf blades.",
    "imageUrl": "https://..."
  }
  ```
- **Success Response (201 Created)**: Returns `{ success: true, message: "...", data: createdCase }`

### PATCH `/api/cases/:id/escalate`
- **Description**: Escalates an ambiguous or rapid-spreading disease case to the Divisional Agriculture Extension Officer.
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "reason": "Symptoms spreading rapidly despite preliminary spray; requesting on-site verification."
  }
  ```
- **Success Response (200 OK)**: Returns `{ success: true, message: "...", data: updatedCase }`

### PATCH `/api/cases/:id/review`
- **Description**: Officer validation decision (confirm, modify, or reject AI diagnosis, attach notes, schedule visit).
- **Headers**: `Authorization: Bearer <token>`
- **Required Roles**: `officer`, `admin`
- **Request Body**:
  ```json
  {
    "decision": "confirm",
    "verifiedDisease": "Blast Disease",
    "officerNotes": "Field symptoms match typical blast lesions. Approved systemic fungicide.",
    "scheduleVisit": true,
    "visitDate": "2026-09-14"
  }
  ```
- **Success Response (200 OK)**: Returns `{ success: true, message: "...", data: { case, visit } }`

---

## 3. Field Inspections (`/api/visits`)

### GET `/api/visits`
- **Description**: Lists scheduled and completed extension visits.
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**: `status` (`scheduled`, `completed`, `all`)
- **Success Response (200 OK)**: Returns `{ success: true, data: visits[] }`

### POST `/api/visits`
- **Description**: Schedules a new extension field visit.
- **Headers**: `Authorization: Bearer <token>`
- **Required Roles**: `officer`, `admin`
- **Request Body**:
  ```json
  {
    "farmerName": "Ruwan Perera",
    "location": "Ampara, Eastern Province",
    "cropType": "Paddy (Rice)",
    "scheduledDate": "2026-09-15",
    "notes": "Routine inspection of spore eradication progress."
  }
  ```
- **Success Response (201 Created)**: Returns `{ success: true, message: "...", data: newVisit }`

### PATCH `/api/visits/:id/status`
- **Description**: Updates visit status to `completed`.
- **Headers**: `Authorization: Bearer <token>`
- **Required Roles**: `officer`, `admin`
- **Request Body**: `{ "status": "completed" }`
- **Success Response (200 OK)**: Returns `{ success: true, message: "...", data: updatedVisit }`

---

## 4. Outbreaks & Epidemiology (`/api/outbreaks`)

### GET `/api/outbreaks`
- **Description**: Lists active disease outbreaks and risk clusters.
- **Headers**: `Authorization: Bearer <token>`
- **Success Response (200 OK)**: Returns `{ success: true, data: outbreaks[] }`

### GET `/api/outbreaks/provinces`
- **Description**: Returns provincial epidemic risk map data.
- **Headers**: `Authorization: Bearer <token>`
- **Success Response (200 OK)**: Returns `{ success: true, data: provinces[] }`

### GET `/api/outbreaks/trends`
- **Description**: Returns monthly pathogen incidence trajectories.
- **Headers**: `Authorization: Bearer <token>`
- **Success Response (200 OK)**: Returns `{ success: true, data: trends[] }`

### GET `/api/outbreaks/export`
- **Description**: Exports epidemiological surveillance dataset.
- **Headers**: `Authorization: Bearer <token>`
- **Success Response (200 OK)**: Returns `{ success: true, data: exportPayload }`

---

## 5. Micro-Climate Weather (`/api/weather`)

### GET `/api/weather/current?location=...`
- **Description**: Returns relative humidity, temperature, expected rainfall, leaf wetness, and pathogen forecast index for specified region.
- **Headers**: `Authorization: Bearer <token>`
- **Success Response (200 OK)**: Returns `{ success: true, data: weather }`

---

## 6. Alerts & Notifications (`/api/alerts`, `/api/notifications`)

### GET `/api/alerts/active`
- **Description**: Returns active regional crop health warnings.
- **Headers**: `Authorization: Bearer <token>`
- **Success Response (200 OK)**: Returns `{ success: true, data: alerts[] }`

### POST `/api/alerts/broadcast`
- **Description**: Transmits SMS and in-app early warning broadcasts to target province farmers.
- **Headers**: `Authorization: Bearer <token>`
- **Required Roles**: `admin`
- **Request Body**:
  ```json
  {
    "province": "Eastern Province",
    "threatLevel": "Critical",
    "cropTarget": "Paddy (Rice)",
    "broadcastMessage": "ALERT: Elevated spore count in Eastern Province. Inspect fields immediately."
  }
  ```
- **Success Response (201 Created)**: Returns `{ success: true, message: "...", data: alert }`

### GET `/api/notifications`
- **Description**: Returns user notifications feed.
- **Headers**: `Authorization: Bearer <token>`
- **Success Response (200 OK)**: Returns `{ success: true, data: notifications[] }`

### PATCH `/api/notifications/:id/read`
- **Description**: Marks notification as read.
- **Headers**: `Authorization: Bearer <token>`
- **Success Response (200 OK)**: Returns `{ success: true, message: "..." }`

---

## 7. Stakeholders & System Health (`/api/admin`, `/api/dashboard`)

### GET `/api/admin/users?search=...`
- **Description**: Stakeholder directory management.
- **Headers**: `Authorization: Bearer <token>`
- **Required Roles**: `admin`
- **Success Response (200 OK)**: Returns `{ success: true, data: users[] }`

### PATCH `/api/admin/users/:id/status`
- **Description**: Update user status (active/inactive).
- **Headers**: `Authorization: Bearer <token>`
- **Required Roles**: `admin`
- **Request Body**: `{ "status": "active" }`
- **Success Response (200 OK)**: Returns `{ success: true, message: "..." }`

### GET `/api/admin/system-health`
- **Description**: Health status of AI, Weather, SMS, and DB microservices.
- **Headers**: `Authorization: Bearer <token>`
- **Required Roles**: `admin`
- **Success Response (200 OK)**: Returns `{ success: true, data: health }`

### GET `/api/dashboard/stats`
- **Description**: Retrieves KPI statistics tailored for the caller's role.
- **Headers**: `Authorization: Bearer <token>`
- **Success Response (200 OK)**: Returns `{ success: true, role: "...", data: stats }`
