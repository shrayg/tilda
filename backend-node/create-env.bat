@echo off
echo Creating .env file...
echo.

(
echo # Mapbox (Required)
echo MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoicmlhemExNjIiLCJhIjoiY21nMmhkeG05MDdtcDJycG95aDNkNGRrayJ9.okIiL_beCCP6u1W6kdX02w
echo.
echo # Database
echo DATABASE_URL=file:./dev.db
echo.
echo # NYC API Keys (Optional)
echo NYC_OPEN_DATA_API_KEY=
echo NYC_511_API_KEY=
echo WEATHER_API_KEY=
echo.
echo # OAuth - Google (Optional)
echo GOOGLE_CLIENT_ID=
echo GOOGLE_CLIENT_SECRET=
echo.
echo # OAuth - Apple (Optional)
echo APPLE_CLIENT_ID=
echo APPLE_TEAM_ID=
echo APPLE_KEY_ID=
echo APPLE_PRIVATE_KEY=
echo.
echo # JWT
echo JWT_SECRET=dev-secret-key-change-in-production
echo JWT_EXPIRES_IN=30d
echo.
echo # Server
echo PORT=5000
echo NODE_ENV=development
echo CORS_ORIGINS=http://localhost:8080,http://localhost:5173
) > .env

echo .env file created successfully!
echo.
echo Next steps:
echo   1. Run: npx prisma migrate dev --name init
echo   2. Run: npm run dev
echo.
pause

