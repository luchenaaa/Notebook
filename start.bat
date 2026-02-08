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

REM Wait for frontend to start
echo.
echo Waiting for frontend to start...
timeout /t 5 /nobreak >nul

REM Open browser automatically
echo Opening browser at http://localhost:3000...
start http://localhost:3000

echo.
echo Both servers are running in separate windows.
echo Backend: http://localhost:3001
echo Frontend: http://localhost:3000
echo Browser opened automatically!
echo.
echo Close this window or press any key to exit...
pause >nul
