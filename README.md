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

*(Refer to individual folders for specific setup instructions)*
