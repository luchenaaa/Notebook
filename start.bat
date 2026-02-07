@echo off
echo Starting Notebook & Calendar App...
echo.

REM Start backend server
echo Starting backend server on http://localhost:3001...
start "Backend Server" cmd /k "cd backend && npm start"

REM Wait a moment for backend to initialize
timeout /t 3 /nobreak >nul

REM Start frontend dev server
echo Starting frontend on http://localhost:3000...
start "Frontend Dev Server" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting in separate windows.
echo Backend: http://localhost:3001
echo Frontend: http://localhost:3000
echo.
echo Close this window or press any key to exit...
pause >nul
