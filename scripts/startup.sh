#!/bin/sh

# Startup script for Bedrock Manager
# This script runs before the main application starts

echo "Starting Bedrock Manager..."

# Create necessary directory structure
echo "Initializing filesystem structure..."
mkdir -p /srv/minecraft/bedrock/servers
mkdir -p /tmp

echo "Filesystem structure initialized successfully"

# Determine environment and start appropriate command
if [ "$NODE_ENV" = "production" ]; then
    echo "Starting Next.js production server..."
    exec node server.js
else
    echo "Starting Next.js development server..."
    exec npm run dev
fi
