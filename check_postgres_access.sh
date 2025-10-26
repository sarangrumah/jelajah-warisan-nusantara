#!/bin/bash

# --- Configuration ---
PG_PORT="5432"

# --- Colors for output ---
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "\n--- PostgreSQL External Access Check for Linux ---\n"

# --- Step 1: Check Listening Address ---
echo "--- Step 1: Checking PostgreSQL listening address on port $PG_PORT ---"
if ! ss -tln | grep -q ":$PG_PORT"; then
    echo -e "${RED}[ERROR] PostgreSQL does not appear to be listening on port $PG_PORT.${NC}"
    echo "Please ensure the PostgreSQL service is running."
    exit 1
fi

echo -e "${GREEN}[+] PostgreSQL is running and listening on port $PG_PORT.${NC}"

if ss -tln | grep -q "0.0.0.0:$PG_PORT" || ss -tln | grep -q "\[::\]:$PG_PORT"; then
    echo -e "${GREEN}[OK] PostgreSQL is listening on 0.0.0.0 or [::] (all network interfaces).${NC}"
else
    if ss -tln | grep -q "127.0.0.1:$PG_PORT"; then
        echo -e "${YELLOW}[WARNING] PostgreSQL is ONLY listening on localhost (127.0.0.1).${NC}"
        echo "To allow external connections, you must edit 'postgresql.conf'."
        echo "Find the file (e.g., /etc/postgresql/<version>/main/postgresql.conf) and"
        echo "change 'listen_addresses = 'localhost'' to 'listen_addresses = '*'."
        echo "Then restart the PostgreSQL service: sudo systemctl restart postgresql"
    else
        echo -e "${YELLOW}[INFO] PostgreSQL is listening on a specific IP. Check ss output below:${NC}"
        ss -tln | grep ":$PG_PORT"
    fi
fi
echo -e "\nNote: You must also edit 'pg_hba.conf' to allow connections from your specific IP range."
echo -e "Example for allowing all IPs (use with caution): host    all             all             0.0.0.0/0            md5\n"


# --- Step 2: Check Firewall ---
echo "--- Step 2: Checking firewall status for port $PG_PORT ---"
if command -v ufw &> /dev/null && ufw status | grep -q 'Status: active'; then
    echo "[INFO] ufw firewall is active."
    if ufw status | grep -q "$PG_PORT" | grep -q "ALLOW"; then
        echo -e "${GREEN}[OK] ufw rule for port $PG_PORT found and allows traffic.${NC}"
    else
        echo -e "${YELLOW}[WARNING] No ufw rule found allowing traffic on port $PG_PORT.${NC}"
        echo "You can add a rule with: sudo ufw allow $PG_PORT/tcp"
    fi
elif command -v firewall-cmd &> /dev/null && firewall-cmd --state | grep -q 'running'; then
    echo "[INFO] firewalld is active."
    if firewall-cmd --list-ports --permanent | grep -q "$PG_PORT/tcp"; then
        echo -e "${GREEN}[OK] firewalld rule for port $PG_PORT found.${NC}"
    else
        echo -e "${YELLOW}[WARNING] No firewalld rule found for port $PG_PORT.${NC}"
        echo "You can add a rule with:"
        echo "sudo firewall-cmd --add-port=$PG_PORT/tcp --permanent"
        echo "sudo firewall-cmd --reload"
    fi
else
    echo "[INFO] No common firewall (ufw, firewalld) detected or it is inactive. Firewall is likely not an issue."
fi
echo ""


# --- Step 3: Get Local IP ---
echo "--- Step 3: Your Local IP Addresses ---"
echo "To connect from another machine on the same network, use one of these IPs:"
ip -4 addr | grep inet | awk '{print $2}' | cut -d'/' -f1
echo ""

echo "--- Check Complete ---"
