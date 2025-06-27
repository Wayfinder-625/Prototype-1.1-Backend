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

# Zero-downtime deployment with PM2
echo "🔄 Deploying with zero-downtime..."
if pm2 list | grep -q "nestjs-app"; then
    # Process exists - use reload for zero-downtime update
    echo "📈 Reloading existing process for zero-downtime update..."
    pm2 reload nestjs-app --update-env
else
    # Process doesn't exist - start for the first time
    echo "🚀 Starting new process..."
    pm2 start npm --name "nestjs-app" -- run start:prod
fi

echo "✅ Deployment completed successfully!" 