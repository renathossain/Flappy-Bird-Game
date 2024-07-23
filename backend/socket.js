import { Server } from "socket.io";

export default function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*", // Allow all origins (for development purposes)
      methods: ["GET", "POST"], // Allow only GET and POST requests
    },
    transports: ['websocket', 'polling'], // Allow WebSocket and HTTP polling transport
    allowEIO3: true, // Allow connections from clients using EIO 3
  });

  // Socket.IO connection handling
  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on("jump", (username) => {
      io.emit(`jump-${username}`);
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
}
