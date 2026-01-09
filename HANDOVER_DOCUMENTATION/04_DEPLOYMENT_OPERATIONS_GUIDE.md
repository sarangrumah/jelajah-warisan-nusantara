# JELAJAH WARISAN NUSANTARA - DEPLOYMENT AND OPERATIONS GUIDE

**Document Version:** 1.0  
**Last Updated:** January 2026  
**Environment:** Production Deployment Guide  
**Target Audience:** DevOps Team, System Administrators  

## TABLE OF CONTENTS

1. [ENVIRONMENT REQUIREMENTS](#environment-requirements)
2. [PRE-DEPLOYMENT CHECKLIST](#pre-deployment-checklist)
3. [DEPLOYMENT PROCEDURES](#deployment-procedures)
4. [CONFIGURATION MANAGEMENT](#configuration-management)
5. [MONITORING AND MAINTENANCE](#monitoring-and-maintenance)
6. [BACKUP AND RECOVERY](#backup-and-recovery)
7. [SECURITY CONFIGURATION](#security-configuration)
8. [TROUBLESHOOTING GUIDE](#troubleshooting-guide)
9. [PERFORMANCE OPTIMIZATION](#performance-optimization)
10. [SCALING STRATEGIES](#scaling-strategies)

## ENVIRONMENT REQUIREMENTS

### System Requirements

#### Frontend Requirements
- **Node.js:** Version 18.0.0 or higher
- **npm/pnpm:** Latest version (pnpm 9.4.0+ recommended)
- **Memory:** Minimum 2GB RAM
- **Storage:** Minimum 1GB for application files
- **Network:** HTTPS support required

#### Backend Requirements
- **Node.js:** Version 18.0.0 or higher
- **Express.js:** Latest stable version
- **Memory:** Minimum 4GB RAM
- **Storage:** Minimum 10GB for application and logs
- **Network:** Port 3000 (configurable) accessible

#### Database Requirements
- **PostgreSQL:** Version 14.0 or higher
- **Memory:** Minimum 8GB RAM recommended
- **Storage:** Minimum 50GB with growth capacity
- **Extensions:** PostGIS for geographic data
- **Backup:** Automated backup system required

#### Server Requirements
- **Operating System:** Linux (Ubuntu 20.04+ or CentOS 8+)
- **Web Server:** Nginx for reverse proxy
- **Process Manager:** PM2 for Node.js applications
- **SSL/TLS:** Certificate for HTTPS
- **Firewall:** Configured for security

### Software Dependencies

#### Frontend Dependencies
```bash
# Install Node.js and pnpm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
npm install -g pnpm

# Install frontend dependencies
cd /path/to/frontend
pnpm install
```

#### Backend Dependencies
```bash
# Install backend dependencies
cd /path/to/backend
npm install

# Install PM2 globally
npm install -g pm2
```

#### Database Dependencies
```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Install PostGIS
sudo apt install postgis postgresql-14-postgis-3
```

## PRE-DEPLOYMENT CHECKLIST

### Code Quality Checks
- [ ] All unit tests passing
- [ ] All integration tests passing
- [ ] Code review completed
- [ ] Security scan completed
- [ ] Performance testing completed

### Configuration Verification
- [ ] Environment variables configured
- [ ] Database connection tested
- [ ] File upload paths configured
- [ ] SSL certificates installed
- [ ] Nginx configuration tested

### Infrastructure Readiness
- [ ] Server instances provisioned
- [ ] Load balancer configured
- [ ] Database cluster ready
- [ ] Monitoring tools installed
- [ ] Backup systems configured

### Security Verification
- [ ] Firewall rules configured
- [ ] SSL/TLS certificates valid
- [ ] Database access restricted
- [ ] Application secrets secured
- [ ] Security headers configured

## DEPLOYMENT PROCEDURES

### 1. Database Setup

#### Initial Database Creation
```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Create database
CREATE DATABASE museumcagarbudaya;

# Create user
CREATE USER museum_user WITH PASSWORD 'secure_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE museumcagarbudaya TO museum_user;

# Enable extensions
\c museumcagarbudaya
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
```

#### Run Database Migrations
```bash
# Navigate to backend directory
cd /path/to/backend

# Set environment variables
export DATABASE_URL="postgresql://museum_user:secure_password@localhost:5432/museumcagarbudaya"

# Run migrations
npm run migrate
npm run migrate:translations
```

### 2. Backend Deployment

#### Build and Deploy Backend
```bash
# Navigate to backend directory
cd /path/to/backend

# Install dependencies
npm install

# Build application
npm run build

# Configure environment
cp .env.example .env
# Edit .env with production values

# Start with PM2
pm2 start dist/server.js --name "museum-backend"

# Save PM2 configuration
pm2 save
```

#### PM2 Configuration
```json
{
  "apps": [{
    "name": "museum-backend",
    "script": "dist/server.js",
    "instances": "max",
    "exec_mode": "cluster",
    "env": {
      "NODE_ENV": "production"
    },
    "env_production": {
      "NODE_ENV": "production",
      "PORT": 3000
    }
  }]
}
```

### 3. Frontend Deployment

#### Build and Deploy Frontend
```bash
# Navigate to frontend directory
cd /path/to/frontend

# Install dependencies
pnpm install

# Build for production
pnpm run build

# Copy to web server directory
sudo cp -r dist/* /var/www/museumcagarbudaya/
```

#### Nginx Configuration
```nginx
server {
    listen 80;
    server_name museumcagarbudaya.kemenbud.go.id;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name museumcagarbudaya.kemenbud.go.id;

    ssl_certificate /path/to/ssl/certificate.crt;
    ssl_certificate_key /path/to/ssl/private.key;

    root /var/www/museumcagarbudaya;
    index index.html;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";

    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # File uploads
    location /uploads/ {
        alias /path/to/uploads/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 4. Environment Configuration

#### Production Environment Variables
```bash
# Backend .env file
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://museum_user:secure_password@localhost:5432/museumcagarbudaya
JWT_SECRET=your_very_secure_jwt_secret_key_here
UPLOAD_PATH=/var/www/museumcagarbudaya/uploads
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=noreply@museumcagarbudaya.go.id
EMAIL_PASS=your_app_specific_password
GOOGLE_TRANSLATE_API_KEY=your_google_translate_api_key
```

#### Frontend Environment Variables
```bash
# Frontend .env.production file
VITE_API_BASE_URL=https://museumcagarbudaya.kemenbud.go.id/api
VITE_UPLOAD_URL=https://museumcagarbudaya.kemenbud.go.id/uploads
VITE_GOOGLE_TRANSLATE_API_KEY=your_google_translate_api_key
VITE_DEFAULT_LANGUAGE=id
VITE_SUPPORTED_LANGUAGES=id,en
```

## CONFIGURATION MANAGEMENT

### Environment-Specific Configurations

#### Development Environment
```bash
# Development database
DATABASE_URL=postgresql://dev_user:dev_pass@localhost:5432/museum_dev

# Development API
VITE_API_BASE_URL=http://localhost:3000/api

# Debug mode enabled
DEBUG=true
```

#### Staging Environment
```bash
# Staging database
DATABASE_URL=postgresql://staging_user:staging_pass@staging-db:5432/museum_staging

# Staging API
VITE_API_BASE_URL=https://staging.museumcagarbudaya.go.id/api

# Limited logging
LOG_LEVEL=info
```

#### Production Environment
```bash
# Production database
DATABASE_URL=postgresql://prod_user:prod_pass@prod-db:5432/museum_prod

# Production API
VITE_API_BASE_URL=https://museumcagarbudaya.kemenbud.go.id/api

# Security-focused
LOG_LEVEL=error
SECURE_COOKIES=true
```

### Configuration Files Management

#### Database Configuration
```typescript
// backend/config/database.ts
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
});

export default pool;
```

#### Application Configuration
```typescript
// backend/config/app.ts
export const config = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret',
  uploadPath: process.env.UPLOAD_PATH || './uploads',
  email: {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  translation: {
    googleApiKey: process.env.GOOGLE_TRANSLATE_API_KEY,
    defaultLanguage: 'id',
    supportedLanguages: ['id', 'en', 'ar', 'fr', 'de', 'ja', 'zh'],
  },
};
```

## MONITORING AND MAINTENANCE

### Application Monitoring

#### PM2 Monitoring
```bash
# View application status
pm2 status

# View logs
pm2 logs museum-backend

# Monitor resource usage
pm2 monit

# View detailed information
pm2 show museum-backend
```

#### Nginx Monitoring
```bash
# Check Nginx status
sudo systemctl status nginx

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Test Nginx configuration
sudo nginx -t
```

#### Database Monitoring
```bash
# Monitor PostgreSQL connections
sudo -u postgres psql -c "SELECT * FROM pg_stat_activity;"

# Check database size
sudo -u postgres psql -c "SELECT pg_size_pretty(pg_database_size('museumcagarbudaya'));"

# Monitor slow queries
sudo -u postgres psql -c "SHOW log_min_duration_statement;"
```

### Health Checks

#### Application Health Endpoint
```bash
# Check application health
curl https://museumcagarbudaya.kemenbud.go.id/health

# Expected response
{
  "status": "OK",
  "timestamp": "2026-01-03T17:00:00.000Z",
  "version": "1.0.0",
  "database": "connected",
  "memory": "healthy"
}
```

#### Automated Health Monitoring
```bash
# Create health check script
#!/bin/bash
response=$(curl -s -o /dev/null -w "%{http_code}" https://museumcagarbudaya.kemenbud.go.id/health)

if [ $response -eq 200 ]; then
    echo "Application is healthy"
else
    echo "Application is unhealthy - HTTP $response"
    # Send alert notification
    curl -X POST "https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK" \
         -H 'Content-type: application/json' \
         --data "{\"text\":\"Application health check failed with HTTP $response\"}"
fi
```

### Log Management

#### Log Rotation Configuration
```bash
# Create logrotate configuration
sudo nano /etc/logrotate.d/museum-app

# Add configuration
/var/log/museum-app/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        pm2 reload museum-backend
    endscript
}
```

#### Log Analysis
```bash
# View recent errors
grep "ERROR" /var/log/museum-app/app.log | tail -20

# Monitor API response times
grep "API" /var/log/nginx/access.log | awk '{print $NF}' | sort -n | tail -10

# Check for security issues
grep "401\|403" /var/log/nginx/access.log | tail -10
```

## BACKUP AND RECOVERY

### Database Backup Strategy

#### Automated Database Backup
```bash
#!/bin/bash
# Database backup script
BACKUP_DIR="/backup/database"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="museumcagarbudaya"
BACKUP_FILE="$BACKUP_DIR/$DB_NAME-$DATE.sql.gz"

# Create backup
pg_dump -h localhost -U museum_user $DB_NAME | gzip > $BACKUP_FILE

# Keep only last 30 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

# Upload to cloud storage (optional)
aws s3 cp $BACKUP_FILE s3://museum-backups/database/
```

#### Backup Schedule
```bash
# Add to crontab for daily backups
0 2 * * * /path/to/backup-script.sh

# Weekly full backup
0 3 * * 0 /path/to/weekly-backup-script.sh

# Monthly archive
0 4 1 * * /path/to/monthly-archive-script.sh
```

### Application Backup

#### Code and Configuration Backup
```bash
#!/bin/bash
# Application backup script
BACKUP_DIR="/backup/application"
DATE=$(date +%Y%m%d_%H%M%S)
APP_DIR="/var/www/museumcagarbudaya"
CONFIG_DIR="/etc/museum-app"

# Backup application files
tar -czf "$BACKUP_DIR/app-$DATE.tar.gz" $APP_DIR

# Backup configuration
tar -czf "$BACKUP_DIR/config-$DATE.tar.gz" $CONFIG_DIR

# Backup PM2 configuration
pm2 dump
cp ~/.pm2/dump.pm2 "$BACKUP_DIR/pm2-$DATE.dump"
```

### Recovery Procedures

#### Database Recovery
```bash
# Restore from backup
gunzip -c backup_file.sql.gz | psql -h localhost -U museum_user museumcagarbudaya

# Point-in-time recovery
pg_ctl -D /var/lib/postgresql/data start
psql -c "SELECT pg_start_backup('recovery_backup');"
# Copy base backup files
psql -c "SELECT pg_stop_backup();"
# Restore WAL files for point-in-time recovery
```

#### Application Recovery
```bash
# Restore application files
tar -xzf app-backup.tar.gz -C /var/www/

# Restore configuration
tar -xzf config-backup.tar.gz -C /etc/

# Restore PM2 configuration
pm2 resurrect dump.pm2

# Verify application
pm2 status
```

## SECURITY CONFIGURATION

### SSL/TLS Configuration

#### SSL Certificate Setup
```bash
# Install Certbot for Let's Encrypt
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d museumcagarbudaya.kemenbud.go.id

# Auto-renewal setup
echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -
```

#### Security Headers Configuration
```nginx
# Add to Nginx configuration
add_header X-Frame-Options DENY always;
add_header X-Content-Type-Options nosniff always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:; connect-src 'self' https:;" always;
```

### Firewall Configuration

#### UFW Firewall Setup
```bash
# Enable UFW
sudo ufw enable

# Allow SSH
sudo ufw allow ssh

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow application port (if direct access needed)
sudo ufw allow 3000/tcp

# Deny all other incoming connections
sudo ufw default deny incoming
sudo ufw default allow outgoing
```

### Application Security

#### Environment Variable Security
```bash
# Set proper permissions on environment files
chmod 600 .env
chmod 600 .env.production

# Use secrets management for sensitive data
# Consider using HashiCorp Vault or AWS Secrets Manager
```

#### Database Security
```sql
-- Restrict database access
REVOKE ALL ON DATABASE museumcagarbudaya FROM PUBLIC;
GRANT CONNECT ON DATABASE museumcagarbudaya TO museum_user;

-- Create read-only user for monitoring
CREATE USER monitor_user WITH PASSWORD 'monitor_password';
GRANT SELECT ON ALL TABLES IN SCHEMA public TO monitor_user;
```

## TROUBLESHOOTING GUIDE

### Common Issues and Solutions

#### Application Won't Start
```bash
# Check PM2 status
pm2 status

# Check application logs
pm2 logs museum-backend

# Check Node.js version
node --version

# Check dependencies
npm list

# Check environment variables
pm2 show museum-backend
```

#### Database Connection Issues
```bash
# Test database connection
psql -h localhost -U museum_user -d museumcagarbudaya

# Check PostgreSQL status
sudo systemctl status postgresql

# Check connection limits
sudo -u postgres psql -c "SHOW max_connections;"

# Check for connection leaks
sudo -u postgres psql -c "SELECT count(*) FROM pg_stat_activity;"
```

#### Nginx Configuration Issues
```bash
# Test Nginx configuration
sudo nginx -t

# Check Nginx status
sudo systemctl status nginx

# View Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Check port binding
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :443
```

#### SSL Certificate Issues
```bash
# Check certificate validity
openssl x509 -in /path/to/certificate.crt -text -noout

# Test SSL configuration
openssl s_client -connect museumcagarbudaya.kemenbud.go.id:443

# Renew certificate if needed
sudo certbot renew --dry-run
```

### Performance Issues

#### High Memory Usage
```bash
# Check memory usage
pm2 monit

# Check for memory leaks
pm2 show museum-backend

# Restart application
pm2 restart museum-backend

# Adjust PM2 configuration
pm2 delete museum-backend
pm2 start ecosystem.config.js
```

#### Slow Database Queries
```sql
-- Enable slow query logging
ALTER SYSTEM SET log_min_duration_statement = 1000;
SELECT pg_reload_conf();

-- Check slow queries
SELECT query, mean_time, calls FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;

-- Analyze table statistics
ANALYZE;

-- Check for missing indexes
SELECT schemaname, tablename, n_tup_ins, n_tup_upd, n_tup_del 
FROM pg_stat_user_tables 
ORDER BY n_tup_ins + n_tup_upd + n_tup_del DESC;
```

## PERFORMANCE OPTIMIZATION

### Application Optimization

#### PM2 Configuration for Performance
```json
{
  "apps": [{
    "name": "museum-backend",
    "script": "dist/server.js",
    "instances": "max",
    "exec_mode": "cluster",
    "max_memory_restart": "1G",
    "node_args": "--max-old-space-size=4096",
    "env": {
      "NODE_ENV": "production",
      "DEBUG": false
    }
  }]
}
```

#### Database Optimization
```sql
-- Create indexes for frequently queried fields
CREATE INDEX CONCURRENTLY idx_museums_name ON museums(name);
CREATE INDEX CONCURRENTLY idx_collections_museum_id ON collections(museum_id);
CREATE INDEX CONCURRENTLY idx_activity_logs_created_at ON activity_logs(created_at);

-- Update table statistics
ANALYZE;

-- Vacuum tables regularly
VACUUM ANALYZE;
```

### Caching Strategy

#### Redis Caching Setup
```bash
# Install Redis
sudo apt install redis-server

# Configure Redis
sudo nano /etc/redis/redis.conf
# Set maxmemory-policy allkeys-lru
# Set maxmemory 256mb
```

#### Application Caching
```typescript
// Add Redis caching to application
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  maxRetriesPerRequest: 3,
});

// Cache frequently accessed data
app.get('/api/museums', async (req, res) => {
  const cacheKey = 'museums:approved';
  const cached = await redis.get(cacheKey);
  
  if (cached) {
    return res.json(JSON.parse(cached));
  }
  
  const museums = await getApprovedMuseums();
  await redis.setex(cacheKey, 300, JSON.stringify(museums)); // 5 minutes cache
  res.json(museums);
});
```

### CDN Configuration

#### Static Asset Optimization
```nginx
# Configure CDN for static assets
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    add_header Access-Control-Allow-Origin "*";
    
    # Compress assets
    gzip_static on;
    gzip_vary on;
    gzip_min_length 1000;
}
```

## SCALING STRATEGIES

### Horizontal Scaling

#### Load Balancer Configuration
```nginx
# Upstream configuration for load balancing
upstream museum_backend {
    least_conn;
    server backend1:3000 max_fails=3 fail_timeout=30s;
    server backend2:3000 max_fails=3 fail_timeout=30s;
    server backend3:3000 max_fails=3 fail_timeout=30s;
}

server {
    location /api/ {
        proxy_pass http://museum_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### Database Scaling
```sql
-- Configure connection pooling
ALTER SYSTEM SET max_connections = 200;
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET default_statistics_target = 100;
```

### Vertical Scaling

#### Server Resource Optimization
```bash
# Monitor resource usage
htop
iotop
nethogs

# Optimize Node.js memory usage
export NODE_OPTIONS="--max-old-space-size=4096"

# Optimize database memory usage
# Edit /etc/postgresql/14/main/postgresql.conf
shared_buffers = 256MB
effective_cache_size = 1GB
work_mem = 4MB
maintenance_work_mem = 64MB
```

---

**Document Prepared By:** DevOps Team  
**Next Review Date:** April 2026  
**Distribution:** DevOps Team, System Administrators, Technical Support