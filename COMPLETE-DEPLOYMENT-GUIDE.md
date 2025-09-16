# Complete EC2 Ubuntu Setup Guide for G22 MERN Application

This comprehensive guide will walk you through setting up a brand new AWS EC2 Ubuntu instance with all required dependencies and deploying the MERN application using both Docker Compose and Kubernetes (Minikube).

## Table of Contents
1. [EC2 Instance Setup](#ec2-instance-setup)
2. [System Prerequisites Installation](#system-prerequisites-installation)
3. [Project Setup](#project-setup)
4. [Task 1: Docker Compose Deployment (4 Containers)](#task-1-docker-compose-deployment)
5. [Kubernetes Deployment with Minikube](#kubernetes-deployment-with-minikube)
6. [Verification and Testing](#verification-and-testing)
7. [Troubleshooting](#troubleshooting)

---

## EC2 Instance Setup

### 1. Launch EC2 Instance
1. **Launch Ubuntu 24.04 LTS instance** (t3.medium or larger recommended)
2. **Configure Security Group** with the following inbound rules:
   ```
   SSH (22)         - Your IP
   HTTP (80)        - 0.0.0.0/0
   HTTPS (443)      - 0.0.0.0/0
   Custom (3000)    - 0.0.0.0/0  (React dev server)
   Custom (5000)    - 0.0.0.0/0  (Backend API)
   Custom (8081)    - 0.0.0.0/0  (Mongo Express)
   Custom (30080)   - 0.0.0.0/0  (Kubernetes NodePort)
   Custom (30081)   - 0.0.0.0/0  (Kubernetes Mongo Express)
   Custom (32000)   - 0.0.0.0/0  (Kubernetes Frontend)
   ```
3. **Connect via SSH**:
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```

### 2. Initial System Update
```bash
sudo apt update && sudo apt upgrade -y
```

---

## System Prerequisites Installation

### 1. Install Docker and Docker Compose

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker ubuntu
newgrp docker

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installations
docker --version
docker-compose --version
```

### 2. Install Git
```bash
sudo apt install git -y
git --version
```

### 3. Install Node.js (for development purposes)
```bash
# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### 4. Install kubectl
```bash
# Download kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"

# Install kubectl
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Verify installation
kubectl version --client
```

### 5. Install Minikube
```bash
# Download and install minikube
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# Verify installation
minikube version
```

### 6. Install OpenSSL (for SSL certificates)
```bash
sudo apt install openssl -y
openssl version
```

---

## Project Setup

### 1. Clone the Repository
```bash
cd ~
git clone https://github.com/Stryker76/G22_Mern-App.git
cd G22_Mern-App
```

### 2. Set Up Environment Variables
```bash
# Copy environment template
cp .env.example .env

# Edit environment file (optional - defaults should work)
nano .env
```

**Default environment variables (you can modify if needed):**
```env
# Application settings
MONGO_URI=mongodb://appuser:pass@localhost:27017/employees?authSource=employees
JWT_SECRET=your-jwt-secret-here
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Docker/Compose specific
ADMIN_USER=admin
ADMIN_PASS=g22
APP_DB_NAME=employees
APP_DB_USERNAME=appuser
APP_DB_PASSWORD=pass
MONGO_PORT=27017
BACKEND_PORT=5000
FRONTEND_PORT=3000
NGINX_HTTP_PORT=80
NGINX_HTTPS_PORT=443
```

### 3. Make Scripts Executable
```bash
chmod +x deploy-docker.sh
chmod +x deploy-k8s.sh
chmod +x infra/scripts/generate-certs.sh
chmod +x infra/scripts/generate-ip-cert.sh
```

---

## Task 1: Docker Compose Deployment

This section implements the **4-container requirement**: Frontend, Backend, Database, and Nginx Proxy with database UI.

### 1. Generate SSL Certificates
```bash
# Generate self-signed certificates for HTTPS
./infra/scripts/generate-certs.sh
```

### 2. Build and Deploy with Docker Compose
```bash
# Deploy all containers
./deploy-docker.sh

# OR manually:
docker-compose up --build -d
```

### 3. Verify All 4 Containers Are Running
```bash
# Check container status
docker-compose ps

# View logs for all services
docker-compose logs -f

# Check specific service logs
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f mongo
docker-compose logs -f mongo-express
docker-compose logs -f nginx
```

### 4. Container Architecture Overview

The Docker Compose setup creates:

1. **Frontend Container**: React application served by nginx
2. **Backend Container**: Node.js/Express API server
3. **Database Container**: MongoDB with persistent volume
4. **Database UI Container**: Mongo Express for database management
5. **Nginx Proxy Container**: HTTPS proxy and load balancer

**Network Configuration:**
- `frontend_net`: Frontend ↔ Nginx
- `backend_net`: Backend ↔ Frontend ↔ Nginx ↔ Mongo Express
- `db_net`: Database ↔ Backend ↔ Mongo Express

**Exposed Ports:**
- HTTP: Port 80
- HTTPS: Port 443
- MongoDB: Port 27017

**Volumes:**
- `mongo_data`: Persistent MongoDB storage

### 5. Access the Application

**Important**: Replace `your-ec2-ip` with your actual EC2 instance public IP.

- **Frontend (HTTPS)**: `https://your-ec2-ip`
- **Frontend (HTTP)**: `http://your-ec2-ip`
- **Database UI**: `https://your-ec2-ip/db/` 
  - Username: `admin`
  - Password: `g22`
- **API Endpoint**: `https://your-ec2-ip/api`

### 6. Test the Application

1. **Verify containers are running**:
   ```bash
   docker ps
   ```

2. **Check database connection in logs**:
   ```bash
   docker-compose logs backend | grep -i mongo
   ```

3. **Test frontend access**: Open `https://your-ec2-ip` in browser
4. **Test database UI**: Open `https://your-ec2-ip/db/` in browser
5. **Add/update data** through both interfaces to verify functionality

---

## Kubernetes Deployment with Minikube

### 1. Start Minikube
```bash
# Start minikube with enough resources
minikube start --memory=4096 --cpus=2 --driver=docker

# Verify minikube is running
minikube status
```

### 2. Build Docker Images for Kubernetes
```bash
# Configure docker to use minikube's docker daemon
eval $(minikube docker-env)

# Build images inside minikube
docker build -t backend:1.0 ./server
docker build -t frontend:1.0 ./frontend

# Verify images are built
docker images | grep -E "(backend|frontend)"

# Reset docker environment (optional)
eval $(minikube docker-env -u)
```

### 3. Deploy to Kubernetes
```bash
# Deploy all Kubernetes resources
./deploy-k8s.sh

# OR manually apply all configurations:
kubectl apply -f infra/k8s/
```

### 4. Monitor Deployment Status
```bash
# Check all pods are running
kubectl get pods

# Check services
kubectl get services

# Check deployments
kubectl get deployments

# Wait for all deployments to be ready
kubectl wait --for=condition=available --timeout=300s deployment --all
```

### 5. Access Kubernetes Application

Get the Minikube IP:
```bash
minikube ip
```

**Access URLs** (replace `MINIKUBE_IP` with the output above):
- **Frontend**: `http://MINIKUBE_IP:32000`
- **Database UI**: `http://MINIKUBE_IP:30081`
  - Username: `admin`
  - Password: `g22`
- **Backend API**: `http://MINIKUBE_IP:30080`

### 6. Alternative: Port Forwarding
If NodePorts don't work, use port forwarding:
```bash
# Frontend (run in separate terminal)
kubectl port-forward service/frontend-service 3000:3000

# Database UI (run in separate terminal)
kubectl port-forward service/mongo-express-service 8081:8081

# Backend API (run in separate terminal)
kubectl port-forward service/backend-service 5000:5000
```

Then access via:
- Frontend: `http://localhost:3000`
- Database UI: `http://localhost:8081`
- Backend API: `http://localhost:5000`

---

## Verification and Testing

### For Docker Compose Deployment

1. **Container Status Check**:
   ```bash
   docker-compose ps
   # All containers should show "Up" status
   ```

2. **Log Verification**:
   ```bash
   # Check database connection logs
   docker-compose logs backend | grep -i "connected\|mongo"
   
   # Check all container logs
   docker-compose logs --tail=50
   ```

3. **Web Interface Testing**:
   - Open `https://your-ec2-ip` → Should show employee management interface
   - Open `https://your-ec2-ip/db/` → Should show Mongo Express login
   - Login with `admin`/`g22` → Should access database interface

4. **Data Operations**:
   - Add employee through web interface
   - Verify data appears in Mongo Express
   - Update employee through Mongo Express
   - Verify changes appear in web interface

### For Kubernetes Deployment

1. **Pod Status Check**:
   ```bash
   kubectl get pods
   # All pods should show "Running" status
   ```

2. **Service Check**:
   ```bash
   kubectl get services
   # Should show NodePort services with external access
   ```

3. **Log Verification**:
   ```bash
   kubectl logs deployment/backend | grep -i "connected\|mongo"
   ```

4. **Web Interface Testing**:
   - Access frontend via Minikube IP and NodePort
   - Access Mongo Express via Minikube IP and NodePort
   - Test data operations as above

---

## Troubleshooting

### Common Docker Issues

1. **Permission Denied for Docker**:
   ```bash
   sudo usermod -aG docker $USER
   newgrp docker
   ```

2. **Port Already in Use**:
   ```bash
   # Find process using port
   sudo lsof -i :80
   sudo lsof -i :443
   
   # Kill process if needed
   sudo kill -9 <PID>
   ```

3. **SSL Certificate Issues**:
   ```bash
   # Regenerate certificates
   rm -rf nginx/certs/*
   ./infra/scripts/generate-certs.sh
   docker-compose restart nginx
   ```

4. **Database Connection Failed**:
   ```bash
   # Check MongoDB logs
   docker-compose logs mongo
   
   # Restart database
   docker-compose restart mongo
   ```

### Common Kubernetes Issues

1. **Images Not Found**:
   ```bash
   # Ensure you're using minikube's docker daemon
   eval $(minikube docker-env)
   docker build -t backend:1.0 ./server
   docker build -t frontend:1.0 ./frontend
   ```

2. **Pods Stuck in Pending**:
   ```bash
   kubectl describe pods
   # Check events for resource issues
   ```

3. **NodePort Not Accessible**:
   ```bash
   # Check minikube IP
   minikube ip
   
   # Use port forwarding as alternative
   kubectl port-forward service/frontend-service 3000:3000
   ```

4. **Clean Up and Restart**:
   ```bash
   kubectl delete -f infra/k8s/
   minikube stop
   minikube start --memory=4096 --cpus=2
   ```

### System Resource Issues

1. **Low Disk Space**:
   ```bash
   # Clean Docker images
   docker system prune -a
   
   # Clean Kubernetes resources
   kubectl delete pods --field-selector=status.phase=Succeeded
   ```

2. **Memory Issues**:
   ```bash
   # Check system resources
   free -h
   df -h
   
   # For Minikube, increase memory:
   minikube stop
   minikube start --memory=6144 --cpus=3
   ```

### Network Issues

1. **Cannot Access from Browser**:
   - Verify EC2 Security Group rules
   - Check if applications are bound to 0.0.0.0, not 127.0.0.1
   - Ensure firewall isn't blocking ports

2. **Internal Container Communication**:
   ```bash
   # Test container networking
   docker-compose exec frontend ping backend
   docker-compose exec backend ping mongo
   ```

---

## Production Considerations

When moving to production, consider:

1. **Security**: Replace default passwords with strong, unique credentials
2. **SSL Certificates**: Use proper CA-signed certificates instead of self-signed
3. **Resource Limits**: Set appropriate CPU and memory limits for containers
4. **Persistent Storage**: Use EBS volumes for database persistence
5. **Load Balancing**: Use AWS Application Load Balancer instead of nginx
6. **Monitoring**: Implement proper logging and monitoring solutions
7. **Backup**: Set up automated database backups
8. **Secrets Management**: Use AWS Secrets Manager or Kubernetes secrets

---

## Submission Requirements

For **Milestone 2**, ensure you can demonstrate:

### Docker Compose (Required):
- ✅ 4 containers running (Frontend, Backend, Database, Database UI, Nginx)
- ✅ Internal docker networks configured
- ✅ Exposed ports working
- ✅ Volumes for data persistence
- ✅ Environment variables configuration
- ✅ Log messages showing successful database connection
- ✅ HTTPS access to web interface
- ✅ Database UI access with screenshots including URL
- ✅ Data operations working between both interfaces

### Kubernetes (Excellent Grade):
- ✅ Minikube cluster with 4+ containers
- ✅ Internal and external services
- ✅ NodePort services for external access
- ✅ All functionality working as in Docker Compose
- ✅ Demonstration of container orchestration

This guide provides everything needed to complete Task 1 successfully on a fresh AWS EC2 Ubuntu instance.