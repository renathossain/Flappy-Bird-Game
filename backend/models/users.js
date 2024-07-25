import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";
import { Skin } from "./skins.js";

export const User = sequelize.define("users", {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  displayName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  familyName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  givenName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  photo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  currentSkin: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Skin,
      key: 'id',
    }
  }
});

// UserSkin model (junction table)
export const PurchasedSkins = sequelize.define("purchased_skins", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    },
    primaryKey: true,
  },
  skinId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: Skin,
      key: 'id'
    },
    primaryKey: true,
  }
});

// Establish relationships
User.belongsToMany(Skin, { through: PurchasedSkins, foreignKey: 'userId' });
Skin.belongsToMany(User, { through: PurchasedSkins, foreignKey: 'skinId' });