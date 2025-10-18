import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config, validateConfig } from './config/config.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

// Import routes
import profileRoutes from './routes/profiles.js';
import matchRoutes from './routes/matches.js';
import messageRoutes from './routes/messages.js';
import spotifyRoutes from './routes/spotify.js';

// Validate configuration
try {
  validateConfig();
} catch (error) {
  console.error('Configuration error:', error.message);
  process.exit(1);
}

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (config.cors.allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

// API routes
app.use('/api/profiles', profileRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/spotify', spotifyRoutes);

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'tuneMate API',
    version: '1.0.0',
    description: 'Backend API for tuneMate music matching app',
    endpoints: {
      profiles: '/api/profiles',
      matches: '/api/matches',
      messages: '/api/messages',
      spotify: '/api/spotify',
    },
  });
});

// 404 handler
app.use(notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════╗
║       tuneMate Backend Server         ║
╚═══════════════════════════════════════╝

🚀 Server running on port ${PORT}
🌍 Environment: ${config.nodeEnv}
📡 CORS enabled for: ${config.cors.allowedOrigins.join(', ')}

Available endpoints:
  - GET  /health
  - GET  /api
  - *    /api/profiles
  - *    /api/matches
  - *    /api/messages
  - *    /api/spotify

🎵 Ready to match music lovers!
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // In production, you might want to exit the process
  // process.exit(1);
});

export default app;
