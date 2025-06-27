# Zero-Downtime Deployment with PM2

## The Problem with `pm2 restart`

Your current approach:
```bash
pm2 restart competition-backend || pm2 start npm --name "competition-backend" -- run start:prod
```

**Issues:**
1. **Downtime**: `pm2 restart` stops the process completely, then starts it again
2. **Request interruption**: Any in-flight requests are dropped
3. **Health check failures**: Load balancers may mark the instance as unhealthy
4. **User experience**: Brief 502/503 errors during deployment

## The Solution: Zero-Downtime Deployment

### Production-Grade Command

```bash
if pm2 list | grep -q "nestjs-app"; then
    echo "📈 Reloading existing process for zero-downtime update..."
    pm2 reload nestjs-app --update-env
else
    echo "🚀 Starting new process..."
    pm2 start npm --name "nestjs-app" -- run start:prod
fi
```

## How It Works

### 1. **Process Detection**
```bash
pm2 list | grep -q "nestjs-app"
```
- `pm2 list` shows all running processes
- `grep -q "nestjs-app"` searches for your process name
- `-q` flag makes grep quiet (no output, just exit code)
- Returns `0` (success) if process exists, `1` (failure) if not

### 2. **Zero-Downtime Reload** (Subsequent Deployments)
```bash
pm2 reload nestjs-app --update-env
```

**What happens:**
1. **Graceful shutdown**: PM2 sends SIGINT to the old process
2. **Wait for completion**: Allows current requests to finish
3. **Start new process**: Launches new instance with updated code
4. **Health check**: Ensures new process is healthy
5. **Traffic switch**: Routes new requests to new process
6. **Cleanup**: Terminates old process

**Benefits:**
- ✅ **Zero downtime**: Old process handles requests while new one starts
- ✅ **Graceful shutdown**: In-flight requests complete
- ✅ **Health verification**: New process must be healthy before switch
- ✅ **Automatic rollback**: If new process fails, old one continues

### 3. **Initial Start** (First Deployment)
```bash
pm2 start npm --name "nestjs-app" -- run start:prod
```

**What happens:**
1. **Process creation**: Starts the application for the first time
2. **Name assignment**: Assigns the name "nestjs-app" for future reference
3. **Monitoring**: PM2 begins monitoring the process

## Why This is Modern Best Practice

### 1. **Blue-Green Deployment Pattern**
- **Blue**: Current running process (old version)
- **Green**: New process (new version)
- **Switch**: Traffic moves from blue to green seamlessly

### 2. **Health Checks**
PM2 automatically verifies the new process is healthy before switching:
- Process starts successfully
- Application responds to health checks
- No critical errors in startup logs

### 3. **Automatic Rollback**
If the new process fails to start or becomes unhealthy:
- Old process continues running
- No service interruption
- Deployment fails gracefully

### 4. **Environment Updates**
The `--update-env` flag ensures:
- New environment variables are loaded
- Configuration changes take effect
- No stale environment data

## Advanced Zero-Downtime Strategies

### 1. **Cluster Mode** (Multiple Instances)
```bash
# Start multiple instances for even better availability
pm2 start npm --name "nestjs-app" -i max -- run start:prod

# Reload with cluster mode
pm2 reload nestjs-app --update-env
```

### 2. **Health Check Endpoint**
Add to your NestJS app:
```typescript
@Get('health')
getHealth() {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version
  };
}
```

### 3. **Load Balancer Integration**
With multiple instances:
- Load balancer distributes traffic
- Rolling updates possible
- Even better availability

## Monitoring and Debugging

### Check Process Status
```bash
# List all processes
pm2 list

# Monitor in real-time
pm2 monit

# View logs
pm2 logs nestjs-app
```

### Deployment Verification
```bash
# Check if new process is running
pm2 list | grep nestjs-app

# Test health endpoint
curl http://localhost:3000/health

# Monitor for errors
pm2 logs nestjs-app --lines 50
```

## Comparison: Restart vs Reload

| Aspect | `pm2 restart` | `pm2 reload` |
|--------|---------------|--------------|
| **Downtime** | ❌ Yes (5-10 seconds) | ✅ No |
| **Request Handling** | ❌ Drops in-flight requests | ✅ Completes current requests |
| **Health Checks** | ❌ May fail during restart | ✅ Verifies before switch |
| **Rollback** | ❌ Manual intervention | ✅ Automatic if new process fails |
| **User Experience** | ❌ Brief errors | ✅ Seamless |
| **Load Balancer** | ❌ May mark unhealthy | ✅ Stays healthy |

## Implementation in Your CI/CD

### GitHub Actions Workflow
```yaml
- name: Deploy to EC2
  uses: appleboy/ssh-action@v1.0.3
  with:
    script: |
      cd /var/www/competition-backend
      git pull origin main
      npm ci --only=production
      npx prisma generate
      npx prisma migrate deploy
      npm run build
      # Zero-downtime deployment
      if pm2 list | grep -q "nestjs-app"; then
        echo "📈 Reloading existing process for zero-downtime update..."
        pm2 reload nestjs-app --update-env
      else
        echo "🚀 Starting new process..."
        pm2 start npm --name "nestjs-app" -- run start:prod
      fi
```

### Local Deployment Script
```bash
#!/bin/bash
set -e

echo "🚀 Starting deployment..."

# ... build steps ...

# Zero-downtime deployment
echo "🔄 Deploying with zero-downtime..."
if pm2 list | grep -q "nestjs-app"; then
    echo "📈 Reloading existing process for zero-downtime update..."
    pm2 reload nestjs-app --update-env
else
    echo "🚀 Starting new process..."
    pm2 start npm --name "nestjs-app" -- run start:prod
fi

echo "✅ Deployment completed successfully!"
```

## Best Practices

1. **Always use `reload` for updates**
2. **Monitor deployment logs**
3. **Set up health check endpoints**
4. **Use cluster mode for production**
5. **Test rollback scenarios**
6. **Monitor application metrics**

## Troubleshooting

### Common Issues

1. **Process not found after reload**
   ```bash
   # Check if process exists
   pm2 list
   
   # Check logs for startup errors
   pm2 logs nestjs-app
   ```

2. **Environment variables not updated**
   ```bash
   # Force environment update
   pm2 reload nestjs-app --update-env --force
   ```

3. **Port conflicts**
   ```bash
   # Check what's using the port
   sudo netstat -tlnp | grep :3000
   
   # Kill conflicting process
   pm2 delete nestjs-app
   pm2 start npm --name "nestjs-app" -- run start:prod
   ```

This approach ensures your NestJS application maintains 100% uptime during deployments, providing a professional-grade deployment experience for your users. 