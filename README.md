# AgroGuard-AI: Regional Crop Disease Early Warning System

> **"Diagnose sick plants from a photo, advise farmers in their language, and stop outbreaks spreading."**

AgroGuard-AI is a full-stack, enterprise-grade regional crop disease early-warning and epidemiological containment platform tailored for agricultural extension networks in Sri Lanka and tropical agrarian zones.

---

## 🌾 Core Features & Problem Brief Alignment

1. **AI Foliar Specimen Diagnosis & Severity Assessment**
   - Integrates computer vision classification via Google Gemini Vision API (`AI_API_KEY`) and an authentic PlantVillage pathology classifier.
   - Evaluates foliar severity (`low`, `medium`, `high`, `critical`) and estimated yield impact.
   - Grounded in real agronomic pathology without arbitrary random jitter or fabricated confidences.

2. **Multilingual Farmer Advisories**
   - Supports **English (`en`)**, **Sinhala (`si`)**, and **Tamil (`ta`)**.
   - Generates localized disease identification, immediate agronomic chemical/biological treatments, and containment protocols in the farmer's mother tongue.

3. **Strict Confidence Triage Rule**
   - **Confidence $\ge 90\%$**: Normal diagnosis with recommended treatment and prevention guidelines.
   - **Confidence $< 75\%$**: Speculative diagnoses and specific chemical treatments are automatically suppressed. The case status is set to `escalated` and routed immediately to the local Agricultural Extension Officer (`Needs officer verification`).

4. **Live Micro-Climate Telemetry (Open-Meteo)**
   - Automatically queries live temperature, relative humidity, wind speed, rainfall, and leaf wetness hours from the free Open-Meteo API using the farm's GPS coordinates (`latitude`, `longitude`).
   - Estimates fungal/bacterial proliferation index without requiring external API keys.

5. **Deterministic Epidemiological Risk Engine**
   - Calculates a transparent, explainable pathogen spread risk index ($0 - 100$) combining disease severity, leaf wetness, micro-climate factors, and neighboring active cases.

6. **Dynamic Outbreak Clustering**
   - Automatically scans cases within the last 30 days and groups active cases by pathogen.
   - Uses Haversine distance clustering (`OUTBREAK_RADIUS_KM = 10`, `OUTBREAK_MIN_CASES = 3`) to calculate geographic centroids and active cluster perimeters.

7. **Automated Biosecurity Farm Alerts**
   - When an Agricultural Officer or Epidemiologist confirms an outbreak cluster, the system queries all registered farms within the 10 km containment zone and automatically dispatches high-priority biosecurity warnings into their notification inboxes.

8. **Complete Field Visit Loop**
   - Extension Officers can schedule on-site farm visits.
   - Upon completing the inspection, officers record observed field symptoms, confirmed disease, verified severity, and quarantine recommendations.
   - The original case is updated with `officer_verified = true`, `verified_disease`, and the farmer is notified.

9. **Interactive Regional Map (Leaflet / OpenStreetMap)**
   - Live geospatial visualization of:
     - Case markers colored by epidemiological risk: **Green** ($< 40$), **Yellow** ($40-70$), **Orange/Red** ($> 70$).
     - Registered farm locations with acreage, crop type, and farmer details.
     - 10 km dashed circular outbreak containment zones.

10. **Dual Persistence Mode & Zero-Config Runnability**
    - Seamlessly connects to PostgreSQL / Supabase when configured, but includes a 100% functional, reactive in-memory database store with complete realistic Sri Lankan seed data when running offline.

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, React Router, React Icons, Leaflet / OpenStreetMap.
- **Backend**: Node.js, Express.js, JWT authentication, CORS, rate limiting.
- **Micro-Climate Telemetry**: Open-Meteo API (Free, live micro-climate).
- **Vision AI Engine**: Google Gemini 1.5 Flash Vision / PlantVillage pathology knowledge base.
- **Database**: PostgreSQL (Supabase schema provided) with fallback to resilient in-memory store.

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or v20+ recommended)
- `npm` or `yarn`

### 1. Backend Setup

```bash
cd backend
npm install

# (Optional) Copy .env.example to .env
cp .env.example .env

# Start backend server (runs on http://localhost:5000)
npm run dev
```

### 2. Frontend Setup

```bash
cd ../frontend
npm install

# Start Vite development server (runs on http://localhost:5173)
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🔑 Demo Login Credentials

The system comes pre-seeded with 4 distinct roles ready for instant testing:

| Role | Email | Password | Primary Capabilities |
| :--- | :--- | :--- | :--- |
| **Farmer** | `ruwan@farm.lk` | `password123` | Submit crop photo, select farm GPS, view multilingual diagnosis, escalate case |
| **Extension Officer** | `anura@agridept.gov.lk` | `password123` | Review escalated cases, schedule field visits, record verified findings |
| **Epidemiologist** | `kamal@res.lk` | `password123` | Regional map surveillance, confirm outbreak clusters, export dataset |
| **Administrator** | `admin@agroguard.gov.lk` | `password123` | Broadcast regional alerts, manage users and agrarian zones |

---

## 🧪 Automated Verification Test Suite

A standalone test script tests all 10 problem brief scenarios without requiring external test runners:

```bash
cd backend
node test-api.js
```

### Scenarios Asserted:
- `✓ PASS`: Actor Authentication & JWT issuance for all 4 roles.
- `✓ PASS`: Registered farms with valid Sri Lankan GPS coordinates.
- `✓ PASS`: Image diagnosis with multilingual output in English, Sinhala (`si`), and Tamil (`ta`).
- `✓ PASS`: Strict confidence triage: $<75\%$ automatically escalated without speculative diagnosis.
- `✓ PASS`: Live weather telemetry fetched from Open-Meteo for farm coordinates.
- `✓ PASS`: Dynamic Haversine clustering with 10 km radius and minimum 3 cases.
- `✓ PASS`: Confirmed outbreak automatically alerts nearby registered farms.
- `✓ PASS`: Full field visit loop: findings recorded, linked case marked `Officer Verified`, and farmer notified.
- `✓ PASS`: Regional surveillance dataset export for national research institutes.

---

## 📁 Project Structure

```
AgroGuard-AI/
├── backend/
│   ├── src/
│   │   ├── config/             # AI, database, and JWT configurations
│   │   ├── controllers/        # Cases, farms, visits, outbreaks, weather, alerts
│   │   ├── middleware/         # JWT authentication, rate limiting, error handling
│   │   ├── routes/             # REST endpoints (/api/cases, /api/farms, etc.)
│   │   ├── services/           # ai.service, weather.service, outbreak.service, db.service
│   │   ├── utils/              # Risk calculator, geospatial mappers
│   │   └── server.js           # Express app entrypoint
│   ├── database/
│   │   ├── schema.sql          # PostgreSQL schema (farms, cases, visits, outbreaks)
│   │   └── seed.sql            # Realistic Sri Lankan seed data
│   ├── .env.example            # Environment variable template
│   └── test-api.js             # 10-point automated test suite
├── frontend/
│   ├── src/
│   │   ├── components/         # RegionalMap (Leaflet), Navbar, StatCard, etc.
│   │   ├── context/            # AuthContext, LanguageContext (i18n)
│   │   ├── i18n/               # Translations dictionary (en, si, ta)
│   │   ├── pages/
│   │   │   ├── farmer/         # FarmerDashboard, NewCase, DiagnosisResult
│   │   │   ├── officer/        # OfficerDashboard, CaseDetails, FieldVisit
│   │   │   ├── research/       # ResearchDashboard (Surveillance & Map)
│   │   │   └── admin/          # AdminDashboard
│   │   └── services/           # Centralized Axios API client
│   ├── index.html              # Leaflet CDN & application shell
│   └── package.json
└── README.md
```

---

## 🛡️ License
Developed for the National Artificial Intelligence Competition — Crop Protection Track.
