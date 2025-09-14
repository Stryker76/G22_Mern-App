# Repository Cleanup Summary

This repository has been cleaned up and standardized according to the provided requirements.

## Changes Made

### ✅ Frontend Consolidation
- **Removed** `client/` directory (duplicate frontend)
- **Kept** `frontend/` directory (referenced by docker-compose.yml)
- Updated all references to point to the active frontend

### ✅ Root Package.json Created
- Added standardized scripts: `install:all`, `dev`, `build`, `start`, `lint`, `format`
- Added required dependencies: `concurrently`, `prettier`, `eslint`
- Scripts now point to `frontend/` and `server/` directories

### ✅ Server & Frontend Scripts Standardized
- **Server**: Added `dev` script with nodemon, `build` script, kept `start` script
- **Frontend**: Added `dev` script, kept existing `build` and `start` scripts
- Both configured for proper local development

### ✅ README.md Updated
- Updated repository references to `Stryker76/G22_Mern-App`
- Replaced old installation instructions with standardized commands
- Removed external template links and live demo references
- Added correct local development URLs

### ✅ Environment Variables Standardized
- Updated `.env.example` with standard MERN variables:
  - `MONGO_URI`, `JWT_SECRET`, `PORT`, `NODE_ENV`, `CLIENT_URL`
  - Kept Docker-specific variables for compose compatibility

### ✅ Infrastructure Cleanup
- Moved unused `k8s/` and `scripts/` to `infra/` directory  
- Kept `nginx/` as it's referenced by docker-compose.yml
- Removed empty `mern-app/` directory

### ✅ Code Quality Setup
- Added `.prettierrc` with standard formatting rules
- Added `.eslintignore` to exclude build/infra directories
- No cruft files found (already clean)

## How to Use (requires Node.js/npm)

```bash
# Install all dependencies
npm run install:all

# Start development (both server and frontend)
npm run dev

# Build the application
npm run build

# Start production server
npm start
```

## Expected URLs
- **API**: http://localhost:5000
- **Frontend**: http://localhost:3000

## Note
This cleanup was performed without Node.js/npm available, so the actual build/run validation could not be completed. The scripts are configured correctly based on the existing package.json files and should work once Node.js is installed.

## Infra Directory
Optional deployment files are now organized under `infra/`:
- `infra/k8s/` - Kubernetes deployment files
- `infra/scripts/` - Deployment and certificate generation scripts

These are not required for local development but kept for deployment scenarios.