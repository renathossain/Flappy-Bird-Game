import { Router } from "express";
import { Skin } from "../models/skins.js";
import { Op } from "sequelize";
import { PurchasedSkins } from "../models/users.js";
import { User } from "../models/users.js";
import { isLoggedIn } from "../middleware/auth.js";


export const skinRouter = Router();

// isLoggedin added - testing required
skinRouter.get("/", async (req, res, next) => {
    try{
        const {cursor, limit, action, userId} = req.query;
        let skins;
        let prevCursor;
        let nextCursor;
        let currentSkinId;
        if(cursor !== null && action === "prev"){
            skins = await Skin.findAll({
                where:{
                    id: {[Op.lt]: parseInt(cursor)},
                },
                limit: parseInt(limit) || 5,
                order: [["id", "DESC"]],
            });
            
            prevCursor = skins.length ? skins[skins.length - 1]["id"] : null;
            nextCursor = skins.length ? skins[0]["id"] : null;
            skins = skins.reverse();
        }else if(cursor !== null && action === "next"){
            skins = await Skin.findAll({
                where:{
                    id:{[Op.gt]: parseInt(cursor)},
                },
                limit: parseInt(limit) || 5,
                order:[["id", "ASC"]],
            });
            prevCursor = skins.length ? skins[0]["id"] : null;
            nextCursor = skins.length ? skins[skins.length - 1]["id"] : null;
        }else{
            skins = await Skin.findAll({
                limit: parseInt(limit) || 5,
                order: [["id", "ASC"]],
            });
            prevCursor = skins.length ? skins[0]["id"] : null;
            nextCursor = skins.length ? skins[skins.length - 1]["id"] : null;
        }

        if (userId){
            const user = await User.findOne({
                where: { id: userId }
              });
              if(user){
                currentSkinId = user.currentSkin; 
                const purchasedSkins = await PurchasedSkins.findAll({
                    where: {
                        userId: userId,
                    }
                });
                const purchasedSkinIds = purchasedSkins.map(purchasedSkin => purchasedSkin.skinId);
                skins = skins.map(skin => ({
                    ...skin.dataValues,
                    purchased: purchasedSkinIds.includes(skin.id),
                }))
              }else{
                skins = skins.map(skin => ({
                    ...skin.dataValues,
                    purchased: false,
                }))
              }
        }else{
            skins = skins.map(skin => ({
                ...skin.dataValues,
                purchased: false,
            }))
        }   
        return res.json({
            data: skins,
            next: nextCursor,
            prev: prevCursor,
            total: skins.length,
            currentSkin: currentSkinId,
        });
    }catch(err){
        return res.status(400).json({ error: err.message });
    }
});

skinRouter.patch("/change", async (req, res, next) => {
    const userId = req.body.userId;
    const skinId = req.body.skinId;
    try{
        const user = await User.findOne({
            where: { id: userId }
        });
        if (!user){
            return res.status(404).json({ error: "User not found." });
        }
        const purchasedSkin = await PurchasedSkins.findOne({
            where: {
                userId: userId,
                skinId: skinId,
            }
        });
        if (!purchasedSkin){
            return res.status(404).json({ error: "Skin not purchased." });
        }
        user.currentSkin = skinId;
        await user.save();
        return res.status(200).json({ message: "Skin changed successfully." });
    }catch(err){
        return res.status(400).json({ error: err.message });
    }

});



//get users current skin if exists
skinRouter.get("/:id", async (req, res, next) => {
    try {
        const userId = req.params.id;
        const user = await User.findOne({
            where: { id: userId },
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.json({
            currentSkin: user.currentSkin,
        });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
}
);
