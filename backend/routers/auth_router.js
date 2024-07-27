import { Router } from "express";
import passport from 'passport'

dotenv.config();

export const authRouter = Router();

authRouter.get('/auth/google', passport.authenticate('google', {
	scope: ['profile', 'email']
}));

authRouter.get('/auth/google/callback',
	passport.authenticate('google', {
		successRedirect: process.env.FRONTEND_URL,
		failureRedirect: process.env.FRONTEND_URL,
	})
);

authRouter.get('/auth/logout', (req, res) => {
	req.logout(() => {
		req.session.destroy(() => {
			res.redirect(process.env.FRONTEND_URL);
		});
	});
});
