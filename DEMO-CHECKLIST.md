# G22 MERN App - Demo Checklist

This checklist covers all the demonstration requirements for the assignment.

## ✅ Demonstration Requirements

### 1. Docker Compose Demonstration

#### A. Start the Application
```bash
# Navigate to project directory
cd G22_Mern-App

# Deploy using Docker Compose
./deploy-docker.sh
# OR
docker-compose up --build -d
```

#### B. Show the Logs
```bash
# View all service logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f mongo
docker-compose logs -f mongo-express
docker-compose logs -f nginx
```

#### C. Show App in Browser (HTTPS)
- **Frontend**: https://localhost:443
- **API Health Check**: https://localhost:443/api/ping

#### D. Show Database UI in Browser (HTTPS) 
- **Database UI**: https://localhost:443/db/
- **Credentials**: admin / g22

#### E. Add/Update Data
1. **From App**: Add employee data through the frontend interface
2. **From Database UI**: Create/modify records directly in mongo-express
3. **Verify**: Changes are reflected in both interfaces

### 2. Kubernetes Demonstration

#### A. Build Images
```bash
# Build Docker images for Kubernetes
docker build -t backend:1.0 ./server
docker build -t frontend:1.0 ./frontend
```

#### B. Deploy to Kubernetes
```bash
# Deploy using script
./deploy-k8s.sh
# OR
kubectl apply -f infra/k8s/
```

#### C. Show the Logs
```bash
# View deployment status
kubectl get pods
kubectl get services

# View logs
kubectl logs deployment/frontend
kubectl logs deployment/backend
kubectl logs deployment/mongo
kubectl logs deployment/mongo-express
```

#### D. Show App in Browser (HTTP)
- **Frontend**: http://localhost:32000
- **API Health Check**: http://localhost:30080/health

#### E. Show Database UI in Browser (HTTP)
- **Database UI**: http://localhost:30081
- **Credentials**: admin / g22

#### F. Add/Update Data
1. **From App**: Add employee data through the frontend interface
2. **From Database UI**: Create/modify records directly in mongo-express  
3. **Verify**: Changes are reflected in both interfaces

## 📋 Pre-Demo Setup

### Before the Interview

1. **Build Docker Images**:
   ```bash
   docker-compose build
   docker build -t backend:1.0 ./server
   docker build -t frontend:1.0 ./frontend
   ```

2. **Verify Kubernetes Cluster**:
   ```bash
   kubectl cluster-info
   kubectl get nodes
   ```

3. **Test Deployments**:
   - Run both Docker Compose and Kubernetes deployments
   - Verify all URLs are accessible
   - Test database connectivity
   - Ensure sample data can be added/modified

### During the Demo

1. **Start with Docker Compose**:
   - Show deployment process
   - Demonstrate all URLs (HTTPS)
   - Show database UI functionality
   - Add sample employee data

2. **Switch to Kubernetes**:
   - Clean up Docker Compose: `docker-compose down`
   - Deploy to Kubernetes
   - Demonstrate all URLs (HTTP)
   - Show database UI functionality
   - Add/modify data from both interfaces

3. **Show Logs and Monitoring**:
   - Display service logs
   - Show pod status
   - Demonstrate application health

## 🏗️ Architecture Components

### Services Overview

1. **Frontend** (React):
   - Port 3000 (dev) / 32000 (k8s) / 443 (compose+nginx)
   - Employee management interface

2. **Backend** (Node.js/Express):
   - Port 5000 (dev) / 30080 (k8s) / 443/api (compose+nginx)
   - REST API for employee CRUD operations

3. **Database** (MongoDB):
   - Port 27017 (internal only)
   - Employee data storage

4. **Database UI** (Mongo Express):
   - Port 8081 (dev) / 30081 (k8s) / 443/db (compose+nginx)
   - Web-based MongoDB admin interface

5. **Reverse Proxy** (Nginx - Docker Compose only):
   - Ports 80/443
   - HTTPS termination and routing

### Key Features Demonstrated

- ✅ Full-stack MERN application
- ✅ Containerized services
- ✅ Database with web UI
- ✅ Both HTTP and HTTPS access
- ✅ Service orchestration (Compose & K8s)
- ✅ Logging and monitoring
- ✅ Data persistence
- ✅ CRUD operations from multiple interfaces

## 📝 Sample Test Data

Use this sample data during demonstrations:

```json
{
  "name": "John Doe",
  "position": "Software Developer", 
  "level": "Senior"
}
```

```json
{
  "name": "Jane Smith",
  "position": "DevOps Engineer",
  "level": "Lead"
}
```

## 🚨 Troubleshooting

### Common Demo Issues

1. **Port Conflicts**: Ensure ports 80, 443, 3000, 5000, 27017, 8081, 30080, 30081, 32000 are available
2. **SSL Warnings**: Accept self-signed certificate warnings in browser
3. **Service Startup**: Wait 30-60 seconds for all services to be ready
4. **Image Building**: Ensure Docker has sufficient disk space
5. **Kubernetes**: Verify cluster is running and kubectl is configured

### Quick Fixes

```bash
# Clean up everything
docker-compose down -v
kubectl delete -f infra/k8s/
docker system prune -f

# Restart Docker Desktop if needed
# Restart minikube: minikube stop && minikube start
```