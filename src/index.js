import "dotenv/config";
import mongoose from "mongoose";
import app from "./app.js";
import logger from "./configs/logger.config.js";
import unexpectedErrorHandler from "./utils/unexpected-error-handler.util.js";
import exitHandler from "./utils/exit-handler.util.js";
import mongoConnect from "./utils/db.util.js";
import ServerInfo from "./utils/server-info.util.js";

const { PORT, MONGODB_CONNECT_URL } = process.env;

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

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);
process.on("SIGTERM", exitHandler);
