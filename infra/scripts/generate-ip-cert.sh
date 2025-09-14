#!/usr/bin/env bash
set -euo pipefail
IP="${1:-3.87.125.170}"
CN="${2:-localhost}"
CONF="$(mktemp)"
cat > "$CONF" <<CFG
[req]
distinguished_name = dn
x509_extensions = v3_req
prompt = no

[dn]
CN = $CN

[v3_req]
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost
IP.1 = $IP
CFG
mkdir -p nginx/certs
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/certs/localhost.key \
  -out nginx/certs/localhost.crt \
  -config "$CONF"
rm -f "$CONF"
