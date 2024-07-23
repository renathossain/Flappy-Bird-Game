import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";

// Skin model
export const Skin = sequelize.define("skins", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  }
});

// Ensure the skins table has predefined skins 1, 2, 3
Skin.afterSync(async () => {
  await Skin.findOrCreate({ where: { id: 1 } });
  await Skin.findOrCreate({ where: { id: 2 } });
  await Skin.findOrCreate({ where: { id: 3 } });
});