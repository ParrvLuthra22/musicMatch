# tuneMate Backend API

Backend server for tuneMate - a music-based social matching application.

## 🚀 Features

- **User Profiles**: Manage user profiles with music preferences
- **Spotify Integration**: Sync user data from Spotify API
- **Smart Matching**: Calculate compatibility scores based on music taste
- **Real-time Messaging**: Send messages between matched users
- **Secure Authentication**: JWT-based authentication with Supabase

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account
- Spotify Developer account

## 🛠️ Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory:
```bash
cp .env.example .env
```

3. Fill in your environment variables in `.env`:
   - Supabase URL and keys
   - Spotify Client ID and Secret
   - Other configuration options

## 🏃 Running the Server

### Development mode (with auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The server will start on `http://localhost:3001` by default.

## 📚 API Endpoints

### Health Check
- `GET /health` - Server health status

### Profiles
- `GET /api/profiles/me` - Get current user's profile
- `PUT /api/profiles/me` - Update current user's profile
- `GET /api/profiles/:id` - Get profile by ID
- `GET /api/profiles` - Get all profiles (discovery)
- `GET /api/profiles/search?q=query` - Search profiles

### Matches
- `GET /api/matches` - Get all matches
- `GET /api/matches/discover` - Discover potential matches
- `GET /api/matches/accepted` - Get accepted matches
- `POST /api/matches` - Create a match
- `GET /api/matches/:matchId` - Get match details
- `PATCH /api/matches/:matchId/status` - Update match status
- `DELETE /api/matches/:matchId` - Delete match

### Messages
- `GET /api/messages/conversations` - Get all conversations
- `GET /api/messages/match/:matchId` - Get messages for a match
- `POST /api/messages` - Send a message
- `DELETE /api/messages/:messageId` - Delete message

### Spotify
- `GET /api/spotify/top-tracks` - Get user's top tracks
- `GET /api/spotify/top-artists` - Get user's top artists
- `GET /api/spotify/currently-playing` - Get currently playing track
- `GET /api/spotify/profile` - Get Spotify profile
- `POST /api/spotify/sync` - Sync Spotify data to profile
- `GET /api/spotify/search?q=query` - Search Spotify

## 🔐 Authentication

All API endpoints (except `/health` and `/api`) require authentication. Include the Supabase JWT token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

For Spotify endpoints, you may also need to include:
```
X-Spotify-Token: YOUR_SPOTIFY_ACCESS_TOKEN
```

## 📁 Project Structure

```
backend/
├── config/           # Configuration files
├── controllers/      # Route controllers
├── middleware/       # Express middleware
├── models/          # Database models
├── routes/          # API routes
├── services/        # External services (Spotify)
├── utils/           # Utility functions
├── server.js        # Main server file
└── package.json
```

## 🧪 Testing

Use tools like Postman or curl to test the API endpoints. Make sure to:
1. Authenticate with Supabase first
2. Get a JWT token
3. Include the token in your requests

## 🔧 Configuration

Key configuration options in `.env`:

- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Environment (development/production)
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key
- `SPOTIFY_CLIENT_ID`: Spotify app client ID
- `SPOTIFY_CLIENT_SECRET`: Spotify app client secret
- `ALLOWED_ORIGINS`: CORS allowed origins

## 📝 License

ISC
