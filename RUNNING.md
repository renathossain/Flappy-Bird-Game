Backend Create:
  - `mkdir backend && cd backend`
  - `npm init`
  - `npm install eslint prettier socket.io --save-dev`
Backend Run:
  - Add `"type": "module",` to `package.json`
  - `npx nodemon server.js`
  - Or add `"dev": "npx nodemon server.js"` to `package.json`
  - `npm run dev`

Frontend Svelte Setup Project:
  - `npm init vite` and selecting the svelte option
Frontend Svelte Project Install Dependencies:
  - `cd frontend`
  - `npm install`
  - `npm i eslint prettier svelte-konva konva socket.io-client --save-dev`
Frontend Svelte Run Project:
  - `cd frontend`
  - `npm run dev`