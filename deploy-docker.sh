#!/bin/bash
# Deploy MERN app using Docker Compose

echo "🚀 Starting MERN Stack deployment with Docker Compose..."

# Generate SSL certificates if they don't exist
if [ ! -f "nginx/certs/localhost.crt" ]; then
    echo "📜 Generating SSL certificates..."
    ./infra/scripts/generate-certs.sh
fi

# Build and start services
echo "🔨 Building and starting services..."
docker-compose up --build -d

echo "⏳ Waiting for services to be ready..."
sleep 30

echo "✅ MERN Stack deployed successfully!"
echo ""
echo "📱 Access the application:"
echo "   Frontend (HTTP):  http://localhost:80"
echo "   Frontend (HTTPS): https://localhost:443"
echo "   Database UI:      https://localhost:443/db/"
echo "   API:              https://localhost:443/api"
echo ""
echo "📊 Check service logs:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 To stop the application:"
echo "   docker-compose down"