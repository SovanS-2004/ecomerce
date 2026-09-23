@echo off
title E-Commerce Analytics Dashboard Starter
echo ========================================================
echo Starting E-Commerce Sales & Customer Analytics Dashboard
echo ========================================================
echo.

echo 1. Launching Backend Server (FastAPI on Port 8000)...
start "Analytics Backend (FastAPI)" cmd /k "cd /d "%~dp0backend" && python -m uvicorn main:app --host 127.0.0.1 --port 8000"

echo 2. Waiting for Backend to initialize...
timeout /t 3 /nobreak >nul

echo 3. Launching Frontend Server (Vite React on Port 5173)...
start "Analytics Frontend (React)" cmd /k "cd /d "%~dp0frontend" && npm.cmd run dev"

echo 4. Waiting for Frontend to start...
timeout /t 4 /nobreak >nul

echo 5. Opening Dashboard in your default web browser...
start http://localhost:5173

echo.
echo ========================================================
echo Dashboard is now running!
echo Frontend: http://localhost:5173
echo Backend API Docs: http://127.0.0.1:8000/docs
echo ========================================================
pause
