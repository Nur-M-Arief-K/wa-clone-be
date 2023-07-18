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

    // send socket id
    io.emit("setup socket", socket.id);
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

  // User call
  socket.on("call user", (data) => {
    const userToCall = data.userToCall;
    const userToCallSocketId = onlineUsers.find((user) => user.userId == userToCall);
    io.to(userToCallSocketId?.socketId).emit("call user", {
      // Send back caller's information
      signal: data.signal,
      from: data.from,
      name: data.name,
      picture: data.picture,
    });
  });

  //---answer call
  socket.on("answer call", (data) => {
    io.to(data.to).emit("call accepted", data.signal);
  });

  //---end call
  socket.on("end call", (receiverSocketId) => {
    io.to(receiverSocketId).emit("end call");
  });
}
