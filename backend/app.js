import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { sequelize } from "./datasource.js";
import passport from 'passport'
import dotenv from "dotenv";
import './auth.js';

import { authRouter } from "./routers/auth_router.js";

const PORT = 3000;
export const app = express();

dotenv.config();

// Middleware
app.use(bodyParser.json());

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));

// Session setup
app.use(
  session({
    secret: process.env.SECRET_KEY || "test",
    resave: false,
    saveUninitialized: true,
  })
);

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Sequelize database connection
try {
  await sequelize.authenticate();
  await sequelize.sync({ alter: { drop: false } });
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

// Routes
app.use("/auth", authRouter);

// HTTP server setup
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow all origins (for development purposes)
    methods: ["GET", "POST"], // Allow only GET and POST requests
  },
  transports: ['websocket', 'polling'], // Allow WebSocket and HTTP polling transport
  allowEIO3: true, // Allow connections from clients using EIO 3
});

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on("jump", (username) => {
    io.emit(`jump-${username}`);
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Start the HTTP server
httpServer.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
