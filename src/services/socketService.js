const { Server } = require('socket.io');
const { verifyToken } = require('../utils/paseto');
const User = require('../models/User');

let io;
const userSockets = new Map();

const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL || 'http://localhost:5173',
            methods: ['GET', 'POST'],
            credentials: true
        }
    });
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) return next(new Error('Authentication error'));
            const payload = await verifyToken(token);
            socket.userId = payload.userId;
            next();
        } catch (err) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', async (socket) => {
        const userId = socket.userId.toString();
        if (!userSockets.has(userId)) {
            userSockets.set(userId, []);
            await User.findByIdAndUpdate(userId, { isOnline: true });
        }
        userSockets.get(userId).push(socket.id);

        console.log(`User ${userId} connected.`);
        io.emit('statusUpdate', { userId, isOnline: true });

        for (let [id, sockets] of userSockets.entries()) {
            if (id !== userId && sockets.length > 0) {
                socket.emit('statusUpdate', { userId: id, isOnline: true });
            }
        }

        socket.on('sendMessage', (data) => {
            const targetUser = data.receiverId || data.receiver?._id || data.receiver;
            if (targetUser) {
                sendRealTimeMessage(targetUser.toString(), data);
            }
        });
        socket.on('requestStatus', (data) => {
            const { targetUserId, requesterId } = data;
            const targetSockets = userSockets.get(targetUserId.toString());

            if (targetSockets && targetSockets.length > 0) {
                targetSockets.forEach(socketId => {
                    io.to(socketId).emit('getPresenceRequest', { requesterId });
                });
            }
        });

        socket.on('respondStatus', (data) => {
            const { requesterId, status, lastSeen } = data;
            const requesterSockets = userSockets.get(requesterId.toString());

            if (requesterSockets) {
                requesterSockets.forEach(socketId => {
                    io.to(socketId).emit('statusUpdate', {
                        userId: socket.userId,
                        isOnline: status,
                        lastSeen
                    });
                });
            }
        });

        socket.on('typing', (data) => {
            const targetSockets = userSockets.get(data.receiverId.toString());
            if (targetSockets) {
                targetSockets.forEach(socketId => io.to(socketId).emit('userTyping', data));
            }
        });

        socket.on('stopTyping', (data) => {
            const targetSockets = userSockets.get(data.receiverId.toString());
            if (targetSockets) {
                targetSockets.forEach(socketId => io.to(socketId).emit('userStoppedTyping', data));
            }
        });

        socket.on('disconnect', async () => {
            const userConnections = userSockets.get(userId);
            if (userConnections) {
                const updatedConnections = userConnections.filter(id => id !== socket.id);

                if (updatedConnections.length === 0) {
                    userSockets.delete(userId);
                    const now = new Date();

                    try {
                        await User.findByIdAndUpdate(userId, {
                            isOnline: false,
                            lastSeen: now
                        });
                        io.emit('statusUpdate', { userId, isOnline: false, lastSeen: now });
                        console.log(`User ${userId} is now offline.`);
                    } catch (err) {
                        console.error("Error updating last seen:", err);
                    }
                } else {
                    userSockets.set(userId, updatedConnections);
                }
            }
        });
    });

    return io;
};
const sendRealTimeMessage = (receiverId, messageData) => {
    if (!io) return;
    const targetSockets = userSockets.get(receiverId.toString());

    if (targetSockets) {
        targetSockets.forEach(socketId => {
            io.to(socketId).emit('receiveMessage', messageData);
            io.to(socketId).emit('new_inquiry', messageData);
        });
    }
};

const getIo = () => {
    if (!io) throw new Error('Socket.io not initialized!');
    return io;
};

module.exports = { initSocket, sendRealTimeMessage, getIo };