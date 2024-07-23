import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";
import { User } from "./users.js";

// Function to generate a unique 4-digit code
const generateUniqueCode = () => {
  let code;
  do {
    code = Math.floor(1000 + Math.random() * 9000);
  } while (Lobby.findOne({ where: { code } }));
  return code;
};

export const Lobby = sequelize.define("lobbies", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  code: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    defaultValue: generateUniqueCode,
  }
});

// LobbyUser model (junction table)
export const LobbyUser = sequelize.define("lobby_users", {
  lobbyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Lobby,
      key: 'id',
    },
    primaryKey: true,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
    primaryKey: true,
  },
});

// Establish relationships
Lobby.belongsToMany(User, { through: LobbyUser, foreignKey: 'lobbyId' });
User.belongsToMany(Lobby, { through: LobbyUser, foreignKey: 'userId' });