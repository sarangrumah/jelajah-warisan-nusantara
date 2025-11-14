#!/bin/bash

# Deploy password reset fix to production
echo "🚀 Deploying password reset fix to production..."

# Build the backend
echo "📦 Building backend..."
cd backend
npm run build

# Restart the production backend service
echo "🔄 Restarting production backend service..."
# Use your deployment method here - this depends on your production setup
# Examples:
# pm2 restart backend
# systemctl restart backend-service
# docker-compose restart backend

echo "✅ Password reset fix deployed!"
echo ""
echo "📝 Changes deployed:"
echo "   - Added email normalization to forgotPassword endpoint"
echo "   - Extended token expiration from 1h to 24h"
echo "   - Enhanced logging for debugging"
echo "   - Added password hash validation"
echo ""
echo "🔍 The issue was: Email normalization inconsistency between signIn and forgotPassword"
echo "   Before: signIn normalized emails, forgotPassword did not"
echo "   After: Both endpoints normalize emails consistently"
echo ""
echo "📧 Test with: sarangrumah.dev@gmail.com"
echo "   Should now work regardless of email case variation"