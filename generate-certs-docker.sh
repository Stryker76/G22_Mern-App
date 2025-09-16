#!/bin/bash
# Generate self-signed certificates using Docker OpenSSL

mkdir -p nginx/certs

docker run --rm -v "$(pwd)/nginx/certs:/certs" alpine/openssl:latest \
  genrsa -out /certs/localhost.key 2048

docker run --rm -v "$(pwd)/nginx/certs:/certs" alpine/openssl:latest \
  req -new -x509 -key /certs/localhost.key -out /certs/localhost.crt -days 365 \
  -subj "/C=AU/ST=QLD/L=Brisbane/O=MyOrg/CN=localhost"

echo "SSL certificates generated successfully in nginx/certs/"
echo "Note: For production use, obtain certificates from a trusted CA"