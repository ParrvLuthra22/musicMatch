# TuneMate - Music-Based Social Matching Platform

TuneMate is a modern social matching platform that connects users through their shared music taste. Built with React and Supabase, it integrates with Spotify to create meaningful connections based on musical preferences.

## 🚀 Features

- **Music-Based Matching**: Connect with people who share your musical taste
- **Spotify Integration**: Sync your top artists and genres automatically
- **Real-Time Chat**: Instant messaging with your matches
- **Smart Algorithm**: Calculate compatibility based on music preferences
- **Responsive Design**: Beautiful UI that works on all devices
- **User Profiles**: Manage your profile and music preferences

## 🛠 Tech Stack

### Frontend
- React 18 with JSX
- Tailwind CSS for styling
- React Router for navigation
- Supabase for backend services
- Lucide React for icons

### Backend
- Supabase (PostgreSQL database, Authentication, Real-time, Edge Functions)
- Spotify Web API integration
- Row Level Security (RLS) policies

## 🏃‍♂️ Quick Start

### Prerequisites

- Node.js 18+
- A Supabase project
- Spotify Developer Account

### 1. Clone and Install

```bash
git clone <repository-url>
cd tunemate
npm install
```

### 2. Environment Setup

Create a `.env` file based on `.env.example`:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Setup

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the migration files in order:
   - `supabase/migrations/create_profiles.sql`
   - `supabase/migrations/create_matches.sql`
   - `supabase/migrations/create_messages.sql`

### 4. Spotify Configuration

1. Create a Spotify app at [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Add `http://localhost:5173/auth/callback` to redirect URIs
3. In Supabase Auth settings, enable Spotify provider
4. Add your Spotify Client ID and Secret

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to see the application.

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