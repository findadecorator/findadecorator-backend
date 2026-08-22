"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initRealtime = initRealtime;
exports.emitEvent = emitEvent;
const socket_io_1 = require("socket.io");
let io = null;
function initRealtime(httpServer) {
    io = new socket_io_1.Server(httpServer, {
        cors: { origin: "*" }
    });
    io.on("connection", (socket) => {
        socket.on("join", ({ userId, conversationId }) => {
            if (userId)
                socket.join(`user:${userId}`);
            if (conversationId)
                socket.join(`conversation:${conversationId}`);
            socket.emit("join:ack", { userId, conversationId });
        });
        socket.on("leave", ({ conversationId }) => {
            if (conversationId) {
                socket.leave(`conversation:${conversationId}`);
            }
        });
    });
}
function emitEvent(room, event, payload) {
    if (!io) {
        return;
    }
    io.to(room).emit(event, payload);
}
