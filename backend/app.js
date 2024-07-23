import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import cors from "cors";
import passport from 'passport'
import dotenv from "dotenv";
import { authRouter } from "./routers/auth_router.js";
import { userRouter } from "./routers/user_router.js";
import { sequelize } from "./datasource.js";
import { Skin } from "./models/skins.js";
import { User, PurchasedSkins } from "./models/users.js";
import { Lobby, LobbyUser } from "./models/lobby.js";
import initializeSocket from "./socket.js";
import './oauth.js';
dotenv.config();

const PORT = 3000;

export const app = express();

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
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
  })
);

// Sequelize database connection
try {
  await sequelize.authenticate();
  await Skin.sync();
  await User.sync();
  await PurchasedSkins.sync();
  await Lobby.sync();
  await LobbyUser.sync();
  await sequelize.sync({ alter: { drop: false } });
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/", authRouter);
app.use("/", userRouter);

// Socket.IO integration with express
const server = app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

// Initialize Socket.IO
initializeSocket(server);