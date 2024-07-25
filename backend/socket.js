import { Server } from "socket.io";
import { User } from "./models/users.js";
import { Lobby, LobbyUser } from "./models/lobby.js";

// Generate a unique 4-digit code for lobby
const generateUniqueCode = async () => {
  let code;
  do {
    code = Math.floor(1000 + Math.random() * 9000);
  } while (await Lobby.findOne({ where: { id: code } }));
  return code;
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

    socket.on("lobby-create", async (userId) => {
      try {
        // Check if user exists
        const user = await User.findByPk(userId);
        if (!user) {
          return;
        }

        // Check if user already has a lobby
        const existingLobby = await Lobby.findOne({ where: { userId } });
        if (existingLobby) {
          // Update the socketId with the new socket.id
          await existingLobby.update({ socketId: socket.id });
          socket.emit(`lobby-send-code-${userId}`, existingLobby.id);
          console.log(`Lobby found: ${existingLobby.id}`);
          return;
        }

        // Generate a unique 4-digit code
        const uniqueCode = await generateUniqueCode();

        // Create a new lobby with a unique 4-digit code
        const newLobby = await Lobby.create({ id: uniqueCode, userId, socketId: socket.id });

        socket.emit(`lobby-send-code-${userId}`, newLobby.id);
        console.log(`Lobby created: ${newLobby.id}`);
      } catch (error) {
        console.error("Error creating lobby:", error);
      }
    });

    socket.on("lobby-join", async (data) => {
      try {
        const userId = data.userId;
        const lobbyId = data.lobbyId;

        // Check if user exists
        const user = await User.findByPk(userId);
        if (!user) {
          console.log(`User not found: ${socket.id}`);
          return;
        }

        // Check if lobby exists
        const lobby = await Lobby.findOne({ where: { id: lobbyId } });
        if (!lobby) {
          console.log(`Lobby not found: ${socket.id}`);
          return;
        }

        // Check if the lobby is full
        const userCount = await LobbyUser.count({ where: { lobbyId: lobby.id } });
        if (userCount >= 4) {
          console.log(`Lobby full: ${socket.id}`);
          return;
        }

        // Check if the user is already in the lobby
        const existingMembership = await LobbyUser.findOne({
          where: { userId, lobbyId: lobby.id }
        });
        if (existingMembership) {
          await existingMembership.update({ socketId: socket.id });
          console.log(`User already joined lobby: ${socket.id}`);
          return;
        }

        await LobbyUser.create({ userId, lobbyId: lobby.id, socketId: socket.id });
        socket.emit(`lobby-send-player-${lobbyId}`, {
          userId: user.id,
          userName: user.name
        });
        console.log(`User joined lobby: ${socket.id}`);
      } catch (error) {
        console.error("Error joining lobby:", error);
      }
    });

    socket.on("disconnect", async () => {
      console.log(`Client disconnected: ${socket.id}`);
      try {
        await LobbyUser.destroy({ where: { socketId: socket.id } });
      } catch (error) {
        console.error("Error deleting lobby:", error);
      }
    });
  });

  return io;
}
