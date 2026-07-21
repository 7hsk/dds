# Doctor Digital System (DDS) - Morocco

DDS is a comprehensive digital health platform designed to assist doctors and patients in Morocco. It streamlines appointment booking (via Web and WhatsApp), tracks medical records, and integrates a localized medical AI assistant to recommend valid treatments in compliance with Moroccan e-health legislation.

## Architecture

This project is organized as a **monorepo** with the following workspaces:

* **`apps/Web`**: Next.js (React) web app for the doctor portal and patient interface.
* **`apps/Mobile`**: React Native (Expo) app for the patient mobile experience.
* **`apps/Api`**: Node.js/TypeScript backend service (Express or NestJS) handling scheduling, webhooks, and compliance monitoring.
* **`services/AiAssistant`**: FastAPI Python microservice running the medical recommendation engine and clinical database RAG.
* **`packages/Db`**: Shared database client (Prisma ORM for PostgreSQL) with Application-Level Encryption (ALE) rules.
* **`packages/Types`**: Shared TypeScript definitions.

## Compliance Roadmap (Morocco)

* **Law 131-13 & Decrees**: Teleconsultation registration, patient consent logging, and acts archiving.
* **Law 09-08 & CNDP Guidelines**: Database column encryption (ALE) for medical histories, access control list auditing, and metadata-only integrations with third parties (e.g. WhatsApp API).
* **Ordre des Médecins (CNOM)**: Medical AI rules verifying clinical guidelines against continuous education materials, citing reliable sources.

## Getting Started

### 1) Install dependencies

From the repository root, install the workspace dependencies:

```bash
pnpm install
```

### 2) Generate the database client

The Prisma client is used by the shared database package:

```bash
pnpm db:generate
```

If you need to apply database migrations locally:

```bash
pnpm db:migrate
```

To seed the local database data:

```bash
pnpm db:seed
```

### 3) Run the app locally

Start the web frontend:

```bash
pnpm dev:web
```

Open http://localhost:3000

Start the API backend:

```bash
pnpm dev:api
```

The API will run on http://localhost:3001 and exposes:

- http://localhost:3001/api/health

Start the AI assistant service:

```bash
pnpm dev:ai
```

The AI service will run via FastAPI/Uvicorn and is typically available at http://localhost:8000/docs

### 4) Useful build commands

Build the web app:

```bash
pnpm build:web
```

Build the API:

```bash
pnpm build:api
```

### 5) Project structure overview

- apps/Web: Next.js frontend
- apps/Api: Express backend
- services/AiAssistant: FastAPI AI service
- packages/Db: Prisma database layer
- packages/Types: shared TypeScript types

If you want, I can also add a short “Troubleshooting” section for common issues like Prisma generation errors or missing Python dependencies.
