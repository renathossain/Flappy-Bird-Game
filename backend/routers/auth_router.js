import { User } from "../models/users.js";
import { Router } from "express";

export const authRouter = Router();

authRouter.post("/register", async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
);