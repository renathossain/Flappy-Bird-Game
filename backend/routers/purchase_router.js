import {Router} from "express";
import {PurchasedSkins, User} from "../models/users.js";
import {Skin} from "../models/skins.js";

export const purchaseRouter = Router();

// purchaseRouter.post("/", async (req, res) => {
//     try{
//         const user = await User.findByPk(req.body.UserId);
//         if (!user) {
//         return res.status(404).json({ error: "No user found" });
//         }
//         const skin = await Skin.findByPk(req.body.SkinId);
//         if (!skin){
//             return res.status(404).json({ error: "No skin found" });
//         }
//         const purchasedSkins = await PurchasedSkins.create({
//             UserId: req.body.UserId,
//             SkinId: req.body.SkinId,
//         });
//         return res.json({ purchasedSkins})
//     }catch(error){
//         if (error.name === "SequelizeForeignKeyConstraintError") {
//             return res.status(422).json({ error: "Invalid purchasedSkins id" });
//           } else if (error.name === "SequelizeValidationError") {
//             return res.status(422).json({
//               error: "Invalid input parameters. Expected UserId and SkinId",
//             });
//           } else {
//             return res.status(400).json({ error: "Cannot create purchasedSkins" });
//           }
//     }
// });

purchaseRouter.get("/", async (req, res) => {
  const userId = req.query.userId;
    try{
      const purchasedSkins = await PurchasedSkins.findAll({
          where: {
              userId: userId,
          },
          attributes: ['skinId'],
        });
        if(purchasedSkins){
          const skinIds = purchasedSkins.map(skin => skin.skinId);
          return res.json({ purchasedSkins: skinIds });
        }else{
            return res.json(null);
        }
    }catch(error){
        return res.status(400).json({ error: error.message });
    }
});