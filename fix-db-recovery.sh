#!/bin/bash

echo "--- Checking Disk Space ---"
df -h | grep -E '^/dev/'

echo -e "\n--- Restarting PostgreSQL Service ---"
# Try standard service names, might vary by distro
if systemctl list-units --full -all | grep -Fq "postgresql.service"; then
    sudo systemctl restart postgresql
    echo "PostgreSQL restarted."
else
    echo "PostgreSQL service not found via systemctl. Trying /etc/init.d..."
    sudo /etc/init.d/postgresql restart
fi

echo -e "\n--- Checking PostgreSQL Status ---"
sudo systemctl status postgresql --no-pager

echo -e "\n--- Recent PostgreSQL Logs ---"
# Try to find the log file
LOG_FILE=$(find /var/log/postgresql -name "postgresql-*-main.log" | head -n 1)
if [ -n "$LOG_FILE" ]; then
    sudo tail -n 20 "$LOG_FILE"
else
    echo "Could not locate PostgreSQL log file in /var/log/postgresql"
fi
