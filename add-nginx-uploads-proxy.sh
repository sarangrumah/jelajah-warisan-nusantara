#!/bin/bash

# This script will backup your nginx config and add a /uploads proxy block for your backend.
# Usage: sudo bash add-nginx-uploads-proxy.sh

NGINX_CONF="/etc/nginx/sites-available/default"
BACKUP_PATH="/etc/nginx/sites-available/default.bak.$(date +%Y%m%d_%H%M%S)"

echo "Backing up $NGINX_CONF to $BACKUP_PATH"
cp "$NGINX_CONF" "$BACKUP_PATH"

echo "Checking if /uploads location block already exists..."
if grep -q "location /uploads/" "$NGINX_CONF"; then
  echo "A location /uploads/ block already exists. Please review and update it manually if needed."
  exit 1
fi

echo "Adding /uploads proxy block to $NGINX_CONF..."

awk '
/^\s*server\s*{/ && !in_server { in_server=1 }
in_server && /^\s*location \/ {/ && !found_uploads {
  print "        location /uploads/ {"
  print "            proxy_pass http://localhost:3000/uploads/;"
  print "            proxy_set_header Host $host;"
  print "            proxy_set_header X-Real-IP $remote_addr;"
  print "            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;"
  print "            proxy_set_header X-Forwarded-Proto $scheme;"
  print "        }"
  found_uploads=1
}
{ print }
' "$BACKUP_PATH" > "$NGINX_CONF"

echo "Testing nginx configuration..."
nginx -t
if [ $? -ne 0 ]; then
  echo "Nginx config test failed! Restoring backup."
  cp "$BACKUP_PATH" "$NGINX_CONF"
  exit 1
fi

echo "Reloading nginx..."
systemctl reload nginx

echo "Done. /uploads proxy block added and nginx reloaded."