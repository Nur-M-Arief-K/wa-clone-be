let onlineUsers = [];

export default function (socket, io) {
  // Users join or opens the app
  socket.on("join", (userId) => {
    socket.join(userId);
    // Add joined user to online users
    if (!onlineUsers.some((u) => u.userId == userId)) {
      onlineUsers.push({ userId: userId, socketId: socket.id });
    }
    // send online users to frontend
    io.emit("get-online-users", onlineUsers);
  });

  // Socket disconnect
  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => {
      return user.socketId !== socket.id;
    });
    console.log("A USER DISCONNECTED");
    io.emit("get-online-users", onlineUsers);
  });

  // Join a conversation room
  socket.on("join conversation", (conversationId) => {
    socket.join(conversationId);
  });

  // Send and receive message
  socket.on("send message", (message) => {
    const conversation = message.conversation;
    if (!conversation.users) return;
    conversation.users.forEach((user) => {
      if (user._id === message.sender._id) return;
      socket.in(user._id).emit("receive message", message);
    });
  });

  // Typing
  socket.on("typing", (conversationId) => {
    socket.in(conversationId).emit("typing", conversationId);
  });

  socket.on("stop typing", (conversationId) => {
    socket.in(conversationId).emit("stop typing");
  });
}
