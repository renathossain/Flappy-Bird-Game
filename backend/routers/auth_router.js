import { User } from "../models/users.js";
import { Router } from "express";
import passport from 'passport'
// import "../auth.js";

export const authRouter = Router();

// authRouter.post("/register", async (req, res) => {
//     try {
//         const user = await User.create(req.body);
//         res.status(201).json(user);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// }
// );


authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

authRouter.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    function (req, res) {
        res.redirect('http://localhost:5173/game');
    });


