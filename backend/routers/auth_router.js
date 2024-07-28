import { Router } from "express";
import passport from 'passport'
import dotenv from "dotenv";

dotenv.config();

export const authRouter = Router();

authRouter.get('/api/auth/google', passport.authenticate('google', {
	scope: ['profile', 'email']
}));

authRouter.get('/api/auth/google/callback',
	passport.authenticate('google', {
		successRedirect: process.env.FRONTEND_URL,
		failureRedirect: process.env.FRONTEND_URL,
	})
);

authRouter.get('/api/auth/logout', (req, res) => {
	req.logout(() => {
		req.session.destroy(() => {
			res.redirect(process.env.FRONTEND_URL);
		});
	});
});
