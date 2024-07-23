import { Router } from "express";

export const userRouter = Router();

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

userRouter.get('/user/profile', isLoggedIn, (req, res) => {
  const user = req.user;
  const userInfo = {
    id: user.id,
    email: user.emails[0].value,
    displayName: user.displayName,
    familyName: user.name.familyName,
    givenName: user.name.givenName,
    photo: user.photos[0].value
  };
  res.json(userInfo);
});