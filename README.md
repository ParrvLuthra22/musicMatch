# TuneMate Auth Minimal (parrv demo2)# TuneMate (parrv demo2)# TuneMate - Music-Based Social Matching Platform



> Hosted Frontend URL: (ADD AFTER VERCEL DEPLOYMENT HERE)

> Backend URL: (ADD AFTER RENDER DEPLOYMENT HERE)

Minimal auth-only implementation: Node.js + Express + Prisma + PostgreSQL with email/password signup and JWT login. No extra features.TuneMate is a modern social matching platform that connects users through their shared music taste. Built with React and Supabase, it integrates with Spotify to create meaningful connections based on musical preferences.

## Project Proposal (Full Text)



parrv demo2

## What’s included## ⚡ Quick Start

Minimal auth-only implementation: Node.js + Express + Prisma + PostgreSQL with email/password signup and JWT login. No extra features. Frontend (Next.js) uses `NEXT_PUBLIC_API_URL` to call backend.

- POST /api/auth/signup: create user with bcrypt-hashed password

## Tech Stack & Constraints

- Frontend: Next.js (App Router), minimal pages: Home, Signup, Login- POST /api/auth/login: returns JWT (HS256) with payload { sub, email } exp 7d**New here?** → **[START_HERE.md](./START_HERE.md)** ← Start here for 10-minute setup!

- Backend: Node.js + Express, Prisma ORM, PostgreSQL

- Auth: bcrypt (saltRounds=10) for password hashing; jsonwebtoken for JWT (HS256, 7d expiry)- Optional protected GET /api/users/:id with Bearer token

- JWT payload: `{ sub: userId, email }`

- DB: PostgreSQL with Prisma migrations and seed script- Prisma schema for User; seed script to create a demo userAlready set up? Jump to [Running the App](#running-the-app)

- Deployment: Backend on Render (render.yaml), Frontend on Vercel (vercel.json)

- Security: No secrets committed. `.env.example` only.- CORS with env-configured allowed origins

- Hard Constraint: No other features beyond signup/login.

- Render blueprint (render.yaml) for backend deployment## 🚀 Features

## Prisma Schema (backend/prisma/schema.prisma)

```prisma

model User {

  id         String   @id @default(uuid())## Environment variables- **Music-Based Matching**: Connect with people who share your musical taste

  name       String

  email      String   @uniqueBackend (`backend/.env`):- **Spotify Integration**: Sync your top artists and genres automatically

  password   String

  createdAt  DateTime @default(now())- PORT: default 4000- **Real-Time Chat**: Instant messaging with your matches

  updatedAt  DateTime @updatedAt

}- CORS_ORIGIN: comma-separated list (e.g., http://localhost:3000)- **Smart Algorithm**: Calculate compatibility based on music preferences

```

- DATABASE_URL: Postgres connection string- **Responsive Design**: Beautiful UI that works on all devices

## Auth Endpoints

`POST /api/auth/signup` — validate, hash password, store user, return `{ success: true, userId }`- JWT_SECRET: long random secret- **User Profiles**: Manage your profile and music preferences

`POST /api/auth/login` — verify credentials, sign JWT, return `{ token }`



## Verification Checklist (Production)

1. Frontend SignupSee `backend/.env.example`.## 🛠 Tech Stack

   - Go to hosted frontend URL → Signup page → create account.

   - Expect success message.

2. Database Row

   - Run SQL:## Run locally### Frontend

     ```sql

     SELECT id, name, email, password FROM "User" WHERE email = 'verify@example.com';1) cd backend- React 18 with JSX

     ```

   - Confirm `password` field is a bcrypt hash (starts with `$2b$` or `$2a$`).2) cp .env.example .env and fill values- Tailwind CSS for styling

3. Frontend Login

   - Login with same credentials.3) npm install- React Router for navigation

   - Copy returned JWT from textarea.

4. JWT Verification4) npx prisma generate- Supabase for backend services

   - Paste JWT at https://jwt.io

   - Confirm payload has `sub` (UUID user id) and `email`.5) npx prisma migrate dev --name init- Lucide React for icons

5. API Curl Tests

   ```bash6) npm run prisma:seed

   curl -X POST https://<backend>/api/auth/signup -H "Content-Type: application/json" -d '{"name":"Test","email":"verify@example.com","password":"Test@1234"}'

   curl -X POST https://<backend>/api/auth/login -H "Content-Type: application/json" -d '{"email":"verify@example.com","password":"Test@1234"}'7) npm run dev### Backend

   ```

- Supabase (PostgreSQL database, Authentication, Real-time, Edge Functions)

## Deployment Steps

### 1. Provision PostgresHealth check: GET http://localhost:4000/health- Spotify Web API integration

- Use Railway / Aiven / Neon / Supabase / AWS RDS.

- Copy connection string → set as `DATABASE_URL` in Render service and local `.env`.- Row Level Security (RLS) policies



### 2. Backend on Render## Verify functionality

- Add new Web Service from GitHub repo root.

- Environment Variables:- Signup: POST http://localhost:4000/api/auth/signup { name, email, password }## 🏃‍♂️ Quick Start

  - `DATABASE_URL` = your production Postgres URL

  - `JWT_SECRET` = strong secret (e.g. `openssl rand -base64 32`)  - Expected 201 with { success: true, userId }

  - `NODE_ENV` = production

  - `PORT` = 4000 (Render sets internally; keep for consistency)  - Confirm in DB: password is hashed (not plaintext)### Prerequisites

  - `FRONTEND_ORIGIN` = https://your-frontend.vercel.app

- Build & Start: `npm install && npx prisma generate` then `npm start`- Login: POST http://localhost:4000/api/auth/login { email, password }

- After first deploy, run migration: open Shell → `npx prisma migrate deploy`

- (Optional) Seed: `node prisma/seed.js`  - Expected 200 with { token }- Node.js 18+



### 3. Frontend on Vercel  - Verify token on jwt.io (HS256, payload contains sub and email, exp ~7 days)- A Supabase project

- Import repository, select `frontend/` as root if needed.

- Set Environment Variable:- Protected route: GET /api/users/:id with Authorization: Bearer <token>- Spotify Developer Account

  - `NEXT_PUBLIC_API_URL` = https://your-backend.onrender.com

- Deploy. Update README hosted frontend URL.  - Expected 200 with { id, name, email }



### 4. Local Development### 1. Clone and Install

```bash

# Backend## Deployment (overview)

cp .env.example .env

# Edit DATABASE_URL & JWT_SECRET- Backend: Render via render.yaml (service rootDir=backend)```bash

npm install

npx prisma generate- Frontend: Vercel (not yet scaffolded in repo); set NEXT_PUBLIC_API_URL to backend URLgit clone <repository-url>

npx prisma migrate dev --name init

npm run prisma:seed- Database: Railway/Aiven/Neon/etc.; set DATABASE_URL on Rendercd tunemate

npm run dev

npm install

# Frontend

cd frontendSee DEPLOYMENT.md for details.```

npm install

npm run dev

```### 2. Environment Setup



### 5. Production MigrationsCreate a `.env` file based on `.env.example`:

- Run once per schema change: `npx prisma migrate deploy` in Render shell.

```env

## Files OverviewVITE_SUPABASE_URL=your_supabase_project_url

- `backend/index.js` — Express server (CORS, /health, mounts /api/auth)VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

- `backend/routes/auth.js` — Signup/Login endpointsVITE_SPOTIFY_CLIENT_ID=your_spotify_client_id

- `backend/prisma/schema.prisma` — User modelVITE_APP_URL=http://localhost:5173

- `backend/prisma/seed.js` — Creates a demo user if absent```

- `frontend/app/*` — Next.js pages (Home, Signup, Login)

- `render.yaml` — Render blueprint### 3. Configure Spotify OAuth

- `vercel.json` — Vercel env hint

- `.env.example` — Variable names**Important**: Before running the app, you need to set up Spotify OAuth integration.



## Environment Variables (.env.example)#### Quick Setup (10 minutes)

```📖 **Start here**: [QUICK_START.md](./QUICK_START.md)

DATABASE_URL=postgres://USER:PASSWORD@HOST:PORT/DB_NAME

JWT_SECRET=replace-with-strong-secret#### Detailed Guides

PORT=4000- 📋 **Step-by-step**: [SPOTIFY_SETUP.md](./SPOTIFY_SETUP.md)

FRONTEND_ORIGIN=http://localhost:3000- ✅ **Checklist**: [SPOTIFY_CHECKLIST.md](./SPOTIFY_CHECKLIST.md)

NEXT_PUBLIC_API_URL=http://localhost:4000- 🔧 **Verify setup**: Run `./verify-setup.sh`

```

### 4. Database Setup

## Curl Examples (Replace <backend>)

```bash1. Go to your Supabase project dashboard

curl -X POST https://<backend>/api/auth/signup -H "Content-Type: application/json" -d '{"name":"Test","email":"verify@example.com","password":"Test@1234"}'2. Navigate to SQL Editor

curl -X POST https://<backend>/api/auth/login -H "Content-Type: application/json" -d '{"email":"verify@example.com","password":"Test@1234"}'3. Run the migration files in order:

```   - `supabase/migrations/20251013075033_morning_peak.sql` (profiles)

   - `supabase/migrations/20251013075039_shy_math.sql` (matches)

## SQL Verification   - `supabase/migrations/20251013075044_ivory_lab.sql` (messages)

```sql

SELECT id, name, email, password FROM "User" WHERE email = 'verify@example.com';### 5. Run the Application

```

#### Verify Configuration

## JWT Verification```bash

- Copy login response `token`npm run verify

- Paste at https://jwt.io```

- Confirm payload fields.

#### Start Development Server

## Stop Condition```bash

Development stops once: backend & DB deployed, frontend deployed, signup produces hashed password row, login JWT decodes correctly, README updated with live URLs.npm run dev

```

Visit `http://localhost:5173` to see the application.

#### Test Spotify Login
1. Click "Continue with Spotify"
2. Login with your Spotify account
3. Authorize the app
4. You should be redirected and logged in!

## 🎮 Running the App

### Development Mode
```bash
npm run dev          # Start dev server
npm run verify       # Check configuration
npm run lint         # Run linter
npm run typecheck    # Check TypeScript types
```

### Production Build
```bash
npm run build        # Build for production
npm run preview      # Preview production build
```

## 📱 Application Structure

```
src/
├── components/
│   ├── layout/
│   │   └── Navigation.jsx     # Main navigation component
│   ├── ui/                    # Reusable UI components
│   └── ProtectedRoute.jsx     # Route protection
├── contexts/
│   ├── AuthContext.jsx        # Authentication state
│   └── SpotifyContext.jsx     # Spotify data management
├── pages/
│   ├── Landing.jsx            # Landing page
│   ├── Auth.jsx               # Authentication
│   ├── Discover.jsx           # Match discovery
│   ├── Profile.jsx            # User profile
│   ├── Matches.jsx            # Match management
│   └── Chat.jsx               # Real-time chat
├── utils/
│   ├── cn.js                  # Class name utility
│   └── matching.js            # Matching algorithm
└── lib/
    └── supabase.js            # Supabase client
```

## 🔐 Authentication

TuneMate supports multiple authentication methods:
- Email/Password
- Spotify OAuth (recommended for music integration)

When users sign up, a profile is automatically created in the `profiles` table.

## 🎵 Spotify Integration

The Spotify integration fetches:
- User's top artists (last 6 months)
- User's top tracks
- Currently playing track
- Artist genres for matching

## 🤝 Matching Algorithm

The matching algorithm uses Jaccard similarity to calculate compatibility:

```javascript
// Weighted similarity score
const score = (genreSimilarity * 0.3 + artistSimilarity * 0.7) * 100;
```

- **70%** weight on shared artists
- **30%** weight on shared genres
- Results in a percentage match score

## 💬 Real-Time Chat

Chat functionality uses Supabase Realtime:
- Instant message delivery
- Message history storage
- Online status indicators
- Auto-scrolling to new messages

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- Users can only access their own data and matched users
- Protected routes require authentication
- Secure Spotify token handling

## 📊 Database Schema

### Profiles
- User information and preferences
- Spotify data (artists, genres)
- Profile customization

### Matches
- User connections with compatibility scores
- Status tracking (pending, accepted, rejected)
- Match history

### Messages
- Chat messages between matched users
- Real-time synchronization
- Message threading by match

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Add environment variables
3. Deploy automatically on push

### Backend (Supabase)
- Database and API are automatically managed
- Edge Functions deploy with git integration
- Built-in CDN and caching

## 🔧 Configuration

### Spotify Scopes
Required Spotify permissions:
- `user-read-email`
- `user-top-read`
- `user-read-currently-playing`

### Supabase Policies
The application uses RLS policies for:
- Profile access control
- Match privacy
- Message security

## 🐛 Troubleshooting

### Common Issues

1. **Spotify Integration Not Working**
   - Verify Spotify app settings
   - Check redirect URIs
   - Confirm scopes are correct

2. **Database Errors**
   - Ensure migrations ran successfully
   - Check RLS policies are active
   - Verify user permissions

3. **Real-Time Chat Issues**
   - Check Supabase Realtime is enabled
   - Verify channel subscriptions
   - Check network connectivity

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. See LICENSE file for details.

## 🙏 Acknowledgments

- Spotify Web API for music data
- Supabase for backend infrastructure
- Tailwind CSS for beautiful styling
- Lucide React for icons

---

For support, please open an issue on GitHub or contact the development team.