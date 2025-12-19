#!/bin/bash
echo "Cleaning up node_modules and package-lock.json..."
rm -rf node_modules package-lock.json

echo "Reinstalling dependencies..."
npm install

echo "Building the project..."
npm run build
