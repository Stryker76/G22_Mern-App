# G22 MERN App

A full-stack [MERN](https://www.mongodb.com/mern-stack) application for managing information of employees.

## About the project

This is a full-stack MERN application that manages the basic information of employees. The app uses an employee database from MongoDB and displays it using a React frontend.

## Tech Stack

**Client:** React, Bootstrap

**Server:** NodeJS, ExpressJS

**Database:** MongoDB

## Run locally

### Quick Start (Development)
```bash
git clone https://github.com/Stryker76/G22_Mern-App.git
cd G22_Mern-App
npm run install:all
cp .env.example .env
npm run dev
```

### Expected URLs (Development)
* API: [http://localhost:5000](http://localhost:5000) or whatever `PORT` in `.env`
* Frontend: [http://localhost:3000](http://localhost:3000)

### Docker Compose Deployment
```bash
# Deploy with Docker Compose (includes database UI)
./deploy-docker.sh

# Or manually:
docker-compose up --build -d
```

**Access URLs (Docker Compose):**
* **Frontend**: https://localhost:443
* **Database UI**: https://localhost:443/db/ (admin/g22)
* **API**: https://localhost:443/api

### Kubernetes Deployment
```bash
# Deploy with Kubernetes
./deploy-k8s.sh

# Or manually:
kubectl apply -f infra/k8s/
```

**Access URLs (Kubernetes):**
* **Frontend**: http://localhost:32000
* **Database UI**: http://localhost:30081 (admin/g22)
* **API**: http://localhost:30080

📋 **For detailed deployment instructions, see [DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md)**

## Features in the project

- The user can **create** the information of a employee, and managing it.

- **Displaying** the information of employees, including the name, position, and level of the employee.

- Includes **Update** and **Delete** actions.

## Learn More

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
