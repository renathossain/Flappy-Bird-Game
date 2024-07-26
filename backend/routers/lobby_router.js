import { Router } from "express";
import { User } from "../models/users.js";
import { Lobby, LobbyUser } from "../models/lobby.js";
import { isLoggedIn } from "../middleware/auth.js";

export const lobbyRouter = Router();

// Generate a unique 4-digit code for lobby
const generateUniqueCode = async () => {
  let code;
  do {
    code = Math.floor(1000 + Math.random() * 9000);
  } while (await Lobby.findOne({ where: { id: code } }));
  return code;
};

// Create a lobby
lobbyRouter.post('/api/lobby', isLoggedIn, async (req, res) => {
  try {
    const { userId } = req.body;

    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Check if user already has a lobby
    const existingLobby = await Lobby.findOne({ where: { userId } });
    if (existingLobby) {
      return res.status(200).json({
        lobbyId: existingLobby.id,
      });
    }

    // Generate a unique 4-digit code
    const uniqueCode = await generateUniqueCode();

    // Create a new lobby with a unique 4-digit code
    const newLobby = await Lobby.create({ id: uniqueCode, userId, socketId: "" });

    // Respond with the details of the created lobby
    res.status(201).json({
      lobbyId: newLobby.id,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error creating lobby."
    });
  }
});

// Join a lobby
lobbyRouter.post('/api/lobby/join', isLoggedIn, async (req, res) => {
  const { userId, lobbyId } = req.body;

  try {
    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Find the lobby by code
    const lobby = await Lobby.findOne({ where: { id: lobbyId } });
    if (!lobby) {
      return res.status(404).json({ error: "Lobby not found." });
    }

    // Check if the lobby is full
    const userCount = await LobbyUser.count({ where: { lobbyId: lobby.id } });
    if (userCount >= 4) {
      return res.status(403).json({ error: "Lobby is full." });
    }

    // Check if the user is already in the lobby
    const existingMembership = await LobbyUser.findOne({
      where: { userId, lobbyId: lobby.id }
    });
    if (existingMembership) {
      return res.status(200).json({ success: "User is already in the lobby." });
    }

    // Add user to the lobby
    await LobbyUser.create({ userId, lobbyId: lobby.id, socketId: "" });

    res.status(201).json({ success: "User joined the lobby successfully." });
  } catch (error) {
    res.status(500).json({
      error: "Error joining lobby."
    });
  }
});
