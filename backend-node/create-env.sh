#!/bin/bash
echo "Creating .env file..."
echo

cat > .env << 'EOF'
# Mapbox (Required)
MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoicmlhemExNjIiLCJhIjoiY21nMmhkeG05MDdtcDJycG95aDNkNGRrayJ9.okIiL_beCCP6u1W6kdX02w

# Database
DATABASE_URL=file:./dev.db

# NYC API Keys (Optional)
NYC_OPEN_DATA_API_KEY=
NYC_511_API_KEY=
WEATHER_API_KEY=

# OAuth - Google (Optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# OAuth - Apple (Optional)
APPLE_CLIENT_ID=
APPLE_TEAM_ID=
APPLE_KEY_ID=
APPLE_PRIVATE_KEY=

# JWT
JWT_SECRET=dev-secret-key-change-in-production
JWT_EXPIRES_IN=30d

# Server
PORT=5000
NODE_ENV=development
CORS_ORIGINS=http://localhost:8080,http://localhost:5173
EOF

echo ".env file created successfully!"
echo
echo "Next steps:"
echo "  1. Run: npx prisma migrate dev --name init"
echo "  2. Run: npm run dev"
echo

