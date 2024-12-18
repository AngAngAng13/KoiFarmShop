import { Server } from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000'],
    methods: ["GET", "POST"]
  }
});

const userSocketmap = {}; // {userId: socketId}

// Function to get the receiver's socket ID
export const getReceiverSocketId = (receiverId) => {
  return userSocketmap[receiverId];
};

io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;
  
  if (userId !== "undefined") userSocketmap[userId] = socket.id;
  
  io.emit("getOnlineUsers", Object.keys(userSocketmap));

  socket.on('disconnect', () => {
    delete userSocketmap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketmap));
  });
});

// Export the server, app, and io instances
export { server, app, io };
