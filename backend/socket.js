import { Server } from "socket.io";
import { User } from "./models/users.js";
import { Lobby, LobbyUser } from "./models/lobby.js";

// Generate a unique 4-digit code for lobby
const generateUniqueCode = async () => {
  let code;
  do {
    code = Math.floor(1000 + Math.random() * 9000);
  } while (await Lobby.findOne({ where: { id: code } })); // Assuming 'id' is used for the unique code
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
          socket.emit("error", "User not found");
          return;
        }

        // Check if user already has a lobby
        const existingLobby = await Lobby.findOne({ where: { userId } });
        if (existingLobby) {
          socket.emit("lobby-send-code", existingLobby.id);
          console.log(`Lobby found: ${existingLobby.id}`);
          return;
        }

        // Generate a unique 4-digit code
        const uniqueCode = await generateUniqueCode();

        // Create a new lobby with a unique 4-digit code
        const newLobby = await Lobby.create({ id: uniqueCode, userId });

        socket.emit("lobby-send-code", newLobby.id);
        console.log(`Lobby created: ${newLobby.id}`);
      } catch (error) {
        console.error("Error creating lobby:", error);
        socket.emit("error", "Failed to create lobby");
      }
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
}
