@echo off
echo Starting SafeRoute Backend...
echo.

REM Change to backend-node directory
cd /d "%~dp0"

REM Check if .env exists, if not create it
if not exist .env (
    echo Creating .env file...
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
    echo .env file created!
    echo.
)

REM Check if database exists, if not run migrations
if not exist dev.db (
    echo Setting up database...
    call npx prisma generate
    call npx prisma migrate dev --name init
    echo.
)

REM Build TypeScript
echo Building TypeScript...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo Build failed! Check for TypeScript errors.
    pause
    exit /b 1
)
echo Build successful!
echo.

REM Start server
echo ========================================
echo Starting SafeRoute Backend Server
echo ========================================
echo Server will run on: http://localhost:5000
echo Health check: http://localhost:5000/health
echo ========================================
echo.
node dist/api/index.js

pause

