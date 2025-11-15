import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Mapbox
  mapboxToken: process.env.MAPBOX_ACCESS_TOKEN || '',
  
  // Database
  databaseUrl: process.env.DATABASE_URL || 'file:./dev.db',
  
  // API Keys
  nycOpenDataApiKey: process.env.NYC_OPEN_DATA_API_KEY || '',
  nyc511ApiKey: process.env.NYC_511_API_KEY || '',
  weatherApiKey: process.env.WEATHER_API_KEY || '',
  
  // OAuth
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  appleClientId: process.env.APPLE_CLIENT_ID || '',
  appleTeamId: process.env.APPLE_TEAM_ID || '',
  appleKeyId: process.env.APPLE_KEY_ID || '',
  applePrivateKey: process.env.APPLE_PRIVATE_KEY || '',
  
  // JWT
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-key-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '30d',
  
  // Server
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigins: process.env.CORS_ORIGINS?.split(',').map(s => s.trim()) || [
    'http://localhost:8080',
    'http://localhost:5173',
  ],
};

// Validate required config
if (!config.mapboxToken) {
  console.warn('Warning: MAPBOX_ACCESS_TOKEN is not set');
}

