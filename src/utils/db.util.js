import mongoose from "mongoose";
import logger from "../configs/logger.config.js";

const mongoConnect = (MONGODB_CONNECT_URL) => {
  mongoose
    .connect(MONGODB_CONNECT_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      if (process.env !== "production") {
        mongoose.set("debug", true);
      }
      logger.info("connected to mongodb");
    });
};

export default mongoConnect;
