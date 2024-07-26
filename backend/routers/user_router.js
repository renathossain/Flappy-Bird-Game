import { Router } from "express";
import { User } from "../models/users.js";

export const userRouter = Router();

userRouter.get('/api/user', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const userId = req.user.id;

      const user = await User.findOne({
        where: { id: userId }
      });

      if (user) {
        // Send the entire user record if found
        res.json({ user: user });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'An error occurred', error: error.message });
    }
  } else {
    res.json({ message: 'Not authenticated' });
  }
});