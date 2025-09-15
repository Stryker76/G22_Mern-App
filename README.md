# G22 MERN App

A full-stack [MERN](https://www.mongodb.com/mern-stack) application for managing employee information with Docker and Kubernetes deployment support.

## About the Project

This is a complete MERN stack application that manages employee information with full CRUD operations. The application is containerized and includes database management interface, HTTPS support, and Kubernetes orchestration.

## Tech Stack

**Frontend:** React, Bootstrap  
**Backend:** Node.js, Express.js  
**Database:** MongoDB  
**Deployment:** Docker, Docker Compose, Kubernetes (Minikube)  
**Proxy:** Nginx with SSL/TLS support

## Features

- ✅ **Employee Management**: Create, read, update, and delete employee records
- ✅ **Database UI**: Mongo Express interface for direct database management
- ✅ **HTTPS Support**: SSL/TLS encryption for secure connections
- ✅ **Container Orchestration**: Docker Compose and Kubernetes deployment options
- ✅ **Network Segmentation**: Isolated networks for security
- ✅ **Persistent Storage**: Data persistence with Docker volumes

## Quick Start

For **complete deployment instructions on AWS EC2 Ubuntu**, see:
📋 **[COMPLETE-DEPLOYMENT-GUIDE.md](COMPLETE-DEPLOYMENT-GUIDE.md)**

### Local Development
```bash
git clone https://github.com/Stryker76/G22_Mern-App.git
cd G22_Mern-App
cp .env.example .env
npm run install:all
npm run dev
```

### Production Deployment (Docker Compose)
```bash
./deploy-docker.sh
```

### Kubernetes Deployment
```bash
./deploy-k8s.sh
```

## Access URLs

**Docker Compose:**
- Frontend: https://localhost:443
- Database UI: https://localhost:443/db/ (admin/g22)
- API: https://localhost:443/api

**Kubernetes:**
- Frontend: http://MINIKUBE_IP:32000
- Database UI: http://MINIKUBE_IP:30081 (admin/g22)
- API: http://MINIKUBE_IP:30080

## Architecture

### Container Architecture (Docker Compose)
- **Frontend Container**: React app with nginx server
- **Backend Container**: Node.js/Express API server  
- **Database Container**: MongoDB with persistent volume
- **Database UI Container**: Mongo Express for database management
- **Nginx Proxy**: HTTPS termination and reverse proxy

### Network Topology
- `frontend_net`: Frontend ↔ Nginx
- `backend_net`: Backend ↔ Frontend ↔ Nginx ↔ Mongo Express  
- `db_net`: Database ↔ Backend ↔ Mongo Express

## Documentation

- 📋 **[Complete Deployment Guide](COMPLETE-DEPLOYMENT-GUIDE.md)** - Start-to-finish AWS EC2 Ubuntu setup
- 📋 **[Deployment Guide](DEPLOYMENT-GUIDE.md)** - Original deployment documentation
- ✅ **[Demo Checklist](DEMO-CHECKLIST.md)** - Verification steps for marking
- 🧹 **[Cleanup Summary](CLEANUP-SUMMARY.md)** - Cleanup procedures

## Learning Resources

**FrontEnd**

* To learn React, check out the [React documentation](https://reactjs.org/).

* You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

* Get started with [Bootstrap](https://www.w3schools.com/bootstrap5/index.php), the world's most popular framework for building responsive, mobile-first websites.

**BackEnd**

* [Node.js Tutorial](https://www.w3schools.com/nodejs/default.asp)

* [ExpressJS Tutorial](https://www.tutorialspoint.com/expressjs/index.htm)

**Database**

* [MongoDB Tutorial](https://www.w3schools.com/mongodb/)

* Follow the [Get Started with MongoDB Atlas](https://www.mongodb.com/docs/atlas/getting-started/) guide to create an Atlas cluter, connecting to it, and loading your data.

**Fullstack**

* Learn all about the [MERN stack](https://www.mongodb.com/languages/mern-stack-tutorial) in this step-by-step guide on how to use it by developing a simple CRUD application from scratch.
