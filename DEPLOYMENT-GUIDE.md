# MERN Stack Deployment Guide

This guide provides step-by-step instructions for deploying the G22 MERN application using both Docker Compose and Kubernetes.

## Prerequisites

### For Docker Compose:
- Docker and Docker Compose installed
- OpenSSL (for SSL certificate generation)

### For Kubernetes:
- kubectl configured and connected to a cluster
- Docker installed (for building images)
- Kubernetes cluster (minikube, Docker Desktop, or cloud provider)

## Docker Compose Deployment

### 1. Generate SSL Certificates
```bash
# Make script executable (Linux/Mac)
chmod +x infra/scripts/generate-certs.sh
chmod +x deploy-docker.sh

# Generate certificates
./infra/scripts/generate-certs.sh
```

### 2. Deploy the Application
```bash
# Use the deployment script
./deploy-docker.sh

# OR manually:
# Note: some systems use the standalone 'docker-compose' binary, others use the Docker CLI subcommand 'docker compose'.
# Try one of the following based on your environment:
docker-compose up --build -d
# or
docker compose up --build -d
```

### 3. Access the Application
- **Frontend (HTTP)**: http://localhost:80
- **Frontend (HTTPS)**: https://localhost:443
- **Database UI (HTTPS)**: https://localhost:443/db/
- **API (HTTPS)**: https://localhost:443/api

### 4. View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f mongo
docker-compose logs -f mongo-express
```

### 5. Stop the Application
```bash
docker-compose down
```

## Kubernetes Deployment

### 1. Build Docker Images
```bash
# Build backend image
docker build -t backend:1.0 ./server

# Build frontend image  
docker build -t frontend:1.0 ./frontend
```

### 2. Deploy to Kubernetes
```bash
# Make script executable (Linux/Mac)
chmod +x deploy-k8s.sh

# Use the deployment script
./deploy-k8s.sh

# OR manually apply configurations:
kubectl apply -f infra/k8s/
```

### 3. Access the Application

**Using NodePort services:**
- **Frontend**: http://localhost:32000
- **Database UI**: http://localhost:30081  
- **Backend API**: http://localhost:30080

**Using port-forwarding (alternative):**
```bash
# Frontend
kubectl port-forward service/frontend-service 3000:3000

# Database UI
kubectl port-forward service/mongo-express-service 8081:8081

# Backend API
kubectl port-forward service/backend-service 5000:5000
```

### 4. Monitor Deployment
```bash
# Check pod status
kubectl get pods

# Check services
kubectl get services

# Check deployments
kubectl get deployments

# View logs
kubectl logs deployment/frontend
kubectl logs deployment/backend
kubectl logs deployment/mongo
kubectl logs deployment/mongo-express
```

### 5. Cleanup
```bash
# Delete all resources
kubectl delete -f infra/k8s/

# OR delete individual components
kubectl delete deployment --all
kubectl delete service --all
kubectl delete configmap --all
```

## Environment Variables

The application uses the following environment variables (defined in `.env.example`):

```env
# Standard MERN environment variables
MONGO_URI=mongodb://appuser:pass@localhost:27017/employees?authSource=employees
JWT_SECRET=your-jwt-secret-here
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Docker/Compose specific (optional, override as needed)
ADMIN_USER=admin
ADMIN_PASS=g22
APP_DB_NAME=employees
APP_DB_USERNAME=appuser
APP_DB_PASSWORD=pass
MONGO_PORT=27017
BACKEND_PORT=5000
FRONTEND_PORT=3000
```

- For Docker Compose, these variables are set in `docker-compose.yml`.
- For Kubernetes, set as env in deployment YAMLs or use secrets/configmaps.
- For local dev, copy `.env.example` to `.env` and fill in real values.

## Database Access

### Docker Compose
Access mongo-express (database UI) at: https://localhost:443/db/
- Username: admin
- Password: g22

### Kubernetes
Access mongo-express at: http://localhost:30081
- Username: admin  
- Password: g22

## Troubleshooting

### Common Issues

1. **SSL Certificate Errors (Docker Compose)**
   - Run `./infra/scripts/generate-certs.sh` to generate certificates
   - Check that `nginx/certs/` directory contains `localhost.crt` and `localhost.key`

2. **Port Already in Use**
   - Check if other services are using the same ports
   - Modify ports in `.env.example` or `docker-compose.yml`

3. **Kubernetes Image Not Found**
   - Ensure images are built: `docker build -t backend:1.0 ./server`
   - Set `imagePullPolicy: Never` in deployment files for local images

4. **Database Connection Issues**
   - Verify MongoDB is running: `kubectl get pods | grep mongo`
   - Check database credentials in environment variables

5. **Frontend Not Loading**
   - Check if all services are running
   - Verify nginx configuration for proper routing

### Logs and Debugging

**Docker Compose:**
```bash
docker-compose logs -f [service-name]
docker ps
docker exec -it [container-name] /bin/sh
```

**Kubernetes:**
```bash
kubectl logs deployment/[deployment-name]
kubectl describe pod [pod-name]
kubectl exec -it [pod-name] -- /bin/sh
```

## Production Considerations

1. **Security**: Replace default passwords and use proper secret management
2. **SSL**: Use proper SSL certificates from a CA in production
3. **Scaling**: Adjust replica counts in K8s deployments based on load
4. **Storage**: Use persistent volumes for MongoDB in production
5. **Monitoring**: Add health checks and monitoring solutions