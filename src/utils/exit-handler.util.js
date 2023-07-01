import logger from "../configs/logger.config.js";
import ServerInfo from "./server-info.util.js";

const server = ServerInfo.getServer;

const exitHandler = () => {
  if (server) {
    logger.info("server is down");
    process.exit(1);
  } else {
    logger.info("something went wrong");
    process.exit(1);
  }
};

export default exitHandler;