# EC2 Deployment Guide for NestJS Backend

## Prerequisites
- AWS Account
- EC2 instance (t3.medium or larger recommended)
- AWS RDS PostgreSQL database (already set up)
- Domain name (optional but recommended)
- SSL certificate (for HTTPS)

## Step 1: Launch EC2 Instance

1. **Launch Instance:**
   - AMI: Amazon Linux 2
   - Instance Type: t3.medium (2 vCPU, 4 GB RAM)
   - Storage: 20 GB GP3
   - Security Group: Allow ports 22 (SSH), 80 (HTTP), 443 (HTTPS)

2. **Configure Security Group:**
   ```
   SSH (22): 0.0.0.0/0 (or your IP)
   HTTP (80): 0.0.0.0/0
   HTTPS (443): 0.0.0.0/0
   ```

## Step 2: Connect to EC2 Instance

```bash
ssh -i your-key.pem ec2-user@your-ec2-public-ip
```

## Step 3: Run Setup Script

```bash
# Make script executable
chmod +x ec2-setup.sh

# Run setup script
./ec2-setup.sh
```

## Step 4: Clone Repository

```bash
cd /var/www/competition-backend
git clone https://github.com/your-username/your-repo.git .
```

## Step 5: Environment Configuration

Create `.env` file:

```bash
# AWS RDS Database (Update with your actual values)
DATABASE_URL="postgresql://postgres:your_rds_password@wayfinder-db.cb2ea4uwk12h.ap-south-1.rds.amazonaws.com:5432/your_database_name"

# JWT
JWT_SECRET=your_super_secret_jwt_key

# Google OAuth (Update with your production URLs)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://your-domain.com/auth/google/callback
# OR if using EC2 public DNS:
# GOOGLE_CALLBACK_URL=http://ec2-your-ip.ap-south-1.compute.amazonaws.com/auth/google/callback

# Frontend URL
FRONTEND_URL=https://your-frontend-domain.com

# Node Environment
NODE_ENV=production
PORT=3000
```

**Important Notes:**
- Replace `your_rds_password` with your actual RDS master password
- Replace `your_database_name` with your actual database name
- Update `GOOGLE_CALLBACK_URL` to your production domain
- Update Google Cloud Console OAuth credentials with the same callback URL

## Step 6: Database Setup

Since you're using AWS RDS, the database is already set up. Just run migrations:

```bash
# Run migrations against your RDS database
npx prisma migrate deploy
```

## Step 7: Import Competition Data

Import your competition data from the CSV file:

```bash
# Make sure download.csv is in your project directory
# Run the import script
node import_competitions.js
```

This will populate the `competition` table with data from `download.csv`.

## Step 8: Configure Nginx

```bash
# Copy nginx configuration
sudo cp nginx.conf /etc/nginx/conf.d/competition-backend.conf

# Update the server_name in nginx.conf to your domain
sudo nano /etc/nginx/conf.d/competition-backend.conf

# Test configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

## Step 9: Deploy Application

```bash
# Make deploy script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

## Step 10: SSL Certificate (Optional but Recommended)

```bash
# Install Certbot
sudo yum install -y certbot python3-certbot-nginx

# Get SSL certificate (replace with your domain)
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Step 11: Monitor Application

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs competition-backend

# Monitor resources
pm2 monit
```

## Step 12: Update Google OAuth Settings

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to APIs & Services > Credentials
3. Edit your OAuth 2.0 Client ID
4. Add your production callback URL to "Authorized redirect URIs":
   ```
   https://your-domain.com/auth/google/callback
   ```
5. Save the changes

## Troubleshooting

### Common Issues:

1. **Database Connection Issues:**
   ```bash
   # Test database connection
   npx prisma db pull
   
   # Check if RDS security group allows EC2 access
   # Ensure DATABASE_URL is correct
   ```

2. **Google OAuth Issues:**
   - Verify callback URL matches exactly in Google Console
   - Check if using HTTPS in production
   - Ensure domain is added to authorized domains

3. **Port 3000 not accessible:**
   ```bash
   sudo netstat -tlnp | grep :3000
   ```

4. **Nginx not working:**
   ```bash
   sudo nginx -t
   sudo systemctl status nginx
   ```

### Logs Location:
- Application logs: `pm2 logs`
- Nginx logs: `/var/log/nginx/`
- System logs: `journalctl -u nginx`

## Security Best Practices

1. **Update regularly:**
   ```bash
   sudo yum update -y
   ```

2. **Configure firewall properly:**
   ```bash
   sudo firewall-cmd --list-all
   ```

3. **Use strong passwords for RDS**
4. **Enable automatic security updates**
5. **Regular backups of database**
6. **Use HTTPS in production**

## Performance Optimization

1. **Enable PM2 clustering:**
   ```bash
   pm2 start npm --name "competition-backend" -i max -- run start:prod
   ```

2. **Configure Nginx caching**
3. **Use CDN for static assets**
4. **Monitor resource usage**

## Database Management

### Backup Database:
```bash
# Create backup
pg_dump "postgresql://postgres:password@wayfinder-db.cb2ea4uwk12h.ap-south-1.rds.amazonaws.com:5432/database_name" > backup.sql

# Restore if needed
psql "postgresql://postgres:password@wayfinder-db.cb2ea4uwk12h.ap-south-1.rds.amazonaws.com:5432/database_name" < backup.sql
```

### Monitor Database:
- Use AWS RDS Console for monitoring
- Set up CloudWatch alarms
- Monitor connection count and performance 