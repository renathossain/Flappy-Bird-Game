import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import cors from "cors";
import passport from 'passport'
import dotenv from "dotenv";
import { authRouter } from "./routers/auth_router.js";
import { userRouter } from "./routers/user_router.js";
import { lobbyRouter } from "./routers/lobby_router.js";
import { sequelize } from "./datasource.js";
import { Skin } from "./models/skins.js";
import { User, PurchasedSkins } from "./models/users.js";
import { Lobby, LobbyUser } from "./models/lobby.js";
import initializeSocket from "./socket.js";
import './oauth.js';
import { fileURLToPath } from 'url';
import path from "path";
import { skinRouter } from "./routers/skin_router.js";
import { stripeRouter } from "./routers/stripe_router.js";
import { purchaseRouter } from "./routers/purchase_router.js";


dotenv.config();

const PORT = 3000;

export const app = express();



// Serve static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL,
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

// Trust first proxy
app.set('trust proxy', 1);

// Function to start the server
const startServer = async () => {
  try {
    await sequelize.authenticate();
    await Skin.sync();
    await User.sync();
    await PurchasedSkins.sync();
    await Lobby.sync();
    await LobbyUser.sync();
    await sequelize.query('TRUNCATE TABLE "lobby_users" CASCADE');
    await sequelize.query('TRUNCATE TABLE "lobbies" CASCADE');
    await sequelize.sync({ alter: { drop: false } });
    console.log("Connection has been established successfully.");

    // Passport initialization
    app.use(passport.initialize());
    app.use(passport.session());
    
    //this fixes webhook
    app.use(
      bodyParser.json({
          verify: function(req, res, buf) {
              req.rawBody = buf;
          }
      })
    );
    
    app.use(bodyParser.json());
    //stripe router needs to bere
    app.use("/api/stripe", stripeRouter);
    // Routes
    app.use("/", authRouter);
    app.use("/", userRouter);
    app.use("/", lobbyRouter);
    app.use("/api/skin", skinRouter);
    
    app.use("/api/purchase", purchaseRouter);

    // Start server and initialize Socket.IO
    const server = app.listen(PORT, () => {
      console.log(`Backend server running on http://localhost:${PORT}`);
    });

    // Initialize Socket.IO
    initializeSocket(server);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

// Start the server
startServer();