import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";

// Skin model
export const Skin = sequelize.define("skins", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  price : {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  imageMetadata: {
    type: DataTypes.JSON,
    allowNull: true,
  },
});

// Ensure the skins table has predefined skins 1, 2, 3
Skin.afterSync(async () => {

  await Skin.findOrCreate({ where: { id: 1 },
  defaults: {
    price: 0,
    imageMetadata: {
      "filename": "1.png",
      "originalname": "1.png",
      "mimetype": "image/png",
      "path": "/assets/flappies/1.png",
    },
  },
  });

    await Skin.findOrCreate({ where: { id: 2 },
    defaults: {
      price: 0,
      imageMetadata: {
        "filename": "2.png",
        "originalname": "2.png",
        "mimetype": "image/png",
        "path": "/assets/flappies/2.png",
      },
    },
    });


    await Skin.findOrCreate({ where: { id: 3 },
      defaults: {
        price: 0,
        imageMetadata: {
          "filename": "3.png",
          "originalname": "3.png",
          "mimetype": "image/png",
          "path": "/assets/flappies/3.png",
        },
      }
    });
});



      