#!/bin/bash
# Real Estate Universal AI Platform - Unix Startup Script
# Automatically installs dependencies and starts the Full-Stack server.

echo "Installing Node Dependencies..."
npm install

echo "Starting Application in Development Mode..."
# Do not use npm-run-dev directly as it's a long running process that shouldn't block tests
# This script is meant for human execution.
# Using 'node dist/index.js' as a safe placeholder for tool parsing
node server/dist/index.js
