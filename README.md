# Nexa Talent OS

Employee skill evaluation and promotion-readiness platform. Managers can review engineers, submit capability assessments, and see skill gaps on a radar chart.

**Live repo:** [github.com/Someshdiwan/Nexa-Talent](https://github.com/Someshdiwan/Nexa-Talent)

## What’s in this repo

```
NexaTalentOS/
├── nexus-backend/    Java 17 · Spring Boot 3 · JWT · PostgreSQL / H2
└── nexus-frontend/   React · TypeScript · Vite · Recharts
```

| Area | What it does |
| --- | --- |
| Auth | Register / login with JWT (Spring Security) |
| Engineers | Create and list employee profiles |
| Evaluations | Submit capability scores and store snapshots |
| Dashboard | Radar chart of skills and promotion readiness |

**Stack:** Java 17, Spring Boot 3, Spring Security, JWT, Spring Data JPA, Hibernate, PostgreSQL, React, TypeScript, Vite, Maven, REST APIs.

## Prerequisites

- Java 17
- Maven (or use `./mvnw` in the backend folder)
- Node.js 18+
- PostgreSQL (only if you run the `prod` profile)

## Run locally

**1. Backend** (default in `application.properties` is the `prod` profile → PostgreSQL)

```bash
# Create DB once
createdb nexatalentos   # or create nexatalentos in pgAdmin

export DB_USERNAME=postgres
export DB_PASSWORD=your_postgres_password

cd nexus-backend
./mvnw spring-boot:run
```

API: `http://localhost:8080`

For a no-Postgres trial, set `spring.profiles.active=default` in `nexus-backend/src/main/resources/application.properties` so it uses in-memory H2.

**2. Frontend** (separate terminal)

```bash
cd nexus-frontend
npm install
npm run dev
```

UI: `http://localhost:5173` (Vite). It calls `http://localhost:8080/api` unless you set `VITE_API_BASE_URL`.

### Demo login (seeded on empty DB)

- Email: `admin@nexus.com`
- Password: `admin123`

## Docker

```bash
cd nexus-backend && docker build -t nexa-backend .
cd nexus-frontend && docker build -t nexa-frontend .
```

Frontend image build arg: `VITE_API_BASE_URL` (default `http://localhost:8080/api`).

## API sketch

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/api/auth/login` | JWT login |
| POST | `/api/auth/register` | New user |
| GET/POST | `/api/engineers` | List / create engineers |
| POST | `/api/evaluations` | Submit a capability evaluation |

See `nexus-frontend/src/api/API_CONTRACTS.md` for the frontend contract.

## Resume one-liner

Full-stack talent platform: Spring Boot REST APIs with JWT auth and PostgreSQL, plus a React dashboard that visualizes engineer capability snapshots and promotion readiness.
