@echo off
:: Real Estate Universal AI Platform - Windows Startup Script
:: Automatically installs dependencies and starts the Full-Stack server.

echo Installing Node Dependencies...
call npm install

echo Starting Application in Development Mode...
call npm run dev
