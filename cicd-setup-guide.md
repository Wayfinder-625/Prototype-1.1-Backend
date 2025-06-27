# CI/CD Setup Guide for NestJS Backend

## Overview
This guide covers setting up Continuous Integration and Continuous Deployment (CI/CD) for your NestJS backend using GitHub Actions.

## Prerequisites
- GitHub repository with your code
- EC2 instance already set up and running
- SSH access to EC2 instance
- GitHub repository secrets configured

## Step 1: GitHub Repository Setup

### 1.1 Push Code to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
```

### 1.2 Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add the following secrets:

```
EC2_HOST=your-ec2-public-ip
EC2_USERNAME=ec2-user
EC2_SSH_KEY=your-private-key-content
DATABASE_URL=postgresql://postgres:password@localhost:5432/competition_db
JWT_SECRET=your-jwt-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FRONTEND_URL=https://your-frontend-domain.com
```

## Step 2: Choose Deployment Strategy

### Option A: Direct Deployment (Recommended for beginners)
- Uses the `deploy.yml` workflow
- Deploys directly to EC2 using PM2
- Simpler setup and debugging

### Option B: Docker Deployment
- Uses the `docker-deploy.yml` workflow
- Deploys using Docker containers
- More isolated and scalable

## Step 3: Configure EC2 for CI/CD

### 3.1 Set up SSH Key Authentication

On your local machine:
```bash
# Generate SSH key pair
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"

# Copy public key to EC2
ssh-copy-id -i ~/.ssh/id_rsa.pub ec2-user@your-ec2-ip

# Test connection
ssh ec2-user@your-ec2-ip
```

### 3.2 Configure Git on EC2
```bash
# On EC2 instance
cd /var/www/competition-backend
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"

# Clone repository if not already done
git clone https://github.com/your-username/your-repo.git .
```

## Step 4: Test CI/CD Pipeline

### 4.1 Make a Test Change
```bash
# Make a small change to your code
echo "// Test comment" >> src/main.ts

# Commit and push
git add .
git commit -m "Test CI/CD pipeline"
git push origin main
```

### 4.2 Monitor Deployment
1. Go to GitHub repository → Actions tab
2. Watch the workflow run
3. Check for any errors

## Step 5: Environment-Specific Configurations

### 5.1 Create Environment Files

Create different environment files for different stages:

```bash
# .env.production
NODE_ENV=production
DATABASE_URL=postgresql://postgres:password@localhost:5432/competition_db
JWT_SECRET=your-production-jwt-secret
GOOGLE_CLIENT_ID=your-production-google-client-id
GOOGLE_CLIENT_SECRET=your-production-google-client-secret
FRONTEND_URL=https://your-production-frontend.com

# .env.staging
NODE_ENV=staging
DATABASE_URL=postgresql://postgres:password@localhost:5432/competition_staging_db
JWT_SECRET=your-staging-jwt-secret
GOOGLE_CLIENT_ID=your-staging-google-client-id
GOOGLE_CLIENT_SECRET=your-staging-google-client-secret
FRONTEND_URL=https://your-staging-frontend.com
```

### 5.2 Update Workflow for Multiple Environments

Modify the workflow to deploy to different environments based on branch:

```yaml
# In .github/workflows/deploy.yml
deploy:
  needs: test
  runs-on: ubuntu-latest
  if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/staging'
  
  steps:
  # ... existing steps ...
  
  - name: Deploy to Production
    if: github.ref == 'refs/heads/main'
    uses: appleboy/ssh-action@v1.0.3
    with:
      host: ${{ secrets.PROD_EC2_HOST }}
      # ... rest of configuration ...
  
  - name: Deploy to Staging
    if: github.ref == 'refs/heads/staging'
    uses: appleboy/ssh-action@v1.0.3
    with:
      host: ${{ secrets.STAGING_EC2_HOST }}
      # ... rest of configuration ...
```

## Step 6: Advanced CI/CD Features

### 6.1 Add Notifications

Add Slack/Discord notifications to your workflow:

```yaml
- name: Notify Slack on Success
  if: success()
  uses: 8398a7/action-slack@v3
  with:
    status: success
    webhook_url: ${{ secrets.SLACK_WEBHOOK_URL }}

- name: Notify Slack on Failure
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: failure
    webhook_url: ${{ secrets.SLACK_WEBHOOK_URL }}
```

### 6.2 Add Security Scanning

```yaml
- name: Run security audit
  run: npm audit --audit-level moderate

- name: Run SAST scan
  uses: github/codeql-action/init@v2
  with:
    languages: javascript
```

### 6.3 Add Performance Testing

```yaml
- name: Run performance tests
  run: |
    npm install -g artillery
    artillery quick --count 10 --num 10 http://localhost:3000/health
```

## Step 7: Monitoring and Rollback

### 7.1 Health Checks

Add health check endpoint to your NestJS app:

```typescript
// src/app.controller.ts
@Get('health')
getHealth() {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  };
}
```

### 7.2 Rollback Strategy

Create a rollback workflow:

```yaml
# .github/workflows/rollback.yml
name: Rollback Deployment

on:
  workflow_dispatch:
    inputs:
      commit_sha:
        description: 'Commit SHA to rollback to'
        required: true

jobs:
  rollback:
    runs-on: ubuntu-latest
    steps:
    - name: Rollback to specific commit
      uses: appleboy/ssh-action@v1.0.3
      with:
        host: ${{ secrets.EC2_HOST }}
        username: ${{ secrets.EC2_USERNAME }}
        key: ${{ secrets.EC2_SSH_KEY }}
        script: |
          cd /var/www/competition-backend
          git checkout ${{ github.event.inputs.commit_sha }}
          npm ci --only=production
          npx prisma generate
          npx prisma migrate deploy
          npm run build
          pm2 restart competition-backend
```

## Step 8: Best Practices

### 8.1 Branch Protection
1. Go to repository Settings → Branches
2. Add rule for `main` branch
3. Require pull request reviews
4. Require status checks to pass
5. Require branches to be up to date

### 8.2 Secrets Management
- Never commit secrets to repository
- Use GitHub Secrets for sensitive data
- Rotate secrets regularly
- Use different secrets for different environments

### 8.3 Testing Strategy
- Unit tests for all business logic
- Integration tests for API endpoints
- E2E tests for critical user flows
- Performance tests for high-traffic endpoints

### 8.4 Deployment Strategy
- Use blue-green deployment for zero downtime
- Implement feature flags for gradual rollouts
- Monitor application metrics during deployment
- Have rollback plan ready

## Troubleshooting

### Common Issues:

1. **SSH Connection Failed:**
   - Check EC2 security group allows port 22
   - Verify SSH key is correct
   - Test SSH connection manually

2. **Build Failures:**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript compilation errors

3. **Database Migration Failures:**
   - Ensure database is accessible
   - Check DATABASE_URL format
   - Verify database user permissions

4. **Application Not Starting:**
   - Check PM2 logs: `pm2 logs`
   - Verify environment variables
   - Check port availability

### Debug Commands:
```bash
# Check PM2 status
pm2 status
pm2 logs competition-backend

# Check application logs
tail -f /var/log/nginx/error.log

# Check system resources
htop
df -h
free -h
``` 