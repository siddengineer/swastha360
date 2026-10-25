# Swasth360 — AI Agents for Smarter Healthcare in India

**Swasth360** is a modern healthcare web application prototype designed to provide specialized, safety-governed AI agents for Indian healthcare. The platform operates on two distinct, architecturally isolated models:
1. **B2B (Hospitals and Clinics):** Healthcare organizations submit onboarding requests. The Swasth360 administration team reviews requests, provisions organization accounts, selectively activates AI agents, and assigns access to hospital administrators and clinical staff.
2. **B2C (Individual Citizens):** Individuals independently register for Swasth360 and utilize personal healthcare guidance agents directly, completely free of any hospital dependency or hospital approval.

> [!IMPORTANT]
> **Important Product Rule:** Swasth360 is **NOT** a hospital directory, hospital search engine, or medical marketplace. Hospitals are enterprise tenants that onboard onto Swasth360 to access specialized workflow AI agents for their clinical teams and patient communities.

---

## Architecture Overview

```
                                  +------------------------------+
                                  |   React + TypeScript + Vite  |
                                  |     Tailwind CSS Dashboard   |
                                  |     (Port 3000 / Web SPA)    |
                                  +--------------+---------------+
                                                 |
                                     HTTP REST / JSON (JWT Bearer)
                                                 |
                                                 v
                                  +------------------------------+
                                  |   Java 21 Spring Boot 3.4    |
                                  |   Spring Security (RBAC)     |
                                  |   Spring Data JPA / REST     |
                                  |     (Port 8080 / Backend)    |
                                  +-------+--------------+-------+
                                          |              |
                    Internal HTTP Service |              | JDBC Connection
                                          v              v
            +-------------------------------+   +-------------------------------+
            |      Python 3.12 FastAPI      |   |      PostgreSQL Database      |
            |     Specialized AI Agents     |   |    (or In-Memory PostgreSQL   |
            |   (Port 8000 / AI Service)    |   |     Compatibility Profile)    |
            +-------------------------------+   +-------------------------------+
```

---

## The Nine Specialized AI Agents

Each agent has a purpose, clinical safety boundaries, and deterministic demo interactions:

| # | Agent Name | Intended Users | Availability | Purpose & Interactions |
|---|------------|----------------|--------------|------------------------|
| **1** | **Patient Follow-up Agent** | Hospital Staff & Admins | Available for Hospital | Drafts 48-hour post-discharge follow-up reminders, reviews surgical recovery schedules, and organizes follow-up call queues. |
| **2** | **Medication Guidance Agent** | Individuals & Hospital Patients | Available for Individuals | Explains general pharmacological instructions (e.g. "take with food"), distinguishes prescribed dosages from OTC advice, and enforces medication warnings. |
| **3** | **Appointment Management Agent** | Hospitals & Individuals | Available for Hospital | Schedules demo consultations, displays upcoming OPD slots, drafts preparation reminders, and lists required clinical documents. |
| **4** | **Chronic Care Agent** | Individual Users | Available for Individuals | Provides routine care tracking checklists for Type 2 Diabetes and Hypertension, ICMR lifestyle guidelines, and blood pressure logging awareness. |
| **5** | **Maternal & Child Care Agent** | Mothers, Families & Health Workers | Available for Individuals | Explains Universal Immunization Programme (UIP) infant milestones (0–12 months), prenatal wellness checklists, and explicitly flags urgent emergency red-flag symptoms. |
| **6** | **Insurance & Ayushman Bharat Agent** | Hospital Helpdesk & Citizens | Available for Individuals | Explains PM-JAY eligibility verification documents (Aadhaar, Ration Card), difference between cashless and reimbursement claims, and pre-authorization steps. |
| **7** | **Hospital Helpdesk Agent** | Visitors, Patients & Staff | Available for Hospital | Answers inquiries using **hospital-specific parameters** (custom visiting hours, OPD instructions, and contact numbers) configured by hospital admins. |
| **8** | **Mental Wellness Check-in Agent** | Individual Users | Available for Individuals | Provides non-diagnostic supportive reflections, 4-4-4-4 box breathing exercises, and **crisis escalation** (triggers Tele-MANAS 14416 / 112 support). |
| **9** | **Multilingual Healthcare Agent** | Hospitals & Individuals | Available in Demo | Translates and explains clinical instructions into **Hindi (हिन्दी)**, **Marathi (मराठी)**, and English to ensure linguistic accessibility. |

---

## Seed Accounts and Demo Credentials

The application includes non-production development credentials pre-seeded in the database:

| Role | Email | Password | Organization | Description |
|------|-------|----------|--------------|-------------|
| **SWASTH360_ADMIN** | `admin@swasth360.in` | `Admin@123` | *Platform Administration* | Approves onboarding requests, creates organizations, and enables/suspends agents. |
| **HOSPITAL_ADMIN** | `hospitaladmin@abchealthcare.demo` | `Hospital@123` | ABC Healthcare Demo | Manages hospital staff, configures helpdesk settings, and accesses assigned hospital agents. |
| **HOSPITAL_STAFF** | `staff@abchealthcare.demo` | `Staff@123` | ABC Healthcare Demo | Clinical staff nurse managing follow-up queues and appointment schedules. |
| **HOSPITAL_ADMIN (Clinic)** | `admin@sunriseclinic.demo` | `Sunrise@123` | Sunrise Clinic Demo | Head of primary care clinic with Multilingual & Appointment agents. |
| **INDIVIDUAL_USER** | `rahul.sharma@example.com` | `User@123` | *Independent (None)* | B2C citizen account with personal chronic care, medication, and wellness agents. |

> [!NOTE]
> On the **Login Page** (`/login`), quick-fill buttons are provided for each demo account for one-click testing convenience.

---

## Prerequisites and Local Setup

### System Prerequisites
- **Java:** JDK 21 or JDK 23
- **Maven:** 3.8+
- **Python:** 3.10+ (with `pip`)
- **Node.js:** v18+ or v20+ (with `npm`)
- *(Optional)* **Docker** & **Docker Compose**

---

### Option A: Running with Docker Compose (Recommended for Full Stack)

1. Clone or navigate to the repository:
   ```bash
   cd swahta360
   ```
2. Copy the environment configuration:
   ```bash
   cp .env.example .env
   ```
3. Build and launch all 4 containers (PostgreSQL, Python AI Service, Spring Boot Backend, React Frontend):
   ```bash
   docker-compose up --build
   ```
4. Access the applications:
   - **Frontend Web Portal:** [http://localhost:3000](http://localhost:3000)
   - **Spring Boot Backend APIs:** [http://localhost:8080/api](http://localhost:8080/api)
   - **Python FastAPI Service:** [http://localhost:8000/docs](http://localhost:8000/docs)
   - **PostgreSQL Database:** `localhost:5432` (db: `swasth360`, user: `postgres`, password: `postgrespassword`)

---

### Option B: Running Locally Native (No Docker Required)

Swasth360 includes a built-in development mode utilizing an embedded PostgreSQL-compatible database and high-availability deterministic agent engine.

#### 1. Start the Python AI Service
```bash
cd ai-service
pip install -r requirements.txt
python -m uvicorn main:app --host 127.0.0.1 --port 8000
```
*Health Check:* [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)

#### 2. Start the Java Spring Boot Backend
In a new terminal window:
```bash
cd backend
mvn spring-boot:run
```
*Backend runs on port `8080`. Automatically seeds default demo users, organizations, appointments, and agents.*

#### 3. Start the React Frontend
In a third terminal window:
```bash
cd frontend
npm install
npm run dev -- --port 3000
```
*Frontend runs on [http://localhost:3000](http://localhost:3000).*

---

## Running with Optional LLM Provider

Swasth360 operates reliably with its built-in deterministic healthcare engine without requiring any paid API keys. If you want to connect external LLM providers:
1. Export your API key:
   ```bash
   export OPENAI_API_KEY="sk-..."
   # OR
   export GEMINI_API_KEY="AIza..."
   ```
2. The Python AI service will automatically detect the presence of the key and route queries through the configured provider, while continuing to enforce clinical safety guards.

---

## Tested End-to-End Workflows

The following demonstration workflows were executed and verified against the live environment:

### Demonstration A: Hospital Onboarding & Organization Provisioning
1. User visits `/hospital-onboarding` and submits an onboarding request for *"Apex Multispecialty Hospital"*.
2. System validates input, generates Request Identifier (`#REQ-3`), and records status as `PENDING_REVIEW`.
3. Swasth360 Admin logs in with `admin@swasth360.in` / `Admin@123` and opens `/admin/hospital-requests`.
4. Admin reviews the request, verifies credentials, and navigates to Organization Provisioning (`/admin/organizations/create`).
5. Admin specifies unique slug `apex-multispecialty-demo`, enables *Patient Follow-up* and *Appointment Management*, and sets administrator credentials (`admin@apexhospital.demo`).
6. Organization tenant is created, initial Hospital Admin account is activated, and default Helpdesk rules are seeded.

### Demonstration B: Hospital Uses Enabled Agents & Custom Helpdesk Information
1. Hospital Administrator logs in with `hospitaladmin@abchealthcare.demo` / `Hospital@123`.
2. Dashboard (`/hospital/dashboard`) loads with prominent `DEMO MODE — SAMPLE DATA` notice.
3. Only the 3 authorized agents for ABC Healthcare (*Patient Follow-up*, *Appointment Management*, *Hospital Helpdesk*) are shown.
4. Invoking the *Patient Follow-up Agent* drafts a surgical follow-up reminder for `#PT-8421`.
5. Administrator edits visiting hours and OPD counter instructions at `/hospital/helpdesk-settings`.
6. Invoking the *Hospital Helpdesk Agent* immediately incorporates these updated hospital-specific guidelines into its response.

### Demonstration C: B2C Individual User Workflow & Safety Guardrails
1. User registers independently at `/register` (`priya.iyer@example.com` / `User@123`).
2. User is logged in directly to `/individual/dashboard` with **no hospital affiliation** (`organizationId: null`).
3. User accesses citizen self-care agents (*Medication Guidance*, *Chronic Care*, *Mental Wellness*).
4. Submitting a crisis-related demo prompt to the Mental Wellness Agent (*"I am having thoughts of ending my life"*) triggers immediate **Crisis Escalation Guard**:
   - Refuses clinical diagnosis.
   - Surfaces **Tele-MANAS** helpline (`14416` / `1800-891-4416`) and Emergency Services (`112`).
   - Displays prominent crisis hotline connection action.

### Demonstration D: Multi-Tenant Security & Tenant Isolation
1. **URL Parameter Protection:** Individual user attempts to access `/api/hospital/dashboard` -> Backend returns `403 Forbidden`.
2. **Disabled Agent Enforcement:** Hospital Admin attempts to call an agent disabled for their facility -> Backend rejects with `403 Forbidden ("Agent is not enabled for your organization")`.
3. **Tenant Suspension:** Swasth360 Admin marks an organization as `SUSPENDED` -> All member logins and protected agent API calls are immediately blocked with `403 Access Denied`.
4. **Reactivation:** Swasth360 Admin restores status to `ACTIVE` -> Access is instantly re-enabled.

---

## Future Architecture and Cloud Roadmap

The following design decisions are documented for future production scale-out:

### 1. Cloud Infrastructure (AWS)
- **Amazon RDS for PostgreSQL:** Multi-AZ deployment with automated failover, read replicas for analytics, and encrypted storage (AWS KMS).
- **Amazon ECS / AWS Fargate:** Serverless container deployment for the Spring Boot backend and Python AI service with auto-scaling based on CPU/memory and request queues.
- **Application Load Balancer (ALB):** Terminates TLS/HTTPS, enforces AWS WAF (Web Application Firewall) rate limiting, and routes `/api/*` to Spring Boot and static assets to CloudFront.
- **Amazon S3 & CloudFront:** Static React frontend hosted on S3 and distributed globally via CloudFront CDN.
- **AWS Secrets Manager:** Centralized secret rotation for JWT keys, database passwords, and AI credentials.
- **Amazon CloudWatch:** Centralized container logging, audit event tracking, and alerting.

### 2. CI/CD & Interoperability
- **GitHub Actions:** Automated test execution (JUnit + Spring Boot Test + Vite build), vulnerability scanning (Trivy), and automated container deployment to Amazon ECR.
- **ABDM (Ayushman Bharat Digital Mission) Integration:** Future support for M1, M2, and M3 milestones (ABHA creation, health record linking) via secure national health gateways.
- **Controlled MCP (Model Context Protocol) Server:** Future controlled tool access allowing verified hospital systems to securely query Swasth360 agents through standard MCP interfaces.

---

## License & Academic Disclaimer

Swasth360 is developed as a comprehensive engineering prototype demonstrating role-based AI healthcare agents and multi-tenant SaaS architecture. It is not intended for live clinical diagnosis or emergency medical care. All patient figures and names in demonstration mode are fictional.
