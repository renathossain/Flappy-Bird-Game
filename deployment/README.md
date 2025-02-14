# DEPLOYMENT (UBUNTU)

- `sudo apt update && sudo apt upgrade -y` (Takes at least 15 min on e2-micro)
- `sudo apt install -y curl git nginx postgresql postgresql-contrib certbot python3-certbot-nginx`
- `git clone https://github.com/UTSC-CSCC09-Programming-on-the-Web/project-overreact-native.git`
- PostgreSQL Setup:
- `sudo -u postgres psql` to get inside the postgres user to set password
- `\password` to set a password
- `psql -U postgres -h localhost` - launch postgres normally
- `CREATE USER flappy_user;` - create special user for backend access
- `\password flappy_user` - set password
- `CREATE DATABASE flappy;` - create database
- `GRANT ALL PRIVILEGES ON DATABASE flappy TO flappy_user;` - grant permissions for flappy_user
- `\c flappy;` - switch to flappy before granting permissions to public
- `GRANT USAGE ON SCHEMA public TO flappy_user;`
- `GRANT CREATE ON SCHEMA public TO flappy_user;`
- `GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO flappy_user;`
- `GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO flappy_user;`
- `GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO flappy_user;`
- `psql -U flappy_user -h localhost -d flappy` - Login to flappy_user and open flappy database
- Install NVM (Node Version Manager): https://github.com/nvm-sh/nvm
- `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash`
- Install Node and NPM:
- `nvm install --lts`
- Backend Setup:
- `cd backend`
- `npm install`
- `npm install -g pm2`
- `pm2 start app.js --name backend`
- `pm2 list` - verify its running
- `pm2 startup systemd` - generate command to make it run on startup
- `pm2 restart backend`
- Frontend Setup:
- `cd frontend`
- `npm install`
- `npm run build`
- `cd deployment/nginx`
- `sudo rm /etc/nginx/sites-enabled/default`
- `sudo cp flappy-bird-game /etc/nginx/sites-available/`
- `sudo ln -s /etc/nginx/sites-available/flappy-bird-game /etc/nginx/sites-enabled/`
- `sudo nginx -t`
- `sudo systemctl restart nginx`
- Obtain Let's Encrypt Certificate for HTTS:
- `sudo certbot --nginx`
- Access the website on: http://http://34.121.49.238/ (Note: http without s)

# Update the server with new changes
- `./update-server.sh`
- `pm2 logs backend` - Check status of backend