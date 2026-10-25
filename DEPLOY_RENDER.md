# Deploying Swasth360 to Render

This guide provides step-by-step instructions for deploying **Swasth360** (Frontend, Spring Boot Backend, and Python AI Service) onto [Render](https://render.com).

---

## Architecture on Render

```
[ User Browser ]
       |
       v
+-------------------------------+
|  swasth360-frontend           |  (Render Static Site)
|  React + Vite + Tailwind      |  https://swasth360-frontend.onrender.com
+---------------+---------------+
                |
                |  VITE_API_URL = https://swasth360-backend.onrender.com/api
                v
+-------------------------------+
|  swasth360-backend            |  (Render Web Service - Docker)
|  Java 21 Spring Boot 3.4      |  https://swasth360-backend.onrender.com
+---------------+---------------+
                |
                |  AI_SERVICE_URL = https://swasth360-ai-service.onrender.com
                v
+-------------------------------+
|  swasth360-ai-service         |  (Render Web Service - Docker)
|  Python 3.12 FastAPI          |  https://swasth360-ai-service.onrender.com
+-------------------------------+
```

---

## Step 1: Push Your Code to GitHub

1. In your local terminal, initialize Git (if not already done) and commit all files:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for Swasth360"
   ```
2. Create a new repository on [GitHub](https://github.com/new) (e.g., `swasth360`).
3. Push your repository:
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/swasth360.git
   git push -u origin main
   ```

---

## Option A: One-Click Deploy via Render Blueprint (Recommended)

Render can automatically configure all three services using the included `render.yaml` file:

1. Log in to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** in the top navigation and select **Blueprint**.
3. Connect your GitHub repository (`swasth360`).
4. Render will read `render.yaml` and discover:
   - `swasth360-ai-service` (Docker Web Service)
   - `swasth360-backend` (Docker Web Service)
   - `swasth360-frontend` (Static Site)
5. Click **Apply**.
6. Once deployed, copy your backend URL (e.g. `https://swasth360-backend.onrender.com`) and set it in `swasth360-frontend`'s **Environment** tab:
   - Key: `VITE_API_URL`
   - Value: `https://swasth360-backend.onrender.com/api`
7. Click **Manual Deploy > Deploy Latest Commit** on the frontend service.

---

## Option B: Manual Service-by-Service Deployment

If you prefer deploying services individually through the Render Web UI, follow these steps in order:

### 1. Deploy the Python AI Service (`swasth360-ai-service`)

1. In Render Dashboard, click **New + > Web Service**.
2. Connect your GitHub repository.
3. Configure settings:
   - **Name:** `swasth360-ai-service`
   - **Region:** `Oregon (US West)` (choose the same region for all services)
   - **Language / Environment:** `Docker`
   - **Docker Context Directory:** `./ai-service`
   - **Dockerfile Path:** `./ai-service/Dockerfile`
   - **Instance Type:** `Free`
4. Under **Advanced / Environment Variables**, add:
   - `PORT`: `8000`
5. Click **Create Web Service**.
6. Once deployed, copy your AI Service URL:
   `https://swasth360-ai-service.onrender.com`

---

### 2. Deploy the Spring Boot Backend (`swasth360-backend`)

1. In Render Dashboard, click **New + > Web Service**.
2. Connect your GitHub repository.
3. Configure settings:
   - **Name:** `swasth360-backend`
   - **Region:** `Oregon (US West)` (same region as AI Service)
   - **Language / Environment:** `Docker`
   - **Docker Context Directory:** `./backend`
   - **Dockerfile Path:** `./backend/Dockerfile`
   - **Instance Type:** `Free`
4. Under **Advanced / Environment Variables**, add:
   - `PORT`: `8080`
   - `AI_SERVICE_URL`: `https://swasth360-ai-service.onrender.com` *(paste your AI Service URL from step 1)*
   - `APP_JWT_SECRET`: `Swasth360SuperSecretJwtKeyHealthcarePrototypes2026SecureIndiaKey!`
5. Click **Create Web Service**.
6. Wait for the build and deployment to complete (takes ~2-3 minutes for Maven and Temurin JDK 21).
7. Copy your Backend URL:
   `https://swasth360-backend.onrender.com`

---

### 3. Deploy the React Frontend (`swasth360-frontend`)

1. In Render Dashboard, click **New + > Static Site**.
2. Connect your GitHub repository.
3. Configure settings:
   - **Name:** `swasth360-frontend`
   - **Branch:** `main`
   - **Build Command:** `cd frontend && npm install && npm run build`
   - **Publish Directory:** `./frontend/dist`
4. Under **Environment Variables**, add:
   - `VITE_API_URL`: `https://swasth360-backend.onrender.com/api` *(paste your backend URL from step 2 + `/api`)*
5. Under **Redirects/Rewrites**, click **Add Rule**:
   - **Type:** `Rewrite`
   - **Source:** `/*`
   - **Destination:** `/index.html`
   *(This ensures React Router URLs like `/hospital-onboarding` or `/login` work when refreshed directly)*
6. Click **Create Static Site**.

---

## 4. Test Your Deployed Application

Once all three services show a green **Live** status:

1. Open your Frontend URL (e.g. `https://swasth360-frontend.onrender.com`).
2. Test the **AI Agents** demos:
   - Go to `/agents` and try any demo prompt.
3. Test **Login**:
   - Go to `/login` and use the quick-fill buttons:
     - `admin@swasth360.in` / `Admin@123` (Swasth360 Admin)
     - `hospitaladmin@abchealthcare.demo` / `Hospital@123` (Hospital Admin)
     - `staff@abchealthcare.demo` / `Staff@123` (Hospital Staff)
     - `rahul.sharma@example.com` / `User@123` (Individual User)
4. Test **Onboarding**:
   - Visit `/hospital-onboarding` and submit a new hospital enquiry.
   - Log in as Platform Admin and approve the request.

---

## Render Free Tier Considerations

- **Cold Starts:** On Render's Free tier, backend web services spin down after 15 minutes of inactivity. The first request after a period of inactivity may take ~30–50 seconds while the container wakes up.
- **Embedded Database:** By default, Swasth360 runs in self-contained mode with an in-memory database that automatically seeds demo accounts on startup. If you wish to attach an external persistent Render PostgreSQL database:
  1. Click **New + > PostgreSQL** on Render.
  2. In your backend web service environment variables, set:
     - `SPRING_PROFILES_ACTIVE`: `postgres`
     - `SPRING_DATASOURCE_URL`: `jdbc:postgresql://<render-db-host>:5432/<render-db-name>`
     - `SPRING_DATASOURCE_USERNAME`: `<render-db-user>`
     - `SPRING_DATASOURCE_PASSWORD`: `<render-db-password>`
