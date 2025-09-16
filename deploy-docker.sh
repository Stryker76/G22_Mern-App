#!/bin/bash
set -euo pipefail

# Deploy MERN app using Docker Compose

echo "🚀 Starting MERN Stack deployment with Docker Compose..."

# Check docker is installed
if ! command -v docker >/dev/null 2>&1; then
    echo "❌ Docker CLI not found. Please install Docker and try again."
    exit 1
fi

# Check docker daemon is running
if ! docker info >/dev/null 2>&1; then
    echo "❌ Docker daemon not reachable. Is Docker running?"
    exit 1
fi

# Choose compose command: prefer docker-compose, fall back to 'docker compose'
COMPOSE_CMD=""
if command -v docker-compose >/dev/null 2>&1; then
    COMPOSE_CMD="docker-compose"
elif docker compose version >/dev/null 2>&1; then
    COMPOSE_CMD="docker compose"
else
    echo "❌ Neither 'docker-compose' nor 'docker compose' is available. Install one of them."
    exit 1
fi

# Ensure docker-compose.yml exists in repo root (where this script runs)
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ docker-compose.yml not found in $(pwd). Please run this script from the repository root or ensure the file exists."
    exit 1
fi

# Generate SSL certificates if they don't exist and generator script exists
if [ ! -f "nginx/certs/localhost.crt" ] || [ ! -f "nginx/certs/localhost.key" ]; then
    if [ -x "./infra/scripts/generate-certs.sh" ]; then
        echo "📜 Generating SSL certificates..."
        ./infra/scripts/generate-certs.sh
    else
        echo "⚠️  SSL certs missing (nginx/certs/localhost.crt/key) and infra/scripts/generate-certs.sh not found or not executable."
        echo "If you need HTTPS for local dev, create certs at nginx/certs/localhost.crt and nginx/certs/localhost.key or make the generator executable."
        # continue — allow non-HTTPS setups to proceed
    fi
fi

# Build and start services
echo "🔨 Building and starting services using: $COMPOSE_CMD up --build -d"
$COMPOSE_CMD up --build -d

echo "⏳ Waiting for services to be ready..."
sleep 10

echo "✅ MERN Stack deployed successfully!"
echo ""
echo "📱 Access the application (adjust ports if your compose maps differently):"
echo "   Frontend (HTTP):  http://localhost:80"
echo "   Frontend (HTTPS): https://localhost:443"
echo "   Database UI:      https://localhost:443/db/"
echo "   API:              https://localhost:443/api"
echo ""
echo "📊 Check service logs:"
echo "   $COMPOSE_CMD logs -f"
echo ""
echo "🛑 To stop the application:"
echo "   $COMPOSE_CMD down"