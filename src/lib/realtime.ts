import { Server as HttpServer } from "http";
import { Server } from "socket.io";

let io: Server | null = null;

export function initRealtime(httpServer: HttpServer) {
  io = new Server(httpServer, {
    cors: { origin: "*" }
  });

  io.on("connection", (socket) => {
    socket.on("join", ({ userId, conversationId }) => {
      if (userId) socket.join(`user:${userId}`);
      if (conversationId) socket.join(`conversation:${conversationId}`);
      socket.emit("join:ack", { userId, conversationId });
    });
    socket.on("leave", ({ conversationId }) => {
      if (conversationId) {
        socket.leave(`conversation:${conversationId}`);
      }
    });
  });
}

export function emitEvent(room: string, event: string, payload: unknown) {
  if (!io) {
    return;
  }
  io.to(room).emit(event, payload);
}

