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
        if (existingLobby && existingLobby.socketId === "") {
          // Update the socketId with the new socket.id
          await existingLobby.update({ socketId: socket.id });

          // Fetch all players in the existing lobby
          const players = await getLobbyPlayers(existingLobby.id);

          // Emit `send-lobby-socket` event to each player in the lobby
          players.forEach(player => {
            io.to(player.socketId).emit('send-lobby-socket', existingLobby.socketId);
          });

          socket.emit(`lobby-authorize`, true);
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

        // Check if user exists
        const user = User.findByPk(userId);
        if (!user) {
          console.log(`User not found: ${socket.id}`);
          socket.emit("lobby-error", { message: "User not found" });
          return;
        }

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
        if (existingMembership && existingMembership.socketId === "") {
          await existingMembership.update({ socketId: socket.id });
          io.to(lobby.socketId).emit(`lobby-send-players`, await getLobbyPlayers(lobby.id));
          socket.emit(`send-lobby-socket`, lobby.socketId);
          console.log(`User has joined the lobby: ${socket.id}`);
          return;
        }

        // Add the user to the lobby
        await LobbyUser.create({ userId, lobbyId: lobby.id, socketId: socket.id });
        io.to(lobby.socketId).emit(`lobby-send-players`, await getLobbyPlayers(lobby.id));
        socket.emit(`send-lobby-socket`, lobby.socketId);
        console.log(`User joined lobby: ${socket.id}`);
      } catch (error) {
        console.error("Error joining lobby:", error);
        socket.emit("lobby-error", { message: "Error joining lobby" });
      }
    });

    socket.on("lobby-dstroy", async (lobbyId) => {
      try {
        const lobby = await Lobby.findByPk(lobbyId);

        // Check if lobby exists
        if (!lobby) {
          return;
        }

        // Fetch all players in the existing lobby
        const players = await getLobbyPlayers(lobby.id);

        // Emit `send-lobby-socket` event to each player in the lobby
        players.forEach(player => {
          io.to(player.socketId).emit('send-lobby-socket', "");
        });

        // Clear users from the lobby
        await LobbyUser.destroy({ where: { lobbyId } });

        // Delete the lobby
        await Lobby.destroy({ where: { id: lobbyId } });
      } catch (error) {
        console.error("Error deleting lobby:", error);
      }
    });

    socket.on("jump", async (data) => {
      const { userId, lobbySocket } = data;
      io.to(lobbySocket).emit(`jump-${userId}`);
    });

    socket.on("change-skin", async (userId) => {
      // Find the lobby of the user
      const lobbyUser = await LobbyUser.findOne({
        where: { userId }
      });

      if (lobbyUser) {
        // Obtain the lobby's socketId
        const lobby = await Lobby.findByPk(lobbyUser.lobbyId);
        if (lobby) {
          // Update the player list
          io.to(lobby.socketId).emit(`lobby-send-players`, await getLobbyPlayers(lobby.id));
        }
      }
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

        // Delete lobby due to inactivity
        const lobby = await Lobby.findOne({ where: { socketId: socket.id } });
        if (lobby) {
          // Clear the socketId of destroyed lobby
          await lobby.update({ socketId: "" });

          // Check how many current users are in the lobby
          const userCount = await LobbyUser.count({ where: { lobbyId: lobby.id } });

          // If no users are left, start a 5-second delay
          if (userCount === 0) {
            setTimeout(async () => {
              // Recheck if the lobby's socketId is still empty and if there are still no users
              const updatedLobby = await Lobby.findByPk(lobby.id);
              if (updatedLobby && updatedLobby.socketId === "") {
                // Delete the lobby if it still meets the conditions
                await Lobby.destroy({ where: { id: lobby.id } });
                console.log(`Lobby ${lobby.id} deleted due to inactivity.`);
              }
            }, 5000); // 5-second delay
          }
        }

      } catch (error) {
        console.error("Error deleting lobby:", error);
      }
    });
  });

  return io;
}
