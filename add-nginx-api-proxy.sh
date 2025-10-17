#!/bin/bash

# This script will backup your nginx config and add an /api proxy block for your backend.
# Usage: sudo bash add-nginx-api-proxy.sh

NGINX_CONF="/etc/nginx/sites-available/default"
BACKUP_PATH="/etc/nginx/sites-available/default.bak.$(date +%Y%m%d_%H%M%S)"

echo "=========================================="
echo "Adding Nginx API Proxy Configuration"
echo "=========================================="
echo ""

echo "Backing up $NGINX_CONF to $BACKUP_PATH"
cp "$NGINX_CONF" "$BACKUP_PATH"

echo "Checking if /api location block already exists..."
if grep -q "location /api" "$NGINX_CONF"; then
  echo "⚠️  A location /api block already exists."
  echo "Please review your nginx configuration manually."
  echo "Backup saved at: $BACKUP_PATH"
  exit 1
fi

echo "Adding /api proxy block to $NGINX_CONF..."

# Add the /api location block before the root location block
awk '
/^\s*server\s*{/ && !in_server { in_server=1 }
in_server && /^\s*location \/ {/ && !found_api {
  print "        # API proxy to backend"
  print "        location /api/ {"
  print "            proxy_pass http://localhost:3000/api/;"
  print "            proxy_http_version 1.1;"
  print "            proxy_set_header Upgrade $http_upgrade;"
  print "            proxy_set_header Connection \"upgrade\";"
  print "            proxy_set_header Host $host;"
  print "            proxy_set_header X-Real-IP $remote_addr;"
  print "            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;"
  print "            proxy_set_header X-Forwarded-Proto $scheme;"
  print "            proxy_cache_bypass $http_upgrade;"
  print "            proxy_read_timeout 300s;"
  print "            proxy_connect_timeout 75s;"
  print "        }"
  print ""
  found_api=1
}
{ print }
' "$BACKUP_PATH" > "$NGINX_CONF"

echo ""
echo "Testing nginx configuration..."
nginx -t
if [ $? -ne 0 ]; then
  echo ""
  echo "❌ Nginx config test failed! Restoring backup."
  cp "$BACKUP_PATH" "$NGINX_CONF"
  exit 1
fi

echo ""
echo "Reloading nginx..."
systemctl reload nginx

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Done! /api proxy block added and nginx reloaded."
  echo ""
  echo "You can now access your API at:"
  echo "  https://your-domain.com/api/translate"
  echo ""
  echo "Test with:"
  echo "  curl -k -X POST https://localhost/api/translate \\"
  echo "    -H \"Content-Type: application/json\" \\"
  echo "    -d '{\"text\":\"Halo dunia\",\"targetLang\":\"en\",\"sourceLang\":\"id\"}'"
else
  echo ""
  echo "❌ Failed to reload nginx. Please check the logs."
  exit 1
fi
