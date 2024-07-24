import { Router } from "express";
import { User } from "../models/users.js";
import { Lobby, LobbyUser } from "../models/lobby.js";
import { isLoggedIn } from "../middleware/auth.js";

export const lobbyRouter = Router();

// Generate a unique 4-digit code
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
    // A user owns the lobby
    const { userId } = req.body;

    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user already has a lobby
    const existingLobby = await Lobby.findOne({ where: { userId } });
    if (existingLobby) {
      return res.status(400).json({ message: "User already has a lobby" });
    }

    // Generate a unique 4-digit code
    const uniqueCode = await generateUniqueCode();

    // Create a new lobby with a unique 4-digit code
    const newLobby = await Lobby.create({ id: uniqueCode, userId });

    // Respond with the details of the created lobby
    res.status(201).json({
      id: newLobby.id,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating lobby",
      error: error.message
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
      return res.status(404).json({ message: "User not found" });
    }

    // Find the lobby by code
    const lobby = await Lobby.findOne({ where: { id: lobbyId } });
    if (!lobby) {
      return res.status(404).json({ message: "Lobby not found" });
    }

    // Check if the lobby is full
    const userCount = await LobbyUser.count({ where: { lobbyId: lobby.id } });
    if (userCount >= 4) {
      return res.status(403).json({ message: "Lobby is full" });
    }

    // Check if the user is already in the lobby
    const existingMembership = await LobbyUser.findOne({
      where: { userId, lobbyId: lobby.id }
    });
    if (existingMembership) {
      return res.status(400).json({ message: "User is already in the lobby" });
    }

    // Add user to the lobby
    await LobbyUser.create({ userId, lobbyId: lobby.id });

    res.status(200).json({ message: "User joined the lobby successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error joining lobby",
      error: error.message
    });
  }
});

// Leave a lobby
lobbyRouter.delete('/api/lobby/leave', isLoggedIn, async (req, res) => {
  const { userId, lobbyId } = req.body;

  try {
    const user = await User.findByPk(userId);
    const lobby = await Lobby.findByPk(lobbyId);

    // Check if user and lobby exists
    if (!user || !lobby) {
      return res.status(404).json({ message: "User or Lobby not found" });
    }

    // Remove the user from the lobby
    await LobbyUser.destroy({
      where: { userId, lobbyId }
    });

    res.status(200).json({ message: "User left the lobby successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error leaving lobby",
      error: error.message
    });
  }
});

// Delete a lobby
lobbyRouter.delete('/api/lobby', isLoggedIn, async (req, res) => {
  const { lobbyId } = req.body;

  try {
    const lobby = await Lobby.findByPk(lobbyId);

    // Check if lobby exists
    if (!lobby) {
      return res.status(404).json({ message: "Lobby not found" });
    }

    // Clear users from the lobby
    await LobbyUser.destroy({ where: { lobbyId } });

    // Delete the lobby
    await Lobby.destroy({ where: { id: lobbyId } });

    res.status(200).json({ message: "Lobby deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting lobby",
      error: error.message
    });
  }
});