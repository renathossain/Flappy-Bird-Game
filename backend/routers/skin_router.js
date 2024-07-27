import { Router } from "express";
import multer from "multer";
import path from "path";
import { Skin } from "../models/skins.js";
import { Op } from "sequelize";


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
        const {cursor, limit, action} = req.query;
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