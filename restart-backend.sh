#!/bin/bash
# Restart Node.js backend for jelajah-warisan-nusantara

# Stop any process using port 3000
echo "Stopping any process on port 3000..."
PID=$(lsof -t -i:3000)
if [ ! -z "$PID" ]; then
  kill -9 $PID
  echo "Killed process $PID on port 3000."
else
  echo "No process found on port 3000."
fi

# Navigate to backend directory
cd "$(dirname "$0")/backend" || { echo "Backend directory not found!"; exit 1; }

# Install dependencies (optional, comment out if not needed)
# echo "Installing dependencies..."
# npm install

# Start backend (adjust to your process manager if needed)
echo "Starting backend with node src/server.ts..."
nohup npx ts-node src/server.ts > ../backend.log 2>&1 &

echo "Backend restarted. Check backend.log for output."