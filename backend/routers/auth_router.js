import { Router } from "express";
import passport from 'passport'

export const authRouter = Router();

authRouter.get('/auth/google', passport.authenticate('google', {
	scope: ['profile', 'email']
}));

authRouter.get('/auth/google/callback',
	passport.authenticate('google', {
		successRedirect: 'http://localhost:5173/',
		failureRedirect: 'http://localhost:5173/'
	})
);

authRouter.get('/auth/logout', (req, res) => {
	req.logout(() => {
		req.session.destroy(() => {
			res.redirect('http://localhost:5173/');
		});
	});
});
