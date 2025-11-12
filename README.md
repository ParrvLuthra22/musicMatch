# TuneMate — A Music-Based Social Matching Platform (parrv demo2)

> Hosted Frontend URL (Vercel): ADD AFTER DEPLOYMENT
>
> Backend URL (Render): ADD AFTER DEPLOYMENT

This repository contains a minimal auth-only implementation to satisfy the parrv demo2 acceptance checklist (signup/login + infra), along with the full project proposal below. Only the required auth endpoints are implemented in code; all other features are proposal scope for future work.

## Project Proposal (Full Text)

### 1. Project Title
TuneMate — A Music-Based Social Matching Platform

### 2. Problem Statement
Music connects people across boundaries yet most social or dating platforms don’t leverage shared music taste to form genuine bonds. TuneMate aims to match users through their favourite artists, playlists, and genres, allowing them to chat and discover music together in real time.

### 3. System Architecture
Frontend → Backend (API) → Database
- Frontend: React.js + Tailwind CSS (Routing via React Router)
- Backend: Node.js + Express.js
- Database: PostgreSQL (relational)
- Authentication: Supabase Authentication (Email/Password or Spotify Sign-In) / JWT authorisation and authentication
- Hosting:
   - Frontend → Vercel
   - Backend → Render
   - Database → Railway

### 5. Key Features
Category | Features
--- | ---
Authentication & Authorization | Supabase-based login, signup, Google auth, JWT authentication and authorisation
CRUD Operations | Manage profiles, playlists, and user connections
Frontend Routing | Pages: Home, Login, Discover, Chat, Profile
Filtering, Searching, Sorting, Pagination | Filter users by genre, artist, or vibe; sort according to popularity
Music Sync & Chat | Real-time chat with embedded music sharing
Hosting | Frontend + backend deployed and accessible

### 6. Tech Stack
Layer | Technologies
--- | ---
Frontend | React.js, Tailwind CSS, Axios, React Router
Backend | Node.js, Express.js
Database | PostgreSQL
Authentication | Supabase Authentication / JWT Authentication and Authorisation
Hosting | Frontend: Vercel, Backend: Render, Database: Railway

### 7. API Overview (Proposal)
Endpoint | Method | Description | Access
--- | --- | --- | ---
/api/auth/signup | POST | Register new user | Public
/api/auth/login | POST | Authenticate user | Public
/api/users | GET | Fetch all users (with filters) | Authenticated
/api/users/:id | GET | Fetch single user profile | Authenticated
/api/matches | POST | Create or accept a match | Authenticated
/api/matches/:id | DELETE | Remove connection | Authenticated
/api/message/roomid | GET | Fetch chat messages | Authenticated
/api/messages | POST | Send a new message | Authenticated

Note: This submission implements only `/api/auth/signup` and `/api/auth/login` as required by the acceptance checklist.

## Scope of this submission (implemented)
- Frontend: Next.js minimal pages (Home, Signup, Login) using `NEXT_PUBLIC_API_URL`
- Backend: Node.js + Express, Prisma ORM, PostgreSQL
- Auth endpoints only:
   - POST `/api/auth/signup` — create user with bcrypt-hashed password
   - POST `/api/auth/login` — returns JWT (HS256) with payload `{ sub, email }`, exp 7d
- Prisma artifacts: schema, migrations (create User), seed script (1 demo user)
- Deployment configs: `vercel.json`, `render.yaml`
- Security: No secrets committed; `.env.example` provided

## Prisma Schema (backend/prisma/schema.prisma)
```prisma
model User {
   id         String   @id @default(uuid())
   name       String
   email      String   @unique
   password   String
   createdAt  DateTime @default(now())
   updatedAt  DateTime @updatedAt
}
```

## Auth Endpoints (implemented)
- POST `/api/auth/signup` — validate inputs, `bcrypt.hash(password, 10)`, store user, return `{ success: true, userId }`
- POST `/api/auth/login` — verify credentials, sign JWT, return `{ token }`

## Verification Checklist (Production)
1) Frontend Signup
- Go to hosted frontend URL (Vercel) → `/signup` → create account → expect success

2) Database Row
- Run SQL:
```sql
SELECT id, name, email, password FROM "User" WHERE email = 'verify@example.com';
```
- Confirm `password` is a bcrypt hash (starts with `$2b$` or `$2a$`)

3) Frontend Login
- Go to `/login` → login with same credentials → copy returned JWT from page

4) JWT Verification
- Paste token at https://jwt.io and confirm payload has `sub` (UUID user id) and `email`

5) API Curl Tests (replace `<backend>` with your backend URL)
```bash
curl -X POST https://<backend>/api/auth/signup \
   -H "Content-Type: application/json" \
   -d '{"name":"Test","email":"verify@example.com","password":"Test@1234"}'

curl -X POST https://<backend>/api/auth/login \
   -H "Content-Type: application/json" \
   -d '{"email":"verify@example.com","password":"Test@1234"}'
```

## Environment Variables (.env.example)
Required names only; do not commit real secrets.
```env
# Backend
DATABASE_URL=postgres://USER:PASSWORD@HOST:PORT/DB_NAME
JWT_SECRET=replace-with-strong-secret
PORT=4000
FRONTEND_ORIGIN=https://your-frontend.vercel.app

# Frontend
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

## Deployment Steps
### 1) Provision PostgreSQL (your account)
- Use Railway / Aiven / Neon / Supabase / AWS RDS
- Copy the connection string and keep it private

### 2) Backend on Render
- Create a Web Service from GitHub repo
- Set environment variables:
   - `DATABASE_URL` = your production Postgres URL
   - `JWT_SECRET` = strong secret (e.g., `openssl rand -base64 32`)
   - `NODE_ENV` = production
   - `PORT` = 4000 (Render sets internally; keep for consistency)
   - `FRONTEND_ORIGIN` = your Vercel frontend origin
- Build & start: `npm install && npx prisma generate` then `npm start`
- After first deploy, open Shell → `npx prisma migrate deploy`
- (Optional) Seed: `node prisma/seed.js`

### 3) Frontend on Vercel
- Import repository; set project root to `frontend/` if needed
- Set Environment Variable: `NEXT_PUBLIC_API_URL` = your Render backend URL
- Deploy and update the hosted URL at the top of this README

### 4) Local Development (optional)
```bash
# Backend
cp .env.example .env
# Edit DATABASE_URL & JWT_SECRET
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
npm start

# Frontend
cd frontend
cp .env.example .env.local
# Edit NEXT_PUBLIC_API_URL (e.g., http://localhost:4000)
npm install
npm run dev
```

## Stop Condition (Acceptance)
Development stops once the following are true:
- Backend is deployed to your Render/Railway/AWS account and connected to your production PostgreSQL
- Frontend is deployed to your Vercel account and calls the backend via `NEXT_PUBLIC_API_URL`
- Signing up from the deployed frontend creates a user row in the production DB with a bcrypt-hashed password
- Logging in from the deployed frontend returns a JWT that decodes to a payload containing `sub` (user id) and `email` at jwt.io
- This README contains the full project proposal and the hosted frontend URL
