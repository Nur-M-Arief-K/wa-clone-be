import "dotenv/config";
// Server
import app from "./app.js";
import ServerInfo from "./utils/server-info.util.js";
// DB
import mongoose from "mongoose";
import mongoConnect from "./utils/db.util.js";
// Socket-io
import { Server } from "socket.io";
import SocketServer from "./SocketServer.js";
// utils
import logger from "./configs/logger.config.js";
import unexpectedErrorHandler from "./utils/unexpected-error-handler.util.js";
import exitHandler from "./utils/exit-handler.util.js";

const { PORT, MONGODB_CONNECT_URL, CLIENT_ENDPOINT } = process.env;

// exit on mongodb error
mongoose.connection.on("error", (error) => {
  logger.error(`mongodb is refused to connect ${error}`);
  process.exit(1);
});

mongoConnect(MONGODB_CONNECT_URL);

const server = app.listen(PORT, () => {
  logger.info(`server is listening to port ${PORT}...`);
});

ServerInfo.setServer = server;

const io = new Server(server, {
  pingTimeout: 60 * 1000, // 60k ms or 1 minute
  cors: CLIENT_ENDPOINT,
});

io.on("connection", (socket) => {
  logger.info("socket io connected successfully");
  SocketServer(socket, io);
});

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);
process.on("SIGTERM", exitHandler);
