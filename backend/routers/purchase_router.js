import { Router } from "express";
import { PurchasedSkins } from "../models/users.js";

export const purchaseRouter = Router();

//can delete later maybe
purchaseRouter.get("/", async (req, res) => {
  const userId = req.query.userId;
  try {
    const purchasedSkins = await PurchasedSkins.findAll({
      where: {
        userId: userId,
      },
      attributes: ['skinId'],
    });
    if (purchasedSkins) {
      const skinIds = purchasedSkins.map(skin => skin.skinId);
      return res.json({ purchasedSkins: skinIds });
    } else {
      return res.json(null);
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});