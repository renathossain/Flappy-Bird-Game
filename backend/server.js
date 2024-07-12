// server.js

import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: "*", // Allow all origins (for development purposes)
        methods: ["GET", "POST"], // Allow only GET and POST requests
    },
    transports: ['websocket', 'polling'], // Allow WebSocket and HTTP polling transport
    allowEIO3: true, // Allow connections from clients using EIO 3
});


io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on("jump", (jumpName) => {
        console.log(`Jumping ${jumpName}`);
        io.emit(`jump-${jumpName}`);
    });

    socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

httpServer.listen(3000, () => {
    console.log("Backend server running on port 3000");
});
