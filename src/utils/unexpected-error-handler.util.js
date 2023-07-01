import logger from "../configs/logger.config.js";
import exitHandler from "./exit-handler.util.js";

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

export default unexpectedErrorHandler;