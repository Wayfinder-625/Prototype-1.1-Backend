#!/bin/bash

# Exit on any error
set -e

echo "🚀 Starting deployment..."

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "🗄️ Running database migrations..."
npx prisma migrate deploy

# Build the application
echo "🏗️ Building application..."
npm run build

# Restart the application
echo "🔄 Restarting application..."
pm2 restart competition-backend || pm2 start npm --name "competition-backend" -- run start:prod

echo "✅ Deployment completed successfully!" 