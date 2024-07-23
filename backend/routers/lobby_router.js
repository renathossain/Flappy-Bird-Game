import { Router } from "express";
import { User } from "../models/users.js";
import { Lobby, LobbyUser } from "../models/lobby.js";

export const lobbyRouter = Router();

lobbyRouter.post('/api/lobby', async (req, res) => {
  try {
    // Create a new lobby with a unique 4-digit code
    const newLobby = await Lobby.create();

    // Respond with the details of the created lobby
    res.status(201).json({
      id: newLobby.id,
      code: newLobby.code,
    });
  } catch (error) {
    console.error("Error creating lobby:", error.message);
    res.status(500).json({
      message: "Error creating lobby",
      error: error.message
    });
  }
});

// Join a lobby
lobbyRouter.post('/api/lobby/join', async (req, res) => {
  const { userId, code } = req.body;

  try {
    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the lobby by code
    const lobby = await Lobby.findOne({ where: { code } });
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
    console.error("Error joining lobby:", error.message);
    res.status(500).json({
      message: "Error joining lobby",
      error: error.message
    });
  }
});

// Leave a lobby
lobbyRouter.post('/api/lobby/leave', async (req, res) => {
  const { userId, lobbyId } = req.body;

  try {
    const user = await User.findByPk(userId);
    const lobby = await Lobby.findByPk(lobbyId);

    if (!user || !lobby) {
      return res.status(404).json({ message: "User or Lobby not found" });
    }

    await LobbyUser.destroy({
      where: { userId, lobbyId }
    });

    res.status(200).json({ message: "User left the lobby successfully" });
  } catch (error) {
    console.error("Error leaving lobby:", error.message);
    res.status(500).json({
      message: "Error leaving lobby",
      error: error.message
    });
  }
});