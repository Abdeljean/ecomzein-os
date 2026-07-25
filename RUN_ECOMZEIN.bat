@echo off
title E-comZein OS - Local Engine Launcher
color 0A
cls
echo ===============================================================================
echo                 🚀 E-comZein OS — Local Launcher
echo ===============================================================================
echo.
echo  Starting local HTTP server and REST API Backend...
echo  App URL:  http://localhost:8080
echo  API URL:  http://localhost:5000/api/v1/health
echo.
echo ===============================================================================

start "E-comZein Frontend (Port 8080)" cmd /k "cd /d %~dp0 && python -m http.server 8080"
start "E-comZein Backend (Port 5000)" cmd /k "cd /d %~dp0backend && npm start"

timeout /t 3 >nul
start http://localhost:8080
echo ✅ E-comZein OS is running cleanly!
pause
