Postgre Server:
  - `sudo pacman -S postgresql`
  - `sudo pipx install pgadmin4` -- GUI interface
  - `sudo -u postgres psql` - Start interactive Database
  - `sudo -iu postgres` -- Switch to postgres user, `exit` to exit
  - `initdb -D /var/lib/postgres/data` -- initialize postgres
  - `createuser --interactive` -- to create user
  - `createdb flappy` -- to create database
  - `pg_ctl -D /var/lib/postgres/data -l logfile start` -- start the database within the user session
  - `exit` - to exit the user
  - `sudo systemctl start postgresql.service` - start the postgre service(to run always in the background)
  - `sudo systemctl enable postgresql.service` - enable the postgre service (to run always in the background)

Backend Create:
  - `mkdir backend && cd backend`
  - `npm init`
  - `npm install eslint prettier socket.io --save-dev`
  - `npm install --save-dev jest supertest`
  - `npm install --save-dev babel-jest @babel/core @babel/preset-env`

Backend Run:
  - Add `"type": "module",` to `package.json`
  - `npx nodemon server.js`
  - Or add `"dev": "npx nodemon server.js"` to `package.json`
  - `npm run dev`
  - `npm test` for testing backend
  - Kill process: `lsof -i :3000`, `kill -9 <PID>`

Frontend Svelte Setup Project:
  - `npm init vite` and selecting the svelte option
Frontend Svelte Project Install Dependencies:
  - `cd frontend`
  - `npm install`
  - `npm i eslint prettier svelte-konva konva socket.io-client --save-dev`
Frontend Svelte Run Project:
  - `cd frontend`
  - `npm run dev`