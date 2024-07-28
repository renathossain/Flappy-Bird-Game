import { Router } from "express";
import multer from "multer";
import path from "path";
import { Skin } from "../models/skins.js";
import { Op } from "sequelize";
import { PurchasedSkins } from "../models/users.js";
import { User } from "../models/users.js";


const upload = multer({ dest: "uploads/" });

export const skinRouter = Router();

//this is for testing purposes only
skinRouter.post("/:id", upload.single("picture"), async (req, res, next) => {
    try{
        const maxId = await Skin.max('id');
        const nextId = maxId ? maxId+1: 1;
        const skin = await Skin.create({
            id: nextId,
            price: req.body.price,
            imageMetadata: req.file,    
        })
    }catch(error){
        if(error.name === "SequelizeForeignKeyConstraintError"){
            return res.status(422).json({ error: "Invalid skin id" });
        }else if (error.name === "SequelizeValidationError"){
            return res.status(422).json({
                error:
                  "Invalid input parameters. Expected id, price and imageMetadata",
              });
        }else{
            return res.status(500).json({ error: error.message  });
        }
    }
});

//this is for testing purposes only
skinRouter.get("/all", async (req, res, next) => {
    try{
        const skins = await Skin.findAll();

        const skinData = skins.map(skin => ({
                id: skin.id,
                price: skin.price,
                imageMetadata: {
                    mimetype: skin.imageMetadata.mimetype,
                    path: skin.imageMetadata.path,
            }
        }));
        return res.json({ data: skinData });
    }catch(err){
        return res.status(400).json({ error: err.message });
    }
}
);

skinRouter.get("/", async (req, res, next) => {
    try{
        const {cursor, limit, action, userId} = req.query;
        let skins;
        let prevCursor;
        let nextCursor;
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
        });
    }catch(err){
        return res.status(400).json({ error: err.message });
    }
})