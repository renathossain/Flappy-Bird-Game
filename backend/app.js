import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import cors from "cors";
import { sequelize } from "./datasource.js";
import passport from 'passport'

const PORT = 3000;
export const app = express();
app.use(bodyParser.json());


const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
  };

  app.use(cors(corsOptions));

  try{
    await sequelize.authenticate();
    await sequelize.sync({ alter: { drop: false } });
    console.log("Connection has been established successfully.");
  }catch (error){
    console.error("Unable to connect to the database:", error);
  }
  app.use(
    session({
      secret: process.env.SECRET_KEY || "test",
      resave: false,
      saveUninitialized: true,
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  //app.use("/api/auth", authRouter);

  app.listen(PORT, (err) => {
    if (err) console.log(err);
    else console.log("HTTP server on http://localhost:%s", PORT);
  });