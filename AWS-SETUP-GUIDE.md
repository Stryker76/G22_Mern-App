# AWS VM Setup Guide for MERN App with Docker and Kubernetes

This guide provides step-by-step instructions to set up the MERN app on an AWS EC2 instance (VM) using Docker commands (no GUI). The setup includes Docker Compose for local development and Minikube for Kubernetes deployment. Use Ubuntu 22.04 LTS for the VM (recommended for compatibility).

## Prerequisites
- AWS account with EC2 access.
- Basic familiarity with SSH and terminal.
- The project files (G22_Mern-App) downloaded or cloned.

## Step 1: Launch AWS EC2 Instance
1. Log in to the AWS Management Console and navigate to EC2.
2. Click "Launch Instance".
3. Choose "Ubuntu Server 22.04 LTS (HVM), SSD Volume Type" AMI.
4. Select instance type: t3.micro (free tier eligible) or t3.small for better performance.
5. Configure instance details: 
   - Number of instances: 1
   - Network: Use default VPC
   - Subnet: Select a public subnet
   - Auto-assign Public IP: Enable
   - Security groups: Create a new group allowing inbound SSH (port 22) from your IP, HTTP (80), HTTPS (443), and additional ports: 30017 (Mongo), 30081 (Mongo Express), 30080/30500 (Backend), 30443 (Nginx HTTPS), 32000 (Frontend).
6. Add storage: Default 8 GiB GP3.
7. Launch and download the key pair (.pem file). Set permissions: `chmod 400 your-key.pem`.
8. Note the public IP/DNS of the instance.

## Step 2: Connect to the VM
1. Open a terminal on your local machine.
2. SSH into the instance:
   ```
   ssh -i your-key.pem ubuntu@your-instance-public-ip
   ```
3. Update the system:
   ```
   sudo apt update && sudo apt upgrade -y
   ```

## Step 3: Install Docker and Docker Compose
1. Install Docker:
   ```
   sudo apt install docker.io -y
   sudo systemctl start docker
   sudo systemctl enable docker
   sudo usermod -aG docker ubuntu
   ```
   Log out and SSH back in for group changes to take effect.
2. Verify Docker:
   ```
   docker --version
   docker run hello-world
   ```
3. Install Docker Compose (v2):
   ```
   sudo apt install docker-compose-plugin -y
   docker compose version
   ```

## Step 4: Transfer Project Files to VM
1. From your local machine, use SCP to copy the project directory:
   ```
   scp -i your-key.pem -r G22_Mern-App ubuntu@your-instance-public-ip:~/
   ```
2. SSH back into the VM and navigate:
   ```
   cd G22_Mern-App
   ls  # Verify files are there
   ```

## Step 5: Set Up Environment and Certificates
1. Copy .env.example to .env and edit if needed (use nano or vim):
   ```
   cp .env.example .env
   nano .env
   ```
   Ensure variables like ADMIN_USER=admin, ADMIN_PASS=g22, APP_DB_NAME=employees, etc., match.
2. Generate SSL certificates (using the PowerShell script if on Windows local, or run the script on VM if adapted; alternatively, use the Docker method):
   - On VM, create a simple cert generation script or use openssl if installed:
     ```
     sudo apt install openssl -y
     mkdir -p nginx/certs
     openssl genrsa -out nginx/certs/localhost.key 2048
     openssl req -new -x509 -key nginx/certs/localhost.key -out nginx/certs/localhost.crt -days 365 -subj "/CN=localhost"
     ```
3. Verify certs:
   ```
   ls nginx/certs/
   ```

## Step 6: Test Docker Compose Setup
1. Build and run:
   ```
   docker compose up --build -d
   ```
2. Check logs:
   ```
   docker compose logs -f
   ```
   Look for MongoDB starting, backend connecting to DB, frontend building, Nginx running.
3. Verify containers:
   ```
   docker compose ps
   ```
4. Test access:
   - Frontend: curl -k https://localhost (accept self-signed cert)
   - Mongo Express: curl -k https://localhost/db (login with admin/g22)
   - Add data via browser or curl, check in Mongo Express.
5. Stop if needed:
   ```
   docker compose down
   ```

## Step 7: Install Minikube and kubectl for Kubernetes
1. Install Minikube:
   ```
   curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
   sudo install minikube-linux-amd64 /usr/local/bin/minikube
   minikube version
   ```
2. Install kubectl:
   ```
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
   sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
   kubectl version --client
   ```
3. Start Minikube (with Docker driver):
   ```
   minikube start --driver=docker
   ```
   If Docker driver issues, use none driver: `minikube start --driver=none` (requires sudo).
4. Verify:
   ```
   kubectl get nodes
   minikube dashboard  # Optional, but no GUI specified
   ```

## Step 8: Build Docker Images for Kubernetes
1. Build frontend and backend images (Nginx uses official, Mongo/Mongo Express use images):
   ```
   docker build -t frontend:1.0 -f frontend/Dockerfile .
   docker build -t backend:1.0 -f server/Dockerfile .
   ```
2. Load images into Minikube:
   ```
   minikube image load frontend:1.0
   minikube image load backend:1.0
   ```

## Step 9: Create SSL Secret for Kubernetes
1. Create secret from certs:
   ```
   kubectl create secret generic ssl-certs --from-file=localhost.crt=nginx/certs/localhost.crt --from-file=localhost.key=nginx/certs/localhost.key
   ```
2. Verify:
   ```
   kubectl get secrets
   ```

## Step 10: Deploy to Minikube
1. Apply all manifests (order: configmaps, secrets, deployments, services):
   ```
   kubectl apply -f infra/k8s/nginx-configmap.yml
   kubectl apply -f infra/k8s/ssl-secret.yml  # If not created via command
   kubectl apply -f infra/k8s/mongo-deployment.yml
   kubectl apply -f infra/k8s/backend-deployment.yml
   kubectl apply -f infra/k8s/frontend-deployment.yml
   kubectl apply -f infra/k8s/mongo-express-deployment.yml
   kubectl apply -f infra/k8s/nginx-deployment.yml
   kubectl apply -f infra/k8s/mongo-service.yml
   kubectl apply -f infra/k8s/mongo-service-external.yml
   kubectl apply -f infra/k8s/backend-service.yml
   kubectl apply -f infra/k8s/frontend-service.yml
   kubectl apply -f infra/k8s/mongo-express-service.yml
   kubectl apply -f infra/k8s/nginx-service.yml
   ```
   Or if generated-manifests.yml combines them: `kubectl apply -f infra/k8s/generated-manifests.yml`.
2. Verify deployments:
   ```
   kubectl get pods
   kubectl get services
   kubectl logs -f deployment/mongo  # Check DB connection
   kubectl logs -f deployment/backend  # Check backend connection
   ```

## Step 11: Test Kubernetes Deployment
1. Get Minikube IP:
   ```
   minikube ip
   ```
2. Access services:
   - Nginx/Frontend: https://$(minikube ip):30443 (accept self-signed cert)
   - Mongo Express: https://$(minikube ip):30443/db (login admin/g22)
   - Backend API: curl https://$(minikube ip):30443/api/records (via proxy)
   - External Mongo: $(minikube ip):30017 (if needed)
3. Test functionality:
   - Add/update data via web interface.
   - Verify in Mongo Express.
   - Check pod logs for errors.
4. Port-forward if direct access issues:
   ```
   kubectl port-forward service/nginx-proxy 8443:443
   ```
   Then access https://localhost:8443.

## Troubleshooting
- Docker issues: Ensure Docker service is running, user in docker group.
- Minikube issues: If driver=docker fails, try --driver=none (sudo minikube start --driver=none).
- Image pull errors: Ensure images loaded with minikube image load.
- Cert errors: Verify secret contents with `kubectl get secret ssl-certs -o yaml`.
- Port conflicts: Check with `kubectl get services`.
- Cleanup: `minikube delete`, `docker compose down -v`, `kubectl delete -f infra/k8s/`.

## Submission Notes
- Use this on AWS VM for Milestone 2 demo.
- Screenshots: Include terminal commands, logs, browser URLs with data ops.
- Project 2 (mern-app) used.

For questions, refer to DEPLOYMENT-GUIDE.md or contact instructor.