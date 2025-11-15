@echo off
echo ========================================
echo Starting Tilde Application
echo ========================================
echo.

REM Get the project root directory
cd /d "%~dp0"

REM Start backend in new window
echo [1/2] Starting backend server...
start "Tilde Backend" cmd /k "cd /d %CD%\backend-node && start.bat"

REM Wait a bit for backend to start
echo Waiting for backend to initialize...
timeout /t 3 /nobreak >nul

REM Start frontend in new window
echo [2/2] Starting frontend server...
start "Tilde Frontend" cmd /k "cd /d %CD% && npm run dev"

echo.
echo ========================================
echo Both servers are starting in separate windows
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:8080
echo.
echo Backend Health: http://localhost:5000/health
echo.
echo Press any key to exit this window (servers will keep running)...
pause >nul

