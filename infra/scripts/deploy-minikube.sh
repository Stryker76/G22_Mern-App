#!/usr/bin/env bash
set -euo pipefail
eval $(minikube -p minikube docker-env)
docker build -t backend:1.0 server
docker build -t mern-app:latest frontend
eval $(minikube -p minikube docker-env -u)
kubectl apply -f mern-app/k8s
kubectl rollout status deploy/mongo --timeout=120s || true
kubectl rollout status deploy/backend --timeout=120s || true
kubectl rollout status deploy/frontend-deployment --timeout=120s || true
kubectl rollout status deploy/mongo-express --timeout=120s || true
kubectl rollout status deploy/nginx-proxy --timeout=120s || true
IP=$(minikube ip)
echo "HTTP  : http://$IP:30080"
echo "HTTPS : https://$IP:30443"
echo "API   : https://$IP:30443/api/ping"
echo "DB UI : https://$IP:30443/db/"
