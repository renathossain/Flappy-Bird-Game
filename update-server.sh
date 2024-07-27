#!/bin/bash

# Rebuild the frontend
cd frontend
npm install
npm run build
cd ..

# Restart the backend
cd backend
npm install
cd ..
pm2 restart backend

# Update the nginx config
sudo cp deployment/nginx/flappy-bird-game /etc/nginx/sites-available/
sudo nginx -t
sudo systemctl restart nginx