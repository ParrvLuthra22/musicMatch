# TuneMate

TuneMate is a music-based dating application that matches users based on their music taste. It integrates with Spotify to analyze listening habits and Ticketmaster to suggest concert dates.

## Features

- **Music Compatibility Matching**: Matches users based on shared artists and genres.
- **Spotify Integration**: Syncs top artists and genres from Spotify.
- **Collaborative Playlists**: Create shared playlists with matches directly in the chat.
- **Concert Discovery**: Find and share upcoming concerts for matched artists.
- **Real-time Chat**: Instant messaging with socket.io.
- **Dashboard**: View stats, recent matches, and compatibility highlights.

## Prerequisites

- Node.js (v14+)
- MongoDB Atlas Account
- Spotify Developer Account
- Ticketmaster Developer Account

## Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/tuneMate.git
    cd tuneMate
    ```

2.  **Backend Setup**
    ```bash
    cd backend
    npm install
    ```

3.  **Frontend Setup**
    ```bash
    cd ../frontend
    npm install
    ```

## Environment Setup

1.  **Backend**
    - Copy `.env.example` to `.env` in the `backend` directory.
    - Fill in the required values (see `.env.example` for details).

    ```bash
    cd backend
    cp .env.example .env
    ```

2.  **Frontend**
    - No specific `.env` is required for the frontend in this version, as it proxies requests to the backend or uses relative paths.

## Database Setup (MongoDB Atlas)

1.  Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  Create a new Cluster.
3.  In "Database Access", create a database user.
4.  In "Network Access", allow access from anywhere (0.0.0.0/0) for development.
5.  Get your connection string from "Connect" > "Connect your application".
6.  Paste it into `MONGO_URI` in `backend/.env`.

## Spotify Developer App Setup

1.  Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/).
2.  Create a new App.
3.  Note the **Client ID** and **Client Secret**.
4.  Edit Settings and add `http://localhost:5173/callback` to **Redirect URIs**.
5.  Add these credentials to `backend/.env`.

## Running the App

1.  **Start Backend**
    ```bash
    cd backend
    npm start
    ```
    Server will run on `http://localhost:5000`.

2.  **Start Frontend**
    ```bash
    cd frontend
    npm run dev
    ```
    App will run on `http://localhost:5173`.

## API Documentation

See [API_DOCS.md](./API_DOCS.md) for detailed API endpoint documentation.

## Folder Structure

```
tuneMate/
├── backend/                # Node.js/Express Backend
│   ├── config/             # DB configuration
│   ├── controllers/        # Route logic
│   ├── middleware/         # Auth & error handling
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── services/           # External API services (Spotify, Ticketmaster)
│   └── server.js           # Entry point
├── frontend/               # React/Vite Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React Context (Auth, Chat, Toast)
│   │   ├── pages/          # Application pages
│   │   └── App.jsx         # Main component
│   └── tailwind.config.js  # Tailwind CSS config
└── README.md               # Project documentation
```

## Known Limitations & Future Improvements

- **Spotify Token Expiry**: The frontend handles token refresh via backend, but edge cases might require re-login.
- **Mobile Navigation**: Bottom nav is hidden on desktop, but desktop nav could be improved.
- **Real-time Updates**: Playlist updates currently require a refresh or action to appear for the other user (Socket.io integration planned).
- **Match Algorithm**: Currently uses a basic scoring system; could be enhanced with more complex music analysis.
- **Deployment**: Currently configured for local development. Needs build scripts for production deployment (e.g., Vercel/Heroku).
