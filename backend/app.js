import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import cors from "cors";
import { Server } from "socket.io";
import { sequelize } from "./datasource.js";
import passport from 'passport'
import dotenv from "dotenv";
import { authRouter } from "./routers/auth_router.js";
import './auth.js';
dotenv.config();

const PORT = 3000;

export const app = express();

// Middleware
function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

app.use(bodyParser.json());

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));

// Session setup
app.use(
  session({
    secret: process.env.SECRET_KEY,
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
app.use("/", authRouter);

app.get('/protected', isLoggedIn, (req, res) => {
  res.send(`Hello ${req.user.displayName}`);
});

// Socket.IO integration with express
const server = app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

const io = new Server(server, {
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
