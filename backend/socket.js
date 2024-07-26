import { Server } from "socket.io";
import { User } from "./models/users.js";
import { Lobby, LobbyUser } from "./models/lobby.js";

// Fetch all players of the lobby
const getLobbyPlayers = async (lobbyId) => {
  try {
    const players = await LobbyUser.findAll({
      where: { lobbyId },
      include: { model: User, attributes: ['id', 'givenName', 'currentSkin'] }
    });

    return players.map(player => ({
      userId: player.userId,
      givenName: player.user.givenName,
      currentSkin: player.user.currentSkin,
      socketId: player.socketId
    }));
  } catch (error) {
    console.error("Error fetching lobby players:", error);
    throw error;
  }
};

export default function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*", // Allow all origins (for development purposes)
      methods: ["GET", "POST"], // Allow only GET and POST requests
    },
    transports: ['websocket', 'polling'], // Allow WebSocket and HTTP polling transport
    allowEIO3: true, // Allow connections from clients using EIO 3
  });

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on("lobby-create", async (data) => {
      try {
        const { userId, lobbyId } = data;

        // Check if user already has a lobby
        const existingLobby = await Lobby.findOne({ where: { id: lobbyId, userId } });
        if (existingLobby) {
          // Update the socketId with the new socket.id
          await existingLobby.update({ socketId: socket.id });

          // Fetch all players in the existing lobby
          const players = await getLobbyPlayers(existingLobby.id);

          // Emit `send-lobby-socket` event to each player in the lobby
          players.forEach(player => {
            io.to(player.socketId).emit('send-lobby-socket', existingLobby.socketId);
          });

          socket.emit(`lobby-send-code`, existingLobby.id);
          socket.emit(`lobby-send-players`, await getLobbyPlayers(existingLobby.id));
          console.log(`Lobby found: ${existingLobby.id}`);
          return;
        }
      } catch (error) {
        console.error("Error creating lobby:", error);
        socket.emit("lobby-error", { message: "Error creating lobby" });
      }
    });

    socket.on("lobby-join", async (data) => {
      try {
        const { userId, lobbyId } = data;

        // Check if lobby exists
        const lobby = await Lobby.findByPk(lobbyId);
        if (!lobby) {
          console.log(`Lobby not found: ${socket.id}`);
          socket.emit("lobby-error", { message: "Lobby not found" });
          return;
        }

        // Check if the user is in the lobby
        const existingMembership = await LobbyUser.findOne({
          where: { userId, lobbyId: lobby.id }
        });
        if (existingMembership) {
          await existingMembership.update({ socketId: socket.id });
          io.to(lobby.socketId).emit(`lobby-send-players`, await getLobbyPlayers(lobby.id));
          socket.emit(`send-lobby-socket`, lobby.socketId);
          console.log(`User has joined the lobby: ${socket.id}`);
          return;
        }
      } catch (error) {
        console.error("Error joining lobby:", error);
        socket.emit("lobby-error", { message: "Error joining lobby" });
      }
    });

    socket.on("jump", async (data) => {
      const { userId, lobbySocket } = data;
      io.to(lobbySocket).emit(`jump-${userId}`);
    });

    socket.on("disconnect", async () => {
      console.log(`Client disconnected: ${socket.id}`);
      try {
        // Find the LobbyUser record associated with the disconnected socket
        const lobbyUser = await LobbyUser.findOne({ where: { socketId: socket.id } });

        if (lobbyUser) {
          // Store the lobbyId before deleting the record
          const { lobbyId } = lobbyUser;

          // Delete the LobbyUser record
          await LobbyUser.destroy({ where: { socketId: socket.id } });

          // Fetch the lobby to get its socketId
          const lobby = await Lobby.findByPk(lobbyId);
          if (lobby) {
            // Emit updated player list to all clients in the lobby
            io.to(lobby.socketId).emit(`lobby-send-players`, await getLobbyPlayers(lobby.id));
          }
        }
      } catch (error) {
        console.error("Error deleting lobby:", error);
      }
    });
  });

  return io;
}
