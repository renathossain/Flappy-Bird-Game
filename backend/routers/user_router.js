import { Router } from "express";
import { ensureAuth } from "../middleware/auth.js";

export const userRouter = Router();

userRouter.get('/api/user', ensureAuth, (req, res) => {
  const user = req.user;
  const userInfo = {
    id: user.id,
    email: user.emails[0].value,
    displayName: user.displayName,
    familyName: user.name.familyName,
    givenName: user.name.givenName,
    photo: user.photos[0].value
  };

  // Send user info if authenticated
  if (req.isAuthenticated()) {
    res.json({ registered: true, user: userInfo });
  } else {
    res.json({ registered: false });
  }
});