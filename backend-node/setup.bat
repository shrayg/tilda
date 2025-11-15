@echo off
echo Setting up SafeRoute Backend...
echo.

REM Change to backend-node directory
cd /d "%~dp0"

echo [1/3] Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo Error installing dependencies!
    pause
    exit /b 1
)

echo.
echo [2/3] Generating Prisma client...
call npx prisma generate
if %ERRORLEVEL% NEQ 0 (
    echo Error generating Prisma client!
    pause
    exit /b 1
)

echo.
echo [3/3] Running database migrations...
call npx prisma migrate dev --name init
if %ERRORLEVEL% NEQ 0 (
    echo Error running migrations!
    pause
    exit /b 1
)

echo.
echo Setup complete! 
echo.
echo To start the server:
echo   npm run dev
echo.
echo Or:
echo   npm start
echo.
pause

