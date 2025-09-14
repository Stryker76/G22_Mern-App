#!/bin/bash
# Deploy MERN app using Kubernetes

echo "🚀 Starting MERN Stack deployment with Kubernetes..."

# Build Docker images
echo "🔨 Building Docker images..."
docker build -t backend:1.0 ./server
docker build -t frontend:1.0 ./frontend

# Apply Kubernetes configurations
echo "📦 Deploying to Kubernetes..."

# Deploy MongoDB and ConfigMap
kubectl apply -f infra/k8s/mongo-deployment.yml
kubectl apply -f infra/k8s/mongo-service.yml

# Wait for MongoDB to be ready
echo "⏳ Waiting for MongoDB to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/mongo

# Deploy MongoDB Express (Database UI)
kubectl apply -f infra/k8s/mongo-express-deployment.yml
kubectl apply -f infra/k8s/mongo-express-service.yml

# Deploy Backend
kubectl apply -f infra/k8s/backend-deployment.yml
kubectl apply -f infra/k8s/backend-service.yml

# Wait for backend to be ready
echo "⏳ Waiting for backend to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/backend

# Deploy Frontend
kubectl apply -f infra/k8s/frontend-deployment.yml
kubectl apply -f infra/k8s/frontend-service.yml

# Deploy Nginx (if using)
kubectl apply -f infra/k8s/nginx-configmap.yml
kubectl apply -f infra/k8s/nginx-deployment.yml
kubectl apply -f infra/k8s/nginx-service.yml

echo "⏳ Waiting for all deployments to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/frontend
kubectl wait --for=condition=available --timeout=300s deployment/mongo-express

echo "✅ MERN Stack deployed successfully to Kubernetes!"
echo ""
echo "📱 Access the application:"
echo "   Frontend:     http://localhost:32000"
echo "   Database UI:  http://localhost:30081"
echo "   API:          http://localhost:30080/api"
echo ""
echo "📊 Check pod status:"
echo "   kubectl get pods"
echo "   kubectl get services"
echo ""
echo "📋 Check logs:"
echo "   kubectl logs deployment/frontend"
echo "   kubectl logs deployment/backend" 
echo "   kubectl logs deployment/mongo"
echo ""
echo "🛑 To cleanup:"
echo "   kubectl delete -f infra/k8s/"