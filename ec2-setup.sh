#!/bin/bash

# Exit on any error
set -e

echo "🚀 Setting up EC2 instance for NestJS deployment..."

# Update system packages
echo "📦 Updating system packages..."
sudo yum update -y

# Install Node.js 18
echo "📥 Installing Node.js 18..."
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Install PostgreSQL
echo "🗄️ Installing PostgreSQL..."
sudo yum install -y postgresql postgresql-server postgresql-contrib

# Initialize PostgreSQL database
echo "🔧 Initializing PostgreSQL database..."
sudo postgresql-setup initdb
sudo systemctl enable postgresql
sudo systemctl start postgresql

# Install PM2 for process management
echo "⚡ Installing PM2..."
sudo npm install -g pm2

# Install Docker (optional, for containerized deployment)
echo "🐳 Installing Docker..."
sudo yum install -y docker
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -a -G docker ec2-user

# Install Docker Compose
echo "📦 Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Nginx
echo "🌐 Installing Nginx..."
sudo yum install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx

# Configure firewall
echo "🔥 Configuring firewall..."
sudo yum install -y firewalld
sudo systemctl enable firewalld
sudo systemctl start firewalld
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --reload

# Create application directory
echo "📁 Creating application directory..."
sudo mkdir -p /var/www/competition-backend
sudo chown ec2-user:ec2-user /var/www/competition-backend

echo "✅ EC2 setup completed successfully!"
echo "📝 Next steps:"
echo "1. Clone your repository to /var/www/competition-backend"
echo "2. Set up environment variables"
echo "3. Run the deploy.sh script" 