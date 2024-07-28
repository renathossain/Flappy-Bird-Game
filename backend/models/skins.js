import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";

// Skin model
export const Skin = sequelize.define("skins", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  imageMetadata: {
    type: DataTypes.JSON,
    allowNull: true,
  },
});

const generateSkinsData = (id, price) => {
  return {
    id: id,
    price: price,
    imageMetadata: {
      "filename": `${id}.png`,
      "originalname": `${id}.png`,
      "mimetype": "image/png",
      "path": `/assets/flappies/${id}.png`,
    },
  }
};

// Ensure the skins table has predefined skins 1, 2, 3
Skin.afterSync(async () => {
  const skins = []
  const totalSkin = 20;
  for (let i = 1; i <= 4; i++) {
    skins.push(generateSkinsData(i, 0));
  }
  for (let i = 5; i <= totalSkin - 5; i++) {
    skins.push(generateSkinsData(i, 1));
  }
  for (let i = totalSkin - 4; i <= totalSkin; i++) {
    skins.push(generateSkinsData(i, 2));
  }

  for (const skin of skins) {
    await Skin.findOrCreate({
      where: { id: skin.id },
      defaults: {
        price: skin.price,
        imageMetadata: skin.imageMetadata,
      }
    });
  }
});



