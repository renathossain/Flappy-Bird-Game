import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";
import { User } from "./users.js";

export const Lobby = sequelize.define("lobbies", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: false,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
    unique: true,
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
  // Participants of the lobby
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